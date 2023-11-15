<template>
  <a-modal
    ref="editRegion"
    v-model:visible="open"
    :title="title"
    width="30rem"
    :wrap-style="{ overflow: 'hidden' }"
    @cancel="closeModel"
    @ok="handleOk"
  >
    <a-form
      :model="region"
      name="basic"
      :label-col="{ span: 4 }"
      autocomplete="off"
      style="margin-top: 2rem"
    >
      <a-form-item
        label="编码"
        name="commonRegionDeviceId"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="region.commonRegionDeviceId" style="width: 20rem" />
      </a-form-item>

      <a-form-item
        label="名称"
        name="commonRegionName"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input v-model:value="region.commonRegionName" style="width: 20rem" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { Modal as AModal, Form as AForm, FormItem as AFormItem } from 'ant-design-vue'
  import { Region } from '/@/api/resource/model/regionModel'
  import {addRegionApi, deleteRegionApi, updateRegionApi} from '/@/api/resource/region'

  const open = ref<boolean>(false)
  const title = ref<string>('')
  const region = ref<Region>({
    // 数据库自增ID
    commonRegionId: -1,
    // 区域国标编号
    commonRegionDeviceId: '',
    // 区域名称
    commonRegionName: '',
    // 父区域国标ID
    commonRegionParentId: '',
  })

  let endFnCallback: Function
  const openModel = (groupParam: Region, endFn: Function) => {
    open.value = true
    endFnCallback = endFn
    if (groupParam.commonRegionId > 0) {
      title.value = '编辑分组'
      region.value = groupParam
    } else {
      title.value = '添加分组'
      region.value.commonRegionId = -1
      region.value.commonRegionDeviceId = ''
      region.value.commonRegionName = ''
      region.value.commonRegionParentId = groupParam.commonRegionParentId
    }
  }
  const closeModel = () => {
    console.log('onBeforeUnmount')
    open.value = false
    title.value = ''
  }
  const handleOk = () => {
    console.log('onBeforeUnmount')
    if (region.value.commonRegionId > 0) {
      updateRegionApi(region.value)
        .then((result) => {
          console.log(result)
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => {
          open.value = false
          endFnCallback(region.value)
        })
    } else {
      addRegionApi(region.value)
        .then((result) => {
          console.log(result)
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => {
          open.value = false
          endFnCallback(region.value)
        })
    }
  }

  defineExpose({ openModel })
</script>
