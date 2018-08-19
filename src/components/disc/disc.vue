<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import axios from 'axios'
import {ERR_OK} from 'api/config'
import {createSongDisc} from 'common/js/song.js'
import {domain} from 'common/js/config'
export default {
  components: {
    MusicList
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters(['disc']),
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    }
  },
  created () {
    this._getDetail()
  },
  methods: {
    async _getDetail () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }

      const data = await axios.get(domain + '/vkeyDisc.json')
      const arrDataUrl = data.data.url_mid.data.midurlinfo

      axios.get(domain + '/disc.json?id=' + this.disc.dissid)
        .then((resp) => {
          const res = resp.data
          // console.log(res)
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist, arrDataUrl)
            console.log(res.cdlist[0].songlist)
          }
        })
    },
    _normalizeSongs (list, arrDataUrl) {
      let ret = []
      list.forEach((item, index) => {
        // let {musicData} = item // 其实本来可以直接push musicData这个对象。但是里面 的属性 并非都是 我想要的，所以 就进行了改造  就有了 createSong方法
        ret.push(createSongDisc(item, arrDataUrl[index].purl)) // 保存了好多歌的 实例 然后 有好多属性。
      })
      return ret
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
