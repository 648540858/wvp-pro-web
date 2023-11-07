<template>
  <div style="height: 100%; min-width: 280px">
    <a-input-search v-model:value="searchTreeValue" style="margin-bottom: 8px" placeholder="搜索">
      <template #addonBefore>
        <a-select v-model:value="treeType" style="width: 100px">
          <a-select-option value="group">按组查询</a-select-option>
          <a-select-option value="region">按区域查询</a-select-option>
        </a-select>
      </template>
    </a-input-search>
    <VirTree ref="virTree" :source="treeData" :load-data="loadData" >
      <template #icon="{ loading, expanded, node }">
        <i v-if="loading" class="iconfont iconcustom-icon ico-loading"></i>
        <i v-else class="iconfont iconzhankai"></i>
      </template>
    </VirTree>
  </div>
</template>
<script lang="ts" setup>
  import {
    Select as ASelect,
    SelectOption as ASelectOption,
    InputSearch as AInputSearch,
  } from 'ant-design-vue'
  import { ref } from 'vue'
  import {
    addGroupApi,
    queryGroupListApi,
    updateGroupApi,
    deleteGroupApi,
    queryChildGroupListApi,
  } from '/@/api/resource/group'
  import { BaseTreeNode, TreeNodeOptions, VirTree } from '@ysx-libs/vue-virtual-tree'

  let treeType = ref('group')
  let searchTreeValue = ref('')
  const nodeKey = ``
  const treeNode: TreeNodeOptions = {
    nodeKey,
    name: '本平台',
    children: [],
    hasChildren: true,
  }
  let treeData = ref<TreeNodeOptions[]>([])
  treeData.value.push(treeNode)
  function loadData(node: BaseTreeNode, callback: (children: TreeNodeOptions[]) => void) {
    const result: TreeNodeOptions[] = []
    for (let i = 0; i < 2; i += 1) {
      const nodeKey = `${node.key}-${i}`
      const treeNode: TreeNodeOptions = {
        nodeKey,
        name: nodeKey,
        children: [],
        hasChildren: true,
      }
      result.push(treeNode)
    }
    setTimeout(() => {
      callback(result)
    }, 500)
  }
</script>
