<template>
  <div class="input-content">
    <div class="searchComp" v-if="searchShow">
      <div class="content">
        <span class="iconfont" @click="searchShow=false">&#xe7c6;</span>
        <input placeholder="请输入联系人" v-model="compName" maxlength="100" />
        <div class="list" v-if="linkedList.length>0">
          <p
            v-for="(item,index) in linkedList"
            :key="index"
            @click="chooseComp(item)"
          >{{item.name+' (电话：'+item.linkPhone+')'}}</p>
        </div>
        <p class="noData" v-else>— 没有相关数据 —</p>
      </div>
    </div>
    <div class="input">
      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>线索类型：</text>
        <picker @change="changeClubType" :range="clubTypeList" range-key="nm">
          <view class="picker">{{clubTypeNm?clubTypeNm:'请选择线索类型'}}</view>
          <span class="iconfont">&#xe60f;</span>
        </picker>
      </div>
      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>经营的品牌及品类:</text>
        <input
          type="text"
          v-model="form.bussinessBrand"
          placeholder="请输入经营的品牌及品类"
          placeholder-style="color:#999;"
        />
      </div>
      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>店面形式：</text>
        <picker @change="changeShopType" :range="shopTypeList" range-key="nm">
          <view class="picker">{{shopTypeNm?shopTypeNm:'请选择店面形式'}}</view>
          <span class="iconfont">&#xe60f;</span>
        </picker>
      </div>
      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>姓名：</text>
        <button plain="true" @click="searchShow=true">{{form.linkMan?form.linkMan:'请输入姓名'}}</button>
        <i class="iconfont" @click="toPage('../../personal/linkedadd/main?type=add')">&#xe605;</i>
      </div>
      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>联系方式：</text>
        <input
          type="number"
          maxlength="11"
          v-model="form.linkPhone"
          placeholder="请输入联系电话或者微信"
          placeholder-style="color:#999;"
        />
      </div>
      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>联系地址：</text>
        <div class="addr">
          <addr-select @changeAddr="changeAddr" :disabled="disabled" ref="addr"></addr-select>
        </div>
      </div>
      <div>
        <span class="iconfont">&#xe69f;</span>
        <text>详细地址：</text>
        <input
          type="text"
          v-model="form.address"
          placeholder="请输入联系地址"
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

export default {
  data() {
    return {
      clubTypeNm: "",
      shopTypeNm: "",
      clubTypeList: [
        { id: "1", name: "A类 优质资源 " },
        { id: "2", name: "B类 一般资源" }
      ],
      shopTypeList: [],
      disabled: false,
      searchShow: false,
      linkedList: [],
      userInfo: {},
      form: {
        clueType: "",
        bussinessBrand: "",
        shopType: "",
        linkMan: "",
        linkPhone: "",
        address: "",
        areaCode: "",
        areaName: "",
        devUserId: "4576941309940736",
        // extUserIds: "4577044895765504",
        devUserType: "1"
      }
    };
  },
  async onShow() {
    this.shopTypeList = await this.api.getType("shopType");
    this.clubTypeList = await this.api.getType("clueType");
    console.log(this.shopTypeList);
    await this.getUserInfo();
    await this.getCustomer();
  },
  onUnload() {
    this.form = {
      clueType: "",
      bussinessBrand: "",
      shopType: "",
      linkMan: "",
      linkPhone: "",
      address: "",
      areaCode: "",
      areaName: "",
      devUserId: "",
      devUserType: ""
    };
    this.clubTypeNm = "";
    this.shopTypeNm = "";
    this.searchShow = false;
  },
  watch: {
    compName: function(val) {
      this.getLinkedList();
    }
  },
  methods: {
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();
      this.form.devUserId = this.userInfo.userId;
      this.form.devUserType = this.userInfo.userType;
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
        this.form.areaName = addr.provice + "-" + addr.city + "-" + addr.area;
      } else {
        this.form.areaName = addr.provice + "-" + addr.city;
      }
      console.log(this.form.areaName);
      this.form.areaCode = addr.code;
    },
    chooseComp(item) {
      this.form.linkMan = item.name;
      this.form.linkPhone = item.linkPhone;
      this.$refs.addr.setAddr(item.unitAreaName);
      //
      this.form.areaName = item.unitAreaName;
      this.form.areaCode = item.unitAreaCode;
      this.searchShow = false;
    },
    changeClubType(e) {
      let index = e.mp.detail.value;
      this.clubTypeNm = this.clubTypeList[index].nm;
      this.form.clueType = this.clubTypeList[index].cd;
    },
    changeShopType(e) {
      let index = e.mp.detail.value;
      this.shopTypeNm = this.shopTypeList[index].nm;
      this.form.shopType = this.shopTypeList[index].cd;
    },
    toPage(url) {
      this.until.aHref(url);
    },
    verifyForm() {
      let arr = [
        { clueType: "线索类型" },
        { bussinessBrand: "品牌及品类" },
        { shopType: "店面形式" },
        { linkMan: "姓名" },
        { linkPhone: "联系方式" },
        { address: "详细地址" },
        { areaName: "联系地址" }
      ];

      return this.until.requireVerify(this.form, arr);
    },
    confirm() {
      let msg = this.verifyForm();
      if (msg) {
        this.until.showToast(msg, "none", 400);
      } else {
        let regPhone = this.reg.checkPhone(this.form.linkPhone);
        if (regPhone !== "ok") {
          this.until.showToast(regPhone, "none", 400);
          return;
        }
        this.api.sysMarketDevSave(this.form);
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
      > text {
        width: 250rpx;
      }
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
    }
  }
}
</style>
