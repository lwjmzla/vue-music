<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
        @click.stop
      >
        <div class="progress-btn" ref=""></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent (newPercent) { // 球的最左边位置真实位置和进度调位置同一起点  动了多少就是多少。
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.offsetWidth - 16 // 自己想一下当结束的时候 那个按钮的位置是在线的最右侧，减去球的宽度就是总长度
        const offsetWidth = newPercent * barWidth
        // const offsetWidth = Math.min(barWidth, newPercent * barWidth)
        this._offset(offsetWidth)
      }
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    progressTouchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.offsetWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const barWidth = this.$refs.progressBar.offsetWidth - 16
      const offsetWidth = Math.min(barWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd (e) {
      this.touch.initiated = false
      const barWidth = this.$refs.progressBar.offsetWidth - 16
      const percent = this.$refs.progress.offsetWidth / barWidth
      this.$emit('percentChange', percent)
    },
    progressClick (e) {
      console.dir(e)
      const percent = e.offsetX / this.$refs.progressBar.offsetWidth
      this.$emit('percentChange', percent)
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
