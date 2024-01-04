<template>
  <div id="cloudRecordDetail" style="width: 100%; height: 100%">
    <a-card :bodyStyle="recordListStyle">
      <div style="width: 100%; height: 2rem; display: flex; align-items: center; padding: 5px">
        <a-button type="link" size="small" @click="back()" style="color: #000">
          <template #icon>
            <Icon icon="material-symbols:arrow-back" />
          </template>
        </a-button>
        <BasicTitle>云端录像</BasicTitle>
      </div>
      <div class="device-record-box">
        <div class="player-box">
          <div class="player-box-content">
            <Jessibuca
              ref="jessibuca"
              :play-url="playUrl"
              :hasAudio="hasAudio"
            />
          </div>
          <div style="width: 100%; height: 100px; padding: 8px 0">
            <TimeLine
              ref="timeLineRef"
              :initTime="initTime"
              @dragTimeChange="timeChange"
              :timeSegments="timeSegments"
              :showHoverTime="false"
              initZoomIndex="5"
              backgroundColor="rgb(0, 12, 23)"
            />
          </div>
        </div>
        <div class="info-box">
          <a-list class="record-list" :split="false" ：loading="listLoading">
            <template #header>
              <a-date-picker v-model:value="recordDate" @change="recordDateChange" size="small">
                <template #dateRender="{ current }">
                  <div
                    v-if="hasRecordDate(current.date())"
                    class="ant-picker-cell-inner has-record-date"
                  >
                    {{ current.date() }}
                  </div>
                  <div v-if="!hasRecordDate(current.date())" class="ant-picker-cell-inner">
                    {{ current.date() }}
                  </div>
                </template>
              </a-date-picker>
            </template>
            <template #loadMore>
              <div
                v-if="!listLoading"
                :style="{
                  textAlign: 'center',
                  marginTop: '12px',
                  height: '32px',
                  lineHeight: '32px',
                }"
              >
                <a-button @click="onLoadMore">loading more</a-button>
              </div>
            </template>
            <a-list-item v-for="item in recordList">
              <a-tag
                :color="getTagColor(item)"
                style="cursor: pointer"
                @click="chooseRecordItem(item)"
              >
                <Icon icon="solar:videocamera-record-linear" />
                {{ item.fileName }}
              </a-tag>
              <a-button
                type="link"
                size="small"
                @click="downloadBtnClick(item)"
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
  import { onMounted, onBeforeMount, ref } from 'vue'
  import dayjs, { Dayjs } from 'dayjs'
  import {
    pauseControlApi,
    playbackApi,
    playControlApi,
    queryDeviceRecordApi,
    stopPlayBackApi,
  } from '/@/api/resource/gbResource'
  import { Icon } from '/@/components/Icon'
  import Jessibuca from '/@/views/common/player/module/jessibuca.vue'
  import { BasicTitle } from '/@/components/Basic'
  import { TimeLine } from '/@/components/TimeLine'
  import RecordDownload from '/@/views/resource/gbResource/recordDownload/index.vue'
  import { StreamInfo } from '/@/api/model/baseModel'
  import {
    getDownloadPathApi,
    getPlayLiveApi,
    queryCloudRecordListApi,
    queryDateListApi,
  } from '/@/api/cloudRecord/cloudRecord'
  import { CloudRecordItem } from '/@/api/cloudRecord/model/cloudRecordModel'

  const props = defineProps({
    app: {
      type: String,
      required: true,
    },
    stream: {
      type: String,
      required: true,
    },
  })
  const emit = defineEmits(['close'])
  const recordDownloadRef = ref()
  const timeLineRef = ref()
  const dateArray = ref<string[]>([])
  const recordDate = ref<Dayjs>(dayjs())
  const recordList = ref<CloudRecordItem[]>()
  const playUrl = ref<string>()
  const hasAudio = ref<boolean>(false)
  const listLoading = ref<boolean>(false)

  let chooseRecord: CloudRecordItem | null = null
  let streamInfo: StreamInfo | null = null
  let currentStarTime: string | null = null
  const initTime = ref<string>()
  const timeSegments = ref<any[]>([])
  let page = 1
  const count = 100
  const timeChange = (time: string) => {
    console.log(time)
    let dayItem = dayjs(time)
    let startTime = dayItem.format('YYYY-MM-DD HH:mm:ss')
    let stopTime = dayItem.add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
    play(startTime, stopTime)
  }
  const recordListStyle = ref({
    height: '600px',
    padding: '10px',
  })

  onBeforeMount(() => {
    getRecordDateList(dayjs().year(), dayjs().month() + 1)
  })

  onMounted(() => {
    var element = document.getElementById('deviceRecord')
    if (element) {
      recordListStyle.value.height = element.clientHeight - 32 + 'px'
    }
  })
  const getRecordDateList = (year: number, month: number) => {
    queryDateListApi(props.app, props.stream, year, month)
      .then((dateAyrrayResult) => {
        dateArray.value = dateAyrrayResult
      })
      .catch((e) => {
        message.error(e)
      })
  }

  const getRecordList = () => {
    let date = recordDate.value.format('YYYY-MM-DD')
    let startTime = date + ' 00:00:00'
    let endTime = recordDate.value.add(1, 'day').format('YYYY-MM-DD') + ' 00:00:00'
    queryCloudRecordListApi({
      page: page,
      count: count,
      app: props.app,
      stream: props.stream,
      query: null,
      startTime: startTime,
      endTime: endTime,
      mediaServerId: null,
    })
      .then((result) => {
        if (result.list.length > 0) {
          recordList.value = result.list
          initTime.value = dayjs(result.list[0].startTime).format('YYYY-MM-DD HH:mm:ss')
          currentStarTime = initTime.value
          timeSegments.value = []
          for (let i = 0; i < result.list.length; i++) {
            let record = result.list[i]
            timeSegments.value.push({
              name: record.fileName,
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
  const chooseRecordItem = (record: CloudRecordItem) => {
    chooseRecord = record
    timeLineRef.value.setTime(record.startTime)
    play(record)
  }
  const getTagColor = (record: CloudRecordItem) => {
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
  const hasRecordDate = (date) => {
    console.log(date)
    return dateArray.value.indexOf(date) > 0
  }
  const play = (record: CloudRecordItem) => {
    getPlayLiveApi(parseInt(record.id)).then((streamInfoResult) => {
      streamInfo = streamInfoResult
      playUrl.value = getUrlByStreamInfo()
    })
  }
  const downloadBtnClick = (record: CloudRecordItem) => {
    getDownloadPathApi(parseInt(record.id)).then((downloadInfo) => {
      let url
      if (location.protocol === 'https:') {
        url = downloadInfo.httpsPath
      } else {
        url = downloadInfo.httpPath
      }
      let x = new XMLHttpRequest()
      x.open('GET', url, true)
      x.responseType = 'blob'
      x.onload = () => {
        let url = window.URL.createObjectURL(x.response)
        let a = document.createElement('a')
        a.href = url
        a.download = record.app + '-' + record.stream + '.mp4'
        a.click()
      }
      x.send()
    })
  }
  const onLoadMore = () => {
    page++
    getRecordList()
  }
  getRecordList()
</script>
<style>
  #cloudRecordDetail {
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
  .has-record-date:after {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    background-color: #606060;
    border-radius: 4px;
    left: 45%;
    top: 74%;
  }
</style>
