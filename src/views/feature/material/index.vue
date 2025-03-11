<template>
  <div class="p-4">
    <div class="py-4 flex justify-end gap-4 items-center">
      <a-button type="primary" @click="handleUpload()"> 上传 </a-button>
      <!-- <a-button type="primary" @click="handleCrawler()"> 网络爬图 </a-button> -->
      <div style="flex: 1"></div>

      <form-item label="排序方式">
        <a-select
          v-model:value="queryParams.sortType"
          style="width: 160px"
          :options="sortTypeOptions"
          @change="getList"
        ></a-select>
      </form-item>

      <!-- <span class="table-form-item-label">图片状态</span>
      <a-select
        v-model:value="queryParams.checkType"
        style="width: 120px"
        :options="checkTypeOptions"
        @change="getList"
      ></a-select> -->

      <a-button type="default" @click="handleMultiDownload(null)">
        批量下载 ({{ ids.length }})
      </a-button>

      <a-button type="primary" @click="handleMultipleCheck(1)">
        制作套图({{ ids.length }})
      </a-button>

      <!-- <a-button type="primary" @click="handleMultipleCheck(1)">
        批量入库({{ ids.length }})
      </a-button> -->
      <a-button type="warning" @click="handleMultipleCheck(0)">
        取消入库 ({{ ids.length }})</a-button
      >
      <a-button type="danger" @click="handleDelete(null)">
        批量删除({{ ids.length }})
      </a-button>
    </div>

    <div class="flex justify-end py-2">
      <a-switch v-model:checked="picMode">
        <template #checkedChildren>网格</template>
        <template #unCheckedChildren> 列表</template>
      </a-switch>
    </div>

    <div v-if="!picMode" class="common-table">
      <vxe-grid
        v-bind="gridOptions"
        :data="dataSource"
        :loading="loading"
        @checkbox-change="checkboxChange"
        @checkbox-all="checkboxAllChange"
      >
        <template #previewDefaultSlot="{ row }">
          <div class="flex items-center justify-center p-2">
            <a-image
              @load="imgLoad"
              :width="120"
              style="width: 160px; object-fit: contain"
              :src="row.minioPath"
            />
          </div>
        </template>

        <template #originWebDefaultSlot="{ row }">
          {{ getOriginWebLabel(row.originWeb) }}
        </template>

        <template #checkTypeDefaultSlot="{ row }">
          <div>
            <a-tag :color="row.checkType == 1 ? 'success' : 'error'">
              {{ row.checkType == 1 ? "已入库" : "未入库" }}
            </a-tag>
          </div>
        </template>

        <template #operationDefaultSlot="{ row }">
          <div class="table-operation-column">
            <a-button size="small" type="link" @click="handleTransProduct(row)">
              制作套图
            </a-button>

            <a-button
              v-if="row.checkType == 0"
              type="link"
              @click="handleCheck([row.id], 1)"
              size="small"
            >
              入库
            </a-button>
            <a-button
              v-if="row.checkType == 1"
              type="link"
              @click="handleCheck([row.id], 0)"
              size="small"
            >
              取消入库
            </a-button>
            <a-button type="link" @click="handleDownload(row)" size="small">
              下载
            </a-button>
            <a-button type="link" @click="handleDelete(row)" danger size="small">
              删除
            </a-button>
          </div>
        </template>

        <template #searchKeyDefaultSlot="{ row }">
          <a-tag> {{ row.searchKey }} </a-tag>
        </template>
      </vxe-grid>
    </div>

    <div v-else class="pic-view flex justify-center gap-2 flex-wrap">
      <template v-if="loading">
        <div class="w-full h-8 flex justify-center"><a-spin> </a-spin></div>
      </template>

      <template v-else>
        <img-card
          v-for="info in dataSource"
          :info="info"
          :ids="ids"
          @check="imgCardCheck"
          @delete="imgCardDelete"
          @checkType="imgCardCheckType"
        ></img-card>
      </template>
    </div>

    <!-- 分页 -->
    <div class="py-4 flex justify-end">
      <a-pagination
        size="small"
        :show-total="(total) => `共 ${total} 条`"
        show-size-changer
        :current="queryParams.current"
        :total="total"
        :pageSize="queryParams.size"
        @change="handlePaginationChange"
      />
    </div>

    <a-modal
      v-model:visible="uploadModalVisible"
      title="素材上传"
      width="100%"
      wrap-class-name="full-modal"
      :footer="false"
    >
      <list-upload></list-upload>
    </a-modal>

    <a-modal
      v-model:visible="transProductModalVisible"
      title="制作套图"
      width="600px"
      :footer="false"
    >
      <a-form
        :model="form"
        :rules="rules"
        ref="formRef"
        size="middle"
        :labelCol="{ style: { width: '80px' } }"
      >
        <a-row :gutter="[16, 40]">
          <a-col :span="24">
            <a-form-item label="标签名" name="name">
              <a-input v-model:value="transProductForm.name" placeholder="请输入标签名" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="tsx">
import {
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  watch,
  handleError,
  watchEffect,
} from "vue";
import { usePagination } from "vue-request";

import { getUserList, addUser, deleteUser, updateUser } from "/@/api/sys/user"; // 实际接口导入
import {
  getAssetLibrary,
  deleteAssetLibrary,
  checkAssetLibrary,
  pullAsset,
} from "/@/api/sys/feature"; // 实际接口导入
import { getRoleLabel, getRoleColor, roleConfig } from "/@/common/user";
import { commonGridOptions } from "/@/common/table";
import { formatTimeFromTimeArray } from "/@/common/date";
import CryptoJS from "crypto-js";
import { pwdKey } from "/@/enums/config";
import { useLocalStorage, useWindowSize } from "@vueuse/core";
import { sortTypeOptions } from "/@/common/sort";
import { saveAs } from "file-saver";
import { message, Modal, notification } from "ant-design-vue";
import { useUserStore } from "/@/store/modules/user";
import imgCard from "./imgCard.vue";
import listUpload from "./listUpload.vue";

const queryParams = reactive({
  current: 1,
  size: 15,
  sortType: 2, // 更新时间降序
  checkType: 1,
});

const checkTypeOptions = ref([
  {
    label: "全部",
    value: null,
  },
  {
    label: "已入库",
    value: 1,
  },
  {
    label: "未入库",
    value: 0,
  },
]);

// 展示模式
const picMode = useLocalStorage("material_view_mode", false);

watch(picMode, () => {
  ids.value = [];
});

const gridOptions = ref({
  ...commonGridOptions,
  columns: [
    { type: "checkbox", width: 50, ellipsis: true },
    // { title: "ID", field: "id", width: 60, ellipsis: true },
    {
      title: "图片预览",
      field: "minioPath",
      width: "auto",

      slots: {
        default: "previewDefaultSlot",
      },
    },
    { title: "图片名称", field: "imageName", minWidth: 180, className: "font-bold" },
    { title: "分辨率", field: "resolution", width: 80 },
    {
      title: "图片来源",
      field: "originWeb",
      width: 120,
      slots: {
        default: "originWebDefaultSlot",
      },
    },
    {
      title: "搜索词",
      field: "searchKey",
      minWidth: 240,
      slots: {
        default: "searchKeyDefaultSlot",
      },
    },
    {
      title: "状态",
      field: "checkType",
      slots: {
        default: "checkTypeDefaultSlot",
      },
      minWidth: 120,
    },
    {
      title: "创建时间",
      field: "createTime",
      width: 150,
      ellipsis: true,
      formatter: (e) => {
        return formatTimeFromTimeArray(e.cellValue);
      },
    },
    {
      title: "修改时间",
      field: "updateTime",
      width: 150,
      ellipsis: true,
      formatter: (e) => {
        return formatTimeFromTimeArray(e.cellValue);
      },
    },
    {
      title: "操作",
      fixed: "right",
      width: "auto",
      field: "operation",
      slots: {
        default: "operationDefaultSlot",
      },
    },
  ],
  rowClassName(p) {
    if (p.row.checkType == 0) {
      return "material-row-no-check";
    }
  },
});

const { height } = useWindowSize();

watchEffect(() => {
  gridOptions.value.height = height.value - 280;
});

const dataSource = ref([]);
const loading = ref(false);
const open = ref(false);
const title = ref("新增角色");
const ids = ref([]);
const single = ref(false);
const multiple = ref(true);
const total = ref(0);
const formRef = ref();
const dialogTitle = ref("");
const dialogVisible = ref(false);
const isEdit = ref(true);
const currentRow = ref({});
const submitLoading = ref(false);

const crawlerForm = ref({
  searchContent: "",
  downloadCount: 10,
  likedCount: 0,
  type: 2,
});

const crawlerFormRef = ref();
const crawlerLoading = ref(false);

const typeOptions = ref([
  {
    label: "pinterest",
    value: 1,
  },
  {
    label: "deviantrat",
    value: 2,
  },
]);

const crawlerRules = {
  searchContent: [{ required: true, message: "请输入搜索词", trigger: "blur" }],
  tyoe: [{ required: true, message: "请选择目标网站", trigger: "blur" }],
  downloadCount: [{ required: true, message: "请输入下载数量", trigger: "blur" }],
  likedCount: [{ required: true, message: "请输入点赞数量", trigger: "blur" }],
};

function getOriginWebLabel(value) {
  return typeOptions.value.find((item) => item.value == value)?.label;
}

const transProductModalVisible = ref(false);

function handleTransProduct(row) {
  transProductModalVisible.value = true;
}

// 处理上传

const uploadModalVisible = ref(false);

function handleUpload() {
  uploadModalVisible.value = true;
}

const crawlerDialogVisible = ref(false);
function handleCrawler() {
  crawlerDialogVisible.value = true;
}

// 选择模板
const transProductForm = ref({});

async function doCrawler() {
  await crawlerFormRef.value.validate();
  crawlerLoading.value = true;

  await pullAsset({
    ...crawlerForm.value,
  })
    .finally(() => {
      crawlerLoading.value = false;
    })
    .catch((e) => {
      message.error("图片爬取失败");
    })
    .then(() => {
      crawlerDialogVisible.value = false;
      message.loading("图片正在爬取中，请稍等", 0);
    });
}

async function getList() {
  loading.value = true;
  let res = await getAssetLibrary({
    ...queryParams,
  }).finally(() => {
    loading.value = false;
  });

  dataSource.value = res.records;
  total.value = res.total;
  ids.value = [];
}

function imgCardDelete(row) {
  handleDelete(row);
}

function imgCardCheckType(row, checkType) {
  handleSimgleCheck(row, checkType);
}

function imgCardCheck(id, isChecked) {
  console.log(id, isChecked);
  if (isChecked) {
    // 如果 isChecked 为 true，且 id 不在 ids 中，才添加 id
    if (!ids.value.includes(id)) {
      ids.value.push(id);
    }
  } else {
    // 如果 isChecked 为 false，从 ids 中删除 id
    ids.value = ids.value.filter((item) => item !== id);
  }
}

getList();

// 操作函数
function handleQuery() {
  queryParams.current = 1;
}

function resetQuery() {
  getList();
}

// 批量下载
function handleMultiDownload() {
  if (!ids.value.length) {
    return message.warning("请选择要下载的数据");
  }

  // 处理图片下载
  try {
    ids.value.forEach((id) => {
      let row = dataSource.value.find((item) => {
        return item.id == id;
      });

      if (!row) {
        return;
      }
      saveAs(row.minioPath, row.imageName);
      notification.success({
        placement: "topRight",
        description: `图片${row.imageName}下载成功`,
      });
    });
  } catch (e) {}
}

function crawlerDialogCancel() {
  crawlerDialogVisible.value = false;
}

function handleSimgleCheck(row, checkType) {
  handleCheck([row.id], checkType);
}

function handleMultipleCheck(checkType) {
  if (!ids.value.length) {
    return message.warn("请选择需要处理的数据");
  }
  handleCheck([...ids.value], checkType);
}

async function handleCheck(ids, checkValue) {
  await checkAssetLibrary({
    assetIdList: ids,
    checkType: checkValue,
  })
    .catch((e) => {
      message.error("操作失败");
    })
    .then((e) => {
      message.success("操作成功");
      getList();
    });
}

function handleDelete(row?) {
  let delIds: any = null;
  if (row) {
    delIds = [row.id];
  } else {
    delIds = [...ids.value];
    if (!delIds.length) {
      return message.warn("请选择要删除的数据");
    }
  }
  Modal.confirm({
    title: "删除提示",
    content: "确认删除该数据吗",
    okText: "确认",
    okType: "danger",
    cancelText: "取消",
    centered: true,
    async onOk() {
      delIds = delIds.map((id) => String(id));
      await deleteAssetLibrary({ assetIdList: delIds });
      message.success("删除成功");
      getList();
    },
  });
}

function handlePaginationChange(current, size) {
  queryParams.current = current;
  queryParams.size = size;
  getList();
}

function imgLoad() {}

function checkboxChange(e) {
  ids.value = e.records.map((item) => item.id);
}

function handleDownload(row) {
  // 处理图片下载
  try {
    saveAs(row.minioPath, row.imageName);

    notification.success({
      placement: "topRight",
      description: `图片${row.imageName}下载成功`,
    });
  } catch (e) {}
}

function checkboxAllChange(e) {
  ids.value = e.records.map((item) => item.id);
}

function wsHandler(data) {
  if (data["notifyGroup"] === "crawler_group") {
    if (data["notifyType"] === "change_crawler") {
      message.destroy();
      if (data["notifyData"] == "true") {
        notification.success({
          message: "图片爬取成功",
        });
        getList();
      } else {
        notification.error({
          message: "图片爬取失败",
        });
      }
    }
  }
}

const userStore = useUserStore();

onMounted(() => {
  userStore.ws.onMessage(wsHandler);
});

onUnmounted(() => {
  userStore.ws.offMessage(wsHandler);
});
</script>

<style scoped>
.table-header {
  border-radius: 4px;
  box-shadow: rgba(17, 17, 26, 0.15) 0px 1px 0px;
}

h1 {
  font-size: 1rem;
}
</style>

<style>
.material-row-no-check {
  background-color: rgba(255, 0, 0, 0.1);
}

.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
    height: calc(100% - 200px);
  }
}
</style>
