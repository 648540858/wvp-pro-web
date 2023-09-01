<template>
  <PageWrapper>
    <div class="md:flex enter-y">
      <Card
        size="small"
        :loading="loading"
        title="持续运行时间"
        class="md:w-1/4 w-full !md:mt-0 !md:mr-4 !mt-4"
      >
        <template #extra>
          <Tag color="#389e0d">时</Tag>
        </template>
        <div class="py-4 px-4 flex justify-between items-center">
          <span>$100</span>
        </div>
        <div class="p-2 px-4 flex justify-between">
          <span>总 1000</span>
        </div>
      </Card>
      <Card
        size="small"
        :loading="loading"
        title="播放量"
        class="md:w-1/4 w-full !md:mt-0 !md:mr-4 !mt-4"
      >
        <template #extra>
          <Tag color="#13669e">日</Tag>
        </template>
        <div class="py-4 px-4 flex justify-between items-center">
          <span>$100</span>
        </div>
        <div class="p-2 px-4 flex justify-between">
          <span>总 1000</span>
        </div>
      </Card>
      <Card
        size="small"
        :loading="loading"
        title="持续运行时间"
        class="md:w-1/4 w-full !md:mt-0 !md:mr-4 !mt-4"
      >
        <template #extra>
          <Tag color="#389e0d">小时</Tag>
        </template>
        <div class="py-4 px-4 flex justify-between items-center">
          <span>$100</span>
        </div>
        <div class="p-2 px-4 flex justify-between">
          <span>总 1000</span>
        </div>
      </Card>
      <Card
        size="small"
        :loading="loading"
        title="持续运行时间"
        class="md:w-1/4 w-full !md:mt-0 !md:mr-4 !mt-4"
      >
        <template #extra>
          <Tag color="#389e0d">小时</Tag>
        </template>
        <div class="py-4 px-4 flex justify-between items-center">
          <span>$100</span>
          <Icon icon="mdi:file" />
        </div>
        <div class="p-2 px-4 flex justify-between">
          <span>总 1000</span>
        </div>
      </Card>
    </div>
    <div class="lg:flex">
      <div class="lg:w-7/10 w-full !mr-4 enter-y"> 概览信息 </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { Tag, Card } from 'ant-design-vue'
  import { PageWrapper } from '/@/components/Page'
  import { Icon } from '/@/components/Icon'
  const loading = ref(true)

  setTimeout(() => {
    loading.value = false
  }, 1500)
</script>
