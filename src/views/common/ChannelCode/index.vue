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
            {{ item.commonRegionName }} - {{ item.commonRegionDeviceId }}
          </a-radio>
        </a-radio-group>
        <template #tab>
          <div class="show-code-item">{{ allVal[0].val }}</div>
          <div style="text-align: center">{{ allVal[0].meaning }}</div>
        </template>
      </a-tab-pane>
      <a-tab-pane key="1">
        <a-radio-group v-model:value="allVal[1].val">
          <a-radio v-for="item in regionList" :value="item.commonRegionDeviceId.substring(2)">
            {{ item.commonRegionName }} - {{ item.commonRegionDeviceId.substring(2) }}
          </a-radio>
        </a-radio-group>
        <template #tab>
          <div class="show-code-item">{{ allVal[1].val }}</div>
          <div style="text-align: center">{{ allVal[1].meaning }}</div>
        </template>
      </a-tab-pane>
      <a-tab-pane key="2">
        <a-radio-group v-model:value="allVal[2].val">
          <a-radio v-for="item in regionList" :value="item.commonRegionDeviceId.substring(4)">
            {{ item.commonRegionName }} - {{ item.commonRegionDeviceId.substring(4) }}
          </a-radio>
        </a-radio-group>
        <template #tab>
          <div class="show-code-item">{{ allVal[2].val }}</div>
          <div style="text-align: center">{{ allVal[2].meaning }}</div>
        </template>
      </a-tab-pane>
      <a-tab-pane key="3">
        请手动输入基层接入单位编码
        <a-input v-model:value="allVal[3].val" />
        <template #tab>
          <div class="show-code-item">{{ allVal[3].val }}</div>
          <div style="text-align: center">{{ allVal[3].meaning }}</div>
        </template>
      </a-tab-pane>
      <a-tab-pane key="4">
        <a-radio-group v-model:value="allVal[4].val">
          <a-radio v-for="item in industryCodeTypeList" :value="item.code">
            {{ item.name }} - {{ item.code }}
          </a-radio>
        </a-radio-group>
        <template #tab>
          <div class="show-code-item">{{ allVal[4].val }}</div>
          <div style="text-align: center">{{ allVal[4].meaning }}</div>
        </template>
      </a-tab-pane>
      <a-tab-pane key="5">
        <a-radio-group v-model:value="allVal[5].val">
          <a-radio v-for="item in deviceTypeList" :value="item.code">
            {{ item.name }} - {{ item.code }}
          </a-radio>
        </a-radio-group>
        <template #tab>
          <div class="show-code-item">{{ allVal[5].val }}</div>
          <div style="text-align: center">{{ allVal[5].meaning }}</div>
        </template>
      </a-tab-pane>
      <a-tab-pane key="6">
        <a-radio-group v-model:value="allVal[6].val">
          <a-radio v-for="item in networkIdentificationTypeList" :value="item.code">
            {{ item.name }} - {{ item.code }}
          </a-radio>
        </a-radio-group>
        <template #tab>
          <div class="show-code-item">{{ allVal[6].val }}</div>
          <div style="text-align: center">{{ allVal[6].meaning }}</div>
        </template>
      </a-tab-pane>
      <a-tab-pane key="7">
        请手动输入设备/用户序号
        <a-input v-model:value="allVal[7].val" />
        <template #tab>
          <div class="show-code-item">{{ allVal[7].val }}</div>
          <div style="text-align: center">{{ allVal[7].meaning }}</div>
        </template>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>
<script lang="ts" setup>
  import { ref, defineEmits } from 'vue'
  import {
    Modal as AModal,
    Tabs as ATabs,
    TabPane as ATabPane,
    RadioGroup as ARadioGroup,
    Radio as ARadio,
    message,
    Input as AInput,
  } from 'ant-design-vue'
  import { Region } from '/@/api/resource/model/regionModel'
  import { queryChildList } from '/@/api/resource/region'
  import {
    queryDeviceTypeList,
    queryIndustryCodeList,
    queryNetworkIdentificationTypeList,
  } from '/@/api/resource/channel'
  import { IndustryCodeType } from '/@/api/resource/model/industryCodeType'
  import { DeviceType } from '/@/api/resource/model/deviceTypeModel'
  import { NetworkIdentificationType } from '/@/api/resource/model/networkIdentificationTypeModel'

  const open = ref<boolean>(false)
  const okText = ref<string>('完成')
  const activeKey = ref<string>('0')
  // 参考国标 统一编码规则
  interface CodeType {
    id: number[] // 码位
    meaning: string // 含义。 比如 中心编码下的 省级编码
    val: string // 取值， 比如34
    type: string // 码段
  }
  const emit = defineEmits(['end'])
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
  const deviceTypeList = ref<DeviceType[]>()
  const industryCodeTypeList = ref<IndustryCodeType[]>()
  const networkIdentificationTypeList = ref<NetworkIdentificationType[]>()
  const getRegionList = () => {
    regionList.value = []
    if (activeKey.value === '0' || activeKey.value === '1' || activeKey.value === '2') {
      let parent = ''
      if (activeKey.value === '1') {
        parent = allVal.value[0].val
        if (parent === '11' || parent === '12' || parent === '31') {
          regionList.value = [
            {
              // 数据库自增ID
              commonRegionId: -1,
              // 区域国标编号
              commonRegionDeviceId: parent + '01',
              // 区域名称
              commonRegionName: '市辖区',
              // 父区域国标ID
              commonRegionParentId: parent,
            },
          ]
          return
        } else if (parent === '50') {
          regionList.value = [
            {
              // 数据库自增ID
              commonRegionId: -1,
              // 区域国标编号
              commonRegionDeviceId: parent + '01',
              // 区域名称
              commonRegionName: '市辖区',
              // 父区域国标ID
              commonRegionParentId: parent,
            },
            {
              // 数据库自增ID
              commonRegionId: -1,
              // 区域国标编号
              commonRegionDeviceId: parent + '02',
              // 区域名称
              commonRegionName: '县',
              // 父区域国标ID
              commonRegionParentId: parent,
            },
          ]
          return
        }
      }
      if (activeKey.value === '2') {
        if (allVal.value[0].val === '11' || allVal.value[0].val === '12' || allVal.value[0].val === '31' || allVal.value[0].val === '50') {
          parent = allVal.value[0].val
        } else {
          parent = allVal.value[0].val + allVal.value[1].val
        }

        console.log(parent)
      }
      if (activeKey.value !== '0' && parent == '') {
        message.error('请先选择上级行政区划')
      }
      queryChildList(parent)
        .then((result) => {
          console.log(result)
          regionList.value = result
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => {})
    } else if (activeKey.value === '4') {
      queryIndustryCodeList()
        .then((result) => {
          console.log(result)
          industryCodeTypeList.value = result
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => {})
    } else if (activeKey.value === '5') {
      queryDeviceTypeList()
        .then((result) => {
          console.log(result)
          deviceTypeList.value = result
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => {})
    } else if (activeKey.value === '6') {
      queryNetworkIdentificationTypeList()
        .then((result) => {
          console.log(result)
          networkIdentificationTypeList.value = result
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
    console.log(code)
    open.value = true
    if (typeof code != 'undefined' && code.length === 20) {
      allVal.value[0].val = code.substring(0, 2)
      allVal.value[1].val = code.substring(2, 4)
      allVal.value[2].val = code.substring(4, 6)
      allVal.value[3].val = code.substring(6, 8)
      allVal.value[4].val = code.substring(8, 10)
      allVal.value[5].val = code.substring(10, 13)
      allVal.value[6].val = code.substring(14, 15)
      allVal.value[7].val = code.substring(15)
    }
  }
  const closeModel = () => {
    console.log('onBeforeUnmount')
    open.value = false
  }
  const handleOk = () => {
    const code =
      allVal.value[0].val +
      allVal.value[1].val +
      allVal.value[2].val +
      allVal.value[3].val +
      allVal.value[4].val +
      allVal.value[5].val +
      allVal.value[6].val +
      allVal.value[7].val
    console.log(code)
    emit('end', code)
    open.value = false
  }

  defineExpose({ openModel })
</script>
<style>
  .show-code-item {
    text-align: center;
    font-size: 3rem;
  }
</style>
