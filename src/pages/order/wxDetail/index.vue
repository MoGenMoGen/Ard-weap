<template>
  <div class="wxDetail">
      <div class="tab">
        <p :class="{active:item.cd===type}" v-for="item in tabList" @click="type=item.cd" :key="item.cd">{{item.nm}}</p>
      </div>
      <div class="detailMain">
        <order-detail :info="info" :totalNum="totalNum" v-if="type===1"></order-detail>
        <div class="logList" v-if="type===2">
          <div v-for="item in logList" :key="item.nu" @click="toLogistics(item)">
            <p>快递公司：{{item.name}}</p>
            <p>快递单号：{{item.nu}}</p>
            <p v-if="item.message!=='ok'">{{item.message}}</p>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import orderDetail from '@/components/orderDetail'
  import query from "../../../utils/query";
  export default {
    data(){
      return {
        logList:[],
        tabList:[{
          nm:'订单详情',
          cd:1,
        },{
          nm:'物流信息',
          cd:2,
        }],
        type:2,
        id:'',
        info:{},
        totalNum:0,
      }
    },
    onLoad(options){
      this.id = options.id
      this.getInfo()
      this.getLog()
    },
    components:{
      orderDetail
    },
    methods:{
      async getInfo(){
        this.info = await this.api.orderDetail(this.id)
        this.totalNum = this.info.orderItemList.reduce((p,n)=>{
          return p+n.orderNum
        },0)

      },
      async getLog(){
        let comp = await this.api.getLogComp()
        let qry = this.query.new();
        this.query.toW(qry, "orderId",this.id, "EQ");
        this.logList = await this.api.getLogList(encodeURIComponent(this.query.toJsonStr(qry)))
        this.logList.forEach((item,index)=>{
            comp.forEach(v=>{
              if(v.cd===item.com){
                item.name = v.nm
                this.$set(this.logList,index,item)
              }
            })
        })
      },
      toLogistics(item){
        let url = ''
        if(item){
          url = '/pages/order/logistics/main?num='+item.nu+'&com='+item.name+'&cd='+item.com
        }else {
           url = '/pages/order/logistics/main?id='+this.id
        }
        this.until.aHref(url)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url("../../../css/common.less");
  .wxDetail{
    width: 100%;
    height: 100%;
    display: flex;
    display: -webkit-flex;
    background: @backgroundColor;
    flex-direction: column;
    .tab{
      width: 100%;
      display: flex;
      display: -webkit-flex;
      margin-bottom: 0.2rem;
      p{
        flex: 1;
        text-align: center;
        padding: 0.3rem 0;
        border-bottom: 1px solid @borderColor;
        background: #ffffff;
      }
      p.active{
        color: @color;
        border-bottom: 1px solid @color;
      }
    }
    .detailMain{
      border-top: 1px solid @borderColor;
      flex: 1;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      .logList{
        div{
          padding: 20px;
          background: #ffffff;
          border-bottom: 1px solid @borderColor;
          p{
            line-height: 50rpx;
          }
        }
      }
    }
  }
</style>
