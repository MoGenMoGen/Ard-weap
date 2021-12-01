<template>
  <div class="linked-add">
    <div class="search">
      <div>
        <text>姓名：</text>
        <input type="text" v-model="form.name" placeholder="请输入姓名" placeholder-style="color:#999;" />
      </div>
      <div>
        <text>性别：</text>
        <radio-group class="radio-group" @change="radioChange">
          <label class="radio" v-for="(item, index) in items" :key="index">
            <radio :value="item.name" :checked="item.checked" />
            {{item.value}}
          </label>
        </radio-group>
      </div>
      <div>
        <text>联系电话：</text>
        <input
          type="number"
          maxlength="11"
          v-model="form.linkPhone"
          placeholder="请输联系人电话"
          placeholder-style="color:#999;"
        />
      </div>
      <div>
        <text>座机电话：</text>
        <input
          type="text"
          v-model="form.officePhone"
          placeholder="请输入座机电话"
          placeholder-style="color:#999;"
        />
      </div>
      <div>
        <text>传真电话：</text>
        <input type="text" v-model="form.fax" placeholder="请输入传真电话" placeholder-style="color:#999;" />
      </div>
      <div>
        <text>公司名称：</text>
        <input
          type="text"
          v-model="form.unitName"
          placeholder="请输入公司名称"
          placeholder-style="color:#999;"
        />
      </div>
      <div>
        <text>公司地址：</text>
        <div class="addr">
          <addr-select @changeAddr="changeAddr" :disabled="disabled" ref="addr"></addr-select>
        </div>
      </div>
      <div>
        <text>详细地址：</text>
        <input
          type="text"
          v-model="form.arddress"
          placeholder="请输入详细地址"
          placeholder-style="color:#999;"
        />
      </div>
    </div>
    <div class="note">
      <div>
        <span>备注：</span>
        <p>
          <textarea
            v-model="form.remark"
            auto-height
            placeholder="编辑备注信息"
            placeholder-style="color:#999;"
            style="width:500rpx;"
          />
        </p>
      </div>
    </div>
    <!-- 新增 -->
    <div class="operate" v-if="type==='add'">
      <button plain="true" @click="confirm">确定</button>
    </div>
    <div class="operate-two" v-else>
      <button plain="true" @click="del">删除</button>
      <button plain="true" @click="confirm">保存</button>
    </div>
  </div>
</template>

<script>
import addrSelect from "@/components/addrSelect";
export default {
  data() {
    return {
      id: "",
      type: "add",
      items: [
        { name: 1, value: "男", checked: true },
        { name: 2, value: "女", checked: false }
      ],
      disabled: false,
      form: {
        devUserId: "",
        devUserName: "",
        name: "",
        gender: 1,
        linkPhone: "",
        officePhone: "",
        fax: "",
        unitName: "",
        unitAreaCode: "",
        unitAreaName: "",
        arddress: "", //地址
        remark: ""
      }
    };
  },
  onLoad(options) {
    console.log("options", options);
    this.type = options.type;
    this.id = options.id && options.id !== "undefined" ? options.id : "";
  },
  async onShow() {
    //edit type
    if (this.id) {
      let res = await this.api.getSysLinkedInfoById(this.id);
      this.form = res;
      this.$refs.addr.setAddr(res.unitAreaName);
      this.setRadioPicked(res.gender);
    }

    this.getUserInfo();
  },
  onUnload() {
    this.form = {
      devUserId: "",
      devUserName: "",
      name: "",
      gender: 1,
      linkPhone: "",
      officePhone: "",
      fax: "",
      unitName: "",
      unitAreaCode: "",
      unitAreaName: "",
      arddress: "", //地址
      remark: ""
    };
  },
  methods: {
    async getUserInfo() {
      this.userInfo = await this.api.getSysUserInfo();
      this.form.devUserId = this.userInfo.userId;
      this.form.devUserName = this.userInfo.realName;
    },
    //性别更改
    radioChange(e) {
      this.form.gender = e.mp.detail.value;
      console.log(this.form.gender);
      this.setRadioPicked(this.form.gender);
    },
    setRadioPicked(value) {
      this.items.forEach((item, index) => {
        if (item.name == value) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        this.$set(this.items, index, item);
      });
    },
    //地区更改
    changeAddr(addr) {
      console.log(addr);
      if (addr.area) {
        this.form.unitAreaName =
          addr.provice + "-" + addr.city + "-" + addr.area;
      } else {
        this.form.unitAreaName = addr.provice + "-" + addr.city;
      }
      console.log(this.form.unitAreaName);
      this.form.unitAreaCode = addr.code;
    },
    confirm() {
      if (this.id) {
        this.form.id = this.id;
      }
      let regPhone = this.reg.checkPhone(this.form.linkPhone);
      if (regPhone !== "ok") {
        this.until.showToast(regPhone, "none", 400);
        return;
      }

      this.api.customerSave(this.form);
    },
    del() {
      this.api.sysDelLinked(this.id);
    }
  },
  components: {
    addrSelect
  }
};
</script>

<style lang="less" scoped>
@import url("../../../css/common.less");
.linked-add {
  width: 100%;
  background-color: @backgroundColor;
  box-sizing: border-box;
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
        height: 100rpx;
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
  .note {
    margin-top: 20rpx;
    padding: 20rpx 40rpx;
    background-color: #fff;
    margin-bottom: 120rpx;
    font-size: 30rpx;
    > div {
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      span {
        flex: 0 0 auto;
        width: 120rpx;
      }
      p {
        padding: 10rpx;
        border: 1rpx solid #ddd;
        height: 200rpx;
      }
    }
  }
}
</style>
