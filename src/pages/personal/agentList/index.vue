<template>
  <div class="report-list">
    <div class="header">
      <div class="search">
        <div>
          <span>经销商名字</span>
          <input
            type="text"
            v-model="form.name"
            placeholder="请输入经销商名字"
            placeholder-style="color:#999;"
          />
        </div>
        <div>
          <span>手机号</span>
          <input
            type="number"
            maxlength="11"
            v-model="form.linkPhone"
            placeholder="请输入手机号"
            placeholder-style="color:#999;"
          />
        </div>
        <div>
          <span>所在区域</span>
          <div class="addr">
            <addr-select @changeAddr="changeAddr" :disabled="disabled" ref="addr"></addr-select>
          </div>
        </div>


      </div>
      <div class="operate-search">
        <button plain="true" @click="toSearch">查询</button>
      </div>
    </div>
    <div class="data-list">
      <p class="total">经销商数量：{{total}}</p>
      <agent-list :list="list"></agent-list>
      <p class="noData" v-if="total==0">暂无数据</p>
      <p class="noData" v-if="total!=0 && total == list.length">数据已加载完</p>
    </div>
  </div>
</template>

<script>
  import addrSelect from "@/components/addrSelect";
import agentList from "@/components/agentList";
export default {
  data() {
    return {
      disabled: false,
      typeList: [
        {
          id: 1,
          nm: "直营"
        },
        {
          id: 2,
          nm: "省级"
        },
        {
          id: 3,
          nm: "市级"
        }
      ],
      typeNm: "",
      agentNm:'',
      form: {
        userId:'',
        extUserIds:'',
        saleType:'',
        name:'',
        pageSize: 10,
        pageNum: 1,
        queryType: 1,
        linkPhone:'',
        regionCode:''
      },
      list: [],
      userInfo: {},
      total: 0,
    };
  },
  onLoad() {

  },
  onReachBottom() {
    if (this.total > this.form.pageSize * this.form.pageNum) {
      this.form.pageNum++;
      this.getList();
    }
  },
  async onShow() {
    this.list = [];
    this.form.pageNum = 1;
    this.form.pageSize = 10;
    await this.getUserInfo();
    await this.getList();
  },
  onUnload() {
    this.form = {
      userId:'',
      extUserIds:'',
      saleType:'',
      name:'',
      pageSize: 10,
      pageNum: 1,
      queryType: 1,
      linkPhone:'',
      regionCode:''
    };
    this.reportNm = "";
  },
  methods: {

    toSearch() {
      this.list = [];
      this.form.pageNum = 1;
      this.getList();
    },
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();
      this.form.userId = this.userInfo.userId
      this.form.extUserIds = this.userInfo.extUserIds
      if(this.userInfo.userType===1){
        this.form.groupLeaderId=this.userInfo.userId
      }
      if(this.userInfo.userType===2){
        this.form.groupLeaderId=this.userInfo.groupLeaderId
      }
      if(this.userInfo.userType==1 || this.userInfo.userType==3 || this.userInfo.userType==5){
        this.form.exceptType = true
      }else {
        this.form.exceptType = false
      }
    },
    async getList() {
      let res = await this.api.getAgentList(this.form);
      this.total = res.total
      this.list.push(...res.result);

    },

    changeType(e) {
      let index = e.mp.detail.value;
      this.form.saleType = this.typeList[index].id;
      this.typeNm = this.typeList[index].nm;
    },

    //地区更改
    changeAddr(addr) {
      this.form.regionCode = addr.code;
    },
  },
  components: {
    agentList,
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
        >div{
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
  }
  .data-list {
    margin-top: 20rpx;
    background-color: #fff;
    .total{
      border-bottom: 1px solid @borderColor;
      border-top: 1px solid @borderColor;
      padding: 20rpx 40rpx;
      background: @backgroundColor;
    }
  }
}
</style>
