<template>
  <div class="jlink-operate" v-show="visible">
    <div class="jlink-operate-mask"></div>
    <div class="jlink-operate-detail">
      <div class="jlink-operate-title">
        {{title}}
        <i class="iconfont" @click="toCloseDialog('cancel')">&#xe7c6;</i>
      </div>
      <div class="note">请确认此报备为无效报备</div>
      <div class="jlink-operate-content-two">
        <textarea placeholder="请输入审核不通过原因" v-model="param.checkRemark" maxheight="100" autoheight placeholder-style="color:#999;" fixed="true"></textarea>
      </div>
      <div
        class="jlink-operate-btn"
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
        reportResult: 0,
        type: "",
        checkRemark:''
      }
    };
  },
  onUnload() {
    this.param = {
      reportResult: 0,
      type: "",
      checkRemark:''
    };
  },
  methods: {
    reportResultChange(e) {
      this.param.reportResult = e.mp.detail.value;
      this.buyItems.forEach((item, index) => {
        if (index == e.mp.detail.value) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        this.$set(this.buyItems, index, item);
      });
    },
    toCloseDialog(type) {
      this.param.type = type;
      console.log('confirm')
      console.dir(this.param)
      this.$emit("close", this.param);
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../css/common.less");
.jlink-operate-mask {
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
.jlink-operate-detail {
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
  .jlink-operate-title {
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
  .note {
    margin: 30rpx;
  }

  .jlink-operate-content-two {
    margin: 30rpx;
    border: 1rpx solid #dfdfdf;
    textarea {
      height: 160rpx;
      padding: 10rpx;
    }
  }
}
.jlink-operate-btn {
  padding: 30rpx 0 30rpx 0;
  border: 0;
  border-bottom-left-radius: 16rpx;
  border-bottom-right-radius: 16rpx;
  text-align: center;
  background-color: @backgroundColor;
}
</style>
