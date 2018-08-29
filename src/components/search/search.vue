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
              <span>{{trim(item.k)}}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="deleteAllHistory">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list :searches="searchHistory" @select="selectHistoryItem" @delete="deleteHistoryItem"></search-list>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query.length">
      <suggest :query="query" @select="saveSearch"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import SearchList from 'base/search-list/search-list'
import {ERR_OK} from 'api/config'
import axios from 'axios'
import {domain} from 'common/js/config'
import Suggest from 'components/suggest/suggest'
import {mapGetters, mapMutations} from 'vuex'
export default {
  data () {
    return {
      hotKey: [],
      fatherQuery: '',
      query: ''
      // searchHistory: []
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  created () {
    this._getHotKey()
    this._getHistorySearch()
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
      this.fatherQuery = this.trim(query)
    },
    onQueryChange (query) {
      this.query = query
    },
    saveSearch () {
      let searches = JSON.parse(localStorage.getItem('__search__')) || []
      const index = searches.indexOf(this.query)
      if (index > -1) {
        searches.splice(index, 1)
      }
      searches.unshift(this.query)
      localStorage.setItem('__search__', JSON.stringify(searches))
      this.setSearchHistory(searches)
      // console.log(localStorage)
    },
    trim (str) {
      return str.replace(/(^\s*)|(\s*$)/g, '')
    },
    _getHistorySearch () {
      // this.searchHistory = JSON.parse(localStorage.getItem('__search__')) || []
      this.setSearchHistory(JSON.parse(localStorage.getItem('__search__')) || [])
    },
    selectHistoryItem (item) {
      this.query = item
      this.fatherQuery = item
    },
    deleteHistoryItem (item) {
      let searches = JSON.parse(localStorage.getItem('__search__')) || []
      const index = searches.indexOf(item)
      if (index > -1) {
        searches.splice(index, 1)
      }
      localStorage.setItem('__search__', JSON.stringify(searches))
      this.setSearchHistory(searches)
    },
    ...mapMutations({
      setSearchHistory: 'SET_SEARCH_HISTORY'
    }),
    deleteAllHistory () {
      localStorage.setItem('__search__', JSON.stringify([]))
      this.setSearchHistory([])
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
