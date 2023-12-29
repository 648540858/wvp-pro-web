<template>
  <div id="deviceRecord" style="height: 100%; overflow: auto; padding: 1rem">
    <div class="device-record-box">
      <div class="player-box">
        <div class="player-box-content">
          <Jessibuca ref="jessibuca" :play-url="playUrl" :hasAudio="hasAudio" />
        </div>
        <div style="width: 100%; height: 200px">
          <a-slider
            size="small"
            id="playtimeSlider"
            :range="true"
            :max="sliderMax"
            :min="sliderMIn"
            v-model:value="playTime"
            :marks="playTimeSliderMarks"
          />
        </div>
      </div>
      <div class="info-box">
        <a-date-picker
          v-model:value="recordDate"
          @change="recordDateChange"
          size="small"
          style="width: 100%; margin-bottom: 20px"
        />
        <a-card :bodyStyle="recordListStyle">
          <a-list class="record-list">
            <a-list-item v-for="item in recordList">
              <a-tag color="blue">
                <Icon icon="solar:videocamera-record-linear" />
                {{
                  dayjs(item.startTime).format('HH:mm:ss') +
                  '-' +
                  dayjs(item.endTime).format('HH:mm:ss')
                }}
              </a-tag>
            </a-list-item>
          </a-list>
        </a-card>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import {
    DatePicker as ADatePicker,
    List as AList,
    ListItem as AListItem,
    Tag as ATag,
    Card as ACard,
    message,
  } from 'ant-design-vue'
  import { onMounted, ref } from 'vue'
  import dayjs, { Dayjs } from 'dayjs'
  import { queryDeviceRecordApi } from '/@/api/resource/gbResource'
  import { RecordInfo, RecordItem } from '/@/api/resource/model/gbResourceModel'
  import Icon from '/@/components/Icon/src/Icon.vue'
  import Jessibuca from '/@/views/common/player/module/jessibuca.vue'

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

  const recordDate = ref<Dayjs>(dayjs())
  const recordList = ref<RecordItem[]>()
  const playUrl = ref<string>()
  const hasAudio = ref<boolean>(false)
  const sliderMIn = ref<number>(0)
  const sliderMax = ref<number>(86400)
  const playTime = ref<[number, number]>([sliderMIn.value, sliderMax.value])

  const playTimeSliderMarks = ref<Record<number, any>>({
    0: '00:00',
    3600: '01:00',
    7200: '02:00',
    10800: '03:00',
    14400: '04:00',
    18000: '05:00',
    21600: '06:00',
    25200: '07:00',
    28800: '08:00',
    32400: '09:00',
    36000: '10:00',
    39600: '11:00',
    43200: '12:00',
    46800: '13:00',
    50400: '14:00',
    54000: '15:00',
    57600: '16:00',
    61200: '17:00',
    64800: '18:00',
    68400: '19:00',
    72000: '20:00',
    75600: '21:00',
    79200: '22:00',
    82800: '23:00',
    86400: '24:00',
  })
  const recordListStyle = ref({
    height: '600px',
  })
  onMounted(() => {
    var element = document.getElementById('deviceRecord')
    if (element) {
      recordListStyle.value.height = element.clientHeight - 100 + 'px'
    }
  })

  const getRecordList = () => {
    let date = recordDate.value.format('YYYY-MM-DD')
    let startTime = date + ' 00:00:00'
    let endTime = recordDate.value.add(1, 'day').format('YYYY-MM-DD') + ' 00:00:00'
    queryDeviceRecordApi(props.deviceId, props.channelId, startTime, endTime)
      .then((result: RecordInfo) => {
        recordList.value = result.recordList
      })
      .catch((e) => {
        message.error(e)
      })
  }
  const recordDateChange = () => {
    console.log(recordDate.value.format('YYYY-MM-DD'))
    getRecordList()
  }
  getRecordList()
</script>
<style>
  .device-record-box {
    display: flex;
    height: 100%;
  }
  .info-box {
    width: 200px;
    height: 100%;
  }
  .player-box {
    width: calc(100% - 200px);
    height: 100%;
  }
  .player-box-content {
    width: 100%;
    height: calc(100% - 200px);
  }
  .record-list {
    height: 100%;
    width: 100%;
    overflow: auto;
  }
</style>
