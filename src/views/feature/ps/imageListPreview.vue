<template>
  <a-image
    :preview="{ visible: false }"
    :width="100"
    :src="data[0]"
    @click="visible = true"
  />
  <div style="display: none">
    <a-image-preview-group
      :preview="{ visible, onVisibleChange: (vis) => (visible = vis) }"
    >
      <a-image v-for="img in data" :src="img" />
    </a-image-preview-group>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref } from "vue";

const visible = ref(false);

const props = defineProps({
  data: {
    default: [],
  },
});
</script>
