<template>
  <transition name="slide">
    <!-- <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list> -->
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import axios from 'axios'
import {domain} from 'common/js/config'
import {ERR_OK} from 'api/config'
import {createSongRank} from 'common/js/song.js'
export default {
  components: {
    MusicList
  },
  data () {
    return {
      songs: [],
      rank: true
    }
  },
  computed: {
    ...mapGetters(['topList']),
    title () {
      return this.topList.topTitle
    },
    bgImage () {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    }
  },
  created () {
    if (!this.topList.id) {
      this.$router.push({
        path: '/rank'
      })
    }
    this._getMusicList()
  },
  methods: {
    async _getMusicList () {
      const data = await axios.get(domain + '/vkeyRank.json')
      const arrDataUrl = data.data.url_mid.data.midurlinfo
      axios.get(domain + '/rankDetail.json?id=' + this.topList.id)
        .then((resp) => {
          const res = resp.data
          // console.log(res)
          if (res.code === ERR_OK) {
            // console.log(res.songlist)
            this.songs = this._normalizeSongs(res.songlist, arrDataUrl)
          }
        })
    },
    _normalizeSongs (list, arrDataUrl) {
      let ret = []
      list.forEach((item, index) => {
        // let {musicData} = item // 其实本来可以直接push musicData这个对象。但是里面 的属性 并非都是 我想要的，所以 就进行了改造  就有了 createSong方法
        ret.push(createSongRank(item.data, arrDataUrl[index].purl)) // 保存了好多歌的 实例 然后 有好多属性。
      })
      return ret
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
