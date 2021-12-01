<template>
  <div class="list">
    <div class="list-item" v-for="item in list" :key="item.id" @click="toDetail(item.id)">
      <div class="content">
        <div v-if="unique">
          <span>跟进方式：</span>
          <span>{{item.visitType}}</span>
        </div>
        <div v-else>
          <span>项目名称：</span>
          <span>{{item.projectName}}</span>
        </div>
        <div>
          <span>跟进内容：</span>
          <span>{{item.visitContent}}</span>
        </div>
        <div>
          <span>跟进状态：</span>
          <span>{{item.status}}</span>
        </div>
        <div>
          <span>下次跟进时间：</span>
          <span>{{item.nextVisitTime}}</span>
        </div>
        <div>
          <span>创建时间：</span>
          <span>{{item.crtTm ?item.crtTm:''}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: []
    },
    unique: {
      type: Boolean,
      default: false
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
  > div {
    border-bottom: 1rpx solid #ddd;
    &:nth-last-of-type(1) {
      border-bottom: 0;
    }
  }
  .list-item {
    position: relative;
    display: flex;
    display: -webkit-flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 40rpx;
    .content {
      display: flex;
      display: -webkit-flex;
      flex-flow: column wrap;
      > div {
        flex: 1;
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        align-items: center;
        height: 58rpx;
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
    .state {
      position: absolute;
      top: 20rpx;
      right: 40rpx;
    }
  }
}
</style>
