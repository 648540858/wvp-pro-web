<template>
  <div id="platformList">
    <PageWrapper>
      <Transition>
        <a-table
          :dataSource="dataSource"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          rowKey="id"
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
              <a-button type="link" size="small" @click="edit(record)">编辑</a-button>
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
    <EditPlatform ref="editPlatformRef"/>
  </div>
</template>
<script lang="ts" setup>
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
    Popconfirm as APopconfirm,
    message,
  } from 'ant-design-vue'
  import { platformColumns } from '/@/views/gbPlatform/columns'
  import { PlatformModel } from '/@/api/gbPlatform/model/platformModel'
  import { queryPlatformListApi } from '/@/api/gbPlatform/gbPlatform'
  import EditPlatform from '/@/views/common/editPlatform/index.vue'

  /**
   * 定义变量
   */
  let editPlatformRef = ref()
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
  function importChannel(): void {}
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
  function deleteItem(platformModel: PlatformModel): void {}
  // 初始化获取数据
  getPlatformList()
</script>
