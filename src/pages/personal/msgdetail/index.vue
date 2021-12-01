<template>
  <div class="msg-detail">
    <div class="content">
      <div class="title">{{msg.title}}</div>
      <rich-text :nodes="msg.content"></rich-text>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      msg: {},
      userInfo: {},
      content: `您的信息已更新您的信息已更新您的信息已更新您的信息已
更新您的信息已更新您的信息已更新您的信息已更新您的信息已
更新您的信息已更新您的信息已更新您的信息已更新您的信息已
更新您的信息已更新`
    };
  },
  onLoad(options) {
    this.id = options.id;
    console.log(this.id)
  },
  async onShow() {
    await this.getUserInfo();
    await this.getMsgInfo();
  },
  methods: {
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();
    },
    async getMsgInfo() {
      this.msg = await this.api.getSysMsgInfo(this.id, this.userInfo.userId);
    }
  }
};
</script>

<style lang='less' scoped>
@import url("../../../css/common.less");
.msg-detail {
  width: 100%;
  height: 100%;
  background-color: @backgroundColor;
  .content {
    background-color: #fff;
    width: 690rpx;
    padding: 0 30rpx 60rpx;
    .title {
      text-align: center;
      font-size: 30rpx;
      padding: 40rpx 0 20rpx;
      color: #333;
    }
  }
}
</style>
