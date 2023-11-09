<template>
  <a-modal
    ref="editGroup"
    v-model:visible="open"
    :title="title"
    width="30rem"
    :wrap-style="{ overflow: 'hidden' }"
    @cancel="closeModel"
    @ok="handleOk"
  >
    <a-form
      :model="group"
      name="basic"
      :label-col="{ span: 4 }"
      autocomplete="off"
      style="margin-top: 2rem"
    >
      <a-form-item
        label="编码"
        name="commonGroupDeviceId"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input-group compact>
          <a-input v-model:value="deviceIdPrefix" style="width: 7rem" />
          <a-input v-model:value="deviceIdType" style="width: 3rem" disabled />
          <a-input v-model:value="deviceIdSuffix" style="width: 6rem" />
          <a-button style="width: 4rem" @click="getChannelCode">生成</a-button>
        </a-input-group>
      </a-form-item>

      <a-form-item
        label="名称"
        name="commonGroupName"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input v-model:value="group.commonGroupName" style="width: 20rem" />
      </a-form-item>
    </a-form>
    <ChannelCode ref="channelCodeRef" />
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

  const open = ref<boolean>(false)
  const title = ref<string>('')
  const group = ref<Group>({
    commonGroupId: -1,
    // 分组国标编号
    commonGroupDeviceId: '',
    // 分组名称
    commonGroupName: '',
    // 分组父ID
    commonGroupParentId: '',
    // 分组的顶级节点ID，对应多个虚拟组织的业务分组ID
    commonGroupTopId: '',
  })

  const deviceIdPrefix = ref('')
  const deviceIdType = ref('')
  const deviceIdSuffix = ref('')
  const channelCodeRef = ref()
  const openModel = (groupParam: Group) => {
    open.value = true
    if (groupParam.commonGroupId > 0) {
      title.value = '编辑分组'
      deviceIdPrefix.value = groupParam.commonGroupDeviceId.substring(0, 10)
      deviceIdType.value = groupParam.commonGroupDeviceId.substring(10, 13)
      deviceIdSuffix.value = groupParam.commonGroupDeviceId.substring(13, 20)
      group.value = groupParam
    } else {
      title.value = '添加分组'
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
        })
    }
  }
  const getChannelCode = () => {
    channelCodeRef.value.openModel()
  }

  defineExpose({ openModel })
</script>
