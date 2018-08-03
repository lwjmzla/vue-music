<template>
  <div>
    <ul>
      <li v-for="(item,index) in singers" :key="index" class="class" :class="selectClass(index)">
        {{index}}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      singers: [],
      flag: true
    }
  },
  computed: {
    classObj () {
      return {

      }
    }
  },
  components: {

  },
  created () {
    this._getSingerList()
  },
  methods: {
    selectClass (index) {
      let obj = {}
      obj[`class${index}`] = true
      return obj
    },
    _getSingerList () {
      axios.get('/api/singer.json')
        .then((resp) => {
          const res = resp.data
          // console.log(res)
          if (res.code === 0) {
            this.singers = res.data.list
          }
        })
    },
    selectSinger (item) {
      this.$router.push({
        path: `/singer/${item.Fsinger_mid}`
      })
      this.setSinger(item)
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
