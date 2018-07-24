<template>
  <div class="wrapper">
    <!-- v-if="list.length"  showSwiper 如果不加这个,swiper组件会以空数组加载swiper组件，然后ajax数据加载了再加载一次，这样会导致图片显示最后一张 -->
    <swiper :options="swiperOption" v-if="showSwiper" >
      <swiper-slide v-for="item in list" :key="item.id">
        <a :href="item.linkUrl">
          <img class="swiper-img" :src="item.picUrl" />
        </a>
      </swiper-slide>
      <div class="swiper-pagination"  slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
export default {
  props: {
    list: Array
  },
  data () {
    return {
      swiperOption: {
        pagination: '.swiper-pagination',
        loop: true,
        autoplay: 4000,
        autoplayDisableOnInteraction: false, // 注意此参数，默认为true
        onTouchEnd: function (obj) {
          console.log(obj)
        }
      }
    }
  },
  computed: {
    showSwiper () {
      console.log(this.list)
      return this.list.length
    }
  }
}
</script>

<style lang="stylus" scoped>
// .wrapper >>> .swiper-pagination-bullet-active
// background :#fff
.wrapper {
  width: 100%;
  overflow: hidden;
  background: #eee;

  .swiper-img {
    width: 100%;
    vertical-align: middle;
  }
}
</style>

<style>
.swiper-pagination-bullet {
  transition: all 0.3s;
}
.swiper-pagination-bullet-active {
  background: #fff;
  width: 20px;
  border-radius: 5px;
}
</style>
