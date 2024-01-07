<template>
  <div id="proxyList">
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
                  <a-select
                    v-model:value="mediaServerId"
                    placeholder="请选择"
                    size="small"
                    @change="getPushList"
                    style="width: 10rem"
                  >
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option
                      v-for="item in mediaServerList"
                      :value="item.id"
                      :key="item.id"
                    >
                      {{ item.id }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
            </div>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'operation'">
              <a-button type="link" size="small" @click="play(record)">播放</a-button>
              <a-popconfirm
                title="确定删除?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="stop(record)"
              >
                <a-button type="link" danger size="small" v-if="!!record.streamId">移除</a-button>
              </a-popconfirm>
              <a-button type="link" size="small" @click="edit(record)">编辑</a-button>
              <a-button type="link" size="small" @click="queryCloudRecords(record)">
                录像
              </a-button>
            </template>
          </template>
        </a-table>
      </Transition>
    </PageWrapper>
    <Player ref="playRef" />
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
  } from 'ant-design-vue'
  import Player from '/@/views/common/player/index.vue'
  import { MediaServer } from '/@/api/mediaServer/model/MediaServer'
  import { playPushApi, queryPushListApi, stopPushApi } from '/@/api/resource/push'
  import { proxyColumns } from '/@/views/resource/proxy/columns'
  import {ProxyModel} from "/@/api/resource/model/proxyModel";

  const playRef = ref()
  /**
   * 定义变量
   */
  let loading = ref(false)
  const columns = proxyColumns()
  let dataSource = ref<ProxyModel[]>([])
  let mediaServerList = ref<MediaServer[]>([])
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
  let pushing = ref<string>('')
  let mediaServerId = ref<string>('')
  function pageSizeChange(oldPageSize: number, pageSize: number): void {
    tablePageSize.value = pageSize
    console.log('pageSizeChange')
    getPushList()
  }
  function pageChange(page: number): void {
    tablePage.value = page
    console.log('pageChange')
    getPushList()
  }
  function addStream(): void {}
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
  function play(proxyModel: ProxyModel): void {
    console.log('播放')
    loading.value = true
    playPushApi(proxyModel.app, proxyModel.stream, proxyModel.mediaServerId)
      .then((streamInfo) => {
        console.log(streamInfo)
        playRef.value.play(streamInfo, proxyModel.app + '/' + proxyModel.stream, true)
      })
      .finally(() => {
        loading.value = false
      })
  }
  function stop(proxyModel: ProxyModel): void {
    console.log('停止')
  }
  function queryCloudRecords(_deviceChannel: DeviceChannel): void {}
  // 初始化获取数据
  getPushList()
</script>
