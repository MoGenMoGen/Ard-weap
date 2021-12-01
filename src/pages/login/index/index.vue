<template>
  <div class="login">
    <div class="logo">
      <img :src="eredLogo" alt mode="widthFix" />
      <div>埃瑞德销售系统</div>
    </div>
    <div class="log-cont">
      <div>
        <img :src="user" alt mode="widthFix" />
        <input
          type="text"
          placeholder="请输入手机号码"
          @input="changeUser"
          placeholder-style="color:#999;"
        />
      </div>
      <div>
        <img :src="pwd" alt mode="widthFix" />
        <input
          type="password"
          placeholder="请输入密码"
          @input="changePwd"
          placeholder-style="color:#999;"
        />
        <!-- <button plain="true" @click="toPage('../forgetpwd/main')">忘记密码？</button> -->
      </div>
    </div>
    <div class="log-btn">
      <button plain="true" @click="confirm">确认</button>
    </div>
  </div>
</template>

<script>
import eredLogo from "../../../../static/images/ered-logo.png";
import user from "../../../../static/images/user.png";
import pwd from "../../../../static/images/pwd.png";

export default {
  data() {
    return {
      eredLogo,
      user,
      pwd,
      code: "",
      msg: "",
      form: {
        username: "",
        password: "",
        code: ""
      }
    };
  },
  onLoad(options) {
    this.msg = options.msg && options.msg !== "undefined" ? options.msg : "";
  },
  onShow() {
    if (this.msg) {
      this.until.showToast(this.msg, "none", 2000);
    }
  },
  methods: {
    toPage(url) {
      this.until.aHref(url);
    },

    changeUser(e) {
      this.form.username = this.until.trimStr(e.mp.detail.value);
    },
    changePwd(e) {
      this.form.password = this.until.trimStr(e.mp.detail.value);
    },
    confirm() {
      var that = this;
      wx.login({
        success(res) {
          if (res.code) {
            that.form.code = res.code;
            //验证是否为空
            if (!that.form.username && !that.form.password) {
              that.until.showToast("用户名密码必填", "none", 2000);
              return;
            } else if (!that.form.username) {
              that.until.showToast("用户名必填", "none", 2000);
              return;
            } else if (!that.form.password) {
              that.until.showToast("密码必填", "none", 2000);
              return;
            }

            that.api.bindUser(that.form).then(res => {
              if (res) {
                that.until.seSave("ilike-token", res.token);
                that.until.seSave("userInfo", res.userInfo);
                if (res.userInfo.imgUrl) {
                  that.until.seSave("imgUrl", res.userInfo.imgUrl);
                }
                that.until.showToast("登录成功", "success", 400);
                setTimeout(() => {
                  if (res.userInfo.loginTotal === 0) {
                    wx.navigateTo({ url: "../changepwd/main" });
                  } else {
                    wx.switchTab({ url: "../../index/main" });
                  }
                }, 1000);
              }
            });
          }
        }
      });
    }
  },
  onUnload() {
    this.form = {};
  }
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
.login {
  .logo {
    width: 340rpx;
    padding: 160rpx 0;
    margin: 0 auto;
    display: flex;
    display: -webkit-flex;
    flex-flow: column wrap;
    align-items: center;
    img {
      width: 304rpx;
    }
    div {
      flex: 1;
      margin-top: 30rpx;
      font-size: 36rpx;
      color: #333;
    }
  }
  .log-cont {
    padding: 0 100rpx;
    display: flex;
    display: -webkit-flex;
    flex-flow: column wrap;
    > div {
      position: relative;
      flex: 1;
      display: flex;
      display: -webkit-flex;
      align-items: center;
      &:nth-last-of-type(1) {
        margin-top: 60rpx;
      }
      img {
        width: 34rpx;
      }
      input {
        flex: 1;
        margin-left: 20rpx;
        padding: 10rpx 0;
        border-bottom: 1rpx solid #dfdfdf;
      }
      button {
        border: 0;
        position: absolute;
        right: 40rpx;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .log-btn {
    width: 566rpx;
    margin: 160rpx auto 0;
    button {
      height: 90rpx;
      line-height: 90rpx;
      border: 0;
      border-radius: 12rpx;
      background-color: @btnColor;
      color: #fff;
      font-size: 36rpx;
    }
  }
}
</style>
