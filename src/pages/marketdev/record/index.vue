<template>
  <div class="record-list">
    <div class="data-list">
      <market-record :list="list"></market-record>
    </div>
    <div class="msg-show" v-if="list.length===0">暂无跟进记录信息</div>
  </div>
</template>

<script>
import marketRecord from "@/components/marketRecord";
export default {
  data() {
    return {
      date: "请选择报备时间区间",
      query: {
        pageSize: 6,
        pageNum: 1,
        userId: "",
        marketDevId: "", //市场开发编号
        userType: ""
      },
      list: [],
      userInfo: {},
      total: 0
    };
  },
  onLoad(options) {
    this.query.marketDevId = options.id;
    console.log("市场开发主键", this.query.marketDevId);
  },
  async onShow() {
    this.list = [];
    await this.getUserInfo();
    await this.getList();
  },
  onReachBottom() {
    if (this.total > this.query.pageSize * this.query.pageNum) {
      this.query.pageNum++;
      this.getList();
    }
  },
  methods: {
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();
      this.query.userId = this.userInfo.userId;
      this.query.userType = this.userInfo.userType;
    },
    async getList() {
      let { result, total } = await this.api.getSysMarketDevVisitByPage(
        this.query
      );
      result.map(item => {
        switch (item.visitType) {
          case 1:
            item.visitType = "电话沟通";
            break;
          case 2:
            item.visitType = "上门拜访";
            break;
          case 3:
            item.visitType = "其他";
            break;
          default:
            break;
        }
        item.nextVisitTime = item.nextVisitTime
          ? item.nextVisitTime.substring(0, 10)
          : "";
      });
      this.total = total;
      this.list.push(...result);
    }
  },
  components: {
    marketRecord
  }
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
.record-list {
  width: 100%;
  height: auto;

  .data-list {
    background-color: #fff;
  }
  .msg-show {
    width: 100%;
    padding-top: 60rpx;
    text-align: center;
  }
}
</style>
