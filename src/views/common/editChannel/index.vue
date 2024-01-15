<template>
  <a-modal
    ref="editChannel"
    v-model:visible="open"
    :title="title"
    width="90rem"
    :wrap-style="{ overflow: 'auto' }"
    @cancel="closeModel"
    @ok="handleOk"
  >
    <a-form
      :model="channel"
      name="basic"
      :label-col="{ span: 5 }"
      autocomplete="off"
      class="channel-form"
    >
      <div class="form-box">
        <a-form-item
          label="编号"
          name="commonGbDeviceID"
          :rules="[{ required: true, message: '请输入设备编号' }]"
        >
          <a-input
            v-model:value="channel.commonGbDeviceID"
            clearable
            placeholder="请输入编号"
            style="width: calc(100% - 64px)"
          />
          <a-button style="width: 64px" @click="getChannelCode">生成</a-button>
        </a-form-item>
        <a-form-item
          label="名称"
          name="commonGbName"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input v-model:value="channel.commonGbName" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="状态" name="commonGbStatus">
          <a-switch
            v-model:checked="channel.commonGbStatus"
            checked-children="在线"
            un-checked-children="离线"
          />
        </a-form-item>
        <a-form-item label="摄像机类型" name="commonGbPtzType">
          <a-select v-model:value="channel.commonGbPtzType" placeholder="请选择摄像机类型">
            <a-select-option title="球机" :value="1"> 球机 </a-select-option>
            <a-select-option title="半球" :value="2"> 半球 </a-select-option>
            <a-select-option title="固定枪机" :value="3"> 固定枪机 </a-select-option>
            <a-select-option title="遥控枪机" :value="4"> 遥控枪机 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="经度" name="commonGbLongitude">
          <a-input-number v-model:value="channel.commonGbLongitude" />
        </a-form-item>
        <a-form-item label="纬度" name="commonGbLatitude">
          <a-input-number v-model:value="channel.commonGbLatitude" />
        </a-form-item>
        <a-form-item label="安装地址" name="commonGbAddress">
          <a-input v-model:value="channel.commonGbAddress" placeholder="请输入安装地址" />
        </a-form-item>
        <a-form-item label="厂商" name="commonGbManufacturer">
          <a-input v-model:value="channel.commonGbManufacturer" />
        </a-form-item>
        <a-form-item label="型号" name="commonGbModel">
          <a-input v-model:value="channel.commonGbModel" />
        </a-form-item>
        <a-form-item label="归属" name="commonGbOwner">
          <a-input v-model:value="channel.commonGbOwner" />
        </a-form-item>
      </div>
      <div class="form-box">
        <a-form-item label="警区" name="commonGbBlock">
          <a-input v-model:value="channel.commonGbBlock" />
        </a-form-item>

        <a-form-item label="IP地址" name="commonGbIPAddress">
          <a-input v-model:value="channel.commonGbIPAddress" />
        </a-form-item>
        <a-form-item label="端口" name="commonGbPort">
          <a-input-number v-model:value="channel.commonGbPort" />
        </a-form-item>
        <a-form-item label="口令" name="commonGbPassword">
          <a-input v-model:value="channel.commonGbPassword" />
        </a-form-item>
        <a-form-item label="位置类型" name="commonGbPositionType">
          <a-select v-model:value="channel.commonGbPositionType" placeholder="请选择摄像机类型">
            <a-select-option title="省际检查站" :value="1"> 省际检查站 </a-select-option>
            <a-select-option title="党政机关" :value="2"> 党政机关 </a-select-option>
            <a-select-option title="车站码头" :value="3"> 车站码头 </a-select-option>
            <a-select-option title="中心广场" :value="4"> 中心广场 </a-select-option>
            <a-select-option title="体育场馆" :value="5"> 体育场馆 </a-select-option>
            <a-select-option title="商业中心" :value="6"> 商业中心 </a-select-option>
            <a-select-option title="宗教场所" :value="7"> 宗教场所 </a-select-option>
            <a-select-option title="校园周边" :value="8"> 校园周边 </a-select-option>
            <a-select-option title="治安复杂区域" :value="9"> 治安复杂区域 </a-select-option>
            <a-select-option title="交通干线" :value="10"> 交通干线 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="室外/室内" name="commonGbRoomType">
          <a-select v-model:value="channel.commonGbRoomType" placeholder="请选择室外/室内">
            <a-select-option title="室外" :value="1"> 室外 </a-select-option>
            <a-select-option title="室内" :value="2"> 室内 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="监视方位" name="commonGbSupplyLightType">
          <a-select v-model:value="channel.commonGbSupplyLightType" placeholder="请选择监视方位">
            <a-select-option title="东" :value="1"> 东 </a-select-option>
            <a-select-option title="西" :value="2"> 西 </a-select-option>
            <a-select-option title="南" :value="3"> 南 </a-select-option>
            <a-select-option title="北" :value="4"> 北 </a-select-option>
            <a-select-option title="东南" :value="5"> 东南 </a-select-option>
            <a-select-option title="东北" :value="6"> 东北 </a-select-option>
            <a-select-option title="西南" :value="7"> 西南 </a-select-option>
            <a-select-option title="西北" :value="8"> 西北 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="用途" name="commonGbUseType">
          <a-select v-model:value="channel.commonGbUseType" placeholder="请选择用途">
            <a-select-option title="治安" :value="1"> 治安 </a-select-option>
            <a-select-option title="交通" :value="2"> 交通 </a-select-option>
            <a-select-option title="重点" :value="3"> 重点 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="补光" name="commonGbSupplyLightType">
          <a-select v-model:value="channel.commonGbSupplyLightType" placeholder="请选择补光属性">
            <a-select-option title="无补光" :value="1"> 无补光 </a-select-option>
            <a-select-option title="红外补光" :value="2"> 红外补光 </a-select-option>
            <a-select-option title="白光补光" :value="3"> 白光补光 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="保密" name="commonGbSecrecy">
          <a-select v-model:value="channel.commonGbSecrecy" placeholder="请选择证书有效标识">
            <a-select-option title="不涉密" :value="0"> 不涉密 </a-select-option>
            <a-select-option title="涉密" :value="1"> 涉密 </a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <div class="form-box">
        <a-form-item label="证书序列号" name="commonGbCertNum">
          <a-input v-model:value="channel.commonGbCertNum" />
        </a-form-item>
        <a-form-item v-if="channel.commonGbCertNum" label="证书有效标识" name="commonGbCertNum">
          <a-select v-model:value="channel.commonGbCertifiable" placeholder="请选择证书有效标识">
            <a-select-option title="无效" :value="0"> 无效 </a-select-option>
            <a-select-option title="有效" :value="1"> 有效 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="channel.commonGbCertNum && channel.commonGbCertifiable == 0"
          label="无效原因码"
          name="commonGbErrCode"
        >
          <a-input-number v-model:value="channel.commonGbErrCode" />
        </a-form-item>
        <a-form-item v-if="channel.commonGbCertNum" label="证书终止有效期" name="commonGbEndTime">
          <a-input v-model:value="channel.commonGbEndTime" />
        </a-form-item>
        <a-form-item label="信令安全模式" name="commonGbSafetyWay">
          <a-select v-model:value="channel.commonGbSafetyWay" placeholder="请选择信令安全模式">
            <a-select-option title="不采用" :value="0"> 不采用 </a-select-option>
            <a-select-option title="S/MIME 签名" :value="2"> S/MIME 签名 </a-select-option>
            <a-select-option title="S/MIME加密签名同时采用" :value="3">
              S/MIME加密签名同时采用
            </a-select-option>
            <a-select-option title="数字摘要" :value="4"> 数字摘要 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="注册方式" name="commonGbRegisterWay">
          <a-select v-model:value="channel.commonGbRegisterWay" placeholder="请选择信令安全模式">
            <a-select-option title="符合IETFRFC3261标准的认证注册模式" :value="1">
              符合IETFRFC3261标准的认证注册模式
            </a-select-option>
            <a-select-option title="基于口令的双向认证注册模式" :value="2">
              基于口令的双向认证注册模式
            </a-select-option>
            <a-select-option title="基于数字证书的双向认证注册模式" :value="3">
              基于数字证书的双向认证注册模式
            </a-select-option>
            <a-select-option title="数字摘要" :value="4"> 数字摘要 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="分辨率" name="commonGbResolution">
          <a-input v-model:value="channel.commonGbResolution" />
        </a-form-item>
        <a-form-item label="下载倍速" name="commonGbDownloadSpeed">
          <a-input v-model:value="channel.commonGbDownloadSpeed" />
        </a-form-item>
        <a-form-item label="时域编码" name="commonGbSVCTimeSupportMode">
          <a-select
            v-model:value="channel.commonGbSVCTimeSupportMode"
            placeholder="请选择时域编码能力"
          >
            <a-select-option title="不支持" :value="0"> 不支持 </a-select-option>
            <a-select-option title="1级增强" :value="1"> 1级增强 </a-select-option>
            <a-select-option title="2级增强" :value="2"> 2级增强 </a-select-option>
            <a-select-option title="3级增强" :value="3"> 3级增强 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="空域编码" name="commonGbSVCSpaceSupportMode">
          <a-select
            v-model:value="channel.commonGbSVCSpaceSupportMode"
            placeholder="请选择空域编码能力"
          >
            <a-select-option title="不支持" :value="0"> 不支持 </a-select-option>
            <a-select-option title="1级增强" :value="1"> 1级增强 </a-select-option>
            <a-select-option title="2级增强" :value="2"> 2级增强 </a-select-option>
            <a-select-option title="3级增强" :value="3"> 3级增强 </a-select-option>
          </a-select>
        </a-form-item>
      </div>
    </a-form>
  </a-modal>
  <ChannelCode ref="channelCodeRef" @end="getChannelCodeEnd" />
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import {
    Modal as AModal,
    Form as AForm,
    FormItem as AFormItem,
    Select as ASelect,
    InputNumber as AInputNumber,
    SelectOption as ASelectOption,
    Switch as ASwitch, message,
  } from 'ant-design-vue'
  import { CommonGbChannel } from '/@/api/resource/model/channelModel'
  import { cloneDeep } from 'lodash-es'
  import ChannelCode from '/@/views/common/ChannelCode/index.vue'
  import { updateApi } from '/@/api/resource/channel'

  const open = ref<boolean>(false)
  const title = ref<string>('')
  const channelCodeRef = ref()
  const initChannel: CommonGbChannel = {
    commonGbId: 0,
    commonGbDeviceID: '',
    commonGbName: '',
    commonGbCivilCode: '',
    commonGbRegisterWay: 1,
    commonGbSecrecy: 0,
    commonGbSafetyWay: 0,
    commonGbCertifiable: 0,
    commonGbParental: 0,
    commonGbStatus: false,
    commonGbLongitude: 0,
    commonGbLatitude: 0,
    commonGbPtzType: 1,
    commonGbPositionType: 10,
    commonGbRoomType: 1,
    commonGbUseType: 1,
    commonGbSupplyLightType: 1,
    commonGbDirectionType: 1,
    commonGbSVCTimeSupportMode: 0,
    commonGbSVCSpaceSupportMode: 0,
    type: '',
    typeId: '',
  }
  const channel = ref<CommonGbChannel>(initChannel)

  let endFnCallback: Function
  const openModel = (channelParam: CommonGbChannel, endFn: Function) => {
    open.value = true
    endFnCallback = endFn
    if (channelParam && channelParam.commonGbId > 0) {
      title.value = '编辑通道'
      channel.value = cloneDeep(channelParam)
    } else {
      title.value = '添加通道'
      channel.value = initChannel
    }
  }
  const closeModel = () => {
    console.log('onBeforeUnmount')
    open.value = false
    title.value = ''
  }
  const handleOk = () => {
    if (channel.value.commonGbId > 0) {
      updateApi(channel.value)
        .catch((exception) => {
          message.error(exception)
        })
        .finally(() => {
          closeModel()
          endFnCallback()
        })
    }
  }
  const getChannelCodeEnd = (code: string) => {
    channel.value.commonGbDeviceID = code
  }
  const getChannelCode = () => {
    channelCodeRef.value.openModel()
  }

  defineExpose({ openModel })
</script>

<style>
  .channel-form {
    display: grid;
    padding: 2rem;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
  }
  .form-box {
  }
  .item-content {
    width: 8rem;
  }
</style>
