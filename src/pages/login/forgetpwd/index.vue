<template>
  <div class="forget-pwd">
    <div class="log-cont">
      <div>
        <img :src="user" alt mode="widthFix" />
        <input type="text" placeholder="请输入手机号码" placeholder-style="color:#999;" />
      </div>
      <div>
        <img :src="code" alt mode="widthFix" />
        <input type="text" placeholder="请输入验证码" placeholder-style="color:#999;" />
        <button plain="true">发送验证码</button>
      </div>
      <div>
        <img :src="pwd" alt mode="widthFix" />
        <input type="text" placeholder="请输入密码" placeholder-style="color:#999;" />
      </div>
      <div>
        <img :src="pwd" alt mode="widthFix" />
        <input type="text" placeholder="请再次输入新密码" placeholder-style="color:#999;" />
      </div>
    </div>
    <!-- 新增 -->
    <div class="log-btn">
      <button plain="true">确认</button>
    </div>
  </div>
</template>

<script>
import user from "../../../../static/images/user.png";
import code from "../../../../static/images/code.png";
import pwd from "../../../../static/images/pwd.png";

export default {
  data() {
    return {
      user,
      code,
      pwd
    };
  }
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
.forget-pwd {
  width: 100%;
  height: 100%;
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
      margin-top: 80rpx;
      img {
        width: 34rpx;
      }
      input {
        flex: 1;
        margin-left: 20rpx;
        padding: 10rpx 0 10rpx 40rpx;
        border-bottom: 1rpx solid #dfdfdf;
      }
      button {
        position: absolute;
        right: 20rpx;
        top: 50%;
        transform: translateY(-50%);
        border: 0;
        color: #3f51b5;
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
