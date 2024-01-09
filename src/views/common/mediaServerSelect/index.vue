<template>
  <div class="media-server-select">
    <a-select
      :size="size"
      @change="mediaServerIdChange"
      :placeholder="placeholder"
      :value="modelValue"
    >
      <a-select-option v-if="showAll" value="">全部</a-select-option>
      <a-select-option v-for="item in mediaServerList" :value="item.id" :key="item.id">
        {{ item.id }}
      </a-select-option>
    </a-select>
  </div>
</template>
<script lang="ts" setup>
  import { Select as ASelect, SelectOption as ASelectOption } from 'ant-design-vue'
  import { onMounted, ref } from 'vue'
  import { MediaServer } from '/@/api/mediaServer/model/MediaServer'
  import { queryOnlineMediaServerListApi } from '/@/api/mediaServer/mediaServer'

  const mediaServerList = ref<MediaServer[]>([])
  defineProps({
    modelValue: {
      type: String,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
      default: '请选择节点',
    },
    showAll: {
      type: Boolean,
      required: false,
      default: true,
    },
    size: {
      type: String,
      required: false,
      default: 'small',
    },
  })
  const emits = defineEmits(['update:modelValue', 'change'])
  const mediaServerIdChange = (mediaServerId: string) => {
    emits('update:modelValue', mediaServerId)
    emits('change', mediaServerId)
  }
  onMounted(() => {
    queryOnlineMediaServerListApi().then((mediaServerArray) => {
      mediaServerList.value = mediaServerArray
    })
  })
</script>
