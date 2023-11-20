<template>
  <a-modal
    ref="editGroup"
    v-model:visible="open"
    title="区域编码"
    width="60rem"
    @cancel="closeModel"
    :okText="okText"
    @ok="handleOk"
  >
    <div style="padding: 0 1rem">
      <a-breadcrumb :loading="breadcrumbLoading" style="height: 30px; line-height: 30px">
        <a-breadcrumb-item @click="homePathClick()">
          <Icon icon="tdesign:home" />
        </a-breadcrumb-item>
        <a-breadcrumb-item v-for="item in parentPathList" @click="parentPathClick(item)">
          {{ item.name }}
        </a-breadcrumb-item>
      </a-breadcrumb>
      <div class="content">
        <a-radio-group v-model:value="chooseRegion" @change="regionChange">
          <a-radio v-for="item in regionList" :value="item">
            {{ item.commonRegionName }}
          </a-radio>
        </a-radio-group>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
  import { ref, defineEmits } from 'vue'
  import {
    Modal as AModal,
    RadioGroup as ARadioGroup,
    Radio as ARadio,
    Breadcrumb as ABreadcrumb,
    BreadcrumbItem as ABreadcrumbItem,
  } from 'ant-design-vue'
  import { Region } from '/@/api/resource/model/regionModel'
  import { getRegionByDeviceIdApi, queryChildList } from '/@/api/resource/region'
  import Icon from '/@/components/Icon/src/Icon.vue'

  const emit = defineEmits(['end'])
  const open = ref<boolean>(false)
  const breadcrumbLoading = ref<boolean>(false)
  const okText = ref<string>('完成')
  const chooseRegion = ref<Region>()
  // 参考国标 统一编码规则
  interface ParentPath {
    code: string
    name: string
  }
  const parentPathList = ref<ParentPath[]>([])
  const regionList = ref<Region[]>()
  const homePathClick = () => {
    parentPathList.value = []
    getRegionList()
  }
  const parentPathClick = (path: ParentPath) => {
    console.log(path)
    let index = parentPathList.value.indexOf(path)
    console.log(index)
    parentPathList.value = parentPathList.value.slice(0, index + 1)
    console.log(parentPathList.value)
    getRegionList()
  }
  const regionChange = () => {
    console.log(chooseRegion.value)
    parentPathList.value.push({
      code: chooseRegion.value.commonRegionDeviceId,
      name: chooseRegion.value.commonRegionName,
    })
    getRegionList()
  }
  const getRegionList = () => {
    regionList.value= []
    let parent = ''
    if (parentPathList.value.length > 0) {
      parent = parentPathList.value[parentPathList.value.length - 1].code
    }
    queryChildList(parent)
      .then((result) => {
        console.log(result)
        regionList.value = result
      })
      .catch((exception) => {
        console.error(exception)
      })
      .finally(() => {})
  }
  const openModel = (parentCode: string) => {
    console.log(parentCode)
    open.value = true
    if (!parentCode) {
      getRegionList()
      return
    }
    breadcrumbLoading.value = true
    getRegionByDeviceIdApi(parentCode)
      .then((region) => {
        parentPathList.value.push({
          code: region.commonRegionDeviceId,
          name: region.commonRegionName,
        })
        getRegionList()
      })
      .catch((exception) => {
        console.error(exception)
      })
      .finally(() => {
        breadcrumbLoading.value = false
      })
  }
  const closeModel = () => {
    console.log('onBeforeUnmount')
    open.value = false
  }
  const handleOk = () => {
    // console.log(code)
    // emit('end', code)
    open.value = false
    emit('end', chooseRegion.value)
  }
  // const numValid = (index) => {
  //   allVal.value[index].val = allVal.value[index].val.replace(/[^0-9]/g, '')
  // }

  defineExpose({ openModel })
</script>
<style>
  .show-code-item {
    text-align: center;
    font-size: 3rem;
  }
</style>
