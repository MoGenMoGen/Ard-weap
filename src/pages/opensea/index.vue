<template>
  <div class="sea-list">
    <div class="header">
      <div class="search">
        <div>
          <span>联系人</span>
          <input
            type="text"
            placeholder="请输入联系人姓名"
            placeholder-style="color:#999;"
            v-model="form.projectLeader"
          />
        </div>
        <div>
          <span>联系电话</span>
          <input
            type="text"
            placeholder="请输入联系电话"
            placeholder-style="color:#999;"
            v-model="form.leaderLinkPhone"
          />
        </div>
        <div>
          <span>项目地址</span>
          <input
            type="text"
            placeholder="请输入项目地址"
            placeholder-style="color:#999;"
            v-model="form.projectAddress"
          />
        </div>
        <div>
          <span>报备时间</span>
          <picker
            mode="date"
            start="1980-01-01"
            :value="form.reportStartTime"
            @change="bindDateChange"
          >
            <view class="picker">{{form.reportStartTime?form.reportStartTime:'开始时间'}}</view>
          </picker>~
          <picker
            mode="date"
            start="1980-01-01"
            :value="form.reportEndTime"
            @change="bindDateEndChange"
          >
            <view class="picker">{{form.reportEndTime?form.reportEndTime:'结束时间'}}</view>
          </picker>
          <i class="iconfont">&#xe611;</i>
        </div>
      </div>
      <div class="operate-search">
        <button plain="true" @click="search">查询</button>
      </div>
      <div class="open-sea">
        <text>公海：</text>
        <text>{{total}}</text>
      </div>
    </div>
    <div class="data-list">
      <sea-list :list="list" @refuse="refuse"></sea-list>
    </div>
  </div>
</template>

<script>
import seaList from "@/components/seaList";
export default {
  data() {
    return {
      date: "请选择报备时间区间",
      form: {
        projectLeader: "",
        leaderLinkPhone: "",
        reportStartTime: "",
        reportEndTime: "",
        pageSize: 5,
        pageNum: 1,
        projectAddress: "" //地址
      },
      list: [],
      total: 0,
      userInfo: {}
    };
  },
  async onShow() {
    this.list = [];
    await this.getList();
  },
  onReachBottom() {
    if (this.total > this.form.pageSize * this.form.pageNum) {
      this.form.pageNum++;
      this.getList();
    }
  },
  onUnload() {
    this.form = {
      projectLeader: "",
      leaderLinkPhone: "",
      reportStartTime: "",
      reportEndTime: "",
      pageSize: 5,
      pageNum: 1,
      projectAddress: "" //地址
    };
  },
  methods: {
    refuse(){
      this.list = []
      this.form.pageNum = 1
      this.getList()
    },
    async getList() {
      let { result, total } = await this.api.getSysOpenSeaReportList(this.form);
      this.total = total;
      result.map(item => {
        item.reportTime = item.reportTime
          ? item.reportTime.substring(0, 10)
          : "";
      });
      this.list.push(...result);
    },
    bindDateChange(e) {
      this.form.reportStartTime = e.mp.detail.value;
    },
    bindDateEndChange(e) {
      this.form.reportEndTime = e.mp.detail.value;
    },
    search() {
      this.list = [];
      this.getList();
    }
  },
  components: {
    seaList
  }
};
</script>

<style lang="less" scoped>
@import url("../../css/common.less");
.sea-list {
  width: 100%;
  height: auto;
  background-color: @backgroundColor;
  .header {
    .search {
      display: flex;
      display: -webkit-flex;
      flex-flow: column wrap;
      padding-left: 40rpx;
      background-color: #fff;
      > div {
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #ddd;
        &:nth-last-of-type(1) {
          border-bottom: 0;
          picker {
            text-align: center;
          }
        }
        > span {
          width: 200rpx;
          font-size: 30rpx;
        }
        i {
          flex: 0 0 auto;
          width: 12rpx;
          margin-right: 40rpx;
        }
        picker,
        input {
          flex: 1;
          font-size: 28rpx;
        }
      }
    }
    .operate-search {
      padding: 60rpx 0;
      button {
        margin: 0 auto;
        width: 475rpx;
        height: 90rpx;
        line-height: 90rpx;
        border: 0;
        border-radius: 10rpx;
        font-size: 36rpx;
        background-color: @btnColor;
        color: #fff;
      }
    }
    .open-sea {
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      background-color: #fff;
      border-bottom: 1rpx solid #ddd;
      > text {
        padding: 20rpx 0;
        font-size: 30rpx;
        &:nth-of-type(1) {
          margin-left: 40rpx;
          width: 100rpx;
        }
        &:nth-last-of-type(1) {
          flex: 1;
          color: @btnColor;
        }
      }
    }
  }
  .data-list {
    background-color: #fff;
  }
}
</style>
