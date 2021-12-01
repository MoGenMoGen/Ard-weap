<template>
  <div class="detail">
    <!-- 经销商隐藏 -->

    <div class="regoin">
      <div v-for="item in regoinList" :key="item.nm">
        <span v-if="item.required" class="iconfont">&#xe69f;</span>
        <div>{{item.key}}</div>
        <div>{{item.value}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: "",

      regoinList: [
        {
          nm: "visitType",
          key: "跟进方式：",
          value: "上门拜访",
          required: false
        },
        {
          nm: "visitContent",
          key: "跟进内容：",
          value: `10月27日初次拜访，店面计划12月
装修，指定埃瑞德展厅位置，设计展
厅图纸。价格装饰4折，线型出风600
元/平，回风700元/平`,
          required: false
        },

        {
          nm: "location",
          key: "所在位置： ",
          value: `宁波市镇海区329创业社区212室`,
          required: false
        },
        {
          nm: "nextVisitTime",
          key: "下次跟进时间：",
          value: "2019-06-20",
          required: false
        },
        {
          nm: "remark",
          key: "备注：",
          value: "无",
          required: false
        }
      ]
    };
  },
  onLoad(options) {
    this.id = options.id;
    console.log(this.id);
  },
  onShow() {
    this.getMarketDevVisitInfo();
  },
  methods: {
    async getMarketDevVisitInfo() {
      let res = await this.api.getSysMarketDevVisitInfoById(this.id);

      this.regoinList.map(item => {
        item.value = res[item.nm] ? res[item.nm] : "";
        if (item.nm == "visitType") {
          switch (res[item.nm]) {
            case 1:
              item.value = "电话沟通";
              break;
            case 2:
              item.value = "上门拜访";
              break;
            case 3:
              item.value = "其他";
              break;
            default:
              break;
          }
        }
        if (item.nm === "nextVisitTime") {
          item.value = item.value ? item.value.substring(0, 10) : "";
        }
      });
    },
    toPage(url) {
      this.until.aHref(url);
    }
  }
};
</script>

<style lang='less' scoped>
@import url("../../../css/common.less");
.detail {
  width: 100%;
  height: 100%;
  background-color: @backgroundColor;
  color: #666;
  font-size: 26rpx;
  .regoin {
    display: flex;
    display: -webkit-flex;
    flex-flow: column wrap;
    padding: 30rpx 65rpx;
    background-color: #fff;
    > div {
      position: relative;
      flex: 1;
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      align-items: flex-start;
      margin-top: 20rpx;
      &:nth-of-type(1) {
        margin-top: 0;
      }
      span {
        position: absolute;
        top: 20%;
        left: -40rpx;
        color: #f00;
      }
      div {
        &:nth-of-type(1) {
          width: 200rpx;
        }
        &:nth-last-of-type(1) {
          flex: 1;
        }
      }
    }
  }
  .regoin {
    padding-bottom: 100rpx;
  }
}
</style>
