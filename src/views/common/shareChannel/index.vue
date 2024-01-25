<template>
  <a-modal
    ref="shareChannel"
    v-model:visible="open"
    title="选择要共享的通道"
    width="80rem"
    @cancel="closeModel"
    style="top: 20px"
    :footer="null"
  >
    <div style="padding: 0 1rem">
      <a-table
        :dataSource="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        rowKey="commonGbId"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'commonGbStatus'">
            <a-tag color="processing" v-if="record.commonGbStatus"> 在线 </a-tag>
            <a-tag v-if="!record.commonGbStatus">离线</a-tag>
          </template>
          <template v-if="column.dataIndex === 'type'">
            <span v-if="record.type == '28181'">国标28181</span>
            <span v-if="record.type == 'push'">推流</span>
            <span v-if="record.type == 'proxy'">拉流代理</span>
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
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue'
  import {
    Modal as AModal,
    message,
    Table as ATable,
    Tag as ATag,
    Input as AInput,
    Select as ASelect,
    SelectOption as ASelectOption,
  } from 'ant-design-vue'
  import { cloneDeep } from 'lodash-es'
  import { PlatformModel } from '/@/api/gbPlatform/model/platformModel'
  import {
    addShareChannelList,
    queryShareChannelList,
    removeShareChannelList,
  } from '/@/api/resource/channel'
  import { shareChannelColumns } from '/@/views/common/shareChannel/columns'
  import { ShareChannelModel } from '/@/api/resource/model/channelModel'

  const open = ref<boolean>(false)
  let dataSource = ref<ShareChannelModel[]>([])
  const columns = shareChannelColumns()
  let tablePage = ref(1)
  let tablePageSize = ref(15)
  let tableTotal = ref(0)
  let loading = ref(false)
  let online = ref<string>('')
  const selectedRowKeys = ref<number[]>([])
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
  const platformInitModel: PlatformModel = {
    //  名称
    name: '',
    enable: true,
    serverGBId: '',
    serverGBDomain: '',
    serverIP: '',
    serverPort: 5060,
    deviceIp: '',
    devicePort: 0,
    username: '',
    password: '',
    expires: 3600,
    keepTimeout: 60,
    transport: 'UDP',
    characterSet: 'GB2312',
    ptz: true,
    rtcp: true,
    startOfflinePush: false,
    catalogGroup: 1,
    asMessageChannel: false,
    autoPushChannel: false,
    shareAllChannel: false,
    shareGroup: true,
    shareRegion: true,
    deviceGBId: '',
    commonGbId: 0,
  }
  const platformModel = ref<PlatformModel>(platformInitModel)

  let endFnCallback: Function
  const openModel = (platformModelParam: PlatformModel, endFn: Function) => {
    console.log(platformModelParam)
    open.value = true
    endFnCallback = endFn
    platformModel.value = cloneDeep(platformModelParam)
    getCommonGbChannelList()
  }
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
  const onSelectChange = (selectedRowKeysParam: number[]) => {
    if (!platformModel.value.id) {
      return
    }
    console.log(selectedRowKeysParam)
    console.log(selectedRowKeys.value)
    if (selectedRowKeys.value.length > selectedRowKeysParam.length) {
      // 移除
      const diff: number[] = []
      for (let i = 0; i < selectedRowKeys.value.length; i++) {
        const item = selectedRowKeys.value[i]
        if (!selectedRowKeysParam.includes(item)) {
          diff.push(item)
        }
      }
      console.log(diff)
      removeShareChannelList({
        channelIdList: diff,
        platformId: parseInt(platformModel.value.id),
      }).catch((exception) => {
        console.error(exception)
      })
    } else if (selectedRowKeys.value.length < selectedRowKeysParam.length) {
      // 增加
      const diff: number[] = []
      for (let i = 0; i < selectedRowKeysParam.length; i++) {
        const item = selectedRowKeysParam[i]
        if (!selectedRowKeys.value.includes(item)) {
          diff.push(item)
        }
      }
      addShareChannelList({
        channelIdList: diff,
        platformId: parseInt(platformModel.value.id),
      }).catch((exception) => {
        console.error(exception)
      })
    }
    selectedRowKeys.value = selectedRowKeysParam
  }
  function getCommonGbChannelList(): void {
    if (!platformModel.value.id) {
      return
    }
    dataSource.value = []
    loading.value = true
    const platformId = parseInt(platformModel.value.id)
    queryShareChannelList({
      platformId: platformId,
      page: tablePage.value,
      count: tablePageSize.value,
      query: searchSrt.value,
      type: resourceType.value,
      online: online.value,
    })
      .then((result) => {
        dataSource.value = result.list
        tableTotal.value = result.total
        for (let i = 0; i < result.list.length; i++) {
          if (result.list[i].platformId == platformId) {
            selectedRowKeys.value.push(result.list[i].commonGbId)
          }
        }
      })
      .catch((exception) => {
        console.error(exception)
      })
      .finally(() => {
        loading.value = false
      })
  }
  const closeModel = () => {
    open.value = false
    if (endFnCallback) {
      endFnCallback()
    }
  }

  defineExpose({ openModel })
</script>
