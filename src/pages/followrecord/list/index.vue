<template>
  <div class="record">
    <div class="data-list">
      <record-list :unique="unique" :list="list"></record-list>
    </div>
    <div class="operate">
      <button
        plain="true"
        @click="toPage(`../add/main?id=${form.reportId}&proNm=${projectName}`)"
      >新建跟进</button>
    </div>
    <div class="msg-show" v-if="list.length===0">暂无跟进记录信息</div>
  </div>
</template>

<script>
import recordList from "@/components/recordList";
export default {
  data() {
    return {
      item: {
        style: "上门拜访",
        content: "洽谈合作细节，准备合同内容",
        state: "意向客户",
        time: "2019-06-14",
        crtTm: "2019-05-02"
      },
      form: {
        pageSize: 5,
        pageNum: 1,
        queryType: 0,
        userId: "",
        reportId: "",
        userType: "",
        extUserIds: ""
      },
      userInfo: {},
      projectName: "",
      type: "",
      list: [],
      total: 0,
      unique: false,
      followId: "",
      extUserIds: ""
    };
  },
  onLoad(options) {
    this.projectName = options.proNm;
    this.type = options.type;
    this.unique = options.history && options !== "undefined" ? true : false;

    this.form.reportId =
      options.id && options.id !== "undefined" ? options.id : "";

    console.log(`this.form.reportId${this.form.reportId}`);
    if (this.type === "待跟进") {
      this.form.queryType = 1;
    } else if (this.type === "历史跟进") {
      this.form.queryType = 2;
    } else {
      this.form.queryType = 0;
    }

    if (this.unique) {
      this.form = {
        reportId: this.form.reportId,
        showAll: 2
      };
    }
  },
  async onShow() {
    wx.setNavigationBarTitle({
      title: this.type
    });

    this.list = [];
    await this.getUserInfo();
    await this.getList();
  },
  // 上拉加载更多
  onReachBottom() {
    if (this.total > this.form.pageNum * this.form.pageSize) {
      this.form.pageNum++;
      this.getList();
    }
  },
  onUnload() {
    this.form = {
      pageSize: 5,
      pageNum: 1,
      queryType: 0,
      userId: "",
      reportId: "",
      userType: ""
    };
  },
  methods: {
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();
      this.form.userId = this.userInfo.userId;
      this.form.userType = this.userInfo.userType;
      let extUserIds = this.userInfo.extUserIds;
      if (extUserIds) {
        this.form.extUserIds = extUserIds;
      }
    },
    async getList() {
      let res = [];
      if (this.unique) {
        //某条报备的跟进，调用另外的方法
        let result = await this.api.getSysReportFollowRecordLog(this.form);
        result.map(item => {
          res.push(item.crmReportVisitInfoVo);
        });
      } else {
        if (this.userInfo.userType === 2) {
          this.form.userId = this.userInfo.userId;
        }
        let { result, total } = await this.api.getSysFollowRecordList(
          this.form
        );
        res = result;
        this.total = total;
      }
      res.map(item => {
        item.nextVisitTime = item.nextVisitTime
          ? item.nextVisitTime.substring(0, 10)
          : "";
      });
      this.list.push(...res);
    },
    toPage(url) {
      this.until.aHref(url);
    }
  },
  components: {
    recordList
  }
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
page {
  background-color: @backgroundColor;
  .record {
    width: 100%;
    padding-bottom: 100rpx;
    .data-list {
      background-color: #fff;
    }
    .operate {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      button {
        border: 0;
        flex: 1;
        height: 100rpx;
        line-height: 2;
        padding: 20rpx 0;
        background-color: @btnColor;
        color: #fff;
        font-size: 30rpx;
        text-align: center;
      }
    }
    .msg-show {
      width: 100%;
      padding-top: 60rpx;
      text-align: center;
    }
  }
}
</style>
