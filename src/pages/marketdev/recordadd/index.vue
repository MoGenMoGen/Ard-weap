<template>
  <div class="input-content">
    <div class="input">
      <div>
        <text>跟进方式：</text>
        <picker @change="changeFollowType" :range="followList" range-key="nm">
          <view class="picker">{{form.visitType?form.visitType:'请选择跟进方式'}}</view>
          <span class="iconfont">&#xe60f;</span>
        </picker>
      </div>
      <div class="text-area">
        <text>跟进内容:</text>
        <textarea
          type="text"
          v-model="form.visitContent"
          placeholder="请输入跟进内容"
          placeholder-style="color:#999;"
        />
      </div>
      <div>
        <text>所在位置：</text>
        <input
          type="text"
          v-model="form.location"
          disabled
          placeholder="请点击获取地理位置"
          placeholder-style="color:#999;"
        />
        <image :src="location" :mode="aspectFill" alt />
      </div>
      <div>
        <text>预采时间：</text>
        <picker
          mode="date"
          start="1980-01-01"
          :value="form.nextVisitTime"
          @change="nextVisitChange"
        >
          <view class="picker">{{form.nextVisitTime}}</view>
          <span class="iconfont">&#xe611;</span>
        </picker>
      </div>
      <div class="text-area">
        <text>备注：</text>
        <textarea
          type="text"
          v-model="form.remark"
          placeholder="请输入备注信息"
          placeholder-style="color:#999;"
        />
      </div>
    </div>

    <div class="operate">
      <button plain="true" @click="confirm">保存</button>
    </div>
  </div>
</template>

<script>
import addrSelect from "@/components/addrSelect";
import location from "../../../../static/images/location.png";
import QQMapWX from "../../../utils/libs/qqmap-wx-jssdk";
export default {
  data() {
    return {
      location,
      followList: [],
      disabled: false,
      searchShow: false,
      linkedList: [],
      userInfo: {},
      form: {
        visitType: "",
        visitContent: "",
        nextVisitTime: "",
        location: "",
        remark: "",
        marketDevId: "", //市场开发主键
        visitUserId: "",
        visitUserType: ""
      }
    };
  },
  onLoad(options) {
    this.form.marketDevId = options.id;
    console.log("marketDevId" + this.form.marketDevId);
  },
  onUnload() {
    this.form = {
      visitType: "",
      visitContent: "",
      nextVisitTime: "",
      location: "",
      remark: "",
      marketDevId: "", //市场开发主键
      visitUserId: "",
      visitUserType: ""
    };
  },
  async onShow() {
    await this.getUserInfo();
    await this.getCustomer();
    await this.getRegionInfo();
    await this.getFollowStyleList();
  },

  methods: {
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();
      this.form.visitUserId = this.userInfo.userId;
      this.form.visitUserType = this.userInfo.userType;
    },
    async getFollowStyleList() {
      this.followList = await this.api.getBaseDictionaryList({
        cd: "visitType"
      });
    },
    async getCustomer() {
      let param = {
        devUserId: this.userInfo.userId
      };
      if (this.userInfo.extUserIds) {
        param.extUserIds = this.userInfo.extUserIds;
      }

      let data = await this.api.getSysCustomerList(param);
      this.linkedList = data ? data : [];
    },
    //地区更改
    changeAddr(addr) {
      console.log(addr);
      if (addr.area) {
        this.form.projectAreaName =
          addr.provice + "-" + addr.city + "-" + addr.area;
      } else {
        this.form.projectAreaName = addr.provice + "-" + addr.city;
      }
      console.log(this.form.projectAreaName);
      this.form.projectAreaCode = addr.code;
    },
    chooseComp(item) {
      this.form.projectLeader = item.name;
      this.$refs.addr.setAddr(item.unitAreaName);
      this.searchShow = false;
    },
    nextVisitChange(e) {
      this.form.nextVisitTime = e.mp.detail.value;
    },
    changeFollowType(e) {
      let index = e.mp.detail.value;
      this.form.visitType = this.followList[index].nm;
    },
    getRegionInfo() {
      var that = this,
        qqmapsdk;
      qqmapsdk = new QQMapWX({
        key: "KXXBZ-675KF-JOAJJ-NSX2Q-HYG6H-TMFNI"
      });

      wx.getLocation({
        //获取当前地址
        type: "wgs84",
        success: function(res) {
          var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180
          //根据经纬度获取所在城市
          qqmapsdk.reverseGeocoder({
            location: { latitude: latitude, longitude: longitude },
            success: function(res) {
              //address 城市
              that.form.location = res.result.address;
              console.log(that.form.location);
            }
          });
        }
      });
    },
    async confirm() {
      //保存按钮
      let res = await this.api.sysMarketDevVisitSave(this.form);
      if (res.code === 0) {
        this.until.showToast("新建成功", "success", 500);

        setTimeout(() => {
          wx.navigateTo({
            url: `../record/main?id=${this.form.marketDevId}`
          });
        }, 1000);
      }
    }
  },
  components: {
    addrSelect
  }
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
.input-content {
  height: 100%;

  .input {
    > div {
      i {
        margin-right: 40rpx;
      }
      button {
        flex: 1;
        text-align: left;
        background: #fff;
        color: #666666;
        border: 0;
      }
      .addr {
        flex: 1;
        display: flex;
        display: -webkit-flex;
        span {
          flex: 1;
        }
      }
      image {
        width: 33rpx;
        height: 31rpx;
        margin-right: 40rpx;
      }
    }
  }
}
</style>
