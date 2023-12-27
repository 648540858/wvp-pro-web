<template>
  <a-modal
    ref="resetAlarm"
    v-model:visible="open"
    title="报警复位"
    width="30rem"
    :wrap-style="{ overflow: 'hidden' }"
    @cancel="closeModel"
    @ok="handleOk"
  >
    <a-form
      :model="resetAlarm"
      name="basic"
      :label-col="{ span: 4 }"
      autocomplete="off"
      style="margin-top: 2rem"
    >
      <a-form-item label="报警方式" name="commonGroupDeviceId">
        <a-select
          v-model:value="resetAlarm.alarmMethod"
          placeholder="请选择报警方式"
          size="small"
          style="width: 5rem"
        >
          <a-select-option value="0">全部</a-select-option>
          <a-select-option value="1">电话报警</a-select-option>
          <a-select-option value="2">设备报警</a-select-option>
          <a-select-option value="3">短信报警</a-select-option>
          <a-select-option value="4">GPS报警</a-select-option>
          <a-select-option value="5">视频报警</a-select-option>
          <a-select-option value="6">设备故障报警</a-select-option>
          <a-select-option value="7">其他报警</a-select-option>
        </a-select>
        <a-select
          v-if="resetAlarm.alarmMethod == 2"
          v-model:value="resetAlarm.alarmType"
          placeholder="请选择报警类型"
          size="small"
          style="width: 5rem"
        >
          <a-select-option value="0">全部</a-select-option>
          <a-select-option value="1">视频丢失报警</a-select-option>
          <a-select-option value="2">设备防拆报警</a-select-option>
          <a-select-option value="3">存储设备磁盘满报警</a-select-option>
          <a-select-option value="4">设备高温报警</a-select-option>
          <a-select-option value="5">设备低温报警</a-select-option>
        </a-select>
        <a-select
          v-if="resetAlarm.alarmMethod == 5"
          v-model:value="resetAlarm.alarmType"
          placeholder="请选择报警类型"
          size="small"
          style="width: 5rem"
        >
          <a-select-option value="0">全部</a-select-option>
          <a-select-option value="1">人工视频报警</a-select-option>
          <a-select-option value="2">运动目标检测报警</a-select-option>
          <a-select-option value="3">遗留物检测报警</a-select-option>
          <a-select-option value="4">物体移除检测报警</a-select-option>
          <a-select-option value="5">绊线检测报警</a-select-option>
          <a-select-option value="6">入侵检测报警</a-select-option>
          <a-select-option value="7">逆行检测报警</a-select-option>
          <a-select-option value="8">徘徊检测报警</a-select-option>
          <a-select-option value="9">流量统计报警</a-select-option>
          <a-select-option value="10">密度检测报警</a-select-option>
          <a-select-option value="11">视频异常检测报警</a-select-option>
          <a-select-option value="12">快速移动报警</a-select-option>
        </a-select>
        <a-select
          v-if="resetAlarm.alarmMethod == 6"
          v-model:value="resetAlarm.alarmType"
          placeholder="请选择报警类型"
          size="small"
          style="width: 5rem"
        >
          <a-select-option value="0">全部</a-select-option>
          <a-select-option value="1">存储设备磁盘故障报警</a-select-option>
          <a-select-option value="2">存储设备风扇故障报警</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import {
    Modal as AModal,
    Form as AForm,
    FormItem as AFormItem,
    Select as ASelect,
    SelectOption as ASelectOption,
    message,
  } from 'ant-design-vue'
  import { ResetAlarmParam } from '/@/api/resource/model/gbResourceModel'
  import { resetAlarmControlApi } from '/@/api/resource/gbResource'

  const open = ref<boolean>(false)
  const resetAlarm = ref<ResetAlarmParam>({
    alarmMethod: 0,
    alarmType: 0,
    deviceId: '',
  })

  const openModel = (deviceId: string) => {
    open.value = true
    resetAlarm.value.deviceId = deviceId
  }
  const closeModel = () => {
    console.log('onBeforeUnmount')
    open.value = false
    resetAlarm.value = {
      alarmMethod: 0,
      alarmType: 0,
      deviceId: '',
    }
  }
  const handleOk = () => {
    resetAlarmControlApi(
      resetAlarm.value.deviceId,
      resetAlarm.value.alarmMethod,
      resetAlarm.value.alarmType,
    )
      .then(() => {
        message.info('发送成功')
      })
      .catch((e) => {
        message.error(e)
      })
  }
  defineExpose({ openModel })
</script>
