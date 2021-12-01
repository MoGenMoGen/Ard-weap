<template>
  <div class="search">
    <view class="toSearch" @click="toPage('../order/list/main')">
      <img :src="searchIcon" mode="widthFix" />{{content}}
    </view>
    <!--<input type="text" :placeholder="content" v-model="key" confirm-type="搜索" @confirm="search">-->
  </div>
</template>

<script>
import searchIcon from "../../static/images/search-icon.png";
export default {
  props: {
    content: {
      type: String,
      default: "搜索"
    }
  },
  data() {
    return {
      searchIcon,
      key: ""
    };
  },
  methods: {
    toPage(url) {
      this.until.aHref(url);
    }
  }
};
</script>

<style scoped lang="less">
.search {
  position: absolute;
  left: 40rpx;
  top: 6%;
  z-index: 2001;
  border: 0;
  border-radius: 33rpx;
  background-color: #fff;
  .toSearch {
    width: 670rpx;
    height: 66rpx;
    line-height: 66rpx;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    color: #999;
    img {
      margin-left: 25rpx;
      margin-right: 10rpx;
      width: 30rpx;
    }
  }
}
</style>
