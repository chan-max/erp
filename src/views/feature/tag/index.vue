<template>
  <div class="p-4">
    <div class="py-4 flex justify-between gap-4 items-center">
      <!-- 导出按钮 -->
      <div style="flex: 1"></div>

      <form-item label="按名称搜索">
        <a-input
          v-model:value="queryParams.name"
          allow-clear
          placeholder="请输入标签名称"
          style="width: 160px"
        ></a-input>
      </form-item>
      <a-button type="primary" @click="getList"> 搜索 </a-button>

      <form-item label="排序方式">
        <a-select
          v-model:value="queryParams.sortType"
          style="width: 160px"
          :options="sortTypeOptionsCreateOnly"
          @change="getList"
        ></a-select>
      </form-item>

      <!-- 修改按钮 -->
      <a-button type="primary" :disabled="single" @click="handleAdd"> 新增 </a-button>
      <!-- 删除按钮 -->
      <a-button type="danger" @click="handleDelete(null)"> 批量删除 </a-button>
    </div>

    <!-- 表格展示 -->
    <div class="common-table">
      <vxe-grid
        v-bind="gridOptions"
        :data="dataSource"
        :loading="loading"
        @checkbox-change="checkboxChange"
        @checkbox-all="checkboxAllChange"
      >
        <template #operationDefaultSlot="{ row }">
          <div class="flex table-operation-column">
            <!-- <a-button type="link" size="small" @click="handleEdit(row)"> 编辑 </a-button> -->

            <a-button type="link" size="small" @click="handleDelete(row)" danger>
              删除
            </a-button>
          </div>
        </template>
      </vxe-grid>
    </div>

    <!-- 分页 -->
    <div class="py-4 flex justify-end">
      <a-pagination
        size="small"
        :pageSizeOptions="[10, 15, 20, 30, 50]"
        :show-total="(total) => `共 ${total} 条`"
        show-size-changer
        :current="queryParams.current"
        :total="total"
        :pageSize="queryParams.size"
        @change="handlePaginationChange"
      />
    </div>

    <a-modal
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="600px"
      @cancel="dialogClose"
      :closable="false"
      centered
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
              <a-input v-model:value="form.name" placeholder="请输入标签名" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <template #footer>
        <a-button @click="dialogVisible = false">取消</a-button>
        <a-button type="primary" @click="submitForm" :loading="submitLoading"
          >确定</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { usePagination } from "vue-request";
import { message, Modal } from "ant-design-vue";
import { getLabelList, addLabel, deleteLabel } from "/@/api/sys/material"; // 实际接口导入
import { commonGridOptions } from "/@/common/table.ts";
import { formatTimeFromTimeArray } from "/@/common/date";
import { Api } from "/@/api/sys/feature";
import { useGlobSetting } from "/@/hooks/setting";
import { getToken } from "/@/utils/auth";
import { useUserStore } from "/@/store/modules/user";
import { getCompletionInfo } from "/@/common/material";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { sortTypeOptionsCreateOnly } from "/@/common/sort";
import type { UploadChangeParam, UploadProps } from "ant-design-vue";

// 查询条件
const queryParams = reactive({
  current: 1,
  size: 15,
  name: "",
  sortType: 1,
});

let config = useGlobSetting();

const gridOptions = ref({
  ...commonGridOptions,
  columns: [
    { type: "checkbox", width: 50, showOverflow: true },
    { title: "ID", field: "id", width: 180, showOverflow: true },
    { title: "名称", field: "name", minWidth: 100, showOverflow: true },
    {
      title: "创建时间",
      field: "createTime",
      width: 150,
      showOverflow: true,
      formatter: (e) => {
        return formatTimeFromTimeArray(e.cellValue);
      },
    },
    // {
    //   title: "修改时间",
    //   field: "updateTime",
    //   width: 150,
    //   showOverflow: true,
    //   formatter: (e) => {
    //     return formatTimeFromTimeArray(e.cellValue);
    //   },
    // },
    {
      title: "操作",
      fixed: "right",
      showOverflow: false,
      width: "auto",
      slots: {
        default: "operationDefaultSlot",
      },
    },
  ],
});

const dataSource = ref([]);
const loading = ref(false);
const open = ref(false);
const title = ref("");
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

  let params = {
    ...queryParams,
    name: String(queryParams.name || ""),
  };

  let res = await getLabelList({
    ...params,
  }).finally(() => {
    loading.value = false;
  });
  dataSource.value = res.records;
  total.value = res.total;
  ids.value = [];
}

getList();

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
  } else if (!ids.value.length) {
    return;
  } else {
    delIds = [...ids.value];
  }

  Modal.confirm({
    title: "删除提示",
    content: "确认删除该数据吗",
    okText: "确认",
    okType: "danger",
    cancelText: "取消",
    centered: true,
    async onOk() {
      console.log("执行删除");
      await deleteLabel({ idList: delIds });
      message.success("删除成功");
      getList();
    },
  });
}

const userStore = useUserStore();

function handleAdd() {
  isEdit.value = false;
  dialogVisible.value = true;
  dialogTitle.value = "新建";

  form.value = {};
}
name;
async function handleEdit(row) {
  isEdit.value = true;
  dialogVisible.value = true;
  dialogTitle.value = "编辑";
  currentRow.value = row;
  form.value = {
    ...row,
  };
}

function handlePaginationChange(current, size) {
  queryParams.current = current;
  queryParams.size = size;
  getList();
}

function cancel() {
  open.value = false;
}

const form = ref({});

const rules = {
  name: [{ required: true, message: "请输入标签名", trigger: "blur" }],
};

const dialogClose = () => {
  dialogVisible.value = false;
};

function checkboxChange(e) {
  ids.value = e.records.map((item) => item.id);
}

function checkboxAllChange(e) {
  ids.value = e.records.map((item) => item.id);
}

const submitForm = async () => {
  submitLoading.value = true;
  await formRef.value.validate().finally(() => {
    submitLoading.value = false;
  });
  try {
    if (isEdit.value) {
      message.success("更新成功");
    } else {
      await addLabel({
        ...form.value,
      });
      message.success("添加成功");
    }

    dialogVisible.value = false;
  } catch (e) {
  } finally {
    submitLoading.value = false;
    dialogVisible.value = false;
  }

  getList();
};
</script>

<style lang="less">
.material-upload {
  display: flex;
  justify-content: center !important;
  .ant-upload-select-picture-card {
    width: 160px;
    height: 160px;
  }
}
</style>
