<template>
  <div id="DeviceList">
    <PageWrapper v-if="deviceIdForChannelList == ''">
      <a-table
        :dataSource="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'hostAddress'">
            <a-tag>{{ record.hostAddress }}</a-tag>
          </template>
          <template v-if="column.dataIndex === 'onLine'">
            <a-tag color="processing" v-if="record.onLine === true">在线</a-tag>
            <a-tag v-if="record.onLine === false">离线</a-tag>
          </template>
          <template v-if="column.dataIndex === 'streamMode'">
            <a-select
              size="mini"
              @change="transportChange(record, record.streamMode)"
              v-model:value="record.streamMode"
              placeholder="请选择"
              style="width: 120px"
            >
              <a-select-option key="UDP" title="UDP" value="UDP">UDP</a-select-option>
              <a-select-option key="TCP-ACTIVE" title="TCP主动" value="TCP-ACTIVE"
                >TCP主动</a-select-option
              >
              <a-select-option key="TCP-PASSIVE" title="TCP被动" value="TCP-PASSIVE"
                >TCP被动</a-select-option
              >
            </a-select>
          </template>
          <template v-if="column.dataIndex === 'channelCount'">
            <b style="font-size: 1.1rem">{{ record.channelCount }}</b>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a-button type="link" size="small" @click="syncDeviceChannel(record)">刷新</a-button>
            <a-button type="link" size="small" @click="showDeviceChannel(record)">通道</a-button>
            <a-button type="link" size="small" @click="editDevice(record)">编辑</a-button>
            <a-popconfirm
              :id="record.id"
              title="确定删除?"
              ok-text="确定"
              cancel-text="取消"
              v-if="dataSource.length"
              @confirm="deleteDevice(record)"
            >
              <a-button :id="record.id" type="link" danger size="small">删除</a-button>
            </a-popconfirm>
            <a-button type="link" size="small" @click="syncResource(record)">加入资源库</a-button>
          </template>
        </template>
        <template #title>
          <div style="width: 100%; display: flex">
            <BasicTitle>国标设备</BasicTitle>
            <div style="margin-left: auto">
              <a-button type="primary" preIcon="ant-design:reload-outlined" size="small"
                >添加</a-button
              >
            </div>
          </div>
        </template>
      </a-table>
    </PageWrapper>
    <RefreshChanel ref="refreshChanel" />
    <ChannelList
      ref="channelList"
      v-if="deviceIdForChannelList != ''"
      :device-id="deviceIdForChannelList"
      :deviceOnline="deviceOnlineForChannelList"
      @close-device-channel="closeDeviceChannel"
    />
    <SyncResourceForm ref="syncResourceFormRef" />
  </div>
</template>
<script lang="ts" setup>
  import { deviceColumns } from '/@/views/resource/gbResource/columns'
  import {
    changeDeviceStreamTransportApi,
    deleteDeviceApi,
    deviceListApi,
  } from '/@/api/resource/gbResource'
  import { Device } from '/@/api/resource/model/gbResourceModel'
  import { computed, ref } from 'vue'
  import { PageWrapper } from '/@/components/Page'
  import { BasicTitle } from '/@/components/Basic'
  import {
    Table as ATable,
    Tag as ATag,
    Button as AButton,
    Select as ASelect,
    SelectOption as ASelectOption,
    message,
    Popconfirm as APopconfirm,
  } from 'ant-design-vue'
  import RefreshChanel from './refreshChanel/index.vue'
  import ChannelList from './channelList/index.vue'
  import SyncResourceForm from './syncResourceForm/index.vue'

  /**
   * 定义变量
   */
  let loading = ref(false)
  const columns = deviceColumns()
  let dataSource = ref<Device[]>([])
  let tablePage = ref(1)
  let tablePageSize = ref(15)
  let tableTotal = ref(0)
  let deviceIdForChannelList = ref('')
  let deviceOnlineForChannelList = ref(true)
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
  const syncResourceFormRef = ref()

  /**
   * 定义方法
   */
  function getDeviceList(): void {
    deviceListApi({
      page: tablePage.value,
      count: tablePageSize.value,
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
    getDeviceList()
  }
  function pageChange(page: number): void {
    tablePage.value = page
    getDeviceList()
  }

  function transportChange(_device: Device, mode: string): void {
    console.log(mode)
    console.log(`修改传输方式为 ${_device.streamMode}：${_device.deviceId} `)
    changeDeviceStreamTransportApi(_device.deviceId, mode).catch((e) => {
      message.info('流传输模式修改失败： ' + e.message)
    })
  }
  function deleteDevice(_device: Device): void {
    deleteDeviceApi(_device.deviceId)
      .catch((e) => {
        message.info('删除失败： ' + e.message)
      })
      .then(getDeviceList)
  }
  function syncDeviceChannel(_device: Device): void {
    refreshChanel.value.show(_device.deviceId)
  }
  function showDeviceChannel(_device: Device): void {
    deviceIdForChannelList.value = _device.deviceId
    deviceOnlineForChannelList.value = _device.onLine
  }
  function closeDeviceChannel(): void {
    deviceIdForChannelList.value = ''
    deviceOnlineForChannelList.value = true
  }
  function editDevice(_device: Device): void {
    console.log(_device)
    console.log(_device.deviceId)
  }
  const syncResource = (_device: Device) => {
    syncResourceFormRef.value.show(_device.deviceId)
  }
  // 初始化获取数据
  getDeviceList()
</script>
