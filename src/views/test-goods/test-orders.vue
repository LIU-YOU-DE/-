<template>
  <div class="app-container">
    <div style="margin-bottom:10px;">
      <el-button @click="handleFilter" v-permission="['GET /orders/statistics']">全部订单( {{orderstatus}} )</el-button>
      <el-button @click="orderStatus1(1)">待付款( {{orderstatus1}} )</el-button>
      <el-button @click="orderStatus1(2)">待发货( {{orderstatus2}} )</el-button>
      <el-button @click="orderStatus1(3)">待收货( {{orderstatus3}} )</el-button>
      <el-button @click="orderStatus1(4)">已完成( {{orderstatus4}} )</el-button>
      <el-button @click="orderStatus1(5)">已取消( {{orderstatus5}} )</el-button>
    </div>
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div style="border:1px solid #DCDFE6;margin-bottom:20px;height:115px;margin:0 auto;">
        <div style="width:100%;height:50px;background-color:#F3F3F3;position:relative;">
            <div style="display:flex;justify-content:space-between;padding-right:20px;margin-bottom:10px;">
                <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;font-size:15px;"><svg-icon icon-class="search" class-name="card-panel-icon svg" />筛选查找</p>           
                <div>
                  <el-button style="margin-top:8px;" class="filter-item" icon="el-icon-search" @click="handleFilter" v-permission="['GET /orders']">查找</el-button>
                  <el-button style="margin-top:8px;" class="filter-item" @click="searchBox">高级检索</el-button>
                </div>
            </div>
            <span class="search">订单编号：</span>
            <el-input
            v-model.trim="listQuery.orderId"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="请输入订单编号"
          />
          <span class="search">收货人：</span>
            <el-input
            v-model.trim="listQuery.memberName"
            clearable
            class="filter-item"
                style="width: 200px;"
            placeholder="请输入收货人姓名"
          />
          <span class="search">下单时间：</span>
            <el-date-picker
              v-model="listQuery.createTime"
              type="datetime"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width:200px;"
          />
          </div>
        <!-- <el-select filterable v-model="listQuery.orderStatus" placeholder="订单状态" class="orderStatus">
        <el-option
          v-for="status in statusMap"
          :key="status.value"
          :label="status.label"
          :value="status.value">
        </el-option>
      </el-select> -->
    </div>
    </div>

    <!-- 查询结果 -->
    <div class="tabletop" style="margin-top:20px;">
      <p class="table-title"><svg-icon icon-class="list2" class-name="card-panel-icon svg"/>数据列表</p>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="订单编号" prop="orderId" />

      <el-table-column align="center" label="下单时间" prop="createTime" />

      <el-table-column align="center" label="订单分类" prop="type" >
        <template slot-scope="scope">
            <el-tag v-if="scope.row.type==1">购车券订单</el-tag>
            <el-tag v-if="scope.row.type==2">积分礼品订单</el-tag>
            <el-tag v-if="scope.row.type==3">团购汽车订单</el-tag>
            <el-tag v-if="scope.row.type==4">保养订单</el-tag>
          </template>
      </el-table-column>

      <el-table-column align="center" label="用户姓名" prop="memberName" />

      <el-table-column align="center" label="订单金额" prop="payAmount" />

       <el-table-column align="center" label="积分数量" prop="payPoint" />

      <el-table-column align="center" label="支付方式" prop="payType" />

      <el-table-column align="center" label="支付时间" prop="payTime" />

      <el-table-column align="center" label="订单状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="error">待付款</el-tag>
          <el-tag v-if="scope.row.status==2" type="success">待发货</el-tag>
          <el-tag v-if="scope.row.status==3" type="success">待收货</el-tag>
          <el-tag v-if="scope.row.status==4" type="success">已完成</el-tag>
          <el-tag v-if="scope.row.status==5" type="success">已取消</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="物流状态" prop="shipStatus">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.shipStatus==1" type="error">无状态</el-tag>
          <el-tag v-if="scope.row.shipStatus==2" type="success">待发货</el-tag>
          <el-tag v-if="scope.row.shipStatus==3" type="success">在途中</el-tag>
          <el-tag v-if="scope.row.shipStatus==4" type="success">已签收</el-tag>
          <el-tag v-if="scope.row.shipStatus==5" type="success">确认收货</el-tag>
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status==1 && scope.row.type!==1"size="mini" @click="goOrderLook(scope.row)" v-permission="['GET /orders/{id}']">查看订单</el-button>
          <el-button v-if="scope.row.status==1 && scope.row.type==1"size="mini" @click="goCarOrderLook(scope.row)">购车券订单</el-button>
          <el-button v-if="scope.row.status==1" type="danger" size="mini" @click="removeOrder(scope.row)" v-permission="['PUT /orders/orderStatus/{id}']">关闭订单</el-button>

          <el-button v-if="scope.row.status==2 && scope.row.type!==1" size="mini" @click="goOrderLook2(scope.row)" v-permission="['GET /orders/{id}']">查看订单</el-button>
          <el-button v-if="scope.row.status==2 && scope.row.type==1" size="mini" @click="goCarOrderLook(scope.row)">购车券订单</el-button>
          <el-button v-if="scope.row.status==2" type="danger" style="margin-top:5px;" size="mini" @click="goLogistics(scope.row)" v-permission="['PUT /orders/shipStatus/{id}']">订单发货</el-button>

          <el-button v-if="scope.row.status==3 && scope.row.type!==1" size="mini" @click="goOrderLook3(scope.row)" v-permission="['GET /orders/{id}']">查看订单</el-button>
          <el-button v-if="scope.row.status==3 && scope.row.type==1" size="mini" @click="goCarOrderLook(scope.row)">购车券订单</el-button>
          <el-button v-if="scope.row.status==3 && scope.row.type!==1" type="danger" size="mini" @click="goOrderShip(scope.row)">订单跟踪</el-button>

          <el-button v-if="scope.row.status==4 && scope.row.type!==1" size="mini" @click="goOrderLook4(scope.row)" v-permission="['GET /orders/{id}']">查看订单</el-button>
          <el-button v-if="scope.row.status==4 && scope.row.type==1" size="mini" @click="goCarOrderLook(scope.row)">购车券订单</el-button>
          <el-button v-if="scope.row.status==4 && scope.row.type!==4" type="danger" size="mini" @click="goOrderShip(scope.row)">订单跟踪</el-button>

          <el-button v-if="scope.row.status==5 && scope.row.type!==1" size="mini" @click="goOrderLook(scope.row)" v-permission="['GET /orders/{id}']">查看订单</el-button>
          <el-button v-if="scope.row.status==5 && scope.row.type==1" size='mini' @click="goCarOrderLook(scope.row)">购车券订单</el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
 
    <!-- 高级检索 -->
    <div class="popContainer" v-show="popcontain">
      <div class="searbox" v-show="searchbox">
        <div style="width:100%;height:50px;background-color:#F3F3F3;position:relative;margin-bottom:10px;border-bottom:1px solid #C0C4CC;">
          <p style="display:inline-block;margin-left:10px;margin-top:20px;margin-right:75%;"  class="address">高级检索</p>
        </div>
        <el-form label-position="top" label-width="200" style="margin:0 50px 0 50px;">
          <el-row>
            <el-col :span="12">
              <el-form-item label="订单编号" prop="memberId" class="searchboxtitle">
                <el-input style="width:200px;margin-right:30px;" placeholder="请输入订单编号" v-model="listQuery2.orderId"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收货人" prop="nickname" class="searchboxtitle">
                <el-input style="width:200px;margin-right:30px;" placeholder="请输入收货人姓名" v-model="listQuery2.memberName"></el-input>
            </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="订单状态" prop="memberId" class="searchboxtitle">
                <template>
                  <el-select v-model="value" placeholder="请选择" @change=handchange>
                    <el-option
                    v-for="item in ordersStatus"
                    :key="item.id"
                    :label="item.value" 
                    :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </template>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="订单分类" prop="nickname" class="searchboxtitle">
                <el-select v-model="value2" placeholder="请选择" @change=handOrderType>
                  <template>
                    <el-option
                    v-for="item in ordersType"
                    :key="item.id"
                    :label="item.value" 
                    :value="item.value">
                    </el-option>
                  </template>
                  </el-select>
            </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="支付状态" prop="payStatus" class="searchboxtitle">
                <el-select v-model="value3" placeholder="请选择" @change=handPayStatus>
                  <template>
                    <el-option
                    v-for="item in payStaus"
                    :key="item.id"
                    :label="item.value" 
                    :value="item.value">
                    </el-option>
                  </template>
                  </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下单时间" prop="nickname" class="searchboxtitle">
                <el-date-picker
                  v-model="listQuery2.createTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change=handCreateTime
                  placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div style="display:flex;justify-content:flex-end;margin-bottom:20px;">
            <el-button @click="searchBox2" class="btn">取 消</el-button>
            <el-button class="btn" @click=searchOrder style="margin-right:20px;">确 定</el-button>
        </div>
      </div>
    </div>



  </div>
</template>

<style lang="scss" scoped>
.fixed-width .el-button--mini{
  width:80px;
}
.searbox{
    position: fixed;
    top:10%;
    left:40%;
    background-color:#fff;
}
  .orderStatus{
    position:relative;
    top:-4px;
  }
  .search{
  font-size:14px;
  color:#909399;
  font-weight:600;
  display:inline-block;
  display:inline-block;
  margin-left:10px;
}
.address{
  font-size:18px;
  color:#666;
  margin-left:20px;
  font-weight:600;
}
.tabletop{
  height:50px;
  width:100%;
  background-color:#F3F3F3;
  margin-top:20px;
}
.popContainer{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.3);
    z-index:1000
}
.table-title{
  display:inline-block;
  margin-left:10px;
  margin-top:20px;
  color:#555;
  margin-right:75%;
  font-size:15px;
}
.svg{
  margin-right:5px;
}
</style>

<script>
import { listOrder, shipOrder, refundOrder, detailOrder,orderremark,ordersList,updateOrderStatus} from "@/api/order";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import checkPermission from "@/utils/permission"; // 权限判断函数


export default {
  name: "Order",
  components: { Pagination },
  
  data() {
    return {
      orderstatus:'0',
      orderstatus1:'0',
      orderstatus2:'0',
      orderstatus3:'0',
      orderstatus4:'0',
      orderstatus5:'0',
      value:'',
      value2:'',
      value3:'',
      payStaus:[
        {
          id:'1',
          value:"未付款"
        },
        {
          id:'2',
          value:"已付款"
        }
      ],
      ordersType:[
        {
          id:'1',
          value:"购车券订单"
        },
        {
          id:'2'  ,
          value:"积分礼品订单"
        },
        {
          id:'3',
          value:"团购汽车订单"
        },
      ],
      ordersStatus:[
        {
          id:'1',
          value:'待付款'
        },
        {
          id:'2',
          value:'待发货'
        },
        {
          id:'3',
          value:'待收货'
        },
        {
          id:'4',
          value:'已完成'
        },
        {
          id:'5',
          value:'已取消'
        },
      ],
      statusMap: [
        {
          label: '请选择',
          value: null
        },
        {
          label: '未核销',
          value: 1
        },
        {
          label: '订单已完成',
          value: 2
        },
        {
          label: '订单已失效',
          value: 3
        },
        {
          label: '用户已取消订单',
          value: 4
        },
        {
          label: '管理员取消订单',
          value: 5
        },
        {
          label: '审核凭证中',
          value: 6
        }
      ],
      list: [],
      value1:'',
      popcontain:false,
      searchbox:false,
      total: 0,
      orderListCount:[],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        memberName: undefined,
        orderStatusArray: [],
        sort: "create_time",
        order: "desc",
        orderStatus: undefined,
        orderId: "",
        memberId: "",
        createTime:undefined
      },
      listQuery2: {
        page: 1,
        limit: 20,
        id: undefined,
        memberName: undefined,
        orderStatusArray: [],
        sort: "create_time",
        order: "desc",
        createTime:"",
        orderStatus: undefined,
        orderId: undefined,
        payStatus:undefined,
        memberId: undefined,
        orderType:undefined,
        shipStatus:undefined
      },

      orderDialogVisible: false,
      orderDetail: {},
      shipForm: {
        orderId: undefined,
        shipChannel: undefined,
        shipSn: undefined
      },
      shipDialogVisible: false,
      refundForm: {
        orderId: undefined,
        refundMoney: undefined
      },
      refundDialogVisible: false,
      downloadLoading: false
    };
  },
  created() {
    this.getList();
    this.getOrderList()
  },
  methods: {
    orderStatus1(status){
      this.listLoading = true;
      this.listQuery.orderStatus=status
      listOrder(this.listQuery).then(response=>{
        this.list=response.data.data.list
        this.total = response.data.data.total;
        this.listLoading = false;
        this.listQuery.orderStatus=undefined
      })
      
    },
    // 关闭订单
    removeOrder(row){
      this.$confirm('此操作将关闭该订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateOrderStatus(row.orderId,row.type).then(response=>{
            this.$notify.success({
              title:"成功",
              message:"订单已取消"
            })
            this.getList()
      }).catch(response=>{
        this.$notify.error({
          title:"失败",
          message:response.data.errmsg,
          duration:0
        })
      })
        }).catch(() => {
            updateOrderStatus(row.orderId,row.type).catch(response=>{
              this.$notify.error({
                title:"失败",
                message:response.data.errmsg,
                duration:0
              })
            })
        });
    },
    // 跟踪订单页面
    goOrderShip(row){
      this.$router.push({path:"/test-goods/test-orderLogistics",query:{id:row.orderId}})
    },
    // 删除订单
    deleteOrder(row){
    },
    // 发货列表页面
    goLogistics(row){
      this.$router.push({path:"/test-goods/test-logistics",query:{id:row.orderId,status:row.status}})
    },
    // 不同的订单状态跳转不同的页面
    goOrderLook4(row){
      if(row.type==4){
        this.$router.push({path:"/test-goods/test-orderlook5",query:{id:row.orderId,status:row.status,type:row.type}})
      }else{
        this.$router.push({path:"/test-goods/test-orderlook4",query:{id:row.orderId,status:row.status}})
      }
    },
    goOrderLook(row){
      this.$router.push({path:"/test-goods/test-orderlook1",query:{id:row.orderId,status:row.status}})
    },
    goOrderLook2(row){
      this.$router.push({path:"/test-goods/test-orderlook2",query:{id:row.orderId,status:row.status}})
    },
    goCarOrderLook(row){
      this.$router.push({path:"/test-goods/test-orderlook2-2",query:{id:row.orderId,status:row.status}})
    },
    goOrderLook3(row){
      this.$router.push({path:"/test-goods/test-orderlook3",query:{id:row.orderId,status:row.status}})
    },

    handCreateTime(time){
      this.listQuery2.createTime=time
    },
    handPayStatus(event){
      for(var i=0;i<this.payStaus.length;i++){
        if(event==this.payStaus[i].value){
          this.listQuery2.payStatus=this.payStaus[i].id
        }
      }
    },
    handOrderType(event){
      for(var i=0;i<this.ordersType.length;i++){
        if(event==this.ordersType[i].value){
          this.listQuery2.orderType=this.ordersType[i].id
        }
      }
    },
    handchange(event){
      for(var i=0;i<this.ordersStatus.length;i++){
        if(event==this.ordersStatus[i].value){
          this.listQuery2.orderStatus=this.ordersStatus[i].id
        }
      }
    },
    searchOrder(){
      listOrder(this.listQuery2).then(response=>{
        this.list = response.data.data.list;
        this.listt=this.list.reverse()
        this.total = response.data.data.total;
        this.searchbox=false
        this.value=''
        this.value2=''
        this.value3=''
        this.listQuery2.memberName=undefined
        this.listQuery2.orderId=undefined
        this.popcontain=false
      })
    },
    checkPermission,
    searchBox2(){
      this.searchbox=false,
      this.popcontain=false
    },
    searchBox(){
      this.searchbox=true,
      this.popcontain=true
    },
    getOrderList(){
      ordersList().then(response=>{
        this.orderListCount=response.data.data
        for(var i=0;i<this.orderListCount.length;i++){
        if(this.orderListCount[i].orderStatus==1){
          this.orderstatus1=this.orderListCount[i].orderCount
        }else if(this.orderListCount[i].orderStatus==2){
          this.orderstatus2=this.orderListCount[i].orderCount
        }else if(this.orderListCount[i].orderStatus==3){
          this.orderstatus3=this.orderListCount[i].orderCount
        }else if(this.orderListCount[i].orderStatus==4){
          this.orderstatus4=this.orderListCount[i].orderCount
        }else if(this.orderListCount[i].orderStatus==5){
          this.orderstatus5=this.orderListCount[i].orderCount
        }
      }
      var sum=0
      for(var i in this.orderListCount){
         sum+=this.orderListCount[i].orderCount
      }
      this.orderstatus=sum
      })
    },
    getList() {
      this.listLoading = true;
      listOrder(this.listQuery)
        .then(response => {
          this.list = response.data.data.list
          this.list=this.list.reverse()
          this.total = response.data.data.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleDetail(row) {
      this.$router.push({
        query: { id: row.orderId },
        path: "/test-goods/test-orderlook"
      });
    },
    handleShip(row) {
      this.shipForm.orderId = row.id;
      this.shipForm.shipChannel = row.shipChannel;
      this.shipForm.shipSn = row.shipSn;

      this.shipDialogVisible = true;
      this.$nextTick(() => {
        this.$refs["shipForm"].clearValidate();
      });
    },
    confirmShip() {
      this.$refs["shipForm"].validate(valid => {
        if (valid) {
          shipOrder(this.shipForm)
            .then(response => {
              this.shipDialogVisible = false;
              this.$notify.success({
                title: "成功",
                message: "确认发货成功"
              });
              this.getList();
            })
            .catch(response => {
              this.$notify.error({
                title: "失败",
                message: response.data.errmsg,
                duration: 0
              });
            });
        }
      });
    },
    handleRefund(row) {
      this.refundForm.orderId = row.id;
      this.refundForm.refundMoney = row.actualPrice;

      this.refundDialogVisible = true;
      this.$nextTick(() => {
        this.$refs["refundForm"].clearValidate();
      });
    },
    confirmRefund() {
      this.$refs["refundForm"].validate(valid => {
        if (valid) {
          refundOrder(this.refundForm)
            .then(response => {
              this.refundDialogVisible = false;
              this.$notify.success({
                title: "成功",
                message: "确认退款成功"
              });
              this.getList();
            })
            .catch(response => {
              this.$notify.error({
                title: "失败",
                message: response.data.errmsg,
                duration: 0
              });
            });
        }
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "订单ID",
          "订单编号",
          "用户ID",
          "订单状态",
          "是否删除",
          "收货人",
          "收货联系电话",
          "收货地址"
        ];
        const filterVal = [
          "id",
          "orderId",
          "userId",
          "orderStatus",
          "isDelete",
          "consignee",
          "mobile",
          "address"
        ];
        excel.export_json_to_excel2(tHeader, this.list, filterVal, "订单信息");
        this.downloadLoading = false;
      });
    }
  }
};
</script>
