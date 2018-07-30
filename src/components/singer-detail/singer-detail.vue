<template>
  <transition name="slide">
    <div class="singer-detail">

    </div>
  </transition>

</template>

<script>
import {mapGetters} from 'vuex'
// import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import axios from 'axios'
import {createSong} from 'common/js/song.js'
export default {
  data () {
    return {
      songs: []
    }
  },
  components: {

  },
  computed: {
    ...mapGetters(['singer'])
  },
  created () {
    this._getDetail()
  },
  methods: {
    _getDetail () {
      if (!this.singer.Fsinger_mid) {
        this.$router.push('/singer')
        return
      }
      axios.get('/api/singer-detail.json?id=' + this.singer.Fsinger_mid)
        .then((resp) => {
          const res = resp.data
          // console.log(res)
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
            console.log(this.songs)
          }
        })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        let {musicData} = item // 其实本来可以直接push musicData这个对象。但是里面 的属性 并非都是 我想要的，所以 就进行了改造  就有了 createSong方法
        ret.push(createSong(musicData)) // 保存了好多歌的 实例 然后 有好多属性。
      })
      return ret
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .slide-enter-active, .slide-leave-active {transition: all .3s ease-out}
  .slide-enter, .slide-leave-to {transform:translateX(100%)}

  .singer-detail
    position :fixed
    z-index :100
    top: 0
    left :0
    right:0
    bottom :0
    background :$color-background
</style>
