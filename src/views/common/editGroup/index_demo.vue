<template>
  <a-modal
    ref="editGroup"
    v-model:visible="open"
    :title="title"
    width="45vw"
    :wrap-style="{ overflow: 'hidden' }"
    @cancel="closeModel"
    :footer="null"
  >
    <a-form
      :model="group"
      name="basic"
      :label-col="{ span: 2 }"
      :wrapper-col="{ span: 7 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="编码"
        name="commonGroupDeviceId"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input-group compact>
          <a-input v-model:value="deviceIdPrefix" style="width: 20%" />
          <a-input v-model:value="deviceIdType" style="width: 30%" disabled />
          <a-input v-model:value="deviceIdSuffix" style="width: 30%" />
        </a-input-group>
      </a-form-item>

      <a-form-item
        label="名称"
        name="commonGroupName"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input v-model:value="group.commonGroupName" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
  import { ref, defineProps, watch} from 'vue'
  import { Modal as AModal, Form as AForm, FormItem as AFormItem } from 'ant-design-vue'
  import { Group } from '/@/api/resource/model/groupModel'

  const open = ref<boolean>(false)
  const title = ref<string>('')
  const props = defineProps<{
    group: Group
  }>()
  console.log(props.group)
  const group = ref(props.group)
  const deviceIdPrefix = ref('')
  const deviceIdType = ref('')
  const deviceIdSuffix = ref('')
  watch(props.group, async (newGroup, oldGroup) => {
    if (newGroup.commonGroupParentId && newGroup.commonGroupTopId) {
      open.value = true
      if (props.group.commonGroupId > 0) {
        title.value = '编辑分组'
        deviceIdPrefix.value = group.value.commonGroupDeviceId.substring(0, 9)
        deviceIdType.value = group.value.commonGroupDeviceId.substring(10, 13)
        deviceIdSuffix.value = group.value.commonGroupDeviceId.substring(14, 20)
      } else {
        title.value = '添加分组'
        group.value.commonGroupId = -1
        group.value.commonGroupDeviceId = ''
        group.value.commonGroupName = ''
        let parentType = group.value.commonGroupParentId.substring(10, 13)
        if (parentType == '215') {
          deviceIdType.value = '216'
        } else {
          deviceIdType.value = '215'
        }
      }
    }
  })
  const closeModel = () => {
    console.log('onBeforeUnmount')
    open.value = false
    title.value = ''
  }
  const onFinish = (values: any) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
</script>
