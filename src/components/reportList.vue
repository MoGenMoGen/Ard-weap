<template>
  <div class="list">
    <div
      class="list-item"
      v-for="item in list"
      :key="item.id"
      @click="toDetail(item.id,item.reportResult,item.reportType,item.reportStatus)"
    >
      <div class="content">
        <div>
          <span>所在区域：</span>
          <span>{{item.projectAreaName ? item.projectAreaName : ''}}</span>
        </div>
        <div>
          <span>经销商名称：</span>
          <span>{{item.saleName?item.saleName:''}}</span>
        </div>
        <div>
          <span>项目负责人：</span>
          <span>{{item.projectLeader ? item.projectLeader : ''}}</span>
        </div>
        <div>
          <span>联系电话：</span>
          <span>{{item.leaderLinkPhone ? item.leaderLinkPhone : ''}}</span>
        </div>
        <div>
          <span>工程名称：</span>
          <span>{{item.projectName ? item.projectName : ''}}</span>
        </div>
        <div>
          <span>报备时间：</span>
          <span>{{item.reportTime ? item.reportTime : ''}}</span>
        </div>
        <div>
          <span>报备类型：</span>
          <span>{{item.reportType===1?'工程报备':'家装报备'}}</span>
        </div>
        <div v-if="item.annotation&&(item.reportResult==='一报'||item.reportResult==='二报' ||item.reportResult==='三报')">
          <span>批注：</span>
          <span>{{item.annotation}}</span>
        </div>

        <div class="set" v-if="userId===item.reportUserId">
          <p v-if="item.reportResult==='待提交' || item.reportResult==='待区域负责人审核'  || item.reportResult==='待审核' || item.reportResult === '待省代审核'" @click.stop="toCancel(item.id)">取消</p>
          <p
            class="active"
            v-if="item.reportResult!=='无效' && item.reportResult!=='已完结' && item.reportResult!=='提前结束'"
            @click.stop="toFinish(item.id)"
          >提前结束</p>
        </div>
      </div>
      <span class="iconfont">&#xe602;</span>
      <div
        class="state"
        :class="{'active':item.reportResult==='待审核' ||item.reportResult==='待区域负责人审核' || item.reportResult === '待省代审核','notify':item.reportResult==='一报'||item.reportResult==='二报' ||item.reportResult==='三报'}"
      >{{item.reportResult}}</div>
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
    userId: {
      type: String,
      default: ""
    }
  },
  methods: {
    toDetail(id, type, reportType, reportStatus) {
      if (reportType === 1) {
        if (reportStatus == -2) {
          this.until.aHref(`../add/main?id=${id}&reportResult=${type}`);
        } else {
          this.until.aHref(`../detail/main?id=${id}&reportResult=${type}`);
        }
      } else {
        if (reportStatus == -2) {
          this.until.aHref(
            `../../homereport/add/main?id=${id}&reportResult=${type}`
          );
        } else {
          this.until.aHref(
            `../../homereport/detail/main?id=${id}&reportResult=${type}`
          );
        }
      }
    },
    async toFinish(id) {
      let that = this;
      wx.showModal({
        title: "提示",
        content: "确定提前结束？",
        success(res) {
          if (res.confirm) {
            let param = {
              id: id,
              reportStatus: 400
            };
            that.api.sysReportInfoSave(param).then(res => {
              if (res && res.data) {
                that.$emit("set");
              }
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    async toCancel(id) {
      let param = {
        id: id,
        reportStatus: -1
      };
      let res = await this.api.sysReportInfoSave(param);
      if (res && res.data) {
        this.$emit("set");
      }
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
        line-height: 40rpx;
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
    .set {
      width: 100%;
      display: flex;
      display: -webkit-flex;
      padding-top: 10rpx;
      justify-content: center;
      p {
        width: 50%;
        text-align: center;
        border: 1px solid @borderColor;
        height: 60rpx;
        line-height: 60rpx;
        border-radius: 5rpx;
        margin-right: 10rpx;
      }
      .active {
        border: 0;
        background-color: #f6a33e;
        color: #fff;
      }
    }
    .active {
      color: #ff3d3d;
    }
    .notify {
      color: #f6a33e;
    }
  }
  > div {
    &:nth-last-of-type(1) {
      border-bottom: 0;
    }
  }
}
</style>
