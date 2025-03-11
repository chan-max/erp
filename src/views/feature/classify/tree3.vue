<template>
  <el-tree
    :props="props"
    :load="loadNode"
    lazy
    :default-expanded-keys="defaultExpandedKeys"
  />
</template>

<script setup>
import { ref } from "vue";

// 定义树的 props
const props = {
  label: "name",
  children: "children",
  isLeaf: "leaf",
};

// 默认展开的节点 key 数组
const defaultExpandedKeys = ref([]);

// 加载节点的方法
const loadNode = async (node, resolve) => {
  if (node.level === 0) {
    // 加载第一级节点
    const firstLevelNodes = await fetchFirstLevelNodes();
    resolve(firstLevelNodes);
    // 默认展开第一级节点
    defaultExpandedKeys.value = firstLevelNodes.map((node) => node.id);
  } else if (node.level === 1) {
    // 加载第二级节点
    const secondLevelNodes = await fetchSecondLevelNodes(node.data.id);
    resolve(secondLevelNodes);
    // 默认展开第二级节点
    defaultExpandedKeys.value = [
      ...defaultExpandedKeys.value,
      ...secondLevelNodes.map((node) => node.id),
    ];
  } else {
    // 其他级别节点
    resolve([]);
  }
};

// 模拟异步请求第一级节点数据
const fetchFirstLevelNodes = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Node 1", leaf: false },
        { id: 2, name: "Node 2", leaf: false },
      ]);
    }, 500);
  });
};

// 模拟异步请求第二级节点数据
const fetchSecondLevelNodes = (parentId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (parentId === 1) {
        resolve([
          { id: 11, name: "Node 1-1", leaf: true },
          { id: 12, name: "Node 1-2", leaf: true },
        ]);
      } else if (parentId === 2) {
        resolve([
          { id: 21, name: "Node 2-1", leaf: true },
          { id: 22, name: "Node 2-2", leaf: true },
        ]);
      } else {
        resolve([]);
      }
    }, 500);
  });
};
</script>
