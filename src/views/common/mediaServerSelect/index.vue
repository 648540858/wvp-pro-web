<template>
  <div class="media-server-select">
    <a-select
      v-model:value="mediaServerId"
      placeholder="请选择"
      size="small"
      @change="getProxyList"
      style="width: 10rem"
    >
      <a-select-option value="">全部</a-select-option>
      <a-select-option v-for="item in mediaServerList" :value="item.id" :key="item.id">
        {{ item.id }}
      </a-select-option>
    </a-select>
  </div>
</template>
<script lang="ts" setup>
  const props = defineProps({
    mediaServerId: {
      type: String,
      required: true,
    },
  })
</script>
<style>
  .control-wrapper {
    padding: 0;
    margin: 0;
    position: relative;
    width: 240px;
    height: 144px;
    float: left;
    display: flex;
    flex-wrap: nowrap;
  }
  .control-zoom {
    width: 48px;
    height: 144px;
  }
  .control-zoom-in {
    width: 48px;
    height: 48px;
    line-height: 48px;
    margin-top: 12px;
    text-align: center;
  }
  .control-zoom-out {
    width: 48px;
    height: 48px;
    margin-top: 36px;
    line-height: 48px;
    text-align: center;
  }
  .control-ptz {
    width: 144px;
    height: 144px;
  }
  .control-ptz-left-right {
    width: 144px;
    height: 48px;
    display: flex;
    justify-content: center;
  }
  .control-ptz-top {
    width: 144px;
    height: 48px;
    text-align: center;
    line-height: 48px;
  }
  .control-ptz-left {
    width: 48px;
    height: 48px;
    text-align: center;
    line-height: 48px;
  }
  .control-ptz-right {
    width: 48px;
    height: 48px;
    margin-left: 48px;
    text-align: center;
    line-height: 48px;
  }
  .control-ptz-bottom {
    width: 144px;
    height: 48px;
    text-align: center;
    line-height: 48px;
  }
  .control-speed {
    width: 48px;
    height: 144px;
    margin: 0;
    padding: 10px 8px 22px 8px;
  }
  .control-btn:hover {
    cursor: pointer;
  }

  .control-btn i {
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .control-btn i:hover {
    cursor: pointer;
  }
  .ptz-box {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 10px;
  }
  .ptz-item-box {
    display: grid;
  }
  .ptz-item-box-bottom-left {
    display: grid;
    justify-content: start;
    align-items: end;
  }
  .ptz-item-box-zoom-in {
    display: grid;
    justify-content: end;
    align-items: end;
  }
  .ptz-item-box-top-right {
    display: grid;
    justify-content: end;
    align-items: start;
  }
  .ptz-item-box-center {
    justify-content: center;
    align-items: center;
  }
  .ptz-item-box-11 {
    grid-column-start: 5;
    grid-row: 1/4;
    align-items: start;
    padding: 60% 0;
  }
</style>
