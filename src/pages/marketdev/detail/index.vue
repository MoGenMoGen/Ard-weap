<template>
  <div class="detail">
    <!-- 经销商隐藏 -->

    <div class="regoin">
      <div v-for="item in regoinList" :key="item.nm">
        <span v-if="item.required" class="iconfont">&#xe69f;</span>
        <div>{{item.key}}</div>
        <div>{{item.value}}</div>
      </div>
    </div>
    <!-- 审批记录 类似于留言板 -->
    <div class="competitor" v-for="(itemCom,index) in apprList" :key="itemCom.id">
      <div v-for="(item,index1) in itemCom.competitorArr" :key="item.nm">
        <span v-if="item.required" class="iconfont">&#xe69f;</span>
        <div>{{item.key}}</div>
        <div>{{item.value}}</div>
      </div>
    </div>
    <!-- 领导批阅 -->
    <div class="leader-appr" v-if="userInfo.userType===1 || userInfo.userType===5">
      <div>领导批阅：</div>
      <textarea
        type="text"
        v-model="check.leaderMark"
        placeholder="请输入批阅意见"
        placeholder-style="color:#999;"
      />
    </div>
    <!-- 领导 -->
    <div class="operate-two">
      <button @click="toPage(`../record/main?id=${id}`)">查看跟进记录</button>
      <button @click="toPage(`../recordadd/main?id=${id}`)" v-if="ifAdd">新建跟进记录</button>
      <button @click="approve" v-if="canAppr || userInfo.userType==5">提交批阅</button>
    </div>
    <!-- 业务员 -->
    <!--<div class="operate-two" v-else>-->
    <!--<button @click="toPage(`../record/main?id=${id}`)">查看跟进记录</button>-->
    <!--<button @click="toPage(`../recordadd/main?id=${id}`)">新建跟进记录</button>-->
    <!--</div>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      ifAdd: false,
      canAppr:false,
      id: "",
      userInfo: {},
      total: 0,
      apprList: [],
      query: {
        pageSize: 5,
        pageNum: 1,
        id: ""
      },
      check: {
        id: "",
        leaderId: "",
        leaderName: "",
        leaderMark: ""
      },
      regoinList: [
        {
          nm: "clueType",
          key: "线索类型：",
          value: "A类优质资源",
          required: true
        },
        {
          nm: "bussinessBrand",
          key: "经营的品牌及品类：",
          value: `格力中央空调`,
          required: true
        },
        {
          nm: "shopType",
          key: "店面形式： ",
          value: `专卖店`,
          required: true
        },
        { nm: "linkMan", key: "姓名：", value: "李欣谕", required: true },
        {
          nm: "linkPhone",
          key: "联系方式：",
          value: "18613990003",
          required: true
        },
        {
          nm: "areaName",
          key: "联系地址：",
          value: "湖南省邵阳市大祥区敏州东路火车南站",
          required: true
        },
        {
          nm: "address",
          key: "详细地址：",
          value: "20#地锦绣花妍小区G栋11、12号门面",
          required: true
        }
      ],
      competitorArr: [
        {
          nm: "leaderMark",
          key: "批阅意见：",
          value: `可以在中途沟通设计方案，然后与客户沟通是否需要签订市级代理合同`,
          required: false
        },
        { nm: "leaderName", key: "批阅人：", value: "徐国祥", required: false },
        { nm: "crtTm", key: "批阅时间：", value: "2019-07-02", required: false }
      ]
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.check.id = options.id;
    console.log("marketid" + this.id);
  },
  async onShow() {
    await this.getUserInfo();
    await this.getMarketDevInfo();
  },
  methods: {
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();
      this.check.leaderId = this.userInfo.userId;
      this.check.leaderName = this.userInfo.realName;
    },
    async getMarketDevInfo() {
      let res = await this.api.getSysMarketDevInfoById(this.id);
      if (this.userInfo.userId === res.groupLeaderId) {
        this.canAppr = true;
      }else {
        this.canAppr = false;
      }
      // console.log( res.devUserId === this.userInfo.userId)
      // console.log(this.userInfo.extUserIds && this.userInfo.extUserIds.indexOf(res.devUserId) > -1)
      if ( res.devUserId === this.userInfo.userId || (this.userInfo.extUserIds && this.userInfo.extUserIds.indexOf(res.devUserId) > -1) ) {
        // console.log('true11')
        this.ifAdd = true;
      } else {
        // console.log('false11')
        this.ifAdd = false;
      }
      // console.log('====')

      this.query.id = res.id;
      this.apprList = res.markList;
      this.apprList.map(itemCom => {
        this.competitorArr.map(item => {
          item.value = itemCom[item.nm];
        });
        itemCom.competitorArr = JSON.parse(JSON.stringify(this.competitorArr));
      });
      console.log('====2222222222')

      this.regoinList.map(item => {
        item.value = res[item.nm] ? res[item.nm] : "";

        if (item.nm == "clueType") {
          switch (res[item.nm]) {
            case 1:
              item.value = "A类 优质资源";
              break;
            case 2:
              item.value = "B类 一般资源";
              break;
            default:
              break;
          }
        }

        if (item.nm == "shopType") {
          switch (res[item.nm]) {
            case 1:
              item.value = "专卖店";
              break;
            case 2:
              item.value = "专款店&设计公司";
              break;
            default:
              break;
          }
        }
      });
    },
    async getMarketApprList() {
      let { result, total } = await this.api.getSysMarketDevApprByPage(
        this.query
      );
      this.total = total;
    },
    toPage(url) {
      this.until.aHref(url);
    },
    async approve() {
      let res = await this.api.sysMarketDevCheckSave(this.check);
      if (res.code === 0) {
        this.until.showToast(res.data, "success", 1000);
        this.getMarketDevInfo();
        this.check.leaderMark = "";
      }
    }
  }
};
</script>

<style lang='less' scoped>
@import url("../../../css/common.less");
.detail {
  width: 100%;
  background-color: @backgroundColor;
  color: #666;
  font-size: 26rpx;
  > div {
    &:nth-last-of-type(2) {
      padding-bottom: 100rpx;
    }
  }
  .regoin,
  .competitor {
    display: flex;
    display: -webkit-flex;
    flex-flow: column wrap;
    padding: 30rpx 65rpx;
    background-color: #fff;
    > div {
      position: relative;
      flex: 1;
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      align-items: flex-start;
      margin-top: 20rpx;
      &:nth-of-type(1) {
        margin-top: 0;
      }
      span {
        position: absolute;
        top: 20%;
        left: -40rpx;
        color: #f00;
      }
    }
  }
  .competitor {
    margin-top: 20rpx;
  }
  .leader-appr {
    padding: 30rpx 68rpx;
    background-color: #fff;
    margin: 20rpx 0 100rpx;
    div {
      margin-bottom: 30rpx;
    }
    textarea {
      border: 1rpx solid #ddd;
      padding: 10rpx;
    }
  }
}
</style>
