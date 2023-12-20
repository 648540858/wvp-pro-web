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
            <template v-if="column.dataIndex === 'pushIng'">
              <a-tag color="processing" v-if="record.pushIng"> 正在推流 </a-tag>
              <a-tag v-if="!record.pushIng">已停止</a-tag>
            </template>
            <template v-if="column.dataIndex === 'operation'">
              <a-button
                type="link"
                size="small"
                @click="play(record)"
                >播放</a-button
              >
              <a-button
                type="link"
                danger
                size="small"
                v-if="!!record.streamId"
                @click="stop(record)"
                >移除</a-button
              >
              <a-button
                type="link"
                size="small"
                v-if="record.subCount > 0 || record.parental === 1"
                @click="changeSubChannel(record)"
              >
                查看
              </a-button>
              <a-button type="link" size="small" @click="queryCloudRecords(record)">
                云端录像
              </a-button>
            </template>
          </template>
          <template #title>
            <div style="width: 100%; display: inline-flex">
              <BasicTitle>国标通道</BasicTitle>
              <div style="margin-left: auto; display: inline-flex">
                <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                  <span style="width: 3rem">搜索:</span>
                  <a-input
                    size="small"
                    v-model:value="searchSrt"
                    placeholder="请输入搜索内容"
                    @change="getDeviceChannelList"
                  />
                </div>
                <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                  <span style="width: 5rem">通道类型:</span>
                  <a-select
                    v-model:value="channelType"
                    placeholder="请选择"
                    size="small"
                    @change="getDeviceChannelList"
                    style="width: 5rem"
                  >
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="false">设备</a-select-option>
                    <a-select-option value="true">子目录</a-select-option>
                  </a-select>
                </div>
                <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                  <span style="width: 5rem">在线状态:</span>
                  <a-select
                    v-model:value="online"
                    placeholder="请选择"
                    size="small"
                    @change="getDeviceChannelList"
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
  </div>
</template>
<script lang="ts" setup>
  import {
    deviceChannelListApi,
    deviceSubChannelListApi,
    playApi,
    ptzCameraApi,
    stopPlayApi,
    updateDeviceChannelApi,
  } from '/@/api/resource/gbResource'
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
    Switch as ASwitch,
    message,
  } from 'ant-design-vue'
  import { ArrowLeftOutlined } from '@ant-design/icons-vue'
  import Player from '/@/views/common/player/index.vue'
  import {pushColumns} from "/@/views/resource/pushResource/columns";
  import {PushModel} from "/@/api/resource/model/pushModel";

  const playRef = ref()
  /**
   * 定义变量
   */
  let loading = ref(false)
  const columns = pushColumns()
  let dataSource = ref<PushModel[]>([])
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
  let channelType = ref<string>('')
  let online = ref<string>('')
  let parentChannelId = ref<string>('')
  function pageSizeChange(oldPageSize: number, pageSize: number): void {
    tablePageSize.value = pageSize
    console.log('pageSizeChange')
    getDeviceChannelList()
  }
  function pageChange(page: number): void {
    tablePage.value = page
    console.log('pageChange')
    getDeviceChannelList()
  }
  function getDeviceChannelList(): void {
    dataSource.value = []
    if (parentChannelId.value) {
      loading.value = true
      deviceSubChannelListApi(
        {
          page: tablePage.value,
          count: tablePageSize.value,
          query: searchSrt.value,
          online: online.value,
          channelType: channelType.value,
          catalogUnderDevice: 'false',
        },
        parentChannelId.value,
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
    } else {
      deviceChannelListApi(
        {
          page: tablePage.value,
          count: tablePageSize.value,
          query: searchSrt.value,
          online: online.value,
          channelType: channelType.value,
          catalogUnderDevice: 'false',
        },
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
    updateDeviceChannelApi(_deviceChannel).catch((e) => {
      message.info('修改是否接收音频失败： ' + e.message)
    })
  }
  let playChannel: DeviceChannel
  function play(_deviceChannel: DeviceChannel): void {
    console.log('播放')
    loading.value = true
    playChannel = _deviceChannel
    playApi(_deviceChannel)
      .then((streamInfo) => {
        console.log(streamInfo)
        _deviceChannel.streamId = streamInfo.stream
        playRef.value.play(streamInfo, _deviceChannel.name)
      })
      .finally(() => {
        loading.value = false
      })
  }
  function stop(_deviceChannel: DeviceChannel): void {
    console.log('播放')
    stopPlayApi(_deviceChannel).then(() => {
      _deviceChannel.streamId = ''
    })
  }
  function changeSubChannel(_deviceChannel: DeviceChannel): void {
    parentChannelId.value = _deviceChannel.channelId
    pagination.value.total = 0
    pagination.value.current = 1
    getDeviceChannelList()
  }
  function queryRecords(_deviceChannel: DeviceChannel): void {}
  function queryCloudRecords(_deviceChannel: DeviceChannel): void {}
  function ptzCamera(comond: string, speed: number): void {
    console.log('ptz===> ' + comond)
    console.log('ptz===> ' + speed)
    ptzCameraApi(playChannel.deviceId, playChannel.channelId, comond, speed).catch((e) => {
      message.error(e)
    })
  }

  // 初始化获取数据
  getDeviceChannelList()
</script>
