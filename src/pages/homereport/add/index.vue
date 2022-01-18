<template>
  <div class="home-report">
    <div class="searchComp" v-if="searchShow">
      <div class="content">
        <span class="iconfont" @click="searchShow = false">&#xe7c6;</span>
        <input placeholder="请输入联系人" v-model.lazy="compName" maxlength="100" />
        <div class="list" v-if="linkedList && linkedList.length > 0">
          <p
            v-for="(item, index) in linkedList"
            :key="index"
            @click="chooseComp(item)"
          >
            {{ item.name + " (电话：" + item.linkPhone + ")" }}
          </p>
        </div>
        <p class="noData" v-else>— 没有相关数据 —</p>
      </div>
    </div>
    <!-- <div class="addComp" v-if="addShow">
      <div class="content">
        <input placeholder="请输入联系人" v-model.lazy="addComp.corpName" maxlength="100" />
        <p>
          <span @click="addCancel">取消</span>
          <span @click="addComfirm">确定</span>
        </p>
      </div>
    </div>-->
    <div class="search">
      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>项目名称：</text>
        <input
          type="text"
          placeholder="请输入项目名称"
          placeholder-style="color:#999;"
          v-model.lazy="form.projectName"
        />
      </div>
      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>项目地址：</text>
        <div class="addr">
          <addr-select
            @changeAddr="changeAddr"
            :disabled="disabled"
            ref="addr"
          ></addr-select>
        </div>
      </div>

      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>详细地址：</text>
        <input
          type="text"
          placeholder="请输入街道（镇）详细地址+门牌号"
          placeholder-style="color:#999;"
          v-model.lazy="form.projectAddress"
        />
      </div>
      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>是否跨区：</text>
        <radio-group class="radio-group" @change="crossRegionChange">
          <label class="radio" v-for="(item, index) in items" :key="index">
            <radio :value="item.name" :checked="item.checked" />
            {{ item.value }}
          </label>
        </radio-group>
      </div>
      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>申报时间：</text>
        <picker
          mode="time"
          :value="reportTime"
          start="1980-01-01"
          disabled="true"
          @change="reportDateChange"
        >
          <view class="picker">{{ reportTime }}</view>
          <span class="iconfont">&#xe611;</span>
        </picker>
      </div>
      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>联系人：</text>
        <button plain="true" @click="searchShow = true">
          {{ form.projectLeader ? form.projectLeader : "请输入联系人" }}
        </button>
        <i
          class="iconfont"
          @click="toPage('../../personal/linkedadd/main?type=add')"
          >&#xe605;</i
        >
      </div>
      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>联系电话：</text>
        <input
          type="number"
          maxlength="11"
          v-model.lazy="form.leaderLinkPhone"
          placeholder="请输入联系人电话"
          placeholder-style="color:#999;"
        />
      </div>
      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>信息来源：</text>
        <input
          type="text"
          v-model.lazy="form.infoSource"
          placeholder="请输入信息来源"
          placeholder-style="color:#999;"
        />
      </div>
      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>关系描述：</text>
        <picker
          @change="changeRelateDesc"
          :range="relateDescList"
          range-key="nm"
        >
          <view class="picker">{{
            form.relateDesc ? form.relateDesc : " 请选择关系描述"
          }}</view>
          <span class="iconfont">&#xe60f;</span>
        </picker>
      </div>
      <div v-if="form.relateDesc == '其他'">
        <span class="iconfont">&#xe69f;</span>
        <text>其他关系描述：</text>
        <input
          type="text"
          v-model.lazy="form.extraRelateDesc"
          placeholder="请输入其他关系来源"
          placeholder-style="color:#999;"
        />
      </div>
      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>预计签约日期：</text>
        <picker
          mode="date"
          start="1980-01-01"
          :value="form.signDate"
          @change="bindDateChange"
        >
          <view class="picker">{{ form.signDate }}</view>
          <span class="iconfont">&#xe611;</span>
        </picker>
      </div>
      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>预计签约金额：</text>
        <input
          type="number"
          v-model.lazy="form.planPurchaseAmount"
          placeholder="请输入签约金额"
          placeholder-style="color:#999;"
        />
        <i>万元</i>
      </div>
      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>预计采购产品：</text>
        <input
          type="text"
          v-model.lazy="form.planPurchaseProduct"
          placeholder="装饰、线型、净化"
          placeholder-style="color:#999;"
        />
      </div>
      <div class="text-area">
        <text>备注：</text>
        <textarea
          v-if="!searchShow"
          auto-height
          placeholder="多行输入"
          placeholder-style="color:#999;"
          v-model.lazy="form.remark"
        />
      </div>
    </div>
    <div class="operate">
      <button plain="true" :disabled="disabledBtn" @click="save">保存</button>
      <button plain="true" :disabled="disabledBtn" @click="confirm">
        确定
      </button>
    </div>
  </div>
</template>

<script>
import addrSelect from "@/components/addrSelect";
export default {
  data() {
    return {
      compName: "",
      form: {
        projectLeader: "", //联系人
        leaderLinkPhone: "", //联系电话
        infoSource: "", //信息来源
        projectName: "", //项目名称
        projectAddress: "", //工程所在地
        isCrossRegion: "", //是否跨区
        relateDesc: "", //关系描述
        extraRelateDesc: "", //其他关系描述
        projectAreaCode: "",
        projectAreaName: "",
        signDate: "", //签约时间
        planPurchaseAmount: "", //采购金额
        planPurchaseProduct: "", //采购产品
        reportType: 2,
        saleType: "", //经销商类别
        reportUserType: "", //报备项目的用户类型
      },
      disabled: false,
      addShow: false,
      searchShow: false, //公司搜索
      oldName: "", //弹窗前的联系人，用于判断是否更新了名称
      linkedName: "", //弹窗展示联系人
      linkedList: [],
      userInfo: {},
      disabledBtn: false,
      reportTime: "",
      items: [
        { name: "0", value: "否", checked: false },
        { name: "1", value: "是", checked: false },
      ], //是否跨区
      relateDescList: [
        {
          nm: "装饰设计公司",
        },
        {
          nm: "空调公司",
        },
        {
          nm: "其他",
        },
      ],
    };
  },
  onLoad(options) {
    this.id = options.id && options.id !== "undefined" ? options.id : "";
  },
  async onShow() {
    this.disabledBtn = false;

    await this.getUserInfo();
    await this.getLinkedList();

    let { year, month, day, hour, minite } = this.until.formatDate();
    this.reportTime = `${year}-${month}-${day} ${hour}:${minite}`;
    let areaInfo = this.until.seGet("areaInfo");

    if (areaInfo) {
      let { areaName, areaCode } = JSON.parse(areaInfo);
      this.form.projectAreaName = areaName;
      this.form.projectAreaCode = areaCode;
      this.$refs.addr.setAddr(areaName);
    }
    if (this.id) {
      await this.getReportInfo();
    }
  },
  onUnload() {
    this.form = {
      projectLeader: "",
      leaderLinkPhone: "",
      infoSource: "", //信息来源
      projectName: "",
      projectAddress: "",
      isCrossRegion: "", //是否跨区
      relateDesc: "", //关系描述
      extraRelateDesc: "", //其他关系描述
      projectAreaCode: "",
      projectAreaName: "",
      signDate: "",
      planPurchaseAmount: "",
      planPurchaseProduct: "",
      saleName: "",
      projectFollowMan: "", //报备人
      saleType: "", //经销商类别
      reportUserType: "", //报备项目的用户类型
      projectFollowMan: "",
    };

    this.until.seRemove("areaInfo");
  },
  watch: {
    compName(val) {
      console.log("==========" + val);
      this.getLinkedList(val);
    },
  },
  methods: {
    async getReportInfo() {
      let res = await this.api.getSysReportInfo(this.id);
      this.form = this.until.remainLeftObjProp(this.form, res);
      this.form.signDate = this.form.signDate
        ? this.form.signDate.substring(0, 10)
        : "";
      this.$refs.addr.setAddr(this.form.projectAreaName);
    },
    //地区更改
    changeAddr(addr) {
      this.$refs.addr.setAddr("");
      if (addr.area) {
        this.form.projectAreaName =
          addr.provice + "-" + addr.city + "-" + addr.area;
      } else {
        this.form.projectAreaName = addr.provice + "-" + addr.city;
      }

      this.form.projectAreaCode = addr.code;
      let areaInfo = {
        areaName: this.form.projectAreaName,
        areaCode: this.form.projectAreaCode,
      };
      this.until.seSave("areaInfo", JSON.stringify(areaInfo));
    },
    //是否跨区
    crossRegionChange(e) {
      console.log(e);
      this.form.isCrossRegion = e.mp.detail.value;
      this.items.forEach((item, index) => {
        if (index == e.mp.detail.value) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        this.$set(this.items, index, item);
      });
    },
    //选择关系描述
    changeRelateDesc(e) {
      console.log(e);
      let index = e.mp.detail.value;
      this.form.relateDesc = this.relateDescList[index].nm;
    },
    chooseComp(item) {
      this.form.projectLeader = item.name;
      this.form.leaderLinkPhone = item.linkPhone;
      // this.$refs.addr.setAddr(item.unitAreaName);
      this.searchShow = false;
    },
    bindDateChange(e) {
      this.form.signDate = e.mp.detail.value;
    },
    addCompany() {
      this.addShow = true;
    },
    toPage(url) {
      this.until.aHref(url);
    },

    async getLinkedList(nm) {
      let param = {
        devUserId: this.userInfo.userId,
      };
      if (this.userInfo.extUserIds) {
        param.extUserIds = this.userInfo.extUserIds;
      }
      if (nm) {
        param.name = nm;
      }
      let data = await this.api.getSysCustomerList(param);
      this.linkedList = data ? data : [];
      console.dir(this.linkedList);
    },
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();
      if (this.userInfo.agentInfoId) {
        this.form.saleId = this.userInfo.agentInfoId;
      }
      this.form.saleName = this.userInfo.agentInfoName;
      this.form.projectFollowMan = this.userInfo.realName;
      this.form.saleType =
        this.userInfo.saleType && this.userInfo.saleType !== "null"
          ? this.userInfo.saleType
          : "";
      this.form.reportUserType = this.userInfo.userType;
    },
    async save() {
      //verify
      this.disabledBtn = true;

      if (this.id) {
        this.form.id = this.id;
      }

      //调用用户
      this.form.reportUserId = this.userInfo.userId;
      this.form.reportType = 2;

      this.form.reportStatus = -2;
      for (let [k, v] of Object.entries(this.form)) {
        if (!v || v == "") {
          delete this.form[k];
        }
      }
      setTimeout(() => {
        this.disabledBtn = false;
      }, 2000);
      let res = await this.api.sysReportInfoSave(this.form);
      if (res && res.data) {
        this.until.back();
      }
      this.disabledBtn = false;
    },
    async confirm() {
      //verify
      this.disabledBtn = true;

      if (this.id) {
        this.form.id = this.id;
      }

      let msg = this.verifyRequired();
      if (msg) {
        this.until.showToast(msg, "none", 400);
        this.disabledBtn = false;
        return;
      } else {
        if (isNaN(this.form.planPurchaseAmount)) {
          this.until.showToast("签约金额必须为数字！", "none", 400);
          this.disabledBtn = false;
          return;
        }
        let regPhone = this.reg.checkPhone(this.form.leaderLinkPhone);
        if (regPhone !== "ok") {
          this.until.showToast(regPhone, "none", 400);
          this.disabledBtn = false;
          return;
        }

        //调用用户
        this.form.reportUserId = this.userInfo.userId;
        this.form.reportType = 2;

        this.form.reportStatus = 100;
        setTimeout(() => {
          this.disabledBtn = false;
        }, 2000);
        let res = await this.api.sysReportInfoSave(this.form);
        if (res && res.data) {
          this.until.aHref(`../detail/main?id=${res.data}`);
        }
      }
      this.disabledBtn = false;
    },
    verifyRequired() {
      let arr = [];

      if (this.form.relateDesc == "其他") {
        arr = [
          { projectName: "项目名称" },
          { projectAreaName: "项目地址" },
          { projectAddress: "详细地址" },
          { isCrossRegion: "是否跨区" },
          { projectLeader: "联系人" },
          { leaderLinkPhone: "联系电话" },
          { infoSource: "信息来源" },
          { relateDesc: "关系描述" },
          { extraRelateDesc: "其他关系描述" },
          { signDate: "签约时间" },
          { planPurchaseAmount: "采购金额" },
          { planPurchaseProduct: "采购产品" },
        ];
      } else {
        arr = [
          { projectName: "项目名称" },
          { projectAreaName: "项目地址" },
          { projectAddress: "详细地址" },
          { isCrossRegion: "是否跨区" },
          { projectLeader: "联系人" },
          { leaderLinkPhone: "联系电话" },
          { infoSource: "信息来源" },
          { relateDesc: "关系描述" },
          { signDate: "签约时间" },
          { planPurchaseAmount: "采购金额" },
          { planPurchaseProduct: "采购产品" },
        ];
      }

      return this.until.requireVerify(this.form, arr);
    },
  },
  components: {
    addrSelect,
  },
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
.home-report {
  width: 100%;
  background-color: @backgroundColor;
  .operate {
    width: 100%;
    display: flex;
    display: -webkit-flex;
    button {
      border-top: 1rpx solid #ddd;
      flex: 1;
      background: #ffffff;
      color: #333333;
      text-align: center;
      &:last-of-type {
        border-top: 1rpx solid @btnColor;
        background: @color;
        color: #ffffff;
      }
    }
  }
  .searchComp {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 2199;
    background: rgba(0, 0, 0, 0.8);

    .content {
      width: 75vw;
      margin: 140rpx auto 0;
      border-radius: 10rpx;
      background: #ffffff;
      padding-top: 50rpx;
      padding-bottom: 20rpx;
      position: relative;
      span {
        position: absolute;
        right: 5rpx;
        top: 5rpx;
        font-size: 30rpx;
      }
      input {
        width: 80%;
        margin: 0 auto 40rpx;
        border-bottom: 1px solid @borderColor;
      }
      .list {
        max-height: 500rpx;
        width: 80%;
        margin: 0 auto;
        overflow-y: scroll;
        p {
          padding: 10rpx 0;
        }
      }
      > p {
        text-align: center;
      }
    }
  }
  .addComp {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 1999;
    background: rgba(0, 0, 0, 0.8);

    .content {
      width: 75vw;
      margin: 140rpx auto 0;
      border-radius: 10rpx;
      background: #ffffff;
      padding-top: 50rpx;
      input {
        width: 80%;
        margin: 0 auto 40rpx;
        border-bottom: 1px solid @borderColor;
      }
      p {
        border-top: 1px solid @borderColor;
        display: flex;
        display: -webkit-flex;
        span {
          flex: 1;
          text-align: center;
          padding: 20rpx 0;
          &:first-of-type {
            border-right: 1px solid @borderColor;
          }
        }
      }
    }
  }
  .search {
    display: flex;
    display: -webkit-flex;
    flex-flow: column wrap;
    padding-left: 40rpx;
    padding-bottom: 46rpx;
    background-color: #fff;
    > div {
      position: relative;
      width: 100%;
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      align-items: center;
      padding: 30rpx 0;
      border-bottom: 1rpx solid #ddd;
      &:nth-of-type(1) {
        margin-top: 0;
      }
      &:nth-last-of-type(1) {
        border-bottom: 0;
        height: 100rpx;
      }
      > span {
        position: absolute;
        top: 36%;
        left: -30rpx;
        color: #f00;
      }
      i {
        margin-right: 40rpx;
      }
      > text {
        width: 220rpx;
        font-size: 30rpx;
        color: #666;
      }
      button {
        flex: 1;
        text-align: left;
        background: #fff;
        color: #666666;
        border: 0;
      }
      input,
      picker,
      textarea,
      div {
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
      .addr {
        display: flex;
        display: -webkit-flex;
        span {
          flex: 1;
        }
      }
      i {
        font-style: normal;
        margin-right: 40rpx;
      }
    }
    .text-area {
      align-items: flex-start;
    }
  }
}
</style>
