<template>
  <div class="order">
    <div class="search">
      <div>
        <span class="iconfont">&#xe600;</span>
        <input v-model="key" placeholder="订单编号查询" type="text" confirm-type="搜索" @confirm="search" />
      </div>
    </div>
    <scroll-view class="menu" scroll-x="true" style=" white-space: nowrap; display: flex">
      <p
        v-for="item in menuList"
        :key="item.cd"
        :class="{active:item.cd==cd}"
        @click="cd=item.cd"
      >{{item.title}}</p>
    </scroll-view>
    <scroll-view class="list" scroll-y="ifLoad" @scrolltolower="getMore" scroll-top="100">
      <div class="content" @click="toPage(item.id)" v-for="item in list" :key="item.id">
        <div>
          <p>
            <span>订单编号：</span>
            {{item.erpCode ? item.erpCode : ''}}
          </p>
          <p>
            <span>订单交期：</span>
            {{item.delieryTime ? item.delieryTime : ''}}
          </p>
          <!--订单类型: 1-标配  2-常规 3-样品 4-项目 3-项目样品-->
          <p v-if="item.orderType==1">
            <span>订单类型：</span>标配
          </p>
          <p v-if="item.orderType==2">
            <span>订单类型：</span>常规
          </p>
          <p v-if="item.orderType==3">
            <span>订单类型：</span>样品
          </p>
          <p v-if="item.orderType==4">
            <span>订单类型：</span>项目
          </p>
          <p>
            <span>关联项目名称：</span>
            {{item.reportName ? item.reportName : ''}}
          </p>
          <p>
            <span>经销商名称：</span>
            {{item.agentName ? item.agentName :''}}
          </p>
          <p>
            <span>下单时间：</span>
            {{item.crtTm ? item.crtTm : ''}}
          </p>
        </div>
        <span class="iconfont">&#xe602;</span>
      </div>
      <p class="noData" v-if="list.length==total">数据已加载完</p>
    </scroll-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSize: 10,
      pageNum: 1,
      total: 0,
      ifLoad: true,
      list: [],
      cd: "",
      key: "",
      menuList: [
        {
          cd: "",
          title: "全部"
        },
        {
          cd: "0,60,70,80",
          title: "待审核"
        },
        {
          cd: "5,90",
          title: "待生产"
        },
        {
          cd: "10,20,30,40",
          title: "开始生产"
        },
        {
          cd: "50",
          title: "已发货"
        },
        {
          cd: "99",
          title: "已完成"
        },
        {
          cd: "-1",
          title: "已取消"
        }
      ]
    };
  },
  watch: {
    cd: function() {
      this.pageNum = 1;
      this.list = [];
      this.getList();
    }
  },
  async onShow() {
    this.list = [];
    this.pageNum = 1;
    this.userInfo = await this.api.getSysUserInfo();
    this.getList();
  },
  methods: {
    search() {
      this.pageNum = 1;
      this.list = [];
      this.getList();
    },
    getList() {
      console.dir("++++++++++++++++");
      let param = {
        erpCode: this.key,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        statusStr: this.cd
      };
      // 只有经销商的时候才传
      if (this.userInfo.userType === 2) {
        param.agentId = this.userInfo.agentInfoId;
      } else {
        param.extUserIds = this.userInfo.extUserIds;
        param.buyId = this.userInfo.userId;
      }
      this.api.orderList(param).then(res => {
        this.list.push(...res.data.result);
        this.list.forEach(item => {
          item.delieryTime = item.delieryTime.substring(0, 10);
        });
        this.total = res.data.total;
      });
    },
    getMore() {
      if (this.list.length < this.total) {
        this.pageNum++;
        this.getList();
      } else {
        this.ifLoad = false;
      }
    },
    toPage(id) {
      let url = "/pages/order/detail/main?id=" + id;
      this.until.aHref(url);
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
.order {
  width: 100%;
  height: 100%;
  display: flex;
  display: -webkit-flex;
  background: @backgroundColor;
  flex-direction: column;
  .search {
    padding: 36rpx;
    background: #ffffff;
    border-bottom: 1px solid @borderColor;
    > div {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      border: 1px solid #dddddd;
      border-radius: 41rpx;
      display: flex;
      display: -webkit-flex;
      align-items: center;
      span {
        margin-left: 35rpx;
        margin-right: 10rpx;
      }
      input {
        flex: 1;
      }
    }
  }
  .menu {
    width: 100%;
    margin-bottom: 20rpx;
    p {
      border-bottom: 1px solid @borderColor;
      height: 103rpx;
      line-height: 103rpx;
      padding: 0 30rpx;
      display: inline-block;
      font-size: 30rpx;
      background: #ffffff;
    }
    p.active {
      border-bottom: 2px solid @color;
      color: @color;
    }
  }
  .list {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    border-top: 1px solid @borderColor;
    font-size: 26rpx;
    .noData {
      text-align: center;
      padding: 30rpx 0;
    }
    .content {
      border-bottom: 1px solid @borderColor;
      background: #ffffff;
      width: 100%;
      display: flex;
      display: -webkit-flex;
      align-items: center;
      > div {
        flex: 1;
        line-height: 60rpx;
        padding: 20rpx 35rpx;
        p {
          display: flex;
          display: -webkit-flex;
          span {
            width: 190rpx;
          }
        }
      }
      > span {
        margin: 0 40rpx;
        display: inline-block;
        color: #999999;
      }
    }
  }
}
</style>
