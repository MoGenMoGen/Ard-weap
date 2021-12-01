<template>
  <div class="detail">
    <!-- 经销商隐藏 -->

    <div class="linked">
      <div v-for="item in regoinList" :key="item.nm">
        <span v-if="item.required" class="iconfont">&#xe69f;</span>
        <div>{{item.key}}</div>
        <div>{{item.value}}</div>
      </div>
    </div>
    <!-- 一报二报显示这个 -->
    <div class="operate">
      <button plain="true" @click="toEdit">编辑</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      regoinList: [
        {
          nm: "name",
          key: "姓名：",
          value: "张楠",
          required: false
        },
        {
          nm: "gender",
          key: "性别：",
          value: "男",
          required: false
        },
        {
          nm: "linkPhone",
          key: "联系电话：",
          value: "18852461247",
          required: false
        },
        {
          nm: "officePhone",
          key: "座机电话：",
          value: "0574-28870690",
          required: false
        },
        {
          nm: "fax",
          key: "传真电话：",
          value: `0574-28870690`,
          required: false
        },
        {
          nm: "unitName",
          key: "公司名称：",
          value: "宁波聚联科技有限公司",
          required: false
        },
        {
          nm: "unitAreaName",
          key: "公司地址：",
          value: "浙江省宁波市镇海区骆驼街道",
          required: false
        },
        {
          nm: "arddress",
          key: "详细地址：",
          value: "329创业社区212室",
          required: false
        },
        { nm: "remark", key: "备注：", value: "暂无", required: false }
      ]
    };
  },
  onLoad(options) {
    this.id = options.id;
  },
  onShow() {
    this.getLinkedInfo();
  },
  methods: {
    async getLinkedInfo() {
      let res = await this.api.getSysLinkedInfoById(this.id);
      this.regoinList.map(item => {
        item.value = res[item.nm] ? res[item.nm] : "";

        if (item.nm == "gender") {
          item.value = res[item.nm] === 1 ? "男" : "女";
        }
      });
    },
    toEdit() {
      this.until.aHref(`../linkedadd/main?type=edit&id=${this.id}`);
    }
  }
};
</script>

<style lang='less' scoped>
@import url("../../../css/common.less");
.detail {
  width: 100%;
  height: 100%;
  background-color: @backgroundColor;
  color: #666;
  font-size: 26rpx;
  .linked {
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
      div {
        &:nth-of-type(1) {
          width: 200rpx;
        }
        &:nth-last-of-type(1) {
          flex: 1;
        }
      }
    }
  }
  .regoin {
    padding-bottom: 100rpx;
  }
  .operate {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-flow: row nowrap;
    button {
      border: 0;
      flex: 1;
      height: 100rpx;
      line-height: 2;
      padding: 20rpx 0;
      background-color: @btnColor;
      color: #fff;
      font-size: 30rpx;
      text-align: center;
    }
  }
}
</style>
