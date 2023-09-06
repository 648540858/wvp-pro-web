<template>
  <PageWrapper id="DeviceList">
    <Table
      :dataSource="dataSource"
      :columns="columns"
      :loading="loading"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'hostAddress'">
          <Tag style="color: #000000">{{ record.hostAddress }}</Tag>
        </template>
        <template v-if="column.dataIndex === 'onLine'">
          <Tag color="cyan" v-if="record.onLine === true">在线</Tag>
          <Tag style="color: #7c8087" v-if="record.onLine === false">离线</Tag>
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
          <Button type="link" preIcon="ant-design:reload-outlined" size="small">刷新</Button>
          <Button type="link" preIcon="ant-design:video-camera-outlined" size="small">通道</Button>
          <Button type="link" preIcon="ant-design:edit-outlined" size="small">编辑</Button>
          <Button type="link" color="error" preIcon="ant-design:delete-outlined" size="small"
            >删除</Button
          >
        </template>
      </template>
      <template #title>
        <div style="width: 100%; display: flex">
          <BasicTitle>国标设备</BasicTitle>
          <div style="margin-left: auto">
            <Button type="primary" preIcon="ant-design:reload-outlined" size="small">添加</Button>
          </div>
        </div>
      </template>
    </Table>
  </PageWrapper>
</template>
<script lang="ts">
  import { deviceColumns } from '/@/views/resource/gbResource/columns'
  import { changeDeviceStreamTransportApi, deviceListApi } from '/@/api/resource/gbResource'
  import { Device, DeviceListParams } from '/@/api/resource/model/gbResourceModel'
  import { defineComponent } from 'vue'
  import { PageWrapper } from '/@/components/Page'
  import { BasicTitle } from '/@/components/Basic'
  import { Table, Tag, Button, Select, SelectOption, message } from 'ant-design-vue'

  export default defineComponent({
    name: 'DeviceListTable',
    components: { PageWrapper, BasicTitle, Table, Tag, Button, Select, SelectOption },
    data() {
      return {
        loading: false,
        columns: deviceColumns(),
        dataSource: [] as Device[],
        pagination: {
          current: 0,
          total: 0,
          pageSize: 10,
        },
      }
    },
    created() {
      const param = {
        page: 1,
        count: 10,
      }
      this.getDeviceList(param)
    },
    methods: {
      handleTableChange: function (pagination: any, filters: any, sorter: any): void {
        console.log(pagination)
        console.log(filters)
        console.log(sorter)
      },
      getDeviceList: function (params: DeviceListParams): void {
        deviceListApi(params)
          .then((result) => {
            console.log(result)
            this.dataSource = result.list
          })
          .catch((exception) => {
            console.error(exception)
          })
          .finally(() => {
            this.loading = false
          })
      },
      transportChange: function (_device: Device, mode: string): void {
        console.log(mode)
        console.log(`修改传输方式为 ${_device.streamMode}：${_device.deviceId} `)
        changeDeviceStreamTransportApi(_device.deviceId, mode).catch((e) => {
          message.info('流传输模式修改失败： ' + e.message)
        })
      },
    },
  })
</script>
