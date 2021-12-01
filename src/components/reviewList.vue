<template>
  <div class="list">
    <div class="list-item" v-for="item in list" :key="item.id">
      <!--<img :src="notPick" mode="widthFix" alt />-->
      <div class="content">
        <div>
          <span>所在区域：</span>
          <span>{{item.projectAreaName}}</span>
        </div>
        <div>
          <span>经销商名称：</span>
          <span>{{item.saleName}}</span>
        </div>
        <div>
          <span>项目负责人：</span>
          <span>{{item.projectLeader}}</span>
        </div>
        <div>
          <span>联系电话：</span>
          <span>{{item.leaderLinkPhone}}</span>
        </div>
        <div>
          <span>工程名称：</span>
          <span>{{item.projectName}}</span>
        </div>
        <div>
          <span>报备时间：</span>
          <span>{{item.reportTime}}</span>
        </div>
      </div>
      <span class="iconfont">&#xe602;</span>
      <div
        class="state"
        :class="{'active':item.reportResult==='待审核' ||item.reportResult==='待区域负责人审核','notify':item.reportResult==='一报'||item.reportResult==='二报'}"
      >
        <span v-if="showDel" class="iconfont" @click="toDelete(item)">&#xe7c6;</span>
        <span>{{item.reportResult}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import pick from "../../static/images/pick.png";
import notPick from "../../static/images/not-pick.png";
export default {
  props: {
    list: {
      type: Array,
      default: []
    },
    showDel: {
      type: Boolean,
      default: true
    },
    project: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      pick,
      notPick
    };
  },
  methods: {
    toDelete(i) {

      if (i.projectName === this.project) {
        this.until.showToast("名称相同不能删除", "none", 1000);
      } else {
        this.list = this.list.filter(item => item != i);
        this.$emit("getArray", this.list);
      }
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
      flex: 1;
      display: flex;
      display: -webkit-flex;
      flex-flow: column wrap;
      margin-left: 20rpx;
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
    .state {
      position: absolute;
      top: 20rpx;
      right: 40rpx;
      display: flex;
      display: -webkit-flex;
      flex-flow: column wrap;
      align-items: flex-end;
    }
    .active {
      color: #ff3d3d;
    }
    .notify {
      color: #f6a33e;
    }
    .iconfont {
      font-size: 28rpx;
    }
    img {
      width: 50rpx;
    }
  }
}
</style>
