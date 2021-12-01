<template>
  <div class="edit-info">
    <div class="content">
      <!-- 头像 -->
      <div class="avatar">
        <text>头像：</text>
        <img :src="info.imgUrl" mode="widthFix" alt />
        <span class="iconfont">&#xe602;</span>
      </div>
      <div>
        <text>手机号码：</text>
        <input type="text" v-model="info.phone" />
      </div>
      <div>
        <text>经销商名称：</text>
        <input type="text" v-model="info.saleNm" />
      </div>
      <div>
        <text>联系地址：</text>
        <input type="text" v-model="info.linkedAddr" />
      </div>
      <div>
        <text>联系人：</text>
        <input type="text" v-model="info.linkedNm" />
      </div>
      <div>
        <text>联系电话：</text>
        <input type="text" v-model="info.linkedPhone" />
      </div>
    </div>
    <div class="operate">
      <button plain="true">保存</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {
        imgUrl: `https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL4oRB8DlAKZZUr4Q7qTn2W9WQPcIwMULSIWtBnlwwLsj40QWyGrEibX51CYgSpyYapYYE3w4zcDWg/132`,
        phone: "15547865421",
        saleNm: "宁波聚联科技有限公司",
        linkedAddr: "宁波 镇海 329创业社区 212室",
        linkedNm: "金先生",
        linkedPhone: "15547865421"
      }
    };
  }
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
.edit-info {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: @backgroundColor;
  .content {
    padding-left: 60rpx;
    width: 690rpx;
    display: flex;
    display: -webkit-flex;
    flex-flow: column wrap;
    align-items: center;
    font-size: 30rpx;
    color: #666;
    background-color: #fff;
    .avatar {
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      align-items: center;
      text {
        flex: 1;
      }
      img {
        flex: 0 0 auto;
        margin-right: 20rpx;
        width: 88rpx;
        border: 0;
        border-radius: 100%;
      }
      span {
        margin-right: 30rpx;
      }
    }
    > div {
      display: flex;
      display: -webkit-flex;
      padding: 30rpx 0;
      width: 100%;
      border-bottom: 1rpx solid #ddd;
      &:nth-last-of-type(1) {
        border-bottom: 0;
      }
      text {
        width: 240rpx;
      }
      input {
        flex: 1;
        color: #999;
      }
    }
  }
}
</style>
