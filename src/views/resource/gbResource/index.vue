<template>
  <div id="DeviceList" style="height: 100%">
    <PageWrapper v-if="deviceIdForChannelList == ''">
      <a-table
        :dataSource="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
      >
        <template #title>
          <div style="width: 100%; display: flex">
            <div style="margin-right: auto; display: inline-flex">
              <div style="display: inline-flex; align-items: center">
                <a-button
                  type="primary"
                  preIcon="ant-design:reload-outlined"
                  size="small"
                  @click="addDeviceEvent"
                >
                  添加
                </a-button>
              </div>
            </div>
            <div style="margin-left: auto; display: inline-flex">
              <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                <span style="width: 3rem">搜索:</span>
                <a-input
                  size="small"
                  v-model:value="searchSrt"
                  placeholder="请输入搜索内容"
                  @change="getDeviceList"
                />
              </div>
              <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                <span style="width: 5rem">在线状态:</span>
                <a-select
                  v-model:value="online"
                  placeholder="请选择"
                  size="small"
                  @change="getDeviceList"
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
            <a-dropdown :trigger="['click']">
              <a class="ant-dropdown-link" @click.prevent>控制</a>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="0" @click="telebootControl(record)">远程启动</a-menu-item>
                  <a-menu-item key="1" @click="recordControl(record, 'start')">
                    开始录像
                  </a-menu-item>
                  <a-menu-item key="1" @click="recordControl(record, 'stop')">停止录像</a-menu-item>
                  <a-menu-item key="3" @click="setGuardControl(record)">报警布防</a-menu-item>
                  <a-menu-item key="3" @click="resetGuardControl(record)">报警撤防</a-menu-item>
                  <a-menu-item key="4" @click="resetAlarmControl(record)">报警复位</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </template>
      </a-table>
    </PageWrapper>
    <RefreshChanel ref="refreshChanel" />
    <ChannelList
      ref="channelList"
      style="height: 100%"
      v-if="deviceIdForChannelList != ''"
      :device-id="deviceIdForChannelList"
      :deviceOnline="deviceOnlineForChannelList"
      @close-device-channel="closeDeviceChannel"
    />
    <EditDevice ref="editDeviceRef" />
    <ResetAlarm ref="resetAlarmRef" />
  </div>
</template>
<script lang="ts" setup>
  import { deviceColumns } from '/@/views/resource/gbResource/columns'
  import {
    changeDeviceStreamTransportApi,
    deleteDeviceApi,
    deviceListApi,
    guardControlApi,
    recordControlApi,
    telebootControlApi,
  } from '/@/api/resource/gbResource'
  import { Device } from '/@/api/resource/model/gbResourceModel'
  import EditDevice from '/@/views/common/editDevice/index.vue'
  import ResetAlarm from '/@/views/common/resetAlarm/index.vue'
  import { computed, ref } from 'vue'
  import { PageWrapper } from '/@/components/Page'
  import {
    Table as ATable,
    Tag as ATag,
    Button as AButton,
    Select as ASelect,
    SelectOption as ASelectOption,
    message,
    Popconfirm as APopconfirm,
    Dropdown as ADropdown,
    Menu as AMenu,
    MenuItem as AMenuItem,
  } from 'ant-design-vue'
  import RefreshChanel from './refreshChanel/index.vue'
  import ChannelList from './channelList/index.vue'

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
  let searchSrt = ref('')
  let deviceOnlineForChannelList = ref(true)
  let online = ref<string>('')
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
  const editDeviceRef = ref()
  const resetAlarmRef = ref()
  /**
   * 定义方法
   */
  function getDeviceList(): void {
    deviceListApi({
      page: tablePage.value,
      count: tablePageSize.value,
      query: searchSrt.value,
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
    editDeviceRef.value.openModel(_device)
  }
  function addDeviceEvent(): void {
    editDeviceRef.value.openModel()
  }
  function telebootControl(device: Device): void {
    telebootControlApi(device.deviceId)
      .then(() => {
        message.info('[远程启动] 已发送')
      })
      .catch((e) => [message.error(e)])
  }
  function recordControl(device: Device, command: string): void {
    recordControlApi(device.deviceId, command)
      .then(() => {
        if (command == 'start') {
          message.info('[开始录像] 已发送')
        } else {
          message.info('[停止录像] 已发送')
        }
      })
      .catch((e) => [message.error(e)])
  }
  function setGuardControl(device: Device): void {
    guardControlApi(device.deviceId, 'set')
      .then(() => {
        message.info('[报警布防] 已发送')
      })
      .catch((e) => [message.error(e)])
  }
  function resetGuardControl(device: Device): void {
    guardControlApi(device.deviceId, 'reset')
      .then(() => {
        message.info('[报警撤防] 已发送')
      })
      .catch((e) => [message.error(e)])
  }
  function resetAlarmControl(device: Device): void {
    console.log(resetAlarmRef)
    resetAlarmRef.value.openModel(device.deviceId)
  }
  // 初始化获取数据
  getDeviceList()
</script>
