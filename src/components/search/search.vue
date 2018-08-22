<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box :fatherQuery="fatherQuery" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query.length">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜素</h1>
          <ul>
            <li class="item" v-for="(item,index) in hotKey" :key="index" @click="addQuery(item.k)">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query.length">
      <suggest :query="query"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import {ERR_OK} from 'api/config'
import axios from 'axios'
import {domain} from 'common/js/config'
import Suggest from 'components/suggest/suggest'
export default {
  data () {
    return {
      hotKey: [],
      fatherQuery: '',
      query: ''
    }
  },
  components: {
    SearchBox,
    Suggest
  },
  created () {
    this._getHotKey()
  },
  methods: {
    _getHotKey () {
      axios.get(domain + '/getHotKey.json')
        .then((resp) => {
          const res = resp.data
          // console.log(res)
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
            // console.log(this.hotKey)
          }
        })
    },
    addQuery (query) {
      this.fatherQuery = query
    },
    onQueryChange (query) {
      this.query = query
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
