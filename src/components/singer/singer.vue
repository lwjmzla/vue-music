<template>
  <div class="singer" ref="singer">
    <list-view  v-if="singers.length" :hotSingers="hotSingers" :normalSingers="normalSingers" ref="list"></list-view>
    <div class="loading-container" v-show="!singers.length">
      <loading></loading>
    </div>
  </div>
</template>

<script>
import {ERR_OK} from 'api/config'
import axios from 'axios'
import ListView from 'base/listview/listview'
import Loading from 'base/loading/loading'
export default {
  data () {
    return {
      singers: []
    }
  },
  computed: {
    hotSingers () {
      let arr = []
      arr = this.singers.filter((obj, index) => {
        return index <= 9
      })
      return arr
    },
    normalSingers () {
      let obj = {}
      this.singers.forEach((value, index) => {
        if (!obj[value.Findex]) {
          obj[value.Findex] = {
            title: value.Findex,
            items: []
          }
        }
        let subObj = obj[value.Findex]
        subObj.items.push(value)
      })
      if (obj[9]) {
        delete obj[9]
      }
      // console.log(obj)
      // 排序数据
      let arr = []
      for (let key in obj) {
        arr.push(obj[key])
      }
      arr.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return arr
    }
  },
  components: {
    ListView,
    Loading
  },
  created () {
    this._getSingerList()
  },
  methods: {
    _getSingerList () {
      axios.get('/api/singer.json')
        .then((resp) => {
          const res = resp.data
          // console.log(res)
          if (res.code === ERR_OK) {
            this.singers = res.data.list
          }
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
