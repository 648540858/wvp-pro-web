<template>
  <div id="CloudRecordList">
    <PageWrapper>
      <a-table
        :dataSource="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
      >
        <template #title>
          <div style="width: 100%; display: flex">
            <div style="margin-left: auto; display: inline-flex">
              <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                <span style="width: 3rem">搜索:</span>
                <a-input
                  size="small"
                  v-model:value="searchSrt"
                  placeholder="请输入搜索内容"
                  @change="getCloudRecordList"
                />
              </div>
              <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                <span style="width: 3rem">时间:</span>
                <a-range-picker
                  size="small"
                  :allowEmpty="[true, true]"
                  v-model:value="rangeValue"
                  show-time
                  @change="getCloudRecordList"
                />
              </div>

              <div
                style="width: 15rem; display: inline-flex; margin-left: 2rem; align-items: center"
              >
                <span style="width: 5rem">节点选择:</span>
                <a-select
                  v-model:value="mediaServerId"
                  placeholder="请选择"
                  size="small"
                  @change="getCloudRecordList"
                  style="width: 10rem"
                >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in mediaServerList" :value="item.id">
                    {{ item.id }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
          </div>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'startTime'">
            {{ dayjs(record.startTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <template v-if="column.dataIndex === 'endTime'">
            {{ dayjs(record.endTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <template v-if="column.dataIndex === 'timeLen'">
            <a-tag color="blue">{{ formatTime(record.timeLen) }}</a-tag>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a-button type="link" size="small" @click="play(record)">播放</a-button>
            <a-button type="link" size="small" @click="download(record)">下载</a-button>
          </template>
        </template>
      </a-table>
    </PageWrapper>
    <Player ref="playRef" />
  </div>
</template>
<script lang="ts" setup>
  import { cloudRecordColumns } from '/@/views/cloudRecord/columns'
  import { computed, ref } from 'vue'
  import { PageWrapper } from '/@/components/Page'
  import {
    Table as ATable,
    Tag as ATag,
    Button as AButton,
    Select as ASelect,
    SelectOption as ASelectOption,
    RangePicker as ARangePicker,
  } from 'ant-design-vue'
  import { CloudRecordItem } from '/@/api/cloudRecord/model/cloudRecordModel'
  import {
    queryCloudRecordListApi,
    getDownloadPathApi,
    getPlayLiveApi
  } from '/@/api/cloudRecord/cloudRecord'
  import dayjs, { Dayjs } from 'dayjs'
  import duration from 'dayjs/plugin/duration'
  import relativeTime from 'dayjs/plugin/relativeTime'
  import { MediaServer } from '/@/api/mediaServer/model/MediaServer'
  import { queryOnlineMediaServerListApi } from '/@/api/mediaServer/mediaServer'
  import Player from '/@/views/common/player/index.vue'
  type RangeValue = [Dayjs, Dayjs]
  dayjs.extend(duration)
  dayjs.extend(relativeTime)
  /**
   * 定义变量
   */
  let loading = ref(false)
  const playRef = ref()
  const columns = cloudRecordColumns()
  let dataSource = ref<CloudRecordItem[]>([])
  let tablePage = ref(1)
  let tablePageSize = ref(15)
  let tableTotal = ref(0)
  let searchSrt = ref('')
  let mediaServerId = ref('')
  const rangeValue = ref<RangeValue>()
  let mediaServerList = ref<MediaServer[]>([])
  const pagination = computed(() => ({
    // 表格分页的配置
    current: tablePage.value,
    size: 'small',
    pageSize: tablePageSize.value,
    showSizeChanger: true, // 用于控制展示每页多少条的下拉
    showQuickJumper: true,
    total: tableTotal.value,
    pageSizeOptions: ['15', '25', '50', '1000'],
    showTotal: (total) => `共 ${total} 条数据`,
    onShowSizeChange: pageSizeChange,
    onChange: pageChange,
  }))
  /**
   * 定义方法
   */
  function getCloudRecordList(): void {
    console.log('getCloudRecordList== getCloudRecordList')
    console.log(rangeValue.value)
    let startTime: string | null = null
    let endTime: string | null = null
    if (typeof rangeValue.value != 'undefined' && rangeValue.value != null) {
      if (typeof rangeValue.value[0] != 'undefined' && rangeValue.value[0] != null) {
        startTime = rangeValue.value[0].format('YYYY-MM-DD HH:mm:ss')
      }
      if (typeof rangeValue.value[1] != 'undefined' && rangeValue.value[1] != null) {
        endTime = rangeValue.value[1].format('YYYY-MM-DD HH:mm:ss')
      }
    }
    queryCloudRecordListApi({
      page: tablePage.value,
      count: tablePageSize.value,
      query: searchSrt.value,
      startTime: startTime,
      endTime: endTime,
      mediaServerId: mediaServerId.value,
      app: null,
      stream: null,
    })
      .then((result) => {
        console.log(result)
        dataSource.value = result.list
        tableTotal.value = result.total
      })
      .catch((exception) => {
        console.error(exception)
      })
      .finally(() => {
        loading.value = false
      })
  }
  function pageSizeChange(oldPageSize: number, pageSize: number): void {
    tablePageSize.value = pageSize
    getCloudRecordList()
  }
  function pageChange(page: number): void {
    tablePage.value = page
    getCloudRecordList()
  }
  function getMediaServerList(): void {
    queryOnlineMediaServerListApi()
      .then((result) => {
        mediaServerList.value = result
      })
      .catch((exception) => {
        console.error(exception)
      })
  }
  function play(record: CloudRecordItem): void {
    console.log(record)
    getPlayLiveApi(parseInt(record.id)).then((streamInfo) => {
      playRef.value.play(streamInfo, record.fileName, true)
    })
  }
  function download(record: CloudRecordItem): void {
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
  function formatTime(time: number): string {
    const h = parseInt(time / 3600 / 1000)
    const minute = parseInt((time - h * 60) / 60 / 1000)
    const second = Math.ceil((time - h * 3600 * 1000 - minute * 60 * 1000) / 1000)

    return (h > 0 ? h + `小时` : '') + (minute > 0 ? minute + '分' : '') + second + '秒'
  }
  // 初始化获取数据
  getCloudRecordList()
  getMediaServerList()
</script>
<style>
  #DeviceList {
    height: calc(100% - 16px);
  }
</style>
