<template>
  <Modal v-model:open="open" title="Basic Modal" centered="true" :footer="null">
    <Progress type="line" :percent="50" :show-info="true" :title="current + '/' + total" />
  </Modal>
</template>
<script lang="ts">
  import { refreshChanelApi } from '/@/api/resource/gbResource'
  import { defineComponent } from 'vue'
  import { Progress, Modal } from 'ant-design-vue'

  export default defineComponent({
    name: 'RefreshChanel',
    components: { Modal, Progress },
    data() {
      return {
        open: false,
        percent: 0,
        current: 0,
        total: 0,
      }
    },
    unmounted() {
      this.open = false
    },
    methods: {
      show: function (deviceId: string): void {
        console.log(deviceId)
        refreshChanelApi(deviceId)
          .then((res) => {
            console.log(res)
          })
          .catch((e) => {
            console.error(e)
          })
      },
    },
  })
</script>
