<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <div class="little_bg" :style="bgStyle"></div>
    <h1 class="title" v-html="title" ref="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <div class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import SongList from 'base/song-list/song-list'
import BScroll from 'better-scroll'
export default {
  components: {
    SongList
  },
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImage})`
    }
  },
  mounted () {
    this.bgImageHeight = this.$refs.bgImage.offsetHeight
    this.$refs.list.style.top = this.bgImageHeight + 'px'
    this.scroll = new BScroll(this.$refs.list, {
      probeType: 3 // 设置了这个 BS 的scroll 事件才有效
      // click: true // 设置了这个,让原生的click事件可以出发scroll  BS 的scroll 事件 里的pos 才能准时获取正确的值
    })
    this.scroll.on('scroll', (pos) => {
      this.scrollY = pos.y
      if (-this.scrollY >= this.bgImageHeight - this.$refs.title.offsetHeight) { // 往上滚 可滚动的距离
        this.scrollY = -(this.bgImageHeight - this.$refs.title.offsetHeight)
      }
      this.$refs.layer.style.transform = `translateY(${this.scrollY}px)`
      console.log(pos.y)
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .little_bg
    width 100%
    height 40px
    overflow hidden
    position absolute
    top 0
    left 0
    z-index 30
    background-size cover
    &::before{
      content ''
      position absolute
      width 100%
      height 100%
      background: rgba(7,17,27,0.4)
    }
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
