<template>
  <div class="report-list">
    <div class="info">
      <p>
        <span>经销商名称：</span>
        {{ info.name }}
      </p>
      <p v-if="info.type == 1"><span>经销商类型：</span> 直营</p>
      <p v-if="info.type == 2"><span>经销商类型：</span> 省代</p>
      <p v-if="info.type == 3"><span>经销商类型：</span> 市代</p>
      <p>
        <span>上级名称：</span>
        {{ info.parentName ? info.parentName : "无" }}
      </p>
      <p>
        <span>单位名称：</span>
        {{ info.corpName ? info.corpName : "" }}
      </p>
      <p>
        <span>业务主管：</span>
        {{ info.groupLeaderName ? info.groupLeaderName : "" }}
      </p>
      <p>
        <span>所在区域：</span>
        {{ info.regionName }}
      </p>
      <p>
        <span>联系人：</span>
        {{ info.linkMan }}
      </p>
      <p>
        <span>联系电话：</span>
        {{ info.linkPhone }}
      </p>
      <p>
        <span>联系地址：</span>
        {{ info.address ? info.address : "" }}
      </p>
      <p>
        <span>服务有效期至：</span>
        {{ info.validTime }}
      </p>
    </div>
    <div class="data-list" v-if="total != 0">
      <!-- 只有当经销商类型为省代的时候才显示 -->
      <p class="total" v-if="info.type === 2">市代经销商数量：{{ total }}</p>
      <agent-list :list="info.children"></agent-list>
    </div>
  </div>
</template>

<script>
import agentList from "@/components/agentList";
export default {
  data() {
    return {
      info: {},
      total: 0,
      userInfo: {}
    };
  },
  onLoad(option) {
    this.id = option.id;
  },

  async onShow() {
    //判断层次
    let index = getCurrentPages().length;
    let id = this.until.seGet("agentId");
    if (id && index === 3) {
      this.id = id;
    }
    await this.getInfo();
  },
  onUnload() {
    let index = getCurrentPages().length;
    if (index === 3) {
      this.until.seRemove("agentId");
    }
  },
  methods: {
    async getInfo() {
      this.info = await this.api.getAgentDetail(this.id);
       this.info.validTime=this.info.validTime ? this.info.validTime.substring(0, 10) : "";
      if (this.info.type === 2) {
        this.until.seSave("agentId", this.id);
      }
      console.log(this.info);
      if (this.info.children) {
        this.total = this.info.children.length;
      }
    }
  },
  components: {
    agentList
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
  .info {
    padding: 20rpx 40rpx;
    background: #ffffff;
    border-bottom: 1px solid @borderColor;
    margin-bottom: 20rpx;
    p {
      padding: 10rpx 0;
      span {
        width: 200rpx;
      }
    }
  }
  .data-list {
    margin-top: 20rpx;
    background-color: #fff;
    .total {
      border-bottom: 1px solid @borderColor;
      border-top: 1px solid @borderColor;
      padding: 20rpx 40rpx;
      background: @backgroundColor;
    }
  }
}
</style>
