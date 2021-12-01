<template>
  <div class="record">
    <div class="data-list">
      <record-list :unique="unique" :list="list"></record-list>
    </div>
    <div class="operate" v-if="addRecord">
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
      form: {
        reportId: "",
        pageSize: 5,
        pageNum: 1
      },
      userInfo: {},
      projectName: "",
      type: 2,
      list: [],
      total: 0,
      unique: true,
      followId: "",
      addRecord: false
    };
  },
  onLoad(options) {
    this.projectName = options.proNm;
    this.addRecord =
      options.canClick === "false" || options.canClick === "undefined"
        ? false
        : true;
    this.form.reportId =
      options.id && options.id !== "undefined" ? options.id : "";
    console.log(`this.form.reportId${this.form.reportId},${this.addRecord}`);
  },
  async onShow() {
    this.list = [];
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
    this.formpageSize = 5;
    this.formpageNum = 1;
  },
  methods: {
    async getList() {
      //某条报备的跟进，调用另外的方法
      let { result } = await this.api.getSysFollowRecordList(this.form);

      result.map(item => {
       
        item.nextVisitTime = item.nextVisitTime
          ? item.nextVisitTime.substring(0, 10)
          : "";
      });
      this.list.push(...result);
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
