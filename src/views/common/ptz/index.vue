<template>
  <div class="ptz-box">
    <div class="ptz-item-box ptz-item-box-zoom-in">
      <Icon
        icon="ic:twotone-add"
        class="control-btn"
        :size="20"
        @mousedown="ptzCamera('zoomin')"
        @mouseup="ptzCamera('stop')"
      />
    </div>
    <div class="ptz-item-box"></div>
    <div class="ptz-item-box ptz-item-box-center">
      <Icon
        icon="fa6-solid:chevron-up"
        class="control-btn"
        :size="ptzIconSize"
        @mousedown="ptzCamera('up')"
        @mouseup="ptzCamera('stop')"
      />
    </div>
    <div class="ptz-item-box"></div>
    <div class="ptz-item-box"></div>
    <div class="ptz-item-box ptz-item-box-center">
      <Icon
        icon="fa6-solid:chevron-left"
        class="control-btn"
        :size="ptzIconSize"
        @mousedown="ptzCamera('left')"
        @mouseup="ptzCamera('stop')"
      />
    </div>
    <div class="ptz-item-box"></div>
    <div class="ptz-item-box ptz-item-box-center">
      <Icon
        icon="fa6-solid:chevron-right"
        class="control-btn"
        :size="ptzIconSize"
        @mousedown="ptzCamera('right')"
        @mouseup="ptzCamera('stop')"
      />
    </div>
    <div class="ptz-item-box ptz-item-box-top-right">
      <Icon
        icon="ic:twotone-horizontal-rule"
        class="control-btn"
        :size="20"
        @mousedown="ptzCamera('zoomout')"
        @mouseup="ptzCamera('stop')"
      />
    </div>
    <div class="ptz-item-box"></div>
    <div class="ptz-item-box ptz-item-box-center">
      <Icon
        icon="fa6-solid:chevron-down"
        class="control-btn"
        :size="ptzIconSize"
        @mousedown="ptzCamera('down')"
        @mouseup="ptzCamera('stop')"
      />
    </div>
    <div class="ptz-item-box"></div>
    <div class="ptz-item-box ptz-item-box-11">
      <a-slider id="test" v-model:value="speed" :min="0" :max="255" vertical />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import Icon from '/@/components/Icon/src/Icon.vue'
  import { ref } from 'vue'
  import { Slider as ASlider } from 'ant-design-vue'

  const emit = defineEmits(['ptzCamera'])
  const speed = ref<number>(30)
  const ptzIconSize = ref<number>(18)
  const ptzCamera = (comond) => {
    emit('ptzCamera', comond, speed.value)
  }
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
