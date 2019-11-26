<template>
  <div style="width:90%;margin:0 auto;">
    <!-- 1 -->
    <div style="width:80%;display:flex;margin:0 auto;margin-top:20px;" v-if="status==1">
      <div class="yuan"><svg-icon id="svg" icon-class="g" class-name="card-panel-icon svg"/></div>
      <div class="xian"></div>
      <div class="yuan"style="border:4px solid #ccc;"><svg-icon id="svg2" icon-class="time" class-name="card-panel-icon "/></div>
      <div class="xian" ></div>
      <div class="yuan"style="border:4px solid #ccc;"><svg-icon id="svg2" icon-class="time" class-name="card-panel-icon "/></div>
      <div class="xian"></div>
      <div class="yuan" style="border:4px solid #ccc;"><svg-icon id="svg2" icon-class="time" class-name="card-panel-icon "/></div>
    </div>
    <!-- 2 -->
    <div style="width:80%;display:flex;margin:0 auto;margin-top:20px;" v-if="status==2">
      <div class="yuan"><svg-icon id="svg" icon-class="g" class-name="card-panel-icon svg"/></div>
      <div class="xian"></div>
      <div class="yuan"><svg-icon id="svg2" icon-class="g" class-name="card-panel-icon "/></div>
      <div class="xian" ></div>
      <div class="yuan"style="border:4px solid #ccc;"><svg-icon id="svg2" icon-class="time" class-name="card-panel-icon "/></div>
      <div class="xian"></div>
      <div class="yuan" style="border:4px solid #ccc;"><svg-icon id="svg2" icon-class="time" class-name="card-panel-icon "/></div>
    </div>
    <!-- 3 -->
      <div style="width:80%;display:flex;margin:0 auto;margin-top:20px;" v-if="status==3">
      <div class="yuan"><svg-icon id="svg" icon-class="g" class-name="card-panel-icon svg"/></div>
      <div class="xian"></div>
      <div class="yuan"><svg-icon id="svg2" icon-class="g" class-name="card-panel-icon "/></div>
      <div class="xian" ></div>
      <div class="yuan"><svg-icon id="svg2" icon-class="g" class-name="card-panel-icon "/></div>
      <div class="xian"></div>
      <div class="yuan" style="border:4px solid #ccc;"><svg-icon id="svg2" icon-class="time" class-name="card-panel-icon "/></div>
    </div>
    <!-- 4 -->
    <div style="width:80%;display:flex;margin:0 auto;margin-top:20px;" v-if="status==4">
      <div class="yuan"><svg-icon id="svg" icon-class="g" class-name="card-panel-icon svg"/></div>
      <div class="xian"></div>
      <div class="yuan"><svg-icon id="svg2" icon-class="g" class-name="card-panel-icon "/></div>
      <div class="xian" ></div>
      <div class="yuan"><svg-icon id="svg2" icon-class="g" class-name="card-panel-icon "/></div>
      <div class="xian"></div>
      <div class="yuan"><svg-icon id="svg2" icon-class="g" class-name="card-panel-icon "/></div>
    </div>
    <div style="width:83%;display:flex;margin:0 auto;justify-content:space-between;" >
      <p style="margin-left:15px;" class="title">提交订单</p>
      <p class="title">支付订单</p>
      <p class="title" style="margin-right:10px;">平台发货</p>
      <p style="margin-right:30px;" class="title">完成</p>
    </div>
    <div style="width:88%;display:flex;margin:0 auto;justify-content:space-between;" >
      <p class="title2" style="text-align:left;width:22%;">{{createTime}}</p>
      <p class="title2" style="width:19%;">{{payTime}}</p>
      <p class="title2" style="width:25%;margin-left:60px;"></p>
      <p class="title2"style="text-align:right;width:20%;">{{finishTime}}</p>
    </div>
    <template slot-scope="scope">
        <span v-if="scope.row.orderStatus==1">未核销</span>
        <span v-if="scope.row.orderStatus==2">已核销(订单完成)</span>
        <span v-if="scope.row.orderStatus==3">(订单失效)活动已过期</span>
        <span v-if="scope.row.orderStatus==4">用户已取消订单</span>
        <span v-if="scope.row.orderStatus==5">管理员取消订单</span>
        <span v-if="scope.row.orderStatus==6">审核凭证中</span>
      </template>
    <div class="tabletop" style="position:relative;">    
      <span style="font-size:16px;color:red;display:inline-block;margin-top:20px;margin-left:20px;" v-if="status==1">当前订单状态：待付款</span>
      <span style="font-size:16px;color:red;display:inline-block;margin-top:20px;margin-left:20px;" v-if="status==2">当前订单状态：待发货</span>
      <span style="font-size:16px;color:red;display:inline-block;margin-top:20px;margin-left:20px;" v-if="status==3">当前订单状态：待收货</span>
      <span style="font-size:16px;color:red;display:inline-block;margin-top:20px;margin-left:20px;" v-if="status==4">当前订单状态：已完成</span>
      <span style="font-size:16px;color:red;display:inline-block;margin-top:20px;margin-left:20px;" v-if="status==5">当前订单状态：已取消</span>
      <div style="position:absolute;display:inline-block;right:0;margin-top:10px;margin-right:20px;">
        <el-button size="mini" @click="finishOrder">核销订单</el-button>
        <el-button size="mini" @click="removeOrder">取消订单</el-button>
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
      <el-table-column align="center" label="物流单号" prop="number"></el-table-column>
      <el-table-column align="center" label="物流公司" prop="number"></el-table-column>
      <el-table-column align="center" label="活动信息" prop="number"></el-table-column>
    </el-table>

    <h3 class="table-title"><svg-icon icon-class="qi" class-name="card-panel-icon svg"/>收货人信息</h3>
    <el-table border :data="list">
      <el-table-column align="center" label="收货人" prop="memberName"></el-table-column>
      <el-table-column align="center" label="手机号码" prop="memberPhone"></el-table-column>
      <el-table-column align="center" label="收货地址" prop="merchantAddress"></el-table-column>
    </el-table>

    <h3 class="table-title"><svg-icon icon-class="qi" class-name="card-panel-icon svg"/>商品信息</h3>
    <el-table border :data="macketlist">
      <el-table-column align="center" label="图片" prop="giftCoverUrl">
        <template  slot-scope="scope">
          <img :src="scope.row.giftCoverUrl" v-if="scope.row.giftCoverUrl" style="width:50px;">
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品名称" prop="couponNext">
        <template slot-scope="scope">
          <span>{{value3}}</span>  
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格/货号" prop="payAmount"></el-table-column>
      <el-table-column align="center" label="属性" prop="number"></el-table-column>
      <el-table-column align="center" label="数量" prop="number">
        <template slot-scope="scope">
          <span>1</span>  
        </template>
      </el-table-column>
      <el-table-column align="center" label="小计" prop="number">
        <template slot-scope="scope">
          <span>{{1*scope.row.payAmount}}</span>  
        </template>
      </el-table-column>
      <el-table-column align="center" label="合计" prop="number"></el-table-column>
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

    <h3 class="table-title"><svg-icon icon-class="qi" class-name="card-panel-icon svg"/>凭证信息</h3>
    <el-table border :data="omsVoucherDtoList">
      <el-table-column align="center" label="购车合同" prop="invoiceUrl">
        <template  slot-scope="scope">
          <img :src="scope.row.invoiceUrl" v-if="scope.row.invoiceUrl" style="width:50px;" @click="showUrl(scope.row.invoiceUrl)">

          <el-dialog :visible.sync="detailDialogVisible" title="购车合同">
            <img :src="showInvoiceUrl" class="lunbo" style="width:100%;">
          </el-dialog>

        </template>

        
      </el-table-column>
      <el-table-column align="center" label="身份证" prop="idCardFace">
        <template  slot-scope="scope">
          <img :src="scope.row.idCardFace" v-if="scope.row.idCardFace" style="width:50px;" @click="showIdCard(scope.row.idCardFace)">

          <el-dialog :visible.sync="detailDialogVisible2" title="身份证">
            <img :src="showIdCardUrl" class="lunbo" style="width:100%;">
          </el-dialog>

        </template>
      </el-table-column>
      <el-table-column align="center" label="银行卡" prop="bankCardFace">
        <template  slot-scope="scope">
          <img :src="scope.row.bankCardFace" v-if="scope.row.bankCardFace" style="width:50px;" @click="showBank(scope.row.bankCardFace)">

          <el-dialog :visible.sync="detailDialogVisible3" title="银行卡">
            <img :src="showBankUrl" class="lunbo" style="width:100%;" >
          </el-dialog>

        </template>
      </el-table-column>
      <el-table-column align="center" label="购车发票" prop="invoiceUrl">
        <template  slot-scope="scope">
          <img :src="scope.row.invoiceUrl" v-if="scope.row.invoiceUrl" style="width:50px;" @click="showInvoice(scope.row.invoiceUrl)">

          <el-dialog :visible.sync="detailDialogVisible4" title="购车发票">
            <img :src="showInvoiceUrl" class="lunbo" style="width:100%;" >
          </el-dialog>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上传时间" prop="addTime"></el-table-column>
      <el-table-column align="center" label="核销状态" prop="orderStatus">
        <template slot-scope="scope">
          <el-tag v-if="orderStatus==1">未核销</el-tag>
          <el-tag v-if="orderStatus==2">已核销(订单完成)</el-tag>
          <el-tag v-if="orderStatus==3">(订单失效)活动已过期</el-tag>
          <el-tag v-if="orderStatus==4">用户已取消订单</el-tag>
          <el-tag v-if="orderStatus==5"> 管理员取消订单</el-tag>
          <el-tag v-if="orderStatus==6"> 审核凭证中</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="审核状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1">审核中</el-tag>
          <el-tag v-if="scope.row.status==2">审核通过</el-tag>
          <el-tag v-if="scope.row.status==3">审核未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="审核时间" prop="updateTime"></el-table-column>
      <el-table-column align="center" label="未通过原因" prop="reason">
      </el-table-column>
      <el-table-column align="center" label="操作" prop="status">
        <template slot-scope="scope">
          <el-button size="mini" style="margin-bottom:5px;"  @click="pashOrder(2,scope.row)" v-if="scope.row.status==1">审核通过</el-button>
          <el-button size="mini" type="danger"  @click="pashOrder(3,scope.row)" v-if="scope.row.status==1">审核不通过</el-button>
        </template>
      </el-table-column>

      <el-dialog :visible.sync="dialogFormVisible" :append-to-body="true" title="请输入不通过原因">
        <el-input type="textarea" v-model="reason"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button @click="removeOrder(3)">确 定</el-button>
        </div>
      </el-dialog>
    </el-table>

    <h3 class="table-title"><svg-icon icon-class="qi" class-name="card-panel-icon svg"/>备注</h3>
      <el-table border :data="omsVoucherDtoList">
        <el-table-column align="center" prop="remark" label="备注"></el-table-column>
      </el-table>
  </div>
</template>
<script>
import { detailOrder,modifyVoucherStatus,updateOrderStatus,editOrderStatus } from "@/api/order";
export default {
  data(){
    return {
      reason:'',
      dialogFormVisible:false,
      showInvoiceUrl:'',
      detailDialogVisible4:false,
      showBankUrl:'',
      detailDialogVisible3:false,
      detailDialogVisible2:false,
      showIdCardUrl:'',
      showInvoiceUrl:'',
      detailDialogVisible:false,
      orderStatus:undefined,
      status:undefined,
      createTime:null,
      payTime:null,
      finishTime:null,
      orderlist:{},
      list:[],
      omsVoucherDtoList:[],
      macketlist:[],
      value:'',
      value2:'',
      value3:''
    }
  },
  created(){
    this.getlist()
  },
  methods:{
    showInvoice(detail){
      this.showInvoiceUrl=detail
      this.detailDialogVisible4=true
    },
    showBank(detail){
      this.detailDialogVisible3=true
      this.showBankUrl=detail
    },
    showIdCard(detail){
      this.detailDialogVisible2=true
      this.showIdCardUrl=detail
    },
    showUrl(detail){
      this.detailDialogVisible=true
      this.showInvoiceUrl=detail
    },
    finishOrder(){
      if(Array.isArray(this.omsVoucherDtoList)==false){
        this.$message("请先上传审核凭证")
        return
      }else{
        const status=this.omsVoucherDtoList[0].status
      const id=this.orderlist[0].orderId
       if(status == 2 ) {
          editOrderStatus(id, 2).then(response => {
            this.$notify.success({
            title: "通知",
            message: "订单已核销"
          });
          this.getlist();
         });
      }else {
        this.$message("只有审核通过的订单才可以核销")
      }
      }
      
    },
    removeOrder(){
      let id=this.orderlist[0].memberId;
      let type=this.orderlist[0].type
      this.$confirm('此操作将关闭该订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateOrderStatus(id,type).then(response=>{
            this.status=5
            this.$forceUpdate()
            this.$notify.success({
              title:"成功",
              message:"订单已取消"
            })
      }).catch(response=>{
        this.$notify.error({
          title:"失败",
          message:response.data.errmsg,
          duration:0
        })
      })
        }).catch(() => {
            updateOrderStatus(id,type).catch(response=>{
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
        });
    },
    removeOrder(status){
      if(this.reason==''){
        this.$message('未通过理由不能为空')
        return
      }else{
        let id=this.omsVoucherDtoList[0].id;
        let orderId=this.orderlist[0].orderId
        modifyVoucherStatus(id,orderId,status,this.reason).then(response=>{
          this.dialogFormVisible=false
          this.$message("更改审核状态成功");
          this.getlist()
        })
      }
      
    },
     pashOrder(status,row){
       if(row.status==2){
         this.$message("请勿重复操作")
         return
       }
      let reason=' ';
      let id=this.omsVoucherDtoList[0].id;
      let orderId=this.orderlist[0].orderId
      if(status==2){
        this.$confirm("确定审核通过？",'提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          modifyVoucherStatus(id, orderId, status, reason)
          .then(data => {
            this.$message("更改审核状态成功");
            this.$router.go(0)
          })
        })
      }
      if (status == 3) {
          this.dialogFormVisible=true
          console.log(reason)
        //   try {
        //   this.$prompt("请输入审核不通过的原因", "提示", {
        //     confirmButtonText: "确定",
        //     cancelButtonText: "取消"
        //   }).then(({value})=>{
        //     if(value==''){
        //       alert("通过原因不能为空")
        //     }else{
        //       reason=value
        //       modifyVoucherStatus(id, orderId, status, reason).then(response=>{
        //         this.$message("更改审核状态成功");
        //         this.$router.go(0)
        //       }).catch(error=>{
        //         console.log(error)
        //       })
        //     }
            
        //   })
        // } catch (err) {
        //   // this.$message("请在点击审核不通过后，填写审核不通过的原因");
        // }
        
      }
    },
    getlist(){
       detailOrder(this.$route.query.id).then(response=>{
         this.status=this.$route.query.status
         this.list=[response.data.data]
         console.log(this.list)
         this.list.forEach((item,index)=>{this.orderlist[index] = item})
         this.createTime=this.orderlist[0].createTime
         this.orderStatus=this.orderlist[0].orderStatus
         this.finishTime=this.orderlist[0].finishTime
         this.payTime=this.orderlist[0].payTime
          for(var i=0;i<this.list.length;i++){
            this.macketlist=this.list[i].couponVoList
            this.omsVoucherDtoList=this.list[i].omsVoucherDto
          }
          this.value=this.macketlist[0].faceValue
          this.value2=this.macketlist[0].couponNext
          this.value3=this.value+this.value2
       })
    }
  },
}
</script>
<style scoped>
.test{
  border:4px solid #ccc;
}
#svg{
  width:30px;
  height:30px;
  margin-top:5px;
}
.title2{
  text-align: center;
  font-size:16px;
  color:#666;
}
#svg2{
  width:30px;
  height:30px;
  margin-top:5px;
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
  width:60px;
  height:60px;
  border:4px solid #1ABC9C;
  border-radius: 50%;
  text-align: center;
  line-height: 60px;
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