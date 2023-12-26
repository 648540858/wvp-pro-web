<template>
  <a-modal
    ref="editDevice"
    v-model:visible="open"
    :title="title"
    width="40vw"
    centered
    :wrap-style="{ overflow: 'hidden' }"
    @cancel="closeModel"
    @ok="handleOk"
  >
    <div>
      <a-form
        :model="form"
        name="basic"
        :label-col="{ span: 8 }"
        autocomplete="off"
        style="padding: 10px 20px 0 0"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="设备编号"
              name="deviceId"
              :rules="[{ required: true, message: '请输入设备编号' }]"
            >
              <a-input-group compact>
                <a-input v-if="isEdit" v-model:value="form.deviceId" disabled />
                <a-input v-if="!isEdit" v-model:value="form.deviceId" clearable />
              </a-input-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="设备名称"
              name="name"
              :rules="[{ required: true, message: '请输入设备名称' }]"
            >
              <a-input v-model:value="form.name" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="密码"
              name="password"
              :rules="[{ required: false, message: '请输入注册密码，置空则使用统一密码' }]"
            >
              <a-input v-model:value="form.password" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="收流IP"
              name="sdpIp"
              :rules="[{ required: false, message: '请输入收流IP，置空则使用统一收流IP' }]"
            >
              <a-input v-model:value="form.sdpIp" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="流媒体ID" name="mediaServerId">
              <a-select v-model:value="form.mediaServerId" placeholder="请选择流媒体ID">
                <a-select-option key="auto" title="自动负载最小" value="auto">
                  自动负载最小
                </a-select-option>
                <a-select-option
                  v-for="item in mediaServerList"
                  :key="item.id"
                  :label="item.id"
                  :value="item.id"
                >
                  {{ item.id }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="字符集" name="charset">
              <a-select v-model:value="form.charset" placeholder="请选择字符集">
                <a-select-option key="GB2312" title="GB2312" value="GB2312">
                  GB2312
                </a-select-option>
                <a-select-option key="UTF-8" title="UTF-8" value="UTF-8"> GB2312 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="地理坐标系" name="geoCoordSys">
              <a-select v-model:value="form.geoCoordSys" placeholder="请选择地理坐标系">
                <a-select-option key="WGS84" title="WGS84" value="WGS84"> WGS84 </a-select-option>
                <a-select-option key="GCJ02" title="GCJ02" value="GCJ02"> GB2312 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="目录订阅" name="subscribeCycleForCatalog">
              <a-switch
                v-model:checked="switchForCatalogSubscribe"
                checked-children="开"
                un-checked-children="关"
                @change="subscribeCatalogSwitchChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="移动位置订阅" name="subscribeCycleForMobilePosition">
              <a-switch
                v-model:checked="switchForMobilePositionSubscribe"
                checked-children="开"
                un-checked-children="关"
                @change="subscribeMobilePositionSwitchChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="子码流" name="switchPrimarySubStream">
              <a-switch
                checked-children="开"
                un-checked-children="关"
                v-model:checked="form.switchPrimarySubStream"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="SSRC校验" name="ssrcCheck">
              <a-switch
                checked-children="开"
                un-checked-children="关"
                v-model:checked="form.ssrcCheck"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="作为消息通道" name="asMessageChannel">
              <a-switch
                checked-children="开"
                un-checked-children="关"
                v-model:checked="form.asMessageChannel"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import {
    Form as AForm,
    FormItem as AFormItem,
    Modal as AModal,
    Select as ASelect,
    SelectOption as ASelectOption,
    Switch as ASwitch,
    Row as ARow,
    Col as ACol,
  } from 'ant-design-vue'
  import { Device } from '/@/api/resource/model/gbResourceModel'
  import { MediaServer } from '/@/api/resource/model/MediaServer'
  import { addDeviceApi, updateDeviceApi } from '/@/api/resource/gbResource'

  const open = ref<boolean>(false)
  const switchForMobilePositionSubscribe = ref<boolean>(false)
  const switchForCatalogSubscribe = ref<boolean>(false)
  const title = ref<string>('')
  const clearForm = (): Device => {
    return {
      deviceId: '',
      name: '',
      manufacturer: '',
      mediaServerId: '',
      model: '',
      firmware: '',
      transport: '',
      streamMode: '',
      hostAddress: '',
      onLine: false,
      registerTime: '',
      keepaliveTime: '',
      createTime: '',
      updateTime: '',
      charset: '',
      subscribeCycleForCatalog: 0,
      subscribeCycleForMobilePosition: 0,
      mobilePositionSubmissionInterval: 0,
      subscribeCycleForAlarm: 0,
      switchPrimarySubStream: false,
      keepaliveIntervalTime: '',
      channelCount: 0,
      expires: 0,
      ssrcCheck: false,
      geoCoordSys: '',
      password: '',
      sdpIp: '',
      asMessageChannel: false,
    }
  }
  let device = clearForm()
  const form = ref<Device>(device)
  let mediaServerList = ref<MediaServer[]>()

  let isEdit = ref(false)
  let endFnCallback: Function
  const openModel = (device: Device, endFn: Function) => {
    open.value = true
    endFnCallback = endFn
    if (device && device.createTime) {
      title.value = '编辑'
      form.value = device
      switchForCatalogSubscribe.value = device.subscribeCycleForCatalog > 0
      switchForMobilePositionSubscribe.value = device.subscribeCycleForMobilePosition > 0
    } else {
      title.value = '添加'
      form.value = clearForm()
    }
  }
  const subscribeCatalogSwitchChange = (checked: Boolean) => {
    if (form.value == null) {
      return
    }
    if (checked) {
      form.value.subscribeCycleForCatalog = 60
    } else {
      form.value.subscribeCycleForCatalog = 0
    }
  }
  const subscribeMobilePositionSwitchChange = (checked: Boolean) => {
    if (form.value == null) {
      return checked
    }
    if (checked) {
      form.value.subscribeCycleForMobilePosition = 60
      form.value.mobilePositionSubmissionInterval = 5
    } else {
      form.value.subscribeCycleForMobilePosition = 0
      form.value.mobilePositionSubmissionInterval = 0
    }
  }
  const closeModel = () => {
    console.log('onBeforeUnmount')
    open.value = false
    title.value = ''
  }
  const handleOk = () => {
    if (form.value == null) {
      return
    }
    if (form.value.createTime) {
      updateDeviceApi(form.value)
        .then((result) => {
          console.log(result)
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => {
          open.value = false
          endFnCallback(form.value)
        })
    } else {
      addDeviceApi(form.value)
        .then((result) => {
          console.log(result)
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => {
          open.value = false
          endFnCallback(form.value)
        })
    }
  }
  defineExpose({ openModel })
</script>
<style>
  .device-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 20px 40px;
    gap: 20px 10px;
  }
</style>
