<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container" style="border:1px solid #DCDFE6;margin-bottom:20px;height:115px;">
       <div style="width:100%;height:50px;background-color:#F3F3F3;position:relative;margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;padding-right:20px;">
          <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;font-size:15px;"><svg-icon icon-class="search" class-name="card-panel-icon svg" />筛选查找</p>
        <div>
          <el-button v-permission="['GET /cars']" class="filter-item" icon="el-icon-search" @click="handleFilter" style="margin-top:8px;display:inline-block;">查找</el-button>
          <el-button class="filter-item" icon="el-icon-edit" @click="handleCreate" v-permission="['POST /car']"style="margin-top:8px;display:inline-block;">添加</el-button>
        </div>
        </div>
      </div>
      <span class="search">品牌名称：</span>
      <el-input
        v-model.trim="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入品牌名称"
      />
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
      <el-table-column align="center" property="brandName" label="品牌名称"/>

      <el-table-column align="center" label="车型名称" prop="name" />

      <el-table-column align="center" label="车型种类" prop="carTypeName" />

      <el-table-column align="center" property="photos" label="车型图">
        <template slot-scope="scope">
          <img v-for="pic in scope.row.photos" :key="pic" :src="pic" width="40" @click="showCarImg(scope.row.photos)"/>
          
          <el-dialog :visible.sync="detailDialogVisible" title="车型详情图">
          <el-carousel indicator-position="none" :autoplay="false">
            <el-carousel-item  v-for ="item in showCarImgUrl" :key="item">
                <img :src="item" class="lunbo">
            </el-carousel-item>
          </el-carousel>
          </el-dialog>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标签">
        <template slot-scope="scope">
            <p>
              <span v-if="scope.row.status==2">下架</span>
              <span v-if="scope.row.status==1">上架</span>
              <el-switch
                v-model="scope.row.status"
                @change="handchangestatus(scope.row.id,scope.row.status)"
                :active-value="value1"
                :inactive-value="value2"
                v-permission="['PUT /car/status/{id}']"
                active-color="#13ce66"
                inactive-color="#ff4949">
                </el-switch>
            </p>
            <p>
              <span v-if="scope.row.isHot==2">非热销</span>
              <span v-if="scope.row.isHot==1">热销</span>
              <el-switch
                v-model="scope.row.isHot"
                @change="handChangeIsHot(scope.row.id,scope.row.isHot)"
                :active-value="value1"
                :inactive-value="value2"
                active-color="#13ce66"
                v-permission="['PUT /car/isHot/{id}']"
                inactive-color="#ff4949">
                </el-switch>
            </p>
            <p>
              <span v-if="scope.row.isRecommend==2">非推荐</span>
              <span v-if="scope.row.isRecommend==1">推荐</span>
              <el-switch
                v-model="scope.row.isRecommend"
                @change="handChangeIsRecommed(scope.row.id,scope.row.isRecommend)"
                :active-value="value1"
                :inactive-value="value2"
                active-color="#13ce66"
                v-permission="['PUT /car/isRecommend/{id}']"
                inactive-color="#ff4949">
                </el-switch>
            </p>
            <p>
              <span v-if="scope.row.isPopular==2">非人气</span>
              <span v-if="scope.row.isPopular==1">人气</span>
              <el-switch
                v-model="scope.row.isPopular"
                @change="handChangeIsPopular(scope.row.id,scope.row.isPopular)"
                :active-value="value1"
                :inactive-value="value2"
                active-color="#13ce66"
                v-permission="['PUT /car/isPopular/{id}']"
                inactive-color="#ff4949">
                </el-switch>
            </p>
            <p>
              <span v-if="scope.row.isSpecial==2">非特卖</span>
              <span v-if="scope.row.isSpecial==1">特卖</span>
              <el-switch
                v-model="scope.row.isSpecial"
                @change="handChangeIsSpecial(scope.row.id,scope.row.isSpecial)"
                :active-value="value1"
                :inactive-value="value2"
                active-color="#13ce66"
                v-permission="['PUT /car/isSpecial/{id}']"
                inactive-color="#ff4949">
                </el-switch>
            </p>

        </template>
      </el-table-column>

      <el-table-column align="center" label="购买截止日" prop="buyDeadline" />

      <el-table-column align="center" label="活动截止日" prop="endTime" />

      <el-table-column align="center" label="备注" prop="remark" />

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button :type="scope.row.status==2 ? 'warning' : 'success'" size="mini" @click="handUpdateStatus(scope.row.id,scope.row.status)" class="box">{{ scope.row.status==2 ? '下架' : '上架' }}</el-button> -->
          <el-button size="mini" @click="handleUpdate(scope.row)" v-permission="['PUT /car/{id}','GET /car/{id}']" class="box">编辑</el-button>
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
.tabletop{
  border-top:1px solid #DCDFE6;
  border-left:1px solid #DCDFE6;
  border-right:1px solid #DCDFE6;
  height:50px;
  width:100%;
  background-color:#F3F3F3;
  margin-top:20px;
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
.search{
  font-size:14px;
  color:#909399;
  font-weight:600;
  display:inline-block;
  display:inline-block;
  margin-left:10px;
}
</style>

<script>
import { listGoods, deleteGoods, updateStatus,updateIsSpecial ,updateIsRecommend, updateIsPopular,updateIsHot } from "@/api/goods";
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
      value1:1,
      value2:2,
      value3:1,
      value4:2,
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
      downloadLoading: false,
      status:'',
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // updateIsSpecial ,updateIsRecommend, updateIsPopular,updateIsHot
    handChangeIsSpecial(id,isSpecial){
      updateIsSpecial(id,isSpecial).then(response=>{
        this.$notify.success({
          title:"成功",
          message:"状态修改成功"
        })
      }).catch(response=>{
        this.$notify.error({
          title:"失败",
          message:response.data.errmsg,
          duration:0
        })
      })
    },
    handChangeIsPopular(id,isPopular){
      updateIsPopular(id,isPopular).then(response=>{
        this.$notify.success({
          title:"成功",
          message:"状态修改成功"
        })
      }).catch(response=>{
        this.$notify.error({
          title:"失败",
          message:response.data.errmsg,
          duration:0
        })
      })
    },
    handChangeIsRecommed(id,isRecommend){
      updateIsRecommend(id,isRecommend).then(response=>{
        this.$notify.success({
          title:"成功",
          message:"状态修改成功"
        })
      }).catch(response=>{
        this.$notify.error({
          title:"失败",
          message:response.data.errmsg,
          duration:0
        })
      })
    },
    handChangeIsHot(id,isHot){
      updateIsHot(id,isHot).then(response=>{
        this.$notify.success({
          title:"成功",
          message:"状态修改成功"
        })
      }).catch(response=>{
        this.$notify.error({
          title:"失败",
          message:response.data.errmsg,
          duration:0
        })
      })
    },
    // 修改汽车状态
    handchangestatus(id,status){
        updateStatus(id,status).then(response=>{
          this.$notify.success({
            title:"成功",
            message:"状态修改成功"
          })
        }).catch(response=>{
          this.$notify.error({
            title:"失败",
            message:response.data.errmsg,
            duration:0
          })
          this.getList()
        })
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
      this.$router.push({ path: "/test-marketing/test-create" });
    },
    handleUpdate(row) {
      this.$router.push({ path: "/test-marketing/test-edit", query: { id: row.id } });
    },
    showDetail(detail) {
      this.goodsDetail = detail;
      this.detailDialogVisible = true;
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          deleteGoods(row)
        .then(response => {
          this.$notify.success({
            title: "成功",
            message: "成功下架"
          });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        })
      }).catch(()=>{
        deleteGoods(row).catch(response=>{
          this.$notify.error({
            title:"失败",
            message:response.data.errmsg,
            duration:0
          })
        })
      })
      // deleteGoods(row)
      //   .then(response => {
      //     this.$notify.success({
      //       title: "成功",
      //       message: "成功下架"
      //     });
      //     const index = this.list.indexOf(row);
      //     this.list.splice(index, 1);
      //   })
      //   .catch(response => {
      //     this.$notify.error({
      //       title: "失败",
      //       message: response.data.errmsg,
      //       duration: 0
      //     });
      //   });
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
