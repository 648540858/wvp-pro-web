<template>
  <div style="height: 100%; min-width: 280px">
    <a-input-search v-model:value="searchTreeValue" style="margin-bottom: 8px" placeholder="搜索">
      <template #addonBefore>
        <a-select v-model:value="treeType">
          <a-select-option value="group">分组</a-select-option>
          <a-select-option value="region">区域</a-select-option>
          <a-select-option value="region+group">区域+分组</a-select-option>
        </a-select>
      </template>
    </a-input-search>
    <a-tree
      v-if="treeType == 'group'"
      :show-icon="true"
      v-model:expanded-keys="expandedKeys"
      v-model:selectedKeys="selectedKeys"
      :tree-data="treeData"
      :load-data="onLoadData"
      :height="400"
    >
      <template #icon="{ key, ptzType }">
        <template v-if="key === ''">
          <Icon icon="tdesign:home" />
        </template>
        <template v-if="key !== '' && !ptzType">
          <Icon icon="material-symbols:ad-group-outline" />
        </template>
        <template v-if="ptzType === 1">
          <Icon icon="icon-park-outline:camera-five" />
        </template>
        <template v-if="ptzType === 2">
          <Icon icon="icon-park-solid:camera-four" />
        </template>
        <template v-if="ptzType === 3">
          <Icon icon="icon-park-outline:surveillance-cameras-one" />
        </template>
        <template v-if="ptzType === 4">
          <Icon icon="icon-park-outline:surveillance-cameras-two" />
        </template>
      </template>
      <template #title="{ key, title }">
        <a-dropdown :trigger="['contextmenu']">
          <span>{{ title }}</span>
          <template #overlay>
            <a-menu @click="({ key: menuKey }) => onContextMenuClick(key, menuKey)">
              <a-menu-item key="add">添加分组</a-menu-item>
              <a-menu-item key="edit">编辑分组</a-menu-item>
              <a-menu-item key="delete">删除分组</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-tree>
  </div>
</template>
<script lang="ts" setup>
  import {
    Dropdown as ADropdown,
    MenuItem as AMenuItem,
    Menu as AMenu,
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
  import { queryChannelListInGroup } from '/@/api/resource/channel'
  import { Icon } from '/@/components/Icon'

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
              data: result.list[i],
            })
          }
          treeData.value = [...treeData.value]
        })
        .then(() => {
          queryChannelListInGroup(treeNode.key, '', 1, 1000).then((result) => {
            console.log(result)
            if (result.total == 0) {
              resolve()
              return
            }
            treeNode.dataRef.children = []
            for (let i = 0; i < result.list.length; i++) {
              treeNode.dataRef.children.push({
                title: result.list[i].commonGbName,
                key: result.list[i].commonGbDeviceID,
                isLeaf: true,
                ptzType: result.list[i].commonGbPtzType,
              })
            }
            treeData.value = [...treeData.value]
          })
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => {
          resolve()
        })
    })
  }
  const onContextMenuClick = (treeKey: string, menuKey: string | number) => {
    console.log(`treeKey: ${treeKey}, menuKey: ${menuKey}`)
  }
</script>
