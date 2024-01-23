<template>
  <a-modal
    ref="editPlatform"
    v-model:visible="open"
    :title="title"
    width="60rem"
    :wrap-style="{ overflow: 'hidden' }"
    @cancel="closeModel"
    @ok="handleOk"
  >
    <a-form :model="platformModel" name="basic" autocomplete="off" style="margin: 0 auto">
      <div style="padding: 2rem">
        <div style="display: flex">
          <div style="width: 50%">
            <a-form-item label="名称" name="name" :label-col="{ span: 6 }">
              <a-input v-model:value="platformModel.name" placeholder="名称" style="width: 16rem" />
            </a-form-item>
            <a-form-item label="服务国标编码" name="serverGBId" :label-col="{ span: 6 }">
              <a-input
                v-model:value="platformModel.serverGBId"
                placeholder="服务国标编码"
                style="width: 16rem"
              />
            </a-form-item>
            <a-form-item label="服务国标域" name="serverGBDomain" :label-col="{ span: 6 }">
              <a-input
                v-model:value="platformModel.serverGBDomain"
                placeholder="服务国标域"
                style="width: 16rem"
              />
            </a-form-item>
            <a-form-item label="服务IP" name="serverIP" :label-col="{ span: 6 }">
              <a-input
                v-model:value="platformModel.serverIP"
                placeholder="服务IP"
                style="width: 16rem"
              />
            </a-form-item>
            <a-form-item label="服务端口" name="serverPort" :label-col="{ span: 6 }">
              <a-input
                v-model:value="platformModel.serverPort"
                placeholder="服务端口"
                style="width: 16rem"
              />
            </a-form-item>
            <a-form-item label="设备ip" name="deviceIp" :label-col="{ span: 6 }">
              <a-input
                v-model:value="platformModel.deviceIp"
                placeholder="设备ip"
                style="width: 16rem"
              />
            </a-form-item>
            <a-form-item label="设备端口" name="devicePort" :label-col="{ span: 6 }">
              <a-input
                v-model:value="platformModel.devicePort"
                placeholder="设备端口"
                style="width: 16rem"
              />
            </a-form-item>
            <a-form-item label="启用" name="enable" :label-col="{ span: 6 }">
              <a-switch
                v-model:checked="platformModel.enable"
                checked-children="启用"
                un-checked-children="停用"
              />
            </a-form-item>
          </div>
          <div style="width: 50%">
            <a-form-item label="设备国标编号" name="deviceGBId" :label-col="{ span: 6 }">
              <a-input
                v-model:value="platformModel.deviceGBId"
                placeholder="设备国标编号"
                style="width: 16rem"
              />
            </a-form-item>
            <a-form-item label="认证用户名" name="username" :label-col="{ span: 6 }">
              <a-input
                v-model:value="platformModel.username"
                placeholder="认证用户名"
                style="width: 16rem"
              />
            </a-form-item>
            <a-form-item label="认证密码" name="password" :label-col="{ span: 6 }">
              <a-input
                v-model:value="platformModel.password"
                placeholder="认证密码"
                style="width: 16rem"
              />
            </a-form-item>
            <a-form-item label="注册周期(秒)" name="expires" :label-col="{ span: 6 }">
              <a-input
                v-model:value="platformModel.expires"
                placeholder="注册周期(秒)"
                style="width: 16rem"
              />
            </a-form-item>
            <a-form-item label="心跳周期(秒)" name="keepTimeout" :label-col="{ span: 6 }">
              <a-input
                v-model:value="platformModel.keepTimeout"
                placeholder="心跳周期(秒)"
                style="width: 16rem"
              />
            </a-form-item>
            <a-form-item label="传输协议" name="transport" :label-col="{ span: 6 }">
              <a-select
                style="width: 16rem"
                v-model:value="platformModel.transport"
                placeholder="请选择传输协议"
              >
                <a-select-option value="UDP">UDP</a-select-option>
                <a-select-option value="TCP">TCP</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="字符集" name="characterSet" :label-col="{ span: 6 }">
              <a-select
                style="width: 16rem"
                v-model:value="platformModel.characterSet"
                placeholder="请选择字符集"
              >
                <a-select-option value="GB2312">GB2312</a-select-option>
                <a-select-option value="UTF-8">UTF-8</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="目录分组" name="catalogGroup" :label-col="{ span: 6 }">
              <a-select
                style="width: 16rem"
                v-model:value="platformModel.catalogGroup"
                placeholder="请选择目录分组"
              >
                <a-select-option :value="1">1</a-select-option>
                <a-select-option :value="2">2</a-select-option>
                <a-select-option :value="4">4</a-select-option>
                <a-select-option :value="8">8</a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </div>
        <div style="width: 100%">
          <a-form-item label="其他选项" :label-col="{ span: 2 }">
            <a-checkbox v-model:checked="platformModel.ptz">云台控制</a-checkbox>
            <a-checkbox v-model:checked="platformModel.startOfflinePush">拉起推流</a-checkbox>
            <a-checkbox v-model:checked="platformModel.asMessageChannel">作为消息通道</a-checkbox>
            <a-checkbox v-model:checked="platformModel.autoPushChannel">自动推送通道</a-checkbox>
            <a-checkbox v-model:checked="platformModel.shareAllChannel">共享所有通道</a-checkbox>
            <a-checkbox v-model:checked="platformModel.shareGroup">共享分组</a-checkbox>
            <a-checkbox v-model:checked="platformModel.shareRegion">共享区域</a-checkbox>
          </a-form-item>
        </div>
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
    SelectOption as ASelectOption,
    Checkbox as ACheckbox,
    Switch as ASwitch,
    message,
  } from 'ant-design-vue'
  import ChannelCode from '/@/views/common/ChannelCode/index.vue'
  import { cloneDeep } from 'lodash-es'
  import { PlatformModel } from '/@/api/gbPlatform/model/platformModel'
  import {
    addPlatformApi,
    editPlatformApi,
    queryServerConfigApi,
  } from '/@/api/gbPlatform/gbPlatform'

  const open = ref<boolean>(false)
  const edit = ref<boolean>(false)
  const title = ref<string>('')
  const channelCodeRef = ref()
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
  }
  const platformModel = ref<PlatformModel>(platformInitModel)

  let endFnCallback: Function
  const openModel = (platformModelParam: PlatformModel, endFn: Function) => {
    open.value = true
    endFnCallback = endFn
    if (platformModelParam && platformModelParam.id) {
      title.value = '编辑平台'
      edit.value = true
      platformModel.value = cloneDeep(platformModelParam)
    } else {
      title.value = '添加平台'
      edit.value = false
      platformModel.value = platformInitModel
      queryServerConfigApi().then((result) => {
        platformModel.value.deviceIp = result.deviceIp
        platformModel.value.devicePort = result.devicePort
        platformModel.value.deviceGBId = result.username
        platformModel.value.username = result.username
        platformModel.value.password = result.password
      })
    }
  }
  const closeModel = () => {
    console.log('onBeforeUnmount')
    open.value = false
    title.value = ''
  }
  const getChannelCodeEnd = (code: string) => {
    platformModel.value.deviceGBId = code
  }
  const handleOk = () => {
    if (edit.value) {
      editPlatformApi(platformModel.value)
        .then(() => {
          message.info('保存成功')
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => {
          open.value = false
          endFnCallback(platformModel.value)
        })
    } else {
      addPlatformApi(platformModel.value)
        .then(() => {
          message.info('保存成功')
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => {
          open.value = false
          endFnCallback(platformModel.value)
        })
    }
  }
  defineExpose({ openModel })
</script>
