<template>
  <span
    style="height: 240px"
    class="img-card relative"
    ref="imgCardRef"
    :class="{ imgIsChecked: isChecked }"
  >
    <img
      @click="doCheck"
      style="height: 240px"
      object-fit="contain"
      :src="info.minioPath"
    />

    <div class="absolute top-2 left-2 text-xs font-bold text-resolution">
      {{ info.resolution }}
    </div>

    <div
      v-if="isChecked"
      class="absolute top-2 right-2 text-xs font-bold text-resolution"
    >
      <check-circle-outlined style="font-size: 36px; color: #74c476" />
    </div>

    <transition name="fade">
      <div
        class="absolute bottom-0 left-0 w-full flex pb-6 gap-2 justify-center img-card-bottom"
        v-if="isHovered"
      >
        <a-button size="small" type="default" @click="doPreview"> 预览 </a-button>
        <a-button size="small" type="danger" @click="doDelete()"> 删除 </a-button>
        <a-button
          v-if="info.checkType == 0"
          size="small"
          type="primary"
          @click="$emit('checkType', info, 1)"
        >
          确认
        </a-button>
        <a-button
          v-if="info.checkType == 1"
          size="small"
          type="danger"
          @click="$emit('checkType', info, 0)"
        >
          取消
        </a-button>
      </div>
    </transition>
  </span>
</template>

<script setup lang="ts">
import { useElementHover } from "@vueuse/core";
import { ref } from "vue";
import { CheckCircleOutlined } from "@ant-design/icons-vue";
import { api as viewerApi } from "v-viewer";
const props = defineProps({
  info: {
    default: {},
  },
  ids: {
    default: [],
  },
});

const isChecked = ref(false);
const emits = defineEmits(["delete", "preview", "check"]);

function doCheck() {
  isChecked.value = !isChecked.value;
  emits("check", props.info.id, isChecked.value);
}

function doDelete() {
  emits("delete", props.info);
}

async function doPreview() {
  viewerApi({
    images: [props.info.minioPath],
    options: {
      toolbar: {
        flipHorizontal: {
          show: true,
        },
        flipVertical: {
          show: true,
        },
        next: {
          show: false,
        },
        oneToOne: {
          show: true,
        },
        play: {
          show: false,
        },
        prev: {
          show: false,
        },
        reset: {
          show: true,
        },
        rotateLeft: {
          show: true,
        },
        rotateRight: {
          show: true,
        },
        zoomIn: {
          show: true,
        },
        zoomOut: {
          show: true,
        },
      },
    },
  });
}

const imgCardRef = ref();

const isHovered = useElementHover(imgCardRef);
</script>
<style scoped>
.img-card {
  border-radius: 2px;
}
.img-card:hover {
  transition: all 0.5s;
  transform: scale(1.01);
  z-index: 999;
}

.img-card-bottom {
  transition: all 1s;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.text-resolution {
  color: #333;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
}

.imgIsChecked {
  box-shadow: var(--erp-primary-color) 0px 1px 4px,
    var(--erp-primary-color) 0px 0px 0px 4px;
}
</style>
