<template>
  <div id="logList">
    <PageWrapper>
      <Transition>
        <a-table
          :dataSource="dataSource"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'timing'">
              <span>{{ formatTime(record.timing) }}</span>
            </template>
            <template v-if="column.dataIndex === 'result'">
              <a-tag color="#87d068" v-if="record.result == '200 OK'">
                {{ record.result }}
              </a-tag>
              <a-tag color="#f50" v-if="record.result == '500 INTERNAL_SERVER_ERROR'">
                {{ record.result }}
              </a-tag>
              <a-tag
                v-if="record.result != '200 OK' && record.result != '500 INTERNAL_SERVER_ERROR'"
              >
                {{ record.result }}
              </a-tag>
            </template>
            <template v-if="column.dataIndex === 'operation'">
              <a-popconfirm
                :id="record.id"
                title="确定删除?"
                ok-text="确定"
                cancel-text="取消"
                v-if="dataSource.length"
                @confirm="deleteRecord(record)"
              >
                <a-button type="link" size="small" danger> 删除 </a-button>
              </a-popconfirm>
            </template>
          </template>
          <template #title>
            <div style="width: 100%; display: inline-flex">
              <div style="margin-left: auto; display: inline-flex; align-items: center">
                <div style="display: inline-flex; margin-left: 2rem; align-items: center; width: 10rem">
                  <span style="width: 3rem">搜索:</span>
                  <a-input
                    size="small"
                    v-model:value="searchSrt"
                    allow-clear
                    placeholder="请输入搜索内容"
                    @change="getLogList"
                  />
                </div>
                <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                  <span style="width: 3rem">方法:</span>
                  <a-select
                    v-model:value="requestType"
                    placeholder="请选择"
                    size="small"
                    allow-clear
                    @change="getLogList"
                    style="width: 7rem"
                  >
                    <a-select-option value="GET">GET</a-select-option>
                    <a-select-option value="DELETE">DELETE</a-select-option>
                    <a-select-option value="POST">POST</a-select-option>
                  </a-select>
                  <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                    <span style="width: 3rem">结果:</span>
                    <a-select
                      v-model:value="resultType"
                      placeholder="请选择"
                      size="small"
                      allow-clear
                      @change="getLogList"
                      style="width: 7rem"
                    >
                      <a-select-option value="true">成功</a-select-option>
                      <a-select-option value="false">失败</a-select-option>
                    </a-select>
                  </div>
                </div>
                <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                  <span style="width: 3rem">时间:</span>
                  <a-range-picker
                    size="small"
                    :allowEmpty="[true, true]"
                    v-model:value="rangeValue"
                    @change="getLogList"
                    style="width: 20rem"
                  />
                </div>
              </div>
            </div>
          </template>
        </a-table>
      </Transition>
    </PageWrapper>
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { PageWrapper } from '/@/components/Page'
  import {
    Table as ATable,
    Tag as ATag,
    Button as AButton,
    Input as AInput,
    Select as ASelect,
    SelectOption as ASelectOption,
    RangePicker as ARangePicker,
    Popconfirm as APopconfirm,
    message,
  } from 'ant-design-vue'
  import { deleteLogApi, queryLogListApi } from '/@/api/resource/log'
  import { Log } from '/@/api/resource/model/log'
  import { Dayjs } from 'dayjs'
  import { commonLogColumns } from '/@/views/log/columns'
  type RangeValue = [Dayjs, Dayjs]
  /**
   * 定义变量
   */
  let loading = ref(false)
  const columns = commonLogColumns()
  let dataSource = ref<Log[]>([])
  let tablePage = ref(1)
  let tablePageSize = ref(15)
  let tableTotal = ref(0)
  const rangeValue = ref<RangeValue>()
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
  let searchSrt = ref<string>('')
  let requestType = ref<string>('')
  let resultType = ref<string>('')
  function pageSizeChange(oldPageSize: number, pageSize: number): void {
    tablePageSize.value = pageSize
    console.log('pageSizeChange')
    getLogList()
  }
  function pageChange(page: number): void {
    tablePage.value = page
    console.log('pageChange')
    getLogList()
  }
  function getLogList(): void {
    dataSource.value = []
    loading.value = true
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
    queryLogListApi({
      page: tablePage.value,
      count: tablePageSize.value,
      query: searchSrt.value,
      type: requestType.value,
      startTime: startTime,
      endTime: endTime,
      result: resultType.value,
    })
      .then((result) => {
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
  function deleteRecord(log: Log): void{
    if (!log.id) {
      message.error('失败： ID为空')
      return
    }
    deleteLogApi(parseInt(log.id))
      .then(() => {
        message.info('删除成功')
        getLogList()
      })
      .catch((exception) => {
        console.error(exception)
      })
  }
  function formatTime(time: number): string {
    const h = parseInt(time / 3600 / 1000)
    console.error(h)
    let minute = parseInt((time - h * 60) / 60 / 1000)
    if (minute < 0) {
      minute = 0
    }
    let second = (time - h * 3600 * 1000 - minute * 60 * 1000) / 1000
    if (second < 0) {
      second = 0
    }
    if (second > 1) {
      return (h > 0 ? h + `小时` : '') + (minute > 0 ? minute + '分' : '') + second + '秒'
    } else {
      return time + '毫秒'
    }
  }

  // 初始化获取数据
  getLogList()
</script>
