<template>
  <div class="list">
    <div
      class="list-item"
      v-for="item in list"
      :key="item.id"
      @click="toPage(item.id)"
    >
      <div class="content">
        <div>
          <span>{{ item.name }}</span>
          <span v-if="item.type == 1">（直营）</span>
          <span v-if="item.type == 2">（省代）</span>
          <span v-if="item.type == 3">（市代）</span>
        </div>
        <div>
          <span>{{ item.linkMan ? item.linkMan : "" }}</span>
          <span>{{ item.linkPhone ? item.linkPhone : "" }}</span>
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
    }
  },
  methods: {
    toPage(id) {
      this.until.aHref(`../agentDetail/main?id=${id}`);
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
          margin-right: 15rpx;
        }
      }
    }
    .state {
      position: absolute;
      top: 20rpx;
      right: 40rpx;
    }
    .active {
      color: #ff3d3d;
    }
    .notify {
      color: #f6a33e;
    }
  }
}
</style>
