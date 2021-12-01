<template>
  <div class="list">
    <div class="list-item" v-for="item in list" :key="item.id" @click="toDetail(item.id)">
      <div class="content">
        <div>
          <p>
            <span>{{item.name}}</span>
            <span>{{item.linkPhone}}</span>
          </p>
          <p>{{item.unitName?item.unitName:'未填'}}</p>
        </div>
      </div>
      <img :src="tel" mode="widthFix" @click.stop="toCall(item.linkPhone)"/>
      <!--<span class="iconfont" >&#xe602;</span>-->
    </div>
  </div>
</template>

<script>
  import tel from '../../static/images/tel.png'
export default {
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  data(){
    return{
      tel,
    }
  },
  methods: {
    toCall(tel){
      wx.makePhoneCall({
        phoneNumber: tel //仅为示例，并非真实的电话号码
      })
    },
    toDetail(id){
      console.log('trigger click to detail')
      this.until.aHref(`../linkeddetail/main?id=${id}`)
    }
  },
};
</script>

<style lang="less" scoped>
.list {
  .list-item {
    position: relative;
    display: flex;
    display: -webkit-flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 40rpx;
    border-bottom: 1rpx solid #ddd;
    .content {
      display: flex;
      display: -webkit-flex;
      flex-flow: row nowrap;
      align-items: center;
      > div {
        flex: 1;
        display: flex;
        display: -webkit-flex;
        flex-flow: column wrap;
        p{
          flex: 1;
          &:nth-of-type(1){
            color: #666;
            font-size: 30rpx;
            span{
              &:nth-of-type(1){
                margin-right: 60rpx;
              }
            }
          }
          &:nth-last-of-type(1){
            margin-top: 20rpx;
            color: #999;
          }
        }
      }

    }
    img{
      width: 50rpx;
    }
  }
  > div {
    &:nth-last-of-type(1) {
      border-bottom: 0;
    }
  }
}
</style>
