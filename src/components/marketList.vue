<template>
  <div class="list">
    <div class="list-item" v-for="item in list" :key="item.id" @click="toDetail(item.id)">
      <div class="content">
        <div>
          <span>线索类型：</span>
          <span>{{item.clueType}}</span>
        </div>
        <div>
          <span>经营的品牌及品类：</span>
          <span>{{item.bussinessBrand}}</span>
        </div>
        <div>
          <span>姓名：</span>
          <span>{{item.linkMan ?item.linkMan:''}}</span>
        </div>
        <div>
          <span>联系方式：</span>
          <span>{{item.linkPhone}}</span>
        </div>
        <div>
          <span>联系地址：</span>
          <span>{{item.address}}</span>
        </div>
      </div>
      <span class="iconfont">&#xe602;</span>
      <div class="state" :class="{'active':item.hasCheck===true}">{{item.hasCheck?'已批阅':''}}</div>
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
  methods: {
    toDetail(id) {
      this.until.aHref(`../detail/main?id=${id}`);
    }
  }
};
</script>

<style lang="less" scoped>
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
      width: 670rpx;
      display: flex;
      display: -webkit-flex;
      flex-flow: column wrap;
      > div {
        width: 100%;
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        align-items: center;
        height: 58rpx;
        &:nth-last-of-type(1) {
          > span {
            &:nth-last-of-type(1) {
              width: 500rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        > span {
          font-size: 26rpx;
          color: #666;

          &:nth-last-of-type(1) {
            padding: 10rpx 0;
          }
        }
      }
    }
    .state {
      position: absolute;
      top: 20rpx;
      right: 40rpx;
    }
    .active {
      color: #f6a33e;
    }
  }
  /*> div {*/
    /*&:nth-last-of-type(1) {*/
      /*border-bottom: 0;*/
    /*}*/
  /*}*/
}
</style>
