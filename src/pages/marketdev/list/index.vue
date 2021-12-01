<template>
  <div class="market">
    <div class="header">
      <div class="search">
        <div>
          <span>联系人</span>
          <input
            type="text"
            v-model="search.linkMan"
            placeholder="请输入联系人姓名"
            placeholder-style="color:#999;"
          />
        </div>
        <div>
          <span>联系电话</span>
          <input
            type="number"
            maxlength="11"
            v-model="search.linkPhone"
            placeholder="请输入联系电话"
            placeholder-style="color:#999;"
          />
        </div>
        <div>
          <span>经营城市</span>
          <input
            type="text"
            v-model="search.areaName"
            placeholder="请输入项目地址"
            placeholder-style="color:#999;"
          />
        </div>
        <div>
          <span>申请时间</span>
          <picker
            mode="date"
            start="1980-01-01"
            :value="search.queryStartTime"
            @change="bindDateChange"
          >
            <view class="picker">{{search.queryStartTime?search.queryStartTime:'开始时间'}}</view>
          </picker>~
          <picker
            mode="date"
            start="1980-01-01"
            :value="search.queryEndTime"
            @change="bindDateEndChange"
          >
            <view class="picker">{{search.queryEndTime?search.queryEndTime:'结束时间'}}</view>
          </picker>
          <i class="iconfont">&#xe611;</i>
        </div>
      </div>
      <div class="operate-search">
        <button plain="true" @click="toSearch">查询</button>
      </div>
    </div>
    <div class="data-list">
      <market-list :list="list"></market-list>
      <p class="noData" v-if="list.length==total">数据已加载完</p>
    </div>
    <div class="operate">
      <button plain="true" @click="toPage('../add/main')">新建市场开发</button>
    </div>
  </div>
</template>

<script>
import marketList from "@/components/marketList";
export default {
  data() {
    return {
      list: [],
      total: 0,
      userInfo: {},
      search: {
        pageNum: 1,
        pageSize: 5,
        linkMan: "",
        linkPhone: "",
        areaName: "",
        queryStartTime: "",
        queryEndTime: "",
        userId: "", //创建人
        extUserIds: ""
      }
    };
  },
  async onShow() {
    this.search.pageNum = 1;
    this.list = [];
    await this.getUserInfo();
    await this.getList();
  },
  onReachBottom() {
    if (this.total > this.search.pageNum * this.search.pageSize) {
      this.search.pageNum++;
      this.getList();
    }
  },
  onUnload() {
    this.search = {
      linkMan: "",
      linkPhone: "",
      areaName: "",
      queryStartTime: "",
      queryEndTime: "",
      userId: "",
      pageNum: 1,
      pageSize: 5,
      extUserIds: ""
    };
  },
  methods: {
    bindDateChange(e) {
      this.search.queryStartTime = e.mp.detail.value;
    },
    bindDateEndChange(e) {
      this.search.queryEndTime = e.mp.detail.value;
    },
    toSearch() {
      this.search.pageNum = 1;
      this.list = [];
      this.getList();
    },
    async getList() {
      let { result, total } = await this.api.getSysMarketDevListByPage(
        this.search
      );
      this.total = total;
      result.map(item => {
        item.clueType = item.clueType === 1 ? "A 类 优质资源" : "B类 一般资源";
      });
      this.list.push(...result);
    },
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();
      this.search.userId = this.userInfo.userId;
      this.search.userType = this.userInfo.userType;
      let extUserIds = this.userInfo.extUserIds;
      if (extUserIds) {
        this.search.extUserIds = extUserIds;
      }
    },
    toPage(url) {
      this.until.aHref(url);
    }
  },
  components: {
    marketList
  }
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
@import url("../../../css/common.css");
.market {
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
        picker,
        input {
          flex: 1;
          font-size: 28rpx;
        }
        picker {
          position: relative;
          span {
            position: absolute;
            right: 40rpx;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        i {
          margin-right: 20rpx;
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
  }
  .data-list {
    background-color: #fff;
    padding-bottom: 100rpx;
  }
}
</style>
