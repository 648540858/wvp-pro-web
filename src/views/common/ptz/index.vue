<template>
  <div style="width: 100%; display: flex; justify-content: center">
    <div class="control-wrapper">
      <div
        class="control-btn control-top"
        @mousedown="ptzCamera('up')"
        @mouseup="ptzCamera('stop')"
      >
        <Icon icon="ep:arrow-up-bold" />
      </div>
      <div
        class="control-btn control-left"
        @mousedown="ptzCamera('left')"
        @mouseup="ptzCamera('stop')"
      >
        <Icon icon="ep:arrow-up-bold" />
      </div>
      <div
        class="control-btn control-bottom"
        @mousedown="ptzCamera('down')"
        @mouseup="ptzCamera('stop')"
      >
        <Icon icon="ep:arrow-up-bold" />
      </div>
      <div
        class="control-btn control-right"
        @mousedown="ptzCamera('right')"
        @mouseup="ptzCamera('stop')"
      >
        <Icon icon="ep:arrow-up-bold" />
      </div>
      <div
        class="control-btn"
        style="position: absolute; left: 6.25rem; top: 0.25rem"
        @mousedown="ptzCamera('zoomin')"
        @mouseup="ptzCamera('stop')"
      >
        <Icon icon="ic:twotone-add" />
      </div>
      <div
        class="control-btn"
        style="position: absolute; left: 6.25rem; top: 3.25rem"
        @mousedown="ptzCamera('zoomout')"
        @mouseup="ptzCamera('stop')"
      >
        <Icon icon="ic:twotone-horizontal-rule" />
      </div>
    </div>
    <div class="contro-speed" style="position: absolute; top: 11rem; width: 9rem">
      <a-slider id="test" v-model:value="speed" :min="0" :max="255" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import Icon from '/@/components/Icon/src/Icon.vue'
  import { ref } from 'vue'
  import { Slider as ASlider } from 'ant-design-vue'

  const emit = defineEmits(['ptzCamera'])
  const speed = ref<number>(30)
  const ptzCamera = (comond) => {
    emit('ptzCamera', comond, speed.value)
  }
</script>
<style>
  .control-wrapper {
    position: relative;
    width: 6.25rem;
    height: 6.25rem;
    max-width: 6.25rem;
    max-height: 6.25rem;
    border-radius: 100%;
    margin-top: 1.5rem;
    margin-left: 0.5rem;
    float: left;
  }
  .control-btn {
    display: flex;
    justify-content: center;
    position: absolute;
    width: 3rem;
    height: 3rem;
    line-height: 3rem;
    align-items: center;
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

  .control-top {
    top: -8%;
    left: 27%;
    transform: rotate(0deg);
  }

  .control-left {
    top: 27%;
    left: -8%;
    transform: rotate(-90deg);
  }

  .control-right {
    top: 27%;
    right: -8%;
    transform: rotate(90deg);
  }

  .control-bottom {
    left: 27%;
    bottom: -8%;
    transform: rotate(180deg);
  }
</style>
