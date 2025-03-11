<template>
  <div class="p-4">
    <div class="my-4 flex justify-between gap-4 pb-6 table-header">
      <a-form
        :model="queryParams"
        :labelCol="{ style: { width: '80px' } }"
        layout="inline"
      >
        <div class="flex flex-wrap gap-y-4 justify-start w-full">
          <a-form-item label="目标网站" name="type">
            <a-select
              style="width: 120px"
              v-model:value="queryParams.type"
              :options="typeOptions"
              placeholder="请选择目标网站"
            ></a-select>
          </a-form-item>
          <a-form-item label="搜索词" name="searchContent">
            <a-input
              v-model:value="queryParams.searchContent"
              placeholder="请输入搜索词"
            />
          </a-form-item>
          <a-form-item label="点赞量" name="likedCount">
            <a-input
              style="width: 100px"
              v-model:value="queryParams.likedCount"
              type="number"
              step="100"
              min="0"
            />
          </a-form-item>
          <a-form-item label="下载量" name="downloadCount">
            <a-input
              style="width: 100px"
              step="10"
              min="0"
              type="number"
              v-model:value="queryParams.downloadCount"
              placeholder="你想下载多少张图片"
            />
          </a-form-item>
        </div>
      </a-form>

      <a-button type="primary" @click="handleCrawler"> 开始爬取 </a-button>
    </div>

    <div class="py-4 flex justify-end gap-4 items-center">
      <span class="font-bold">
        共
        <span style="font-size: 2em; color: var(--erp-primary-color)"
          >{{ dataSource.length }}
        </span>
        条结果
      </span>

      <div style="flex: 1"></div>
      <!-- <a-switch v-model:checked="picMode">
        <template #checkedChildren>网格</template>
        <template #unCheckedChildren> 列表</template>
      </a-switch>
      <a-button type="primary" @click="handleMultipleCheck(1)">
        批量确认({{ ids.length }})
      </a-button>
      <a-button type="warning" @click="handleMultipleCheck(0)"> 取消确认 </a-button>
      <a-button type="danger" @click="handleDelete(null)">
        批量删除({{ ids.length }})
      </a-button> -->
    </div>

    <div v-if="false" class="common-table">
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
        <template #checkTypeDefaultSlot="{ row }">
          <div>
            <a-tag :color="row.checkType == 1 ? 'success' : 'error'">
              {{ row.checkType == 1 ? "已确认" : "未确认" }}
            </a-tag>
          </div>
        </template>

        <template #operationDefaultSlot="{ row }">
          <div class="table-operation-column">
            <a-button
              v-if="row.checkType == 0"
              type="link"
              @click="handleCheck([row.id], 1)"
              size="small"
            >
              确认
            </a-button>
            <a-button
              v-if="row.checkType == 1"
              type="link"
              @click="handleCheck([row.id], 0)"
              size="small"
            >
              取消确认
            </a-button>
            <a-button type="link" @click="handleDownload(row)" size="small">
              下载
            </a-button>
            <a-button type="link" @click="handleDelete(row)" danger size="small">
              删除
            </a-button>
          </div>
        </template>
      </vxe-grid>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive, computed } from "vue";
import { usePagination } from "vue-request";
import { message, Modal } from "ant-design-vue";

import { getUserList, addUser, deleteUser, updateUser } from "/@/api/sys/user"; // 实际接口导入
import {
  getAssetLibrary,
  pullAsset,
  deleteAssetLibrary,
  checkAssetLibrary,
} from "/@/api/sys/feature"; // 实际接口导入
import { getRoleLabel, getRoleColor, roleConfig } from "/@/common/user";
import { commonGridOptions } from "/@/common/table";
import { formatTimeFromTimeArray } from "/@/common/date";
import CryptoJS from "crypto-js";
import { pwdKey } from "/@/enums/config";
import { useLocalStorage } from "@vueuse/core";
import { sortTypeOptions } from "/@/common/sort";
import { saveAs } from "file-saver";
import { notification } from "ant-design-vue";

// 查询条件
const queryParams = reactive({
  searchContent: "",
  downloadCount: 50,
  likedCount: 1000,
  type: 1,
});

const typeOptions = [
  {
    label: "pinterest",
    value: 1,
  },
  {
    label: "deviantrat",
    value: 2,
  },
];

// 展示模式
const picMode = useLocalStorage("crawler_view_mode", false);

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
    { title: "图片来源", field: "originWeb", width: 120 },

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
});

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

// 操作函数
function handleQuery() {
  queryParams.current = 1;
}

function resetQuery() {
  getList();
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
      await deleteAssetLibrary({ assetIdList: delIds });
      message.success("删除成功");
      getList();
    },
  });
}

// 开始处理爬虫
async function handleCrawler() {
  message.loading("正在爬取图片中，请稍等...");
}

function handleDownload(row) {
  // 处理图片下载
  try {
    saveAs(row.minioPath, row.imageName);

    notification.success({
      placement: "topRight",
      description: "图片下载成功",
    });
  } catch (e) {}
}

async function handleEdit(row) {
  isEdit.value = true;
  dialogVisible.value = true;
  dialogTitle.value = "编辑";
  currentRow.value = row;
  form.value = {
    ...row,
    _password: row.prassword, // 保存一份旧密码
  };
}

function handlePaginationChange(current, size) {
  getList();
}

const form = ref({});

function checkboxChange(e) {
  ids.value = e.records.map((item) => item.id);
}

function checkboxAllChange(e) {
  ids.value = e.records.map((item) => item.id);
}
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
