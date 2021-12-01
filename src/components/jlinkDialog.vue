<template>
  <div class="jlink-dialog" v-show="visible">
    <div class="jlink-dialog-mask"></div>
    <div class="jlink-dialog-detail">
      <div class="jlink-dialog-title">
        {{title}}
        <i class="iconfont" @click="toCloseDialog('cancel')">&#xe7c6;</i>
      </div>
      <div class="jlink-dialog-content-two">
        <radio-group class="radio-group" @change="reportResultChange">
          <label class="radio" v-for="(item, index) in buyItems" :key="index">
            <radio :value="item.name" :checked="item.checked" />
            {{item.value}}
          </label>
        </radio-group>
      </div>
      <div
        class="jlink-dialog-operate"
        v-if="showOperate"
        @click="toCloseDialog('confirm')"
      >{{btnText}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    showOperate: {
      type: Boolean,
      default: true
    },
    content: {
      type: String,
      default: ""
    },
    btnText: {
      type: String,
      default: "确定"
    }
  },
  data() {
    return {
      param: {
        reportResult: "1",
        type: "",
      },
      buyItems: [
        { name: "1", value: "一报", checked: true },
        { name: "2", value: "二报", checked: false },
        { name: "3", value: "三报", checked: false }
      ]
    };
  },
  onUnload() {
    this.param = {
      reportResult: "1",
      type: ""
    };
    this.buyItems= [
      { name: "1", value: "一报", checked: true },
      { name: "2", value: "二报", checked: false },
      { name: "3", value: "三报", checked: false }
    ]
  },
  methods: {
    reportResultChange(e) {
      console.log(e.mp.detail.value)
      this.param.reportResult = e.mp.detail.value;
      this.buyItems.forEach((item, index) => {
        if (item.name == e.mp.detail.value) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        this.$set(this.buyItems, index, item);
      });
    },
    toCloseDialog(type) {
      this.param.type = type;
      console.log(this.param)
      this.$emit("close", this.param);
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../css/common.less");
.jlink-dialog-mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}
.jlink-dialog-detail {
  position: fixed;
  z-index: 2000;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 300px;
  background-color: #fff;
  box-sizing: border-box;
  border-radius: 16rpx;
  .jlink-dialog-title {
    position: relative;
    border: 0;
    border-top-left-radius: 16rpx;
    border-top-right-radius: 16rpx;
    padding: 40rpx;
    font-size: 34rpx;
    font-weight: 700;
    text-align: center;
    > i {
      position: absolute;
      right: 14rpx;
      top: 14rpx;
    }
  }

  .jlink-dialog-content-two {
    radio-group {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      padding: 20rpx 50rpx;
      label {
        flex: 1;
      }
    }
  }
}
.jlink-dialog-operate {
  padding: 30rpx 0 30rpx 0;
  border: 0;
  border-bottom-left-radius: 16rpx;
  border-bottom-right-radius: 16rpx;
  text-align: center;
  background-color: @backgroundColor;
}
</style>
