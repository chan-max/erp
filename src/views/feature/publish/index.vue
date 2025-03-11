<template>
  <div class="p-4">
    <div class="py-4 flex justify-end gap-4 items-center">
      <div style="flex: 1"></div>

      <form-item label="只看我的">
        <a-checkbox v-model:checked="queryParams.OnlyMe" @change="getList"></a-checkbox>
      </form-item>
      <span class="table-form-item-label">排序方式</span>
      <a-select
        v-model:value="queryParams.sortType"
        style="width: 160px"
        :options="sortTypeOptions"
        @change="getList"
      ></a-select>

      <span class="table-form-item-label">上传状态</span>
      <a-select
        v-model:value="queryParams.selectCompletion"
        style="width: 120px"
        :options="completionOptions"
        @change="getList"
      ></a-select>
      <a-button type="primary"> 导出Excel </a-button>

      <a-button type="primary"> 导入Excel </a-button>
      <a-button type="primary" @click="handleMultiplePublish(null)"> 批量发布 </a-button>
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
        <template #imageListDefaultSlot="{ row }">
          <div>
            <div
              v-if="row.imageList && row.imageList.length"
              class="flex flex-col items-center gap-1 cursor-pointer preview-image"
              @click="previewImageList(row.imageList)"
            >
              <!-- <imageListPreview :data="row.imageList"></imageListPreview> -->
              <!-- <img :src="row.imageList[0]" style="width: 100px" /> -->
              <div class="font-bold" style="font-size: 9px">
                共

                <span style="font-size: 1.5em; color: var(--erp-primary-color)">{{
                  row.imageList.length
                }}</span>
                张 ,点击预览
                <!-- <eye-outlined /> -->
              </div>
            </div>
            <div v-else class="font-bold text-gray">暂无套图</div>
          </div>
        </template>

        <template #completionDefaultSlot="{ row }">
          <div>
            <a-tag :color="getCompletionInfo(row.completion).color">
              {{ getCompletionInfo(row.completion).label }}
            </a-tag>
          </div>
        </template>

        <template #operationDefaultSlot="{ row }">
          <div class="flex table-operation-column">
            <div v-if="disabledRow(row)" style="color: #ffe700">缺少发布内容</div>

            <template v-else-if="row.hasComposite !== 2">
              <a-button type="link" size="small" disabled> 请先上传套图 </a-button>
            </template>
            <template v-else-if="row.completion == 1">
              <a-button type="link" size="small" :loading="true" class="btn-yellow">
                {{ "上传中" }}
              </a-button>
            </template>
            <template v-else-if="row.completion == 2">
              <a-button type="link" size="small" disabled> 已完成 </a-button>
            </template>
            <template v-else>
              <a-button type="link" size="small" @click="handleUpload(row)">
                {{ "上传并发布" }}
              </a-button>
            </template>

            <a-button type="link" size="small" @click="handleDelete(row)" danger>
              删除
            </a-button>
          </div>
        </template>

        <template #hasCompositeDefaultSlot="{ row }">
          <div>
            <a-tag :color="getCompositeInfo(row.hasComposite).color">
              {{ getCompositeInfo(row.hasComposite).label }}
            </a-tag>
          </div>
        </template>
      </vxe-grid>
    </div>

    <!-- 分页 -->
    <div class="py-4 flex justify-end">
      <!-- <a-pagination
        :pageSizeOptions="[10, 15, 20, 30, 50]"
        :show-total="(total) => `共 ${total} 条`"
        show-size-changer
        :current="queryParams.current"
        :total="total"
        :pageSize="queryParams.size"
        @change="handlePaginationChange"
      /> -->

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
                :maxLength="200"
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
  updateAndPublish,
} from "/@/api/sys/feature"; // 实际接口导入
import { commonGridOptions } from "/@/common/table.ts";
import { formatTimeFromTimeArray } from "/@/common/date";
import { Api } from "/@/api/sys/feature";
import { useGlobSetting } from "/@/hooks/setting";
import { getToken } from "/@/utils/auth";
import { useUserStore } from "/@/store/modules/user";
import { getCompositeInfo, compositeConfig } from "/@/common/ps";
import { PlusOutlined, LoadingOutlined, EyeOutlined } from "@ant-design/icons-vue";
import { getCompletionInfo, completionConfig } from "/@/common/material";
import { sortTypeOptions } from "/@/common/sort";
import { preview } from "/@/components/PreviewImage/index";

import type { UploadChangeParam, UploadProps } from "ant-design-vue";
const completionOptions = computed(() => {
  return completionConfig
    .map((item) => {
      return {
        label: item.label,
        value: item.type,
      };
    })
    .concat({
      label: "全部",
      value: null,
    });
});

// 查询条件
const queryParams = reactive({
  current: 1,
  size: 15,
  selectCompletion: null,
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

const uploadHeaders = computed(() => {
  return {
    Authorization: getToken(),
  };
});

// 当前行缺少内容
function disabledRow(row) {
  return !row.skcId || !row.skuNo || !row.shopName || !row.category || !row.titleTemplate;
}

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
    return;
  }
  if (info.file.status === "done") {
    if (info.file.response.success) {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (base64Url: string) => {
        imageUrl.value = base64Url;
        uploadLoading.value = false;
      });
      message.success("上传成功");
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
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const gridOptions = ref({
  ...commonGridOptions,
  columns: [
    { type: "checkbox", width: 50, showOverflow: true },
    { title: "ID", field: "id", width: 50, showOverflow: true },
    { title: "SPU ID", field: "skcId", width: 100, showOverflow: true },
    { title: "SKU货号", field: "skuNo", width: 100, showOverflow: true },
    { title: "店铺名称", field: "shopName", width: 100, showOverflow: true },
    { title: "素材图名称", field: "imageFolder", width: 100, showOverflow: true },
    {
      title: "创建人",
      field: "creatorName",
      width: 100,
      showOverflow: true,
    },
    { title: "类目", field: "category", width: 60, showOverflow: true },
    { title: "标题", field: "titleTemplate", width: 220, showOverflow: true },
    {
      title: "套图状态",
      field: "hasComposite",
      width: 100,
      showOverflow: true,
      slots: {
        default: "hasCompositeDefaultSlot",
      },
    },
    {
      title: "套图预览",
      field: "imageList",
      width: "auto",
      slots: {
        default: "imageListDefaultSlot",
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
  let delIds = null;

  if (row) {
    delIds = [row.id];
  } else if (!ids.value?.length) {
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
      await deleteAutoPublish({ ids: delIds });
      message.success("删除成功");
      getList();
    },
  });
}

function wsHandler(data) {
  if (data["notifyGroup"] === "auto_public_group") {
    if (data["notifyType"] === "change_completion") {
      let { notifyId, notifyData } = data;
      let target = dataSource.value.find((item) => {
        return item.id == notifyId;
      });
      target.completion = notifyData;
      message.success("发布情况更新", notifyData);
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

function previewImageList(list) {
  preview(0, list);
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

  Modal.confirm({
    title: "提示",
    content: "确认上传该记录吗？",
    okText: "确认",
    okType: "primary",
    cancelText: "取消",
    centered: true,
    async onOk() {
      await updateAndPublish({ publishIdList: [row.id] }).catch(() => {
        message.error("发布失败");
      });
      message.info("发布进行中");
      getList();
    },
  });
}

function handleMultiplePublish() {
  if (!ids.value.length) {
    return message.warn("请选择要发布的数据");
  }

  const err = ids.value.some((id) => {
    let item = dataSource.value.find((row) => row.id == id);

    if (item.hasComposite != 2) {
      return true;
    }
  });

  if (err) {
    return message.error("选中数据存在未制作的套图，请重新选择");
  }

  Modal.confirm({
    title: "提示",
    content: "确认上传该记录吗？",
    okText: "确认",
    okType: "primary",
    cancelText: "取消",
    centered: true,
    async onOk() {
      await updateAndPublish({ publishIdList: [...ids.value] }).catch(() => {});
      await message.info("发布进行中");
      getList();
    },
  });
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
.preview-image {
  transition: all 0.1s;
}

.preview-image:hover {
  transform: scale(1.05);
}
</style>
