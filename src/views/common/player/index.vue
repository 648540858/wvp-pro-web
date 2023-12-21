<template>
  <a-modal
    ref="playerRef"
    v-model:visible="open"
    :title="title"
    width="65vw"
    :wrap-style="{ overflow: 'hidden' }"
    @cancel="closeModel"
    :footer="null"
  >
    <a-row>
      <a-col style="width: 48vw">
        <a-tabs style="width: 100%; height: 32vw" size="small" type="card">
          <a-tab-pane key="1" tab="Jessibuca" style="width: 100%; height: 32vw">
            <Jessibuca ref="jessibuca" :play-url="playUrl" :width="videoTrack.width" :height="videoTrack.height" :hasAudio="false" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="WebRTC" style="width: 100%; height: 30vw">

          </a-tab-pane>
          <a-tab-pane key="3" tab="Video标签" style="width: 100%; height: 30vw">

          </a-tab-pane>
          <a-tab-pane key="4" tab="HLS" style="width: 100%; height: 30vw">

          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col style="width: 17vw">
        <a-tabs style="width: 100%" size="small" type="card">
          <a-tab-pane key="1" tab="信息" style="padding: 0 1rem 0 1rem; height: 28vw">
            <a-descriptions :column="2" title="概况" :labelStyle="{ fontsize: '12px' }">
              <a-descriptions-item label="观看人数">{{ totalReaderCount }}</a-descriptions-item>
              <a-descriptions-item label="网络">{{ formatByteSpeed() }}</a-descriptions-item>
              <a-descriptions-item label="持续时间">{{ formatAliveSecond() }}</a-descriptions-item>
            </a-descriptions>
            <a-descriptions v-if="!!videoTrack" :column="2" title="视频信息">
              <a-descriptions-item label="编码">{{ videoTrack.codec_id_name }}</a-descriptions-item>
              <a-descriptions-item label="分辨率"
                >{{ videoTrack.width }}x{{ videoTrack.height }}
              </a-descriptions-item>
              <a-descriptions-item label="FPS">{{ videoTrack.fps }}</a-descriptions-item>
              <a-descriptions-item label="gop间隔">
                {{ videoTrack.gop_interval_ms }}ms
              </a-descriptions-item>
              <a-descriptions-item label="gop大小">
                {{ videoTrack.gop_size }}帧
              </a-descriptions-item>
              <a-descriptions-item label="关键帧数">
                {{ videoTrack.key_frames }}
              </a-descriptions-item>
              <a-descriptions-item label="丢包率">{{ videoTrack.loss }}</a-descriptions-item>
            </a-descriptions>
            <a-descriptions v-if="!!audioTrack" :column="2" title="音频信息" style="width: 100%">
              <a-descriptions-item label="编码">
                {{ audioTrack.codec_id_name }}
              </a-descriptions-item>
              <a-descriptions-item label="采样位数">
                {{ audioTrack.sample_bit }}
              </a-descriptions-item>
              <a-descriptions-item label="采样率">{{ audioTrack.sample_rate }}</a-descriptions-item>
              <a-descriptions-item label="丢包率">{{ audioTrack.loss }}</a-descriptions-item>
            </a-descriptions>
          </a-tab-pane>
          <a-tab-pane
            key="2"
            tab="云台控制"
            style="padding: 0 1rem 0 1rem; height: 25vw; overflow: scroll"
          >
            <ptz @ptz-camera="ptzCamera" />
          </a-tab-pane>
          <a-tab-pane
            key="3"
            tab="其他控制"
            style="padding: 0 1rem 0 1rem; height: 25vw; overflow: scroll"
          >
            11
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script lang="ts" setup>
  import { StreamInfo, Track } from '/@/api/model/baseModel'
  import { ref } from 'vue'
  import {
    Modal as AModal,
    Row as ARow,
    Col as ACol,
    Tabs as ATabs,
    TabPane as ATabPane,
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
  } from 'ant-design-vue'
  import Jessibuca from './module/jessibuca.vue'
  import { getMediaInfoApi } from '/@/api/resource/gbResource'
  import Ptz from '../ptz/index.vue'

  const open = ref<boolean>(false)
  let playUrl = ref<String>()
  let videoTrack = ref<Track>()
  let audioTrack = ref<Track>()
  let title = ref<String>()
  let timer = 0
  let streamInfo: StreamInfo
  const jessibuca = ref()

  const play = (streamInfoParam: StreamInfo, name: string) => {
    title.value = name
    streamInfo = streamInfoParam
    if (streamInfoParam.tracks.length > 0) {
      for (let i = 0; i < streamInfoParam.tracks.length; i++) {
        if (streamInfoParam.tracks[i].codec_type == 0) {
          videoTrack.value = streamInfoParam.tracks[i]
        } else {
          audioTrack.value = streamInfoParam.tracks[i]
        }
      }
    }
    playUrl.value = streamInfoParam.ws_flv
    open.value = true
    timer = window.setInterval(() => {
      refreshStreamInfo()
    }, 1000)
  }
  const emit = defineEmits(['ptzCamera'])
  const ptzCamera = (comond: string, speed: number) => {
    emit('ptzCamera', comond, speed)
  }
  // 存活时间，单位秒
  let aliveSecond = ref<number>(0)
  // 观看总人数
  let totalReaderCount = ref<number>(0)
  // 数据产生速度，单位byte/s
  let bytesSpeed = ref<number>(0)
  const closeModel = () => {
    console.log('onBeforeUnmount')
    open.value = false
    playUrl.value = ''
    title.value = ''
    videoTrack.value = undefined
    audioTrack.value = undefined
    jessibuca.value = undefined
    aliveSecond.value = 0
    totalReaderCount.value = 0
    bytesSpeed.value = 0
    window.clearInterval(timer)
  }

  const refreshStreamInfo = () => {
    getMediaInfoApi(streamInfo.mediaServerId, streamInfo.app, streamInfo.stream)
      .then((result) => {
        if (result.code === 0) {
          let streamInfoParam = result as StreamInfo
          if (streamInfoParam.tracks.length > 0) {
            for (let i = 0; i < streamInfoParam.tracks.length; i++) {
              if (streamInfoParam.tracks[i].codec_type == 0) {
                videoTrack.value = streamInfoParam.tracks[i]
              } else {
                audioTrack.value = streamInfoParam.tracks[i]
              }
            }
          }
          aliveSecond.value = streamInfoParam.aliveSecond
          totalReaderCount.value = streamInfoParam.totalReaderCount
          bytesSpeed.value = streamInfoParam.bytesSpeed
        }
      })
      .catch((e) => {
        console.error(e)
      })
  }

  const formatByteSpeed = () => {
    var num = 1024.0 //byte
    if (bytesSpeed.value < num) return bytesSpeed.value + ' B/S'
    if (bytesSpeed.value < Math.pow(num, 2)) return (bytesSpeed.value / num).toFixed(2) + ' KB/S' //kb
    if (bytesSpeed.value < Math.pow(num, 3))
      return (bytesSpeed.value / Math.pow(num, 2)).toFixed(2) + ' MB/S' //M
    if (bytesSpeed.value < Math.pow(num, 4))
      return (bytesSpeed.value / Math.pow(num, 3)).toFixed(2) + ' G/S' //G
    return (bytesSpeed.value / Math.pow(num, 4)).toFixed(2) + ' T/S' //T
  }

  const formatAliveSecond = () => {
    const h = parseInt(aliveSecond.value / 3600)
    const minute = parseInt((aliveSecond.value / 60) % 60)
    const second = Math.ceil(aliveSecond.value % 60)

    const hours = h < 10 ? '0' + h : h
    const formatSecond = second > 59 ? 59 : second
    return `${hours > 0 ? `${hours}小时` : ''}${minute < 10 ? '0' + minute : minute}分${
      formatSecond < 10 ? '0' + formatSecond : formatSecond
    }秒`
  }

  defineExpose({ play })
</script>
<style>
  #mediaInfo {
    width: 30%;
    height: 90%;
    position: absolute;
    display: -webkit-box;
    display: -ms-flexbox;
    background: #1a1a1a;
    left: 0;
    top: 0;
    user-select: none;
    z-index: 10;
    padding: 1rem;
    overflow: scroll;
    opacity: 0.7;
  }
  .ant-descriptions-title {
    flex: auto;
    overflow: hidden;
    color: rgba(0, 0, 0, 0.85);
    font-weight: bold;
    font-size: 14px;
    line-height: 1.2;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .ant-descriptions-item-label {
    color: rgba(0, 0, 0, 0.85);
    font-weight: normal;
    font-size: 12px;
    line-height: 1;
    text-align: start;
  }
  .ant-descriptions-item-content {
    flex: 1;
    color: rgba(0, 0, 0, 0.85);
    font-size: 12px;
    line-height: 1;
    word-break: break-word;
    overflow-wrap: break-word;
  }
</style>
