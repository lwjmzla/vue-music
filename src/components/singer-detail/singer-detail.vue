<template>
  <transition name="slide">
    <div class="singer-detail">

    </div>
  </transition>

</template>

<script>
export default {
  data () {
    return {

    }
  },
  components: {

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
