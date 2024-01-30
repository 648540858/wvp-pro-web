<template>
  <div id="channelList">
    <PageWrapper>
      <Transition>
        <a-table
          :dataSource="dataSource"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'commonGbStatus'">
              <a-tag color="processing" v-if="record.commonGbStatus"> 在线 </a-tag>
              <a-tag v-if="!record.commonGbStatus">离线</a-tag>
            </template>
            <template v-if="column.dataIndex === 'commonGbLongitudeAndLatitude'">
              <span v-if="record.commonGbLongitude * record.commonGbLatitude > 0"
                >{{ record.commonGbLongitude }},<br />{{ record.commonGbLatitude }}</span
              >
              <span
                v-if="
                  !record.commonGbLongitude ||
                  !record.commonGbLatitude ||
                  record.commonGbLongitude * record.commonGbLatitude === 0
                "
                >无</span
              >
            </template>
            <template v-if="column.dataIndex === 'commonGbPtzType'">
              <span v-if="![1, 2, 3, 4].includes(record.commonGbPtzType)"> 未知 </span>
              <span v-if="record.commonGbPtzType == 1">球机</span>
              <span v-if="record.commonGbPtzType == 2">半球</span>
              <span v-if="record.commonGbPtzType == 3">固定枪机</span>
              <span v-if="record.commonGbPtzType == 4">遥控枪机</span>
            </template>
            <template v-if="column.dataIndex === 'commonGbPositionType'">
              <span v-if="![1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(record.commonGbPositionType)">
                未知
              </span>
              <span v-if="record.commonGbPositionType == 1">省际检查站</span>
              <span v-if="record.commonGbPositionType == 2">党政机关</span>
              <span v-if="record.commonGbPositionType == 3">车站码头</span>
              <span v-if="record.commonGbPositionType == 4">中心广场</span>
              <span v-if="record.commonGbPositionType == 5">体育场馆</span>
              <span v-if="record.commonGbPositionType == 6">商业中心</span>
              <span v-if="record.commonGbPositionType == 7">宗教场所</span>
              <span v-if="record.commonGbPositionType == 8">校园周边</span>
              <span v-if="record.commonGbPositionType == 9">治安复杂区域</span>
              <span v-if="record.commonGbPositionType == 10">交通干线</span>
            </template>
            <template v-if="column.dataIndex === 'commonGbRoomType'">
              <span v-if="![1, 2].includes(record.commonGbRoomType)"> 未知 </span>
              <span v-if="record.commonGbRoomType == 1">室外</span>
              <span v-if="record.commonGbRoomType == 2">室内</span>
            </template>
            <template v-if="column.dataIndex === 'type'">
              <span v-if="record.type == '28181'">国标28181</span>
              <span v-if="record.type == 'push'">推流</span>
              <span v-if="record.type == 'proxy'">拉流代理</span>
            </template>
            <template v-if="column.dataIndex === 'operation'">
              <a-button
                :disabled="!record.commonGbStatus"
                type="link"
                size="small"
                @click="play(record)"
                >播放</a-button
              >
              <a-button
                :disabled="!record.commonGbStatus"
                type="link"
                danger
                size="small"
                v-if="!!record.streamId"
                @click="stop(record)"
                >停止</a-button
              >
              <a-button type="link" size="small" @click="editChannel(record)"> 编辑 </a-button>
              <a-button
                type="link"
                size="small"
                v-if="record.type == '28181'"
                :disabled="!record.commonGbStatus"
                @click="queryDeviceRecords(record)"
              >
                国标录像
              </a-button>
              <a-button type="link" size="small" @click="queryCloudRecords(record)">
                云端录像
              </a-button>
            </template>
          </template>
          <template #title>
            <div style="width: 100%; display: inline-flex">
              <div style="margin-left: auto; display: inline-flex; align-items: center">
                <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                  <span style="width: 3rem">搜索:</span>
                  <a-input
                    size="small"
                    v-model:value="searchSrt"
                    placeholder="请输入搜索内容"
                    @change="getCommonGbChannelList"
                  />
                </div>
                <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                  <span style="width: 5rem">资源类型:</span>
                  <a-select
                    v-model:value="resourceType"
                    placeholder="请选择"
                    size="small"
                    @change="getCommonGbChannelList"
                    style="width: 7rem"
                  >
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="28181">国标28181</a-select-option>
                    <a-select-option value="push">推流</a-select-option>
                    <a-select-option value="proxy">拉流代理</a-select-option>
                  </a-select>
                </div>
                <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                  <span style="width: 5rem">云台类型:</span>
                  <a-select
                    v-model:value="ptzType"
                    placeholder="请选择"
                    size="small"
                    @change="getCommonGbChannelList"
                    style="width: 7rem"
                  >
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="1">球机</a-select-option>
                    <a-select-option value="2">半球</a-select-option>
                    <a-select-option value="3">固定枪机</a-select-option>
                    <a-select-option value="4">遥控枪机</a-select-option>
                  </a-select>
                </div>
                <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                  <span style="width: 5rem">在线状态:</span>
                  <a-select
                    v-model:value="online"
                    placeholder="请选择"
                    size="small"
                    @change="getCommonGbChannelList"
                    style="width: 5rem"
                  >
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="true">在线</a-select-option>
                    <a-select-option value="false">离线</a-select-option>
                  </a-select>
                </div>
              </div>
            </div>
          </template>
        </a-table>
      </Transition>
    </PageWrapper>
    <Player ref="playRef" @ptzCamera="ptzCamera" />
    <EditChannel ref="editChannelRef" />
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
    message,
  } from 'ant-design-vue'
  import Player from '/@/views/common/player/index.vue'
  import EditChannel from '/@/views/common/editChannel/index.vue'
  import { commonChannelColumns } from '/@/views/resource/channel/columns'
  import { CommonGbChannel } from '/@/api/resource/model/channelModel'
  import { channelPtz, playChannelApi, queryChannelList } from '/@/api/resource/channel'

  const playRef = ref()
  const editChannelRef = ref()
  /**
   * 定义变量
   */
  let loading = ref(false)
  const columns = commonChannelColumns()
  let dataSource = ref<CommonGbChannel[]>([])
  let tablePage = ref(1)
  let tablePageSize = ref(15)
  let tableTotal = ref(0)
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
  let resourceType = ref<string>('')
  let ptzType = ref<string>('')
  let online = ref<string>('')
  function pageSizeChange(oldPageSize: number, pageSize: number): void {
    tablePageSize.value = pageSize
    console.log('pageSizeChange')
    getCommonGbChannelList()
  }
  function pageChange(page: number): void {
    tablePage.value = page
    console.log('pageChange')
    getCommonGbChannelList()
  }
  function getCommonGbChannelList(): void {
    dataSource.value = []
    loading.value = true
    queryChannelList({
      page: tablePage.value,
      count: tablePageSize.value,
      query: searchSrt.value,
      type: resourceType.value,
      ptzType: ptzType.value,
      online: online.value,
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
  let playChannel: CommonGbChannel
  function play(channel: CommonGbChannel): void {
    playChannel = channel
    loading.value = true
    playChannelApi(channel.commonGbDeviceID)
      .then((streamInfo) => {
        console.log(streamInfo)
        playRef.value.play(streamInfo, channel.commonGbName, channel.type != '28181')
      })
      .catch((error) => {
        message.error('播放失败： ' + error)
      })
      .finally(() => {
        loading.value = false
      })
  }
  function stop(channel: CommonGbChannel): void {}

  function queryDeviceRecords(channel: CommonGbChannel): void {}
  function queryCloudRecords(channel: CommonGbChannel): void {}
  function addChannel(): void {
    editChannelRef.value.openModel(null, getCommonGbChannelList)
  }
  function editChannel(channel: CommonGbChannel): void {
    editChannelRef.value.openModel(channel, getCommonGbChannelList)
  }
  function ptzCamera(comond: string, speed: number): void {
    console.log('ptz===> ' + comond)
    console.log('ptz===> ' + speed)
    channelPtz({
      channelDeviceId: playChannel.commonGbDeviceID,
      command: comond,
      horizonSpeed: speed,
      verticalSpeed: speed,
      zoomSpeed: 15,
    }).catch((e) => {
      message.error(e)
    })
  }

  // 初始化获取数据
  getCommonGbChannelList()
</script>
