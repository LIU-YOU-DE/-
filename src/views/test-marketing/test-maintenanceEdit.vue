<template>
    <div style="width:95%;margin:0 auto;">
        <div style="display:flex;justify-content:space-between;padding-right:20px;background-color:#F3F3F3;margin-top:20px;">
            <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;font-size:15px;">
                <svg-icon icon-class="list2" class-name="card-panel-icon svg" />数据列表
            </p>
        <div>
          <el-button icon="el-icon-edit" style="margin-top:8px;display:inline-block;" @click="open('goods')">添加</el-button>
          <el-button icon="el-icon-edit" style="margin-top:8px;display:inline-block;" @click="handleDeleteList">多选删除</el-button>
        </div>
      </div>
        <el-table :data="list" border fit highlight-current-row @select="deleteAll">
            <el-table-column
                align="center"
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column align="center" label="分类" prop="type" >
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.type==1" type="error">保养专区</el-tag>
                    <el-tag v-if="scope.row.type==2" type="success">洗车专区</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="分类标题" prop="title" />
            <el-table-column align="center" label="分类描述" prop="subTitle" />
            <el-table-column align="center" label="产品标题" prop="pupTitle" />
            <el-table-column align="center" label="限购数量" prop="limitTimes" />
            <el-table-column align="center" label="产品价格" prop="price" />
            
            <el-table-column align="center" label="产品缩略图" prop="cover" >
                <template slot-scope="scope">
                    <img :src="scope.row.cover" alt="" v-if="scope.row.cover" width="100">
                </template>
            </el-table-column>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handProduAndMerchant(scope.row)">编辑关联</el-button>
                    <!-- <el-button size="mini" @click="routeProduct(scope.row)">编辑产品信息</el-button> -->
                </template>
            </el-table-column>
        </el-table>

        <!-- 关联弹框 -->
        <el-dialog
            title="添加商品关联"
            :visible.sync="dialogVisible"
            >
            <el-form ref="goods" :model="goods" label-width="150px">
                <el-form-item label="产品标题" prop="pupTitle">
                    <el-select v-model="goods.pupTitle" placeholder="请选择" @change="handProduct">
                        <el-option
                        v-for="item in options"
                        :key="item.productId"
                        :label="item.label"
                        :value="item.pupTitle">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品价格" prop="price">
                    <el-input-number v-model="goods.price"></el-input-number>
                </el-form-item>
                <el-form-item label="产品缩略图" prop="cover">
                    <el-upload
                        :headers="headers"
                        v-model="goods.cover"
                        :action="uploadPath"
                        :show-file-list="false"
                        :on-success="uploadPicUrl"
                        class="avatar-uploader"
                        accept=".jpg, .jpeg, .png, .gif"
                        >
                        <img v-if="goods.cover" :src="goods.cover" class="avatar" >
                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                </el-form-item>
                <el-form-item label="产品图册" prop="images">
                    <el-upload 
                    :action="uploadPath"
                    :headers="headers"
                    :limit="5"
                    v-model="goods.images"
                    :on-exceed="uploadOverrun"
                    :on-success="handleGalleryUrl"
                    :on-remove="handleRemove"
                    multiple
                    accept=".jpg, .jpeg, .png, .gif"
                    list-type="picture-card"
                    >
                    <i class="el-icon-plus" />
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10240kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button @click="updateProduct('goods')" >确 定</el-button>
            </span>
        </el-dialog>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getlist" />
    </div>
</template>
<script>
import { getMearProduct,getProductSelection,uploadPath,handUpdateProduct,deleteProductList} from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
    components: { Pagination },
    data(){
        return {
            uploadPath,
            total:0,
            options:[],
            dialogVisible:false,
            id:undefined,
            list:[],
            arr:[],
            listQuery:{
                currentPage:1,
                pageSize:10,
                merchantId:undefined
            },
            goods:{
                pupTitle:'',
                price:'',
                cover:'',
                images:[],
                productId:"",
                merchantId:''
            },
            tempDelArr: [],
            idList:[]
        }
    },
    created(){
        this.getlist()
        this.handGetproduct()
    },
    computed: {
        headers() {
            return {
            'Mf-Token': getToken()
            }
        }
    },
    methods:{
        open(goods){
            this.dialogVisible=true
            this.$nextTick(() => {
                this.$refs.goods.clearValidate()
            })
        },
        deleteAll(row){
            var a=[]
            for(var i=0;i<row.length;i++){
                a.push(row[i].id)
            }
             this.tempDelArr=a
        },
        handleDeleteList(){
            this.idList=this.tempDelArr;
            // deleteProductList(this.idList).then(response=>{
            //     this.$notify.success({
            //         title:"成功",
            //         message:"删除成功"
            //     })
            //     this.getlist()
            // }).catch(err=>{
            //     console.log(err)
            // })
            if(this.idList!=""){
                this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(()=>{
                deleteProductList(this.idList).then(response=>{
                this.$notify.success({
                    title:"成功",
                    message:"删除成功"
                })
                this.getlist()
                })
            })
            }else{
                this.$message('请勾选您要删除的对象');
            }
        },
        routeProduct(row){
            this.$router.push({
                path:'/test-marketing/test-productEdit',query:{row:row,id:this.listQuery.merchantId}
            })
        },
        updateProduct(goods){
            var merchantId=this.$route.query.id
            const fileGoods={
                price:this.goods.price,
                cover:this.goods.cover,
                images:this.goods.images,
                productId:this.goods.productId,
                merchantId:merchantId
            }
            handUpdateProduct(fileGoods).then(response=>{
                this.getlist()
                this.dialogVisible=false
            })
        },
        handProduct(event){
            for(var i=0;i<this.options.length;i++){
                if(event==this.options[i].title){
                   this.goods.productId=this.options[i].productId
                }
            }
        },
        handleRemove: function(file, fileList) {
            for (var i = 0; i < this.goods.images.length; i++) {
            var url
            if (file.response === undefined) {
                url = file.url
            } else {
            url = file.response.data.url
            }

            if (this.goods.images[i] === url) {
             this.goods.images.splice(i, 1)
            }
        }
        },
        handleGalleryUrl(response, file, fileList) {
            if (response.errno === 0) {
                this.goods.images = this.arr
                this.arr.push(response.data.url)
            }
        },
        uploadOverrun: function() {
            this.$message({
                type: 'error',
                message: '上传文件个数超出限制!最多上传5张图片!'
            })
        },
        uploadPicUrl: function(response) {
            this.goods.cover = response.data.url
        },
        handGetproduct(){
            getProductSelection().then(response=>{
                this.options=response.data.data
            })
        },
        handProduAndMerchant(row){
            this.$router.push({path:'/test-marketing/test-produAndMerchant',query:{row:row,id:this.listQuery.merchantId}})
        },
        getlist(){
            this.listQuery.merchantId=this.$route.query.id
            getMearProduct(this.listQuery).then(response=>{
                this.list=response.data.data.items
                this.total=response.data.data.totalPage
            })
        }
    }
}
</script>
<style scoped>
.avatar-uploader-icon[data-v-791af03c]{
    border:1px dashed #c0ccda;
    background:#fbfdff;
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
.svg{
    margin-right:5px;
}
    .tabletop{
        height:50px;
        margin:0 auto;
        margin-top:20px;
        background:#f3f3f3;
        border-bottom:1px solid #EBEEF5;
    }
    .table-title{
        display:inline-block;
        margin-left:10px;
        margin-top:20px;
        color:#555;
        margin-right:75%;
        font-size:15px;
    }
</style>

