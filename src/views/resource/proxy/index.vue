<template>
  <div id="proxyList" style="width: 100%; height: 100%">
    <PageWrapper v-if="cloudRecordApp == ''">
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
                    @click="addStream"
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
                    @change="getProxyList"
                  />
                </div>
                <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                  <span style="width: 5rem">状态:</span>
                  <a-select
                    v-model:value="online"
                    placeholder="请选择"
                    size="small"
                    @change="getProxyList"
                    style="width: 10rem"
                  >
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="true">在线</a-select-option>
                    <a-select-option value="false">离线</a-select-option>
                  </a-select>
                </div>
                <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                  <span style="width: 5rem">流媒体:</span>
                  <MediaServerSelect v-model="mediaServerId" @change="getProxyList" />
                </div>
              </div>
            </div>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'type'">
              <span v-if="record.type == 'default'">直接代理</span>
              <span v-if="record.type != 'default'">{{ record.type }}</span>
            </template>
            <template v-if="column.dataIndex === 'url'">
              <a-button type="link" size="small" @click="copy(record.url)">
                <Icon icon="tabler:copy" />
              </a-button>
              <span>{{ record.url }}</span>
            </template>
            <template v-if="column.dataIndex === 'enable'">
              <a-tag color="processing" v-if="record.enable">是</a-tag>
              <a-tag v-if="!record.enable">否</a-tag>
            </template>
            <template v-if="column.dataIndex === 'enableAudio'">
              <a-tag color="processing" v-if="record.enableAudio">是</a-tag>
              <a-tag v-if="!record.enableAudio">否</a-tag>
            </template>
            <template v-if="column.dataIndex === 'status'">
              <a-tag color="processing" v-if="record.status">在线</a-tag>
              <a-tag v-if="!record.status">离线</a-tag>
            </template>
            <template v-if="column.dataIndex === 'enableMp4'">
              <a-tag color="processing" v-if="record.enableMp4">是</a-tag>
              <a-tag v-if="!record.enableMp4">否</a-tag>
            </template>
            <template v-if="column.dataIndex === 'noneReader'">
              <a-tag color="processing" v-if="record.enableRemoveNoneReader">移除</a-tag>
              <a-tag color="processing" v-if="record.enableDisableNoneReader">停用</a-tag>
              <a-tag v-if="!record.enableDisableNoneReader && !record.enableRemoveNoneReader">
                无操作
              </a-tag>
            </template>
            <template v-if="column.dataIndex === 'operation'">
              <a-button type="link" size="small" @click="play(record)">播放</a-button>
              <a-popconfirm
                title="确定删除?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="remove(record)"
              >
                <a-button type="link" danger size="small">移除</a-button>
              </a-popconfirm>
              <a-button type="link" size="small" @click="edit(record)">编辑</a-button>
              <a-button type="link" size="small" @click="queryCloudRecords(record)">
                云端录像
              </a-button>
            </template>
          </template>
        </a-table>
      </Transition>
    </PageWrapper>
    <Player ref="playRef" />
    <EditStreamProxy ref="editStreamProxyRef" />
    <CloudRecordDetail
      v-if="cloudRecordApp != ''"
      :app="cloudRecordApp"
      :stream="cloudRecordStream"
      @close="closeCloudRecordDetail"
    />
  </div>
</template>
<script lang="ts" setup>
  import { DeviceChannel } from '/@/api/resource/model/gbResourceModel'
  import { computed, ref } from 'vue'
  import { PageWrapper } from '/@/components/Page'
  import {
    Table as ATable,
    Tag as ATag,
    Button as AButton,
    Input as AInput,
    Select as ASelect,
    SelectOption as ASelectOption,
    Space as ASpace,
    message,
    Popconfirm as APopconfirm,
  } from 'ant-design-vue'
  import Player from '/@/views/common/player/index.vue'
  import { MediaServer } from '/@/api/mediaServer/model/MediaServer'
  import { proxyColumns } from '/@/views/resource/proxy/columns'
  import { ProxyModel } from '/@/api/resource/model/proxyModel'
  import { playProxyApi, queryProxyListApi, removeProxyApi } from '/@/api/resource/proxy'
  import Icon from '/@/components/Icon/src/Icon.vue'
  import EditStreamProxy from '/@/views/common/editStreamProxy/index.vue'
  import { StreamInfo } from '/@/api/model/baseModel'
  import MediaServerSelect from '/@/views/common/mediaServerSelect/index.vue'
  import CloudRecordDetail from "/@/views/cloudRecord/cloudRecordDetail/index.vue";

  const playRef = ref()
  const editStreamProxyRef = ref()
  /**
   * 定义变量
   */
  let loading = ref(false)
  const columns = proxyColumns()
  let dataSource = ref<ProxyModel[]>([])
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
  let mediaServerId = ref<string>('')
  let cloudRecordApp = ref<string>('')
  let cloudRecordStream = ref<string>('')
  function pageSizeChange(oldPageSize: number, pageSize: number): void {
    tablePageSize.value = pageSize
    console.log('pageSizeChange')
    getProxyList()
  }
  function pageChange(page: number): void {
    tablePage.value = page
    console.log('pageChange')
    getProxyList()
  }
  function addStream(): void {
    editStreamProxyRef.value.openModel(null, getProxyList)
  }
  function getProxyList(): void {
    dataSource.value = []
    loading.value = true
    queryProxyListApi({
      query: searchSrt.value,
      online: online.value == '' ? null : online.value == 'true',
      page: tablePage.value,
      count: tablePageSize.value,
    })
      .then((data) => {
        dataSource.value = data.list
      })
      .finally(() => {
        loading.value = false
      })
  }
  function play(proxyModel: ProxyModel): void {
    if (typeof proxyModel.id == 'undefined') {
      message.error('播放失败： 数据错误')
      return
    }
    loading.value = true
    playProxyApi(parseInt(proxyModel.id))
      .then((streamInfoParam: StreamInfo) => {
        playRef.value.play(streamInfoParam, proxyModel.name, true)
      })
      .finally(() => {
        loading.value = false
      })
  }
  function copy(content: string): void {
    navigator.clipboard.writeText(content).then(() => {
      message.info('复制成功')
    })
  }
  function remove(proxyModel: ProxyModel): void {
    console.log(proxyModel)
    console.log(proxyModel.id)
    if (typeof proxyModel.id == 'undefined') {
      return
    }
    removeProxyApi(parseInt(proxyModel.id)).then(() => {
      getProxyList()
    })
  }
  function edit(proxyModel: ProxyModel): void {
    editStreamProxyRef.value.openModel(proxyModel, getProxyList)
  }
  function queryCloudRecords(proxyModel: ProxyModel): void {
    cloudRecordApp.value = proxyModel.app
    cloudRecordStream.value = proxyModel.stream
  }
  const closeCloudRecordDetail = () => {
    cloudRecordApp.value = ''
    cloudRecordStream.value = ''
  }
  // 初始化获取数据
  getProxyList()
</script>
