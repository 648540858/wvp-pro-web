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
    <a-tree
      v-if="treeType == 'group'"
      v-model:expanded-keys="expandedKeys"
      v-model:selectedKeys="selectedKeys"
      :tree-data="treeData"
      :load-data="onLoadData"
    />
  </div>
</template>
<script lang="ts" setup>
  import {
    Layout as ALayout,
    LayoutSider as ALayoutSider,
    LayoutContent as ALayoutContent,
    Input as AInput,
    Select as ASelect,
    SelectOption as ASelectOption,
    InputSearch as AInputSearch,
    Tree as ATree,
  } from 'ant-design-vue'
  import type { TreeProps } from 'ant-design-vue'
  import { ref } from 'vue'
  import {
    addGroupApi,
    queryGroupListApi,
    updateGroupApi,
    deleteGroupApi,
    queryChildGroupListApi,
  } from '/@/api/resource/group'

  let treeType = ref('group')
  let searchTreeValue = ref('')
  const expandedKeys = ref<(string | number)[]>([])
  const selectedKeys = ref<string[]>([])
  const treeData = ref<TreeProps['treeData']>([])

  treeData.value = [{ title: '本平台', key: '' }]
  const onLoadData: TreeProps['loadData'] = (treeNode: any) => {
    return new Promise<void>((resolve) => {
      if (treeNode.dataRef.children) {
        resolve()
        return
      }
      queryChildGroupListApi({
        groupParentId: treeNode.key,
        page: 1,
        count: 10000,
      })
        .then((result) => {
          console.log(result)
          if (result.total == 0) {
            resolve()
            return
          }
          treeNode.dataRef.children = []
          for (let i = 0; i < result.list.length; i++) {
            treeNode.dataRef.children.push({
              title: result.list[i].commonGroupName,
              key: result.list[i].commonGroupDeviceId,
            })
          }
          treeData.value = [...treeData.value]
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => {
          resolve()
        })
    })
  }
</script>
