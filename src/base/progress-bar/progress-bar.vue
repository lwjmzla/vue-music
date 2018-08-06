<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper">
        <div class="progress-btn" ref="progressBtn"></div>
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
      const barWidth = this.$refs.progressBar.offsetWidth - this.$refs.progressBtn.offsetWidth // 自己想一下当结束的时候 那个按钮的位置是在线的最右侧，减去球的宽度就是总长度
      const offsetWidth = newPercent * barWidth
      this.$refs.progress.style.width = offsetWidth + 'px'
      this.$refs.progressBtn.style.transform = `translateX(${offsetWidth}px)`
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
