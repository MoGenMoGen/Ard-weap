<template>
  <div class="list">
    <div class="list-item" v-for="item in list" :key="item.id">
      <div class="content">
        <div>
          <span>所在区域：</span>
          <span>{{item.projectAreaName}}</span>
        </div>
        <div>
          <span>工程名称：</span>
          <span>{{item.projectName}}</span>
        </div>
        <div>
          <span>报备单位：</span>
          <span v-if="item.corpName">{{item.corpName}}</span>
        </div>
        <div>
          <span>报备时间：</span>
          <span>{{item.reportTime}}</span>
        </div>
      </div>
     <button @click="toGet(item)">抢</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  methods:{
    toGet(item){
      let that = this
      wx.showModal({
        title: "提示",
        content: "确定抢？",
        success(res) {
          if (res.confirm) {
            that.api.seaGet(item.id).then(res=>{
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              })
              that.$emit('refuse')
            })
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });

    }
  }
};
</script>

<style lang="less" scoped>
  @import url("../css/common.less");
.list {
  .list-item {
    position: relative;
    display: flex;
    display: -webkit-flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 40rpx;
    border-bottom: 1rpx solid #ddd;
    .content {
      display: flex;
      display: -webkit-flex;
      flex-flow: column wrap;
      flex: 1;
      > div {
        flex: 1;
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        align-items: center;
        > span {
          font-size: 26rpx;
          color: #666;
          &:nth-of-type(1) {
            width: 200rpx;
          }
          &:nth-last-of-type(1) {
            flex: 1;
            padding: 10rpx 0;
          }
        }
      }
    }
    >button{
      padding: 10rpx;
      border-radius: 2px;
      background-color: @btnColor;
      color: #fff;
    }
    .state {
      position: absolute;
      top: 20rpx;
      right: 40rpx;
    }
  }
  > div {
    &:nth-last-of-type(1) {
      border-bottom: 0;
    }
  }
}
</style>
