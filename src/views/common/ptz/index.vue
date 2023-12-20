<template>
  <div style="width: 100%; display: flex; justify-content: center">
    <div class="control-wrapper">
      <div class="control-zoom">
        <div class="control-zoom-in" @mousedown="ptzCamera('zoomin')" @mouseup="ptzCamera('stop')">
          <Icon icon="ic:twotone-add" class="control-btn" :size="20" />
        </div>
        <div
          class="control-zoom-out"
          @mousedown="ptzCamera('zoomout')"
          @mouseup="ptzCamera('stop')"
        >
          <Icon icon="ic:twotone-horizontal-rule" class="control-btn" :size="20" />
        </div>
      </div>
      <div class="control-ptz">
        <div class="control-ptz-top" @mousedown="ptzCamera('up')" @mouseup="ptzCamera('stop')">
          <Icon icon="fa6-solid:chevron-up" class="control-btn" :size="ptzIconSize" />
        </div>
        <div class="control-ptz-left-right">
          <div class="control-ptz-left" @mousedown="ptzCamera('left')" @mouseup="ptzCamera('stop')">
            <Icon icon="fa6-solid:chevron-left" class="control-btn" :size="ptzIconSize"
          /></div>
          <div
            class="control-ptz-right"
            @mousedown="ptzCamera('right')"
            @mouseup="ptzCamera('stop')"
            ><Icon icon="fa6-solid:chevron-right" class="control-btn" :size="ptzIconSize"
          /></div>
        </div>
        <div class="control-ptz-bottom" @mousedown="ptzCamera('down')" @mouseup="ptzCamera('stop')"
          ><Icon icon="fa6-solid:chevron-down" class="control-btn" :size="ptzIconSize"
        /></div>
      </div>
      <div class="control-speed">
        <a-slider id="test" v-model:value="speed" :min="0" :max="255" vertical />
      </div>
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
</style>
