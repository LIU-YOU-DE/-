<template>
  <div style="width:95%;margin:0 auto;">
    <div class="tabletop">
      <p class="address">编辑关联信息</p>
    </div>
    <div style="width:70%;margin:0 auto;">
      <el-form ref="goods" :model="goods" label-width="150px">
        <el-form-item label="分类" prop="type" class="inputstyle">
            <el-radio-group v-model="goods.type">
                <el-radio :label="1">保养专区</el-radio>
                <el-radio :label="2">洗车专区</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="产品名称" prop="pupTitle" class="inputstyle">
            <el-select v-model="goods.pupTitle" placeholder="请选择" @change="handProduct">
                <el-option
                v-for="item in downList"
                :key="item.index"
                :label="item"
                :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="产品价格" prop="price" class="inputstyle">
          <el-input v-model="goods.price" οninput="value=value.replace(/[^\d]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="产品缩略图" prop="cover" class="inputstyle">
            <el-upload
                :headers="headers"
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
        <el-form-item label="产品图册" prop="images" class="inputstyle">
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
        <el-form-item label="限购数量" prop="limitTimes"class="inputstyle">
          <el-input v-model="goods.limitTimes" disabled/>
        </el-form-item>
        <el-form-item label="产品内容" prop="description">
          <template slot-scope="scope">
            <div v-for="(d,index) in goods.content" :key="index" class="inputbox">
              <el-input v-model="d.content" class="inputwidth" type="textarea" disabled></el-input>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="购买须知" prop="description">
          <template slot-scope="scope">
            <div v-for="(d,index) in goods.buyRules" :key="index" class="inputbox">
              <el-input v-model="d.buyRules" class="inputwidth" type="textarea" disabled></el-input>
            </div>
          </template>
        </el-form-item>
      </el-form>
    </div>    
      <div style="display:flex;justify-content:center;margin-top:20px;">
        <el-button style="margin-top:10px;margin-left:20px;" @click="updateActivity">更新</el-button>
      </div>
    </el-form>
  </div>
</template>


<script>
import {getProduct,updateProduAndMerchant,uploadPath} from "@/api/storage";
import { getToken } from "@/utils/auth";

export default {
  data() {
    return {
        uploadPath,
        galleryFileList: [],
        merchantId:undefined,
        productId:undefined,
        goods: {
            cover:[],
            buyRules:'',
            content:'',
            title: "",
            price:'',
            id:"",
            images:[],
            limitTimes:'',
            productId: "",
            title: '',
            upkeepId: "",
      },
      arr2:[],
      arr:[],
      downList:[],
      productList:''
    };
  },
  computed: {
    headers() {
      return {
        "Mf-Token": getToken()
      };
    }
  },
  created() {
      this.getactivitylist()
  },
  methods: {
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
      updateActivity(){
        // var a=[]
        // a.push(this.goods.cover)
          const dataForm={
            cover:this.goods.cover,
            images:this.goods.images,
            price:this.goods.price,
            id:this.goods.id,
            upkeepId:this.goods.upkeepId,
            productId: this.productId,
            merchantId:this.merchantId
          }
          console.log(dataForm)
        updateProduAndMerchant(dataForm).then(response=>{
            this.$router.push({path:'/test-marketing/test-maintenanceEdit',query:{id:this.merchantId}})
            this.$notify.success({
                title:"成功",
                message:"修改成功"
            })
        })
      },
      handProduct(event){
        for(var i=0;i<this.productList.length;i++){
            if(event==this.productList[i].title){
                this.goods.limitTimes=this.productList[i].limitTimes
                this.goods.buyRules=this.productList[i].buyRules
                this.goods.content=this.productList[i].content
                let tempArr = []
                this.goods.content.forEach(ele => {
                tempArr.push({content: ele})
                })
                this.goods.content = tempArr

                let buyTempArr = []
                this.goods.buyRules.forEach(ele => {
                buyTempArr.push({buyRules: ele})
                })
                this.goods.buyRules = buyTempArr
            }
        }
      },
    getactivitylist() {
      this.goods=this.$route.query.row
      this.merchantId=this.$route.query.id,
      this.productId=this.goods.productId
      for(var i=0;i<this.goods.images.length;i++){
        this.galleryFileList.push({
          url: this.goods.images[i]
        })
      }
      if(this.merchantId==undefined){
          return 
      }else{
          const filGoods={
              merchantId:this.merchantId,
              productId:this.productId
          }
          getProduct(filGoods).then(response=>{
              this.productList=response.data.data
              for(var i=0;i<this.productList.length;i++){
                  this.downList.push(this.productList[i].title)
              }
          })
      }
        let tempArr = []
        this.goods.content.forEach(ele => {
          tempArr.push({content: ele})
        })
        this.goods.content = tempArr

        let buyTempArr = []
        this.goods.buyRules.forEach(ele => {
          buyTempArr.push({buyRules: ele})
        })
        this.goods.buyRules = buyTempArr
    },
    changeFun(data) {
      this.choosedata = data;
    }
  }
};
</script>
 <style scoped>
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
.address{
  font-size:18px;
  color:#666;
  margin-left:20px;
  font-weight:600;
}
.tabletop{
  height:50px;
  width:100%;
  line-height: 50px;
  background:#f3f3f3;
  margin-bottom:20px;
}

.el-form-item .el-form-item--medium {
  width: 200px;
}
.el-form-item__content {
  margin-left: 0px;
}
.inputicon {
  font-size:25px!important;
  margin-left:10px;
  margin-top:5px;
  color:#888;
}
.inputbox {
  display: flex !important;
  display: inline;
}
.inputwidth {
  width: 500px !important;
  margin-bottom:5px;
}
.inputstyle{
  width:650px!important;
}
</style>