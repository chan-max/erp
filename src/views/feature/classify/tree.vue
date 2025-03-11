<template>
  <div class="tree-container">
    <!-- 添加根节点按钮 -->
    <el-button type="primary" @click="addRootFolder" class="add-root-btn">
      添加根节点
    </el-button>

    <!-- 树形组件 -->
    <el-tree
      ref="treeRef"
      :data="treeData"
      :props="defaultProps"
      node-key="id"
      :expand-on-click-node="false"
      :load="loadNode"
      lazy
      :render-after-expand="false"
      @node-click="handleNodeClick"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span v-if="!data.isEditing">{{ node.label }}</span>
          <el-input
            v-else
            v-model="data.label"
            size="small"
            @blur="saveRename(data)"
            @keyup.enter="saveRename(data)"
          />
          <span class="action-buttons">
            <el-icon class="icon" @click.stop="() => addFolder(data)">
              <Plus />
            </el-icon>
            <el-icon class="icon" @click.stop="() => renameFolder(data)">
              <Edit />
            </el-icon>
            <el-icon class="icon" @click.stop="() => copyFolder(data)">
              <CopyDocument />
            </el-icon>
            <el-icon class="icon" @click.stop="() => deleteFolder(data)">
              <Delete />
            </el-icon>
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { ElTree, ElButton, ElMessage, ElMessageBox, ElInput, ElIcon } from "element-plus";
import { Plus, Edit, CopyDocument, Delete } from "@element-plus/icons-vue";

// 平铺的假数据
const flatData = ref([
  { id: 1, pid: null, label: "根文件夹", isLeaf: false },
  { id: 2, pid: 1, label: "子文件夹 1", isLeaf: false },
  { id: 3, pid: 1, label: "子文件夹 2", isLeaf: false },
  { id: 4, pid: 2, label: "子文件夹 1-1", isLeaf: true },
  { id: 5, pid: 2, label: "子文件夹 1-2", isLeaf: true },
  { id: 6, pid: 3, label: "子文件夹 2-1", isLeaf: true },
]);

// 将平铺数据转换为树形结构
const buildTree = (data, pid = null) => {
  return data
    .filter((item) => item.pid === pid)
    .map((item) => ({
      ...item,
      children: buildTree(data, item.id),
    }));
};

// 树形数据
const treeData = computed(() => buildTree(flatData.value));

// 树形结构配置
const defaultProps = {
  children: "children",
  label: "label",
  isLeaf: "isLeaf", // 使用 isLeaf 属性判断是否为叶子节点
};

// 懒加载方法
const loadNode = async (node, resolve) => {
  if (node.level === 0) {
    // 根节点加载
    resolve(treeData.value);
  } else {
    // 子节点加载
    const children = flatData.value.filter((item) => item.pid === node.data.id);

    setTimeout(() => {
      resolve(children);
    }, 0);
    // 如果没有子节点，则标记为叶子节点
    if (children.length === 0) {
      node.data.isLeaf = true;
    }
  }
};

// 点击节点展开/收起
const handleNodeClick = (data, node) => {
  if (node.expanded) {
    node.collapse();
  } else {
    node.expand();
  }
};

// 添加根节点
const addRootFolder = () => {
  const newFolder = {
    id: Date.now(), // 使用时间戳作为唯一 ID
    pid: null, // 根节点的 pid 为 null
    label: "新建根文件夹",
    isEditing: false,
    isLeaf: false, // 默认不是叶子节点
  };
  flatData.value.push(newFolder);
  ElMessage.success("添加根节点成功");
};

// 添加文件夹
const addFolder = (data) => {
  const newFolder = {
    id: Date.now(), // 使用时间戳作为唯一 ID
    pid: data.id,
    label: "新建文件夹",
    isEditing: false,
    isLeaf: true, // 默认是叶子节点
  };
  flatData.value.push(newFolder);
  // 如果父节点之前是叶子节点，更新为非叶子节点
  if (data.isLeaf) {
    data.isLeaf = false;
  }
  ElMessage.success("添加成功");
};

// 重命名文件夹
const renameFolder = (data) => {
  data.isEditing = true; // 进入编辑状态
};

// 保存重命名
const saveRename = (data) => {
  data.isEditing = false; // 退出编辑状态
  ElMessage.success("重命名成功");
};

// 删除文件夹
const deleteFolder = async (data) => {
  try {
    await ElMessageBox.confirm("确定删除该文件夹吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    // 删除当前节点及其子节点
    const deleteNodes = (id) => {
      flatData.value = flatData.value.filter((item) => item.id !== id);
      flatData.value
        .filter((item) => item.pid === id)
        .forEach((item) => deleteNodes(item.id));
    };
    deleteNodes(data.id);
    ElMessage.success("删除成功");
  } catch (error) {
    ElMessage.info("已取消删除");
  }
};

// 复制文件夹
const copyFolder = (data) => {
  const newFolder = {
    id: Date.now(), // 使用时间戳作为唯一 ID
    pid: data.pid,
    label: `${data.label}-副本`,
    isEditing: false,
    isLeaf: data.isLeaf, // 复制节点的叶子状态
  };
  flatData.value.push(newFolder);
  ElMessage.success("复制成功");
};
</script>

<style scoped>
.tree-container {
  /* 去掉最外层元素的 padding */
}

.add-root-btn {
  margin-bottom: 16px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.custom-tree-node:hover .action-buttons {
  display: inline-block; /* hover 时显示操作按钮 */
}

.action-buttons {
  display: none; /* 默认隐藏操作按钮 */
}

.el-input {
  width: 120px;
}

.icon {
  margin-left: 8px;
  cursor: pointer;
  font-size: 16px;
  color: #606266;
}

.icon:hover {
  color: #409eff;
}
</style>
