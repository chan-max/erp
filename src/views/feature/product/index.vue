<template>
  <div class="p-4">
    <div class="py-4 flex justify-end gap-4 items-center">
      <div style="flex: 1"></div>

      <span class="table-form-item-label">排序方式</span>
      <a-select
        v-model:value="queryParams.sortType"
        style="width: 160px"
        :options="sortTypeOptions"
        @change="getList"
      ></a-select>

      <span class="table-form-item-label">图片状态</span>
      <a-select
        v-model:value="queryParams.checkType"
        style="width: 120px"
        :options="checkTypeOptions"
        @change="getList"
      ></a-select>

      <a-button type="default" @click="handleMultiDownload(null)">
        批量下载 ({{ ids.length }})
      </a-button>

      <a-button type="primary" @click="handleMultipleCheck(1)">
        批量确认({{ ids.length }})
      </a-button>
      <a-button type="warning" @click="handleMultipleCheck(0)">
        取消确认 ({{ ids.length }})</a-button
      >
      <a-button type="danger" @click="handleDelete(null)">
        批量删除({{ ids.length }})
      </a-button>
    </div>

    <div class="common-table">
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
              :width="120"
              style="width: 160px; object-fit: contain"
              :src="row.minioPath"
            />
          </div>
        </template>

        <template #originWebDefaultSlot="{ row }">
          {{ getOriginWebLabel(row.originWeb) }}
        </template>

        <template #operationDefaultSlot="{ row }">
          <div class="table-operation-column">
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
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive, computed, onMounted, onUnmounted, watch, handleError } from "vue";
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

function getOriginWebLabel(value) {
  return typeOptions.value.find((item) => item.value == value)?.label;
}

// 处理上传

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

getList();

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

<style></style>
