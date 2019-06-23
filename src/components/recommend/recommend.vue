<template>
  <div class="recommend" ref="recommend">
    <div class="recommend-content" ref="">
      <div v-if="recommends.length" class="slider-wrapper">
        <slider>
          <div v-for="item in recommends" :key="item.id">
            <a :href="item.linkUrl">
              <img :src="item.picUrl" @load="refreshScroll"/>
            </a>
          </div>
        </slider>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
          <li v-for="item in discList" :key="item.listennum" class="item" @click="selectItem(item)">
            <div class="icon">
              <img width="60" height="60" v-lazy="item.imgurl"/>
            </div>
            <div class="text">
              <h2 class="name" v-html="item.creator.name"></h2>
              <p class="desc" v-html="item.dissname"></p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="loading-container" v-show="!discList.length">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Slider from 'base/slider/slider'
// import { getRecommend } from 'api/recommend'
import * as types from 'api/recommend'
import {ERR_OK} from 'api/config'
import axios from 'axios'
import BScroll from 'better-scroll'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
import {prefix} from 'common/js/config'

export default {
  mixins: [playlistMixin],
  name: 'recommend',
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  },
  mounted () {
    this.scroll = new BScroll(this.$refs.recommend, {
      click: true
    })
  },
  methods: {
    _getRecommend () {
      types.getRecommend().then((res) => {
        // console.log(res.data.slider)
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList () {
      // const url = `/ustbhuangyi/music/api/getDiscList?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&platform=yqq&hostUin=0&sin=0&ein=29&sortId=5&needNewCode=0&categoryId=10000000&rnd=0.7673530246632889`
      axios.get(prefix + '/getDiscList')
        .then((resp) => {
          const res = resp.data
          console.log(res)
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
    },
    refreshScroll () { // 因为banner图片的高度会撑开。传的图片尺寸会改的。
      if (!this.checkloaded) {
        this.scroll.refresh()
        this.checkloaded = true
      }
    },
    handlePlaylist (playlist) { // playlistMixin里调用
      const bottom = playlist.length > 0 ? '60px' : 0
      this.$refs.recommend.style.bottom = bottom
      if (this.scroll) {
        this.scroll.refresh()
      }
    },
    selectItem (item) {
      // console.log(item)
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    overflow: hidden
    .recommend-content
      // height: 100%
      // overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
        height :0
        padding-top :40%
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
