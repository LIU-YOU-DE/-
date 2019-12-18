<template>
    <div style="margin-top:10px;">
        <div class="filter-container" style="border:1px solid #DCDFE6;margin-bottom:20px;height:115px;width:98%;margin:0 auto;margin-top:10px;">
       <div style="width:100%;height:50px;background-color:#F3F3F3;position:relative;margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;padding-right:20px;">
          <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;font-size:15px;"><svg-icon icon-class="search" class-name="card-panel-icon svg" />筛选查找</p>
        <div>
          <el-button v-permission="['GET /prizeRecord']" class="filter-item" icon="el-icon-search" @click="seachprize" style="margin-top:8px;display:inline-block;">查找</el-button>
        </div>
        </div>
      </div>
      <span class="search">用户姓名：</span>
           <el-input
            v-model.trim="listQuery.memberName"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="请输入用户姓名"
            v-on:keyup.enter.native="seachprize"
          />
      <span class="search">奖品名称：</span>
      <el-input
            v-model.trim="listQuery.prizeName"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="请输入奖品名称"
            v-on:keyup.enter.native="seachprize"
          />
          
          <span class="search">手机号码：</span>
          <el-input
            v-model.trim="listQuery.phoneNumber"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="请输入手机号码"
            v-on:keyup.enter.native="seachprize"
          />
      </div>

            <div class="tabletop" style="margin-top:20px;">
                <p class="table-title"><svg-icon icon-class="list2" class-name="card-panel-icon svg"/>数据列表</p>
            </div>
            <el-table 
                :data="list"
                style="width:98%;margin:0 auto;"
                border
                fit
                highlight-current-row
                >
                <el-table-column align="center" label="用户id" prop="memberId"></el-table-column> 
                <el-table-column align="center" label="用户姓名" prop="memberName"></el-table-column> 
                <el-table-column align="center" label="手机号码" prop="phoneNumber"></el-table-column> 
                <el-table-column align="center" label="奖品名称" prop="prizeName"></el-table-column> 
                <el-table-column align="center" label="奖品图片" prop="prizeImgUrl">
                    <template  slot-scope="scope">
                        <img :src="scope.row.prizeImgUrl" v-if="scope.row.prizeImgUrl" style="width:50px;">
                    </template>
                </el-table-column>
                <el-table-column align="center" label="领取状态" prop="status">
                    <template slot-scope="scope">
                        <el-tag 
                        v-permission="['PUT /prizeRecord/{id}']"
                        :type="scope.row.status==1 ? 'success' : (scope.row.status== 2 ?'info':'danger')" 
                        v-model="scope.row.status"
                        >{{scope.row.status==1 ? '用户未领取奖品' : (scope.row.status== 2 ?'用户领取奖品':'管理员已经联系过该用户')}}
                        </el-tag>
                    </template>
                </el-table-column> 
                <el-table-column align="center" label="操作" prop="status" width="250">
                    <template  slot-scope="scope">
                        <el-button v-if="scope.row.status==2" @click.prevent="handupdatestatus(scope.row.id,scope.row.status)" size="mini" type="success" v-permission="['PUT /prizeRecord/{id}']">我已联系</el-button>
                        <el-button v-if="scope.row.status==3" @click.prevent="handupdatestatus(scope.row.id,scope.row.status)" size="mini" type="success" v-permission="['PUT /prizeRecord/{id}']">改回未联系</el-button>
                        <el-button @click="handdeleteprizeroc(scope.row.id)" type="danger" size="mini" v-permission="['DELETE /prizeRecord/{id}']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
    </div>
</template>

<script>
import {getprizerecord,getprize,updatestatus ,deleteprizeroc} from '@/api/storage'

export default {
    data(){
        return {
            attributeForm: { prizeName: '', memberId: '', memberName: '', phoneNumber:'',activityId:'' },
            list:[],
            listQuery: {
                page: 1,
                limit: 10,
                name: '',
                order: "desc",
                sort:"update_time",
                prizeName:"",
                activityId:'',
                memberId:"",
                memberName:"",
                prizeName:"",
                memberId:""
            },
        }
    },
    created(){
        this.handgetprizeRecord()
    },
    methods:{
        // 删除用户中奖记录
        handdeleteprizeroc(id){
            this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                deleteprizeroc(id).then(response=>{
                this.$notify.success({
                    title:"成功",
                    message:"删除成功"
                })
                this.handgetprizeRecord()
            }).catch(response=>{
                this.$notify.error({
                    title:"失败",
                    message:response.data.errmsg,
                    duration:0
                })
            })
            })
        },
        // 修改用户领取状态
        handupdatestatus(id,status){
            if(status==2){
                status=3
                updatestatus(id,status).then(response=>{
                    this.handgetprizeRecord()
                })
            }else if(status==3){
                status=2
            }updatestatus(id,status).then(response=>{
                this.handgetprizeRecord()
            })
        },
        handgetprizeRecord(){
            getprizerecord(this.listQuery).then(response=>{
                this.list=response.data.data.list
            })
        },
        seachprize(){
          getprizerecord(this.listQuery).then(response=>{
              this.list=response.data.data.list
          })
      },
    }
}
</script>

<style scoped>
.tabletop{
  border-top:1px solid #DCDFE6;
  border-left:1px solid #DCDFE6;
  border-right:1px solid #DCDFE6;
  height:50px;
  width:98%;
  background-color:#F3F3F3;
  margin:0 auto;
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