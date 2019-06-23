<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import axios from 'axios'
// import {ERR_OK} from 'api/config'
import {createSongDisc} from 'common/js/song.js'
// import {domain} from 'common/js/config'
import {getPurlParams, prefix} from 'common/js/config'
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

      const data = await axios.get(prefix + `/getSongList?disstid=${this.disc.dissid}`)

      // const url = `/ustbhuangyi/music/api/getCdInfo?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&disstid=${this.disc.dissid}&type=1&json=1&utf8=1&onlysong=0&platform=yqq&hostUin=0&needNewCode=0`
      // const data = await axios.get(url)
      const songlist = data.data.cdlist[0].songlist
      // console.log(songlist)

      const songmid = []
      songlist.forEach((item, index) => {
        songmid.push(item.songmid)
      })

      // axios({
      //   method: 'post',
      //   url: prefix + '/getPurl',
      //   data: {num: 1}, // qs.stringify({ a: ['b', 'c', 'd'] }, { indices: false }); 如果里面放了数组之类的 加上  { indices: false } 去qs文档看
      //   headers: {
      //     'Content-Type': 'application/json'
      //     // 'Content-Type': 'application/x-www-form-urlencoded' // 有时候要配置这个。
      //   }
      // }).then((res) => {
      //   console.log(res)
      // })
      const dataPurl = await axios.get(prefix + '/getPurl', {
        params: getPurlParams(songmid)
      })

      // const dataPurl = await axios.post('/ustbhuangyi/music/api/getPurlUrl', getPurlParams(songmid))
      // console.log(dataPurl)
      const arrDataPurl = dataPurl.data.url_mid.data.midurlinfo
      this.songs = this._normalizeSongs(songlist, arrDataPurl)
      console.log(this.songs)
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
