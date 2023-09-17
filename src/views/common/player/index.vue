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
      <a-col :span="18">
        <Jessibuca ref="jessibuca" :play-url="playUrl" :hasAudio="false" />
      </a-col>
      <a-col :span="6">
        <a-tabs style="width: 100%" centered size="small">
          <a-tab-pane key="1" tab="信息" style="padding: 1rem">
            <a-descriptions v-if="videoTrack" :column="2" title="视频信息">
              <a-descriptions-item label="编码">{{ videoTrack.codec_id_name }}</a-descriptions-item>
              <a-descriptions-item label="分辨率"
                >{{ videoTrack.width }}x{{ videoTrack.height }}</a-descriptions-item
              >
              <a-descriptions-item label="FPS">{{ videoTrack.fps }}</a-descriptions-item>
              <a-descriptions-item label="gop间隔时间(毫秒)">
                {{ videoTrack.gop_interval_ms }}
              </a-descriptions-item>
              <a-descriptions-item label="gop大小(帧数)">
                {{ videoTrack.gop_size }}
              </a-descriptions-item>
              <a-descriptions-item label="累计接收关键帧数">
                {{ videoTrack.key_frames }}
              </a-descriptions-item>
              <a-descriptions-item label="丢包率">{{ videoTrack.loss }}</a-descriptions-item>
            </a-descriptions>
            <a-descriptions v-if="audioTrack" :column="2" title="音频信息">
              <a-descriptions-item label="编码">
                {{ audioTrack.codec_id_name }}
              </a-descriptions-item>
              <a-descriptions-item label="采样位数">
                {{ audioTrack.sample_bit }}
              </a-descriptions-item>
              <a-descriptions-item label="采样率">{{ audioTrack.sample_rate }}</a-descriptions-item>
              <a-descriptions-item label="丢包率">{{ audioTrack.loss }}</a-descriptions-item>
            </a-descriptions>
            <a-descriptions :column="2" title="概况">
              <a-descriptions-item label="数据产生速度">{{ bytesSpeed }}</a-descriptions-item>
              <a-descriptions-item label="持续时间">{{ aliveSecond }}</a-descriptions-item>
              <a-descriptions-item label="观看总人数">{{ totalReaderCount }}</a-descriptions-item>
            </a-descriptions>
          </a-tab-pane>
          <a-tab-pane key="2" tab="控制">控制</a-tab-pane>
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
  import axios from 'axios'

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
  // 存活时间，单位秒
  let aliveSecond = ref<number>()
  // 观看总人数
  let totalReaderCount = ref<number>()
  // 数据产生速度，单位byte/s
  let bytesSpeed = ref<number>()
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
    axios({
      method: 'get',
      url: `${import.meta.env.VITE_GLOB_API_URL}/zlm/${
        streamInfo.mediaServerId
      }/index/api/getMediaInfo`,
      params: {
        app: streamInfo.app,
        stream: streamInfo.stream,
        schema: 'rtsp',
        vhost: '__defaultVhost__',
      },
    })
      .then((res) => {
        console.log(res)
        if (res.data.code === 0) {
          let streamInfoParam = res.data as StreamInfo
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
      .catch((error) => {
        console.log(error)
      })
  }

  defineExpose({ play })
</script>
