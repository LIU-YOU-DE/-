<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.memberId"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入用户ID"
      />
      <el-input
        v-model.trim="listQuery.giftOrderId"
        clearable
        class="filter-item"
        style="width: 300px;"
        placeholder="请输入订单编号"
      />
      <el-button
        v-permission="['GET /giftOrders']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
      <el-button
        v-permission="['GET /giftOrders']"
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="table-expand">
            <el-form-item label="ID">
              <span>{{ props.row.material.id }}</span>
            </el-form-item>
            <el-form-item label="名称">
              <span>{{ props.row.material.name }}</span>
            </el-form-item>
            <el-form-item label="图片">
              <img :src="props.row.material.coverUrl" class="giftimg"/>
            </el-form-item>
            <el-form-item label="编号">
              <span>{{ props.row.material.number }}</span>
            </el-form-item>
            <el-form-item label="积分">
              <span>{{ props.row.material.pricePoint }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="礼品id" prop="giftId" /> -->

      <el-table-column align="center" min-width="100" label="礼品订单号" prop="giftOrderId" />

      <el-table-column align="center" label="用户ID" prop="memberId" />

      <el-table-column align="center" width="120" label="订单状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="error">待支付</el-tag>
          <el-tag v-if="scope.row.status==2" type="success">已支付</el-tag>
          <el-tag v-if="scope.row.status==3" type="info">订单关闭</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="收货地址" width="300" prop="address" />

      <el-table-column align="center" width="120" label="物流状态" prop="orderStatus">
        1 待发货 2-在途中 3-签收 4:确认收货
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.orderStatus==1">待发货</el-tag>
          <el-tag type="success" v-if="scope.row.orderStatus==2">在途中</el-tag>
          <el-tag v-if="scope.row.orderStatus==3">已签收</el-tag>
          <el-tag type="success" v-if="scope.row.orderStatus==4">确认收货</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120" label="支付方式" prop="payType">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.payType==1" type="error">积分支付</el-tag>
          <el-tag v-if="scope.row.payType==2" type="success">人民币支付</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" label="支付金额" prop="payAmount" />

      <el-table-column align="center" label="下单时间" prop="addOrderTime" />

      <el-table-column align="center" label="支付时间" prop="payTime" />

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            v-permission="['PUT /giftOrder/{id}']"
            v-if="scope.row.orderStatus == 1"
            type="warning"
            @click="handleShip(scope.row)"
          >发货</el-button>
          <el-button
            v-permission="['GET /giftOrder/{id}','GET /express']"
            v-if="scope.row.orderStatus != 1 && scope.row.orderStatus != 0"
            type="success"
            @click="getShipInfo(scope.row)"
          >查看物流信息</el-button>
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

    <!-- 查看物流对话框 -->
    <el-dialog width="1000px" :visible.sync="shipInfoDialogVisible" title="物流信息">
        <div v-if="shipInfo != null">
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
    </el-dialog>

    <!-- 发货对话框 -->
    <el-dialog width="850px" :visible.sync="shipDialogVisible" title="发货">
      <el-form
        ref="shipForm"
        :model="shipForm"
        status-icon
        label-position="left"
        style="width: 600px; margin-left:100px;"
      >
        <el-form-item label-width="120px" label="请选择快递公司">
          <el-select style="width:300px" v-model="shipForm.shipperCode" placeholder="请选择快递公司">
            <el-option
              v-for="item in shipChannels"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="120px" label="请输入快递单号" prop="shipForm.logisticCode">
          <el-col :span="15">
            <el-input v-model="shipForm.logisticCode" />
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shipDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmShip">确定</el-button>
      </div>
    </el-dialog>

    <!-- 退款对话框 -->
    <!-- <el-dialog :visible.sync="refundDialogVisible" title="退款">
      <el-form
        ref="refundForm"
        :model="refundForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="退款金额" prop="refundMoney">
          <el-input v-model="refundForm.refundMoney" :disabled="true" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refundDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRefund">确定</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<style scoped>
    .ship-info{
      margin-bottom: 40px;
    }
    .ship-text{
      margin-left: 40px;
      font-size: 18px;
      margin-bottom: 20px;
    }
    .giftimg{
      height:80px;
    }
</style>
<script>
import { getorder, shipGiftOrder,queryShipInfo } from "@/api/liping";

import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import checkPermission from "@/utils/permission"; // 权限判断函数

const statusMap = {
  101: "未付款",
  102: "用户取消",
  103: "系统取消",
  201: "已付款",
  202: "申请退款",
  203: "已退款",
  301: "已发货",
  401: "用户收货",
  402: "系统收货"
};

export default {
  name: "Order",
  components: { Pagination },
  filters: {
    orderStatusFilter(status) {
      return statusMap[status];
    }
  },
  data() {
    return {
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
      shipInfo: Object,  //物流详细信息
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        giftId: undefined,
        giftOrderId: "",
        memberId: "",
        sort: "add_order_time",
        order: "desc"
      },
      statusMap,
      orderDialogVisible: false,
      orderDetail: {},
      shipForm: {
        giftOrderId: undefined, //礼品单号
        shipperCode: undefined, //快递代码
        logisticCode: undefined //快递单号
      },
      shipDialogVisible: false,
      shipInfoDialogVisible: false,
      // refundForm: {
      //   orderId: undefined,
      //   refundMoney: undefined
      // },
      // refundDialogVisible: false,
      downloadLoading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true;
      getorder(this.listQuery)
        .then(response => {
          // console.log(response.data.data.list);

          this.list = response.data.data.list;
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
        path: "/goods/orderlook"
      });
    },
    handleShip(row) {
      this.shipForm.giftOrderId = row.giftOrderId;
      this.shipForm.shipperCode = this.shipperCode;
      this.shipForm.logisticCode = row.logisticCode;
      this.shipDialogVisible = true;
    },
    confirmShip() {
      shipGiftOrder(this.shipForm)
        .then(response => {
          this.shipDialogVisible = false;
          this.$notify.success({
            title: "成功",
            message: "发货成功"
          });
          this.getList();
        })
        .catch(response => {
          this.$notify.error({
            title: "失败",
            message: response.errmsg,
            duration: 0
          });
        });
    },
    getShipInfo(row) {
      this.shipForm.giftOrderId = row.giftOrderId;
      this.shipForm.shipperCode = row.shipperCode;
      this.shipForm.logisticCode = row.logisticCode;
      this.shipInfoDialogVisible = true;
      queryShipInfo(this.shipForm)
        .then(response => {
          this.shipInfo = response.data.data;
          this.shipInfo.traces = response.data.data.traces.reverse();
        })
        .catch(response => {
          this.$notify.error({
            title: "失败",
            message: response.errmsg,
            duration: 0
          });
        });
    },
    // handleRefund(row) {
    //   this.refundForm.orderId = row.id;
    //   this.refundForm.refundMoney = row.actualPrice;

    //   this.refundDialogVisible = true;
    //   this.$nextTick(() => {
    //     this.$refs["refundForm"].clearValidate();
    //   });
    // },
    // confirmRefund() {
    //   this.$refs["refundForm"].validate(valid => {
    //     if (valid) {
    //       refundOrder(this.refundForm)
    //         .then(response => {
    //           this.refundDialogVisible = false;
    //           this.$notify.success({
    //             title: "成功",
    //             message: "确认退款成功"
    //           });
    //           this.getList();
    //         })
    //         .catch(response => {
    //           this.$notify.error({
    //             title: "失败",
    //             message: response.data.errmsg
    //           });
    //         });
    //     }
    //   });
    // },
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
