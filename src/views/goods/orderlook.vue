<template>
  <div class="container">
    <!-- 订单详情 -->
    <el-row>
      <!-- style=" margin-left:50px;" -->
      <el-button type="primary" @click="backlist">返回</el-button>
    </el-row>

    <div class="parallel-box">
      <div class="left">
        <el-row>
          <h3>订单详情</h3>
        </el-row>

        <el-row>
          <el-col :span="2">订单id</el-col>
          <span>{{ orderDetail.orderId }}</span>
        </el-row>

        <el-row>
          <el-col :span="2">创建时间</el-col>
          <el-col :span="6">{{ orderDetail.createTime }}</el-col>
        </el-row>

        <el-row>
          <el-col :span="2">更新时间</el-col>
          <el-col :span="6">{{ orderDetail.updateTime }}</el-col>
        </el-row>

        <el-row>
          <el-col :span="2">购车核销时间</el-col>
          <span>{{ orderDetail.finishTime }}</span>
        </el-row>

        <el-row>
          <el-col :span="2">购车人姓名</el-col>
          <el-col :span="3">{{ orderDetail.memberName }}</el-col>
        </el-row>

        <el-row>
          <el-col :span="2">购车人电话</el-col>
          <el-col :span="3">{{ orderDetail.memberPhone }}</el-col>
        </el-row>

        <el-row>
          <el-col :span="2">支付金额</el-col>
          <span>￥{{ orderDetail.payAmount }}</span>
        </el-row>

        <el-row>
          <el-col :span="2">支付类型</el-col>

          <el-radio-group v-model="orderDetail.payType" disabled>
            <el-radio :label="1">微信支付</el-radio>
            <el-radio :label="2">其他暂定</el-radio>
          </el-radio-group>
        </el-row>

        <el-row>
          <el-col :span="2">订单总金额</el-col>
          <el-col :span="3">￥{{ orderDetail.amount }}</el-col>
        </el-row>

        <!-- <el-row>
          <el-col :span="2">已退款金额</el-col>
          <span>￥{{ orderDetail.refundAmount }}</span>
        </el-row>-->

        <!-- <el-row>
          <el-col :span="2">退款状态</el-col>
          <span style="color: red;">{{ orderDetail.refundStatus| showRefundStatus }}</span>
          <el-radio-group v-model="orderDetail.refundStatus" disabled>
          </el-radio-group>
        </el-row>-->

        <el-row>
          <el-col :span="2">订单状态</el-col>
          <span style="color: red;">{{ orderDetail.orderStatus|showOrderStatus }}</span>
          <!-- <el-radio-group v-model="orderDetail.orderStatus" disabled>
            <el-radio :label="1">未核销</el-radio>
            <el-radio :label="2">已核销</el-radio>
            <el-radio :label="3">订单失效</el-radio>
            <el-radio :label="4">用户已取消订单</el-radio>
            <el-radio :label="5">管理员取消订单</el-radio>
            <el-radio :label="6">审核凭证中</el-radio>
          </el-radio-group>-->
        </el-row>
        <!-- :inactive-value="1" -->
        <!-- <el-row v-if="orderDetail.orderStatus !== 2">
          <el-col :span="2">是否取消订单</el-col>
          <el-switch
            v-model="orderDetail.orderStatus"
            :active-value="2"
            active-color="#01bf00"
            inactive-color="#ff4949"
            @change="handleshowswitch(orderDetail.orderStatus)"
          ></el-switch>
        </el-row>-->

        <!-- <el-row v-if="orderDetail.orderStatus !== 5">
          <el-col :span="2">是否完结订单</el-col>
          <el-switch
            v-model="orderDetail.orderStatus"
            :active-value="5"
            active-color="#01bf00"
            inactive-color="#ff4949"
            @change="handleshowswitch(orderDetail.orderStatus)"
          ></el-switch>
        </el-row>-->
      </div>

      <div class="right">
        <el-row>
          <h3>订单关联车型</h3>
        </el-row>
        <el-row>
          <el-col :span="2">车型名称</el-col>
          <span>{{ orderDetail.carName }}</span>
        </el-row>
        <el-row>
          <el-col :span="2">车型ID</el-col>
          <span>{{ orderDetail.carId }}</span>
        </el-row>

        <el-row>
          <el-col :span="2">车型详情标题</el-col>
          <span>{{ orderDetail.detailTitle }}</span>
        </el-row>
        <el-row>
          <el-col :span="2">汽车缩略图</el-col>
          <span>
            <img :src="orderDetail.carCover" class="small-img" />
          </span>
        </el-row>
        <el-row>
          <el-col :span="2">关联城市id</el-col>
          <span>{{ orderDetail.regionId }}</span>
        </el-row>
        <el-row>
          <el-col :span="2">关联城市</el-col>
          <span>{{ orderDetail.regionName }}</span>
        </el-row>
        <el-row>
          <el-col :span="2">提车4S店id</el-col>
          <span>{{ orderDetail.merchantId }}</span>
        </el-row>
        <el-row>
          <el-col :span="2">提车4S店名称</el-col>
          <span>{{ orderDetail.merchantName }}</span>
        </el-row>
      </div>
    </div>
      <el-button type="success" @click="finishOrder" v-permission="['PUT /order/{id}']">核销订单</el-button>
      <el-button type="danger" @click="cancelOrder" v-permission="['PUT /order/{id}']">取消订单</el-button>

    <div style="height: 20px" />
    <!-- 订单相关的优惠券 -->
    <el-table :data="orderDetail.couponVoList" style="width:800px">
      <el-table-column label="优惠券id" prop="couponId" />
      <el-table-column label="面值" prop="faceValue" />
      <el-table-column label="优惠券文本" prop="couponNext" />
      <el-table-column label="购买优惠券支付的金额" prop="payAmount" />
    </el-table>
    <div class="table-title">订单关联优惠券</div>

    <div style="height: 20px" />

    <!-- 订单相关的购车凭证 -->
    <el-table :data="orderDetail.omsVoucherDto" style="width:1200px">
      <el-table-column align="center" property="contracts" label="购车合同">
        <template slot-scope="scope">
          <img
            @click="showBigPic(pic)"
            v-for="pic in scope.row.contracts"
            :key="pic"
            :src="pic"
            width="40"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" property="idCardFace" label="身份证">
        <template slot-scope="scope">
          <img :src="scope.row.idCardFace" width="40" @click="showBigPic(scope.row.idCardFace)" />
        </template>
      </el-table-column>

      <el-table-column align="center" property="bankCardFace" label="银行卡">
        <template slot-scope="scope">
          <img :src="scope.row.bankCardFace" width="40" @click="showBigPic(scope.row.bankCardFace)" />
        </template>
      </el-table-column>

      <el-table-column align="center" property="invoiceUrl" label="购车发票url">
        <template slot-scope="scope">
          <img :src="scope.row.invoiceUrl" width="40" @click="showBigPic(scope.row.invoiceUrl)" />
        </template>
      </el-table-column>
      
      <el-table-column label="上传时间" prop="addTime">
        <template slot-scope="scope">{{scope.row.addTime |dateFormatter}}</template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime">
        <template slot-scope="scope">{{scope.row.updateTime|dateFormatter}}</template>
      </el-table-column>
      <el-table-column label="审核状态" prop="status">
        <template slot-scope="scope">
          <el-tag type="error" v-if="scope.row.status === 1">审核中</el-tag>
          <el-tag type="error" v-if="scope.row.status === 2">审核通过</el-tag>
          <el-tag type="success" v-if="scope.row.status === 3">审核未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="未通过原因" prop="reason" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" class="table-button" @click="operateVoucher(2)" v-permission="['PUT /voucher/{id}']" style="cursor:pointer;">审核通过</span>
          <span
            style="cursor:pointer;"
            v-permission="['PUT /voucher/{id}']"
            v-if="scope.row.status === 1"
            class="table-button back-color__Tomato"
            @click="operateVoucher(3)"
          >审核不通过</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-title">用户上传购车凭证</div>

    <el-row>
      <el-col :span="2">
        <span style="line-height: 40px;">备注</span>
      </el-col>
      <el-col :span="10" style="display:flex;">
        <el-input v-model="orderDetail.remark"  autosize type="textarea"/>
      </el-col>
      <el-col :span="2"><el-button type="primary" style="margin-left:20px;" @click="editThisRemark" v-permission="['PUT /order/remark/{id}']">更新备注</el-button></el-col>
    </el-row>

    <el-dialog title="查看大图" :visible.sync="isShowBigPic">
      <img :src="activeUrl" />
    </el-dialog>
  </div>
</template>

<script>
import {
  // listOrder,
  // shipOrder,
  // refundOrder,
  modifyVoucherStatus,
  modifyOrderStatus,
  detailOrder,
  editRemark,
  editOrderStatus
} from "@/api/order";

export default {
  filters: {
    // 显示订单状态
    showOrderStatus(status) {
      const statusText = [
        "未核销",
        "已核销",
        "订单失效",
        "用户已取消订单",
        "管理员取消订单",
        "凭证审核中",
        "凭证审核通过"
      ];
      return statusText[status - 1];
    },
    inject:['reload'],

    // 显示退款状态
    showRefundStatus(status) {
      const statusText = ["无状态", "已退款", "退款中"];
      return statusText[status - 1];
    }
  },
  data() {
    return {
      orderDetail: {},

      isShowBigPic: false, // 是否显示大图
      activeUrl: "" // 要查看大图的url
    };
  },
  created() {
    this.getlist();
  },

  methods: {

    /** 完结订单 */
    finishOrder() {
      var status = this.orderDetail.orderStatus;
      const id=this.$route.query.id;
      if(status == 1 || status ==6 ) {
          editOrderStatus(id, 2).then(response => {
            this.$notify.success({
            title: "通知",
            message: "订单已核销"
          });
          this.getlist();
         });
      }else {
        alert('只有未核销和审核中的订单才能核销！')
      }
    },
    /**取消订单 */
    cancelOrder() {
      var status = this.orderDetail.orderStatus;
      const id=this.$route.query.id;  //订单id
      //1 未核销   6 审核凭证中 时可以取消订单
      if(status == 1 || status == 6) {
         editOrderStatus(id, 5).then(response => {
            this.$notify.success({
            title: "通知",
            message: "订单已取消"
          });
          this.getlist();
         });
      } else {
        alert('只有未核销和审核中的订单才能取消！')
      }
    },
    editThisRemark(){
      const id=this.$route.query.id;
      var that = this;
      editRemark(id, that.orderDetail.remark).then(response => {
        this.$notify.success({
            title: "通知",
            message: "更新成功"
          });
          // 重新请求数据
        this.getlist();
      });

    },
    getlist() {
      const goodsId = this.$route.query.id;
      this.upid = goodsId;

      detailOrder(goodsId).then(response => {
        this.orderDetail = response.data.data;
      });
    },
    backlist() {
      this.$router.push({ path: "/goods/order" });
    },

    // 查看大图
    showBigPic(url) {
      this.isShowBigPic = true;
      this.activeUrl = url;
    },
    //
    handleshowswitch(status) {
      modifyOrderStatus(status)
        .then(data => {
          this.$notify.success({
            title: "成功",
            message: "修改成功"
          });
        })
        .catch(response => {
          this.$notify.error({
            title: "失败",
            message: response.data.errmsg,
            duration: 0
          });
        });
    },

    // 点击事件，执行审核通过和审核不通过
    async operateVoucher(status) {
      let reason = "";
      let id = this.orderDetail.omsVoucherDto[0].id;
      let orderId = this.orderDetail.orderId;
      if (status === 3) {
        try {
          reason = await this.$prompt("请输入审核不通过的原因", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          });
          reason.value ? (reason = reason.value) : "";
        } catch (err) {
          // this.$message("请在点击审核不通过后，填写审核不通过的原因");
        }
      }
      console.log("reason: " + reason);
      modifyVoucherStatus(id, orderId, status, reason)
        .then(data => {
          this.$message("更改审核状态成功");
          this.$router.go(0)
        })
        //  .catch(err => {
        //    this.$message("更改审核状态失败");
        //  });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  padding: 20px 50px;

  font-size: 14px;

  .table-title {
    margin: 10px 0;
    width: 800px;
    text-align: center;
    font-size: 14px;
    color: #ccc;
  }
  .small-img {
    width: 100px;
  }

  .parallel-box {
    width: 100%;
    display: flex;
    .left {
      flex-grow: 1;
    }
    .right {
      flex-grow: 1;
    }
  }
  /deep/ .el-row {
    margin: 15px 0;
  }
  /deep/ .el-col-2 {
    width: 5.33333vw;
  }
}

.table-button {
  display: inline-block;
  padding: 3px 5px;
  margin: 2px;
  color: white;
  background-color: RoyalBlue;
  border-radius: 5px;
}

.back-color__OrangeRed {
  background-color: OrangeRed;
}
.back-color__Coral {
  background-color: Coral;
}
.back-color__Tomato {
  background-color: Tomato;
}
</style>
