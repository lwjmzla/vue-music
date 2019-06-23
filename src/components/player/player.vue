<template>
  <div class="player" v-show="playlist.length">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" />
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name" ></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" ref="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd" >
          <div class="middle-l" ref="middleL" >
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" ref="cd" >
                <div style="position:relative;height:100%;">
                  <img class="image" :class="cdCls" ref="cdImg" :src="currentSong.image"  />
                </div>
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <div class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" :class="{'current': currentLineNum === index}" v-for="(line,index) in currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{currentTime}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{totalTime}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon" ref="small_cd">
          <img ref="small_cdImg" :class="cdCls" width="40" height="40" :src="currentSong.image" />
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle  :percent="percent">
            <i class="icon-mini" :class="miniPlayIcon" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations} from 'vuex'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import {playMode, prefix} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {Base64} from 'js-base64'
import Lyric from 'lyric-parser'
import {ERR_OK} from 'api/config'
import axios from 'axios'
import BScroll from 'better-scroll'

export default {
  components: {
    ProgressBar,
    ProgressCircle
  },
  data () {
    return {
      songReady: false,
      currentTime: 0,
      totalTime: 0,
      currentDuration: 0,
      totalDuration: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ]),
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniPlayIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdCls () {
      return this.playing ? '' : ''
    },
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    percent () {
      return this.currentDuration / this.totalDuration
    },
    iconMode () {
      if (this.mode === playMode.sequence) {
        return 'icon-sequence'
      }
      if (this.mode === playMode.loop) {
        return 'icon-loop'
      }
      if (this.mode === playMode.random) {
        return 'icon-random'
      }
    }
  },
  created () {
    this.touch = {}
  },
  mounted () {
    // 这个没卵用 一开始加载就是空对象来的
    document.addEventListener('click', () => { // 添加这个解决了在UC浏览器播放不了的问题
      // alert(document.querySelector('audio'))
      if (document.querySelector('audio') && this.playing) {
        setTimeout(() => {
          document.querySelector('audio').play()
        })
      }
    })
  },
  methods: {
    back () {
      this.setFullScreen(false)
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    open () {
      this.setFullScreen(true)
    },
    togglePlaying () {
      this.setPlayingState(!this.playing)
      this.currentLyric.togglePlay()
    },
    prev () {
      if (!this.songReady) { // 防止点击过快
        return
      }
      if (this.playlist.length === 1) {
        this._loop()
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playlist.length - 1
      }
      this.setCurrentIndex(index)
      this.songReady = false
    },
    next () {
      if (!this.songReady) { // 防止点击过快
        return
      }
      if (this.playlist.length === 1) { // 因为这种情况 歌曲只有一个 watch currentSong 没变化 就不会触发的
        this._loop()
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playlist.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      this.songReady = false
    },
    ready () { // 防止点击过快
      this.songReady = true
    },
    error () {
      this.songReady = true // 如果歌曲链接失效，不让其进入死锁
    },
    end () {
      if (this.mode === playMode.loop) {
        this._loop()
      } else {
        this.next()
      }
    },
    _loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0) // 歌词回到一开始
      }
    },
    updateTime (e) {
      // console.dir(e.target)
      // console.log(typeof e.target.duration)
      this.currentDuration = e.target.currentTime
      this.totalDuration = e.target.duration
      this.currentTime = this.countTime(e.target.currentTime)
    },
    countTime (time) {
      let correctTime
      let min = parseInt(time / 60)
      let second = Math.floor(time % 60) < 10 ? '0' + Math.floor(time % 60) : Math.floor(time % 60)
      correctTime = `${min}:${second}`
      return correctTime
    },
    onProgressBarChange (percent) {
      this.$refs.audio.currentTime = this.$refs.audio.duration * percent
      this.setPlayingState(true)
      const currentTime = this.currentSong.duration * percent
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (this.mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this._resetCurrentIndex(list) // 有先后顺序的
      this.setPlayList(list)
    },
    _resetCurrentIndex (list) {
      let index = list.findIndex((item) => { // findIndex es6方法
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    _getLyric () {
      // console.log(this.currentSong)
      // const url = `/ustbhuangyi/music/api/lyric?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&songmid=${this.currentSong.mid}&platform=yqq&hostUin=0&needNewCode=0&categoryId=10000000&pcachetime=1535080355295`
      axios.get(prefix + '/getLyric?mid=' + this.currentSong.mid)
        .then((resp) => {
          const res = resp.data
          // console.log(res)
          if (res.code === ERR_OK) {
            this.lyric = Base64.decode(res.lyric) // base64 转字符串
            this.currentLyric = new Lyric(this.lyric, this._handleLyric)
            // console.log(this.currentLyric)
            if (this.playing) {
              this.currentLyric.play()
            }
            this.scroll = new BScroll(this.$refs.lyricList, {
              probeType: 3 // 设置了这个 BS 的scroll 事件才有效
              // click: true // 设置了这个,让原生的click事件可以出发scroll  BS 的scroll 事件 里的pos 才能准时获取正确的值
            })
          }
        })
        .catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
    },
    _handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      // this.scroll.scrollToElement(this.$refs[letter][0] || this.$refs[letter], 200)
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.scroll.scrollToElement(lineEl, 1000)
      } else {
        this.scroll.scrollToElement(this.$refs.lyricLine[0], 1000)
      }
      this.playingLyric = txt
    },
    middleTouchStart (e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) { // 如果主要是侧重于 Y轴 就无视它的操作
        return
      }
      let dragWidth
      if (this.currentShow === 'cd') {
        if (deltaX >= -375 && deltaX <= 0) {
          dragWidth = deltaX
          this.touch.percent = Math.abs(dragWidth / window.innerWidth) // deltaX 都是位移/总的
          this.$refs.lyricList.style.transform = `translateX(${dragWidth}px)`
          this.$refs.middleL.style.opacity = 1 - this.touch.percent
        }
      } else if (this.currentShow === 'lyric') {
        if (deltaX >= 0 && deltaX <= window.innerWidth) {
          dragWidth = -window.innerWidth + deltaX // deltaX 都是位移/总的
          this.touch.percent = Math.abs(deltaX / window.innerWidth)
          // if (this.touch.percent === 1) { // 原来通过人手的点击 其实 也能处罚 move事件，只是 move好少而已，所以可以做 适当的判断，比如移动多少才触发
          //   return
          // }
          this.$refs.lyricList.style.transform = `translateX(${dragWidth}px)`
          this.$refs.middleL.style.opacity = this.touch.percent
        }
      }
      // this.$refs.middleL
    },
    middleTouchEnd () {
      let winWidth = window.innerWidth
      if (this.currentShow === 'cd' && this.touch.percent && this.touch.percent > 0.1) {
        this.$refs.lyricList.style.transform = `translateX(${-winWidth}px)`
        this.currentShow = 'lyric'
        this.$refs.middleL.style.opacity = 0
      } else if (this.currentShow === 'lyric' && this.touch.percent && this.touch.percent > 0.1) {
        this.$refs.lyricList.style.transform = `translateX(0px)`
        this.currentShow = 'cd'
        this.$refs.middleL.style.opacity = 1
      } else if (this.currentShow === 'cd') { // 这个是移动的百分比 小于0.1情况
        this.$refs.lyricList.style.transform = `translateX(0px)`
        this.$refs.middleL.style.opacity = 1
      } else if (this.currentShow === 'lyric') { // 这个是移动的百分比 小于0.1情况
        this.$refs.lyricList.style.transform = `translateX(${-winWidth}px)`
        this.$refs.middleL.style.opacity = 0
      }
      this.touch.percent = null // 不让他点击直接触发 而且添加判断 this.touch.percent存在的判断
    }
  },
  watch: {
    currentSong (newVal, oldVal) {
      if (newVal.id === oldVal.id) {
        return
      }
      // this.totalDuration = newVal.duration
      this.totalTime = this.countTime(newVal.duration)
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      this.$nextTick(() => {
        this.$refs.audio.play()
        this.setPlayingState(true)
        this._getLyric()
      })
      // setTimeout(() => {    // 据说要来解决 微信后台后音乐结束  不执行JS 的问题
      //   this.$refs.audio.play()
      //   this.setPlayingState(true)
      //   this._getLyric()
      // }, 1000)
    },
    playing (newVal) {
      this.$nextTick(() => {
        const elAudio = this.$refs.audio
        newVal ? elAudio.play() : elAudio.pause()

        if (!newVal) { // 停止的时候
          const imgTransform = getComputedStyle(this.$refs.cdImg).transform
          const cdTransform = getComputedStyle(this.$refs.cd).transform
          this.$refs.cd.style.transform = cdTransform === 'none' ? imgTransform : imgTransform.concat(' ', cdTransform)
          this.$refs.cdImg.classList.remove('play')
          const smallcdImgTransform = getComputedStyle(this.$refs.small_cdImg).transform
          const smallcdTransform = getComputedStyle(this.$refs.small_cd).transform
          this.$refs.small_cd.style.transform = smallcdTransform === 'none' ? smallcdImgTransform : smallcdImgTransform.concat(' ', smallcdTransform)
          this.$refs.small_cdImg.classList.remove('play')
        } else {
          this.$refs.cdImg.classList.add('play')
          this.$refs.small_cdImg.classList.add('play')
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          transition: opacity 0.3s
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              .image
                position: absolute
                left: 0
                top: 0
                right: 0
                bottom: 0
                margin: auto
                width: 100%
                height: 100%
                border-radius: 50%
                &.play
                  animation: rotate 20s linear infinite
                &.pause
                  animation-play-state: paused

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          transition: all 0.3s
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
        .cd-wrapper
          transition: all 0.4s
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
        .cd-wrapper
          transform: translate3d(-147.5px, 397px, 0) scale(0.133)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 20px
        img
          border-radius: 50%
          vertical-align: middle
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    100% {
      transform: rotate(1turn);
    }
</style>
