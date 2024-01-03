<template>
  <a-modal
    ref="recordDownloadRef"
    v-model:visible="open"
    :title="title"
    width="40vw"
    :maskClosable="false"
    :keyboard="false"
    :wrap-style="{ overflow: 'hidden' }"
    @cancel="closeModel"
    :footer="null"
  >
    <div v-if="!downloadIng" class="time-picker-box">
      <a-space>
        <a-range-picker v-model:value="rangeValue" show-time />
        <a-button @click="startDownloadBtnClick">开始</a-button>
      </a-space>
    </div>
    <div v-if="downloadIng" class="show-progress">
      <a-space size="50">
        <div style="width: 30vw">
          <a-progress :percent="percent" />
        </div>
        <a-button
          :disabled="percent != 100.0"
          @click="downloadFileClientEvent"
          style="margin-left: 24px"
        >
          下载
        </a-button>
      </a-space>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import {
    Modal as AModal,
    RangePicker as ARangePicker,
    Progress as AProgress,
    Button as AButton,
    Space as ASpace,
    message,
  } from 'ant-design-vue'
  import dayjs, { Dayjs } from 'dayjs'
  import { downloadDeviceRecordApi, getProgressApi } from '/@/api/resource/gbResource'
  import { StreamInfo } from '/@/api/model/baseModel'
  type RangeValue = [Dayjs, Dayjs]

  const title = ref<string>('开始下载')
  const percent = ref<string>('0')
  const open = ref<boolean>(false)
  const downloadIng = ref<boolean>(false)
  const rangeValue = ref<RangeValue>([dayjs(), dayjs()])
  const deviceId = ref<string>('')
  const channelId = ref<string>('')
  const streamInfo = ref<StreamInfo | null>(null)
  const downloadFilePath = ref<string | null>(null)

  const getProgress = (callback: Function) => {
    if (streamInfo.value == null) {
      message.info('下载失败')
      closeModel()
      return
    }
    getProgressApi(deviceId.value, channelId.value, streamInfo.value?.stream).then(
      (progressStreamInfo) => {
        streamInfo.value = progressStreamInfo
        if (parseFloat(progressStreamInfo.progress) == 1) {
          percent.value = '100.0'
        } else {
          percent.value = (parseFloat(progressStreamInfo.progress) * 100).toFixed(1)
        }
        if (progressStreamInfo.downLoadFilePath && parseFloat(progressStreamInfo.progress) == 1) {
          if (location.protocol === 'https:') {
            downloadFilePath.value = progressStreamInfo.downLoadFilePath.httpsPath
          } else {
            downloadFilePath.value = progressStreamInfo.downLoadFilePath.httpPath
          }
          downloadFileClientEvent()
        } else {
          if (callback) callback()
        }
      },
    )
  }
  const downloadFileClientEvent = () => {
    // window.open(this.downloadFile )
    if (downloadFilePath.value == null) {
      return
    }
    let x = new XMLHttpRequest()
    x.open('GET', downloadFilePath.value, true)
    x.responseType = 'blob'
    x.onload = () => {
      let url = window.URL.createObjectURL(x.response)
      let a = document.createElement('a')
      a.href = url
      a.download = deviceId.value + '-' + channelId.value + '.mp4'
      a.click()
    }
    x.send()
  }
  const getProgressTimer = () => {
    if (!downloadIng.value) {
      return
    }
    if (percent.value == '100.0') {
      return
    }
    setTimeout(() => {
      if (!open.value) return
      getProgress(getProgressTimer)
    }, 5000)
  }

  const startDownload = () => {
    let timeDiff = rangeValue.value[1].diff(rangeValue.value[0])
    // 下载的视频时长要大于一秒
    if (timeDiff < 1000) {
      message.info('请选择合适的时长')
      return
    }
    downloadDeviceRecordApi(
      deviceId.value,
      channelId.value,
      rangeValue.value[0].format('YYYY-MM-DD HH:mm:ss'),
      rangeValue.value[1].format('YYYY-MM-DD HH:mm:ss'),
      4,
    )
      .then((streamInfoResult) => {
        streamInfo.value = streamInfoResult
        downloadIng.value = true
        getProgressTimer()
      })
      .catch((e) => {
        message.error(e)
      })
  }
  const stopDownload = () => {}
  const startDownloadBtnClick = () => {
    startDownload()
  }

  const openModel = (
    deviceIdParam: string,
    channelIdParam: string,
    startTimeParam: string,
    endTimeParam: string,
  ) => {
    open.value = true
    percent.value = '0'
    deviceId.value = deviceIdParam
    channelId.value = channelIdParam
    rangeValue.value[0] = dayjs(startTimeParam)
    rangeValue.value[1] = dayjs(endTimeParam)
    downloadIng.value = false
  }
  const closeModel = () => {
    open.value = false
    stopDownload()
    deviceId.value = ''
    channelId.value = ''
    rangeValue.value[0] = dayjs()
    rangeValue.value[1] = dayjs()
    downloadIng.value = false
  }

  defineExpose({ openModel })
</script>
<style>
  .time-picker-box {
    display: flex;
    align-items: center;
    padding: 2rem;
    justify-content: space-evenly;
  }
  .show-progress {
    padding: 2rem;
    display: flex;
    justify-content: space-evenly;
  }
</style>
