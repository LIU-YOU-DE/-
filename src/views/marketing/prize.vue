<template>
    <div>
        <el-form
            ref="attributeForm"
            :model="goods"
            status-icon
            label-position="left"
            label-width="100px"
            style="margin-left:50px;margin-top:10px;"
        >
        <el-input
            v-model.trim="listQuery.name"
            clearable
            class="filter-item"
            style="width: 200px;margin-left:20px;margin-right:10px;"
            placeholder="请输入奖品名称"
            v-on:keyup.enter.native="seachprize"
          />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="seachprize" v-permission="['GET /prize','GET /prize/name/{name}','GET /prize/short']">查找</el-button>
            <el-button @click="pushPrizeBox" type="primary" style="margin-left:10px;" v-permission="['POST /prize']">添加</el-button>

            <el-table 
                style="margin-left:20px;width:80%;margin-top:10px;" 
                :data="list" border
                fit
                highlight-current-row>
        <el-table-column align="center" label="奖品id" prop="prizeId"></el-table-column>
        <el-table-column align="center" label="奖品名称" prop="prizeName"></el-table-column>
        <el-table-column align="center" label="奖品描述" prop="description"></el-table-column>
        <el-table-column align="center" label="奖品图片url" prop="imgUrl">
                <template  slot-scope="scope">
                    <img :src="scope.row.imgUrl" v-if="scope.row.imgUrl" style="width:50px;">
                </template>
        </el-table-column>
        <el-table-column align="center" label="备注" prop="remark"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="handleUpdatePrize(scope.row)" v-permission="['PUT /prize/{id}']">编辑</el-button>
                 <el-button type="danger" size="mini" @click="handDeletePrize(scope.row)"v-permission="['DELETE /prize/{id}']">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 添加奖品 -->
    <el-dialog
        title="添加奖品"
        :visible.sync="dialogVisible"
        width="50%">
        <el-form label-position="right" label-width="100px">
            <el-form-item label="奖品名称" prop="prizeName">
                <el-input class="prizeinp" v-model="goods.prizeName"></el-input>
            </el-form-item>
            <el-form-item label="奖品描述" prop="description">
                <template slot-scope="scope">
            <div v-for="(d,index) in counter" :key="index" class="inputbox">
                <el-input v-model="goods.description[index]" class="inputwidth" type="textarea"></el-input>
                <i class="el-icon-circle-plus-outline inputicon" @click.prevent="inputadd"></i>
                <i class="el-icon-remove-outline inputicon" @click.prevent="deleteinput(index)" v-if="showdeletebutton"></i>
            </div>
          </template>
            </el-form-item>
            <el-form-item label="奖品图片url">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="goods.imgUrl" :src="goods.imgUrl" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
            <el-form-item label="备注"  prop=" remark">
                 <el-input  type="textarea" autosize  class="prizeinp" v-model="goods.remark"></el-input>
            </el-form-item>
        </el-form>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="pushPrize">确 定</el-button>
    </el-dialog>

    <!-- 编辑奖品 -->
    <el-dialog
        title="编辑奖品信息"
        :visible.sync="dialogVisible2"
        width="50%">
        <el-form label-position="right" label-width="100px" ref="dataForm" :model="dataForm">
            <el-form-item label="奖品名称" prop="prizeName">
                <el-input class="prizeinp" v-model="dataForm.prizeName"></el-input>
            </el-form-item>
            <el-form-item label="奖品描述" prop="description">
                <template slot-scope="scope">
                <div v-for="(d,index) in dataForm.description" :key="index" class="inputbox">
                  <el-input v-model="d.description" class="prizeinp prizedesc" type="textarea"></el-input>
                  <i class="el-icon-circle-plus-outline inputicon" @click.prevent="updateinputadd"></i>
                  <i class="el-icon-remove-outline inputicon" @click.prevent="updatedeleteinput(index)" v-if="showdeletebutton"></i>
              </div>
              </template>
            </el-form-item>
            <el-form-item label="奖品图片url">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="updateuploadPicUrl"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="dataForm.imgUrl" :src="dataForm.imgUrl" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
            <el-form-item label="备注"  prop=" remark">
                 <el-input  type="textarea" autosize  class="prizeinp" v-model="dataForm.remark"></el-input>
            </el-form-item>
        </el-form>
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="handUpdatePrize">更新奖品</el-button>
    </el-dialog>
        </el-form>

    </div>




</template>

<script>
import { getPrizeList,pushPrize,uploadPath ,updateprize,deleteprize,getprize} from '@/api/storage'
import { getToken } from '@/utils/auth'
export default {
    data(){
        return {
            uploadPath,
            list:[],
            counter:[{}],
            dialogVisible: false,
            dialogVisible2: false,
            showdeletebutton:false,
            labelPosition:"right",
            name:"",
            prizeId:null,
            imgUrl:"",
            goods:{
                description:[],
                imgUrl:'',
                prizeName:'',
                remark:''
            },
            attributeForm: { prizeName: '', description: '', imgUrl: '' },
            listQuery: {
                page: 1,
                limit: 10,
                name: undefined,
                sort: "add_time",
                order: "desc"
            },
            dataup: [],
            dataForm:{
                description:'',
                imgUrl:'',
                prizeName:'',
                remark:''
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
    methods:{
        updatedeleteinput(index) {
      this.dataForm.description.splice(index, 1);
      if (this.dataForm.description.length == 1) {
        this.showdeletebutton = false;
      }
    },
    updateinputadd() {
      this.dataForm.description.push({});
      if (this.dataForm.description.length >= 0) {
        this.showdeletebutton = true;
      }
    },
       deleteinput(index){
      this.counter.splice(index, 1);
      this.goods.description.splice(index,1);
      if(this.counter.length==1){
        this.showdeletebutton=false
      }
    },
    inputadd(){
      this.counter.push({})
      if(this.counter.length>=0){
        this.showdeletebutton=true
      }
    },
        // 查找奖品
        seachprize(){
          getPrizeList(this.listQuery).then(response=>{
              this.list=response.data.data.list
          })
      },
        handDeletePrize(row){
            deleteprize(row.prizeId).then(response=>{
                this.$notify.success({
                    title:"成功",
                    message:"删除成功"
                })
                this.getList()
            }).catch(response=>{
                this.$notify.error({
                    title:"失败",
                    message:response.data.errmsg,
                    duration:0
                })
            })
        },
        // 编辑奖品
        handleUpdatePrize(row){
            this.dialogVisible2=true
            this.dataForm.prizeId=row.prizeId            
            this.dataForm.imgUrl=row.imgUrl
            this.dataForm.prizeName=row.prizeName
            this.dataForm.remark=row.remark
            let description = []
            row.description.forEach(ele => {
                description.push({description: ele})
            })
            this.dataForm.description=description

            if(this.dataForm.description.length > 1){
                this.showdeletebutton=true
            }
        },
        handUpdatePrize(){
            const prizeForm={
                prizeId:this.dataForm.prizeId,
                imgUrl:this.dataForm.imgUrl,
                description:[],
                prizeName:this.dataForm.prizeName,
                remark:this.dataForm.remark,
            }
            for(var i=0;i<this.dataForm.description.length;i++){
                prizeForm.description[i]=this.dataForm.description[i].description
            }
            updateprize(this.dataForm.prizeId,prizeForm).then(response=>{
                this.$notify.success({
                    title:"成功",
                    message:"更新成功",
                })
                this.getList()
                this.dialogVisible2=false
            }).catch(response=>{
                this.$notify.error({
                    title:"失败",
                    message:respose.data.errmsg,
                    duration:0
                })
            })
        },
        updateuploadPicUrl:function(response){
            this.dataForm.imgUrl=response.data.url
        },
        uploadPicUrl:function(response){
            this.goods.imgUrl = response.data.url
        },
        pushPrizeBox(){
            this.dialogVisible=true
        },
        // 添加奖品
        pushPrize(){
            const finalGoods={
                description:this.goods.description,
                imgUrl:this.goods.imgUrl,
                prizeName:this.goods.prizeName,
                remark:this.goods.remark
            }
            pushPrize(finalGoods).then(response=>{
                this.$notify.success({
                    title:'成功',
                    message:'奖品添加成功'
                })
                this.getList()
                this.dialogVisible=false
            }).catch(response=>{
                    this.$notify.error({
                        title:'失败',
                         message: response.data.errmsg,
                        duration: 0
                    })
                    this.dialogVisible=true
                })
        },
        // 获取奖品列表
        getList(){
            getPrizeList(this.listQuery).then(response=>{
                this.list=response.data.data.list
                this.imgUrl=this.list.imgUrl
            }).catch(response=>{
                this.$notify.error({
                        title:'获取失败',
                        message: response.data.errmsg,
                        duration: 0
                    })
            })
        }
    }
}
</script>>
<style scoped>
.prizeinp{
    width:80%!important;
}
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
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
.avatar-uploader-icon[data-v-0309833f]{
    border: 1px dashed #20a0ff;
    border-radius: 6px;
}
.avatar[data-v-0309833f]{
    border: 1px dashed #20a0ff;
    border-radius: 6px;
}
.inputicon{
  font-size:25px!important;
  margin-left:10px;
  margin-top:5px;
  color:#888;
}
.inputbox{
  display:flex!important;
  display: inline;
}
.inputwidth{
  width:700px!important;
  margin-bottom:5px;
}
.inputstyle{
  width:850px!important;
}
.prizedesc{
    margin-top:5px; 
}
</style>