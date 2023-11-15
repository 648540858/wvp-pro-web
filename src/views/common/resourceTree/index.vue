<template>
  <div style="height: 100%; min-width: 280px; padding-top: 0.5rem" id="resourceTree">
    <a-input-search
      v-model:value="searchTreeValue"
      style="margin-bottom: 8px"
      placeholder="搜索"
    >
      <template #addonBefore v-if="props.treeType == 'all'">
        <a-select v-model:value="treeType" @change="treeTypeChange">
          <a-select-option value="group">分组</a-select-option>
          <a-select-option value="region">区域</a-select-option>
          <a-select-option value="region_group">区域+分组</a-select-option>
        </a-select>
      </template>
    </a-input-search>
    <GroupTree
      ref="groupTreeRef"
      v-if="treeType == 'group'"
      @deleteChannelEvent="deleteChannelEvent"
    />
    <RegionTree
      ref="regionTreeRef"
      v-if="treeType == 'region'"
      @deleteChannelEvent="deleteChannelEvent"
    />
    <EditGroup ref="editGroupRef" />
  </div>
</template>
<script lang="ts" setup>
  import {
    Select as ASelect,
    SelectOption as ASelectOption,
    InputSearch as AInputSearch,
  } from 'ant-design-vue'
  import { defineProps, ref } from 'vue'
  import EditGroup from '../editGroup/index.vue'
  import GroupTree from './groupTree/index.vue'
  import RegionTree from './regionTree/index.vue'
  import { CommonGbChannel } from '/@/api/resource/model/channelModel'

  type TreeType = 'all' | 'group' | 'region' | 'region_group'
  type PropsClssType = {
    treeType?: TreeType
  }
  // let treeType = ref<TreeType>()
  const props = withDefaults(defineProps<PropsClssType>(), {
    treeType: 'all',
  })
  const treeType = ref(props.treeType)
  let searchTreeValue = ref('')
  const editGroupRef = ref()
  const groupTreeRef = ref()
  const regionTreeRef = ref()
  const emits = defineEmits(['deleteChannelEvent'])
  const deleteChannelEvent = () => {
    emits('deleteChannelEvent')
  }
  const treeTypeChange = () => {
    console.log(treeType.value)
  }
  const getSelectKey = () => {
    if (treeType.value === 'group') {
      return groupTreeRef.value.getSelectKey()
    }
    if (treeType.value === 'region') {
      return regionTreeRef.value.getSelectKey()
    }
  }
  const refreshNote = (key: string, data: CommonGbChannel[]) => {
    if (treeType.value === 'group') {
      return groupTreeRef.value.refreshNote(key, data)
    }
    if (treeType.value === 'region') {
      return regionTreeRef.value.refreshNote(key, data)
    }
  }
  defineExpose({ getSelectKey, refreshNote })
</script>
