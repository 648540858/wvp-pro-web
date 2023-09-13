<template>
  <Modal v-model:visible="open" :title="msg" centered="true" :footer="null">
    <div style="padding: 1rem 2rem">
      <Progress type="line" :percent="percent" :status="status" :show-info="true" />
    </div>
  </Modal>
</template>
<script lang="ts" setup>
  import { refreshChanelApi, refreshStatusChanelApi } from '/@/api/resource/gbResource'
  import { computed, ref } from 'vue'
  import { Progress, Modal } from 'ant-design-vue'

  let open = ref(false)
  let current = ref(0)
  let total = ref(0)
  let status = ref('active')
  let currentDeviceId = ref('')
  const percent = computed(
    () => Math.floor((Number(current.value) / Number(total.value)) * 10000) / 100,
  )
  let errorMsg = ref('')
  const msg = computed(() => {
    if (errorMsg.value) {
      return errorMsg.value
    } else {
      if (total.value == 0) {
        return '等待同步中'
      } else {
        return `同步中...[${current.value}/${total.value}]`
      }
    }
  })

  function show(deviceId: string): void {
    currentDeviceId.value = deviceId
    current.value = 0
    total.value = 0
    status.value = 'active'
    errorMsg.value = ''
    refreshChanelApi(deviceId)
      .then(() => {
        open.value = true
        refreshStatus()
      })
      .catch((e) => {
        console.error(e)
      })
  }
  let timer: number
  function refreshStatus() {
    timer = window.setInterval(() => {
      refreshStatusChanelApi(currentDeviceId.value)
        .then((res) => {
          if (res.syncIng) {
            current.value = res.current
            total.value = res.total
          } else {
            if (timer) {
              window.clearInterval(timer)
            }
            if (res.errorMsg) {
              errorMsg.value = res.errorMsg
              status.value = 'exception'
            } else {
              current.value = res.current
              total.value = res.total
              status.value = 'success'
              errorMsg.value = '同步成功'
            }
          }
        })
        .catch(() => {
          if (timer) {
            window.clearInterval(timer)
          }
        })
    }, 1000)
  }
  defineExpose({
    show,
  })
</script>
