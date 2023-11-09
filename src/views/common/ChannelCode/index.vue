<template>
  <a-modal
    ref="editGroup"
    v-model:visible="open"
    title="生成国标编码"
    width="60rem"
    @cancel="closeModel"
    :okText="okText"
    @ok="handleOk"
  >
    <a-tabs v-model:activeKey="activeKey" centered @change="tabChange">
      <a-tab-pane key="0">
        <a-radio-group v-model:value="allVal[0].val">
          <a-radio v-for="item in regionList" :value="item.commonRegionDeviceId">
            {{ item.commonRegionName }}
          </a-radio>
        </a-radio-group>
        <template #tab>
          <div class="show-code-item">{{ allVal[0].val }}</div>
          <div style="text-align: center">{{ allVal[0].meaning }}</div>
        </template>
      </a-tab-pane>
      <a-tab-pane key="1">
        <a-radio-group v-model:value="allVal[1].val">
          <a-radio v-for="item in regionList" :value="item.commonRegionDeviceId">
            {{ item.commonRegionName }}
          </a-radio>
        </a-radio-group>
        <template #tab>
          <div class="show-code-item">{{ allVal[1].val }}</div>
          <div style="text-align: center">{{ allVal[1].meaning }}</div>
        </template>
      </a-tab-pane>
      <a-tab-pane key="2">
        <a-radio-group v-model:value="allVal[2].val">
          <a-radio v-for="item in regionList" :value="item.commonRegionDeviceId">
            {{ item.commonRegionName }}
          </a-radio>
        </a-radio-group>
        <template #tab>
          <div class="show-code-item">{{ allVal[2].val }}</div>
          <div style="text-align: center">{{ allVal[2].meaning }}</div>
        </template>
      </a-tab-pane>
      <a-tab-pane key="3">
        <a-radio-group v-model:value="allVal[3].val">
          <a-radio v-for="item in regionList" :value="item.commonRegionDeviceId">
            {{ item.commonRegionName }}
          </a-radio>
        </a-radio-group>
        <template #tab>
          <div class="show-code-item">{{ allVal[3].val }}</div>
          <div style="text-align: center">{{ allVal[3].meaning }}</div>
        </template>
      </a-tab-pane>
      <a-tab-pane key="4">
        {{ allVal[4].meaning }}
        <template #tab>
          <div class="show-code-item">{{ allVal[4].val }}</div>
          <div style="text-align: center">{{ allVal[4].meaning }}</div>
        </template>
      </a-tab-pane>
      <a-tab-pane key="5">
        {{ allVal[5].meaning }}
        <template #tab>
          <div class="show-code-item">{{ allVal[5].val }}</div>
          <div style="text-align: center">{{ allVal[5].meaning }}</div>
        </template>
      </a-tab-pane>
      <a-tab-pane key="6">
        {{ allVal[6].meaning }}
        <template #tab>
          <div class="show-code-item">{{ allVal[6].val }}</div>
          <div style="text-align: center">{{ allVal[6].meaning }}</div>
        </template>
      </a-tab-pane>
      <a-tab-pane key="7">
        {{ allVal[7].meaning }}
        <template #tab>
          <div class="show-code-item">{{ allVal[7].val }}</div>
          <div style="text-align: center">{{ allVal[7].meaning }}</div>
        </template>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import {
    Modal as AModal,
    Tabs as ATabs,
    TabPane as ATabPane,
    RadioGroup as ARadioGroup,
    Radio as ARadio,
  } from 'ant-design-vue'
  import { Region } from '/@/api/resource/model/regionModel'
  import { queryChildList } from '/@/api/resource/region'

  const open = ref<boolean>(false)
  const okText = ref<string>('下一步')
  const activeKey = ref<string>('0')
  // 参考国标 统一编码规则
  interface CodeType {
    id: number[] // 码位
    meaning: string // 含义。 比如 中心编码下的 省级编码
    val: string // 取值， 比如34
    type: string // 码段
  }
  const allVal = ref<CodeType[]>([])
  allVal.value[0] = {
    id: [1, 2],
    meaning: '省级编码',
    val: '00',
    type: '中心编码',
  }
  allVal.value[1] = {
    id: [3, 4],
    meaning: '市级编码',
    val: '00',
    type: '中心编码',
  }
  allVal.value[2] = {
    id: [5, 6],
    meaning: '区级编码',
    val: '00',
    type: '中心编码',
  }
  allVal.value[3] = {
    id: [7, 8],
    meaning: '基层接入单位编码',
    val: '00',
    type: '中心编码',
  }
  allVal.value[4] = {
    id: [9, 10],
    meaning: '行业编码',
    val: '00',
    type: '行业编码',
  }
  allVal.value[5] = {
    id: [11, 13],
    meaning: '类型编码',
    val: '000',
    type: '类型编码',
  }
  allVal.value[6] = {
    id: [14],
    meaning: '网络标识编码',
    val: '0',
    type: '网络标识',
  }
  allVal.value[7] = {
    id: [15, 20],
    meaning: '设备/用户序号',
    val: '000000',
    type: '序号',
  }
  const regionList = ref<Region[]>()
  const getRegionList = () => {
    regionList.value = []
    if (parseInt(activeKey.value) < 4) {
      let parent = ''
      if (parseInt(activeKey.value) > 0) {
        parent = allVal[parseInt(activeKey.value) - 1].value
      }
      console.log(parent)
      queryChildList(parent)
        .then((result) => {
          console.log(result)
          regionList.value = result
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => {})
    }
  }
  getRegionList()
  const tabChange = () => {
    console.log(activeKey.value)
    getRegionList()
  }
  const openModel = (code: String | undefined) => {
    open.value = true
    if (typeof code != 'undefined') {
    }
  }
  const closeModel = () => {
    console.log('onBeforeUnmount')
    open.value = false
  }
  const handleOk = () => {
    console.log('onBeforeUnmount')
    if (parseInt(activeKey.value) < allVal.value.length - 2) {
      okText.value = '下一步'
      activeKey.value = parseInt(activeKey.value) + 1 + ''
    } else {
      okText.value = '完成'
      activeKey.value = allVal.value.length - 1 + ''
    }
    console.log(activeKey.value)
  }

  defineExpose({ openModel })
</script>
<style>
  .show-code-item {
    text-align: center;
    font-size: 3rem;
  }
</style>
