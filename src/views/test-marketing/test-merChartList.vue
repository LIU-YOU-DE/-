<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container" style="border:1px solid #DCDFE6;margin-bottom:20px;height:115px;">
      <div style="display:flex;justify-content:space-between;padding-right:20px;background-color:#F3F3F3;">
        <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;font-size:15px;"><svg-icon icon-class="search" class-name="card-panel-icon svg" />筛选查找</p>
        <div>
          <el-button v-permission="['GET /admin']" class="filter-item" icon="el-icon-search" @click="handMerchartList"  style="margin-top:8px;display:inline-block;">查找</el-button>
          <el-button icon="el-icon-edit" style="margin-top:8px;display:inline-block;" @click="createMerchart">添加</el-button>
        </div>
      </div>
      <div style="margin-top:10px;">
        <span class="search" style="display:inline-block;margin-left:10px;margin-top:-5px;">门店名称:</span>
        <el-input v-model.trim="listQuery.merchantName" clearable class="filter-item" style="width:200px;margin-top:5px;" placeholder="请输入门店名称"/>
        <span class="search" style="display:inline-block;margin-left:10px;margin-top:-5px;">负责人姓名:</span>
        <el-input v-model.trim="listQuery.principal" clearable class="filter-item" style="width:200px;margin-top:5px;" placeholder="请输入负责人姓名"/>
        <span class="search" style="display:inline-block;margin-left:10px;margin-top:-5px;">联系电话:</span>
        <el-input v-model.trim="listQuery.phoneNumber" clearable class="filter-item" style="width:200px;margin-top:5px;" placeholder="请输入联系电话"/>
      </div>
    </div>

    <div>
      <div class="tabletop">
      <p class="table-title"><svg-icon icon-class="list2" class-name="card-panel-icon svg"/>数据列表</p>
      </div>
      <!-- 查询结果 -->
      <el-table :data="list" border fit highlight-current-row>
        <el-table-column align="center" label="门店ID" prop="merchantId" sortable/>

        <el-table-column align="center" label="门店名称" prop="merchantName"/>

        <el-table-column align="center" label="负责人姓名" prop="principal"/>
        <el-table-column align="center" label="门店地址" prop="address"/>
        <el-table-column align="center" label="合作状态" prop="status">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.status==1" type="error">正常合作</el-tag>
                <el-tag v-if="scope.row.status==2" type="success">取消合作</el-tag>
            </template>
        </el-table-column>

        <el-table-column align="center" label="联系电话" prop="phoneNumber"></el-table-column>
            
        <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
            <template slot-scope="scope">
                <el-button size="mini" @click="merChartEdit(scope.row)">编辑商家</el-button>
                <el-button size="mini" @click="updateMerchanrt(scope.row)" style="text-align:center;">产品信息</el-button>
            </template>
        </el-table-column>
    </el-table>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<style scoped>
.fixed-width .el-button--mini{
  padding:10px 0 ;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}
.avatar-uploader-icon[data-v-bbbefb3a]{
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.el-button+.el-button{
  margin-left:0;
}
.search{
  font-size:14px;
  color:#909399;
  font-weight:600;
  display:inline-block;
  display:inline-block;
  margin-left:10px;
}
.tabletop{
  height:50px;
  width:100%;
  background:#f3f3f3;
  border-top:1px solid #EBEEF5;
  border-left:1px solid #EBEEF5;
  border-right:1px solid #EBEEF5;
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
  font-size:15px;
}

.popContainer{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.3);
    z-index:1000;
}
.createbox{
  position:fixed;
  background:#fff;
  border:1px solid #EBEEF5;
  width:40%;
  top:20%;
  left:30%;
}
.tabletop{
  height:50px;
  width:100%;
  background:#f3f3f3;
  border-bottom:1px solid #EBEEF5;
}
.address{
  font-size:18px;
  color:#666;
  margin-left:20px;
  font-weight:600;
}
.avatar-uploader-icon[data-v-e4964176]{
  border:1px dashed #d9d9d9;
  border-radius:6px;
}
</style>

<script>
import { getMearchList} from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Admin',
  components: { Pagination },
  data() {
    return {
        list:[],
        total:0,
        goods:{
          cover:'',
          images:[],
          merchantId:'',
          price:'',
          productId:''
        },
        listLoading: true,
        listQuery: {
          currentPage:1,
          pageSize:10,
          merchantName: '',
          phoneNumber:'',
          principal:'',
        },
    }
  },
  computed: {
    headers() {
      return {
        'Mf-Token': getToken()
      }
    }
  },
  created(){
      this.getList()
  },
  methods: {
    merChartEdit(row){
      this.$router.push({path:'/test-marketing/test-upkeepMerChantAddressEdit',query:{row:row}})
    },
    updateMerchanrt(row){
      this.$router.push({path:'/test-marketing/test-maintenanceEdit',query:{id:row.merchantId}})
    },
      createMerchart(){
        this.$router.push({path:'/test-marketing/test-upkeepMerChantAddress'})
      },
      handMerchartList(){
        this.getList()
      },
      getList(){
          getMearchList(this.listQuery).then(response=>{
            this.list=response.data.data.items
            this.total=response.data.data.totalPage
          })
      }
  }

}
</script>
