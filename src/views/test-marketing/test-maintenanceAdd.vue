<template>
<div  style="width:95%;margin:0 auto;">
    <div class="tabletop" style="margin-top:20px;display:flex;position:relative;">
      <p class="table-title"><svg-icon icon-class="list2" class-name="card-panel-icon svg"/>数据列表</p>
      <div style="position:absolute;right:10px;">
        <el-button icon="el-icon-edit" style="margin-top:8px;display:inline-block;" @click="dialogVisible = true">添加</el-button>
      </div>
    </div>
    <el-table :data="list"  border fit>
        <el-table-column align="center" label="服务类型" prop="type">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.type==1">保养专区</el-tag>
                <el-tag v-if="scope.row.type==2">洗车专区</el-tag>
            </template>
        </el-table-column>
        <el-table-column align="center" label="服务标题" prop="title"/>
        <el-table-column align="center" label="服务描述" prop="subTitle"/>
        <el-table-column align="center" label="服务缩略图" prop="type">
            <template slot-scope="scope">
                <img :src="scope.row.cover" alt="" width="100">
            </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime"/>
        <el-table-column align="center" label="更新时间" prop="updateTime"/>
        <el-table-column align="center" label="操作" prop="updateTime">
            <template slot-scope="scope">
                <el-button size="mini" @click="updateUpkeep(scope.row)">编辑</el-button>
                <el-button size="mini" @click="deleteUpkeep(scope.row.upkeepId)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-dialog
        title="添加养车分类"
        :visible.sync="dialogVisible"
        width="30%">
        <el-form label-width="150px" ref="goods" :model="goods">
                <el-form-item label="服务标题：" prop="title">
                    <el-input style="width:300px;" v-model="goods.title"></el-input>
                </el-form-item>
                <el-form-item label="内容描述：" prop="subTitle">
                    <el-input style="width:300px;" v-model="goods.subTitle"></el-input>
                </el-form-item>
                <el-form-item label="服务缩略图：" prop="cover">
                    <el-upload
                    :headers="headers"
                    :action="uploadPath"
                    :show-file-list="false"
                    :on-success="uploadPicUrla"
                    class="avatar-uploader"
                    accept=".jpg, .jpeg, .png, .gif"
                    >
                        <img v-if="goods.cover" :src="goods.cover" class="avatar" >
                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                </el-form-item>
                <el-form-item label="服务类型：" prop="type">
                    <el-radio-group v-model="goods.type">
                        <el-radio :label="1">保养专区</el-radio>
                        <el-radio :label="2">洗车专区</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handCreate('goods')">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog
        title="编辑养车分类"
        :visible.sync="dialogFormVisible"
        width="30%">
        <el-form label-width="150px" ref="dataForm" :model="dataForm">
                <el-form-item label="服务标题：" prop="title">
                    <el-input style="width:300px;" v-model="dataForm.title"></el-input>
                </el-form-item>
                <el-form-item label="内容描述：" prop="subTitle">
                    <el-input style="width:300px;" v-model="dataForm.subTitle"></el-input>
                </el-form-item>
                <el-form-item label="服务缩略图：" prop="cover">
                    <el-upload
                    :headers="headers"
                    :action="uploadPath"
                    :show-file-list="false"
                    :on-success="uploadPicUrla"
                    class="avatar-uploader"
                    accept=".jpg, .jpeg, .png, .gif"
                    >
                        <img v-if="dataForm.cover" :src="dataForm.cover" class="avatar" >
                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                </el-form-item>
                <el-form-item label="服务类型：" prop="type">
                    <el-radio-group v-model="dataForm.type">
                        <el-radio :label="1">保养专区</el-radio>
                        <el-radio :label="2">洗车专区</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateUpkeepId">确 定</el-button>
        </span>
    </el-dialog>
<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getlist" />
</div>
</template>
<script>
import { uploadPath ,intersUpkeepAdd,getUpList,intersUpdateUpkeepAdd,deleteUpkeep} from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
    components: { Pagination },
    data(){
        return{
            list:[],
            total:0,
            dialogFormVisible:false,
            dialogVisible:false,
            uploadPath,
            goods:{
                title:'',
                subTitle:'',
                cover:'',
                type:''
            },
            listQuery: {
                currentPage:1,
                pageSize:15,
            },
            dataForm:{
                title:'',
                subTitle:'',
                cover:'',
                type:''
            }
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
      this.getlist()
  },
    methods:{
        deleteUpkeep(upkeepId){
            let idList=[]
            idList.push(upkeepId)
            this.$confirm('删除此项将导致关联产品部分数据缺失, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                deleteUpkeep(idList).then(response=>{
                this.getlist()
                this.$notify.success({
                    title:"成功",
                    message:"删除成功"
                })
            })
            })
        },
        updateUpkeepId(){
            const form={
                title:this.dataForm.title,
                subTitle:this.dataForm.subTitle,
                cover:this.dataForm.cover,
                type:this.dataForm.type,
                upkeepId:this.dataForm.upkeepId
            }
            intersUpdateUpkeepAdd(form).then(response=>{
                this.dialogFormVisible=false
                this.getlist()
                this.$notify.success({
                    title:"成功",
                    message:"商品分类修改成功"
                })
            })
        },
        updateUpkeep(row){
            this.dialogFormVisible=true
            this.dataForm=row
        },
        getlist(){
            getUpList(this.listQuery).then(response=>{
                this.list=response.data.data.items
                this.total=response.data.data.totalPage
                console.log(this.total)
            })
        },
        handCreate(goods){
            const fileGoods={
                title:this.goods.title,
                subTitle:this.goods.subTitle,
                cover:this.goods.cover,
                type:this.goods.type
            }
            intersUpkeepAdd(fileGoods).then(response=>{
                this.dialogVisible=false
                this.getlist()
                this.$refs[goods].resetFields()
                this.$notify.success({
                    title:"成功",
                    message:"商品分类添加成功"
                })
            }).catch(response=>{
                this.$notify.error({
                    title:'失败',
                    message:response.data.errmsg,
                    duration:0
                })
            })
        },
        uploadPicUrla: function(response) {
            this.goods.cover=response.data.url
        },
    }
}
</script>
<style scoped>
.table-title{
  display:inline-block;
  margin-left:10px;
  margin-top:20px;
  color:#555;
  margin-right:75%;
  font-size:15px;
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
.avatar-uploader-icon[data-v-406e12df]{
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.tabletop{
  border-top:1px solid #DCDFE6;
  border-left:1px solid #DCDFE6;
  border-right:1px solid #DCDFE6;
  height:50px;
  width:100%;
  margin:0 auto;
  background-color:#F3F3F3;
  margin-top:20px;
}
.box{
    width:30%;
    margin:0 auto;
}
</style>