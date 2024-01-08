<template>
  <a-modal
    ref="editStreamProxy"
    v-model:visible="open"
    :title="title"
    width="30rem"
    :wrap-style="{ overflow: 'hidden' }"
    @cancel="closeModel"
    @ok="handleOk"
  >
    <a-form
      :model="proxyModel"
      name="basic"
      :label-col="{ span: 6 }"
      autocomplete="off"
      style="margin: 2rem auto 0 auto"
    >
      <a-select
        v-model:value="proxyModel.type"
        placeholder="请选择代理类型"
        size="small"
        style="width: 10rem"
      >
        <a-select-option value="default">默认</a-select-option>
        <a-select-option value="ffmpeg">FFMPEG</a-select-option>
      </a-select>
      <a-form-item label="名称" name="name">
        <a-input v-model:value="proxyModel.name" style="width: 16rem" />
      </a-form-item>
      <a-form-item label="应用名" name="app">
        <a-input
          v-model:value="proxyModel.app"
          style="width: 16rem"
          :disabled="proxyModel.type == 'ffmpeg'"
        />
      </a-form-item>
      <a-form-item label="流id" name="stream">
        <a-input
          v-model:value="proxyModel.stream"
          style="width: 16rem"
          :disabled="proxyModel.type == 'ffmpeg'"
        />
      </a-form-item>
      <a-form-item label="拉流地址" name="url">
        <a-input v-model:value="proxyModel.url" style="width: 16rem" />
      </a-form-item>
      <a-form-item label="超时时间:毫秒" name="timeoutMs" v-if="proxyModel.type == 'ffmpeg'">
        <a-input v-model:value="proxyModel.timeoutMs" style="width: 16rem" />
      </a-form-item>
      <a-form-item label="节点选择" name="mediaServerId">
        <a-select
          v-model:value="proxyModel.mediaServerId"
          placeholder="请选择节点"
          size="small"
          style="width: 10rem"
        >
          <a-select-option value="default">默认</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="FFmpeg命令模板" name="ffmpegCmdKey">
        <a-select
          v-model:value="proxyModel.ffmpegCmdKey"
          placeholder="请选择模板"
          size="small"
          style="width: 10rem"
        >
          <a-select-option value="default">默认</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="国标ID" name="gbId">
        <a-input-group compact style="width: 16rem">
          <a-input
            v-model:value="proxyModel.gbId"
            clearable
            placeholder="国标ID"
            style="width: calc(100% - 63px)"
          />
          <a-button @click="getChannelCode">生成</a-button>
        </a-input-group>
      </a-form-item>
      <a-form-item label="经度" name="longitude">
        <a-input v-model:value="proxyModel.longitude" style="width: 16rem" />
      </a-form-item>
      <a-form-item label="纬度" name="latitude">
        <a-input v-model:value="proxyModel.latitude" style="width: 16rem" />
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
    Select as ASelect,
    SelectOption as ASelectOption,
  } from 'ant-design-vue'
  import ChannelCode from '/@/views/common/ChannelCode/index.vue'
  import { addPushApi, updatePushApi } from '/@/api/resource/push'
  import { ProxyModel } from '/@/api/resource/model/proxyModel';

  const open = ref<boolean>(false)
  const edit = ref<boolean>(false)
  const title = ref<string>('')
  const channelCodeRef = ref()
  const mediaServerList = ref<Media()
  const proxyInitModel: ProxyModel = {
    //  类型
    type: 'default',
    //  名称
    name: '',
    //  应用名
    app: '',
    // 流id
    stream: '',
    // 使用的流媒体ID
    mediaServerId: '',
    // 使用的服务ID
    url: '',
    // 是否启用
    enable: false,
    // 是否启用音频
    enableAudio: false,
    // 是否录制
    enableMp4: false,
    // 是否 无人观看时删除
    enableRemoveNoneReader: false,
    // 是否 无人观看时自动停用
    enableDisableNoneReader: false,
    // ffmpeg模板KEY
    ffmpegCmdKey: '',
    // 国标ID
    gbId: '',
    // 经度
    longitude: 0,
    // 纬度
    latitude: 0,
  }
  const proxyModel = ref<ProxyModel>(proxyInitModel)

  let endFnCallback: Function
  const openModel = (proxyModelParam: ProxyModel, endFn: Function) => {
    open.value = true
    endFnCallback = endFn
    if (proxyModelParam && proxyModelParam.id) {
      title.value = '编辑推流'
      edit.value = true
      proxyModel.value = proxyModelParam
    } else {
      title.value = '添加推流'
      edit.value = false
      proxyModel.value = proxyInitModel
    }
  }
  const closeModel = () => {
    console.log('onBeforeUnmount')
    open.value = false
    title.value = ''
  }
  const getChannelCodeEnd = (code: string) => {
    proxyModel.value.gbId = code
  }
  const getChannelCode = () => {
    channelCodeRef.value.openModel()
  }
  const handleOk = () => {
    console.log('onBeforeUnmount')
    if (edit.value) {
      updatePushApi(proxyModel.value)
        .then((result) => {
          console.log(result)
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => {
          open.value = false
          endFnCallback(proxyModel.value)
        })
    } else {
      addPushApi(proxyModel.value)
        .then((result) => {
          console.log(result)
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => {
          open.value = false
          endFnCallback(proxyModel.value)
        })
    }
  }
  defineExpose({ openModel })
</script>
