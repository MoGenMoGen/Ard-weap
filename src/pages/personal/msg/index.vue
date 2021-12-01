<template>
  <div class="msg">
    <div class="tab-bar">
      <div
        v-for="(item, index) in tabList"
        @click="choose(item)"
        :class="{'active':selectTab===item.nm}"
        :key="index"
      >{{item.nm}}</div>
    </div>
    <div class="msg-list">
      <div v-for="(item, index) in list" :key="index" @click="toDetail(item.msgId)">
        <text>{{item.title}}</text>
        <span class="iconfont">&#xe602;</span>
      </div>
      <p v-if="list.length==total">数据已经加载完</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: {
        pageSize: 20,
        pageNum: 1,
        queryType: 1
      },
      userInfo: {},
      total: 0,
      list: [],
      selectTab: "公共消息",
      tabList: [{ nm: "公共消息", cd: 1 }, { nm: "个人消息", cd: 2 }]
    };
  },
  async onShow() {
    this.list = [];
    this.selectTab = "公共消息";
    this.query.queryType = 1;
    await this.getUserInfo();
    await this.getMsgList();
  },
  onUnload() {
    this.selectTab = "公共消息";
  },
  onReachBottom() {
    console.log("getMore");
    if (this.total > this.query.pageSize * this.query.pageNum) {
      this.query.pageNum++;
      this.getMsgList();
    }
  },
  methods: {
    // getMore(){
    //   if(this.list.length < this.total){
    //     this.query.pageNum++
    //     this.getMsgList()
    //
    //   }
    // },
    choose(item) {
      this.selectTab = item.nm;
      this.list = [];
      this.query.queryType = item.cd;
      if (item.cd === 1) {
        this.query.pageSize = 20;
        this.query.pageNum = 1;
      }
      this.getMsgList();
    },
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();
      this.query.userId = this.userInfo.userId;
    },
    async getMsgList() {
      let { result, total } = await this.api.getSysMsgListByPage(this.query);
      this.total = total;
      this.list.push(...result);
    },
    toDetail(id) {
      this.until.aHref(`../msgdetail/main?id=${id}`);
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
.msg {
  width: 100%;
  height: 100%;
  background-color: @backgroundColor;
  box-sizing: border-box;
  .tab-bar {
    display: flex;
    display: -webkit-flex;
    flex-flow: row nowrap;
    background-color: #fff;

    > div {
      flex: 1;
      padding: 20rpx 0;
      text-align: center;
      font-size: 30rpx;
    }
    .active {
      color: @btnColor;
      border-bottom: 1rpx solid @btnColor;
    }
    :not(.active) {
      border-bottom: 1rpx solid #000;
    }
  }
  .msg-list {
    display: flex;
    display: -webkit-flex;
    flex-flow: column wrap;
    background-color: #fff;
    padding-left: 60rpx;
    width: 690rpx;
    > p {
      text-align: center;
      padding: 20rpx 0;
    }
    > div {
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      padding: 30rpx 40rpx 30rpx 0;
      font-size: 30rpx;
      color: #666;
      border-bottom: 1rpx solid #ddd;
      &:nth-last-of-type(1) {
        border-bottom: 0;
      }
      text {
        flex: 1;
      }
      span {
        width: 12rpx;
      }
    }
  }
}
</style>
