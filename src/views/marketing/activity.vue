<template>
    <div style="margin-top:10px;">
      <el-input
            v-model.trim="getListQuery.name"
            clearable
            class="filter-item"
            style="width: 200px;margin-left:20px;margin-right:10px;"
            placeholder="请输入活动名称"
            v-on:keyup.enter.native="seachprize"
          />
        <el-button @click="seachprize" type="primary" style="margin-left:10px;">查找</el-button>
        <el-button @click="goactivityadd" type="primary" style="margin-left:10px;">添加</el-button>

    <el-table style="margin-left:20px;margin-right:20px;width:98%;margin-top:10px;"
        border
        :data=list
        fit>
        <el-table-column align="center" label="活动ID" prop="id" width="150"></el-table-column>
        <el-table-column align="center" label="活动类型" prop="type" width="150"></el-table-column>
        <el-table-column align="center" label="活动名称" prop="activityName"></el-table-column>
        <el-table-column align="center" label="活动描述" prop="description" width="500"></el-table-column>
        <el-table-column align="center" label="活动状态" prop="payStatus">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="primary">进行中</el-tag>
          <el-tag v-if="scope.row.status==2" type="danger">未开始</el-tag>
        </template>
      </el-table-column>
    <el-table-column align="center" label="修改活动状态" prop="payStatus">
        <template slot-scope="scope">
            <el-button :type="scope.row.status==1?'success':'danger'" @click="updateactivitystatus(scope.row.id,scope.row.status)" size="mini">{{scope.row.status==1?'结束活动':'开始活动'}}</el-button>
        </template>
    </el-table-column>
        <el-table-column align="center" label="操作">
            <template slot-scope="scope">
                <el-button type="success" @click="showActiviti(scope.row)" size="mini">查看</el-button>
                <el-button type="primary" @click="goactivityedit(scope.row)" size="mini">编辑</el-button>
                <el-button type="danger" @click="handDeleteActivity(scope.row)" size="mini">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-dialog
      title="查看活动信息"
      :visible.sync="dialogVisible"
      width="700px"
    >
      <el-form ref="dataForm" :model="dataForm" label-width="150px;" label-position="right">
          <el-form-item label="活动ID" style="padding-left:16px;">
                <el-input class="prizeinp" v-model="dataForm.id" readonly></el-input>
            </el-form-item>
            <el-form-item label="活动名称">
                <el-input class="prizeinp" v-model="dataForm.activityName" readonly></el-input>
            </el-form-item>
            <el-form-item label="活动类型">
              <el-input class="prizeinp" v-model="dataForm.type" readonly></el-input>
            </el-form-item>
            <el-form-item label="活动描述">
              <template slot-scope="scope">
                <div v-for="(d,index) in dataForm.description" :key="index" style="padding-left:67px;">
                  <el-input v-model="dataForm.description[index]" class="prizeinp desc" readonly type="textarea"></el-input>
              </div>
              </template>
            </el-form-item>


            <el-form-item label="活动状态">
              <el-tag>{{dataForm.payStatus==1?'未开始':'进行中'}}</el-tag>
            </el-form-item>
      </el-form>
      <el-button type="primary" @click="dialogVisible = false" style="margin-right:0;">确 定</el-button>
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
              payStatus:''
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
      showActiviti(row){
         this.dialogVisible=true
         this.dataForm.id=row.id
         this.dataForm.activityName=row.activityName
         this.dataForm.type=row.type
         this.dataForm.description=row.description
         this.dataForm.payStatus=row.status
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
        this.$router.go(0)
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
        this.$router.go(0)
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
        },
        getlist(){
            activitylist(this.listQuery).then(response=>{
                this.list=response.data.data.list
            })
        },
        goactivityedit(row) {
            this.$router.push({
                path: "/marketing/activityedit",
                query: {id:row.id, row:row}
            });
        },
        goactivityadd(){
            this.$router.push({ path:"/marketing/activityadd" })
        }
    }
}
</script>>

<style scoped>
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
