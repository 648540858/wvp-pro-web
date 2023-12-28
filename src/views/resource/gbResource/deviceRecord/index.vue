<template>
  <div id="deviceRecord" style="height: 100%; overflow: auto; padding: 1rem">
    <div class="device-record-box">
      <div class="player-box">222</div>
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
  import { PageWrapper } from '/@/components/Page'
  import {
    DatePicker as ADatePicker,
    List as AList,
    ListItem as AListItem,
    Tag as ATag,
    Space as ASpace,
    Card as ACard,
    message,
  } from 'ant-design-vue'
  import { onMounted, ref } from 'vue'
  import dayjs, { Dayjs } from 'dayjs'
  import { queryDeviceRecordApi } from '/@/api/resource/gbResource'
  import { RecordInfo, RecordItem } from '/@/api/resource/model/gbResourceModel'
  import Icon from '/@/components/Icon/src/Icon.vue'

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
  .record-list {
    height: 100%;
    width: 100%;
    overflow: auto;
  }
</style>
