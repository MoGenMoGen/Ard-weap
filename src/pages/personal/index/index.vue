<template>
  <div class="person">
    <div class="top">
      <div class="info" @click="toPage('/pages/personal/info/main')">
        <button v-if="!userInfo.imgUrl" @click.stop="upload">头像上传</button>
        <img v-else :src="userInfo.imgUrl" mode="aspectFill" />
        <p>
          <b>姓名：{{userInfo.realName}}</b>
          手机号：{{userInfo.username}}
        </p>
        <span class="iconfont">&#xe602;</span>
      </div>
      <!-- 未授权 -->
      <!-- <div v-else class="operate-login"> -->
      <!-- 授权按钮 -->
      <!-- <button class="btn" plain="true" open-type="getUserInfo" @getuserinfo="loginBtnClick">微信登录</button> -->
      <!-- <button @click="upload">头像上传</button>
      </div>-->
    </div>
    <div class="deadline" v-if="userInfo.userType===2">协议到期日：{{userInfo.validTime}}</div>

    <div class="menuList">
      <div v-for="(item,index) in menuList1" :key="index" @click="toPage(item.aHref)">
        <img :src="item.imgUrl" mode="aspectFit" />
        <p>{{item.title}}</p>
        <span class="iconfont">&#xe602;</span>
      </div>
    </div>
    <div class="menuList">
      <div v-for="(item,index) in menuList2" :key="index" @click="toPage(item.aHref)">
        <img :src="item.imgUrl" mode="aspectFit" />
        <p>{{item.title}}</p>
        <span class="iconfont">&#xe602;</span>
      </div>
    </div>
    <div class="menuList">
      <div v-for="(item,index) in menuList3" :key="index" @click="toPage(item.aHref)">
        <img :src="item.imgUrl" mode="aspectFit" />
        <p>{{item.title}}</p>
        <span class="iconfont">&#xe602;</span>
      </div>
    </div>
    <div class="operate-search">
      <button plain="true" @click="loginOut">退出</button>
    </div>
  </div>
</template>

<script>
import msg from "../../../../static/images/msg.png";
import linked from "../../../../static/images/linked.png";
import order from "../../../../static/images/order.png";
import pay from "../../../../static/images/pay.png";
import changepwd from "../../../../static/images/changepwd.png";
import agent from "../../../../static/images/myAgent.png";
import bb from "../../../../static/images/myBB.png";
export default {
  name: "个人中心",
  data() {
    return {
      userId: "",
      msg,
      linked,
      order,
      pay,
      changepwd,
      userInfo: {},
      imgUrl: "",
      isAuth: false,
      menuList1: [
        {
          title: "我的消息",
          imgUrl: msg,
          aHref: "../msg/main"
        },
        {
          title: "我的联系人",
          imgUrl: linked,
          aHref: "../linked/main"
        },
        {
          title: "我的经销商",
          imgUrl: agent,
          aHref: "../agentList/main"
        },
        {
          title: "我的报备",
          imgUrl: bb,
          aHref: "/pages/proreport/list/main?type=项目报备&types=self"
        }
      ],
      menuList2: [
        {
          title: "我的订单",
          imgUrl: order,
          aHref: "../../order/list/main"
        },
        {
          title: "付款情况",
          imgUrl: pay,
          aHref: "../payStatus/main"
        }
      ],
      menuList3: [
        {
          title: "修改密码",
          imgUrl: changepwd,
          aHref: "../../login/changepwd/main"
        }
      ]
    };
  },
  async onShow() {
    await this.getUserInfo();
  },
  components: {},
  methods: {
    async upload() {
      const imgUrl = await this.api.chooseImages();
      const img = await this.api.upLoad(imgUrl);

      this.userInfo.imgUrl = img;
      let param = {
        id: this.userInfo.userId,
        imgUrl: img
      };
      //后台保存
      this.api.sysUserInfoAvatarUrlSave(param);
    },
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();
      if (this.userInfo.imgUrl) {
        this.isAuth = true;
      } else {
        this.isAuth = false;
      }

      if (
        (this.userInfo.userType === 2 &&
          (this.userInfo.saleType === 3 || this.userInfo.saleType === 1)) ||
        this.userInfo.saleType === 4
      ) {
        this.menuList1 = [
          {
            title: "我的消息",
            imgUrl: msg,
            aHref: "../msg/main"
          },
          {
            title: "我的联系人",
            imgUrl: linked,
            aHref: "../linked/main"
          },
          {
            title: "我的报备",
            imgUrl: bb,
            aHref: "/pages/proreport/list/main?type=项目报备&types=self"
          }
        ];
      } else {
        this.menuList1 = [
          {
            title: "我的消息",
            imgUrl: msg,
            aHref: "../msg/main"
          },
          {
            title: "我的联系人",
            imgUrl: linked,
            aHref: "../linked/main"
          },
          {
            title: "我的经销商",
            imgUrl: agent,
            aHref: "../agentList/main"
          },
          {
            title: "我的报备",
            imgUrl: bb,
            aHref: "/pages/proreport/list/main?type=项目报备&types=self"
          }
        ];
      }
    },
    toPage(url) {
      this.until.aHref(url);
    },
    loginOut() {
      this.api.sysLoginOut();
      this.until.seClear();

    },
    loginBtnClick(e) {
      var that = this;
      wx.getUserInfo({
        success: res => {
          console.dir(res);
          this.isAuth = true;
          that.userInfo.imgUrl = res.userInfo.avatarUrl;
          let param = {
            id: that.userInfo.userId,
            imgUrl: res.userInfo.avatarUrl
          };
          //后台保存
          that.api.sysUserInfoAvatarUrlSave(param);
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
@import url("../../../css/common.less");
.person {
  width: 100%;
  background-color: @backgroundColor;
  .top {
    width: 100%;
    padding: 44rpx 0;
    background-color: #fff;
    .info {
      display: flex;
      display: -webkit-flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      p {
        width: 60%;
        color: #666;
        font-size: 30rpx;
        line-height: 60rpx;
      }
      button {
        margin-left: 4%;
        padding:0 10rpx;
        width: 140rpx;
        background-color: @btnColor;
        line-height: 56rpx;
        color: #fff;
        text-align: center;
        border-radius: 10rpx;
      }
      img {
        margin-left: 25rpx;
        margin-right: 20rpx;
        width: 136rpx;
        height: 136rpx;
        border-radius: 100%;
        border: 3px solid transparent;
        border-color: transparent;
        border-color: rgba(255, 255, 255, 0.3);
      }
      span {
        margin-right: 40rpx;
      }
    }
  }
  .deadline {
    background-color: #f49e36;
    text-align: center;
    padding: 10rpx 0;
    color: #fff;
  }

  .menuList {
    margin-top: 20rpx;
    width: 100%;
    background-color: #fff;
    div {
      margin-left: 27rpx;
      border-bottom: 1rpx solid #ddd;
      display: flex;
      display: -webkit-flex;
      height: 110rpx;
      color: #555555;
      font-size: 26rpx;
      align-items: center;
      img {
        width: 40rpx;
        height: 40rpx;
        margin-right: 24rpx;
      }
      p {
        flex: 1;
      }
      span {
        color: #999;
        margin-right: 40rpx;
      }
      &:last-of-type {
        border-bottom: 0;
      }
    }
  }
  .operate-search,
  .operate-login {
    padding: 60rpx 0;
    button {
      margin: 0 auto;
      width: 475rpx;
      height: 90rpx;
      line-height: 90rpx;
      border: 0;
      border-radius: 10rpx;
      font-size: 30rpx;
      background-color: #fff;
      color: #999;
    }
  }
  .operate-login {
    padding: 0;
    button {
      background-color: @btnColor;
      color: #fff;
    }
  }
}
</style>
