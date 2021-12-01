<template>
  <div class="linked">
    <div class="header">
      <div class="search">
        <div>
          <span>姓名</span>
          <input
            type="text"
            v-model="search.name"
            placeholder="请输入查询姓名"
            placeholder-style="color:#999;"
          />
        </div>
        <div>
          <span>电话</span>
          <input
            type="text"
            v-model="search.linkPhone"
            placeholder="请输入联系电话"
            placeholder-style="color:#999;"
          />
        </div>
        <div>
          <span>地区</span>
          <input
            type="text"
            v-model="search.unitAreaName"
            placeholder="请输入查询地区"
            placeholder-style="color:#999;"
          />
        </div>
      </div>
      <div class="operate-search">
        <button plain="true" @click="toSearch">查询</button>
      </div>
      <div class="open-sea">
        <text>联系人数量：</text>
        <text>{{total}}</text>
      </div>
    </div>
    <div class="data-list">
      <linked-list :list="list"></linked-list>
    </div>
    <div class="operate">
      <button plain="true" @click="toAdd">新建联系人</button>
    </div>
  </div>
</template>

<script>
import linkedList from "@/components/linkedList";
export default {
  data() {
    return {
      date: "请选择报备时间区间",
      form: {
        bankNm: ""
      },
      list: [],
      total: 0,
      userInfo: {},
      search: {
        pageSize: 5,
        pageNum: 1,
        name: "",
        linkPhone: "",
        unitAreaName: "",
        devUserId: "",
        devUserName: "",
        extUserIds:""
      },
      item: {
        nm: "黄晓燕",
        phone: "13265415879",
        company: "新航道有限公司"
      },
      selectTab: "全部",
      tabList: ["全部", "待审核", "已审核", "无效"]
    };
  },
  async onShow() {
    this.list = [];
    this.search.pageNum = 1
    await this.getUserInfo();
    await this.getList();
  },
  onReachBottom() {
    if (this.total > this.search.pageSize * this.search.pageNum) {
      this.search.pageNum++;
      this.getList();
    }
  },
  onUnload() {
    this.search = {
      name: "",
      linkPhone: "",
      unitAreaName: "",
      devUserId: "",
      devUserName: "",
      extUserIds:""
    };
  },
  methods: {
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();
      this.search.devUserId = this.userInfo.userId;
      this.search.devUserName = this.userInfo.realName;
      this.search.extUserIds = this.userInfo.extUserIds
    },
    async getList() {
      let { result, total } = await this.api.getSysCustomer(this.search);
      this.total = total;
      this.list.push(...result);
    },
    toAdd() {
      this.until.aHref("../linkedadd/main?type=add");
    },
    toSearch() {
      this.search.pageNum = 1
      this.list = [];
      this.getList();
    }
  },
  components: {
    linkedList
  }
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
.linked {
  width: 100%;
  padding-bottom: 100rpx;
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
          width: 200rpx;
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
