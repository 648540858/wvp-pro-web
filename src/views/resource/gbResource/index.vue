<template>
  <PageWrapper id="DeviceList">
    <Table :dataSource="dataSource" :columns="columns" :loading="loading" :pagination="pagination">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'hostAddress'">
          <Tag>{{ record.hostAddress }}</Tag>
        </template>
        <template v-if="column.dataIndex === 'onLine'">
          <Tag color="processing" v-if="record.onLine === true">在线</Tag>
          <Tag v-if="record.onLine === false">离线</Tag>
        </template>
        <template v-if="column.dataIndex === 'streamMode'">
          <Select
            size="mini"
            @change="transportChange(record, record.streamMode)"
            v-model:value="record.streamMode"
            placeholder="请选择"
            style="width: 120px"
          >
            <SelectOption key="UDP" title="UDP" value="UDP" />
            <SelectOption key="TCP-ACTIVE" title="TCP主动" value="TCP-ACTIVE" />
            <SelectOption key="TCP-PASSIVE" title="TCP被动" value="TCP-PASSIVE" />
          </Select>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <AButton type="link" size="small" @click="syncDeviceChannel(record)">刷新</AButton>
          <AButton type="link" size="small" @click="showDeviceChannel(record)">通道</AButton>
          <AButton type="link" size="small" @click="editDevice(record)">编辑</AButton>
          <Popconfirm
            :id="record.id"
            title="确定删除?"
            ok-text="确定"
            cancel-text="取消"
            v-if="dataSource.length"
            @confirm="deleteDevice(record)"
          >
            <AButton :id="record.id" type="link" danger size="small">删除</AButton>
          </Popconfirm>
        </template>
      </template>
      <template #title>
        <div style="width: 100%; display: flex">
          <BasicTitle>国标设备</BasicTitle>
          <div style="margin-left: auto">
            <AButton type="primary" preIcon="ant-design:reload-outlined" size="small">添加</AButton>
          </div>
        </div>
      </template>
    </Table>
  </PageWrapper>
  <RefreshChanel ref="refreshChanel" />
</template>
<script lang="ts" setup>
  import { deviceColumns } from '/@/views/resource/gbResource/columns'
  import { changeDeviceStreamTransportApi, deviceListApi } from '/@/api/resource/gbResource'
  import { Device } from '/@/api/resource/model/gbResourceModel'
  import { computed, ref } from 'vue'
  import { PageWrapper } from '/@/components/Page'
  import { BasicTitle } from '/@/components/Basic'
  import {
    Table,
    Tag,
    Button as AButton,
    Select,
    SelectOption,
    message,
    Popconfirm,
  } from 'ant-design-vue'
  import RefreshChanel from './refreshChanel/index.vue'

  /**
   * 定义变量
   */
  let loading = ref(false)
  const columns = deviceColumns()
  let dataSource = ref<Device[]>([])
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
  const refreshChanel = ref()

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
    console.log(_device)
    console.log(_device.deviceId)
  }
  function syncDeviceChannel(_device: Device): void {
    console.log(_device)
    console.log(_device.deviceId)
    refreshChanel.value.show(_device.deviceId)
  }
  function showDeviceChannel(_device: Device): void {
    console.log(_device)
    console.log(_device.deviceId)
  }
  function editDevice(_device: Device): void {
    console.log(_device)
    console.log(_device.deviceId)
  }

  // 初始化获取数据
  getDeviceList()
</script>
