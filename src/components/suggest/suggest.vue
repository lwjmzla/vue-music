<template>
  <div class="suggest" ref="suggest">
    <ul class="suggest-list">
      <li class="suggest-item">
        <div class="icon">
          <i ></i>
        </div>
        <div class="name">
          <p class="text" ></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
// import {search} from 'api/search'
// import {ERR_OK} from 'api/config'
import axios from 'axios'
export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: []
    }
  },
  methods: {
    _search () {
      // search(this.query, this.page, this.showSinger).then((res) => {})
      axios.get(`/ustbhuangyi/music/api/search?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&w=${this.query}&p=${this.page}&perpage=20&n=20&catZhida=1&zhidaqu=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&remoteplace=txt.mqq.all&uin=0&needNewCode=1&platform=h5`)
        .then((res) => {
          console.log(res)
        })
    }
  },
  watch: {
    query (newVal) {
      this.query = newVal
      this._search()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
