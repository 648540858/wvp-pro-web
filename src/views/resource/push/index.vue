<template>
  <div id="channelList">
    <PageWrapper v-if="cloudRecordApp == ''">
      <Transition>
        <a-table
          :dataSource="dataSource"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          rowKey="id"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
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
                  <a-button
                    preIcon="ant-design:reload-outlined"
                    size="small"
                    @click="importChannel"
                  >
                    通道导入
                  </a-button>
                  <a-button preIcon="ant-design:reload-outlined" size="small">
                    <a href="/resource/file/推流通道导入.zip" download="推流通道导入.zip">
                      下载模板
                    </a>
                  </a-button>
                  <a-button preIcon="ant-design:reload-outlined" size="small" @click="batchDel">
                    批量移除
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
                    @change="getPushList"
                  />
                </div>
                <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                  <span style="width: 5rem">推流状态:</span>
                  <a-select
                    v-model:value="pushing"
                    placeholder="请选择"
                    size="small"
                    @change="getPushList"
                    style="width: 10rem"
                  >
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="true">推流进行中</a-select-option>
                    <a-select-option value="false">推流未进行</a-select-option>
                  </a-select>
                </div>
                <div style="display: inline-flex; margin-left: 2rem; align-items: center">
                  <span style="width: 5rem">流媒体:</span>
                  <MediaServerSelect v-model="mediaServerId" @change="getPushList" />
                </div>
              </div>
            </div>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'position'">
              <span v-if="record.longitude * record.latitude > 0">
                {{ record.longitude }} , {{ record.latitude }}
              </span>
              <span v-if="record.longitude * record.latitude == 0">暂无位置</span>
            </template>
            <template v-if="column.dataIndex === 'pushIng'">
              <a-tag color="processing" v-if="record.pushIng"> 正在推流 </a-tag>
              <a-tag v-if="!record.pushIng">已停止</a-tag>
            </template>
            <template v-if="column.dataIndex === 'status'">
              <a-tag color="processing" v-if="record.status"> 在线 </a-tag>
              <a-tag v-if="!record.status">离线</a-tag>
            </template>
            <template v-if="column.dataIndex === 'self'">
              <a-tag color="processing" v-if="record.self"> 是 </a-tag>
              <a-tag v-if="!record.self">否</a-tag>
            </template>
            <template v-if="column.dataIndex === 'operation'">
              <a-button type="link" size="small" @click="play(record)"> 播放 </a-button>
              <a-button type="link" size="small" @click="edit(record)">编辑</a-button>
              <a-popconfirm
                title="确定删除?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="deleteItem(record)"
              >
                <a-button type="link" danger size="small"> 移除 </a-button>
              </a-popconfirm>
              <a-button type="link" size="small" @click="queryCloudRecords(record)">
                云端录像
              </a-button>
            </template>
          </template>
        </a-table>
      </Transition>
    </PageWrapper>
    <Player ref="playRef" />
    <EditStreamPush ref="editStreamPushRef" />
    <UploadStreamPush ref="uploadStreamPushRef" />
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
  import { computed, reactive, ref } from 'vue'
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
    Modal,
  } from 'ant-design-vue'
  import Player from '/@/views/common/player/index.vue'
  import { pushColumns } from '/@/views/resource/push/columns'
  import { PushModel } from '/@/api/resource/model/pushModel'
  import { MediaServer } from '/@/api/mediaServer/model/MediaServer'
  import {
    batchDeletePushApi,
    deletePushApi,
    playPushApi,
    queryPushListApi,
    stopPushApi,
  } from '/@/api/resource/push'
  import EditStreamPush from '/@/views/common/editStreamPush/index.vue'
  import UploadStreamPush from '/@/views/common/uploadStreamPush/index.vue'
  import MediaServerSelect from '/@/views/common/mediaServerSelect/index.vue'
  import CloudRecordDetail from '/@/views/cloudRecord/cloudRecordDetail/index.vue'

  const playRef = ref()
  const editStreamPushRef = ref()
  const uploadStreamPushRef = ref()
  /**
   * 定义变量
   */
  let loading = ref(false)
  const columns = pushColumns()
  let dataSource = ref<PushModel[]>([])
  let mediaServerList = ref<MediaServer[]>([])
  let tablePage = ref(1)
  let tablePageSize = ref(15)
  let tableTotal = ref(0)
  let cloudRecordApp = ref<string>('')
  let cloudRecordStream = ref<string>('')
  let state = reactive<{ selectedRowKeys: number[] }>({
    selectedRowKeys: [],
  })
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
  let pushing = ref<string>('')
  let mediaServerId = ref<string>('')
  function pageSizeChange(oldPageSize: number, pageSize: number): void {
    tablePageSize.value = pageSize
    console.log('pageSizeChange')
    getPushList()
  }
  const onSelectChange = (selectedRowKeysParam: number[]) => {
    state.selectedRowKeys = selectedRowKeysParam
  }
  function pageChange(page: number): void {
    tablePage.value = page
    console.log('pageChange')
    getPushList()
  }
  function addStream(): void {
    editStreamPushRef.value.openModel(null, () => {
      getPushList()
    })
  }
  function importChannel(): void {
    uploadStreamPushRef.value.openModel()
  }
  function batchDel(): void {
    console.log(state.selectedRowKeys)
    Modal.confirm({
      title: '确认要删除这些推流吗?',
      onOk() {
        return batchDeletePushApi(state.selectedRowKeys).then((data) => {
          getPushList()
        })
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onCancel() {},
    })
  }
  function getPushList(): void {
    dataSource.value = []
    loading.value = true
    queryPushListApi({
      query: searchSrt.value,
      pushing: pushing.value === '' ? null : pushing.value,
      mediaServerId: mediaServerId.value,
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
  function play(pushItem: PushModel): void {
    console.log('播放')
    if (typeof pushItem.mediaServerId == 'undefined') {
      message.warn('播放失败: 缺少流媒体ID')
      return
    }
    loading.value = true
    playPushApi(pushItem.app, pushItem.stream, pushItem.mediaServerId)
      .then((streamInfo) => {
        console.log(streamInfo)
        playRef.value.play(streamInfo, pushItem.app + '/' + pushItem.stream, true)
      })
      .finally(() => {
        loading.value = false
      })
  }
  function edit(pushItem: PushModel): void {
    editStreamPushRef.value.openModel(pushItem)
  }
  function deleteItem(pushItem: PushModel): void {
    if (!pushItem.id) {
      message.warn('删除失败: 缺少ID')
    } else {
      deletePushApi(parseInt(pushItem.id)).then(() => {
        getPushList()
      })
    }
  }
  function queryCloudRecords(pushItem: PushModel): void {
    cloudRecordApp.value = pushItem.app
    cloudRecordStream.value = pushItem.stream
  }
  const closeCloudRecordDetail = () => {
    cloudRecordApp.value = ''
    cloudRecordStream.value = ''
  }
  // 初始化获取数据
  getPushList()
</script>
