<template>
  <div>
    <div class="ptz-box">
      <div class="ptz-item-box"></div>
      <div class="ptz-item-box ptz-item-box-center">
        <Icon
          icon="ant-design:up-square-outlined"
          class="control-btn"
          :size="ptzIconSize"
          @mousedown="ptzCamera('up')"
          @mouseup="ptzCamera('stop')"
        />
      </div>
      <div class="ptz-item-box"></div>
      <div class="ptz-item-box ptz-item-box-center">
        <Icon
          icon="ant-design:left-square-outlined"
          class="control-btn"
          :size="ptzIconSize"
          @mousedown="ptzCamera('left')"
          @mouseup="ptzCamera('stop')"
        />
      </div>
      <div class="ptz-item-box ptz-item-box-center">
        <Icon
          icon="ant-design:home-outlined"
          class="control-btn"
          :size="ptzIconSize"
          @mousedown="ptzCamera('left')"
          @mouseup="ptzCamera('stop')"
        />
      </div>
      <div class="ptz-item-box ptz-item-box-center">
        <Icon
          icon="ant-design:right-square-outlined"
          class="control-btn"
          :size="ptzIconSize"
          @mousedown="ptzCamera('right')"
          @mouseup="ptzCamera('stop')"
        />
      </div>
      <div class="ptz-item-box"></div>
      <div class="ptz-item-box ptz-item-box-center">
        <Icon
          icon="ant-design:down-square-outlined"
          class="control-btn"
          :size="ptzIconSize"
          @mousedown="ptzCamera('down')"
          @mouseup="ptzCamera('stop')"
        />
      </div>
      <div class="ptz-item-box"></div>
      <!--    <div class="ptz-item-box ptz-item-box-11">-->
      <!--      <a-slider id="test" v-model:value="speed" :min="0" :max="255" vertical />-->
      <!--    </div>-->
    </div>
    <div class="camera-control-box zoom-box">
      <i
        class="camera-control-btn icon iconfont icon-zoom-out"
        @mousedown="ptzCamera('zoomin')"
        @mouseup="ptzCamera('stop')"
      ></i>
      <i
        class="camera-control-btn icon iconfont icon-zoom-in"
        @mousedown="ptzCamera('zoomout')"
        @mouseup="ptzCamera('stop')"
      ></i>
    </div>
    <div class="camera-control-box focus-box">
      <i class="camera-control-btn icon iconfont icon-bianjiao-fangda"></i>
      <i class="camera-control-btn icon iconfont icon-bianjiao-suoxiao"></i>
    </div>
    <div class="camera-control-box iris-box">
      <i class="camera-control-btn icon iconfont icon-ic_aperture_1"></i>
      <i class="camera-control-btn icon iconfont icon-ic_aperture_2"></i>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import Icon from '/@/components/Icon/src/Icon.vue'
  import { ref } from 'vue'
  import { Space as ASpace } from 'ant-design-vue'

  const emit = defineEmits(['ptzCamera'])
  const speed = ref<number>(30)
  const ptzIconSize = ref<number>(26)
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
    width: 150px;
    height: 150px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
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
  .ptz-item-box-top-left {
    display: grid;
    justify-content: start;
    align-items: start;
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
  .camera-control-box {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 10px;
  }
  .camera-control-btn {
    font-size: 24px;
    text-align: center;
    cursor: pointer;
  }
</style>
