<template>
  <div class="order">
    <div class="status">
      <p v-if="info.status==0">订单状态：待客服评审</p>
      <p v-if="info.status==5">订单状态：已同步待生产</p>
      <p v-if="info.status==-1">订单状态：已取消！</p>
      <p v-if="info.status==-2">订单状态：客服评审未通过！</p>
      <p v-if="info.status==10">订单状态：评审通过下料中！</p>
      <p v-if="info.status==20 || info.status==30 || info.status==40">订单状态：待发货！</p>
      <p v-if="info.status==50">订单状态：待收货！</p>
      <p v-if="info.status==60">订单状态：技术评审！</p>
      <p v-if="info.status==70">订单状态：客服评审！</p>
      <p v-if="info.status==80">订单状态：生管评审！</p>
      <p v-if="info.status==90">订单状态：待同步ERP！</p>
      <p v-if="info.status==99">订单状态：已完成！</p>
      <span @click="toLogistics()" v-if="info.status==50 || info.status==99">查看物流 ></span>
    </div>
    <div class="main">
      <div class="divCommon">
        <div class="titleSpan">
          <span></span>订单信息
        </div>
        <div class="content">
          <p>
            <span>订单编号：</span>
            <span>{{info.erpCode?info.erpCode:''}}</span>
          </p>
          <!--订单类型: 1-标配  2-常规 3-样品 4-项目 3-项目样品-->
          <p v-if="info.orderType==1">
            <span>订单类型：</span>
            <span>标配</span>
          </p>
          <p v-if="info.orderType==2">
            <span>订单类型：</span>
            <span>常规</span>
          </p>
          <p v-if="info.orderType==3">
            <span>订单类型：</span>
            <span>样品</span>
          </p>
          <p v-if="info.orderType==4">
            <span>订单类型：</span>
            <span>项目</span>
          </p>
          <p>
            <span>项目报备：</span>
            <span>{{info.reportName}}项目报备</span>
          </p>
          <p>
            <span>期望交期：</span>
            <span>{{info.delieryTime}}</span>
          </p>
          <p>
            <span>是否需要logo：</span>
            <span>{{info.logoNum==0?'不需要':'需要'}}</span>
          </p>
          <p>
            <span>经销商名称：</span>
            <span>{{info.buyName}}</span>
          </p>
        </div>
      </div>
      <div class="divCommon">
        <div class="titleSpan">
          <span></span>收货地址
        </div>
        <div class="content">
          <p>
            <span>收货人：</span>
            <span>{{info.receiver}}</span>
          </p>
          <p>
            <span>所在地区：</span>
            <span>{{info.orderAreaName}}</span>
          </p>
          <p>
            <span>详细地址：</span>
            <span>{{info.receiveAddress}}</span>
          </p>
          <!--<p>-->
          <!--<span>邮编：</span>-->
          <!--</p>-->
          <p>
            <span>手机号码：</span>
            <span>{{info.receiverPhone}}</span>
          </p>
        </div>
      </div>
      <div class="divCommon">
        <div class="titleSpan">
          <span></span>物流方式
        </div>
        <!--物流费支付方式:1-到付  2-月付 3-平台垫付-->
        <p class="pCommon2" v-if="info.payLogisticsFeeType==1">
          <span>物流费用：</span>
          <span>月付</span>
        </p>
        <p class="pCommon2" v-if="info.payLogisticsFeeType==2">
          <span>物流费用：</span>
          <span>到付</span>
        </p>
        <p class="pCommon2" v-if="info.payLogisticsFeeType==3">
          <span>物流费用：</span>
          <span>平台垫付</span>
        </p>
      </div>
      <div class="divCommon">
        <div class="titleSpan">
          <span></span>订单信息
        </div>
        <div class="proList" v-for="(item,index) in info.orderItemList" :key="item.id">
          <p class="title">{{index+1}}、产品名称</p>
          <div class="content">
            <p>系列：{{item.productCatName?item.productCatName:""}}</p>
            <p>形状：{{item.productShapeName?item.productShapeName:""}}</p>
            <p v-if="item.productShapeCode==99">形状描述：{{item.shapeRemark}}</p>
            <p v-if="item.productShapeCode==99">
              形状图片：
              <span>
                <!--<img src="http://xlfile.jiaxiangtech.com/83d3c345c1f84e3ab170713e3d053efe.png"  mode="widthFix"/>-->
                <img :src="item.shapeImgUrl" mode="widthFix" />
              </span>
            </p>
            <p>功能：{{item.productFunName?item.productFunName:""}}</p>
          </div>
          <p class="title">{{index+1}}、产品参数</p>
          <div class="content">
            <p
              v-for="(vals,i) in item.productAttributeList"
              :key="vals.attributeKeyCode"
            >{{vals.attributeKeyName}}：{{vals.attributeValueName}}</p>
          </div>
          <!--产品类型:1-订单 2-艺术定制 3-专属定制 4-标准-->
          <p class="pCommon2" v-if="item.productType==1">定制类型：订单</p>
          <p class="pCommon2" v-if="item.productType==2">定制类型：艺术定制</p>
          <p class="pCommon2" v-if="item.productType==3">定制类型：专属定制</p>
          <p class="pCommon2" v-if="item.productType==4">定制类型：标准</p>
          <div class="content">
            <p>单价(元) ：{{item.productPrice?item.productPrice:0}}</p>
            <p>数量：{{item.orderNum}}</p>
            <p>金额(元)：{{item.totalPrice?item.totalPrice:0}}</p>
          </div>
          <p class="pCommon2">备注：{{item.remark}}</p>
        </div>
      </div>
      <div class="divCommon">
        <div class="content">
          <p>合计：</p>
          <p>数量：{{totalNum}}</p>
          <p>金额(元)：{{info.totalAmount?info.totalAmount:0}}</p>
        </div>
        <p class="pCommon2">备注：{{info.remark}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      info: {},
      totalNum: 0
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.getInfo();
  },
  methods: {
    async getInfo() {
      this.info = await this.api.orderDetail(this.id);
      this.totalNum = this.info.orderItemList.reduce((p, n) => {
        return p + n.orderNum;
      }, 0);

      this.info.orderItemList.forEach(item => {
        item.totalPrice = item.productPrice * item.orderNum;
      });
    },
    toLogistics() {
      let url = "/pages/order/logistics/main?id=" + this.id;
      this.until.aHref(url);
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
.order {
  width: 100%;
  height: 100%;
  display: flex;
  display: -webkit-flex;
  background: @backgroundColor;
  flex-direction: column;
  .status {
    display: flex;
    display: -webkit-flex;
    line-height: 148rpx;
    width: 100%;
    font-size: 30rpx;
    background: #ffffff;
    border-bottom: 1px solid @borderColor;
    margin-bottom: 20rpx;
    p {
      padding-left: 35rpx;
      flex: 1;
      color: #333333;
    }
    span {
      padding-right: 42rpx;
      display: inline-block;
      color: @color;
    }
  }
  .main {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .divCommon {
      width: 100%;
      background: #ffffff;
      margin-bottom: 20rpx;
      border-top: 1rpx solid @borderColor;
      font-size: 26rpx;
      .titleSpan {
        display: flex;
        display: -webkit-flex;
        align-items: center;
        height: 114rpx;
        border-bottom: 1rpx solid @borderColor;
        font-size: 30rpx;
        color: #333333;
        span {
          display: block;
          width: 10rpx;
          height: 30rpx;
          margin-left: 35rpx;
          margin-right: 18rpx;
          background: @color;
        }
      }
      .proList {
        p.title {
          height: 96rpx;
          line-height: 96rpx;
          background: @backgroundColor;
          padding-left: 35rpx;
          border-bottom: 1rpx solid @borderColor;
        }
      }
      p.pCommon2 {
        height: 108rpx;
        line-height: 108rpx;
        padding-left: 35rpx;
        border-bottom: 1rpx solid @borderColor;
      }
      .content {
        padding: 42rpx 35rpx;
        border-bottom: 1rpx solid @borderColor;
        p {
          line-height: 65rpx;
          display: flex;
          display: -webkit-flex;
          span:first-of-type {
            width: 243rpx;
            display: inline-block;
          }
          span:last-of-type {
            flex: 1;
            img {
              width: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
