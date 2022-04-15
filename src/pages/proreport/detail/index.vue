<template>
  <div class="detail">
    <div class="annotation" @click="showMask = true" v-if="annoteContion == 1">
      新增批注
    </div>
    <div class="annotation" @click="showMask = true" v-if="annoteContion == 2">
      修改批注
    </div>
    <view class="tops" @click="showMask = false" v-if="showMask">
      <div class="content" @click.stop="">
        <input
          type="text"
          v-model="commit.annotation"
          placeholder="请输入批注"
          style="border: 1px solid #ccc;width: 86%; box-sizing: border-box;padding: 0 20rpx;  margin: 74rpx auto;"
        />
        <div class="confirm" @click="confirm">确定</div>
      </div>
    </view>

    <!--通过模板消息进来时才显示-->
    <div class="resultList" v-if="fromType">
      <div class="title-info">
        <span></span>
        <span>审核结果</span>
      </div>
      <div class="app-item" v-for="item in resultList" :key="item.id">
        <div>
          <span>审核结果</span>
          <p v-if="item.checkresult === 0">无效</p>
          <p v-if="item.checkresult === 1">一报</p>
          <p v-if="item.checkresult === 2">二报</p>
          <p v-if="item.checkresult === 3">三报</p>
        </div>
        <div>
          <span>意见</span>
          <p v-if="item.checkView === 0">不同意</p>
          <p v-if="item.checkView === 1">同意</p>
        </div>
        <div>
          <span>审核人</span>
          {{ item.checker }}
        </div>
        <div>
          <span>备注</span>
          {{ item.remark ? item.remark : "" }}
        </div>
        <div>
          <span>时间</span>
          {{ item.crtTm }}
        </div>
      </div>
    </div>
    <!-- 经销商隐藏 -->
    <div class="app" v-if="showResult">
      <div class="app-item" v-for="item in appArr" :key="item.nm">
        <span v-if="item.required" class="iconfont">&#xe69f;</span>
        <div>{{ item.key }}</div>
        <div>{{ item.value }}</div>
      </div>
    </div>
    <!-- 基本信息 -->
    <div class="regoin" style="position: relative">
      <!-- <div
        v-if="detailData.annotation"
        style="color: red; position: absolute; top: 100rpx; right: 40rpx"
      >
        {{ detailData.annotation }}
      </div> -->
      <div v-for="item in regoinList" :key="item.nm">
        <span v-if="item.required" class="iconfont">&#xe69f;</span>
        <div>{{ item.key }}</div>
        <div :style="{ color: item.nm == 'annotation' ? 'red' : '' }">
          {{ item.value }}
        </div>
      </div>
    </div>
    <!-- 相关单位 -->
    <div class="rels">
      <div class="title-info">
        <span></span>
        <span>相关单位</span>
      </div>
      <div
        class="rel-item"
        v-for="(itemRel, index) in relItems"
        :key="itemRel.id"
      >
        <div
          class="final-item"
          v-for="(item, index1) in itemRel.relsArr"
          :key="item.nm"
        >
          <span v-if="item.required" class="iconfont">&#xe69f;</span>
          <div>{{ item.key }}</div>
          <div>{{ item.value }}</div>
        </div>
      </div>
    </div>
    <!-- 跟进情况 -->
    <div class="follow-contain">
      <div class="title-info">
        <span></span>
        <span>跟进情况</span>
      </div>
      <div class="follow">
        <div v-for="item in followArr" :key="item.nm">
          <span v-if="item.required" class="iconfont">&#xe69f;</span>
          <div>{{ item.key }}</div>
          <div>{{ item.value && item.value !== "null" ? item.value : "" }}</div>
        </div>
      </div>
    </div>
    <!-- 主要竞争对手 -->
    <div class="competitor-contain">
      <div class="title-info">
        <span></span>
        <span>主要竞争对手情况</span>
      </div>
      <div
        class="competitor"
        v-for="(itemCom, index) in competitorItems"
        :key="itemCom.id"
      >
        <div v-for="(item, index1) in itemCom.competitorArr" :key="item.nm">
          <span v-if="item.required" class="iconfont">&#xe69f;</span>
          <div>{{ item.key }}</div>
          <div>{{ item.value }}</div>
        </div>
      </div>
    </div>
    <!-- 关联的订单信息及对应产品线的金额开始 -->
    <div class="order-info">
      <div class="title-info" style="margin-top:10rpx;">
        <span></span>
        <span>订单信息</span>
      </div>
      <div class="order-box">
          <div class="order-title">
            <div class="line1 line-title">订单编码-非erp</div>
            <div class="line2 line-title">订单编码</div>
            <div class="line3 line-title">金额(折扣前)</div>
            <div class="line4 line-title">折扣金额</div>
            <div class="line5 line-title">应付金额</div>
            <div class="line6 line-title">订单已付金额</div>
          </div>
        <div
          class="order-content"
          v-for="(item, index) in orderList"
          :key="index"
          v-if="orderList.length>0"
        >
          <div class="line1 line-content">{{ item.crmOrderVo.orderCode }}</div>
          <div class="line2 line-content">{{ item.crmOrderVo.erpCode }}</div>
          <div class="line3 line-content">{{ item.crmOrderVo.payAmount }}</div>
          <div class="line4 line-content">{{ item.crmOrderVo.discountAmount }}</div>
          <div class="line5 line-content">{{ item.crmOrderVo.totalAmount }}</div>
          <div class="line6 line-content">{{ item.crmOrderVo.payedAmount }}</div>
        </div>
      </div>
      <div class="cpx-title">
        <div>产品线分类</div>
        <div>合计（元）</div>
      </div>
      <div class="cpx-content" v-for="(item,index) in cpxList" :key="index">
        <div>{{item.name}}</div>
        <div>{{item.price}}</div>
      </div>
    </div>
    <!-- 关联的订单信息及对应产品线的金额结束 -->

    <!-- 相关报备 -->
    <div
      class="competitor-contain"
      v-if="reportStatus == 100 || reportStatus == 200 || reportStatus == 300"
    >
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
          <div>{{ item.projectName }}</div>
        </div>
        <div>
          <div>工程所在区域</div>
          <div>{{ item.projectAreaName }}</div>
        </div>
        <div>
          <div>工程跟进人</div>
          <div>{{ item.projectFllowMan }}</div>
        </div>
        <div>
          <div>报备时间</div>
          <div>{{ item.reportTime }}</div>
        </div>
        <div>
          <div>审核时间</div>
          <div>{{ item.reportCheckTime }}</div>
        </div>
        <div>
          <div>报备结果</div>
          <div v-if="item.reportResult == 0">无效</div>
          <div v-if="item.reportResult == 1">一报</div>
          <div v-if="item.reportResult == 2">二报</div>
          <div v-if="item.reportResult == 3">三报</div>
        </div>
      </div>
    </div>
    <!-- 经销商 -->

    <div class="manager" v-if="reportResult == '待审核'">
      <button v-if="canEdit" @click="toPage(`../add/main?id=${id}`)">
        修改
      </button>
      <button
        :class="{ active: !canAppr }"
        @click="
          toPage(
            `../../followrecord/history/main?id=${id}&proNm=${projectName}&canClick=${addRecode}`
          )
        "
      >
        查看跟进记录
      </button>
      <button v-if="canAppr" @click="toPage(`../review/main?id=${id}`)">
        报备审核
      </button>
    </div>
    <!-- 一报二报显示这个 已审核显示这个 -->
    <div class="operate" v-else>
      <button
        plain="true"
        @click="
          toPage(
            `../../followrecord/history/main?id=${id}&proNm=${projectName}&canClick=${addRecode}`
          )
        "
      >
        查看跟进记录
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detailData: {}, //用于新增/修改批注
      commit: {
        annotation: "", //提交批注参数
      },
      showMask: false,
      id: "",
      projectName: "",
      showResult: false,
      relItems: [],
      competitorItems: [],
      checkLinkList: [],
      resultList: [],
      fromType: false,
      reportResult: "",
      addRecode: false,
      canEdit: false,
      appArr: [
        {
          nm: "reportResult",
          key: "审核状态：",
          value: "",
          required: false,
        },
        {
          nm: "reportChecker",
          key: "审核人：",
          value: "",
          required: false,
        },
        {
          nm: "reportCheckTime",
          key: "审核时间：",
          value: "",
          required: false,
        },
      ],
      regoinList: [
        {
          nm: "projectAreaName",
          key: "工程所在区域：",
          value: "",
          required: true,
        },
        {
          nm: "projectAddress",
          key: "工程详细地址：",
          value: "",
          required: true,
        },
        {
          nm: "projectFollowMan",
          key: "工程跟进人：",
          value: "",
          required: true,
        },
        {
          nm: "reportTime",
          key: "申报时间：",
          value: "",
          required: true,
        },
        {
          nm: "saleName",
          key: "经销商名称：",
          value: "",
          required: true,
        },
        { nm: "outTown", key: "异地工程：", value: "", required: true },
        {
          nm: "projectLeader",
          key: "项目负责人：",
          value: "",
          required: true,
        },
        {
          nm: "leaderPost",
          key: "职务：",
          value: "",
          required: true,
        },
        {
          nm: "leaderLinkPhone",
          key: "联系电话：",
          value: "",
          required: true,
        },
        {
          nm: "projectName",
          key: "工程名称：",
          value: "",
          required: true,
        },
        {
          nm: "projectType",
          key: "工程类型：",
          value: "",
          required: true,
        },
        {
          nm: "projectStatus",
          key: "工程现状：",
          value: ``,
          required: true,
        },
        {
          nm: "mainProduct",
          key: "主要产品类型：",
          value: "",
          required: true,
        },
        {
          nm: "projectInvestAmount",
          key: "工程投资金额：",
          value: "",
          required: false,
        },
        {
          nm: "bidTime",
          key: "投标时间：",
          value:'',
          required: false,
        },
        {
          nm: "projectOpenTime",
          key: "工程施工时间：",
          value:'',
          required: true,
        },
        {
          nm: "planPurchaseAmount",
          key: "预采金额：",
          value: ``,
          required: true,
        },
        {
          nm: "planPurchaseTime",
          key: "预采时间：",
          value:'',
          required: true,
        },
        {
          nm: "signDate",
          key: "签约时间：",
          value:'',
          required: false,
        },
        {
          nm: "actualPurchaseTime",
          key: "实际采购时间：",
          value:'',
          required: false,
        },
        {
          nm: "remark",
          key: "我方关系情况及技术优势描述：",
          value:'',
          required: true,
        },
        {
          nm: "purchaseModel",
          key: "采购模式：",
          value:'',
          required: false,
        },
        {
          nm: "preReportUserNm",
          key: "上个报备用户：",
          value: "",
          required: false,
        },
        {
          nm: "preAgentName",
          key: "上个经销商：",
          value: "",
          required: false,
        },
        {
          nm: "annotation",
          key: "批注：",
          value: "",
          required: false,
        },
      ],
      relsArr: [
        { nm: "unitType", key: "单位身份：", value: "", required: true },
        // { nm: "unitInfo", key: "单位信息：", value: "", required: true },
        {
          nm: "unitName",
          key: "公司名称：",
          value: "",
          required: true,
        },
        {
          nm: "unitLeader",
          key: "负责人姓名：",
          value: "",
          required: true,
        },
        {
          nm: "unitLinkPhone",
          key: "联系电话：",
          value: "",
          required: true,
        },
        // {
        //   nm: "expectSucceedPercent",
        //   key: "预计成功率：",
        //   value: "80%",
        //   required: false,
        // },
      ],
      followArr: [
        {
          nm: "mainTarget",
          key: "主攻对象：",
          value: "",
          required: false,
        },
        { nm: "decideName", key: "决策者：", value: "", required: false },
      ],
      competitorArr: [
        { nm: "name", key: "名称：", value: "", required: false },
        { nm: "remark", key: "优势：", value: "", required: false },
      ],
      userInfo: {},
      roleType: "业务经理",
      apprState: "一报",
      canAppr: false,
      orderList: [
      ],
      cpxList: []
    };
  },
  computed: {
    // 新增/修改批注
    //1为新增，2为编辑
    annoteContion() {
      console.log(
        "aaa",
        this.userInfo.userId == this.detailData.reportCheckerId
      );
      console.log(
        "bbb",
        this.detailData.reportResult == 1 ||
          this.detailData.reportResult == 2 ||
          this.detailData.reportResult == 3
      );
      console.log("ccc", this.detailData.annotation);
      if (
        this.userInfo.userId == this.detailData.reportCheckerId &&
        (this.detailData.reportResult == 1 ||
          this.detailData.reportResult == 2 ||
          this.detailData.reportResult == 3) &&
        !this.detailData.annotation
      ) {
        return 1;
      } else if (
        this.userInfo.userId == this.detailData.reportCheckerId &&
        (this.detailData.reportResult == 1 ||
          this.detailData.reportResult == 2 ||
          this.detailData.reportResult == 3) &&
        this.detailData.annotation
      ) {
        return 2;
      } else return 0;
    },
  },
  onLoad(options) {
    // Object.assign(this.$data, this.$options.data())
    if (options.fromType) {
      this.fromType = true;
    } else {
      this.fromType = false;
    }
    this.id = options.id;
    this.reportResult = options.reportResult;
    console.log(this.id, `project report${this.reportResult}`);

  },
  onUnload() {
    this.canAppr = false;
  },
  onShow() {
    console.log("onshow");
    this.getData();
  },
  methods: {
    async getData() {
      console.log("getdata");
      await this.getUserInfo();
      await this.getReportInfo();
      console.log("批注", this.annoteContion);
    },
    toDetail(id) {
      this.id = id;
      this.getReportInfo();
    },
    async getUserInfo() {
      console.log("用户信息");
      this.userInfo = await this.api.getSysUserInfo();
      console.log("用户信息222222222", this.userInfo);
    },
    async getReportInfo() {
      console.log("项目信息");
      wx.showLoading({
        title: '加载中···'
      });
      // you are pig
      let res=await this.api.getSysReportInfo(this.id);
      let order=await this.api.getSysReportOrderInfo(this.id);
      wx.hideLoading();
      // this.detailData = await this.api.getSysReportInfo(this.id);
      this.detailData = JSON.parse(JSON.stringify(res))
      this.commit.annotation = this.detailData.annotation;
      // console.log('报备审核111111',this.userInfo.userId ,res.groupLeaderId);
      console.log("======================", this.detailData);
      this.reportStatus = res.reportStatus;
      if (
        res.reportUserId === this.userInfo.userId ||
        (this.userInfo.extUserIds &&
          this.userInfo.extUserIds.indexOf(res.reportUserId) > -1)
      ) {
        this.addRecode = true;
        this.canEdit = true;
      } else {
        this.addRecode = false;
        this.canEdit = false;
      }
      this.resultList = res.checkResultList;
      // if(this.fromType && res.checkResultList && res.checkResultList.length>0){
      //   this.resultList = res.checkResultList
      // }else {
      //   this.resultList = []
      // }
      if (!res.reportStatus || res.reportStatus === 100) {
        this.reportResult = "待审核";
      } else {
        this.reportResult = "已审核";
      }
      if (res.reportResult) {
        this.showResult = true;
      } else {
        this.showResult = false;
      }
      this.projectName = res.projectName;
      this.relItems = res.unitList;
      // console.log('list',res.unitList);
      this.competitorItems = res.competeList;
      this.orderList=order.orderDtos;
      this.cpxList=order.maps;
      this.checkLinkList = res.checkLinkList;

      // console.log(this.checkLinkList)
      if (this.checkLinkList) {
        this.checkLinkList.forEach((item) => {
          item.reportTime = item.reportTime
            ? item.reportTime.split(" ")[0]
            : "";
          item.reportCheckTime = item.reportCheckTime
            ? item.reportCheckTime.split(" ")[0]
            : "";
        });
      }

      res.reportTime = res.reportTime.substring(0, 10);
      res.projectOpenTime = res.projectOpenTime
        ? res.projectOpenTime.substring(0, 10)
        : "";
      res.planPurchaseTime = res.planPurchaseTime
        ? res.planPurchaseTime.substring(0, 10)
        : "";
      res.bidTime = res.bidTime ? res.bidTime.substring(0, 10) : "";
      res.signDate = res.signDate ? res.signDate.substring(0, 10) : "";
      res.actualPurchaseTime = res.actualPurchaseTime
        ? res.actualPurchaseTime.substring(0, 10)
        : "";

      // 审批按钮是否显示，逻辑参考homereport
      // console.log(this.userInfo)
      // console.log(res)
      /*
      1-业务主管 2-经销商 3-业务员 4-客服 5-总经理
      经销商的类型区分属性saleType, 1-直营  2-省级  3-市级
      1、总经理可以审核除市代的全部项目
      2、业务高管可以审核所有的直营、省级及省级审核过的市级，主管自己的
      3、省级可以审核市级
      */
      if (this.userInfo.userId === res.groupLeaderId) {
        this.canAppr = true;
      }

      this.appArr.map((item) => {
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
      this.regoinList.map((item) => {
        item.value = res[item.nm] ? res[item.nm] : "";
        if (item.nm == "projectStatus") {
          switch (res[item.nm]) {
            case 1:
              item.value = "土建";
              break;
            case 2:
              item.value = "封顶";
              break;
            case 3:
              item.value = "外装";
              break;
            case 4:
              item.value = "内装";
              break;
            default:
              break;
          }
        }
        if (item.nm == "outTown") {
          item.value = res[item.nm] ? "是" : "否";
        }
        if (item.nm == "purchaseModel") {
          switch (res[item.nm]) {
            case 1:
              item.value = "甲定甲供";
              break;
            case 2:
              item.value = "甲定乙供";
              break;
            case 3:
              item.value = "乙定乙供";
              break;
            case 4:
              item.value = "乙定甲供";
              break;
            default:
              break;
          }
        }
        if (item.nm == "saleName") {
          if (item.reportUserType === 1) {
            item.value =
              item.value && item.value !== "null" ? item.value : "埃瑞德";
          } else {
            item.value = item.value && item.value !== "null" ? item.value : "";
          }
        }

        if (item.nm === "planPurchaseAmount") {
          item.value = `${item.value}万元`;
        }
      });
      this.followArr.map((item) => {
        item.value = res[item.nm] ? res[item.nm] : "";
      });
      // console.log(this.followArr)
      this.relItems.map((itemRel) => {
        this.relsArr.map((item) => {
          item.value = itemRel[item.nm];
          if (item.nm == "unitType") {
            switch (itemRel[item.nm]) {
              case 1:
                item.value = "投资方";
                break;
              case 2:
                item.value = "总包方";
                break;
              case 3:
                item.value = "空调及安装方";
                break;
              case 4:
                item.value = "监理方";
                break;
              case 5:
                item.value = "装饰设计方";
                break;
              case 6:
                item.value = "其它相关方";
                break;
              default:
                break;
            }
          }
          if (item.nm === "expectSucceedPercent") {
            item.value = `${item.value}%`;
          }
        });
        itemRel.relsArr = JSON.parse(JSON.stringify(this.relsArr));
      });

      this.competitorItems.map((itemCom) => {
        this.competitorArr.map((item) => {
          item.value = itemCom[item.nm];
        });
        itemCom.competitorArr = JSON.parse(JSON.stringify(this.competitorArr));
      });
    },
    toPage(url) {
      this.until.aHref(url);
    },
    async confirm() {
      this.showMask = false;
      console.log(this.detailData);
      this.api
        .sysReportInfoEdit({
          annotation: this.commit.annotation,
          id: this.detailData.id,
        })
        .then((res) => {
          this.getData();
        });
    },
  },
};
</script>

<style lang='less' scoped>
@import url("../../../css/common.less");
.detail {
  width: 100%;
  height: auto;
  background-color: @backgroundColor;
  color: #666;
  font-size: 26rpx;
  position: relative;
  .annotation {
    background: #e74c3c;
    color: white;
    padding: 10rpx 12rpx;
    position: absolute;
    right: 0;
    top: 200rpx;
    border-top-left-radius: 20rpx;
    border-bottom-left-radius: 20rpx;
    z-index: 100;
  }
  .tops {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    .content {
      width: 500rpx;
      height: 300rpx;
      background: #fff;
      position: absolute;
      top: 50vh;
      left: 50vw;
      transform: translate(-50%, -50%);
      .confirm {
        background: #f6a33e;
        color: white;
        width: 100rpx;
        height: 42rpx;
        line-height: 42rpx;
        margin: 100rpx auto;
        text-align: center;
      }
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
  .app,
  .regoin,
  .rel-item,
  .follow,
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
  .regoin,
  .rels,
  .follow-contain,
  .competitor-contain {
    margin-top: 20rpx;
  }
  .competitor-contain {
    /*padding-bottom: 100rpx;*/
  }
  .competitor {
    border-bottom: 1px solid @borderColor;
  }
  > div:nth-last-child(2) {
    padding-bottom: 140rpx;
  }
  .operate,
  .business,
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
      border-right: 1rpx solid @btnColor;
      background-color: #fff;
      color: #333;
      font-size: 30rpx;
      text-align: center;
    }
  }

  .business,
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
  .operate {
    button {
      background-color: @btnColor;
      color: #fff;
    }
  }
  .resultList,
  .rels,
  .follow-contain,
  .competitor-contain,
  .order-info {
    .title-info {
      background-color: #fff;
    }
  }
  .order-info {
    .order-box {
        overflow: auto hidden;
        white-space: nowrap;
        width: auto;
        background: #fff;
      .order-title,
      .order-content {
        height: 82rpx;
        line-height: 82rpx;
        
        .line1 {
          width:350rpx;
        }
        .line2 {
          width:200rpx;

        }
        .line3 {
          width:200rpx;

        }
        .line4 {
          width:130rpx;

        }
        .line5 {
          width:130rpx;

        }
        .line6 {
          width:200rpx;

        }
      }
      .order-title {
       
        .line-title {
          font-size: 24rpx;
          font-weight: 400;
          color: #909090;
          text-align: center;
          display: inline-block;
           border-bottom: 1px solid #ddd;
        border-top: 1px solid #ddd;
        }
      }
      .order-content {
        .line-content {
          font-size: 26rpx;
          font-weight: 400;
          color: #303030;
          text-align: center;
          display: inline-block;
          border-bottom: 1px solid #ddd;

        }
      }
    }
    .cpx-title {
      margin-top: 10rpx;
      color: #909090;
    }
    .cpx-title, .cpx-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 20rpx 30rpx;
      box-sizing: border-box;
      background: #fff;
      border-bottom: 1px solid #ddd;
      div {
        width: 50%;
      }
      div:last-child{
        text-align: center;
      }
    }
  }
}
</style>
