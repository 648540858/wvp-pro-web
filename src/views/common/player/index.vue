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
          <a-tab-pane key="1" tab="信息" />
          <a-tab-pane key="2" tab="控制">控制</a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script lang="ts" setup>
  import { StreamInfo } from '/@/api/model/baseModel'
  import { ref } from 'vue'
  import {
    Modal as AModal,
    Row as ARow,
    Col as ACol,
    Tabs as ATabs,
    TabPane as ATabPane,
  } from 'ant-design-vue'
  import Jessibuca from './module/jessibuca.vue'

  const open = ref<boolean>(false)
  const playUrl = ref<String>()
  const title = ref<String>()
  const jessibuca = ref()
  const play = (streamInfo: StreamInfo, name: string) => {
    console.log(streamInfo.ws_flv)
    open.value = true
    playUrl.value = streamInfo.ws_flv
    title.value= name
  }

  defineExpose({ play })
</script>
