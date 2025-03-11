<template>
  <div class="p-4">
    <div class="py-4 flex justify-between gap-6 items-center">
      <!-- 导出按钮 -->
      <div style="flex: 1"></div>

      <form-item label="只看我的">
        <a-checkbox v-model:checked="queryParams.OnlyMe" @change="getList"></a-checkbox>
      </form-item>

      <div class="flex gap-4 items-center">
        <span class="table-form-item-label">排序方式</span>
        <a-select
          v-model:value="queryParams.sortType"
          style="width: 160px"
          :options="sortTypeOptions"
          @change="getList"
        ></a-select>
        <span class="table-form-item-label">上传状态</span>

        <a-select
          v-model:value="queryParams.selectMaterial"
          style="width: 120px"
          :options="selectMaterialOptions"
          @change="getList"
        ></a-select>
        <a-button type="primary"> 导出Excel </a-button>

        <!-- 导入按钮 -->
        <a-button type="primary"> 导入Excel </a-button>

        <!-- 修改按钮 -->
        <a-button type="primary" :disabled="single" @click="handleAdd"> 新增 </a-button>
        <!-- 删除按钮 -->
        <a-button type="danger" @click="handleDelete(null)"> 批量删除 </a-button>
      </div>
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
        <template #completionDefaultSlot="{ row }">
          <div>
            <a-tag :color="getCompletionInfo(row.completion).color">
              {{ getCompletionInfo(row.completion).label }}
            </a-tag>
          </div>
        </template>

        <template #titleTemplateDefaultSlot="{ row }">
          <div v-if="row.titleTemplate">
            {{ row.titleTemplate }}
          </div>

          <div v-else-if="row.imageFolder">
            <a-button type="link" size="small" :loading="true" class="btn-yellow">
              正在生成标题
            </a-button>
          </div>

          <div v-else>
            <a-tag :border="false" color="warning"> 请上传素材图 </a-tag>
          </div>
        </template>

        <template #imageFolderDefaultSlot="{ row }">
          <div v-if="row.imageFolder">
            {{ row.imageFolder }}
          </div>
          <div v-else>
            <a-tag :bordered="false" color="warning">未上传</a-tag>
          </div>
        </template>

        <template #operationDefaultSlot="{ row }">
          <div class="flex table-operation-column">
            <a-button
              type="link"
              size="small"
              @click="handleCopy(row)"
              title="点击复制该条数据"
            >
              复制
            </a-button>

            <a-button type="link" size="small" @click="handleEdit(row)"> 编辑 </a-button>

            <div>
              <a-button type="link" size="small" @click="handleUpload(row)">
                上传素材图
              </a-button>
            </div>

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
        <!-- 第一行，两个输入框 -->
        <a-row :gutter="[16, 40]">
          <a-col :span="12">
            <!-- SKC ID -->
            <a-form-item label="SPU ID" name="skcId">
              <a-input v-model:value="form.skcId" placeholder="请输入SPU ID" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <!-- SKU货号 -->
            <a-form-item label="SKU货号" name="skuNo">
              <a-input v-model:value="form.skuNo" placeholder="请输入SKU货号" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第二行，两个输入框 -->
        <a-row :gutter="[16, 40]">
          <a-col :span="12">
            <!-- 店铺名称 -->
            <a-form-item label="店铺名称" name="shopName">
              <a-input v-model:value="form.shopName" placeholder="请输入店铺名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <!-- 类目 -->
            <a-form-item label="类目" name="category">
              <a-input v-model:value="form.category" placeholder="请输入类目" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第三行，两个输入框 -->
        <a-row :gutter="[16, 40]">
          <a-col :span="12">
            <!-- 轮播图 -->
            <a-form-item label="轮播图" name="carouselImages">
              <a-input v-model:value="form.carouselImages" placeholder="请输入轮播图" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <!-- 详情图 -->
            <a-form-item label="详情图" name="detailImages">
              <a-input v-model:value="form.detailImages" placeholder="请输入详情图" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第四行，单个输入框 -->
        <a-row v-if="isEdit">
          <a-col :span="24">
            <!-- 标题 -->
            <a-form-item label="标题" name="titleTemplate" v-if="isEdit">
              <a-input
                v-model:value="form.titleTemplate"
                placeholder="请输入标题 (最多200字)"
                :maxLength="250"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第五行，单个输入框 -->
        <a-row>
          <a-col :span="24">
            <!-- GPT模板 -->
            <a-form-item label="GPT模板" name="gptTemplate">
              <a-textarea
                v-model:value="form.gptTemplate"
                :autoSize="{ minRows: 2, maxRows: 6 }"
                placeholder="请输入GPT模板 (最多600字)"
                :maxLength="600"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 第六行，单个输入框 -->
        <a-row>
          <a-col :span="24">
            <!-- GPT要求 -->
            <a-form-item label="GPT要求" name="gptPrompt">
              <a-textarea
                v-model:value="form.gptPrompt"
                :autoSize="{ minRows: 2, maxRows: 6 }"
                placeholder="请输入GPT要求 (最多600字)"
                :maxLength="600"
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

    <a-modal
      title="上传素材图"
      :visible.sync="uploadModalVisible"
      width="300px"
      @cancel="uploadDialogClose"
      @close="uploadDialogClose"
      :closable="false"
      centered
    >
      <div class="flex justify-center">
        <a-upload
          name="file"
          v-model:file-list="fileList"
          list-type="picture-card"
          class="flex justify-center material-upload"
          :show-upload-list="false"
          :action="uploadPath"
          :headers="uploadHeaders"
          :data="uploadData"
          :before-upload="beforeUpload"
          @change="handleChange"
        >
          <img v-if="imageUrl" :src="imageUrl" alt="material" />
          <div v-else>
            <loading-outlined v-if="uploadLoading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
      </div>
      <template #footer>
        <a-button @click="uploadDialogClose"> 关闭 </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { usePagination } from "vue-request";
import { message, Modal } from "ant-design-vue";
import {
  getAutoPublishList,
  addAutoPublish,
  updateAutoPublish,
  deleteAutoPublish,
} from "/@/api/sys/feature"; // 实际接口导入
import { commonGridOptions } from "/@/common/table.ts";
import { formatTimeFromTimeArray } from "/@/common/date";
import { Api } from "/@/api/sys/feature";
import { useGlobSetting } from "/@/hooks/setting";
import { getToken } from "/@/utils/auth";
import { useUserStore } from "/@/store/modules/user";
import { getCompletionInfo } from "/@/common/material";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { sortTypeOptions } from "/@/common/sort";
import type { UploadChangeParam, UploadProps } from "ant-design-vue";

// 查询条件
const queryParams = reactive({
  current: 1,
  size: 15,
  selectMaterial: null,
  sortType: 1,
  OnlyMe: true,
});

let config = useGlobSetting();

const uploadPath = computed(() => {
  return `http://${config.apiHost}${Api.UploadMaterial}`;
});

function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
}

const selectMaterialOptions = ref([
  {
    label: "全部",
    value: null,
  },
  {
    label: "未上传",
    value: false,
  },
  {
    label: "已上传",
    value: true,
  },
]);

const uploadHeaders = computed(() => {
  return {
    Authorization: getToken(),
  };
});

const uploadData = computed(() => {
  return {
    imageFolder: currentRow.value.imageFolder,
    id: currentRow.value.id,
    shopTemplate: "",
  };
});

const fileList = ref([]);
const uploadLoading = ref<boolean>(false);
const imageUrl = ref<string>("");

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === "uploading") {
    uploadLoading.value = true;
    uploadModalVisible.value = false;
    imageUrl.value = "";
    uploadLoading.value = false;
    return;
  }
  if (info.file.status === "done") {
    if (info.file.response.success) {
      // Get this url from response in real world.
      // getBase64(info.file.originFileObj, (base64Url: string) => {
      //   imageUrl.value = base64Url;
      //   uploadLoading.value = false;
      // });
      message.success("上传成功");
      getList();
    } else {
      uploadLoading.value = false;
      message.error(info.file.response.message);
    }
  }
  if (info.file.status === "error") {
    uploadLoading.value = false;
    message.error("上传失败");
  }
};

const beforeUpload = (file: UploadProps["fileList"][number]) => {
  // const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  // if (!isJpgOrPng) {
  //   message.error("You can only upload JPG file!");
  // }
  const isLt2M = file.size / 1024 / 1024 < 50;
  if (!isLt2M) {
    message.error("图片最大为50M!");
  }

  const legalName = file.name.length < 50;

  if (!legalName) {
    message.error("图片名称最长为50");
  }

  return isLt2M && legalName;
};

const gridOptions = ref({
  ...commonGridOptions,
  columns: [
    { type: "checkbox", width: 50, showOverflow: true },
    { title: "ID", field: "id", width: 50, showOverflow: true },
    { title: "SPU ID", field: "skcId", width: 100, showOverflow: true },
    { title: "SKU货号", field: "skuNo", width: 100, showOverflow: true },
    { title: "店铺名称", field: "shopName", width: 100, showOverflow: true },
    {
      title: "创建人",
      field: "creatorName",
      width: 100,
      showOverflow: true,
    },
    {
      title: "素材图名称",
      field: "imageFolder",
      width: 100,
      showOverflow: true,
      slots: {
        default: "imageFolderDefaultSlot",
      },
    },
    { title: "类目", field: "category", width: 60, showOverflow: true },
    {
      title: "标题",
      field: "titleTemplate",
      width: 220,
      showOverflow: true,
      slots: {
        default: "titleTemplateDefaultSlot",
      },
    },
    {
      title: "完成度",
      field: "completion",
      width: 80,
      showOverflow: true,

      slots: {
        default: "completionDefaultSlot",
      },
    },
    { title: "GPT模板", field: "gptTemplate", width: 120, showOverflow: true },
    { title: "GPT要求", field: "gptPrompt", width: 120, showOverflow: true },
    { title: "轮播图", field: "carouselImages", width: 80, showOverflow: true },
    { title: "详情图", field: "detailImages", width: 80, showOverflow: true },
    {
      title: "创建时间",
      field: "createTime",
      width: 150,
      showOverflow: true,
      formatter: (e) => {
        return formatTimeFromTimeArray(e.cellValue);
      },
    },
    {
      title: "修改时间",
      field: "updateTime",
      width: 150,
      showOverflow: true,
      formatter: (e) => {
        return formatTimeFromTimeArray(e.cellValue);
      },
    },
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
  let res = await getAutoPublishList({
    ...queryParams,
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
      await deleteAutoPublish({ ids: delIds });
      message.success("删除成功");
      getList();
    },
  });
}

function wsHandler(data) {
  if (data["notifyGroup"] === "generator_title_group") {
    if (data["notifyType"] === "change_title") {
      let { notifyId, notifyData } = data;
      let target = dataSource.value.find((item) => {
        return item.id == notifyId;
      });
      target.titleTemplate = notifyData;
      message.success("标题已更新");
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

async function handleCopy(row) {
  let form = {
    skcId: row.skcId,
    skuNo: row.skuNo,
    shopName: row.shopName,
    elementWords: row.elementWords,
    category: row.category,
    carouselImages: row.carouselImages,
    detailImages: row.detailImages,
    gptTemplate: row.gptTemplate,
    gptPrompt: row.gptPrompt,
  };
  await addAutoPublish(form);
  message.success("复制成功");
  getList();
}

function handleAdd() {
  isEdit.value = false;
  dialogVisible.value = true;
  dialogTitle.value = "新建";

  let lastestRecord = dataSource.value[0];

  if (lastestRecord) {
    form.value = {
      skcId: lastestRecord ? lastestRecord.skcId : "",
      skuNo: lastestRecord ? lastestRecord.skuNo : "",
      shopName: lastestRecord ? lastestRecord.shopName : "",
      elementWords: lastestRecord ? lastestRecord.elementWords : "",
      category: lastestRecord ? lastestRecord.category : "",
      carouselImages: lastestRecord ? lastestRecord.carouselImages : "",
      detailImages: lastestRecord ? lastestRecord.detailImages : "",
      gptTemplate: lastestRecord ? lastestRecord.gptTemplate : "",
      gptPrompt: lastestRecord ? lastestRecord.gptPrompt : "",
    };
  } else {
    form.value = {};
  }
}

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

const form = ref({
  skcId: "",
  skuNo: "",
  shopName: "",
  category: "",
  carouselImages: "",
  detailImages: "",
  titleTemplate: "",
  gptTemplate: "",
  gptPrompt: "",
});

const rules = {
  skcId: [{ required: true, message: "SPU ID不能为空", trigger: "blur" }],
  skuNo: [{ required: true, message: "SKU货号不能为空", trigger: "blur" }],
  shopName: [{ required: true, message: "店铺名称不能为空", trigger: "blur" }],
  category: [{ required: true, message: "类目不能为空", trigger: "blur" }],
  carouselImages: [{ required: true, message: "轮播图不能为空", trigger: "blur" }],
  detailImages: [{ required: true, message: "详情图不能为空", trigger: "blur" }],
  titleTemplate: [{ required: true, message: "标题不能为空", trigger: "blur" }],
  gptTemplate: [{ required: true, message: "GPT模板不能为空", trigger: "blur" }],
  gptPrompt: [{ required: true, message: "GPT要求不能为空", trigger: "blur" }],
};

const dialogClose = () => {
  dialogVisible.value = false;
};

const uploadDialogClose = () => {
  uploadModalVisible.value = false;
  imageUrl.value = null;
};

function checkboxChange(e) {
  ids.value = e.records.map((item) => item.id);
}

function checkboxAllChange(e) {
  ids.value = e.records.map((item) => item.id);
}

const uploadModalVisible = ref(false);

function handleUpload(row) {
  currentRow.value = row;
  uploadModalVisible.value = true;
}

const submitForm = async () => {
  submitLoading.value = true;
  await formRef.value.validate().finally(() => {
    submitLoading.value = false;
  });
  try {
    if (isEdit.value) {
      await updateAutoPublish({
        ...form.value,
      });
      message.success("更新成功");
    } else {
      await addAutoPublish({
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
