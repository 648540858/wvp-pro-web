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
          </template>
        </template>
      </a-table>
    </PageWrapper>
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
  import { queryCloudRecordListApi } from '/@/api/cloudRecord/cloudRecord'
  import dayjs, { Dayjs } from 'dayjs'
  import duration from 'dayjs/plugin/duration'
  import relativeTime from 'dayjs/plugin/relativeTime'
  import { MediaServer } from '/@/api/mediaServer/model/MediaServer'
  import { queryOnlineMediaServerListApi } from '/@/api/mediaServer/mediaServer'
  type RangeValue = [Dayjs, Dayjs]
  dayjs.extend(duration)
  dayjs.extend(relativeTime)
  /**
   * 定义变量
   */
  let loading = ref(false)
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
  const refreshChanel = ref()
  /**
   * 定义方法
   */
  function getCloudRecordList(): void {
    let startTime: string | null = null
    let endTime: string | null = null
    if (typeof rangeValue.value != 'undefined') {
      startTime = rangeValue.value[0].format('YYYY-MM-DD HH:mm:ss')
      endTime = rangeValue.value[1].format('YYYY-MM-DD HH:mm:ss')
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
  }
  function formatTime(time: number): string {
    const h = parseInt(time / 3600 / 1000)
    const minute = parseInt((time / 60 / 1000) % 60)
    const second = Math.ceil(time / 1000)

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
