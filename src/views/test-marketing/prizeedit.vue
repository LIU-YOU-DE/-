<template>
<div>
    <div class="box">
        <h3 class="address">编辑礼品信息</h3>
    </div>
    <div style="width:60%;margin:0 auto;padding:0 20px 0 20px;">
        <Modal v-if="modalOFF === 1">
            <div style="width:93%;margin:0 auto;">
                 <div style="display:flex;margin-top:20px;justify-content:space-between;">
                    <div class="one">1</div>
                    <div class="one-d"></div>
                    <div class="one-a">2</div>
                    <div class="one-d"></div>
                    <div class="one-a">3</div>
                </div>
            </div>
                <div class="giftfenlei">
                    <p>选择礼品分类</p>
                    <p>填写礼品信息</p>
                    <p>填写礼品属性</p>
                </div>

                <div style="display:flex;justify-content:space-between;margin-top:20px;">
                    <div class="firstbox">
                        <div style="background-color:#F9FAFC;height:40px;padding-top:10px;border-bottom:1px solid #E4E4E4;">
                            <p class="firstboxtitle">选择一级类目</p>
                        </div>
                        <div v-for="(item,index) in giftlist" :key="item.id" class="firstlist" @click="getgiftname(item),updatecss(index)" :class="{test:num==index}">
                            <span style="display:inline-block;">{{item.name}}</span>
                            <svg-icon icon-class="right" class-name="card-panel-icon" style="margin-right:20px;margin-top:13px;"/>
                        </div>
                    </div>
                    <div class="content">
                        <span class="text"></span>
                        <span class="xian"></span>
                    </div>
                    <div class="firstbox">
                         <div style="background-color:#F9FAFC;height:40px;padding-top:10px;border-bottom:1px solid #E4E4E4;">
                            <p class="firstboxtitle">选择二级类目</p>
                        </div>
                        <div class="firstlist" v-for="(item,index) in childrenlist" :key="item.id" @click="gettwoname(item),updatecss2(index)" :class="{test:num2==index}">
                            <span>{{item.name}}</span>
                        </div>
                    </div>
                </div>
                <p style="font-size:15px;color:#999999;margin-left:20px;">你当前选择的礼品类别是：<span style="color:red;">{{firstname}} > {{twoname}}</span></p>
                <div style="text-align:center; margin-bottom:20px;">
                    <el-button @click="modalOFF = 2" style="margin-top:10px;" type="primary">填写礼品信息</el-button>
                </div>
            </Modal>
            <Modal v-if="modalOFF === 2">
                <div style="display:flex;margin-top:20px;justify-content:space-around;">
                    <div class="one">1</div>
                    <div class="one-d"></div>
                    <div class="one">2</div>
                    <div class="one-d"></div>
                    <div class="one-a">3</div>
                </div>
                <div class="giftfenlei">
                    <p>选择礼品分类</p>
                    <p>填写礼品信息</p>
                    <p>填写礼品属性</p>
                </div>
                <div style="margin-top:20px;">
                    <div style="margin-left:40px;">
                        <svg-icon icon-class="qi" class-name="card-panel-icon svg" />
                        <h3 class="t1">基本信息</h3>
                    </div>
                    
                    <el-form label-width="300px" v-model="giftForm">
                    <el-form-item label="礼品分类：" prop="categoryId">
                        <span>{{firstname}}</span>
                        <span> > </span>
                        <span>{{twoname}}</span>
                    </el-form-item>
                    <el-form-item label="礼品名称：" prop="name">
                        <el-input style="width:400px;" v-model="giftForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="兑换积分：" prop="pricePoint">
                        <el-input style="width:400px;" v-model="giftForm.pricePoint"></el-input>
                    </el-form-item>
                    <el-form-item label="礼品单位：" prop="unit">
                        <el-input style="width:400px;" v-model="giftForm.unit"></el-input>
                    </el-form-item>
                    <el-form-item label="礼品简介：" prop="describe">
                        <el-input style="width:400px;" type="textarea" v-model="giftForm.describe"></el-input>
                    </el-form-item>

                <div style="margin-left:40px;">
                    <svg-icon icon-class="qi" class-name="card-panel-icon svg" />
                    <h3 class="t1">库存规格</h3>
                </div>
                    <el-form-item label="礼品市场价：" prop="priceCny">
                        <el-input style="width:400px;" v-model="giftForm.priceCny"></el-input>
                    </el-form-item>
                    <el-form-item label="礼品库存：" prop="stock">
                        <el-input style="width:400px;" v-model="giftForm.stock"></el-input>
                    </el-form-item>
                    <el-form-item label="预警数量：" prop="warnStock">
                        <el-input style="width:400px;" v-model="giftForm.warnStock"></el-input>
                    </el-form-item>

                <div style="margin-left:40px;">
                    <svg-icon icon-class="qi" class-name="card-panel-icon svg" />
                    <h3 class="t1">其他信息</h3>
                </div>
                    <el-form-item label="礼品上架" prop="status">
                        <el-radio-group v-model="giftForm.status">
                            <el-radio :label="1">上架</el-radio>
                            <el-radio :label="2">下架</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="热门推荐" prop="isHot">
                        <el-radio-group v-model="giftForm.isHot">
                            <el-radio :label="1">推荐</el-radio>
                            <el-radio :label="2">不推荐</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="礼品推荐" prop="isHot">
                            <el-checkbox label="热门" v-model="giftForm.isHot"></el-checkbox>
                    </el-form-item>
                </el-form>
                </div>
                <div style="display:flex;justify-content:center;">
                    <el-button @click="modalOFF = 1">上一步</el-button>
                    <el-button @click="modalOFF = 3" type="primary">填写礼品图片信息</el-button>
                </div>
                
            </Modal>
            <Modal v-if="modalOFF === 3">
                <div style="display:flex;margin-top:20px;justify-content:space-around;">
                    <div class="one">1</div>
                    <div class="one-d"></div>
                    <div class="one">2</div>
                    <div class="one-d"></div>
                    <div class="one">3</div>
                </div>
                <div class="giftfenlei">
                    <p>选择礼品分类</p>
                    <p>填写礼品信息</p>
                    <p>填写礼品属性</p>
                </div>
                <div style="margin-top:20px;">
                    <div style="margin-left:40px;">
                        <svg-icon icon-class="qi" class-name="card-panel-icon svg" />
                        <h3 class="t1">礼品相册</h3>
                    </div>
                    <el-form label-width="250px">
                        <el-form-item label="礼品缩略图：">
                            <el-upload
                            :headers="headers"
                            :action="uploadPath"
                            :show-file-list="false"
                            :on-success="uploadPicUrl"
                            class="avatar-uploader"
                            accept=".jpg, .jpeg, .png, .gif"
                            >
                                <img v-if="goods.coverUrl" :src="goods.coverUrl" class="avatar" >
                                <i v-else class="el-icon-plus avatar-uploader-icon" />
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="礼品详情图：">
                            <el-upload
                            :headers="headers"
                            :action="uploadPath"
                            :show-file-list="false"
                            :on-success="uploadPicUrl1"
                            class="avatar-uploader"
                            accept=".jpg, .jpeg, .png, .gif"
                            >
                        <img v-if="goods.detailUrl" :src="goods.detailUrl" class="avatar" >
                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="礼品图册：" style="margn-bottom:20px;">
                            <el-upload
                            :action="uploadPath"
                            :headers="headers"
                            :limit="5"
                            :file-list="galleryFileList"
                            :on-exceed="uploadOverrun"
                            :on-success="handleGalleryUrl"
                            :on-remove="handleRemove"
                            multiple
                            accept=".jpg, .jpeg, .png, .gif"
                            list-type="picture-card"
                        >
                        <i class="el-icon-plus" />
                        </el-upload>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="display:flex;justify-content:center;">
                    <el-button @click="modalOFF = 2">上一步</el-button>
                    <el-button @click="pushPrize" type="primary">更新礼品信息</el-button>
                </div>
            </Modal>
    </div>
</div>
</template>

<style scoped>
.avatar-uploader-icon[data-v-b73d965c]{
    border:1px solid #d9d9d9;
    border-radius: 6px;
}
.t1{
    color:#666;
    display: inline-block;
}
.box{
    width:60%;
    border:1px solid #EBEEF5;
    margin:0 auto;
    background-color:#F3F3F3;
    margin-top:20px;
}
.address{
  font-size:18px;
  color:#666;
  margin-left:20px;
  font-weight:600;
}
.firstbox{
    width:250px;
    margin-left:100px;
    margin-right:100px;
    margin-bottom:20px; 
    border-radius: 6px;
    border:1px solid #E4E4E4;
}
.twobox{
    width:250px;
    margin-left:20px;
    margin-right:20px;
    margin-bottom:20px; 
    border-radius: 6px;
    border:1px solid #E4E4E4;
}
.firstboxtitle{
    font-size:16px;
    margin-left:20px;
    color:#999999;
}
p{
    padding:0;
    margin:0;
}
.firstlist{
    height:40px;
    padding-left:20px;
    line-height: 40px;
    font-size:15px;
    color:#999999;
    display: flex;
    justify-content: space-between;
    border-bottom:1px solid #E4E4E4;
}
.test{
    height:40px;
    padding-left:20px;
    line-height: 40px;
    font-size:15px;
    color:#999999;
    display: flex;
    background-color:#F2F2F2;
    justify-content: space-between;
    border-bottom:1px solid #E4E4E4;
}
.one{
    width:50px;
    height: 50px;
    border-radius: 50%;
    line-height:50px;
    text-align: center;
    color:#fff;
    font-size:30px;
    background-color:#1ABC9C;
}
.one-a{
    width:50px;
    height: 50px;
    border-radius: 50%;
    line-height:50px;
    text-align: center;
    color:#CCCCCC;
    font-size:30px;
    border:1px solid #E4E4E4;
}
.giftfenlei{
    display:flex;
    justify-content:space-between;
    font-size:16px;
    color:#1ABC9C;
    margin-top:10px;
}
.one-d{
    width:470px;
    height:0;
    border-bottom:1px dashed #1ABC9C;
    margin-top:20px;
}
.content{
    width:80px;
    height:80px;
    border-radius: 50%;
    border:3px solid #999999;
    position: absolute;;
    top:50%;
    left:47%;
}
.text{
    display: inline-block;
    border-top: 4px solid;
    border-right: 4px solid;
    width:30px;
    height: 30px;
    border-color: #999999;
    transform: rotate(45deg);
    position:absolute;
    top:22px;
    left:21px;

}
.xian{
    width:40px;
    height:5px;
    background:#999;
    display: inline-block;
    position:absolute;
    top:34px;
    left:12px;
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
.avatar-uploader-icon[data-v-1d6e2be0]{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
}
</style>

<script>

import {uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import { publishGoods,detailliping,listCatAndBrand,editGoods} from '@/api/liping'

export default {
    data(){
        return{
            list:{},
            modalOFF:1,  //上一页 下一页
            radio:2, //控制上下架 2 下架
            firstname:"",
            twoname:"",
            tuijianlist:[],
            num:0,
            giftId:"",
            num2:'',
            childrenId:0,
            categoryId:"",
            uploadPath,
            checked:false,
            giftlist:{},
            arr:[],
            giftIdName:[],
            giftTypeList:[],
            galleryFileList: [],
            childrenlist:{},
            giftForm:{
                categoryId:'',
                coverUrl:"",
                describe:'',
                detailHtml:'',
                detailUrl:"",
                isHot:"",
                name:"",
                number:"",
                picture:[],
                priceCny:'',
                pricePoint:'',
                remark:"",
                saleQuantity:"",
                sort:"",
                status:"",
                stock:"",
                unit:"",
                warnStock:"",
                withHold:""

            },
            goods:{
                detailUrl:"",
                coverUrl: '',
                picture:[]
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
        this.giftCat()
    },
    methods:{
        // 添加奖品
        pushPrize(){
            const finalGoods = {
            describe: this.giftForm.describe,
            buyDeadline: this.giftForm.buyDeadline,
            detailUrl: this.goods.detailUrl,
            coverUrl: this.goods.coverUrl,
            details: this.goods.details,
            isHot: this.giftForm.isHot,
            name: this.giftForm.name,
            number: this.giftForm.number,
            picture: this.giftForm.picture,
            remark: this.giftForm.remark,
            saleQuantity: this.giftForm.saleQuantity,
            stock: this.giftForm.stock,
            sort: this.giftForm.sort,
            status: this.giftForm.status,
            unit: this.giftForm.unit,
            tock: this.giftForm.stock,
            priceCny:this.giftForm.priceCny,
            warnStock: this.giftForm.warnStock,
            categoryId: this.childrenId,
            pricePoint: this.giftForm.pricePoint,
      }
            editGoods(finalGoods,this.giftId).then(response=>{
                this.$notify.success({
                    title:"成功",
                    message:"礼品更新成功"
                })
                this.$router.push({path:"/test-marketing/test-prize"})
            }).catch(response=>{
                this.$notify.error({
                    title:"失败",
                    message:response.data.errmsg,
                    duration:0
                })
            })
        },

        handleRemove: function(file, fileList) {
            for (var i = 0; i < this.goods.picture.length; i++) {
        // 这里存在两种情况
        // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
        //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
        // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
            var url
            if (file.response === undefined) {
                url = file.url
            } else {
            url = file.response.data.url
            }

            if (this.goods.picture[i] === url) {
             this.goods.picture.splice(i, 1)
            }
        }
        },
        handleGalleryUrl(response, file, fileList) {
            if (response.errno === 0) {
                this.goods.picture = this.arr
                this.arr.push(response.data.url)
            }
        },
        uploadOverrun: function() {
            this.$message({
                type: 'error',
                message: '上传文件个数超出限制!最多上传5张图片!'
            })
        },
        uploadPicUrl1: function(response) {
            this.goods.coverUrl = response.data.url
        },
        uploadPicUrl: function(response) {
            this.goods.detailUrl = response.data.url
        },
        getlist(){
            // this.num=this.$route.query.row.categoryId
            this.goods.detailUrl=this.$route.query.row.detailUrl
            this.goods.coverUrl=this.$route.query.row.coverUrl
            this.giftId=this.$route.query.id 
            detailliping(this.giftId).then(response=>{
                this.giftForm=response.data.data
                this.giftIdName=response.data.data.categoryId
                for(var i=0;i<response.data.data.picture.length;i++){
                    this.galleryFileList.push({
                        url: response.data.data.picture[i]
                    })
                }
                this.num=this.giftIdName[0]
                this.childrenId=this.giftIdName[1]
            })
        },
        // 获取礼品分类列表
        giftCat(){
            listCatAndBrand().then(response=>{  
                console.log(this.childrenId)
                this.giftlist=response.data.data.list
                for(var i=0;i<this.giftlist.length;i++){
                    if(this.num==this.giftlist[i].id){
                        this.childrenlist=this.giftlist[i].children
                        this.firstname=this.giftlist[i].name
                    }
                }
                for(var i=0;i<this.childrenlist.length;i++){
                    this.twoname=this.childrenlist[i].name
                }
            })
        },
        getgiftname(name){
            this.firstname=name.name
            this.childrenlist=name.children
            this.categoryId=name.id
        },
        updatecss(index){
            this.num=index
        },
        updatecss2(index){
            this.num2=index
        },
        gettwoname(name){
            this.twoname=name.name
        },
    }
}
</script>>