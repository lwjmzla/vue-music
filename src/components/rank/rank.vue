<template>
  <div class="rank" ref="rank">
    <div  class="toplist" ref="toplist">
      <ul v-if="topList.length">
        <li  class="item" v-for="item in topList" :key="item.id" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList" :key="index">
              <span>{{index+1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
// import {domain} from 'common/js/config'
import {ERR_OK} from 'api/config'
import axios from 'axios'
import BScroll from 'better-scroll'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
export default {
  mixins: [playlistMixin],
  components: {
    Loading
  },
  data () {
    return {
      topList: []
    }
  },
  created () {
    this._getTopList()
  },
  mounted () {
    // setTimeout(() => {
    //   this.scroll = new BScroll(this.$refs.toplist, {
    //     click: true
    //   })
    // }, 20)
  },
  methods: {
    _getTopList () {
      // axios.get(domain + '/getRank.json')
      axios.get('https://easy-mock.com/mock/5d0f22b97a2f74320a3954d7/music/rank')
        .then((resp) => {
          const res = resp.data
          if (res.code === ERR_OK) {
            this.topList = res.data.topList
            console.log(this.topList)
            this.$nextTick(() => { // 加这个的原因 就是 待DOM渲染完毕再执行
              this.scroll = new BScroll(this.$refs.toplist, {
                click: true
              })
            })
          }
        })
    },
    handlePlaylist (playlist) { // playlistMixin里调用
      const bottom = playlist.length > 0 ? '60px' : 0
      this.$refs.rank.style.bottom = bottom
      if (this.scroll) {
        this.scroll.refresh()
      }
    },
    selectItem (item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item)
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  }
}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 118px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
