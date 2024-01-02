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
      </div>
      <div class="device-record-box">
        <div class="player-box">
          <div class="player-box-content">
            <Jessibuca ref="jessibuca" :play-url="playUrl" :hasAudio="hasAudio" />
          </div>
          <div style="width: 100%; height: 100px; padding: 8px">
            <TimeLine
              :initTime="initTime"
              @timeChange="timeChange"
              :timeSegments="timeSegments"
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
              <a-button type="link" size="small" @click="back()" style="color: #000">
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
  import { queryDeviceRecordApi } from '/@/api/resource/gbResource'
  import { RecordInfo, RecordItem } from '/@/api/resource/model/gbResourceModel'
  import { Icon } from '/@/components/Icon'
  import Jessibuca from '/@/views/common/player/module/jessibuca.vue'
  import { BasicTitle } from '/@/components/Basic'
  import { TimeLine } from '/@/components/TimeLine'

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
  const recordDate = ref<Dayjs>(dayjs())
  const recordList = ref<RecordItem[]>()
  const playUrl = ref<string>()
  const hasAudio = ref<boolean>(false)

  const chooseRecordId = ref<string>()
  const initTime = ref<string>()
  const timeSegments = ref<any[]>([])
  const timeChange = (time) => {
    console.log(time)
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
    chooseRecordId.value = record.startTime
    initTime.value = record.startTime
  }
  const getTagColor = (record: RecordItem) => {
    if (record.startTime === chooseRecordId.value) {
      return 'red'
    } else {
      return 'blue'
    }
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
  }
  .player-box-content {
    width: 100%;
    height: calc(100% - 100px);
    padding: 0.5rem;
  }
  .record-list {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>
