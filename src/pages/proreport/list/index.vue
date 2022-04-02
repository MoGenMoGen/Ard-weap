<template>
  <div class="report-list">
    <div class="header">
      <div class="search">
        <div v-if="type=='项目报备'">
          <span>报备类型</span>
          <picker @change="changeReportType" :range="reportTypeList" range-key="nm">
            <view class="picker">{{reportNm?reportNm:'请选择报备类型'}}</view>
          </picker>
          <i class="iconfont">&#xe60f;</i>
        </div>
        <div v-if="type==='项目报备' && (form.userType==1 || form.userType==5)">
          <span>经销商</span>
          <picker @change="changeAgentType" :range="agentList" range-key="name">
            <view class="picker">{{agentNm?agentNm:'请选择经销商'}}</view>
          </picker>
          <i class="iconfont">&#xe60f;</i>
        </div>
        <div>
          <span>联系人</span>
          <input
            type="text"
            v-model="form.projectLeader"
            placeholder="请输入联系人姓名"
            placeholder-style="color:#999;"
          />
        </div>
        <div>
          <span>联系电话</span>
          <input
            type="number"
            maxlength="11"
            v-model="form.leaderLinkPhone"
            placeholder="请输入联系电话"
            placeholder-style="color:#999;"
          />
        </div>
        <div v-if="type==='项目报备'">
          <span>所在区域</span>
          <div class="addr">
            <addr-select @changeAddr="changeAddr" :disabled="disabled" ref="addr"></addr-select>
          </div>
        </div>
        <div>
          <span>项目地址</span>
          <input
            type="text"
            v-model="form.projectAddress"
            placeholder="请输入项目地址"
            placeholder-style="color:#999;"
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
        <button plain="true" @click="toSearch">查询</button>
      </div>
      <div class="tab-bar" v-if="type==='项目报备' && form.queryType!=6">
        <div
          v-for="(item, index) in tabList"
          @click="choose(item)"
          :class="{'active':selectTab===item.nm}"
          :key="index"
        >{{item.nm}}</div>
      </div>
      <div class="settled-report" v-if="type!=='项目报备'">
        <text>完结报备：</text>
        <text>{{total}}</text>
      </div>
    </div>
    <div class="data-list">
      <report-list :list="list" :userId="userInfo.userId" @set="setReport"></report-list>
      <p class="noData" v-if="total == list.length">数据加载完</p>
    </div>
  </div>
</template>

<script>
import addrSelect from "@/components/addrSelect";
import reportList from "@/components/reportList";
export default {
  data() {
    return {
      disabled: false,
      reportTypeList: [
        {
          id: 1,
          nm: "工装"
        },
        {
          id: 2,
          nm: "家装"
        }
      ],
      agentList: [], //经销商列表
      reportNm: "",
      agentNm: "",
      form: {
        saleId: "",
        projectAreaCode: "",
        userId: "",
        userType: "",
        reportType: "",
        share: "0",
        pageSize: 5,
        pageNum: 1,
        reportStartTime: "",
        reportEndTime: "",
        projectLeader: "",
        leaderLinkPhone: "",
        projectAddress: "",
        queryType: 1,
        areaCode: "", //区域传参，用来匹配省代经销商可以审批市代经销商
        reportStatus: "",
        extUserIds: ""
      },
      list: [],
      userInfo: {},
      type: "",
      total: 0,
      transfer: false, //用来判断我的项目报备点进来，也需要传值extUserIds
      selectTab: "全部",
      tabList: [
        { nm: "全部", cd: "1" },
        { nm: "待审核", cd: "2" },
        { nm: "已审核", cd: "3" },
        { nm: "无效", cd: "4" },
        { nm: "待提交", cd: "5" }
      ]
    };
  },
  onLoad(options) {
    this.type = options.type;
    if (this.type === "完结报备") {
      this.form.reportStatus = 300;
      this.form.queryType = 1;
    } else {
      this.form.queryType = 1;
    }
    if (options.types === "self") {
      this.form.queryType = 6;
      this.form.isMe=true
      this.transfer = true;
    }
    console.log(this.type);
  },
  onReachBottom() {
    if (this.total > this.form.pageSize * this.form.pageNum) {
      this.form.pageNum++;
      this.getList();
    }
  },
  async onShow() {
    wx.setNavigationBarTitle({
      title: this.type
    });
    //状态也改成全部
    this.selectTab = "全部";
    this.form.queryType = 1;
    this.list = [];
    this.form.pageNum = 1;
    this.form.pageSize = 5;
    await this.getUserInfo();
    await this.getList();
    if (
      this.type === "项目报备" &&
      (this.form.userType == 1 || this.form.userType == 5)
    ) {
      await this.getSaleNameList();
    }
  },
  onUnload() {
    this.form = {
      userId: "",
      reportType: "",
      share: "0",
      reportStartTime: "",
      reportEndTime: "",
      projectLeader: "",
      leaderLinkPhone: "",
      projectAddress: "",
      pageSize: 5,
      pageNum: 1,
      queryType: 1,
      reportStatus: "",
      extUserIds: "",
      businessAreaCode: ""
    };
    this.reportNm = "";
  },
  methods: {
    //取消或者提前结束
    setReport() {
      this.toSearch();
    },
    async getSaleNameList() {
      this.agentList = [];
      let param = {};
      if (this.userInfo.userType == 1) {
        param = {
          groupLeaderId: this.userInfo.userId
        };
      }
      let res = await this.api.getSysAllSaleNameList(param);
      res.map(item => {
        // this.agentList.push(item.crmAgentInfoVo);
        this.agentList.push(item);
      });
      // console.log(11111,this.agentList);
    },
    toSearch() {
      this.list = [];
      this.form.pageNum = 1;
      this.getList();
    },
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();
      console.log('userInfo',this.userInfo);
      this.form.userId = this.userInfo.userId;
      this.form.userType = this.userInfo.userType;
      if (this.userInfo.userType === 2) {
        //仅经销商传值
        this.form.saleId = this.userInfo.agentInfoId;
      } else {
        this.form.saleId = "";
      }

      if (
        (this.type === "项目报备" && this.form.queryType != 6) ||
        this.transfer
      ) {
        this.form.extUserIds = this.userInfo.extUserIds;
      }
      if(this.userInfo.userType && this.userInfo.userType ===3 ) { //如果是业务员  这里将业务员负责的全部负责区域传递到后台
        this.form.businessAreaCode = this.userInfo.regionCode
      }
    },
    async getList() {
      let { result, total } = await this.api.getSysProReportList(this.form);
      this.total = total;
      //输出翻译reportResult

      result.map(item => {
        switch (item.reportResult) {
          case 0:
            item.reportResult = "无效";
            break;
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
            break;
        }

        //当一报的时候，并且是省代审批市代后的报备，需显示'待主管审批'  
        if (item.saleType === 3 && item.reportStatus === 100) {
          // 待区域负责人审核
          item.reportResult = "待主管审批";
        }
        if (item.saleType === 3 && item.reportStatus === 0) {
          // 待省代审核
          item.reportResult = "待主管审批";
        }
        if (
          (item.saleType === 1 || item.saleType === 2) &&
          item.reportStatus === 0
        ) {
          // 待区域负责人审核
          item.reportResult = "待主管审批";
        }

        item.reportTime = item.reportTime
          ? item.reportTime.substring(0, 10)
          : "";
        //当业务主管切为null的时候，显示埃瑞德，经销商的时候就显示获取的数据
        if (item.reportUserType === 1) {
          item.saleName = item.saleName ? item.saleName : "埃瑞德";
        }
        if (item.reportStatus == -2) {
          item.reportResult = "待提交";
        }
        if (item.reportStatus == -1) {
          item.reportResult = "无效";
        }
        if (item.reportStatus == 300) {
          item.reportResult = "已完结";
        }
        if (item.reportStatus == 400) {
          item.reportResult = "提前结束";
        }
      });
      this.list.push(...result);
    },
    choose(item) {
      this.selectTab = item.nm;
      this.form.queryType = item.cd;
      //根据当前userType去判断是否显示

      this.list = [];
      this.form.pageSize = 5;
      this.form.pageNum = 1;
      this.getList();
    },
    changeReportType(e) {
      let index = e.mp.detail.value;
      this.form.reportType = this.reportTypeList[index].id;
      this.reportNm = this.reportTypeList[index].nm;
    },
    changeAgentType(e) {
      let index = e.mp.detail.value;
      this.form.saleId = this.agentList[index].id;
      this.agentNm = this.agentList[index].name;
    },
    bindDateChange(e) {
      this.form.reportStartTime = e.mp.detail.value;
    },
    bindDateEndChange(e) {
      this.form.reportEndTime = e.mp.detail.value;
    },
    //地区更改
    changeAddr(addr) {
      // console.log(addr);
      // if (addr.area) {
      //   this.form.projectAreaName = `${addr.provice}-${addr.city}-${addr.area}`;
      // } else if (addr.city) {
      //   this.form.projectAreaName = `${addr.provice}-${addr.city}`;
      // } else {
      //   this.form.projectAreaName = addr.provice;
      // }
      // console.log(this.form.projectAreaName);
      this.form.projectAreaCode = addr.code;
    }
  },
  components: {
    reportList,
    addrSelect
  }
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
@import url("../../../css/common.css");
.report-list {
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
        align-items: center;
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
        > div {
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
    .tab-bar {
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      background-color: #fff;
      > div {
        flex: 1;
        padding: 20rpx 0;
        text-align: center;
        font-size: 30rpx;
      }
      .active {
        color: @btnColor;
        border-bottom: 1rpx solid @btnColor;
      }
    }
    .settled-report {
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
    margin-top: 20rpx;
    background-color: #fff;
  }
}
</style>
