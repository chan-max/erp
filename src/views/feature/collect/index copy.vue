<template>
  <div class="p-4">
    <div class="py-4 flex justify-end gap-4 items-center">
      <a-button type="primary" @click="handleHotProduct()"> 热销品采集 </a-button>
      <a-button type="primary" @click="handleCrawler()"> 网络爬图 </a-button>
      <a-button type="primary" @click="handleAiGenerate()"> AI 生图 </a-button>
      <div style="flex: 1"></div>

      <form-item label="排序方式">
        <a-select
          v-model:value="queryParams.sortType"
          style="width: 160px"
          :options="sortTypeOptions"
          @change="getList"
        ></a-select>
      </form-item>

      <a-button type="default" @click="handleMultiDownload(null)">
        批量下载 ({{ ids.length }})
      </a-button>

      <a-button type="primary" @click="multipleCheckClick">
        批量入库({{ ids.length }})
      </a-button>
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
            <a-button
              v-if="row.checkType == 0"
              type="link"
              @click="checkClick(row)"
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
      title="网络爬图"
      :visible.sync="crawlerDialogVisible"
      width="600px"
      @cancel="crawlerDialogCancel"
      :closable="true"
      centered
    >
      <a-form
        v-if="materialConfig.crawlerWebsite.length"
        :model="crawlerForm"
        :rules="crawlerRules"
        ref="crawlerFormRef"
        size="middle"
        :labelCol="{ style: { width: '80px' } }"
      >
        <a-row :gutter="[0, 0]">
          <!-- 用户名 -->
          <a-col :span="24">
            <a-form-item label="目标网站" name="type">
              <a-select
                v-model:value="crawlerForm.type"
                :options="materialConfig.crawlerWebsite"
                placeholder="请选择目标网站"
              ></a-select>
            </a-form-item>
          </a-col>

          <a-col :span="12" v-if="isCrawlerOperationUsable('searchContent')">
            <a-form-item label="搜索词" name="searchContent">
              <a-input
                type="textarea"
                v-model:value="crawlerForm.searchContent"
                placeholder="请输入搜索词"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12" v-if="isCrawlerOperationUsable('likedCount')">
            <a-form-item label="点赞量" name="likedCount">
              <a-input
                v-model:value="crawlerForm.likedCount"
                type="number"
                step="100"
                min="0"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12" v-if="isCrawlerOperationUsable('downloadCount')">
            <a-form-item label="下载量" name="downloadCount">
              <a-input
                step="10"
                min="0"
                type="number"
                v-model:value="crawlerForm.downloadCount"
                placeholder="数量"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12" v-if="isCrawlerOperationUsable('category')">
            <a-form-item label="所属类目" name="category">
              <a-select
                v-model:value="crawlerForm.category"
                :options="categoryOptions"
                placeholder="请选择数据来源"
              ></a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <div v-else class="flex items-center justify-center">暂无可爬取网站...</div>

      <template #footer>
        <a-button @click="crawlerDialogVisible = false">取消</a-button>
        <a-button type="primary" @click="doCrawler" :loading="crawlerLoading">{{
          crawlerLoading ? "正在爬取图片，请稍等" : "确定"
        }}</a-button>
      </template>
    </a-modal>

    <a-modal
      title="热销品采集"
      :visible.sync="hotProductModalVisible"
      width="600px"
      :closable="true"
      @cancel="hotProductModalCancel"
      centered
    >
      <a-form
        :model="crawlerForm"
        :rules="crawlerRules"
        ref="crawlerFormRef"
        size="middle"
        :labelCol="{ style: { width: '80px' } }"
      >
        <a-row :gutter="[0, 0]">
          <!-- 数据来源 -->
          <a-col :span="24">
            <a-form-item label="数据来源" name="dataSource">
              <a-select
                v-model:value="crawlerForm.dataSource"
                :options="dataSourceOptions"
                placeholder="请选择数据来源"
              ></a-select>
            </a-form-item>
          </a-col>

          <!-- 总销量 -->
          <a-col :span="12">
            <a-form-item label="总销量" name="totalSales">
              <a-input
                v-model:value="crawlerForm.totalSales"
                type="number"
                step="100"
                min="0"
              />
            </a-form-item>
          </a-col>

          <!-- 类目 -->
          <a-col :span="12">
            <a-form-item label="类目" name="category">
              <a-select
                v-model:value="crawlerForm.category"
                :options="categoryOptions"
                placeholder="请选择类目"
              ></a-select>
            </a-form-item>
          </a-col>

          <!-- 谷歌识图 -->
          <a-col :span="12">
            <a-form-item label="谷歌识图" name="googleImageSearch">
              <a-radio-group v-model:value="crawlerForm.googleImageSearch">
                <a-radio :value="true">开启</a-radio>
                <a-radio :value="false">关闭</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>

          <!-- 一键抠图 -->
          <a-col :span="12">
            <a-form-item label="一键抠图" name="autoCutout">
              <a-radio-group v-model:value="crawlerForm.autoCutout">
                <a-radio :value="true">开启</a-radio>
                <a-radio :value="false">关闭</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <template #footer>
        <!-- <a-button @click="resetForm">重置</a-button> -->
        <a-button @click="hotProductModalVisible = false">取消</a-button>
        <a-button type="primary" @click="doCrawler" :loading="crawlerLoading">{{
          crawlerLoading ? "正在处理数据，请稍等" : "确定"
        }}</a-button>
      </template>
    </a-modal>

    <a-modal
      title="AI 生图"
      :visible.sync="aiGenerateVisible"
      @cancel="aiGenerateModalCancel"
      width="600px"
      :closable="true"
      centered
    >
      <div class="flex items-center justify-center">开发中...</div>

      <template #footer>
        <a-button @click="aiGenerateVisible = false">取消</a-button>
        <a-button type="primary" @click="doCrawler" :loading="crawlerLoading">{{
          crawlerLoading ? "正在爬取图片，请稍等" : "确定"
        }}</a-button>
      </template>
    </a-modal>

    <a-modal
      title="素材入库"
      :visible.sync="materialCheckModalVisible"
      @cancel="materialCheckModalCancel"
      width="400px"
      :closable="true"
      centered
    >
      <!-- <div class="flex items-center justify-center">开发中...</div> -->
      <a-form size="middle" :labelCol="{ style: { width: '80px' } }">
        <a-row :gutter="[0, 0]">
          <!-- 类目 -->
          <a-col :span="24">
            <a-form-item label="起始序号" name="materialOrder">
              <a-input v-model:value="materialOrder" placeholder="非必填"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <template #footer>
        <a-button @click="materialCheckModalVisible = false">取消</a-button>
        <a-button type="primary" @click="ensureCheck"> 确定入库 </a-button>
      </template>
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
import { useLocalStorage } from "@vueuse/core";
import { sortTypeOptions } from "/@/common/sort";
import { saveAs } from "file-saver";
import { message, Modal, notification } from "ant-design-vue";
import { useUserStore } from "/@/store/modules/user";
import imgCard from "./imgCard.vue";
import listUpload from "./listUpload.vue";
import { materialConfig, getMaterialConfig, categoryOptions } from "./index";
import { useWindowSize } from "@vueuse/core";

getMaterialConfig();

const materialOrder = ref();

function isCrawlerOperationUsable(key) {
  let item = materialConfig.value.crawlerWebsite.find((item) => {
    return item.value == crawlerForm.value.type;
  });

  if (!item) {
    return false;
  }

  return item.operation[key];
}

const queryParams = reactive({
  current: 1,
  size: 15,
  sortType: 1,
  checkType: 0,
});

const checkTypeOptions = ref([
  {
    label: "全部",
    value: null,
  },
  {
    label: "已确认",
    value: 1,
  },
  {
    label: "未确认",
    value: 0,
  },
]);

// 展示模式
const picMode = useLocalStorage("material_view_mode", false);

watch(picMode, () => {
  ids.value = [];
});

const materialCheckModalVisible = ref(false);

function materialCheckModalCancel() {
  materialCheckModalVisible.value = false;
}

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
  websiteName: "",
});

const crawlerFormRef = ref();
const crawlerLoading = ref(false);

const crawlerRules = {
  searchContent: [{ required: true, message: "请输入搜索词", trigger: "blur" }],
  tyoe: [{ required: true, message: "请选择目标网站", trigger: "blur" }],
  downloadCount: [{ required: true, message: "请输入下载数量", trigger: "blur" }],
  likedCount: [{ required: true, message: "请输入点赞数量", trigger: "blur" }],
};

function getOriginWebLabel(value) {
  let item = materialConfig.value.crawlerWebsite.find((item) => {
    return item.value == value;
  });

  if (item) {
    return item.label;
  }

  return "--";
}

const crawlerDialogVisible = ref(false);
function handleCrawler() {
  crawlerDialogVisible.value = true;
}

async function doCrawler() {
  await crawlerFormRef.value.validate();
  crawlerLoading.value = true;

  let info = materialConfig.value.crawlerWebsite.find((item) => {
    return item.value == crawlerForm.value.type;
  });
  crawlerForm.value.websiteName = info.label;
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

const hotProductModalVisible = ref(false);
function handleHotProduct() {
  hotProductModalVisible.value = true;
}

function hotProductModalCancel() {
  hotProductModalVisible.value = false;
}

const aiGenerateVisible = ref(false);
function handleAiGenerate() {
  aiGenerateVisible.value = true;
}

function aiGenerateModalCancel() {
  aiGenerateVisible.value = false;
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

const isMultipleCheck = ref(true);

// 单个入库
function checkClick(row) {
  currentRow.value = row;
  isMultipleCheck.value = false;
  materialCheckModalVisible.value = true;
  // handleCheck([row.id], 1)
}

function multipleCheckClick() {
  isMultipleCheck.value = true;
  if (!ids.value.length) {
    return message.warn("请选择需要处理的数据");
  }

  materialCheckModalVisible.value = true;
}

// 确认如入库
function ensureCheck() {
  if (isMultipleCheck.value) {
    handleCheck([...ids.value], 1);
  } else {
    if (!currentRow.value?.id) {
      return;
    }
    handleCheck([currentRow.value.id], 1);
  }
}

async function handleCheck(ids, checkValue) {
  await checkAssetLibrary({
    assetIdList: ids,
    checkType: checkValue,
    order: materialOrder.value,
  })
    .catch((e) => {
      message.error("操作失败");
    })
    .then((e) => {
      message.success("操作成功");
      materialCheckModalVisible.value = false;
      getList();
    })
    .finally(() => {
      materialCheckModalVisible.value = false;
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
