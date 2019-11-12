<template>
    <div style="margin-top:10px;">
        <el-input
            v-model.trim="listQuery.prizeName"
            clearable
            class="filter-item"
            style="width: 200px;margin-left:20px;margin-right:10px;"
            placeholder="请输入奖品名称"
            v-on:keyup.enter.native="seachprize"
          />
           <el-input
            v-model.trim="listQuery.activityId"
            clearable
            class="filter-item"
            style="width: 200px;margin-left:20px;margin-right:10px;"
            placeholder="请输入活动ID"
            v-on:keyup.enter.native="seachprize"
          />
           <el-input
            v-model.trim="listQuery.memberName"
            clearable
            class="filter-item"
            style="width: 200px;margin-left:20px;margin-right:10px;"
            placeholder="请输入用户姓名"
            v-on:keyup.enter.native="seachprize"
          />
           <el-input
            v-model.trim="listQuery.memberId"
            clearable
            class="filter-item"
            style="width: 200px;margin-left:20px;margin-right:10px;"
            placeholder="请输入用户ID"
            v-on:keyup.enter.native="seachprize"
          />
          <el-input
            v-model.trim="listQuery.phoneNumber"
            clearable
            class="filter-item"
            style="width: 200px;margin-left:20px;margin-right:10px;"
            placeholder="请输入电话号码"
            v-on:keyup.enter.native="seachprize"
          />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="seachprize" v-permission="['GET /prizeRecord']">查找</el-button>

            <el-table 
                :data="list"
                style="margin-left:20px;width:80%;margin-top:10px;"
                border
                fit
                highlight-current-row
                >
                <el-table-column align="center" label="活动id" prop="activityId"></el-table-column>
                <el-table-column align="center" label="用户id" prop="memberId"></el-table-column> 
                <el-table-column align="center" label="用户名字" prop="memberName"></el-table-column> 
                <el-table-column align="center" label="电话号码" prop="phoneNumber"></el-table-column> 
                <el-table-column align="center" label="奖品名字" prop="prizeName"></el-table-column> 
                <el-table-column align="center" label="奖品图片" prop="prizeImgUrl">
                    <template  slot-scope="scope">
                        <img :src="scope.row.prizeImgUrl" v-if="scope.row.prizeImgUrl" style="width:50px;">
                    </template>
                </el-table-column>
                <el-table-column align="center" label="领取状态" prop="status">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status==1 ? 'success' : (scope.row.status== 2 ?'info':'danger')" v-model="scope.row.status">{{scope.row.status==1 ? '用户未领取奖品' : (scope.row.status== 2 ?'用户领取奖品':'管理员已经联系过该用户')}}</el-tag>
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
</script>>