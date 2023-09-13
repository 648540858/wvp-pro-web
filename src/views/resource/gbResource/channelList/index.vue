<template>
  <div id="DeviceChannelList">
    <PageWrapper>
      <a-table
        :dataSource="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'snap'">
            <a-image :src="getSnap(record)" />
          </template>
          <template v-if="column.dataIndex === 'coordinate'">
            <span v-if="record.longitude * record.latitude > 0"
              >{{ record.longitude }},<br />{{ record.latitude }}</span
            >
            <span v-if="record.longitude * record.latitude === 0">无</span>
          </template>
          <template v-if="column.dataIndex === 'hasAudio'">
            <a-switch
              v-model:checked="record.hasAudio"
              size="small"
              @change="updateChannel(record)"
            />
          </template>
          <template v-if="column.dataIndex === 'status'">
            <a-tag color="processing" v-if="record.status === true">在线</a-tag>
            <a-tag v-if="record.status === false">离线</a-tag>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a-button
              :disabled="deviceId == null || !deviceOnline"
              type="link"
              size="small"
              @click="play(record)"
              >播放</a-button
            >
            <a-button
              :disabled="deviceId == null || !deviceOnline"
              type="link"
              danger
              size="small"
              v-if="!!record.streamId"
              @click="play(record)"
              >停止</a-button
            >
            <a-button
              type="link"
              size="small"
              v-if="record.subCount > 0 || record.parental === 1"
              @click="changeSubChannel(record)"
              >查看</a-button
            >
            <a-button
              :disabled="deviceId == null || !deviceOnline"
              type="link"
              size="small"
              @click="queryRecords(record)"
              >设备录像</a-button
            >
            <a-button type="link" size="small" @click="queryCloudRecords(record)"
              >云端录像</a-button
            >
          </template>
        </template>
        <template #title>
          <div style="width: 100%; display: flex">
            <BasicTitle>国标通道</BasicTitle>
            <div style="margin-left: auto">
              搜索:<a-input
                v-model:value="searchSrt"
                placeholder="请输入搜索内容"
                @change="getDeviceChannelList"
              />
              通道类型:<a-select v-model:value="channelType" placeholder="请选择">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="false">设备</a-select-option>
                <a-select-option value="true">子目录</a-select-option>
              </a-select>
              在线状态:<a-select v-model:value="online" placeholder="请选择">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="true">在线</a-select-option>
                <a-select-option value="false">离线</a-select-option>
              </a-select>
            </div>
          </div>
        </template>
      </a-table>
    </PageWrapper>
  </div>
</template>
<script lang="ts" setup>
  import { deviceChannelColumns } from '/@/views/resource/gbResource/channelList/columns'
  import {deviceChannelListApi, updateDeviceChannel} from '/@/api/resource/gbResource'
  import { DeviceChannel } from '/@/api/resource/model/gbResourceModel'
  import { computed, ref } from 'vue'
  import { PageWrapper } from '/@/components/Page'
  import { BasicTitle } from '/@/components/Basic'
  import {
    Table as ATable,
    Tag as ATag,
    Button as AButton,
    Input as AInput,
    Select as ASelect,
    SelectOption as ASelectOption,
    Image as AImage,
    Switch as ASwitch, message,
  } from 'ant-design-vue'

  /**
   * 定义变量
   */
  let loading = ref(false)
  const columns = deviceChannelColumns()
  let dataSource = ref<DeviceChannel[]>([])
  let tablePage = ref(1)
  let tablePageSize = ref(10)
  let tableTotal = ref(0)
  const pagination = computed(() => ({
    // 表格分页的配置
    current: tablePage.value,
    size: 'small',
    pageSize: tablePageSize.value,
    showSizeChanger: true, // 用于控制展示每页多少条的下拉
    showQuickJumper: true,
    total: tableTotal.value,
    pageSizeOptions: ['10', '20', '50'],
    showTotal: (total) => `共 ${total} 条数据`,
    onShowSizeChange: pageSizeChange,
    onChange: pageChange,
  }))
  const props = defineProps({
    deviceId: {
      type: String,
      required: true,
    },
    deviceOnline: {
      type: Boolean,
      required: false,
      default: true,
    },
    parentChannelId: {
      type: String,
      required: false,
      default: '',
    },
  })
  let searchSrt = ref<string>('')
  let channelType = ref<string>('')
  let online = ref<string>('')
  function pageSizeChange(oldPageSize: number, pageSize: number): void {
    tablePageSize.value = pageSize
    getDeviceChannelList()
  }
  function pageChange(page: number): void {
    tablePage.value = page
    getDeviceChannelList()
  }
  function getDeviceChannelList(): void {
    deviceChannelListApi(
      {
        page: tablePage.value,
        count: tablePageSize.value,
        query: searchSrt.value,
        online: online.value,
        channelType: channelType.value,
        catalogUnderDevice: 'false',
      },
      props.deviceId,
    )
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
  function getSnap(_deviceChannel: DeviceChannel): string {
    return (
      import.meta.env.VITE_GLOB_API_URL +
      '/api/device/query/snap/' +
      _deviceChannel.deviceId +
      '/' +
      _deviceChannel.channelId
    )
  }
  function updateChannel(_deviceChannel: DeviceChannel): void {
    updateDeviceChannel(_deviceChannel).catch((e) => {
      message.info('修改是否接收音频失败： ' + e.message)
    })
  }
  function play(_deviceChannel: DeviceChannel): void {}
  function changeSubChannel(_deviceChannel: DeviceChannel): void {}
  function queryRecords(_deviceChannel: DeviceChannel): void {}
  function queryCloudRecords(_deviceChannel: DeviceChannel): void {}

  // 初始化获取数据
  getDeviceChannelList()
</script>
