<template>
  <div class="addrSelect">
    <picker
      mode="multiSelector"
      @change="changeAddr"
      @columnchange="ColumnChange"
      range-key="name"
      :disabled="disabled"
      :value="cityIndex"
      :range="cityArray"
    >
      <p v-if="myAddr">{{myAddr}}</p>

      <view class="picker" v-if="!myAddr && addr.provice">
        <span>{{addr.provice}}</span>
        <span>{{addr.city}}</span>
        <span>{{addr.area}}</span>
      </view>
      <view class="picker" v-if="!myAddr && !addr.provice">
        <span>省</span>
        <span>市</span>
        <span>区</span>
      </view>
      <span class="iconfont">&#xe60f;</span>
    </picker>
  </div>
</template>

<script>
export default {
  props: ["disabled"],
  data() {
    return {
      myAddr: "",
      addr: {
        provice: "",
        city: "",
        area: ""
      },
      cityArray: [
        [
          {
            name: "北京",
            cd: "001"
          },
          {
            name: "河南",
            cd: "002"
          }
        ],
        [
          {
            name: "北京1",
            cd: "0011"
          },
          {
            name: "北京2",
            cd: "0012"
          }
        ],
        [
          {
            name: "北京11",
            cd: "0111"
          },
          {
            name: "北京12",
            cd: "0112"
          }
        ]
      ],
      cityIndex: [0, 0, 0]
    };
  },
  created(){
     this.getProvice2()
  },
  mounted() {
    // this.getProvice();
  },
  onShow() {
    this.addr = {
      provice: "",
      city: "",
      area: ""
    };
    this.myAddr = "";
    this.cityIndex = [0, 0, 0];
    this.getProvice2()
  },
  methods: {
    async getProvice2(){
      this.cityArray[0] = await this.api.getAddr2()
      console.log(this.cityArray[0])
      this.$set(this.cityArray, 0, this.cityArray[0]);
      this.getCity2(this.cityArray[0][0].code)
    },
    async getCity2(cd){
      console.log('===========')
      let info = this.cityArray[0].find(item=>item.code==cd)
      if(info.children){
        this.cityArray[1] = info.children
        this.$set(this.cityArray, 1, this.cityArray[1]);
        this.getCountry2(this.cityArray[1][0].code)
      }else {
        this.cityArray[1] = []
        this.$set(this.cityArray, 1, this.cityArray[1]);
        this.cityArray[2] = []
        this.$set(this.cityArray, 2, this.cityArray[2]);
      }


    },
    async getCountry2(cd){
      let info = this.cityArray[1].find(item=>item.code==cd)
      this.cityArray[2] = info.children ? info.children : []
      this.$set(this.cityArray, 2, this.cityArray[2]);

    },
    setAddr(data) {
      this.myAddr = data;
      // let myData = data.split('-')
      // this.addr.provice = myData[0]
      // this.addr.city = myData[1]
      // this.addr.area = myData[2] ? myData[2] : ''
    },
    async getProvice() {
      let res = await this.api.getAddr();

      this.cityArray[0] = this.interatorRegion(res);
      // console.dir(this.cityArray[0]);
      this.getCity(this.cityArray[0][0].id);
    },
    async getCity(id) {
      // console.log("城市id:" + id);
      let res = await this.api.getAddr({ pid: id });
      this.cityArray[1] = this.interatorRegion(res);
      this.$set(this.cityArray, 1, this.cityArray[1]);
      // console.log(this.cityArray[1]);
      if (this.cityArray[1].length == 0) {
        console.log("市区为空");
        this.cityArray[2] = [];
      } else {
        this.getCountry(this.cityArray[1][0].id);
      }
    },
    async getCountry(id) {
      // console.log("城镇id:" + id);
      let res = await this.api.getAddr({ pid: id });
      this.cityArray[2] = this.interatorRegion(res);

      this.$set(this.cityArray, 2, this.cityArray[2]);
    },
    interatorRegion(res) {
      let arr = [];
      res.map(item => {
        arr.push(item.crmRegionVo);
      });
      return arr;
    },
    //确定后
    changeAddr(e) {
      this.cityIndex = e.mp.detail.value;
      this.addr.provice = this.cityArray[0][this.cityIndex[0]].name;
      this.addr.code = this.cityArray[0][this.cityIndex[0]].code;
      //选择台湾省这种
      if (this.cityArray[1][this.cityIndex[1]]) {
        this.addr.city = this.cityArray[1][this.cityIndex[1]].name;
        this.addr.code += `/${this.cityArray[1][this.cityIndex[1]].code}`;
      }else {
        this.addr.city = ''
      }
      //北京、天津这种
      if (this.cityArray[2][this.cityIndex[2]]) {
        this.addr.area = this.cityArray[2][this.cityIndex[2]].name;
        this.addr.code += `/${this.cityArray[2][this.cityIndex[2]].code}`;
      }else {
        this.addr.area = ''
      }
      console.log(this.addr)
      this.$emit("changeAddr", this.addr);
    },
    //选择某个地址后下级地址跟着改变
    ColumnChange(e) {
      const data = {
        multiArray: this.cityArray,
        multiIndex: this.cityIndex
      };
      data.multiIndex[e.mp.detail.column] = e.mp.detail.value;
      switch (e.mp.detail.column) {
        case 0: //第一列变化
          console.log("1");
          this.cityIndex[1] = 0;
          this.getCity2(this.cityArray[0][e.mp.detail.value].code);
          break;
        case 1: //第二列变化
          console.log(2);
          this.cityIndex[2] = 0;
          this.getCountry2(this.cityArray[1][e.mp.detail.value].code);
          break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.addrSelect {
  width: 100%;
  .picker {
    width: 100%;
    display: flex;
    display: -webkit-flex;
    span {
      flex: 1;
    }
  }
  picker {
    position: relative;
    height: 100%;
    .iconfont {
      position: absolute;
      right: 40rpx;
      top: 0;
    }
  }
}
</style>
