<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入商品名称"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" v-permission="['GET /cars']">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate" v-permission="['POST /car']">添加</el-button>
      <el-button
        v-permission="['GET /cars']"
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
      <el-table-column align="center" label="汽车id" prop="id" />
      <el-table-column align="center" property="brandName" label="品牌名称"/>
      <el-table-column align="center" label="名称" prop="name" />
      <el-table-column align="center" label="汽车种类" prop="carTypeName" />
      </el-table-column>
      <el-table-column align="center" property="photos" label="车型图集">
        <template slot-scope="scope">
          <img v-for="pic in scope.row.photos" :key="pic" :src="pic" width="40" @click="showCarImg(scope.row.photos)"/>
        </template>
      </el-table-column>


      <el-table-column align="center" label="车子详情图">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showcar(scope.row.detail)">查看</el-button>

          <el-dialog :visible.sync="detailDialogVisible" title="商品详情">
          <el-carousel indicator-position="none" :autoplay="false">
            <el-carousel-item  v-for ="item in showCarImgUrl" :key="item">
                <img :src="item" class="lunbo">
            </el-carousel-item>
          </el-carousel>
          </el-dialog>

          <el-dialog :visible.sync="detaShowCar" title="车子详情">
            <img :src="goodsDetail" alt />
          </el-dialog>
          <el-dialog :visible.sync="detaShowCar" title="车型详情">
            <img :src="goodsDetail" alt />
          </el-dialog>
        </template>
      </el-table-column>>
      <!-- <el-table-column align="center" property="photos" label="车型图集">
        <template slot-scope="scope">
          <img :src="scope.row.shareUrl" width="40">
        </template>
      </el-table-column>-->

      <el-table-column align="center" label="活动结束时间" prop="endTime" />

      <el-table-column align="center" label="购买截止日期" prop="buyDeadline" />
      <el-table-column align="center" label="排序" prop="sort" />
      <el-table-column align="center" label="备注" prop="remark" />
      <el-table-column align="center" label="是否特卖车" prop="isSpecial">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isSpecial==1 ? 'success' : 'error' "
          >{{ scope.row.isSpecial==1 ? '非特卖车' : '特卖车' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否上架" prop="status">
        <template slot-scope="scope">
          <!-- <el-tag
            :type="scope.row.status==2 ? 'success' : 'danger' "
          >{{ scope.row.status==2 ? '上架' : '下架' }}</el-tag> -->
          <el-tag :type="scope.row.status==2 ? 'success' : 'warning' ">{{ scope.row.status==2 ? '上架' : '下架' }}</el-tag>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="是否在售" prop="isOnSale">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isOnSale ? 'success' : 'error' "
          >{{ scope.row.isOnSale ? '在售' : '未售' }}</el-tag>
        </template>
      </el-table-column>-->

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button :type="scope.row.status==2 ? 'warning' : 'success'" size="mini" @click="handUpdateStatus(scope.row.id,scope.row.status)" class="box">{{ scope.row.status==2 ? '下架' : '上架' }}</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)" v-permission="['PUT /car/{id}']" class="box">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)" v-permission="['DELETE /car/{id}']" class="box">删除</el-button>
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

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>
  </div>
</template>

<style scoped>
.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 100px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}
.gallery {
  width: 80px;
  margin-right: 10px;
}
.el-carousel__container{
  height:400px;
}
.lunbo{
  width:750px;
  height:402px;
}
.box{
  margin:0!important;
  display: inline-block;
}
</style>

<script>
import { listGoods, deleteGoods, updateStatus } from "@/api/goods";
import BackToTop from "@/components/BackToTop";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "GoodsList",
  components: { BackToTop, Pagination },
  data() {
    return {
      photos1: "",
      list: [],
      total: 0,

      showCarImgUrl:[],

      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        sort: "add_time",
        order: "desc"
      },
      goodsDetail: "",
      detailDialogVisible: false,
      detaShowCar:false,
      downloadLoading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 修改汽车上下架状态
    handUpdateStatus(id,status){
      if(status==2){
        status=1
        updateStatus(id,status)
      .then(response=>{
        this.$notify.success({
          title:"成功",
          message:"汽车已下架"
        })
        this.getList()
      }).catch(response=>{
        this.$notify.error({
          title:"失败",
          message:response.data.errmsg,
          duration: 0
        })
      })
      }else if(status==1){
        status=2
        updateStatus(id,status)
      .then(response=>{
        this.$notify.success({
          title:"成功",
          message:"汽车已上架"
        })
        this.getList()
      }).catch(response=>{
        this.$notify.error({
          title:"失败",
          message:response.data.errmsg,
          duration: 0
        })
      })
      }
    },
    showCoverUrl(detail){
      this.goodsDetail = detail;
      this.detaShowCar = true;
    },
    showCarImg(photos){
      this.showCarImgUrl = photos
      this.detailDialogVisible = true;
    },
    showcar(detail){
      this.goodsDetail = detail;
      this.detaShowCar = true;
    },
    getList() {
      this.listLoading = true;
      listGoods(this.listQuery)
        .then(response => {
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
    handleCreate() {
      this.$router.push({ path: "/goods/create" });
    },
    handleUpdate(row) {
      this.$router.push({ path: "/goods/edit", query: { id: row.id } });
    },
    showDetail(detail) {
      this.goodsDetail = detail;
      this.detailDialogVisible = true;
    },
    handleDelete(row) {
      deleteGoods(row)
        .then(response => {
          this.$notify.success({
            title: "成功",
            message: "成功下架"
          });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        })
        .catch(response => {
          this.$notify.error({
            title: "失败",
            message: response.data.errmsg,
            duration: 0
          });
        });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "商品ID",
          "商品编号",
          "名称",
          "专柜价格",
          "当前价格",
          "是否新品",
          "是否热品",
          "是否在售",
          "首页主图",
          "宣传图片列表",
          "商品介绍",
          "详细介绍",
          "商品图片",
          "商品单位",
          "关键字",
          "类目ID",
          "品牌商ID"
        ];
        const filterVal = [
          "id",
          "goodsSn",
          "name",
          "counterPrice",
          "retailPrice",
          "isNew",
          "isHot",
          "isOnSale",
          "listPicUrl",
          "gallery",
          "brief",
          "detail",
          "picUrl",
          "goodsUnit",
          "keywords",
          "categoryId",
          "brandId"
        ];
        excel.export_json_to_excel2(tHeader, this.list, filterVal, "商品信息");
        this.downloadLoading = false;
      });
    }
  }
};
</script>
