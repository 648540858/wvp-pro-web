<template>
  <PageWrapper>
    <ptz @ptz-camera="ptzCamera" style="width: 30vw; height: 18vw; padding: 0 1rem 0 1rem" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page'
  import Ptz from '/@/views/common/ptz/index.vue'

  const ptzCamera = (comond: string, speed: number) => {}
</script>
