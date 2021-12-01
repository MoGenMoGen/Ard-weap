<template>
  <div class="logistic">
    <div class="info">
      <p>快递公司：{{info.com}}</p>
      <p>快递单号：{{info.nu}}</p>
    </div>
    <i-steps direction="vertical" class="list">
      <i-step :icon="item.icon" v-for="(item,index) in list"  :key="index" :status="item.status" i-class="process">
        <view slot="title" i-class="title">
          <p class="title">{{item.time}}</p>
        </view>
        <view slot="content" i-class="content">
          <p class="content">{{item.context}}</p>
        </view>
      </i-step>

    </i-steps>
  </div>
</template>

<script>
export default {
  data(){
    return {
      info:{},
      logCd:'',
      list:[],
    }
  },
  onLoad(options){
    if(options.id){
      console.log('1')
      this.id = options.id
      this.getInfo()
    }
    if(options.com){
      console.log('2')
      this.info.com = options.com
      this.info.nu = options.num
      this.info.cd = options.cd
      this.getLogInfo()
    }

  },
  mounted(){

  },
  methods:{
    async getLogInfo(){
      this.list = await this.api.getLogInfo({num:this.info.num,com:this.info.cd})
      console.log(this.list)
    },
    async getInfo(){
      this.info = await this.api.logistics(this.id)
    console.log(this.info)
      let list = this.info.data
      list.forEach((item,index)=>{
        if(index==0){
          item.status = 'process'
          item.icon = 'collection_fill'
        }else {
          item.icon = 'right'
        }
      })
      this.list = list
    },
  }
}
</script>

<style lang="less">
  @import url("../../../css/common.less");
  .logistic{
    width: 100%;
    .info{
      background: #ffffff;
      padding: 35rpx 42rpx;
      line-height: 50rpx;
      border-bottom: 1rpx solid @borderColor;
      margin-bottom: 40rpx;
    }
    .process{
      .title{
        color: #666666;
        font-size: 26rpx;
        font-weight: normal;
      }
      .content{
        font-size: 30rpx;
        color: #333333;
        font-weight: normal;
        padding-right: 30rpx;
      }
    }
  }
</style>
