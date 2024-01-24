<template>
  <div id="platformList">
    <PageWrapper>
      <Transition>
        <a-table
          :dataSource="dataSource"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
        >
          <template #title>
            <div style="width: 100%; display: inline-flex">
              <div style="display: inline-flex">
                <a-space>
                  <a-button
                    type="primary"
                    preIcon="ant-design:reload-outlined"
                    size="small"
                    @click="addPlatform"
                  >
                    添加
                  </a-button>
                </a-space>
              </div>
              <div style="margin-left: auto; display: inline-flex; align-items: center">
                <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                  <span style="width: 3rem">搜索:</span>
                  <a-input
                    size="small"
                    v-model:value="searchSrt"
                    placeholder="请输入搜索内容"
                    @change="getPlatformList"
                    clear
                  />
                </div>
                <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                  <span style="width: 5rem">推流状态:</span>
                  <a-select
                    v-model:value="online"
                    placeholder="请选择"
                    size="small"
                    @change="getPlatformList"
                    style="width: 10rem"
                  >
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="true">在线</a-select-option>
                    <a-select-option value="false">离线</a-select-option>
                  </a-select>
                </div>
                <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                  <span style="width: 3rem">启用:</span>
                  <a-select
                    v-model:value="enable"
                    placeholder="请选择"
                    size="small"
                    @change="getPlatformList"
                    style="width: 10rem"
                  >
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="true">启用</a-select-option>
                    <a-select-option value="false">未启用</a-select-option>
                  </a-select>
                </div>
              </div>
            </div>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'hostAddress'">
              <span style="font-size: 14px">{{ record.serverIP }}:{{ record.serverPort }}</span>
            </template>
            <template v-if="column.dataIndex === 'status'">
              <a-tag color="processing" v-if="record.status"> 在线 </a-tag>
              <a-tag v-if="!record.status">离线</a-tag>
            </template>
            <template v-if="column.dataIndex === 'subscribe'">
              <a-space>
                <Icon
                  color="#0960bd"
                  title="目录信息已订阅"
                  v-if="record.catalogSubscribe"
                  icon="tdesign:catalog"
                />
                <Icon
                  color="#a5a5a5"
                  title="目录信息未订阅"
                  v-if="!record.catalogSubscribe"
                  icon="tdesign:catalog"
                />
                <Icon
                  color="#0960bd"
                  title="报警信息已订阅"
                  v-if="record.alarmSubscribe"
                  icon="mdi:alarm-light"
                />
                <Icon
                  color="#a5a5a5"
                  title="报警信息未订阅"
                  v-if="!record.alarmSubscribe"
                  icon="mdi:alarm-light"
                />
                <Icon
                  color="#0960bd"
                  title="移动位置已订阅"
                  v-if="record.mobilePositionSubscribe"
                  icon="gis:position"
                />
                <Icon
                  color="#a5a5a5"
                  title="移动位置未订阅"
                  v-if="!record.mobilePositionSubscribe"
                  icon="gis:position"
                />
              </a-space>
            </template>
            <template v-if="column.dataIndex === 'self'">
              <a-tag color="processing" v-if="record.self"> 是 </a-tag>
              <a-tag v-if="!record.self">否</a-tag>
            </template>
            <template v-if="column.dataIndex === 'enable'">
              <a-tag color="processing" v-if="record.enable"> 已启用 </a-tag>
              <a-tag v-if="!record.enable">已停用</a-tag>
            </template>
            <template v-if="column.dataIndex === 'operation'">
              <a-button type="link" size="small" @click="edit(record)">编辑</a-button>
              <a-button type="link" size="small" @click="shareChannel(record)" :disabled="record.shareAllChannel">共享通道</a-button>
              <a-popconfirm
                title="确定删除?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="deleteItem(record)"
              >
                <a-button type="link" danger size="small"> 删除 </a-button>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
      </Transition>
    </PageWrapper>
    <EditPlatform ref="editPlatformRef" />
    <ShareChannel ref="shareChannelRef" />
  </div>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page'
  import {
    Table as ATable,
    Tag as ATag,
    Button as AButton,
    Input as AInput,
    Select as ASelect,
    SelectOption as ASelectOption,
    Space as ASpace,
    Popconfirm as APopconfirm,
    message,
  } from 'ant-design-vue'
  import { platformColumns } from '/@/views/gbPlatform/columns'
  import { PlatformModel } from '/@/api/gbPlatform/model/platformModel'
  import { deletePlatformApi, queryPlatformListApi } from '/@/api/gbPlatform/gbPlatform'
  import EditPlatform from '/@/views/common/editPlatform/index.vue'
  import ShareChannel from '/@/views/common/shareChannel/index.vue'
  import Icon from '/@/components/Icon/src/Icon.vue'

  /**
   * 定义变量
   */
  let editPlatformRef = ref()
  let shareChannelRef = ref()
  let loading = ref(false)
  const columns = platformColumns()
  let dataSource = ref<PlatformModel[]>([])
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
  let online = ref<string>('')
  let enable = ref<string>('')
  function pageSizeChange(oldPageSize: number, pageSize: number): void {
    tablePageSize.value = pageSize
    console.log('pageSizeChange')
    getPlatformList()
  }
  function pageChange(page: number): void {
    tablePage.value = page
    console.log('pageChange')
    getPlatformList()
  }
  function addPlatform(): void {
    editPlatformRef.value.openModel(null, getPlatformList)
  }
  function getPlatformList(): void {
    dataSource.value = []
    loading.value = true
    queryPlatformListApi({
      query: searchSrt.value,
      page: tablePage.value,
      count: tablePageSize.value,
      enable: enable.value,
      online: online.value,
    })
      .then((data) => {
        dataSource.value = data.list
      })
      .finally(() => {
        loading.value = false
      })
  }
  function edit(platformModel: PlatformModel): void {
    editPlatformRef.value.openModel(platformModel, getPlatformList)
  }
  function shareChannel(platformModel: PlatformModel): void {
    shareChannelRef.value.openModel(platformModel, getPlatformList)
  }
  function deleteItem(platformModel: PlatformModel): void {
    deletePlatformApi(platformModel.serverGBId)
      .then(() => {
        message.info('删除成功')
        getPlatformList()
      })
      .finally(() => {
        loading.value = false
      })
  }
  // 初始化获取数据
  getPlatformList()
</script>
