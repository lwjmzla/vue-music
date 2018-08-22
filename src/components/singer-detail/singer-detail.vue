<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>

</template>

<script>
import {mapGetters} from 'vuex'
// import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import axios from 'axios'
import {createSong} from 'common/js/song.js'
import MusicList from 'components/music-list/music-list'
import {domain} from 'common/js/config'
export default {
  data () {
    return {
      songs: []
    }
  },
  components: {
    MusicList
  },
  computed: {
    ...mapGetters(['singer']),
    title () {
      return this.singer.Fsinger_name || this.singer.singername
    },
    bgImage () {
      if (this.singer.Fsinger_mid) {
        return 'https://y.gtimg.cn/music/photo_new/T001R300x300M000' + this.singer.Fsinger_mid + '.jpg?max_age=2592000'
      } else {
        return 'https://y.gtimg.cn/music/photo_new/T001R300x300M000' + this.singer.singermid + '.jpg?max_age=2592000'
      }
    }
  },
  created () {
    this._getDetail()
  },
  methods: {
    async _getDetail () {
      if (!this.singer.Fsinger_mid && !this.singer.singermid) {
        this.$router.push('/singer')
        return
      }

      const data = await axios.get(domain + '/vkey.json')
      const arrDataVkey = data.data.url_mid.data.midurlinfo
      // console.log(arrDataVkey)

      axios.get(domain + '/singer-detail.json?id=' + this.singer.Fsinger_mid)
        .then((resp) => {
          const res = resp.data
          // console.log(res)
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list, arrDataVkey)
            // console.log(this.songs)
          }
        })
    },
    _normalizeSongs (list, arrDataVkey) {
      let ret = []
      list.forEach((item, index) => {
        let {musicData} = item // 其实本来可以直接push musicData这个对象。但是里面 的属性 并非都是 我想要的，所以 就进行了改造  就有了 createSong方法
        ret.push(createSong(musicData, arrDataVkey[index].vkey)) // 保存了好多歌的 实例 然后 有好多属性。
      })
      return ret
    }
  }
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active {transition: all .3s ease-out}
  .slide-enter, .slide-leave-to {transform:translateX(100%)}

</style>
