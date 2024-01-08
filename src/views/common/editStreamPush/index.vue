<template>
  <a-modal
    ref="editStreamPush"
    v-model:visible="open"
    :title="title"
    width="30rem"
    :wrap-style="{ overflow: 'hidden' }"
    @cancel="closeModel"
    @ok="handleOk"
  >
    <a-form
      :model="pushModel"
      name="basic"
      :label-col="{ span: 6 }"
      autocomplete="off"
      style="margin: 2rem auto 0 auto"
    >
      <a-form-item label="名称" name="name">
        <a-input v-model:value="pushModel.name" style="width: 16rem" />
      </a-form-item>
      <a-form-item label="应用名" name="app">
        <a-input v-model:value="pushModel.app" style="width: 16rem" :disabled="edit" />
      </a-form-item>
      <a-form-item label="流id" name="stream">
        <a-input v-model:value="pushModel.stream" style="width: 16rem" :disabled="edit" />
      </a-form-item>
      <a-form-item label="国标ID" name="gbId">
        <a-input-group compact style="width: 16rem">
          <a-input
            v-model:value="pushModel.gbId"
            clearable
            placeholder="国标ID"
            style="width: calc(100% - 63px)"
          />
          <a-button @click="getChannelCode">生成</a-button>
        </a-input-group>
      </a-form-item>
      <a-form-item label="经度" name="longitude">
        <a-input v-model:value="pushModel.longitude" style="width: 16rem" />
      </a-form-item>
      <a-form-item label="纬度" name="latitude">
        <a-input v-model:value="pushModel.latitude" style="width: 16rem" />
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-switch v-model:checked="pushModel.status" />
      </a-form-item>
    </a-form>
  </a-modal>
  <ChannelCode ref="channelCodeRef" @end="getChannelCodeEnd" />
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import {
    Modal as AModal,
    Form as AForm,
    FormItem as AFormItem,
    Switch as ASwitch,
  } from 'ant-design-vue'
  import { PushModel } from '/@/api/resource/model/pushModel'
  import ChannelCode from '/@/views/common/ChannelCode/index.vue'
  import { addPushApi, updatePushApi } from '/@/api/resource/push'

  const open = ref<boolean>(false)
  const edit = ref<boolean>(false)
  const title = ref<string>('')
  const channelCodeRef = ref()
  const pushInitModel: PushModel = {
    //  名称
    name: '',
    //  应用名
    app: '',
    // 流id
    stream: '',
    // 国标ID
    gbId: '',
    // 经度
    longitude: 0,
    // 纬度
    latitude: 0,
    // 状态
    status: false,
  }
  const pushModel = ref<PushModel>(pushInitModel)

  let endFnCallback: Function
  const openModel = (pushModelParam: PushModel, endFn: Function) => {
    open.value = true
    endFnCallback = endFn
    if (pushModelParam && pushModelParam.id) {
      title.value = '编辑推流'
      edit.value = true
      pushModel.value = pushModelParam
    } else {
      title.value = '添加推流'
      edit.value = false
      pushModel.value = pushInitModel
    }
  }
  const closeModel = () => {
    console.log('onBeforeUnmount')
    open.value = false
    title.value = ''
  }
  const getChannelCodeEnd = (code: string) => {
    pushModel.value.gbId = code
  }
  const getChannelCode = () => {
    channelCodeRef.value.openModel()
  }
  const handleOk = () => {
    console.log('onBeforeUnmount')
    if (edit.value) {
      updatePushApi(pushModel.value)
        .then((result) => {
          console.log(result)
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => {
          open.value = false
          endFnCallback(pushModel.value)
        })
    } else {
      addPushApi(pushModel.value)
        .then((result) => {
          console.log(result)
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => {
          open.value = false
          endFnCallback(pushModel.value)
        })
    }
  }
  defineExpose({ openModel })
</script>
