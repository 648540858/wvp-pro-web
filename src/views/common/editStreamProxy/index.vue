<template>
  <a-modal
    ref="editStreamProxy"
    v-model:visible="open"
    :title="title"
    width="50rem"
    :wrap-style="{ overflow: 'hidden' }"
    @cancel="closeModel"
    @ok="handleOk"
  >
    <a-form
      :model="proxyModel"
      name="basic"
      :label-col="{ span: 7 }"
      autocomplete="off"
      style="margin: 2rem auto 0 auto"
    >
      <div style="display: flex">
        <div style="width: 50%; padding-right: 5rem">
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
        </div>
        <div style="width: 50%; padding-right: 5rem">
          <a-form-item label="类型" name="name">
            <a-select
              v-model:value="proxyModel.type"
              placeholder="请选择代理类型"
              style="width: 16rem"
            >
              <a-select-option value="default">默认</a-select-option>
              <a-select-option value="ffmpeg">FFMPEG</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="拉流地址" name="url">
            <a-input v-model:value="proxyModel.url" style="width: 16rem" />
          </a-form-item>
          <a-form-item label="超时时间:毫秒" name="timeoutMs" v-if="proxyModel.type == 'ffmpeg'">
            <a-input v-model:value="proxyModel.timeoutMs" style="width: 16rem" />
          </a-form-item>
          <a-form-item label="节点选择" name="mediaServerId">
            <MediaServerSelect
              v-model="proxyModel.mediaServerId"
              :show-all="false"
              size="default"
              @change="mediaServerIdChange"
              style="width: 16rem"
            />
          </a-form-item>
          <a-form-item label="命令模板" name="ffmpegCmdKey" v-if="proxyModel.type == 'ffmpeg'">
            <a-select
              v-model:value="proxyModel.ffmpegCmdKey"
              placeholder="请选择模板"
              style="width: 16rem"
            >
              <a-select-option v-for="item in cmdList" :value="item.key" :key="item.key">
                {{item.value}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="目标流地址" name="dstUrl" v-if="proxyModel.type == 'ffmpeg'">
            <a-input v-model:value="proxyModel.dstUrl" style="width: 16rem" @change="dstUrlChange" />
          </a-form-item>
        </div>
      </div>
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
  import { ProxyModel } from '/@/api/resource/model/proxyModel'
  import MediaServerSelect from '/@/views/common/mediaServerSelect/index.vue'
  import { queryFfmpegCMDListApi } from '/@/api/mediaServer/mediaServer'
  import { FFmpegCmdInfo } from '/@/api/mediaServer/model/MediaServer'

  const open = ref<boolean>(false)
  const edit = ref<boolean>(false)
  const title = ref<string>('')
  const channelCodeRef = ref()
  const cmdList = ref<FFmpegCmdInfo[]>([])
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
  const mediaServerIdChange = (mediaServerId: string) => {
    // 查询ffmpeg.cmd列表
    queryFfmpegCMDListApi(mediaServerId).then((cmdArray) => {
      cmdList.value = cmdArray
    })
  }
  const dstUrlChange = () => {
    const url = new URL(proxyModel.value.dstUrl)
    url.protocol = 'http:'
    const pathname = url.pathname
    const app = pathname.substring(1, pathname.indexOf('/', 2))
    const stream = pathname.substring(pathname.indexOf('/', 2) + 1)
    proxyModel.value.app = app
    proxyModel.value.stream = stream
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
