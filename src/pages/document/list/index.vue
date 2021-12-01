<template>
  <div class="sale-doc">
    <div class="tab-bar">
      <scroll-view class="right-wrapper" scroll-x="true" style="white-space:nowrap">
        <div
          v-for="item in tabList"
          @click="choose(item.id)"
          :class="{'active':selectTab===item.id}"
          :key="item.id"
          enable-flex="true"
        >{{item.catName}}</div>
      </scroll-view>
    </div>
    <div class="doc-list">
      <div v-for="(item, index) in list" :key="index" @click="toDetail(item.id)">
        <text>{{item.content}}</text>
        <img :src="downIcon" @click="saveFile" mode="widthFix" alt />
      </div>
    </div>
  </div>
</template>

<script>
import downIcon from "../../../../static/images/down-icon.png";
export default {
  data() {
    return {
      downIcon,
      selectTab: 1,
      tabList: [],
      userInfo: {},
      list: [],
      total: 0,
      query: {
        userId: "",
        pageSize: 5,
        pageNum: 1,
        catId: "",
        status: 1
      }
    };
  },
  async onShow() {
    this.list = [];
    this.tabList = [];
    this.selectTab = 1;
    await this.getUserInfo();
    await this.getSaleTypeList();
  },
  onReachBottom() {
    if (this.total > this.query.pageSize * this.query.pageNum) {
      this.query.pageNum++;
      this.getSaleDocList();
    }
  },
  methods: {
    choose(id) {
      this.selectTab = id;
      this.list = [];
      this.getSaleDocList(id);
    },
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();
      this.query.userId = this.userInfo.userId;
    },
    async getSaleTypeList() {
      this.tabList = await this.api.getSysSaleDataCatList({
        userId: this.userInfo.userId
      });

      if (this.tabList.length > 0) {
        this.getSaleDocList(this.tabList[0].id);
      }
    },
    async getSaleDocList(id) {
      this.query.catId = id;
      let { result, total } = await this.api.getSysSaleDataListByPage(
        this.query
      );
      this.total += total;
      this.list.push(...result);
      console.dir(this.list);
    },
    toDetail(id) {
      this.until.aHref(`../detail/main?id=${id}`);
    },
    saveFile() {}
  }
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
.sale-doc {
  width: 100%;
  height: 100%;
  background-color: @backgroundColor;
  .tab-bar {
    scroll-view {
      display: flex;
      display: -webkit-flex;
      white-space: nowrap;
      background-color: #fff;
      div {
        width: 200rpx;
        display: inline-block;
        padding: 20rpx 0;
        text-align: center;
      }
      .active {
        color: @btnColor;
        border-bottom: 1rpx solid @btnColor;
      }
    }
  }
  .doc-list {
    margin-top: 20rpx;
    background-color: #fff;
    display: flex;
    display: -webkit-flex;
    flex-flow: column wrap;
    > div {
      flex: 1;
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      padding: 30rpx 50rpx;
      border-bottom: 1rpx solid #ddd;
      &:nth-last-of-type(1) {
        border-bottom: 0;
      }
      img {
        flex: 0 0 auto;
        width: 35rpx;
      }
      text {
        flex: 1;
      }
    }
  }
}
</style>
