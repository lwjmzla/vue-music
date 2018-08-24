<template>
  <div class="suggest" ref="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result" :key="index" @click="selectItem(item)">
        <div class="icon">
          <i :class="_getIconCls(item)" ></i>
        </div>
        <div class="name">
          <p class="text" v-html="_getDisplayName(item)"></p>
        </div>
      </li>
      <p class="noResult" ref="noResult" v-show="noResult">抱歉，暂无搜索结果</p>
      <div class="cover_space" v-show="!loading" style="height:45px;"></div>
      <loading title="正在加载" v-show="loading"></loading>
    </ul>
    <div class="loading-container" v-show="searchLoading">
      <loading title="正在搜索"></loading>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// import {search} from 'api/search'
// import {ERR_OK} from 'api/config'
import axios from 'axios'
import {createSongCommon} from 'common/js/song'
import Loading from 'base/loading/loading'
// import noResult from 'base/no-result/no-result'
import BScroll from 'better-scroll'
import {mapMutations, mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
import fetchJsonp from 'fetch-jsonp'
import {getPurlParams} from 'common/js/config'
export default {
  mixins: [playlistMixin],
  components: {
    Loading
  },
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
      result: [],
      hasMore: true,
      firstLoad: true,
      loading: false, // 这个是加载更多的loading
      noResult: false,
      searchLoading: false // 这个是首次搜的loading
    }
  },
  created () {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5'
    fetchJsonp(url, {
      jsonpCallback: 'jsonpCallback' // 重要
    })
      .then(function (response) {
        return response.json()
      }).then(function (json) {
        console.log('parsed json', json)
      }).catch(function (ex) {
        console.log('parsing failed', ex)
      })
  },
  methods: {
    _search () {
      if (this.firstLoad) {
        this.searchLoading = true
      }
      axios.get(`/ustbhuangyi/music/api/search?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&w=${this.query}&p=${this.page}&perpage=20&n=20&catZhida=1&zhidaqu=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&remoteplace=txt.mqq.all&uin=0&needNewCode=1&platform=h5`)
        .then((res) => {
          // console.log(res.data.data)
          this._genResult(res.data.data)
          this._checkMore(res.data.data)
        })
    },
    _searchMore () {
      if (!this.hasMore) {
        this.noResult = true
        setTimeout(() => {
          this.noResult = false
        }, 3000)
        return
      }
      this.loading = true
      this.page++
      this._search()
    },
    _checkMore (data) {
      const song = data.song
      if (!song.list.length || song.curnum + song.curpage * 20 >= song.totalnum) {
        this.hasMore = false
      }
    },
    _genResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid && this.firstLoad) {
        ret.push({
          ...data.zhida,
          ...{type: 'singer'}
        })
        console.log(ret)
      }
      if (data.song.list.length) {
        this._normalizeSongs(data.song.list).then((res) => {
          ret = ret.concat(res)
          // console.log(ret)
          this.result = this.result.concat(ret)
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.suggest, {
                click: true
              })
              this.scroll.on('scrollEnd', () => {
                console.log(this.scroll)
                if (this.scroll.y <= this.scroll.maxScrollY + 50) {
                  this._searchMore()
                }
              })
            } else {
              this.scroll.refresh()
            }
          })
        })
      } else {
        this.result = ret
        if (!this.result.length) {
          this.noResult = true
        }
      }
      this.firstLoad = false
      this.loading = false
      this.searchLoading = false
    },
    async _normalizeSongs (list) { // 这个函数的返回值也是promise
      const songmid = []
      list.forEach((item, index) => {
        songmid.push(item.songmid)
      })
      const data = await axios.post('/ustbhuangyi/music/api/getPurlUrl', getPurlParams(songmid))
      const arrDataPurl = data.data.url_mid.data.midurlinfo
      // console.log(arrDataPurl)
      let ret = []
      list.forEach((item, index) => {
        ret.push(createSongCommon(item, arrDataPurl[index].purl)) // 保存了好多歌的 实例 然后 有好多属性。
      })
      return ret
    },
    _getIconCls (item) {
      if (item.type === 'singer') {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    _getDisplayName (item) {
      if (item.type === 'singer') {
        return item.singername
      } else {
        return item.name + '-' + item.singer
      }
    },
    _initialParams () {
      this.firstLoad = true
      this.page = 1
      this.result = []
      this.hasMore = true
      this.noResult = false
      this.searchLoading = false
    },
    selectItem (item) {
      if (item.type === 'singer') {
        this.setSinger(item)
        this.$router.push({
          path: `/search/${item.singermid}`
        })
      } else {
        this.insertSong(item)
      }
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions(['insertSong']),
    handlePlaylist (playlist) { // playlistMixin里调用
      const bottom = playlist.length > 0 ? '60px' : 0
      this.$refs.suggest.style.bottom = bottom
      if (this.scroll) {
        this.scroll.refresh()
      }
    }
  },
  watch: {
    query (newVal) {
      this._initialParams()
      this.query = newVal
      if (this.query) {
        this._search()
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
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
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
