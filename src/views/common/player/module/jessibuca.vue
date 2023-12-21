<template>
  <div style="width: 100%; height: 100%; background-color: #000c17;">
    <div ref="container"  id="container" @dblclick="fullscreenSwich" @mousemove="mouseenter">
      <transition name="toolBtn">
        <div
          v-if="showToolBtn"
          class="buttons-box"
          id="buttonsBox"
          @mouseenter="keepShowTool"
          @mousemove="
            (e) => {
              e.stopPropagation()
            }
          "
          @mouseleave="mouseenter"
        >
          <div class="buttons-box-left">
            <Icon
              v-if="!playing"
              :size="iconSize"
              class="jessibuca-btn"
              icon="ic:baseline-play-arrow"
              @click="playBtnClick"
            />
            <Icon
              :size="iconSize"
              v-if="playing"
              class="jessibuca-btn"
              icon="ic:baseline-pause"
              @click="pause"
            />
            <Icon :size="iconSize" icon="ic:baseline-stop" class="jessibuca-btn" @click="destroy" />
            <Icon
              :size="iconSize"
              v-if="!quieting"
              icon="ic:baseline-volume-up"
              class="jessibuca-btn"
              @click="mute"
            />
            <Icon
              :size="iconSize"
              v-if="quieting"
              icon="ic:baseline-volume-off"
              class="jessibuca-btn"
              @click="cancelMute"
            />
          </div>
          <div class="buttons-box-right">
            <span class="jessibuca-btn">{{ kBps }} kb/s</span>
            <Icon
              :size="iconSize"
              icon="ic:baseline-camera"
              class="jessibuca-btn"
              @click="screenshot"
            />
            <Icon
              :size="iconSize"
              icon="ic:baseline-replay"
              class="jessibuca-btn"
              @click="playBtnClick"
            />
            <Icon
              :size="iconSize"
              v-if="!fullscreen"
              icon="ic:baseline-fullscreen"
              class="jessibuca-btn"
              @click="fullscreenSwich"
            />
            <Icon
              :size="iconSize"
              v-if="fullscreen"
              icon="ic:baseline-fullscreen-exit"
              class="jessibuca-btn"
              @click="fullscreenSwich"
            />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // @ts-nocheck
  import { ref, watch } from 'vue'
  import { onMounted, onUnmounted } from 'vue'
  import Icon from '/@/components/Icon/src/Icon.vue'

  let jessibuca: any = null
  const container = ref()

  const playing = ref(false)
  const fullscreen = ref(false)
  const quieting = ref(true)
  const loaded = ref(false)
  const showToolBtn = ref(false)
  const kBps = ref(0)
  const iconSize = ref(16)
  interface VideoInfo {
    height: string
    width: string
  }
  const props = defineProps({
    playUrl: {
      type: String,
      required: true,
    },
    hasAudio: {
      type: Boolean,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  })
  const createJessibuca = () => {
    jessibuca = new (window as any).Jessibuca({
      container: container.value,
      autoWasm: true,
      background: '',
      controlAutoHide: false,
      decoder: '/resource/js/jessibuca/decoder.js',
      debug: false,
      forceNoOffscreen: true,
      hasAudio: typeof props.hasAudio == 'undefined' ? false : props.hasAudio,
      hasVideo: true,
      heartTimeout: 5,
      heartTimeoutReplay: true,
      heartTimeoutReplayTimes: 3,
      hiddenAutoPause: false,
      hotKey: false,
      isFlv: false,
      isFullResize: false,
      isNotMute: quieting.value,
      isResize: true,
      keepScreenOn: false,
      loadingText: '请稍等, 视频加载中......',
      loadingTimeout: 10,
      loadingTimeoutReplay: true,
      loadingTimeoutReplayTimes: 3,
      openWebglAlignment: false,
      operateBtns: {
        fullscreen: false,
        screenshot: false,
        play: false,
        audio: false,
        record: false,
      },
      recordType: 'webm',
      rotate: 0,
      showBandwidth: false,
      supportDblclickFullscreen: false,
      timeout: 10,
      useMSE: location.hostname !== 'localhost' && location.protocol !== 'https:',
      useOffscreen: false,
      useWCS: location.hostname === 'localhost' || location.protocol === 'https',
      useWebFullScreen: false,
      videoBuffer: 0,
      wasmDecodeAudioSyncVideo: true,
      wasmDecodeErrorReplay: true,
      wcsUseVideoRender: true,
      text: '',
    })

    jessibuca.on('load', function () {
      console.log('on load')
    })

    jessibuca.on('log', function (msg: any) {
      console.log('on log', msg)
    })
    jessibuca.on('record', function (msg: any) {
      console.log('on record:', msg)
    })
    jessibuca.on('pause', function () {
      console.log('on pause')
      playing.value = false
    })
    jessibuca.on('play', function () {
      console.log('on play')
      playing.value = true
      loaded.value = true
      quieting.value = jessibuca.isMute()
    })
    jessibuca.on('fullscreen', function (msg: boolean) {
      console.log('on fullscreen', msg)
      fullscreen.value = msg
    })

    jessibuca.on('mute', function (msg: any) {
      console.log('on mute', msg)
      quieting.value = msg
    })

    jessibuca.on('audioInfo', function (msg: any) {
      console.log('audioInfo', msg)
    })

    jessibuca.on('videoInfo', function (info: VideoInfo) {
      console.log('videoInfo', info)
    })

    jessibuca.on('error', function (error: any) {
      console.log('error', error)
    })

    jessibuca.on('timeout', function () {
      console.log('timeout')
    })

    jessibuca.on('start', function () {
      console.log('start')
    })

    jessibuca.on('kBps', function (kBpsInfo: any) {
      kBps.value = Math.round(kBpsInfo)
    })

    // 显示时间戳 PTS
    jessibuca.on('videoFrame', function () {})

    //
    jessibuca.on('metadata', function () {})
  }

  watch(
    () => props.playUrl,
    (newPlayerUrl) => {
      console.log('watch== ' + newPlayerUrl)
      play(newPlayerUrl)
    },
  )

  onMounted(() => {
    console.log('播放器拿到的地址： ' + props.playUrl)
    if (props.playUrl) {
      play(props.playUrl)
    }
  })

  onUnmounted(() => {
    jessibuca && jessibuca.destroy()
  })

  const getPlayerDomStyle = (): VideoInfo => {
    let dom = container.value
    let width = dom.parentNode.clientWidth
    let height = parseInt((props.height / props.width) * width)

    // const clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight)
    if (height > dom.parentNode.clientWidth) {
      height = dom.parentNode.clientHeight
      width = parseInt((props.width / props.height) * height)
    }
    console.log('updatePlayerDomSize')
    console.log(width)
    console.log(height)
    return {
      width: width + 'px',
      height: height + 'px',
    }
    // // dom.style.width = width + 'px'
    // dom.style.height = height + 'px'
  }

  const play = (url: string) => {
    console.log(url)
    if (jessibuca) {
      destroy()
    }
    createJessibuca()
    jessibuca.on('play', () => {
      playing.value = true
      loaded.value = true
      quieting.value = jessibuca.quieting
    })
    if (jessibuca.hasLoaded()) {
      jessibuca.play(url)
    } else {
      jessibuca.on('load', () => {
        jessibuca.play(url)
      })
    }
  }
  const pause = () => {
    jessibuca.pause()
    playing.value = false
  }
  const mute = () => {
    if (jessibuca) {
      jessibuca.mute()
    }
  }
  const cancelMute = () => {
    if (jessibuca) {
      jessibuca.cancelMute()
    }
  }

  const destroy = () => {
    if (jessibuca) {
      jessibuca.destroy()
    }
    createJessibuca()
    playing.value = false
    loaded.value = false
  }
  const fullscreenSwich = () => {
    let isFull = isFullscreen()
    jessibuca.setFullscreen(!isFull)
    fullscreen.value = !isFull
  }
  let showToolBtnTimer = 0
  const mouseenter = () => {
    showToolBtn.value = true
    if (showToolBtnTimer) {
      window.clearTimeout(showToolBtnTimer)
    }
    showToolBtnTimer = window.setTimeout(() => {
      showToolBtn.value = false
    }, 2000)
  }
  const keepShowTool = () => {
    console.log('keepShowToolkeepShowToolkeepShowTool')
    showToolBtn.value = true
    window.clearTimeout(showToolBtnTimer)
  }
  const isFullscreen = () => {
    return document.fullscreenElement || false
  }
  const playBtnClick = () => {
    play(props.playUrl)
  }
  const screenshot = () => {
    if (jessibuca) {
      jessibuca.screenshot()
    }
  }
</script>

<style>
  .buttons-box {
    width: 100%;
    height: 28px;
    background-color: rgba(43, 51, 63, 0.7);
    position: absolute;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    left: 0;
    bottom: 0;
    user-select: none;
    z-index: 10;
    transition: opacity 1s ease;
  }

  .jessibuca-btn {
    width: 20px;
    color: rgb(255, 255, 255);
    line-height: 28px;
    margin: 0px 10px;
    padding: 0px 2px;
    cursor: pointer;
    text-align: center;
    font-size: 1rem !important;
  }

  .buttons-box-right {
    position: absolute;
    right: 0;
  }
  .toolBtn-enter-active {
    transition: all 0.1s;
    overflow: hidden;
  }
  .toolBtn-leave-active {
    transition: all 0.5s;
    overflow: hidden;
  }

  .toolBtn-enter-from,
  .toolBtn-leave-to {
    height: 0px !important;
    opacity: 0;
  }
</style>
