<template>
  <a-modal
    ref="editDevice"
    v-model:visible="open"
    :title="title"
    width="30rem"
    :wrap-style="{ overflow: 'hidden' }"
    @cancel="closeModel"
    @ok="handleOk"
  >
    <a-form
      :model="form"
      name="basic"
      :label-col="{ span: 4 }"
      autocomplete="off"
      style="margin-top: 2rem"
    >
      <a-form-item
        label="设备编号"
        name="deviceId"
        :rules="[{ required: true, message: '请输入设备编号' }]"
      >
        <a-input-group compact>
          <a-input v-if="isEdit" v-model:value="form.deviceId" disabled />
          <a-input v-if="!isEdit" v-model:value="form.deviceId" clearable />
          <a-button v-if="!isEdit" style="width: 4rem" @click="getChannelCode">生成</a-button>
        </a-input-group>
      </a-form-item>
      <a-form-item
        label="设备名称"
        name="name"
        :rules="[{ required: true, message: '请输入设备名称' }]"
      >
        <a-input v-model:value="form.name" style="width: 20rem" />
      </a-form-item>
      <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: false, message: '请输入注册密码，置空则使用统一密码' }]"
      >
        <a-input v-model:value="form.password" style="width: 20rem" />
      </a-form-item>
      <a-form-item
        label="收流IP"
        name="sdpIp"
        :rules="[{ required: false, message: '请输入收流IP，置空则使用统一收流IP' }]"
      >
        <a-input v-model:value="form.sdpIp" style="width: 20rem" />
      </a-form-item>
      <a-form-item
        label="流媒体ID"
        name="mediaServerId"
        :rules="[{ required: false, message: '请输入收流IP，置空则使用统一收流IP' }]"
      >
        <a-input v-model:value="form.mediaServerId" style="width: 20rem" />
      </a-form-item>
    </a-form>
    <ChannelCode ref="channelCodeRef" @end="getChannelCodeEnd" />
  </a-modal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import {
    Modal as AModal,
    Form as AForm,
    FormItem as AFormItem,
    Button as AButton,
  } from 'ant-design-vue'
  import { Group } from '/@/api/resource/model/groupModel'
  import { addGroupApi, updateGroupApi } from '/@/api/resource/group'
  import ChannelCode from '../ChannelCode/index.vue'
  import {Device} from "/@/api/resource/model/gbResourceModel";

  const open = ref<boolean>(false)
  const title = ref<string>('')
  const form = ref<Device>({
    deviceId: '',
    name: '',
    manufacturer: '',
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
    subscribeCycleForAlarm: 0,
    keepaliveIntervalTime: '',
    channelCount: 0,
    expires: 0,
    ssrcCheck: false,
    geoCoordSys: '',
    password: '',
    sdpIp: '',
    asMessageChannel: false,
  })

  let isEdit = ref(false)
  const deviceIdType = ref('')
  const deviceIdSuffix = ref('')
  const channelCodeRef = ref()
  let endFnCallback: Function
  const openModel = (groupParam: Group, endFn: Function) => {
    open.value = true
    endFnCallback = endFn
    if (groupParam.commonGroupId > 0) {
      title.value = '编辑'
      deviceIdPrefix.value = groupParam.commonGroupDeviceId.substring(0, 10)
      deviceIdType.value = groupParam.commonGroupDeviceId.substring(10, 13)
      deviceIdSuffix.value = groupParam.commonGroupDeviceId.substring(13, 20)
      group.value = groupParam
    } else {
      title.value = '添加'
      group.value.commonGroupId = -1
      group.value.commonGroupDeviceId = ''
      group.value.commonGroupName = ''
      group.value.commonGroupParentId = groupParam.commonGroupParentId
      group.value.commonGroupTopId = groupParam.commonGroupTopId
      deviceIdPrefix.value = ''
      deviceIdSuffix.value = ''
      if (groupParam.commonGroupParentId === '') {
        deviceIdType.value = '215'
      } else {
        deviceIdType.value = '216'
      }
    }
  }
  const closeModel = () => {
    console.log('onBeforeUnmount')
    open.value = false
    title.value = ''
  }
  const handleOk = () => {
    console.log('onBeforeUnmount')
    group.value.commonGroupDeviceId =
      deviceIdPrefix.value + deviceIdType.value + deviceIdSuffix.value
    if (group.value.commonGroupId > 0) {
      updateGroupApi(group.value)
        .then((result) => {
          console.log(result)
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => {
          open.value = false
          endFnCallback(group.value)
        })
    } else {
      addGroupApi(group.value)
        .then((result) => {
          console.log(result)
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => {
          open.value = false
          endFnCallback(group.value)
        })
    }
  }
  const getChannelCode = () => {
    channelCodeRef.value.openModel(
      deviceIdPrefix.value + deviceIdType.value + deviceIdSuffix.value,
      5,
      deviceIdType.value,
    )
  }
  const getChannelCodeEnd = (code: string) => {
    deviceIdPrefix.value = code.substring(0, 10)
    deviceIdSuffix.value = code.substring(13, 20)
  }

  defineExpose({ openModel })
</script>
