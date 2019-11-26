
<template>
  <div class="app-container" style="padding-top:10px;">
    <!-- 查询和其他操作 -->
    <div class="filter-container" style="border:1px solid #DCDFE6;margin-bottom:20px;height:115px;">
      <div style="width:100%;height:50px;background-color:#F3F3F3;position:relative;margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;padding-right:20px;">
          <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;font-size:15px;"><svg-icon icon-class="search" class-name="card-panel-icon svg" />筛选查找</p>
        <div>
          <el-button style="margin-top:8px;display:inline-block;" @click="handleFilter" v-permission="['GET /members','GET members/short']" class="filter-item">查找</el-button>
          <el-button class="filter-item" style="margin-top:8px;display:inline-block;" @click="showsearbox">高级检索</el-button>
          
          <!-- <el-button
            v-permission="['GET /members']"
            :loading="downloadLoading"
            icon="el-icon-download"
            @click="handleDownload"
            style="margin-top:8px;"
          >导出</el-button> -->
        </div>
        </div>
      </div>
      <span class="search">会员ID:</span>
      <el-input
        v-model.trim="listQuery.memberId"
        clearable
        class="filter-item"
        style="width: 200px;height:28px;"
        placeholder="请输入会员id"
      />
      <span class="search" style="margin-left:10px;">会员昵称:</span>
      <el-input
        v-model.trim="listQuery.nickname"
        clearable
        maxlength="11"
        class="filter-item"
        style="width: 200px;height:28px;margin-right:10px;"
        placeholder="会员昵称"
      />
      <span class="search" style="margin-left:10px;">会员手机号:</span>
      <el-input
        v-model.trim="listQuery.mobile"
        clearable
        maxlength="11"
        class="filter-item"
        style="width: 200px;height:28px;margin-right:10px;"
        placeholder="请输入手机号"
      />
    </div>

    <!-- 查询结果 -->
  <div>
    <div class="tabletop">
      <p class="table-title"><svg-icon icon-class="list2" class-name="card-panel-icon svg"/>数据列表</p>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
    >
      <el-table-column align="center" label="会员id" prop="memberId"/>

      <el-table-column align="center" label="昵称" prop="nickname" />
 
      <el-table-column align="center" label="性别" prop="gender" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.gender==0" type="info">{{genderDic[0]}}</el-tag>
          <el-tag v-if="scope.row.gender==1">{{genderDic[1]}}</el-tag>
          <el-tag v-if="scope.row.gender==2" type="success">{{genderDic[2]}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="微信地址" prop="mobile"  />
      
      <el-table-column align="center" label="手机号" prop="mobile"  />

      <el-table-column align="center" label="头像" prop="avatarUrl">
        <template slot-scope="scope">
          <img v-if="scope.row.avatarUrl" :src="scope.row.avatarUrl" width="80" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="账户状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="success">{{statusDic[0]}}</el-tag>
          <el-tag v-if="scope.row.status==2" type="danger">{{statusDic[1]}}</el-tag>
          <el-tag v-if="scope.row.status==3" type="info">{{statusDic[2]}}</el-tag>
          <el-tag v-if="scope.row.status==4" type="waring">{{statusDic[3]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间" prop="mobile"  />
      <el-table-column align="center" label="详情" width="250">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleUpdate(scope.row)" v-permission="['PUT /members/{memberId}','GET /members/{memberId}']">查看详情</el-button>
        </template>
      </el-table-column>
      
    </el-table>

  </div>
       <!-- 高级检索弹框 -->
       <div class="popContainer" v-show="popcontainer">
         <div v-show="dialogVisible" class="searbox">
        <div style="width:100%;height:50px;background-color:#F3F3F3;position:relative;margin-bottom:10px;border-bottom:1px solid #C0C4CC;">
          <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;margin-right:75%;">高级检索</p>
        </div>
        <el-form label-position="top" ref="searchForm" :model="searchForm" label-width="200" class="searchForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户ID" prop="memberId" class="searchboxtitle">
                <el-input style="width:200px;" placeholder="请输入用户ID" v-model="searchForm.memberId" @input="change($event)"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户昵称" prop="nickname" class="searchboxtitle">
                <el-input placeholder="请输入用户昵称" style="width:200px;" v-model="searchForm.nickname" @input="change($event)"></el-input>
            </el-form-item>
            </el-col>
          </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户手机号" prop="mobile" maxlength="11" class="searchboxtitle">
                <el-input placeholder="请输入用户手机号" style="width:200px;" maxlength="11" v-model="searchForm.mobile" @input="change($event)"></el-input>
            </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="出生日期" class="searchboxtitle">
                  <el-date-picker
                    v-model="searchForm.birthday"
                    type="datetime"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="width:200px;"
                  />
                  </el-form-item>
              </el-col>
            </el-row>
            <el-col :span="12">
              <el-form-item label="注册时间" class="searchboxtitle">
                <el-date-picker
                  v-model="searchForm.regday"
                  type="datetime"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width:200px;margin-right:30px;"
                />
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账户状态" class="searchboxtitle">
                <!-- <el-input v-model="searchForm.status" style="width:200px;"></el-input> -->
                <el-select v-model="status" placeholder="请选择" @change=handUserStatus>
                  <template>
                    <el-option
                    v-for="item in userStaus"
                    :key="item.id"
                    :label="item.value" 
                    :value="item.value">
                    </el-option>
                  </template>
                  </el-select>
              </el-form-item>
            </el-col>
        </el-form>
          <div slot="footer" class="dialog-footer" style="text-align:right;margin-bottom:20px;" >
            <el-button @click="removeSearchBox" >取 消</el-button>
            <el-button @click="handSearchList" style="margin-right:20px;">确 定</el-button>
          </div>
          
      </div>
       </div>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { fetchList,listAddress } from "@/api/user";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "User",
  components: { Pagination },
  data() {
    return {
      popcontainer:false,
      status:undefined,
      userStaus:[
        {
          id:'1',
          value:"可用"
        },
        {
          id:'2',
          value:"禁用"
        },
        {
          id:'3',
          value:"注销"
        },
        {
          id:'4',
          value:"被删除"
        },
      ],
      searchForm:{
        page: 1,
        limit: 20,
        memberId:"",
        nickname:"",
        mobile:"",
        birthday:"",
        regday:"",
        sort: "add_time",
        order: "desc"
      },
      dialogVisible:false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        nickname:undefined,
        memberId: undefined,
        mobile: undefined,
        sort: "add_time",
        order: "desc"
      },
      downloadLoading: false,
      genderDic: ["未知", "男", "女"],
      statusDic: ["可用", "禁用", "注销", "被删除"],
      tempDelArr:[]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handUserStatus(event){
      for(var i=0;i<this.userStaus.length;i++){
        if(event==this.userStaus[i].value)
        this.searchForm.status=this.userStaus[i].id
      }
    },
    selectionAll(){
      for(let i=0;i<row.length;i++){
         this.tempDelArr.push(row[i].key)
       }
    },
    change(e){
      this.$forceUpdate()
    },
    removeSearchBox(){
      this.dialogVisible=false
      this.popcontainer=false
    },
    //   显示高级检索弹窗
    showsearbox(){
        this.dialogVisible=true
        this.popcontainer=true
    },
    handSearchList(){
      fetchList(this.searchForm).then(response=>{
        this.list=response.data.data.list
        this.searchForm.memberId=undefined
        this.searchForm.nickname=undefined
        this.searchForm.mobile=undefined
        this.searchForm.birthday=undefined
        this.searchForm.regday=undefined
        this.status=undefined
        this.dialogVisible=false
        this.popcontainer=false
      })
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery)
        .then(response => {
          this.list = response.data.data.list;
          console.log(this.list)
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
    handleUpdate(row) {
      this.$router.push({ path: "/test/userlook", query: { id: row.memberId } });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["会员id","会员昵称", "性别", "手机号", "头像地址", "账户状态"];
        const filterVal = [
          "memberId",
          "nickname",
          "gender",
          "mobile",
          "avatarUrl",
          "status"
        ];
        excel.export_json_to_excel2(tHeader, this.list, filterVal, "用户信息");
        this.downloadLoading = false;
      });
    }
  }
};
</script>
<style scoped>
.searbox{
  background:#fff;
  position:fixed;
  top:20%;
  left:35%;
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
.search{
  font-size:14px;
  color:#909399;
  font-weight:600;
  display:inline-block;
  display:inline-block;
  margin-left:10px;
}
.el-form-item__label{
  color:#666;
}
.tabletop{
  height:60px;
  width:100%;
  background:#f3f3f3;
  border-top:1px solid #EBEEF5;
  border-left:1px solid #EBEEF5;
  border-right:1px solid #EBEEF5;
}

.searchForm{
  margin-left:50px;
  margin-right:30px;
}
.svg{
  margin-right:5px;
}
</style>
