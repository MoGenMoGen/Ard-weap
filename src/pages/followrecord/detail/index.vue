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
    <!-- 一报二报显示这个 -->
    <div class="operate">
      <button plain="true" @click="toPage(`../history/main?id=${reportId}&history=unique`)">历史跟进</button>
      <button plain="true" @click="toPage(`../add/main?id=${reportId}&proNm=${projectName}`)">新建跟进</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      reportId: "",
      projectName: "",
      regoinList: [
        {
          nm: "projectName",
          key: "项目名称：",
          value: "装修材料",
          required: false
        },
        {
          nm: "visitType",
          key: "跟进方式：",
          value: "电话沟通",
          required: false
        },

        {
          nm: "visitContent",
          key: "跟进内容： ",
          value: `商量合同细节，商量合同细节商量合同细节，商量合同细节商量合同细节商量合同细节 `,
          required: false
        },
        { nm: "status", key: "跟进状态：", value: "报价客户", required: false },
        {
          nm: "nextVisitTime",
          key: "下次跟进时间：",
          value: "2019-06-20",
          required: false
        },
        { nm: "remark", key: "备注：", value: "无", required: false }
      ]
    };
  },
  onLoad(options) {
    this.id = options.id;
    console.log(this.id);
  },
  onShow() {
    let index = getCurrentPages();
    console.dir(`页面栈${index.length}`);
    this.getRecordInfo();
  },
  onUnload() {},
  methods: {
    async getRecordInfo() {
      let res = await this.api.getSysRecodeInfo(this.id);

      this.reportId = res.reportId;
      this.projectName = res.projectName;
      this.regoinList.map(item => {
        item.value = res[item.nm] ? res[item.nm] : "";
        if (item.nm == "visitType") {
          switch (res[item.nm]) {
            case "1":
              item.value = "电话沟通";
              break;
            case "2":
              item.value = "上门拜访";
              break;
            case "3":
              item.value = "其他";
              break;
            default:
              break;
          }
        }

        if (item.nm == "status") {
          switch (res[item.nm]) {
            case 1:
              item.value = "初步接触";
              break;
            case 2:
              item.value = "意向客户";
              break;
            case 3:
              item.value = "报价客户";
              break;
            case 4:
              item.value = "成效客户";
              break;
            case 5:
              item.value = "搁置客户";
              break;
            default:
              break;
          }
        }

        if (item.nm == "nextVisitTime") {
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
  .operate {
    button {
      &:nth-of-type(1) {
        border-top: 1rpx solid @btnColor;
        background-color: #fff;
        color: #333;
      }
    }
  }
}
</style>
