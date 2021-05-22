<template>
  <transition name="slide">
    <music-list v-if="songs.length" :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>

</template>

<script>
import {mapGetters} from 'vuex'
// import {getSingerDetail} from 'api/singer'
// import {ERR_OK} from 'api/config'
import axios from 'axios'
import {createSongCommon} from 'common/js/song.js'
import MusicList from 'components/music-list/music-list'
// import {domain} from 'common/js/config'
import fetchJsonp from 'fetch-jsonp'
import {getPurlParams, prefix} from 'common/js/config'
import data from './data'
import songMap from './songMap'
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
      return this.singer.name || this.singer.singername
    },
    bgImage () {
      if (this.singer.mid) {
        return 'https://y.gtimg.cn/music/photo_new/T001R300x300M000' + this.singer.mid + '.jpg?max_age=2592000'
      } else {
        return 'http://y.gtimg.cn/music/photo_new/T001R800x800M0000025NhlN2yWrP4.jpg'
      }
    }
  },
  created () {
    this._getDetail()
  },
  methods: {
    async _getDetail () {
      // if (!this.singer.Fsinger_mid && !this.singer.singermid) {
      //   this.$router.push('/singer')
      //   return
      // }
      const singermid = this.singer.Fsinger_mid || this.singer.singermid
      const url = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&hostUin=0&needNewCode=0&platform=yqq&order=listen&begin=0&num=80&songstatus=1&singermid=${singermid}`
      fetchJsonp(url, {jsonpCallback: 'jsonpCallback'})
        .then((res) => {
          return res.json()
        })
        .then(async (json) => {
          // // console.log(json)
          // const list = json.data.list
          // // console.log(songlist)

          // const songmid = []
          // list.forEach((item, index) => {
          //   songmid.push(item.musicData.songmid)
          // })
          // const dataPurl = await axios.get(prefix + '/getPurl', {
          //   params: getPurlParams(songmid)
          // })
          // // const dataPurl = await axios.post('/ustbhuangyi/music/api/getPurlUrl', getPurlParams(songmid))
          // // console.log(dataPurl)
          // const arrDataPurl = dataPurl.data.url_mid.data.midurlinfo
          // this.songs = this._normalizeSongs(list, arrDataPurl)
          // console.log(this.songs)
        })
      let arr = data.result.songs
      let {map} = songMap.result
      arr.forEach((item) => {
        item.url = map[item.mid]
      })
      setTimeout(() => {
        this.songs = arr
      }, 0)
    },
    _normalizeSongs (list, arrDataPurl) {
      let ret = []
      list.forEach((item, index) => {
        let {musicData} = item // 其实本来可以直接push musicData这个对象。但是里面 的属性 并非都是 我想要的，所以 就进行了改造  就有了 createSong方法
        ret.push(createSongCommon(musicData, arrDataPurl[index].purl)) // 保存了好多歌的 实例 然后 有好多属性。
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
