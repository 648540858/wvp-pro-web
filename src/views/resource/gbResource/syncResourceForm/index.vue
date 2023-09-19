<template>
  <a-modal
    v-model:visible="open"
    :title="title"
    centered="true"
    :loading="loading"
    width="65vw"
    @ok="onSubmit"
  >
    <a-form
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      loading
      style="padding: 1rem"
    >
      <a-form-item label="同步的字段">
        <a-checkbox-group v-model:value="formState.syncKeys">
          <a-descriptions :column="4">
            <a-descriptions-item>
              <a-checkbox value="commonGbName" name="syncKeys">名称</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbManufacturer" name="syncKeys">品牌</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbModel" name="syncKeys">型号</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbOwner" name="syncKeys">归属</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbCivilCode" name="syncKeys">行政区域</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbBlock" name="syncKeys">警区</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbAddress" name="syncKeys">安装地址</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbParental" name="syncKeys">是否有子设备</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbParentID" name="syncKeys">父设备/区域/系统ID</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbSafetyWay" name="syncKeys">信令安全模式</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbRegisterWay" name="syncKeys">注册方式</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbCertNum" name="syncKeys">证书序列号</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbCertifiable" name="syncKeys">证书有效标识</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbErrCode" name="syncKeys">无效原因码</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbEndTime" name="syncKeys">证书终止有效期</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbSecrecy" name="syncKeys">保密属性</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbIPAddress" name="syncKeys">
                设备/区域/系统IP地址
              </a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbPort" name="syncKeys">设备/区域/系统端口</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbPassword" name="syncKeys">设备口令</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbStatus" name="syncKeys" disabled>设备状态</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbLongitude" name="syncKeys">经度</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbLatitude" name="syncKeys">纬度</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbPtzType" name="syncKeys">摄像机类型扩展</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbPositionType" name="syncKeys">摄像机位置类型</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbRoomType" name="syncKeys">安装位置</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbUseType" name="syncKeys">用途</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbSupplyLightType" name="syncKeys">补光属性</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbResolution" name="syncKeys">支持的分辨率</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbBusinessGroupID" name="syncKeys">业务分组</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbDownloadSpeed" name="syncKeys">下载倍速范围</a-checkbox>
            </a-descriptions-item>
            <a-descriptions-item>
              <a-checkbox value="commonGbSVCTimeSupportMode" name="syncKeys"
                >时域编码能力</a-checkbox
              >
            </a-descriptions-item>
          </a-descriptions>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item label="分组信息">
        <a-checkbox name="syncGroup">是否同步来自设备的分组信息</a-checkbox>
      </a-form-item>
      <a-form-item label="行政区划">
        <a-checkbox name="syncRegion">是否同步来自设备的行政区划</a-checkbox>
      </a-form-item>
      <!--      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">-->
      <!--        <a-button type="primary" @click="onSubmit">开始同步</a-button>-->
      <!--        <a-button style="margin-left: 10px">取消</a-button>-->
      <!--      </a-form-item>-->
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
  import { syncChannelFromGb28181Api } from '/@/api/resource/gbResource'
  import { reactive, ref, UnwrapRef } from 'vue'
  import {
    Modal as AModal,
    Form as AForm,
    FormItem as AFormItem,
    Checkbox as ACheckbox,
    CheckboxGroup as ACheckboxGroup,
    message,
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
  } from 'ant-design-vue'

  let loading = ref(false)
  let open = ref(false)
  let title = ref('同步国标设备到资源库')
  const labelCol = { style: { width: '150px' } }
  const wrapperCol = { span: 14 }

  const deviceId = ref('')

  interface FormState {
    syncGroup: boolean
    syncRegion: boolean
    syncKeys: string[]
  }

  const formState: UnwrapRef<FormState> = reactive({
    syncGroup: true,
    syncRegion: true,
    syncKeys: [
      'commonGbName',
      'commonGbManufacturer',
      'commonGbModel',
      'commonGbOwner',
      'commonGbCivilCode',
      'commonGbSecrecy',
      'commonGbIPAddress',
      'commonGbPort',
      'commonGbStatus',
      'commonGbLongitude',
      'commonGbLatitude',
      'commonGbPtzType',
      'commonGbPositionType',
      'commonGbRoomType',
      'commonGbUseType',
      'commonGbSupplyLightType',
      'commonGbDirectionType',
      'commonGbResolution',
      'commonGbDownloadSpeed',
      'commonGbSVCTimeSupportMode',
    ],
  })

  const onSubmit = () => {
    loading.value = true
    const syncKeysStr = formState.syncKeys.join(',')
    syncChannelFromGb28181Api(
      deviceId.value,
      formState.syncGroup,
      formState.syncRegion,
      syncKeysStr,
    )
      .then(() => {
        message.success('同步成功')
      })
      .catch((e) => {
        message.success('同步失败： ' + e)
      })
      .finally(() => {
        loading.value = false
      })
  }
  const show = (_deviceId: string): void => {
    open.value = true
    deviceId.value = _deviceId
  }

  defineExpose({
    show,
  })
</script>
