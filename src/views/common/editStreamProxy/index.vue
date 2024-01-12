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
    <a-form :model="proxyModel" name="basic" autocomplete="off" style="margin: 0 auto">
      <div style="padding: 2rem">
        <div style="display: flex">
          <div style="width: 50%">
            <a-form-item label="类型" name="name" :label-col="{ span: 6 }">
              <a-select
                v-model:value="proxyModel.type"
                placeholder="请选择代理类型"
                style="width: 16rem"
              >
                <a-select-option value="default">默认</a-select-option>
                <a-select-option value="ffmpeg">FFMPEG</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="名称" name="name" :label-col="{ span: 6 }">
              <a-input v-model:value="proxyModel.name" placeholder="名称" style="width: 16rem" />
            </a-form-item>
            <a-form-item label="应用名" name="app" :label-col="{ span: 6 }">
              <a-input
                v-model:value="proxyModel.app"
                placeholder="应用名"
                style="width: 16rem"
                :disabled="proxyModel.type == 'ffmpeg'"
              />
            </a-form-item>
            <a-form-item label="流id" name="stream" :label-col="{ span: 6 }">
              <a-input
                v-model:value="proxyModel.stream"
                placeholder="流id"
                style="width: 16rem"
                :disabled="proxyModel.type == 'ffmpeg'"
              />
            </a-form-item>
          </div>
          <div style="width: 50%">
            <a-form-item label="国标ID" name="gbId" :label-col="{ span: 6 }">
              <a-input-group compact style="width: 17rem">
                <a-input
                  v-model:value="proxyModel.gbId"
                  clearable
                  placeholder="国标ID"
                  style="width: calc(100% - 63px)"
                />
                <a-button @click="getChannelCode">生成</a-button>
              </a-input-group>
            </a-form-item>
            <a-form-item label="经度" name="longitude" :label-col="{ span: 6 }">
              <a-input
                v-model:value="proxyModel.longitude"
                placeholder="经度"
                style="width: 17rem"
              />
            </a-form-item>
            <a-form-item label="纬度" name="latitude" :label-col="{ span: 6 }">
              <a-input
                v-model:value="proxyModel.latitude"
                placeholder="纬度"
                style="width: 17rem"
              />
            </a-form-item>
          </div>
        </div>
        <div style="width: 100%">
          <a-form-item label="拉流地址" name="url" :label-col="{ span: 3 }">
            <a-input placeholder="视频源地址" v-model:value="proxyModel.url" />
          </a-form-item>
          <a-form-item
            label="超时时间"
            name="timeoutMs"
            :label-col="{ span: 3 }"
            v-if="proxyModel.type == 'ffmpeg'"
          >
            <a-input placeholder="ffmpeg拉流的超时时间" v-model:value="proxyModel.timeoutMs" />
          </a-form-item>
          <a-form-item label="节点选择" name="mediaServerId" :label-col="{ span: 3 }">
            <MediaServerSelect
              v-model="proxyModel.mediaServerId"
              :show-all="false"
              size="default"
              placeholder="请选择节点"
              @change="mediaServerIdChange"
            />
          </a-form-item>
          <a-form-item
            label="命令模板"
            name="ffmpegCmdKey"
            :label-col="{ span: 3 }"
            v-if="proxyModel.type == 'ffmpeg'"
          >
            <a-select
              style="width: calc(100% - 48px)"
              v-model:value="proxyModel.ffmpegCmdKey"
              placeholder="请选择模板"
            >
              <a-select-option v-for="item in cmdList" :value="item.key" :key="item.key">
                {{ item.value }}
              </a-select-option>
            </a-select>
            <a-button><Icon icon="tabler:copy" /></a-button>
          </a-form-item>
          <a-form-item
            label="目标流地址"
            name="dstUrl"
            :label-col="{ span: 3 }"
            v-if="proxyModel.type == 'ffmpeg'"
          >
            <a-input
              placeholder="指向你所选择的节点的流地址，自动识别出应用名和流ID, 请注意与你选择的模板匹配"
              v-model:value="proxyModel.dstUrl"
              @change="dstUrlChange"
            />
          </a-form-item>
          <a-form-item label="无人观看">
            <a-radio-group v-model:value="noneReader" @change="noneReaderChange">
              <a-radio value="1">停用并移除</a-radio>
              <a-radio value="2">停用</a-radio>
              <a-radio value="3">不做处理</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="其他选项">
            <a-checkbox v-model:checked="proxyModel.enable">启用</a-checkbox>
            <a-checkbox v-model:checked="proxyModel.enableAudio">开启音频</a-checkbox>
            <a-checkbox v-model:checked="proxyModel.enableMp4">录像</a-checkbox>
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
    RadioGroup as ARadioGroup,
    Radio as ARadio,
    Select as ASelect,
    SelectOption as ASelectOption,
    Checkbox as ACheckbox,
    CheckboxGroup as ACheckboxGroup,
  } from 'ant-design-vue'
  import ChannelCode from '/@/views/common/ChannelCode/index.vue'
  import { ProxyModel } from '/@/api/resource/model/proxyModel'
  import MediaServerSelect from '/@/views/common/mediaServerSelect/index.vue'
  import { queryFfmpegCMDListApi } from '/@/api/mediaServer/mediaServer'
  import { FFmpegCmdInfo } from '/@/api/mediaServer/model/MediaServer'
  import Icon from '/@/components/Icon/src/Icon.vue'
  import { addProxyApi, editProxyApi } from '/@/api/resource/proxy';

  const open = ref<boolean>(false)
  const edit = ref<boolean>(false)
  const title = ref<string>('')
  const channelCodeRef = ref()
  const noneReader = ref<string>('2')
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
    enable: true,
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
    // ffmpeg 命令超时时间，毫秒
    timeoutMs: 15000,
    // 国标ID
    gbId: '',
    // 经度
    longitude: 0,
    // 纬度
    latitude: 0,
    dstUrl: '',
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
  const noneReaderChange = () => {
    if (noneReader.value === '1') {
      proxyModel.value.enableRemoveNoneReader = true
      proxyModel.value.enableDisableNoneReader = false
    } else if (noneReader.value === '2') {
      proxyModel.value.enableRemoveNoneReader = false
      proxyModel.value.enableDisableNoneReader = true
    } else if (noneReader.value === '3') {
      proxyModel.value.enableRemoveNoneReader = false
      proxyModel.value.enableDisableNoneReader = false
    }
  }
  const getChannelCode = () => {
    channelCodeRef.value.openModel()
  }
  const handleOk = () => {
    if (edit.value) {
      editProxyApi(proxyModel.value)
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
      addProxyApi(proxyModel.value)
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
