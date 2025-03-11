<template>
  <div class="p-4">
    <div class="py-4 flex justify-end gap-4">
      <!-- 修改按钮 -->
      <form-item label="平台">
        <a-input></a-input>
      </form-item>
      <form-item label="店铺">
        <a-input></a-input>
      </form-item>

      <form-item label="订单号/备货单号">
        <a-input></a-input>
      </form-item>

      <a-button type="primary" :disabled="single" @click="handleAdd"> 新增 </a-button>
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
        <template #roleDefaultSlot="{ row }">
          <div>
            <a-tag :color="getRoleColor(row.role)">
              {{ getRoleLabel(row.role) }}
            </a-tag>
          </div>
        </template>
        <template #statusDefaultSlot="{ row }">
          <div>
            <a-tag :color="row.status === 1 ? 'success' : 'error'">
              {{ row.status === 1 ? "启用" : "禁用" }}
            </a-tag>
          </div>
        </template>

        <template #operationDefaultSlot="{ row }">
          <div class="table-operation-column">
            <a-button type="link" @click="handleEdit(row)"> 编辑 </a-button>
            <a-button type="link" @click="handleDelete(row)" danger> 删除 </a-button>
          </div>
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
        :pageSizeOptions="[10, 15, 30, 50, 100]"
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
        <a-row :gutter="[0, 0]">
          <!-- 用户名 -->
          <a-col :span="24">
            <a-form-item label="分类名称" name="username">
              <a-input
                v-model:value="form.username"
                :disabled="isEdit"
                placeholder="请输入用户名"
              />
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
import { ref, reactive, computed } from "vue";
import { usePagination } from "vue-request";
import { message, Modal } from "ant-design-vue";

import { deleteOrder, getOrderList, addOrder, updateOrder } from "/@/api/sys/order";

import { getRoleLabel, getRoleColor, roleConfig } from "/@/common/user";
import { commonGridOptions } from "/@/common/table.ts";
import { formatTimeFromTimeArray } from "/@/common/date";
import CryptoJS from "crypto-js";
import { pwdKey } from "/@/enums/config";
// 查询条件
const queryParams = reactive({
  current: 1,
  size: 15,
});

const gridOptions = ref({
  ...commonGridOptions,
  columns: [
    { type: "checkbox", width: 50, ellipsis: true },
    // { title: "ID", field: "id", width: 60, ellipsis: true },
    { title: "订单号/备货单号", field: "username", width: 160 },
    { title: "SKU/SKC", field: "username", width: 160 },
    { title: "商品名称", field: "username", minWidth: 160 },
    { title: "订单类型", field: "username", minWidth: 160 },
    { title: "数量合计", field: "username", minWidth: 160 },
    { title: "货号", field: "username", minWidth: 160 },
    { title: "是否首单", field: "username", minWidth: 160 },
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
    // {
    //   title: "操作",
    //   fixed: "right",
    //   width: "auto",
    //   field: "operation",
    //   slots: {
    //     default: "operationDefaultSlot",
    //   },
    // },
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

async function getList() {
  loading.value = true;
  let res = await getOrderList({
    ...queryParams,
  }).finally(() => {
    loading.value = false;
  });

  dataSource.value = res.records;
  total.value = res.total;
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
  Modal.confirm({
    title: "删除提示",
    content: "确认删除该数据吗",
    okText: "确认",
    okType: "danger",
    cancelText: "取消",
    centered: true,
    async onOk() {
      await deleteOrder(row.id);
      message.success("删除成功");
      getList();
    },
  });
  // let delIds = null;
  // if (row) {
  //   delIds = [row.id];
  // } else {
  //   delIds = [...ids.value];
  // }
  // Modal.confirm({
  //   title: "删除提示",
  //   content: "确认删除该数据吗",
  //   okText: "确认",
  //   okType: "danger",
  //   cancelText: "取消",
  //   centered: true,
  //   async onOk() {
  //     await deleteAutoPublish({ ids: delIds });
  //     message.success("删除成功");
  //     getList();
  //   },
  // });
}

function handleAdd() {
  isEdit.value = false;
  dialogVisible.value = true;
  dialogTitle.value = "新建";
  form.value = {};
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
  queryParams.current = current;
  queryParams.size = size;
  getList();
}

function cancel() {
  open.value = false;
}

const form = ref({});

const rules = {
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
  realName: [{ required: true, message: "真实姓名不能为空", trigger: "blur" }],
  email: [{ required: true, message: "邮箱不能为空", trigger: "blur" }],
  phone: [{ required: true, message: "电话不能为空", trigger: "blur" }],
  role: [{ required: true, message: "角色不能为空", trigger: "blur" }],
  status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
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
      let post = {
        ...form.value,
      };

      if (post._password == post.password) {
        // 没修改密码
      } else {
        post.password = CryptoJS.MD5(post.password + pwdKey).toString();
      }

      await updateOrder(post);
      message.success("更新成功");
    } else {
      let post = {
        ...form.value,
      };
      post.password = CryptoJS.MD5(post.password + pwdKey).toString();
      await addOrder(post);
      message.success("添加成功");
    }
    dialogVisible.value = false;
  } catch (e) {
  } finally {
    submitLoading.value = false;
    dialogVisible.value = false;
    getList();
  }

  getList();
};
</script>

<style scoped></style>
