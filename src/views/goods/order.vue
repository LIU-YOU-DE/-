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
        v-model.trim="listQuery.orderId"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入订单编号"
      />
      <el-select filterable v-model="listQuery.orderStatus" placeholder="订单状态" class="orderStatus">
        <el-option
          v-for="status in statusMap"
          :key="status.value"
          :label="status.label"
          :value="status.value">
        </el-option>
      </el-select>
      <el-button
        v-permission="['GET /orders']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
      <el-button
        v-permission="['GET /orders']"
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
            <el-form-item label="订单总金额">
              <span>{{ props.row.amount }}</span>
            </el-form-item>
            <el-form-item label="车型id">
              <span>{{ props.row.carId }}</span>
            </el-form-item>
            <el-form-item label="汽车缩略图">
              <img :src="props.row.carCover" />
            </el-form-item>
            <el-form-item label="车型名称">
              <span>{{ props.row.carName }}</span>
            </el-form-item>
            <el-form-item label="创建订单时间">
              <span>{{ props.row.createTime }}</span>
            </el-form-item>
            <el-form-item label="订单详情标题">
              <span>{{ props.row.detailTitle }}</span>
            </el-form-item>
            <el-form-item label="购车核销时间">
              <span>{{ props.row.finishTime }}</span>
            </el-form-item>
            <el-form-item label="4s名称">
              <span>{{ props.row.merchantName }}</span>
            </el-form-item>
            <el-form-item label="支付金额">
              <span>{{ props.row.payAmount }}</span>
            </el-form-item>
            <el-form-item label="已退款金额">
              <span>{{ props.row.refundAmount }}</span>
            </el-form-item>
            <el-form-item label="行政区id">
              <span>{{ props.row.regionId }}</span>
            </el-form-item>
            <el-form-item label="城市">
              <span>{{ props.row.regionName }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100" label="订单号" prop="orderId" />

      <el-table-column align="center" label="用户ID" prop="memberId" />

      <el-table-column align="center" label="支付状态" prop="payStatus">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.payStatus==1" type="error">待支付</el-tag>
          <el-tag v-if="scope.row.payStatus==2" type="success">支付成功</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单状态" prop="orderStatus">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.orderStatus==1">未核销</el-tag>
          <el-tag v-if="scope.row.orderStatus==2">订单已完成</el-tag>
          <el-tag v-if="scope.row.orderStatus==3">订单已失效</el-tag>
          <el-tag v-if="scope.row.orderStatus==4">用户已取消订单</el-tag>
          <el-tag v-if="scope.row.orderStatus==5">管理员取消订单</el-tag>
          <el-tag v-if="scope.row.orderStatus==6">凭证审核中</el-tag>
          <el-tag v-if="scope.row.orderStatus==7">凭证审核通过</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="购车人姓名" prop="memberName" />

      <el-table-column align="center" label="购车人电话" prop="memberPhone" />

      <el-table-column align="center" label="支付时间" prop="payTime" />

      <el-table-column align="center" label="更新时间" prop="updateTime" />

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row)" v-permission="['GET /order/{id}']">详情</el-button>
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

    <!-- 订单详情对话框 -->
    <el-dialog :visible.sync="orderDialogVisible" title="订单详情" width="800">
      <el-form
        ref="orderDetail"
        :model="orderDetail"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 800px; margin-left:50px;"
      >
        <el-form-item label="订单总金额" prop="amount">
          <el-input v-model="orderDetail.amount" />
        </el-form-item>
        <el-form-item label="汽车缩略图" prop="carCover">
          <img :src="orderDetail.carCover" alt />
        </el-form-item>
        <el-form-item label="车型id" prop="carId">
          <el-input v-model="orderDetail.carId" />
        </el-form-item>
        <el-form-item label="车型的名称" prop="carName">
          <el-input v-model="orderDetail.carName" />
        </el-form-item>
        <el-form-item label="优惠券详情列表" prop="carCover">
          <el-table :data="orderDetail.couponVoList">
            <el-table-column label="优惠券id" prop="couponId"></el-table-column>

            <el-table-column label="优惠券上文" prop="couponUp"></el-table-column>

            <el-table-column label="面值" prop="faceValue"></el-table-column>

            <el-table-column label="购买优惠券支付的金额" prop="payAmount"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="创建订单时间" prop="createTime">
          <el-input v-model="orderDetail.createTime" />
        </el-form-item>
        <el-form-item label="订单详情标题" prop="detailTitle">
          <el-input v-model="orderDetail.detailTitle" />
        </el-form-item>
        <el-form-item label="购车核销时间" prop="finishTime">
          <el-input v-model="orderDetail.finishTime" />
        </el-form-item>
        <el-form-item label="用户id" prop="memberId">
          <el-input v-model="orderDetail.memberId" />
        </el-form-item>
        <el-form-item label="购车人姓名" prop="memberName">
          <el-input v-model="orderDetail.memberName" />
        </el-form-item>
        <el-form-item label="购车人电话" prop="memberPhone">
          <el-input v-model="orderDetail.memberPhone" />
        </el-form-item>
        <el-form-item label="商家id" prop="merchantId">
          <el-input v-model="orderDetail.merchantId" />
        </el-form-item>
        <el-form-item label="4s名称" prop="merchantName">
          <el-input v-model="orderDetail.merchantName" />
        </el-form-item>
        <el-form-item label="用户上传的凭证" prop="omsVoucherDto">
          <el-table :data="orderDetail.omsVoucherDto">
            <el-table-column label="上传时间" prop="addTime"></el-table-column>

            <el-table-column align="center" property="contracts" label="购车合同">
              <template slot-scope="scope">
                <img v-for="pic in scope.row.contracts" :key="pic" :src="pic" width="40" />
              </template>
            </el-table-column>

            <el-table-column align="center" property="idcardBack" label="身份证背面图片url">
              <template slot-scope="scope">
                <img :src="scope.row.idcardBack" width="40" />
              </template>
            </el-table-column>

            <el-table-column align="center" property="idcardFace" label="身份证正面图片url">
              <template slot-scope="scope">
                <img :src="scope.row.idcardFace" width="40" />
              </template>
            </el-table-column>

            <el-table-column align="center" property="invoiceUrl" label="购车发票url">
              <template slot-scope="scope">
                <img :src="scope.row.invoiceUrl" width="40" />
              </template>
            </el-table-column>

            <el-table-column label="用户id" prop="memberId"></el-table-column>

            <el-table-column label="订单id" prop="orderId"></el-table-column>

            <el-table-column label="备注" prop="remark"></el-table-column>

            <el-table-column label="更新时间" prop="updateTime"></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="orderDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<style lang="scss" scoped>
  .orderStatus{
    position:relative;
    top:-4px;
  }
</style>

<script>
import { listOrder, shipOrder, refundOrder, detailOrder,orderremark} from "@/api/order";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import checkPermission from "@/utils/permission"; // 权限判断函数


export default {
  name: "Order",
  components: { Pagination },
  
  data() {
    return {
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
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        name: undefined,
        orderStatusArray: [],
        sort: "create_time",
        order: "desc",
        orderStatus: undefined,
        orderId: "",
        memberId: "",
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
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true;
      listOrder(this.listQuery)
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
