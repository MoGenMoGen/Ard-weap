<template>
  <div class="order">
    <div class="search">
      <div>
        <span class="iconfont">&#xe600;</span>
        <input v-model="key" placeholder="订单编号查询" type="text" confirm-type="搜索" @confirm="search"/>
      </div>
    </div>
    <div class="menu">
      <p>订单编号</p>
      <p>订单金额</p>
      <p>已付</p>
      <p>待付</p>
    </div>
    <scroll-view
      class="list"
      scroll-y="ifLoad"
      @scrolltolower="getMore"
      scroll-top="100"
    >
      <div class="content" @click="toPage(item.id)" v-for="item in list" :key="item.id">
        <p>{{item.erpCode}}</p>
        <p>{{item.orderAmount}}</p>
        <p>{{item.orderPayedAmount}}</p>
        <p>{{item.payAmount}}</p>
      </div>
      <p class="noData" v-if="list.length==total">数据已加载完</p>
    </scroll-view>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        pageSize:10,
        pageNum:1,
        total:0,
        ifLoad:true,
        userInfo:{},
        list:[],
        key:'',
      }
    },
    async onShow(){
      this.userInfo = await this.api.getSysUserInfo()
       this.getList()
    },
    onUnload(){
      this.list=[]
    },
    methods:{
      search(){
        this.pageNum=1
        this.list = []
        this.getList()
      },
      getList(){
        let param = {
          erpCode:this.key,
          pageSize:this.pageSize,
          pageNum:this.pageNum,
          buyId:this.userInfo.userId,
        }
        this.api.payStatusList(param).then(res=>{
          this.list.push(...res.data.result)
          this.total = res.data.total
        })
      },
      getMore(){
        if(this.list.length<this.total){
          this.pageNum++
          this.getList()
        }else {
          this.ifLoad = false
        }
      },
      toPage(id){
        let url = '/pages/order/detail/main?id='+id
        this.until.aHref(url)
      },
    }
  }
</script>

<style lang="less" scoped>
  @import url("../../../css/common.less");
  .order{
    width: 100%;
    height: 100%;
    display: flex;
    display: -webkit-flex;
    background: @backgroundColor;
    flex-direction: column;
    .search{
      padding: 36rpx;
      background: #ffffff;
      border-bottom: 1px solid @borderColor;
      >div{
        width: 100%;
        height: 80rpx;
        line-height: 80rpx;
        border: 1px solid #DDDDDD;
        border-radius: 41rpx;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        span{
          margin-left: 35rpx;
          margin-right: 10rpx;
        }
        input{
          flex: 1;
        }
      }
    }
    .menu{
      width: 100%;
      display: flex;
      display: -webkit-flex;
      border-bottom: 1rpx solid @borderColor;
      p{
        height: 94rpx;
        line-height: 94rpx;
        font-size: 24rpx;
        text-align: center;
        flex: 1;
        color: #999999;
      }
    }
    .list{
      flex: 1;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      width: 100%;
      border-top: 1px solid @borderColor;
      font-size: 26rpx;
      color: #666666;
      .noData{
        text-align: center;
        padding: 30rpx 0;
      }
      .content{
        border-bottom: 1rpx solid @borderColor;
        background: #ffffff;
        width: 100%;
        display: flex;
        display: -webkit-flex;
        p{
          flex: 1;
          height: 96rpx;
          line-height: 96rpx;
          text-align: center;
        }
      }
    }
  }
</style>
