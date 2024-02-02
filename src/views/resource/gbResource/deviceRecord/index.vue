<template>
  <div id="deviceRecord" style="width: 100%; height: 100%">
    <a-card :bodyStyle="recordListStyle">
      <div style="width: 100%; height: 2rem; display: flex; align-items: center; padding: 5px">
        <a-button type="link" size="small" @click="back()" style="color: #000">
          <template #icon>
            <Icon icon="material-symbols:arrow-back" />
          </template>
        </a-button>
        <BasicTitle>国标录像</BasicTitle>
        <a-button
          shape="circle"
          type="primary"
          size="small"
          @click="downloadBtnClick()"
          style="margin-left: calc(100% - 347px)"
        >
          <template #icon>
            <Icon icon="material-symbols:download" />
          </template>
        </a-button>
      </div>
      <div class="device-record-box">
        <div class="player-box">
          <div class="player-box-content">
            <Jessibuca
              ref="jessibuca"
              :play-url="playUrl"
              :hasAudio="hasAudio"
              @pause="playerPause()"
              @play="playerPlay()"
              @stop="playerStop()"
            />
          </div>
          <div style="width: 100%; height: 100px; padding: 8px 0">
            <TimeLine
              ref="timeLineRef"
              :initTime="initTime"
              @dragTimeChange="timeChange"
              @click_timeline="chooseTimeLine"
              :timeSegments="timeSegments"
              :showHoverTime="true"
              initZoomIndex="5"
              backgroundColor="rgb(0, 12, 23)"
            />
          </div>
        </div>
        <div class="info-box">
          <a-list class="record-list" :split="false">
            <template #header>
              <a-date-picker v-model:value="recordDate" @change="recordDateChange" size="small" />
            </template>
            <a-list-item v-for="item in recordList">
              <a-tag
                :color="getTagColor(item)"
                style="cursor: pointer"
                @click="chooseRecordItem(item)"
              >
                <Icon icon="solar:videocamera-record-linear" />
                {{
                  dayjs(item.startTime).format('HH:mm:ss') +
                  '-' +
                  dayjs(item.endTime).format('HH:mm:ss')
                }}
              </a-tag>
              <a-button
                type="link"
                size="small"
                @click="itemDownloadBrnClick(item)"
                style="color: #000"
              >
                <template #icon>
                  <Icon icon="material-symbols:download" />
                </template>
              </a-button>
            </a-list-item>
          </a-list>
        </div>
      </div>
    </a-card>
  </div>
  <RecordDownload ref="recordDownloadRef" />
</template>
<script lang="ts" setup>
  import {
    DatePicker as ADatePicker,
    List as AList,
    ListItem as AListItem,
    Tag as ATag,
    Card as ACard,
    Button as AButton,
    message,
  } from 'ant-design-vue'
  import { onMounted, ref } from 'vue'
  import dayjs, { Dayjs } from 'dayjs'
  import {
    pauseControlApi,
    playbackApi,
    playControlApi,
    queryDeviceRecordApi,
    stopPlayBackApi,
  } from '/@/api/resource/gbResource'
  import { RecordInfo, RecordItem } from '/@/api/resource/model/gbResourceModel'
  import { Icon } from '/@/components/Icon'
  import Jessibuca from '/@/views/common/player/module/jessibuca.vue'
  import { BasicTitle } from '/@/components/Basic'
  import { TimeLine } from '/@/components/TimeLine'
  import RecordDownload from '/@/views/resource/gbResource/recordDownload/index.vue'
  import { StreamInfo } from '/@/api/model/baseModel'

  const props = defineProps({
    deviceId: {
      type: String,
      required: true,
    },
    channelId: {
      type: String,
      required: true,
    },
  })
  const emit = defineEmits(['close'])
  const recordDownloadRef = ref()
  const timeLineRef = ref()

  const recordDate = ref<Dayjs>(dayjs())
  const recordList = ref<RecordItem[]>()
  const playUrl = ref<string>()
  const hasAudio = ref<boolean>(false)

  let chooseRecord: RecordItem | null = null
  let streamInfo: StreamInfo | null = null
  let currentStarTime: string | null = null
  const initTime = ref<string>()
  const timeSegments = ref<any[]>([])
  const timeChange = (time: string) => {
    console.log(time)
    let dayItem = dayjs(time)
    let startTime = dayItem.format('YYYY-MM-DD HH:mm:ss')
    let stopTime = dayItem.add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
    play(startTime, stopTime)
  }
  const chooseTimeLine = (time: string, date: string) => {
    let dayItem = dayjs(date)
    timeLineRef.value.setTime(time)
    let stopTime = dayItem.add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
    play(date, stopTime)
  }
  const recordListStyle = ref({
    height: '600px',
    padding: '10px',
  })
  onMounted(() => {
    var element = document.getElementById('deviceRecord')
    if (element) {
      recordListStyle.value.height = element.clientHeight - 32 + 'px'
    }
  })

  const getRecordList = () => {
    let date = recordDate.value.format('YYYY-MM-DD')
    let startTime = date + ' 00:00:00'
    let endTime = recordDate.value.add(1, 'day').format('YYYY-MM-DD') + ' 00:00:00'
    queryDeviceRecordApi(props.deviceId, props.channelId, startTime, endTime)
      .then((result: RecordInfo) => {
        if (result.recordList.length > 0) {
          recordList.value = result.recordList
          initTime.value = result.recordList[0].startTime
          currentStarTime = result.recordList[0].startTime
          timeSegments.value = []
          for (let i = 0; i < result.recordList.length; i++) {
            let record = result.recordList[i]
            timeSegments.value.push({
              name: record.name,
              beginTime: new Date(record.startTime).getTime(),
              endTime: new Date(record.endTime).getTime(),
              color: '#1a94bc',
              startRatio: 0.65,
              endRatio: 0.9,
            })
          }
        }
      })
      .catch((e) => {
        message.error(e)
      })
  }
  const recordDateChange = () => {
    console.log(recordDate.value.format('YYYY-MM-DD'))
    getRecordList()
  }
  const back = () => {
    // 通知父组件
    emit('close')
  }
  const chooseRecordItem = (record: RecordItem) => {
    chooseRecord = record
    initTime.value = record.startTime
    timeLineRef.value.setTime(record.startTime)
    play(record.startTime, record.endTime)
  }
  const getTagColor = (record: RecordItem) => {
    if (record.startTime === chooseRecord?.startTime) {
      return 'red'
    } else {
      return 'blue'
    }
  }
  const getUrlByStreamInfo = () => {
    if (location.protocol === 'https:') {
      return streamInfo?.wss_flv
    } else {
      return streamInfo?.ws_flv
    }
  }
  const playerPlay = () => {
    if (streamInfo != null) {
      playControlApi(streamInfo.stream)
    }
  }
  const playerPause = () => {
    console.log('======playerPause')
    if (streamInfo != null) {
      pauseControlApi(streamInfo.stream)
    }
  }
  const playerStop = () => {
    console.log('======playerStop')
    if (streamInfo != null) {
      stopPlayBackApi(props.deviceId, props.channelId, streamInfo.stream)
      streamInfo = null
    }
  }
  const play = (startTime: string, stopTime: string) => {
    console.log('======play')
    if (streamInfo != null) {
      stopPlayBackApi(props.deviceId, props.channelId, streamInfo.stream).finally(() => {
        streamInfo = null
        playbackApi(props.deviceId, props.channelId, startTime, stopTime)
          .then((result: StreamInfo) => {
            streamInfo = result
            currentStarTime = startTime
            playUrl.value = getUrlByStreamInfo()
          })
          .catch((e) => {
            message.error(e)
          })
      })
    } else {
      playbackApi(props.deviceId, props.channelId, startTime, stopTime)
        .then((result: StreamInfo) => {
          streamInfo = result
          playUrl.value = getUrlByStreamInfo()
        })
        .catch((e) => {
          message.error(e)
        })
    }
  }
  const downloadBtnClick = () => {
    // 默认下载十分钟视频, 基于当前时间设置结束时间
    let dayItem = dayjs(currentStarTime)
    let startTime = dayItem.format('YYYY-MM-DD HH:mm:ss')
    let stopTime = dayItem.add(10, 'minute').format('YYYY-MM-DD HH:mm:ss')
    console.log(currentStarTime)
    console.log(startTime)
    console.log(stopTime)
    recordDownloadRef.value.openModel(props.deviceId, props.channelId, startTime, stopTime)
  }
  const itemDownloadBrnClick = (item: RecordItem) => {
    recordDownloadRef.value.openModel(props.deviceId, props.channelId, item.startTime, item.endTime)
  }
  getRecordList()
</script>
<style>
  #deviceRecord {
    width: 100%;
    height: 100%;
    padding: 1rem;
    overflow: auto;
  }
  .device-record-box {
    display: flex;
    width: 100%;
    height: calc(100% - 24px);
  }
  .info-box {
    width: 200px;
    height: 100%;
    padding: 0 10px;
  }
  .player-box {
    width: calc(100% - 200px);
    height: 100%;
    padding: 0 2rem;
  }
  .player-box-content {
    width: 100%;
    height: calc(100% - 100px);
  }
  .record-list {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>
