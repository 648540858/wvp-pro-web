<template>
  <a-modal
    ref="playerRef"
    v-model:visible="open"
    :title="title"
    width="65vw"
    :wrap-style="{ overflow: 'hidden' }"
    :footer="null"
  >
    <a-row>
      <a-col :span="18">
        <Jessibuca ref="jessibuca" :play-url="playUrl" :hasAudio="false" />
      </a-col>
      <a-col :span="6">
        <a-tabs style="width: 100%" centered size="small">
          <a-tab-pane key="1" tab="信息">
            <a-descriptions>
              <a-descriptions-item v-if="videoTrack" label="视频编码">{{
                videoTrack.codec_id_name ? videoTrack.codec_id_name : ''
              }}</a-descriptions-item>
              <a-descriptions-item v-if="videoTrack" label="分辨率"
                >{{ videoTrack.width }}x{{ videoTrack.height }}</a-descriptions-item
              >
              <a-descriptions-item v-if="videoTrack" label="FPS">{{ videoTrack.fps }}</a-descriptions-item>
              <a-descriptions-item v-if="videoTrack" label="gop间隔时间(毫秒)">
                {{ videoTrack.gop_interval_ms }}
              </a-descriptions-item>
              <a-descriptions-item v-if="videoTrack" label="gop大小(帧数)">
                {{ videoTrack.gop_size }}
              </a-descriptions-item>
              <a-descriptions-item v-if="videoTrack" label="累计接收关键帧数">
                {{ videoTrack.key_frames }}
              </a-descriptions-item>
              <a-descriptions-item v-if="videoTrack" label="视频丢包率">{{ videoTrack.loss }}</a-descriptions-item>
              <a-descriptions-item v-if="audioTrack" label="音频编码">
                {{ audioTrack.codec_id_name }}
              </a-descriptions-item>
              <a-descriptions-item v-if="audioTrack" label="音频采样位数">
                {{ audioTrack.sample_bit }}
              </a-descriptions-item>
              <a-descriptions-item v-if="audioTrack" label="采样率">{{ audioTrack.sample_rate }}</a-descriptions-item>
              <a-descriptions-item v-if="audioTrack" label="音频丢包率">{{ audioTrack.loss }}</a-descriptions-item>
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

  const open = ref<boolean>(false)
  let playUrl = ref<String>()
  let videoTrack = ref<Track>()
  let audioTrack = ref<Track>()
  let title = ref<String>()
  const jessibuca = ref()
  const play = (streamInfoParam: StreamInfo, name: string) => {
    title.value = name
    if (streamInfoParam.tracks.length > 0) {
      console.log(streamInfoParam.tracks)
      console.log(streamInfoParam.tracks.length)
      for (let i = 0; i < streamInfoParam.tracks.length; i++) {
        console.log(streamInfoParam.tracks[i].codec_type)
        console.log(streamInfoParam.tracks[i].codec_type == 0)
        if (streamInfoParam.tracks[i].codec_type == 0) {
          videoTrack.value = streamInfoParam.tracks[i]
          console.log('videoTrack.value')
          console.log(videoTrack)
        } else {
          audioTrack.value = streamInfoParam.tracks[i]
          console.log('audioTrack.value')
          console.log(audioTrack)
        }
      }
    }
    playUrl.value = streamInfoParam.ws_flv
    open.value = true
  }
  // 存活时间，单位秒
  let aliveSecond = ref<number>()
  // 观看总人数
  let totalReaderCount = ref<number>()
  // 数据产生速度，单位byte/s
  let bytesSpeed = ref<number>()

  defineExpose({ play })
</script>
