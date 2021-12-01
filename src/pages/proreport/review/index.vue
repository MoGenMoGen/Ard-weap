<template>
  <div class="review">
    <div class="review-list">
      <review-list :list="listSignal" :showDel="false" :project="projectName"></review-list>
      <div class="title-info">
        <span></span>
        <span>相关报备信息</span>
      </div>
      <review-list :list="list" @getArray="getRemain" :project="projectName"></review-list>
    </div>
    <div class="operate" v-if="showBtn">
      <button plain="true" @click="diabledApprove">不通过</button>
      <button plain="true" @click="approve">通过</button>
    </div>
    <jlink-dialog :visible="visible" :title="title" @close="closeDialog"></jlink-dialog>
    <jlink-operate :visible="visibleOperate" :title="titleOperate" @close="closeDialogOperate"></jlink-operate>
  </div>
</template>

<script>
import reviewList from "@/components/reviewList";
import jlinkDialog from "@/components/jlinkDialog";
import jlinkOperate from "@/components/jlinkOperate";
export default {
  data() {
    return {
      id: "",
      visible: false,
      visibleOperate:false,
      showBtn: true,
      title: "选择报备结果",
      titleOperate:'无效报备提示',
      userInfo: {},
      projectName: "",
      list: [],
      listSignal: [],
      search: {
        projectLeader: "",
        leaderLinkPhone: "",
        isShare: "0"
      },
      apprParam: {
        id: "",
        reportChecker: "",
        checkView: "",
        ids: "",
        reportResult: "",
        userId: "",
        userType: "1",
        saleType: ""
      }
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.apprParam.id = options.id;
    console.log("reportId" + this.id);
  },
  async onShow() {
    this.showBtn = true
    this.list = [];
    this.listSignal = [];
    await this.getUserInfo();
    await this.getListSignal();
    await this.getList();
  },
  methods: {
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();
      if (this.userInfo) {
        this.apprParam.reportChecker = this.userInfo.realName;
        this.apprParam.userId = this.userInfo.userId;
        this.apprParam.userType = this.userInfo.userType;
        this.apprParam.saleType =
          this.userInfo.saleType && this.userInfo.saleType !== "null"
            ? this.userInfo.saleType
            : "";
      }
    },
    async getListSignal() {
      let res = await this.api.getSysReportInfo(this.id);

      this.search.projectLeader = res.projectLeader;
      this.search.leaderLinkPhone = res.leaderLinkPhone;
      this.projectName = res.projectName;

      this.listSignal.push(res);
      this.listSignal = this.interatorList(this.listSignal);
    },
    async getList() {
      let res = await this.api.getSysRelatedReportList(this.search);
      let arr = this.interatorList(res);
      this.list.push(...arr);
      this.list = this.list.filter(item => item.id != this.id  && item.reportStatus>=0 && !item.share);
      this.getRemain(this.list);
    },
    interatorList(res) {
      res.map(item => {
        switch (item.reportResult) {
          case null:
            item.reportResult = "待审核";
            break;
          case 1:
            item.reportResult = "一报";
            break;
          case 2:
            item.reportResult = "二报";
            break;
          case 3:
            item.reportResult = "三报";
            break;
          default:
            item.reportResult = "无效";
            break;
        }
        if(item.reportStatus==-2){
          item.reportResult = "待提交";
        }
        if(item.reportStatus==-1){
          item.reportResult = "无效";
        }
        if(item.reportStatus==300){
          item.reportResult = "已完结";
        }
        if(item.reportStatus==400){
          item.reportResult = "提前结束";
        }
        item.reportTime = item.reportTime
          ? item.reportTime.substring(0, 10)
          : "";
      });
      return res;
    },
    diabledApprove() {
      this.visibleOperate = true;
      console.log(this.visibleOperate)
      this.showBtn = false;
      this.apprParam.checkView = 0;
      // this.getSysApprove();
    },
    approve() {
      this.visible = true;
      this.showBtn = false;
      this.apprParam.checkView = 1;
      // this.getSysApprove();
    },
    closeDialog(param) {
      //判断type
      this.visible = false;
      this.showBtn = true;
      if (param.type === "confirm") {
        //提交报备结果
        this.apprParam.reportResult = param.reportResult;
        this.apprParam.checkRemark = ''
        // console.log(this.apprParam)
        this.getSysApprove();
      }
    },
     closeDialogOperate(param) {
      //判断type
      this.visibleOperate = false;
      this.showBtn = true;

      if (param.type === "confirm") {
        //提交报备结果
        this.apprParam.reportResult = param.reportResult;
        this.apprParam.checkRemark = param.checkRemark;
        this.getSysApprove();
      }
    },
    getRemain(list) {
      this.list = list;
      let arr = [];
      this.list.map(item => {
        arr.push(item.id);
      });
      this.apprParam.ids = arr.join(",");
    },
    async getSysApprove() {
      let res = await this.api.getSysReportApproveBack(this.apprParam);
      if (res.code === 0) {
        //跳转到跟进页面
        if (this.apprParam.checkView === 1) {
          this.until.showToast("审批通过", "success", 400);
        } else {
          this.until.showToast("审批不通过", "success", 400);
        }
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      }
    }
  },
  components: {
    reviewList,
    jlinkDialog,
    jlinkOperate
  }
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
.review {
  .review-list {
    padding-bottom: 110rpx;
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
      flex: 1;
      border: 0;
      height: 100rpx;
      line-height: 2;
      padding: 20rpx 0;
      background-color: @btnColor;
      color: #fff;
      font-size: 30rpx;
      text-align: center;
      &:nth-of-type(1) {
        border-top: 1rpx solid @btnColor;
        background-color: #fff;
        color: #333;
      }
    }
  }
}
</style>
