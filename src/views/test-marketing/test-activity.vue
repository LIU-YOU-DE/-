<template>

    <div style="margin-top:10px;width:98%;margin:0 auto;">
      <div style="border:1px solid #DCDFE6;margin-top:10px;">
        <div style="width:100%;height:50px;background-color:#F3F3F3;margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;padding-right:20px;">
                <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;font-size:15px;"><svg-icon icon-class="search" class-name="card-panel-icon svg" />筛选查找</p>           
                <div>
                    <el-button class="filter-item" icon="el-icon-search" @click="seachprize" v-permission="['GET /activity','GET /activity/{id}']">查找</el-button>
                    <el-button @click="goactivityadd" style="margin-top:10px;" v-permission="['POST /activity']">添加</el-button>
                </div>
            </div>
          
        </div>
        <span class="search">活动名称</span>
          <el-input
            v-model.trim="getListQuery.name"
            clearable
            class="filter-item"
            style="width: 200px;margin-left:20px;margin-right:10px;margin-bottom:10px;"
            placeholder="请输入活动名称"
            v-on:keyup.enter.native="seachprize"
          />
      </div>
      
      <div class="tabletop" style="margin-top:20px;">
        <p class="table-title"><svg-icon icon-class="list2" class-name="card-panel-icon svg"/>数据列表</p>
      </div>
        <el-table
        border
        :data=list
        fit>
        <el-table-column align="center" label="活动ID" prop="id" width="150"></el-table-column>
        <el-table-column align="center" label="活动类型" prop="type" width="150">
          <template slot-scope="scope">
          <el-tag v-if="scope.row.type==1" type="primary">水果机</el-tag>
          <el-tag v-if="scope.row.type==2" type="danger">未开始</el-tag>
        </template>
        </el-table-column>
        <el-table-column align="center" label="活动名称" prop="activityName"></el-table-column>
        <el-table-column align="center" label="活动描述" prop="description" width="500"></el-table-column>
        <el-table-column align="center" label="活动状态" prop="payStatus">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="primary" v-permission="['PUT /activity/status/{id}']">进行中</el-tag>
          <el-tag v-if="scope.row.status==2" type="danger" v-permission="['PUT /activity/status/{id}']">未开始</el-tag>
        </template>
      </el-table-column>
    <el-table-column align="center" label="修改活动状态" prop="payStatus">
        <template slot-scope="scope">
            <el-button :type="scope.row.status==1?'success':'danger'" @click="updateactivitystatus(scope.row.id,scope.row.status)" size="mini" v-permission="['PUT /activity/status/{id}']">{{scope.row.status==1?'结束活动':'开始活动'}}</el-button>
        </template>
    </el-table-column>
        <el-table-column align="center" label="操作">
            <template slot-scope="scope">
                <el-button @click="showActiviti(scope.row)" size="mini" v-permission="['GET /activity/{id}']">查看</el-button>
                <el-button @click="goactivityedit(scope.row)" size="mini" v-permission="['PUT /activity/{id}']">编辑</el-button>
                <el-button type="danger" @click="handDeleteActivity(scope.row)" size="mini" v-permission="['DELETE /activity/{id}']">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    

    <el-dialog
      title="查看活动信息"
      :visible.sync="dialogVisible"
      width="800px;"
    >
      <el-form ref="dataForm" :model="dataForm" label-width="150px;" label-position="right">
          <el-form-item label="活动ID" style="padding-left:16px;">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="活动名称">
                <span>{{dataForm.activityName}}</span>
            </el-form-item>
            <el-form-item label="活动类型">
              <span>{{dataForm.type}}</span>
            </el-form-item>
            <el-form-item label="活动描述">
              <template slot-scope="scope">
                <div v-for="(d,index) in dataForm.description" :key="index" style="padding-left:67px;">
                  <span>{{dataForm.description[index]}}</span>
              </div>
              </template>
            </el-form-item>
            <el-form-item label="活动状态">
              <el-tag>{{dataForm.payStatus==1?'未开始':'进行中'}}</el-tag>
            </el-form-item>
      </el-form>

        <p style="font-size:16px;">奖品列表</p>
        <el-table border :data="dataForm.prizeList">
        <el-table-column align="center" label="奖品ID" prop="prizeId" width="100"/>
        <el-table-column align="center" label="奖品名称" prop="prizeName" width="200"/>
        <el-table-column align="center" label="奖品描述" prop="description" type="textarea" width="300"/>
        <el-table-column align="center" prop="imgUrl" label="奖品图片" width="150">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl" width="40" >
          </template>
        </el-table-column>
        <el-table-column align="center" label="中奖概率" prop="probability" width="100">
          <div>{{list.probability}}</div>
        </el-table-column>
         </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="200"   
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deletePrize(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="dialogVisible = false" style="margin-right:0;margin-top:10px;">确 定</el-button>
    </el-dialog>
    </div>
</template>

<script>
import {activitylist,deleteactivity,updateactivity2} from '@/api/storage'

export default {
    data(){
        return {
            dataForm:{
              id:'',
              activityName:'',
              type:'',
              description:'',
              payStatus:'',
              prizeList:""
            },
            list:[],
            dialogVisible:false,
            listQuery: {
                page: 1,
                limit: 20,
                name: undefined,
                sort: "create_time",
                order: "desc"
            },
            getListQuery: {
                page: 1,
                limit: 10,
                name: '',
                order: "desc",
                sort:"create_time",

            },
        }
    },
    created(){
        this.getlist()
    },
    methods:{
      // 查看
      showActiviti(row){
          this.dialogVisible=true
          this.dataForm.id=row.id
          this.dataForm.activityName=row.activityName
          this.dataForm.type=row.type
          this.dataForm.description=row.description
          this.dataForm.prizeList=row.prizeList
          this.dataForm.payStatus=row.status
          this.$router.push({path:"/test-marketing/test-showactivity",query:{row:row}})
        },
      // 查找
      seachprize(){
        activitylist(this.getListQuery).then(response=>{
          this.list=response.data.data.list
        })
      },
        updateactivitystatus(id,status){
          if(status==2){
        status=1
        updateactivity2(id,status)
      .then(response=>{
        this.$notify.success({
          title:"成功",
          message:"状态修改成功"
        })
        this.getlist()
      }).catch(response=>{
        this.$notify.error({
          title:"失败",
          message:response.data.errmsg,
          duration: 0
        })
      })
      }else if(status==1){
        status=2
        updateactivity2(id,status)
      .then(response=>{
        this.$notify.success({
          title:"成功",
          message:"状态修改成功"
        })
        this.getlist()
      }).catch(response=>{
        this.$notify.error({
          title:"失败",
          message:response.data.errmsg,
          duration: 0
        })
      })
      }
        },
        handDeleteActivity(row){
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            deleteactivity(row.id).then(response=>{
                this.$notify.success({
                    title:"成功",
                    message:"活动删除成功"
                })
                this.getlist()
            }).catch(response=>{
                this.$$notify.error({
                    title:"失败",
                    message:response.data.errmsg,
                    duration: 0
                })
            })
          }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        },
        getlist(){
            activitylist(this.listQuery).then(response=>{
                this.list=response.data.data.list
            })
        },
        goactivityedit(row) {
            this.$router.push({
                path: "/test-marketing/test-activityedit",
                query: {id:row.id, row:row}
            });
        },
        goactivityadd(){
            this.$router.push({ path:"/test-marketing/test-activityadd" })
        }
    }
}
</script>>

<style scoped>
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
.tabletop{
  height:50px;
  width:100%;
  background-color:#F3F3F3;
  margin-top:20px;
}
.search{
  font-size:14px;
  color:#909399;
  font-weight:600;
  display:inline-block;
  display:inline-block;
  margin-left:10px;
}
  .tablewidth{
    width:50px!important;
  }
  .prizeinp{
    width:500px;
  }
  .desc{
    margin-top:5px;
  }
  .inputbox  div:not(:first-child){
	  margin-left:30px;
  }
.inputbox>el-input:not(:first-child){
  margin-left:200px!important;
}
</style>
