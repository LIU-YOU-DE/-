<template>
  <div style="width:90%;margin:0 auto;">
    <div style="width:80%;display:flex;margin:0 auto;margin-top:20px;" >
      <div class="yuan"><svg-icon id="svg" icon-class="g" class-name="card-panel-icon svg"/></div>
      <div class="xian"></div>
      <div class="yuan"><svg-icon id="svg2" icon-class="g" class-name="card-panel-icon "/></div>
      <div class="xian"></div>
      <div class="yuan"><svg-icon id="svg2" icon-class="g" class-name="card-panel-icon "/></div>
    </div>
    <div style="width:83%;display:flex;margin:0 auto;justify-content:space-between;" >
      <p style="margin-left:10px;" class="title">提交订单</p>
      <p class="title">支付订单</p>
      <p style="margin-right:30px;" class="title">完成</p>
    </div>
    <div style="width:88%;display:flex;margin:0 auto;justify-content:space-between;" >
      <p class="title2" style="text-align:left;width:22%;">{{createTime}}</p>
      <p class="title2" style="width:19%;">{{payTime}}</p>
      <p class="title2"style="text-align:right;width:20%;">{{finishTime}}</p>
    </div>
    <div class="tabletop"style="position:relative;margin-bottom:20px;">
      <span style="font-size:16px;color:red;display:inline-block;margin-top:20px;margin-left:20px;" v-if="status==1">当前订单状态：待付款</span>
      <span style="font-size:16px;color:red;display:inline-block;margin-top:20px;margin-left:20px;" v-if="status==2">当前订单状态：待发货</span>
      <span style="font-size:16px;color:red;display:inline-block;margin-top:20px;margin-left:20px;" v-if="status==3">当前订单状态：待收货</span>
      <span style="font-size:16px;color:red;display:inline-block;margin-top:20px;margin-left:20px;" v-if="status==4">当前订单状态：已完成</span>
      <span style="font-size:16px;color:red;display:inline-block;margin-top:20px;margin-left:20px;" v-if="status==5">当前订单状态：已取消</span>
      <div style="position:absolute;display:inline-block;right:0;margin-top:10px;margin-right:20px;">
        <el-button size="mini">刷新</el-button>
      </div>
      
    </div>

    <h3 class="table-title">详情</h3>
    <el-row type="flex" justify="space-around" :gutter="300"  class="colstyle">
      <el-col :span="8" style="display:flex;">
        <p class="orderTitle">订单号</p>
        <p>{{list[0].orderId}}</p>
      </el-col>
      <el-col :span="8" style="display:flex;">
        <p class="orderTitle">订单类型</p>
        <p>保养订单</p>
      </el-col>
      <el-col :span="8" style="display:flex;">
        <p class="orderTitle">用户账号</p>
        <p>{{list[0].memberId}}</p>
      </el-col>
    </el-row>

    <el-row type="flex" justify="space-around" :gutter="300"  class="colstyle">
      <el-col :span="8" style="display:flex;">
        <p style="margin-left:10px;" class="orderTitle">购买人姓名</p>
        <p>{{list[0].memberName}}</p>
      </el-col>
      <el-col :span="8" style="display:flex;">
        <p class="orderTitle">购买人电话</p>
        <p>{{list[0].memberPhone}}</p>
      </el-col>
      <el-col :span="8" style="display:flex;">
        <p class="orderTitle">订单金额</p>
        <p>{{list[0].orderAmount}}</p>
      </el-col>
    </el-row>

    <el-row type="flex" justify="space-around" :gutter="300" class="colstyle">
      <el-col :span="8" style="display:flex;">
        <p style="margin-left:10px;" class="orderTitle">支付金额</p>
        <p>{{list[0].payAmount}}</p>
      </el-col>
      <el-col :span="8" style="display:flex;">
        <p class="orderTitle">支付方式</p>
        <el-tag v-if="list[0].payType==1">微信支付</el-tag>
        <el-tag v-if="list[0].payType==2">其他暂定</el-tag>
      </el-col>
      <el-col :span="8" style="display:flex;">
        <p class="orderTitle">下单时间</p>
        <p>{{createTime}}</p>
      </el-col>
    </el-row>

    <el-row type="flex" justify="space-around" :gutter="300"  style="margin-bottom:30px;"  class="colstyle">
      <el-col :span="8" style="display:flex;">
        <p class="orderTitle" style="margin-left:10px;">支付时间</p>
        <p>{{list[0].payTime}}</p>
      </el-col>
      <el-col :span="8" style="display:flex;">
        <p class="orderTitle">完成时间</p>
        <p>{{list[0].finishTime}}</p>
      </el-col>
      <el-col :span="8" style="display:flex;">
        
      </el-col>
    </el-row>
  

    <h3 class="table-title">门店信息</h3>
    <el-row type="flex" justify="space-around" :gutter="300" class="colstyle">
      <el-col :span="8" style="display:flex;">
        <p class="orderTitle">门店缩略图</p>
        <img :src="list[0].cover" alt="" style="width:100px;">
      </el-col>
      <el-col :span="8" style="display:flex;">
        <p class="orderTitle">名称</p>
        <p>{{list[0].merchantName}}</p>
      </el-col>
      <el-col :span="8" style="display:flex;">
        <p class="orderTitle">号码</p>
        <p>{{list[0].memberPhone}}</p>
      </el-col>
    </el-row>

    <el-row type="flex" justify="space-around" :gutter="300" class="colstyle">
      <el-col :span="8" style="display:flex;">
        <p class="orderTitle">地址</p>
        <p>{{list[0].merchantAddress}}</p>
      </el-col>
      <el-col :span="8" style="display:flex;">
        <p class="orderTitle">产品名称</p>
        <p>{{list[0].productTitle}}</p>
      </el-col>
      <el-col :span="8" style="display:flex;">
        <p class="orderTitle">产品价格</p>
        <p>{{list[0].payAmount}}</p>
      </el-col>
    </el-row>

    <el-row type="flex" justify="space-around" :gutter="300" class="colstyle">
      <el-col :span="8" style="display:flex;">
        <p class="orderTitle">产品介绍</p>
        <p v-for="(item,i) in content">{{item}}</p>
      </el-col>
      <el-col :span="8" style="display:flex;">
        <p class="orderTitle">备注</p>
        <p>{{list[0].remark}}</p>
      </el-col>
      <el-col :span="8" style="display:flex;">
      
      </el-col>
    </el-row>

  </div>
</template>
<script>
import { detailOrder, } from "@/api/order";
export default {
  data(){
    return {
      content:[],
      type:undefined,
      id:undefined,
      status:undefined,
      createTime:null,
      payTime:null,
      finishTime:null,
      list:[]
    }
  },
  created(){
    this.getlist()
  },
  methods:{
    goLogistics(){
      this.$router.push({path:'/test-goods/test-orderLogistics',query:{id:this.id}})
    },
    getlist(){
      this.type=this.$route.query.type
      this.status=this.$route.query.status
      detailOrder(this.$route.query.id).then(response=>{
         this.list=[response.data.data]
         this.createTime=this.list[0].createTime
         this.payTime=this.list[0].payTime
         this.finishTime=this.list[0].finishTime
         this.content=this.list[0].content
       })
    }
  },
}
</script>
<style scoped>
.colstyle{
  font-size:15px;
  color:#666;
}
.orderTitle{
  margin-right:50px;
  margin-left:10px;
  width:100px;
}
.title2{
  text-align: center;
  font-size:16px;
  color:#666;
}
.title{
  font-size:16px;
  color:#666;
}
.xian{
  width:570px;
  border-top:2px solid #1ABC9C;
  margin-top:25px;
}
.yuan{
  width:60px;
  height:60px;
  border:4px solid #1ABC9C;
  border-radius: 50%;
  text-align: center;
  line-height: 60px;
}
#svg{
  width:30px;
  height:30px;
  color:#1ABC9C;
}
#svg2{
  width:30px;
  height:30px;
  margin-top:5px;
  color:#1ABC9C;
}
.tabletop{
  height:50px;
  width:100%;
  background-color:#F3F3F3;
  margin-top:20px;
}
.svg{
  margin-right:5px;
}
.table-title{
  display:inline-block;
  margin-left:10px;
  margin-top:20px;
  color:#555;
  margin-right:75%;
  font-size:18px;
}
</style>