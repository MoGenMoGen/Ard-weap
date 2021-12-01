<template>
  <div class="info">
    <!-- 头像 -->
    <div class="avatar">
      <img :src="userInfo.imgUrl" alt />
    </div>
    <div class="content">
       <div>
        <text>登录账号：</text>
        <span>{{userInfo.username}}</span>
      </div>
      <div>
        <text>手机号码：</text>
        <span>{{userInfo.phone?userInfo.phone:''}}</span>
      </div>
      <div>
        <text>经销商名称：</text>
        <span>{{userInfo.agentInfoName}}</span>
      </div>
         <div>
        <text>单位名称：</text>
        <span>{{userInfo.corpName}}</span>
      </div>
      <div>
        <text>联系地址：</text>
        <span>{{userInfo.regionName}}</span>
      </div>
      <div>
        <text>联系人：</text>
        <span>{{userInfo.linkMan}}</span>
      </div>
      <div>
        <text>联系电话：</text>
        <span>{{userInfo.linkPhone}}</span>
      </div>
      <div>
        <text>负责区域：</text>
        <span>{{userInfo.regionName}}</span>
      </div>
    </div>

    <!-- 用户是后端分配，不应该在前端随意修改 -->
    <!-- <div class="operate">
      <button plain="true" @click="toEdit">编辑资料</button>
    </div>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {}
    };
  },
  onShow() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();

      this.userInfo.regionName = this.userInfo.regionName
        ? this.userInfo.regionName
        : "";
      this.userInfo.agentInfoName = this.userInfo.agentInfoName
        ? this.userInfo.agentInfoName
        : "";
    },
    toEdit() {
      this.until.aHref("../editinfo/main");
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
.info {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .avatar {
    padding-top:80rpx;
    width: 100%;
    text-align: center;
    img {
      width: 136rpx;
      height: 136rpx;
      border: 0;
      border-radius: 100%;
    }
  }
  .content {
    margin-left: 80rpx;
    display: flex;
    display: -webkit-flex;
    flex-flow: column wrap;
    align-items: center;
    font-size: 30rpx;
    color: #666;
    > div {
      display: flex;
      display: -webkit-flex;
      margin-top: 60rpx;
      width: 100%;
      text {
        width: 240rpx;
      }
      span {
        flex: 1;
      }
    }
  }
}
</style>
