<template>
  <div id="deviceRecord">
    <PageWrapper>
      <div class="device-record-box">
        <div class="player-box">222</div>
        <div class="info-box">
          <a-space direction="vertical">
            <a-date-picker
              v-model:value="recordDate"
              @change="recordDateChange"
              size="small"
              style="width: 100%"
            />
            <a-list class="record-list" style="margin-top: 1rem">
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
          </a-space>
        </div>
      </div>
    </PageWrapper>
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
    message,
  } from 'ant-design-vue'
  import { ref } from 'vue'
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
    height: calc(100% - 24px);
    width: 100%;
  }
</style>
