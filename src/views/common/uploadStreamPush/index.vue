<template>
  <a-modal
    ref="uploadStreamPush"
    v-model:visible="open"
    title="批量导入"
    width="30rem"
    :footer="null"
  >
    <div style="padding: 1rem">
      <a-upload-dragger
        name="file"
        :multiple="false"
        :action="actionUrl"
        :headers="headers"
        @change="fileChange"
      >
        <p class="ant-upload-drag-icon">
          <Icon icon="material-symbols:upload" size="48" />
        </p>
        <p class="ant-upload-text">单击或拖动文件到此区域进行上传</p>
        <p class="ant-upload-hint">请使用模板填写数据后上传</p>
      </a-upload-dragger>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { Modal as AModal, UploadDragger as AUploadDragger } from 'ant-design-vue'
  import Icon from '/@/components/Icon/src/Icon.vue'
  import { useGlobSetting } from '/@/hooks/setting'
  import { getToken } from '/@/utils/auth'
  const globSetting = useGlobSetting()

  const open = ref<boolean>(false)
  const actionUrl = ref<string>(globSetting.apiUrl + '/api/push/upload')
  const headers = ref<any>({
    'access-token': getToken(),
  })

  const openModel = () => {
    open.value = true
  }
  const fileChange = (file, fileList, event) => {
    console.log(file)
  }
  const handleOk = () => {
    console.log('onBeforeUnmount')
  }
  defineExpose({ openModel })
</script>
