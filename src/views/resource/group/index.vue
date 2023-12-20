<template>
  <a-layout style="height: 100%">
    <a-layout-sider style="padding: 0 0.4rem; height: 100%; background: transparent">
      <resourceTree
        ref="resourceTreeRef"
        tree-type="group"
        @deleteChannelEvent="deleteChannelEvent"
      />
    </a-layout-sider>
    <a-layout-content style="padding-left: 0.2rem; padding-right: 1rem">
      <div style="border-left: 2px solid #c3c3c3; height: 100%">
        <a-table
          row-key="commonGbId"
          :dataSource="dataSource"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'commonGbStatus'">
              <a-tag color="processing" v-if="record.commonGbStatus">在线</a-tag>
              <a-tag v-if="!record.commonGbStatus">离线</a-tag>
            </template>
            <template v-if="column.dataIndex === 'statusInGroup'">
              <span v-if="record.commonGbBusinessGroupID"> 已添加 </span>
              <span v-if="!record.commonGbBusinessGroupID"> 未添加 </span>
            </template>
          </template>
          <template #title>
            <div style="width: 100%; display: inline-flex">
              <div style="display: inline-flex">
                <div style="display: inline-flex; align-items: center">
                  <span style="width: 3rem">搜索:</span>
                  <a-input
                    size="small"
                    v-model:value="searchSrt"
                    placeholder="请输入搜索内容"
                    @change="getChannelList"
                  />
                </div>
                <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                  <span style="width: 5rem">通道类型:</span>
                  <a-select
                    v-model:value="channelType"
                    placeholder="请选择"
                    size="small"
                    @change="getChannelList"
                    style="width: 5rem"
                  >
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="28181">国标设备</a-select-option>
                    <a-select-option value="push">推流设备</a-select-option>
                    <a-select-option value="proxy">代理设备</a-select-option>
                  </a-select>
                </div>
                <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                  <span style="width: 5rem">添加状态:</span>
                  <a-select
                    v-model:value="statusInGroup"
                    placeholder="请选择"
                    size="small"
                    @change="getChannelList"
                    style="width: 5rem"
                  >
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="true">已添加</a-select-option>
                    <a-select-option value="false">未添加</a-select-option>
                  </a-select>
                </div>
                <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                  <a-button
                    type="primary"
                    v-if="statusInGroup != true"
                    size="small"
                    @click="addChannelToGroup()"
                    >添加</a-button
                  >
                </div>
              </div>
            </div>
          </template>
        </a-table>
      </div>
    </a-layout-content>
  </a-layout>
</template>
<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import {
    Table as ATable,
    Button as AButton,
    Tag as ATag,
    Input as AInput,
    Select as ASelect,
    SelectOption as ASelectOption,
    message,
  } from 'ant-design-vue'
  import resourceTree from '/@/views/common/resourceTree/index.vue'
  import { channelInGroupColumns } from './columns'
  import { CommonGbChannel } from '/@/api/resource/model/channelModel'
  import { queryChannelList, updateToGroup } from '/@/api/resource/channel'

  const columns = channelInGroupColumns()
  let dataSource = ref<CommonGbChannel[]>([])
  const selectedRowKeys = ref<number[]>([])
  const resourceTreeRef = ref()
  let loading = ref(false)
  let statusInGroup = ref('false')
  let channelType = ref('')
  let searchSrt = ref('')
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
    pageSizeOptions: ['15', '25', '50', '1000'],
    showTotal: (total) => `共 ${total} 条数据`,
    onShowSizeChange: pageSizeChange,
    onChange: pageChange,
  }))

  const pageSizeChange = (oldPageSize: number, pageSize: number): void => {
    tablePageSize.value = pageSize
    console.log('pageSizeChange')
    getChannelList()
  }
  const pageChange = (page: number): void => {
    tablePage.value = page
    console.log('pageChange')
    getChannelList()
  }
  const getChannelList = (): void => {
    queryChannelList({
      groupDeviceId: null,
      page: tablePage.value,
      count: tablePageSize.value,
      query: searchSrt.value,
      inGroup: statusInGroup.value === '' ? null : statusInGroup.value === 'true',
      type: channelType.value,
      inRegion: null,
      regionDeviceId: null,
    })
      .then((result) => {
        dataSource.value = result.list
        tableTotal.value = result.total
      })
      .catch((exception) => {
        message.error(exception)
      })
      .finally(() => {
        loading.value = false
      })
  }
  const onSelectChange = (selectedRowKeysChange: number[]) => {
    selectedRowKeys.value = selectedRowKeysChange
  }
  const deleteChannelEvent = () => {
    getChannelList()
  }
  const addChannelToGroup = (): void => {
    if (selectedRowKeys.value.length == 0) {
      message.error('未选择通道')
      return
    }
    let groupKey = resourceTreeRef.value.getSelectKey()
    if (!groupKey) {
      message.error('未选择分组')
      return
    }
    console.log('通道：' + selectedRowKeys.value.length)
    console.log('分组：' + groupKey)
    updateToGroup({
      commonGbIds: selectedRowKeys.value,
      commonGbBusinessGroupID: groupKey,
    })
      .then(() => {
        console.log(dataSource.value)
        let channels: CommonGbChannel[] = []
        dataSource.value.forEach((item: CommonGbChannel) => {
          if (selectedRowKeys.value.includes(item.commonGbId)) {
            channels.push(item)
          }
        })
        resourceTreeRef.value.refreshNote(groupKey, channels)
        getChannelList()
        selectedRowKeys.value = []
      })
      .catch((exception) => {
        message.error(exception)
      })
      .finally(() => {
        loading.value = false
      })
  }
  getChannelList()
</script>
