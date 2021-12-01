<template>
  <div class="detail">
    <!--通过模板消息进来时才显示-->
    <div class="resultList" v-if="fromType">
      <div class="title-info">
        <span></span>
        <span>审核结果</span>
      </div>
      <div class="app-item" v-for="item in resultList" :key="item.id">
        <div>
          <span>审核结果</span>
          <p v-if="item.checkresult===0">无效</p>
          <p v-if="item.checkresult===1">一报</p>
          <p v-if="item.checkresult===2">二报</p>
          <p v-if="item.checkresult===3">三报</p>
        </div>
        <div>
          <span>意见</span>
          <p v-if="item.checkView===0">不同意</p>
          <p v-if="item.checkView===1">同意</p>
        </div>
        <div>
          <span>审核人</span>
          {{item.checker}}
        </div>
        <div>
          <span>备注</span>
          {{item.remark ? item.remark : ''}}
        </div>
        <div>
          <span>时间</span>
          {{item.crtTm}}
        </div>
      </div>
    </div>
    <!-- 经销商隐藏 -->
    <div class="appr" v-if="showResult">
      <div class="app-item" v-for="item in appArr" :key="item.nm">
        <span v-if="item.required" class="iconfont">&#xe69f;</span>
        <div>{{item.key}}</div>
        <div>{{item.value}}</div>
      </div>
    </div>
    <div class="regoin">
      <div v-for="item in regoinList" :key="item.nm">
        <span v-if="item.required" class="iconfont">&#xe69f;</span>
        <div>{{item.key}}</div>
        <div>{{item.value}}</div>
      </div>
    </div>
    <!-- 相关报备 -->
    <div class="competitor-contain" v-if="reportStatus==100 || reportStatus==200 || reportStatus==300">
      <div class="title-info">
        <span></span>
        <span>相关项目报备</span>
      </div>
      <div
        class="competitor"
        v-for="item in checkLinkList"
        :key="item.id"
        @click="toDetail(item.id)"
      >
        <div>
          <div>项目名称</div>
          <div>{{item.projectName}}</div>
        </div>
        <div>
          <div>所在区域</div>
          <div>{{item.projectAreaName}}</div>
        </div>
        <div>
          <div>工程跟进人</div>
          <div>{{item.projectFollowMan}}</div>
        </div>
        <div>
          <div>项目报备时间</div>
          <div>{{item.reportTime}}</div>
        </div>
        <div>
          <div>项目审核时间</div>
          <div>{{item.reportCheckTime}}</div>
        </div>
        <div>
          <div>项目报备结果</div>
          <div v-if="item.reportResult==0">无效</div>
          <div v-if="item.reportResult==1">一报</div>
          <div v-if="item.reportResult==2">二报</div>
          <div v-if="item.reportResult==3">三报</div>
        </div>
      </div>
    </div>
    <!-- 经销商 -->
    <div class="manager" v-if="reportResult==='待审核'">
      <button v-if="canEdit" @click="toPage(`../add/main?id=${id}`)">修改</button>
      <button
        :class="{'active':!canAppr}"
        @click="toPage(`../../followrecord/history/main?id=${id}&proNm=${projectName}&canClick=${addRecode}`)"
      >查看跟进记录</button>
      <button v-if="canAppr" @click="toPage(`../../proreport/review/main?id=${id}`)">报备审核</button>
    </div>
    <!-- 一报二报显示这个 已审核显示这个 -->
    <div class="operate" v-else>
      <button
        plain="true"
        @click="toPage(`../../followrecord/history/main?id=${id}&proNm=${projectName}&canClick=${addRecode}`)"
      >查看跟进记录</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      reportResult: "",
      showResult: "",
      projectName: "",
      fromType: false,
      canAppr: false,
      addRecode: false,
      canEdit: false,
      resultList: [],
      checkLinkList: [],
      appArr: [
        {
          nm: "reportResult",
          key: "审核状态：",
          value: "二宝",
          required: false
        },
        {
          nm: "reportChecker",
          key: "审核人：",
          value: "徐国祥",
          required: false
        },
        {
          nm: "reportCheckTime",
          key: "审核时间：",
          value: "2019-06-20   12:01:12",
          required: false
        }
      ],
      regoinList: [
        {
          nm: "reportTime",
          key: "报备时间：",
          value: "2019-06-29",
          required: false
        },
        {
          nm: "projectName",
          key: "公司名称：",
          value: "宁波聚联科技有限公司",
          required: false
        },
        {
          nm: "projectLeader",
          key: "区域负责人：",
          value: "徐国祥",
          required: false
        },
        {
          nm: "projectFollowMan",
          key: "报备人：",
          value: "王晓伟",
          required: false
        },
        {
          nm: "projectAreaName",
          key: "项目区域：",
          value: `浙江省  宁波市  镇海区`,
          required: false
        },
        {
          nm: "projectAddress",
          key: "详细地址：",
          value: "永茂西路南段 329创业社区212室",
          required: false
        },
        {
          nm: "projectLeader",
          key: "联系人：",
          value: "张晓",
          required: false
        },
        {
          nm: "leaderLinkPhone",
          key: "联系方式：",
          value: "12345678963",
          required: false
        },
        {
          nm: "signDate",
          key: "预计签约时间：",
          value: "2019-06-29",
          required: false
        },
        {
          nm: "planPurchaseAmount",
          key: "预计签约金额：",
          value: "12万",
          required: false
        },
        {
          nm: "planPurchaseProduct",
          key: "预计采购产品：",
          value: "净化",
          required: false
        }
      ]
    };
  },
  onLoad(options) {
    if (options.fromType) {
      this.fromType = true;
    } else {
      this.fromType = false;
    }
    this.id = options.id;
    this.reportResult = options.reportResult;
    console.log("reportId" + this.id + "reportResult home" + this.reportResult);
  },
  onUnload() {
    this.canAppr = false;
  },
  async onShow() {
    await this.getUserInfo();
    await this.getReportInfo();
  },
  methods: {
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();
    },
    async getReportInfo() {
      let res = await this.api.getSysReportInfo(this.id);

      if (
        res.reportUserId === this.userInfo.userId ||
        (this.userInfo.extUserIds && this.userInfo.extUserIds.indexOf(res.reportUserId) > -1)
      ) {
        this.addRecode = true;
        this.canEdit = true;
      } else {
        this.addRecode = false;
        this.canEdit = false;
      }
      this.checkLinkList = res.checkLinkList;
      this.resultList = res.checkResultList;
      //用来显示一报二报 无效 省代审批了市代也是待审核
      if (
        !res.reportStatus ||
        (res.reportStatus === 100 )
) {
        this.reportResult = "待审核";
      } else {
        this.reportResult = "已审核";
      }

      if (res.reportResult) {
        this.showResult = true;
      } else {
        this.showResult = false;
      }
      res.reportTime = res.reportTime.substring(0, 10);
      res.signDate = res.signDate ? res.signDate.substring(0, 10) : "";
      this.projectName = res.projectName;
      this.regoinList.map(item => {
        item.value = res[item.nm];
        if (item.nm === "planPurchaseAmount") {
          item.value = `${item.value}万元`;
        }
      });

      /*  省代审批市代
          业务主管审批 直营 省代 市代（需先省代审批） 自己
          总经理 只审批业务主管？    */

      if (this.userInfo.userId === res.groupLeaderId) {
        this.canAppr = true;
      }

      this.appArr.map(item => {
        item.value = res[item.nm] ? res[item.nm] : "";
        if (item.nm == "reportResult") {
          switch (res[item.nm]) {
            case 0:
              item.value = "无效";
              break;
            case 1:
              item.value = "一报";
              break;
            case 2:
              item.value = "二报";
              break;
            case 3:
              item.value = "三报";
              break;
            default:
              break;
          }
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

  .regoin,
  .appr {
    display: flex;
    display: -webkit-flex;
    flex-flow: column wrap;
    padding: 30rpx 65rpx;
    background-color: #fff;
    margin-bottom: 20rpx;

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
  .appr {
  }
  >div:nth-last-child(2){
    padding-bottom: 100rpx;
  }
  .operate,
  .manager {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-flow: row nowrap;
    button {
      border: 0;
      flex: 1;
      height: 100rpx;
      line-height: 2;
      padding: 20rpx 0;
      border-top: 1rpx solid @btnColor;
      background-color: #fff;
      color: #333;
      border-right: 1rpx solid @btnColor;
      font-size: 30rpx;
      text-align: center;
    }
  }
  .operate {
    button {
      background-color: @btnColor;
      color: #fff;
    }
  }
  .manager {
    button {
      &:last-of-type {
        background-color: @btnColor;
        color: #fff;
      }
    }
    button.active {
      background-color: @btnColor;
      color: #fff;
    }
  }
  .resultList {
    background-color: #fff;
    margin-bottom: 20rpx;
    .app-item {
      padding: 30rpx 65rpx;
      border-bottom: 1px solid @borderColor;
      > div {
        display: flex;
        display: -webkit-flex;
        line-height: 60rpx;
        span {
          width: 200rpx;
        }
      }
    }
  }
  .title-info {
    background-color: #fff;
  }
  .competitor {
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
      align-items: center;
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
          margin-right: 20rpx;
        }
        &:nth-last-of-type(1) {
          flex: 1;
        }
      }
    }
  }
}
</style>
