<template>
    <div class="topbox">
        <el-button @click="handleEdit" v-permission="['PUT /members/{memberId}']" style="margin-left:10%;margin-bottom:10px;">用户详情</el-button>
        <el-button>登录日志</el-button>
        <el-button @click="back">返回</el-button>

        <div class="table-ip">
            <div class="table-box">
                <span class="address"><svg-icon icon-class="list2" class-name="card-panel-icon svg" />登录日志</span>
            </div>
            <div>
                <el-table border :data="list">
                    <el-table-column align="center" label="时间" prop="lastLoginTime" />
                    <el-table-column align="center" label="IP" prop="lastLoginIp" />
                    <el-table-column align="center" label="地区" prop="lastLoginLocation" />
                    <el-table-column align="center" label="登录方式" prop="source" >
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.source==1" type="success">微信小程序</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <pagination
        style="margin-left:8%;"
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getlist"
        />
    </div>
</template>
<script>
import { listLoginRecord } from '@/api/user'
import Pagination from "@/components/Pagination";
export default {
    components: { Pagination },
    data(){
        return {
            list:[],
            total: 0,
            id:"",
            listQuery: {
                page: 1,
                limit: 20,
                memberId: undefined,
                sort: 'last_login_time',
                order: 'desc'
            },

        }
    },
    created(){
        this.getlist()
    },
    methods:{
        getlist(){
             this.listQuery.memberId=this.$route.query.id
             listLoginRecord(this.listQuery).then(response=>{
                this.list=response.data.data.list
                this.total = response.data.data.total
            })
        },
        handleEdit(){
            this.$router.push({path:"/test/userlook",query:{id:this.listQuery.memberId}})
        },
        back(){
            this.$router.go(-1)
        },
    }
}
</script>>
<style scoped>
.topbox{
    margin-top:30px;
}
.address{
  font-size:18px;
  color:#666;
  margin-left:20px;
  font-weight:600;
  display: inline-block;
  margin-top:10px;
}
.table-ip{
    margin:0 auto;
    width:80%;
    border:1px solid #E4E4E4;
    margin-top:10px;
}
.table-box{
height:50px;
  border-bottom:1px solid #E4E4E4;
  background-color:#F3F3F3;
  margin:0;
}
.svg{
  margin-right:5px;
}
</style>