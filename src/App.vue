<template>
  <div id="app" style="padding-top:30px;">
    <m-header></m-header>
    <tab></tab>
    <keep-alive exclude="">
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
// import axios from 'axios'
// import {prefix} from 'common/js/config'
export default {
  name: 'App',
  components: {
    MHeader,
    Tab,
    Player
  },
  created () {
    // axios({
    //   method: 'post',
    //   url: prefix + '/postAjax',
    //   data: {num: 1}
    // }).then((res) => {
    //   console.log(res)
    // })
  }
}
</script>

<style lang="stylus" scoped>

</style>
