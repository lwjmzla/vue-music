<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query"  class="box" v-model="query" :placeholder="placeholder"/>
    <i class="icon-dismiss" v-show="query.length" @click="clear"></i>
  </div>
</template>

<script type="text/ecmascript-6">
// import {debounce} from 'common/js/util'
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    },
    fatherQuery: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      query: '',
      timer: null
    }
  },
  methods: {
    clear () {
      this.query = ''
    }
  },
  created () {
    // this.$watch('query', debounce((newVal) => { // 用watch的方式 就用不了debounce
    //   this.$emit('query', newVal)
    // }, 200))
  },
  watch: {
    query (newVal) {
      // 防抖
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.$emit('query', newVal)
      }, 400) // 要>= 200才有效果
    },
    fatherQuery (newVal) {
      this.query = newVal
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
