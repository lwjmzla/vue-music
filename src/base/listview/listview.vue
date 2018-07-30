<template>
  <div  class="listview" ref="listview">
    <ul ref="listview_scroll">
      <li class="list-group listAlpha" ref="hot" >
        <h2 class="list-group-title">热门</h2>
        <ul>
          <li v-for="(item,index) in hotSingers" @click="selectItem(item)" class="list-group-item" :key="index">
            <img class="avatar" :src="'https://y.gtimg.cn/music/photo_new/T001R300x300M000'+item.Fsinger_mid+'.jpg?max_age=2592000'">
            <span class="name">{{item.Fsinger_name}}</span>
          </li>
        </ul>
      </li>
      <li v-for="(group,index) in normalSingers" class="list-group listAlpha" :ref="group.title" :key="index">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item,index) in group.items" @click="selectItem(item)" class="list-group-item" :key="index">
            <img class="avatar" v-lazy="'https://y.gtimg.cn/music/photo_new/T001R300x300M000'+item.Fsinger_mid+'.jpg?max_age=2592000'">
            <span class="name">{{item.Fsinger_name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" @touchend="onShortcutTouchEnd" ref="">
      <ul ref="alphaUl">
        <li class="item itemAlpha" :class="{'current':currentIndex===0}" @click="handleLetterClick">热</li>
        <li v-for="(item, index) in normalSingers" class="item itemAlpha" :class="{'current':currentIndex-1===index}" @click="handleLetterClick"  :key="index">{{item.title}}</li>
      </ul>
    </div>

    <div class="list-fixed" v-show="fixedTitle" ref="listFixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
// import Loading from 'base/loading/loading'
// import {getData} from 'common/js/dom'

// const TITLE_HEIGHT = 30
// const ANCHOR_HEIGHT = 18

export default {
  props: {
    hotSingers: Array,
    normalSingers: Array
  },
  data () {
    return {
      currentIndex: 0,
      listHeight: [], // 存放着 每个li到top的距离
      scrollY: 0,
      orginScrollY: 0,
      diff: 0 // 到下一级 差多少距离  比如现在 是A 到B 还差多少距离  就是这个
    }
  },
  computed: {
    fixedTitle () {
      if (this.orginScrollY > 0) {
        return ''
      }
      let fixTitle = ['热门']
      this.normalSingers.forEach((obj, index) => {
        fixTitle.push(obj.title)
      })
      return fixTitle[this.currentIndex]
    }
  },
  mounted () {
    this.scroll = new BScroll(this.$refs.listview, {
      probeType: 3, // 设置了这个 BS 的scroll 事件才有效
      click: true // 设置了这个,让原生的click事件可以出发scroll  BS 的scroll 事件 里的pos 才能准时获取正确的值
    })
    this.ulToTop = this.$refs.alphaUl.offsetTop
    this.scroll.on('scroll', (pos) => {
      this.orginScrollY = pos.y
      this.scrollY = Math.abs(pos.y)
      for (let i = 0; i < this.listHeight.length; i++) {
        if (this.scrollY >= this.listHeight[i] && this.scrollY < this.listHeight[i + 1]) {
          this.currentIndex = i
          this.diff = this.listHeight[i + 1] - this.scrollY
          return
        }
      }
    })
    this._calculate()
  },
  watch: {
    diff (newVal) {
      const elListFixed = this.$refs.listFixed
      if (newVal <= elListFixed.offsetHeight) {
        elListFixed.style.transform = 'translateY(' + -(elListFixed.offsetHeight - newVal) + 'px)'
      } else {
        elListFixed.style.transform = 'translateY(0px)'
      }
    }
  },
  methods: {
    handleLetterClick (e) {
      console.log(e.target.innerText)
      let letter = e.target.innerText
      if (letter === '热') {
        letter = 'hot'
      }
      // const eles = Array.from(document.querySelectorAll('.itemAlpha'))
      // eles.forEach((ele, index) => {
      //   ele.classList.remove('current')
      // })
      // e.target.classList.add('current')
      this.scroll.scrollToElement(this.$refs[letter][0] || this.$refs[letter], 200)
    },
    onShortcutTouchStart (e) {
      this.touchStatus = true
    },
    onShortcutTouchMove (e) {
      if (this.touchStatus) {
        const touchY = e.touches[0].clientY - this.ulToTop - 20 - 88 // 相当于是基于开始点 长度多少
        let index = Math.floor(touchY / 18)
        if (index < 0) { index = 0 }
        if (index > this.normalSingers.length) { index = this.normalSingers.length }
        this.currentIndex = index
        console.log(index)
        this.scroll.scrollToElement(document.querySelectorAll('.listAlpha')[index])
      }
    },
    onShortcutTouchEnd (e) {
      this.touchStatus = false
    },
    _calculate () {
      const lists = Array.from(document.querySelectorAll('.listAlpha'))
      let heightToTop = 0
      this.listHeight.push(heightToTop)
      lists.forEach((ele, index) => {
        const elHeight = ele.offsetHeight
        heightToTop += elHeight
        this.listHeight.push(heightToTop)
      })
    },
    selectItem (item) {
      console.log(item)
      this.$emit('select', item)
    }
  }
}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 0
      width: 20px
      height: 100%
      text-align: center
      font-family: Helvetica
      display: flex
      justify-content :center
      flex-direction :column
      ul
        background: $color-background-d
        padding: 20px 0
        border-radius: 10px
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
