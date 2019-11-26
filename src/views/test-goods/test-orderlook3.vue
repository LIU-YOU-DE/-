<template>
<div style="widtn:100%">
  <div style="width:90%;margin:0 auto;">
    <div style="width:80%;display:flex;margin:0 auto;margin-top:20px;" >
      <div class="yuan"><svg-icon id="svg" icon-class="g" class-name="card-panel-icon svg"/></div>
      <div class="xian"></div>
      <div class="yuan"><svg-icon id="svg2" icon-class="g" class-name="card-panel-icon "/></div>
      <div class="xian"></div>
      <div class="yuan"><svg-icon id="svg2" icon-class="g" class-name="card-panel-icon "/></div>
      <div class="xian"></div>
      <div class="yuan"  style="border:4px solid #ccc;"><svg-icon id="svg2" icon-class="time" class-name="card-panel-icon "/></div>
    </div>
    <div style="width:83%;display:flex;margin:0 auto;justify-content:space-between;" >
      <p style="margin-left:20px;" class="title">提交订单</p>
      <p class="title">支付订单</p>
      <p class="title" style="margin-right:20px;">平台发货</p>
      <p style="margin-right:40px;" class="title">完成</p>
    </div>
    <div style="width:88%;display:flex;margin:0 auto;justify-content:space-between;" >
      <p class="title2" style="text-align:left;width:22%;">{{createTime}}</p>
      <p class="title2" style="width:19%;">{{payTime}}</p>
      <p class="title2" style="width:25%;margin-left:60px;"></p>
      <p class="title2"style="text-align:right;width:20%;"></p>
    </div>
    <div class="tabletop"style="position:relative;">
       <span style="font-size:16px;color:red;display:inline-block;margin-top:20px;margin-left:20px;" v-if="status==1">当前订单状态：待付款</span>
      <span style="font-size:16px;color:red;display:inline-block;margin-top:20px;margin-left:20px;" v-if="status==2">当前订单状态：待发货</span>
      <span style="font-size:16px;color:red;display:inline-block;margin-top:20px;margin-left:20px;" v-if="status==3">当前订单状态：待收货</span>
      <span style="font-size:16px;color:red;display:inline-block;margin-top:20px;margin-left:20px;" v-if="status==4">当前订单状态：已完成</span>
      <span style="font-size:16px;color:red;display:inline-block;margin-top:20px;margin-left:20px;" v-if="status==5">当前订单状态：已取消</span>
      <div style="position:absolute;display:inline-block;right:0;margin-top:10px;margin-right:20px;">
        <el-button size="mini">刷新</el-button>
        <el-button size="mini" @click="goLogistics()">订单跟踪</el-button>
      </div>
      
    </div>

    <h3 class="table-title"><svg-icon icon-class="qi" class-name="card-panel-icon svg"/>基本信息</h3>
    <el-table border :data="list">
      <el-table-column align="center" label="订单编号" prop="orderId"></el-table-column>
      <el-table-column align="center" label="用户账号" prop="memberId"></el-table-column>
      <el-table-column align="center" label="订单类型" prop="type">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type==1">购车券订单</el-tag>
          <el-tag v-if="scope.row.type==2">积分礼品订单</el-tag>
          <el-tag v-if="scope.row.type==3">团购汽车订单</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单金额" prop="amount"></el-table-column>
      <el-table-column align="center" label="支付方式" prop="payType">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.payType==1">微信支付</el-tag>
          <el-tag v-if="scope.row.payType==2">其他</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="物流单号" prop="logisticCode"></el-table-column>
      <el-table-column align="center" label="物流公司" prop="expressName"></el-table-column>
      <el-table-column align="center" label="活动信息" prop="number"></el-table-column>
    </el-table>

    <h3 class="table-title"><svg-icon icon-class="qi" class-name="card-panel-icon svg"/>收货人信息</h3>
    <el-table border :data="list">
      <el-table-column align="center" label="收货人" prop="memberName"></el-table-column>
      <el-table-column align="center" label="手机号码" prop="memberPhoneNumber"></el-table-column>
      <el-table-column align="center" label="收货地址" prop="memberAddress"></el-table-column>
    </el-table>

    <h3 class="table-title"><svg-icon icon-class="qi" class-name="card-panel-icon svg"/>商品信息</h3>
    <el-table border :data="list">
      <el-table-column align="center" label="图片" prop="giftCoverUrl">
        <template  slot-scope="scope">
          <img :src="scope.row.giftCoverUrl" v-if="scope.row.giftCoverUrl" style="width:50px;">
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品名称" prop="giftName"></el-table-column>
      <el-table-column align="center" label="价格/货号" prop="giftNumber"></el-table-column>
      <el-table-column align="center" label="属性" prop="number"></el-table-column>
      <el-table-column align="center" label="数量" prop="number">
        <template  slot-scope="scope">
           <span>1</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="小计" prop="pointAmount"></el-table-column>
      <el-table-column align="center" label="合计" prop="number">
        <template  slot-scope="scope">
           <span>{{1*scope.row.pointAmount}}</span>
        </template>
      </el-table-column>
    </el-table>

    <h3 class="table-title"><svg-icon icon-class="qi" class-name="card-panel-icon svg"/>费用信息</h3>
    <el-table border :data="list">
      <el-table-column align="center" label="商品合计" prop="number"></el-table-column>
      <el-table-column align="center" label="运费" prop="number"></el-table-column>
      <el-table-column align="center" label="优惠券" prop="number"></el-table-column>
      <el-table-column align="center" label="活动优惠" prop="number"></el-table-column>
      <el-table-column align="center" label="原价" prop="number"></el-table-column>
      <el-table-column align="center" label="积分抵扣" prop="pointAmount"></el-table-column>
      <el-table-column align="center" label="订单总金额" prop="amount"></el-table-column>
      <el-table-column align="center" label="应付款金额" prop="payAmount"></el-table-column>
    </el-table>
  </div>
  </div>
</template>
<script>
import { detailOrder, } from "@/api/order";
export default {
  data(){
    return {
      id:undefined,
      status:undefined,
      createTime:null,
      payTime:null,
      orderlist:{},
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
       detailOrder(this.$route.query.id).then(response=>{
         this.status=this.$route.query.status
         this.list=[response.data.data]
         console.log(this.list)
         this.list.forEach((item,index)=>{this.orderlist[index] = item})
         this.id=this.orderlist[0].orderId
         this.createTime=this.orderlist[0].createTime
         this.payTime=this.orderlist[0].payTime
       })
    }
  },
}
</script>
<style scoped>
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
  width:350px;
  border-top:2px solid #1ABC9C;
  margin-top:25px;
}
.yuan{
  width:6%;
  overflow: hidden;;
  border:4px solid #1ABC9C;
  border-radius: 50%;
  text-align: center;
  line-height:40px;
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