<template>
  <div class="index">
    <div class="main">
      <swiper
        :indicator-dots="indicatorDots"
        :autoplay="autoplay"
        :interval="interval"
        :duration="duration"
        :style="swiperStyle"
      >
        <block v-for="(item,index) in imgUrls" :key="index">
          <swiper-item>
            <image :src="item.srcUrl" class="slide-image" mode="scaleToFill" @load="imgH" />
          </swiper-item>
        </block>
        <search-input :content="content"></search-input>
      </swiper>
      <div class="new">
        <div class="new-wrap">
          <div class="new-item" @click="toNewProReport">
            <img :src="project" mode="scaleToFill" alt />
            <text>新建工程报备</text>
          </div>
          <div class="new-item" @click="toNewHomeReport">
            <img :src="home" mode="widthFix" alt />         
            <text>新建家装报备</text>
          </div>
        </div>
      </div>
      <div class="tab-bar">
        <div class="tab-item">
          <div @click="toPage('../proreport/list/main?type=项目报备')">
            <img :src="proreport" mode="widthFix" alt />
            <text>项目报备</text>
          </div>
          <!-- 经销商不显示公海 -->
          <div @click="toPage('../opensea/main')" v-if="userInfo.userType!=2">
            <img :src="opensea" mode="widthFix" alt />
            <text>公海</text>
          </div>
          <div @click="toPage('../proreport/list/main?type=完结报备')">
            <img :src="reportsettle" mode="widthFix" alt />
            <text>完结报备</text>
          </div>
        </div>
        <div class="tab-item">
          <div @click="toPage('../followrecord/list/main?type=待跟进')">
            <img :src="pendfollow" mode="widthFix" alt />
            <text>待跟进</text>
          </div>
          <div @click="toPage('../followrecord/list/main?type=历史跟进')">
            <img :src="historyfollow" mode="widthFix" alt />
            <text>历史跟进</text>
          </div>
          <div v-if="userInfo.userType!==2" @click="toPage('../marketdev/list/main')">
            <img :src="marketdev" mode="widthFix" alt />
            <text>市场开发</text>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import home from "../../../static/images/home.png";
import project from "../../../static/images/project.png";
import proreport from "../../../static/images/proreport.png";
import opensea from "../../../static/images/opensea.png";
import reportsettle from "../../../static/images/reportsettle.png";
import pendfollow from "../../../static/images/pendfollow.png";
import historyfollow from "../../../static/images/historyfollow.png";
import marketdev from "../../../static/images/marketdev.png";
import searchInput from "@/components/searchInput";
export default {
  data() {
    return {
      home,
      project,
      proreport,
      opensea,
      reportsettle,
      pendfollow,
      marketdev,
      historyfollow,
      userInfo: {},
      imgUrls: [],
      content: "请输入订单编号查询订单"
    };
  },
  onShow() {
    var that = this;
    wx.login({
      success(res) {
        console.log(res);
        if (res.code) {
          let param = {
            code: res.code
          };

          that.api.login(param).then(res => {
            if (res.code == 400) {
              // that.until.showToast(res.msg, "none", 2000);

              wx.reLaunch({ url: `../login/index/main?msg=${res.msg}` });
            } else {
              //直接得到用户信息
              that.until.seSave("ilike-token", res.data.token);
              that.userInfo = res.data.userInfo;
              console.log(111,that.userInfo);
              that.getImgUrl();
            }
          });
        }
      }
    });
  },
  methods: {
    //获取首页轮播图
    async getImgUrl() {
      let qry = this.query.new();
      this.query.toW(qry, "cd", "bannerOfMin", "EQ");
      this.query.toO(qry, "seq", "asc");
      this.imgUrls = await this.api.banner(
        "/sys/ad/list?query=" + encodeURIComponent(this.query.toJsonStr(qry))
      );
    },
    toPage(url) {
      this.until.aHref(url);
    },
    imgH(e) {
      var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
      var imgh = e.mp.detail.height; //图片高度
      var imgw = e.mp.detail.width;
      var swiperH = winWid * imgh / imgw + "px"; //等比设置swiper的高度。  即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度    ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
      this.swiperStyle = "height:" + swiperH;
    },
    toNewProReport() {
      if (this.userInfo.userType === 4) {
        this.until.showToast("当前用户不能新增", "none", 500);
      } else {
        this.toPage("../proreport/add/main");
      }
    },
    toNewHomeReport() {
      if (this.userInfo.userType === 4) {
        this.until.showToast("当前用户不能新增", "none", 500);
      } else {
        this.toPage("../homereport/add/main");
      }
    }
  },
  components: {
    searchInput
  },
  created() {
    // let app = getApp()
  }
};
</script>

<style scoped lang="less">
@import url("../../css/common.less");
.index {
  width: 100%;
  height: 100%;
  background-color: @backgroundColor;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;

  .main {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    > p {
      text-align: center;
      padding: 10rpx 0 20rpx;
    }

    swiper {
      height: 30%;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .new {
    height: 20%;
    display: flex;
    display: -webkit-flex;
    flex-flow: column wrap;
    justify-content: center;
    .new-wrap {
      margin: 0 auto;
      width: 92%;
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      > div {
        &:nth-of-type(1) {
          background-color: #83d6ef;
        }
        &:nth-of-type(2) {
          background-color: #9894f0;
        }
      }
      .new-item {
        flex: 0 0 auto;
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        padding: 5% 40rpx;
        img {
          width: 70rpx;
          height: 70rpx;
          max-width: 70rpx;
          max-height: 70rpx;
        }
        text {
          color: #fff;
          font-size: 24rpx;
          margin-left: 30rpx;
        }
      }
    }
  }
  .tab-bar {
    height: 46%;
    display: flex;
    display: -webkit-flex;
    flex-flow: column wrap;
    background-color: #fff;
    .tab-item {
      flex: 1;
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      border-bottom: 1rpx solid #e9e9e9;
      > div {
        flex: 1;
        display: flex;
        display: -webkit-flex;
        flex-flow: column wrap;
        justify-content: space-around;
        align-items: center;
        padding: 7% 50rpx;
        border-right: 1rpx solid #e9e9e9;
        &:nth-last-of-type(1) {
          border-right: 0;
        }
        img {
          width: 78rpx;
        }
        text {
          margin-top: 10%;
          color: #666;
          font-size: 24rpx;
        }
      }
    }
  }
}
</style>
