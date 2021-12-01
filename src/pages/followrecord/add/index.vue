<template>
  <div class="home-report">
    <div class="search">
      <!--  -->
      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>项目名称：</text>
        <picker
          @change="changePro"
          :range="proList"
          range-key="projectNameAndAreaName"
          :disabled="canPick"
        >
          <view
            class="picker"
          >{{form.projectName && form.projectName!=='undefined'?form.projectName:'请选择项目名称'}}</view>
          <span class="iconfont">&#xe60f;</span>
        </picker>
      </div>
      <div>
        <text>跟进方式：</text>
        <picker @change="changeFollowStyle" :range="followStyleList" range-key="nm">
          <view class="picker">{{form.visitType?form.visitType:'请选择跟进方式'}}</view>
          <span class="iconfont">&#xe60f;</span>
        </picker>
      </div>

      <div>
        <text>跟进内容：</text>
        <input
          type="text"
          placeholder="请输入跟进内容"
          placeholder-style="color:#999;"
          @input="triggeInput"
        />
      </div>
      <div>
        <text>跟进状态：</text>
        <picker @change="changeStatus" :range="statusList" range-key="nm">
          <view class="picker">{{form.status?form.status:'请选择跟进状态'}}</view>
          <span class="iconfont">&#xe60f;</span>
        </picker>
      </div>

      <div>
        <text>下次跟进时间：</text>
        <picker mode="date" start="1980-01-01" :value="date" @change="bindDateChange">
          <view class="picker">{{form.nextVisitTime?form.nextVisitTime:'请选择时间'}}</view>
          <span class="iconfont">&#xe611;</span>
        </picker>
      </div>

      <div>
        <text>备注：</text>
        <input placeholder="请输入备注信息" placeholder-style="color:#999;" @input="triggerNote" />
      </div>
    </div>
    <div class="operate">
      <button plain="true" :disabled="disabledBtn" @click="confirm">保存</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: "请选择时间",
      form: {
        reportId: "",
        projectName: "",
        visitType: "",
        visitContent: "",
        nextVisitTime: "",
        status: "",
        remark: "",
        visitUserId: "",
        visitUserType: ""
      },
      canPick: false,
      disabledBtn:false,
      userInfo: {},
      query: {
        reportUserId: "",
        flag: 1 //去重
      },
      visitTypeNm: "",
      statusNm: "",
      followStyleList:[],
      statusList:[],
      proList: []
    };
  },
  onLoad(options) {
    this.form.reportId =
      options.id && options.id !== "undefined" ? options.id : "";
    this.form.projectName = options.proNm;
    this.canPick =
      options.proNm && options.proNm !== "undefined" ? true : false;
    console.log(`this.canPick${this.canPick}`);
    console.log("followrecord add", this.form.reportId, this.form.projectName);
  },
  async onShow() {
    this.disabledBtn=false
    this.proList = [];
    await this.getUserInfo();
    await this.getProjectList();
    await this.getFollowStyleList();
    await this.getStatusList();
  },
  onUnload() {
    this.form = {
      reportId: "",
      projectName: "",
      visitType: "",
      visitContent: "",
      nextVisitTime: "",
      status: "",
      remark: "",
      visitUserId: "",
      visitUserType: ""
    };
    this.proList = [];
  },
  methods: {
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();

      this.query.reportUserId = this.userInfo.userId;
      this.form.visitUserId = this.userInfo.userId;
      this.form.visitUserType = this.userInfo.userType;
    },
    async getProjectList() {
      let res = await this.api.getSysRelatedReportList(this.query);

      this.proList.push(...res);
    },
    changePro(e) {
      let index = e.mp.detail.value;
      this.form.projectName = this.proList[index].projectName;
      this.form.reportId = this.proList[index].id;
    },
    changeFollowStyle(e) {
      let index = e.mp.detail.value;
      this.form.visitType = this.followStyleList[index].nm;
    },
    changeStatus(e) {
      let index = e.mp.detail.value;
      this.form.status = this.statusList[index].nm;
    },
    bindDateChange(e) {
      this.form.nextVisitTime = e.mp.detail.value;
    },
    triggeInput(e) {
      this.form.visitContent = e.mp.detail.value;
    },
    triggerNote(e) {
      this.form.remark = e.mp.detail.value;
    },
    verifyForm() {
      let arr = [{ projectName: "项目名称" }];
      return this.until.requireVerify(this.form, arr);
    },
    async confirm() {
      this.disabledBtn=true
      let msg = this.verifyForm();
      if (msg) {
        this.until.showToast(msg, "none", 400);
        this.disabledBtn=false
      } else {
        let res = await this.api.sysFollowRecordSave(this.form);
        if (res === 0) {
          setTimeout(() => {
            wx.navigateBack();
          }, 1000);
          //跳转
        }
      }
    },
    async getFollowStyleList() {
      this.followStyleList = await this.api.getBaseDictionaryList({
        cd: "visitType"
      });
    },
    async getStatusList() {
      this.statusList = await this.api.getBaseDictionaryList({
        cd: "visitStatus"
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
.home-report {
  width: 100%;
  height: 100%;
  background-color: @backgroundColor;

  .search {
    display: flex;
    display: -webkit-flex;
    flex-flow: column wrap;
    padding-left: 40rpx;
    background-color: #fff;
    > div {
      position: relative;
      width: 100%;
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      align-items: flex-start;
      padding: 30rpx 0;
      border-bottom: 1rpx solid #ddd;
      &:nth-of-type(1) {
        margin-top: 0;
      }
      &:nth-last-of-type(1) {
        border-bottom: 0;
      }
      > span {
        position: absolute;
        top: 36%;
        left: -30rpx;
        color: #f00;
      }
      > text {
        width: 220rpx;
        font-size: 30rpx;
        color: #666;
      }
      input,
      picker,
      textarea {
        flex: 1;
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
}
</style>
