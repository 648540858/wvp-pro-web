<template>
  <a-layout style="height: 100%">
    <a-layout-sider
      width="300"
      style="padding-left: 1rem; padding-right: 0.2rem; height: 100%; background: transparent"
    >
      <resourceTree />
    </a-layout-sider>
    <a-layout-content style="padding-left: 0.2rem; padding-right: 1rem">
      <div style="border-left: 2px solid #c3c3c3; height: 100%"> 1111 </div>
    </a-layout-content>
  </a-layout>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import resourceTree from '../../common/resourceTree/index.vue'
</script>
