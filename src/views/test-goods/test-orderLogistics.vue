<template>
    <div class="box">
        <el-button @click="goback" style="margin-top:20px;">返回</el-button> 
            <div class="tabletop">
            <p class="address">订单跟踪</p>
        </div>
        <div style="border:1px solid #DCDFE6;">
            <div style="width:70%;margin:0 auto;margin-top:20px;">
            <div class="ship-info">
            <div class="ship-text">快递公司名称：{{shipInfo.expressName}} </div> 
            <div class="ship-text">快递单号： {{shipInfo.logisticCode}} </div>  
            <div class="ship-text">状态: {{shipInfo.describe}} </div>   
        </div>
        <el-timeline :reverse="false">
            <el-timeline-item
              v-for="(item, index) in shipInfo.traces"
              :key="index"
              :timestamp="item.acceptTime">
              {{item.acceptStation}}
            </el-timeline-item>
        </el-timeline>
        </div>
        </div>
    </div>
</template>
<script>
import { detailOrder, } from "@/api/order";
import { queryShipInfo } from "@/api/liping";

export default {
    data(){
        return {
            shipInfo: Object,
            shipChannels: [
        {
          value: "STO",
          label: "申通快递"
        },
        {
          value: "YTO",
          label: "圆通速递"
        },
        {
          value: "YD",
          label: "韵达速递"
        },
        {
          value: "ZTO",
          label: "中通快递"
        },
        {
          value: "HTKY",
          label: "百世快递"
        },
        {
          value: "SF",
          label: "顺丰速运"
        },
        {
          value: "JD",
          label: "京东物流"
        },
        {
          value: "YZPY",
          label: "邮政快递包裹"
        },
        {
          value: "EMS",
          label: "EMS"
        },
        {
          value: "HHTT",
          label: "天天快递"
        },
        {
          value: "AMAZON",
          label: "亚马逊"
        },
        {
          value: "ZJS",
          label: "宅急送"
        }
      ],
            expressName:'1',
            logisticCode:'1',
            list:[],
            shipForm:{
                shipperCode:'',
                logisticCode:'',
            }
        }
            
    },
    created(){
        this.getlist()
    },
    methods:{
        goback(){
            this.$router.push({path:'/test-goods/test-orders'})
        },
        getlist(){
            detailOrder(this.$route.query.id).then(response=>{
                this.list=response.data.data
                this.shipForm.shipperCode=this.list.expressName
                this.shipForm.logisticCode=this.list.logisticCode
                for(var i=0;i<this.shipChannels.length;i++){
                    if(this.shipForm.shipperCode==this.shipChannels[i].label){
                        this.shipForm.shipperCode=this.shipChannels[i].value
                    }
                }
                queryShipInfo(this.shipForm).then(response=>{
                    this.shipInfo=response.data.data
                    this.shipInfo.traces = response.data.data.traces.reverse();
                })
            })
        },
    }
}
</script>
<style scoped>
.red{
    color:red;
}
.ship-text{
    margin-left: 40px;
    font-size: 18px;
    margin-bottom: 20px;
}
.box{
    width:90%;
    margin:0 auto;
}
.tabletop{
  border-top:1px solid #DCDFE6;
  border-left:1px solid #DCDFE6;
  border-right:1px solid #DCDFE6;
  height:50px;
  width:100%;
  background-color:#F3F3F3;
  margin-top:20px;
}
.address{
  font-size:18px;
  color:#666;
  margin-left:20px;
  font-weight:600;
}
</style>