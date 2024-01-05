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
            <Jessibuca ref="jessibuca" :play-url="playUrl" :hasAudio="hasAudio" />
          </div>
        </div>
        <div class="info-box">
          <a-list class="record-list" :split="false" :loading="listLoading">
            <template #header>
              <a-date-picker v-model:value="recordDate" @change="recordDateChange" size="small">
                <template #dateRender="{ current }">
                  <div v-if="hasRecordDate(current)" class="ant-picker-cell-inner has-record-date">
                    {{ current.date() }}
                  </div>
                  <div v-if="!hasRecordDate(current)" class="ant-picker-cell-inner">
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
                <a-button v-if="total !== recordList.length" @click="onLoadMore">加载更多</a-button>
              </div>
            </template>
            <a-list-item v-for="item in recordList">
              <a-tag
                :color="getTagColor(item)"
                style="cursor: pointer"
                @click="chooseRecordItem(item)"
              >
                <Icon icon="solar:videocamera-record-linear" />
                {{ dayjs(item.startTime).format('HH:mm:ss') }}
                -
                {{ dayjs(item.endTime).format('HH:mm:ss') }}
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
  import { onMounted, ref } from 'vue'
  import dayjs, { Dayjs } from 'dayjs'
  import { Icon } from '/@/components/Icon'
  import Jessibuca from '/@/views/common/player/module/jessibuca.vue'
  import { BasicTitle } from '/@/components/Basic'
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
  const dateArray = ref<string[]>([])
  const recordDate = ref<Dayjs>(dayjs())
  const recordList = ref<CloudRecordItem[]>([])
  const playUrl = ref<string>()
  const hasAudio = ref<boolean>(false)
  const listLoading = ref<boolean>(false)

  let chooseRecord: CloudRecordItem | null = null
  let streamInfo: StreamInfo | null = null
  let total = ref<number>(0)
  let page = 1
  const count = 15
  const recordListStyle = ref({
    height: '600px',
    padding: '10px',
  })

  onMounted(() => {
    var element = document.getElementById('cloudRecordDetail')
    if (element) {
      recordListStyle.value.height = element.clientHeight - 32 + 'px'
    }
    getRecordDateList(dayjs().year(), dayjs().month() + 1)
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
        total.value = result.total
        if (result.list.length > 0) {
          recordList.value = recordList.value?.concat(result.list)
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
    return dateArray.value.indexOf(date.format('YYYY-MM-DD')) > -1
  }
  const play = (record: CloudRecordItem) => {
    getPlayLiveApi(parseInt(record.id + '')).then((streamInfoResult) => {
      streamInfo = streamInfoResult
      playUrl.value = getUrlByStreamInfo()
      if (streamInfoResult.tracks.length > 1) {
        hasAudio.value = true
      }
    })
  }
  const downloadBtnClick = (record: CloudRecordItem) => {
    getDownloadPathApi(parseInt(record.id + '')).then((downloadInfo) => {
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
    height: 100%;
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
