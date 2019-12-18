<template>
  <div class="app-container"  style="width:90%;margin:0 auto;">
    <div class="tabletop">
      <p class="address">编辑车辆信息</p>
    </div>
    <p class="address" style="font-size:16px;margin-bottom:40px;margin-left:50px;"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />车型基本信息</p>
    <div>
      <el-form ref="goods" :model="goods" label-width="150px" style="margin-left:30%;">
        <!-- <el-form-item label="品牌id" prop="brandId">
          <el-input v-model="goods.brandId" />
        </el-form-item>-->
        <!-- <el-form-item label="所属分类">
          <el-cascader
            :options="categoryList"
            :props="categoryProps"
            expand-trigger="hover"
            @change="handleCategoryChange"
          ></el-cascader>
        </el-form-item>-->
        <el-form-item label="品牌名称">
          <el-select v-model="goods.brandId" style="width:250px;" >
            <el-option
              v-for="item in brandList"
              :key="item.id"
              :label="item.name" 
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车型种类">
          <el-select v-model="goods.carTypeName" style="width:250px;" >
            <el-option
              v-for="item in carTypeList"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="车型名称" prop="name">
          <el-input v-model="goods.name" style="width:250px;"/>
        </el-form-item>

        <el-form-item label="是否特卖车" prop="isSpecial">
          <el-radio-group v-model="goods.isSpecial">
            <el-radio :label="1">非特卖车</el-radio>
            <el-radio :label="2">特卖车</el-radio>
          </el-radio-group>
        </el-form-item>

        <p class="address" style="font-size:16px;margin-bottom:40px;margin-left:-37%;"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />活动时间</p>
        <el-form-item label="购买截止时间" prop="buyDeadline">
          <el-date-picker
            v-model="goods.buyDeadline"
            type="datetime"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:250px;"
          />
        </el-form-item>
        <el-form-item label="活动截止时间" prop="endTime">
          <el-date-picker
            v-model="goods.endTime"
            type="datetime"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:250px;"
          />
        </el-form-item>

        <p class="address" style="font-size:16px;margin-bottom:40px;margin-left:-37%;"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />车型照片</p>
        <el-form-item label="车型图">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="goods.coverUrl" :src="goods.coverUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        
        <!-- <el-form-item label="是否上架" prop="status">
          <el-radio-group v-model="goods.status">
            <el-radio :label="2">上架</el-radio>
            <el-radio :label="1">下架</el-radio>
          </el-radio-group>
        </el-form-item> -->
        
        <el-form-item label="车型详情图">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPica"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="goods.detail" :src="goods.detail" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

        <!-- 车型图集 el-upload :on-preview="handlePictureCardPreview" -->
        <el-form-item label="车型图集">
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
            <i class="el-icon-plus"/>
          </el-upload>  
        </el-form-item>

        <el-form-item label="车型图集顺序">
          <draggable v-model="goods.photos" class="drag">
            <transition-group class="box">
              <div v-for="item in goods.photos" :key="item" style="margin-right: 10px;">
                <img :src="item" alt />
              </div>
            </transition-group>
          </draggable>
        </el-form-item>
        <!-- <p class="address" style="font-size:16px;margin-bottom:40px;margin-left:-37%;"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />指定门店</p> -->
      </el-form>
      <!-- <el-button :plain="true" @click="handleAttributeShow" style="margin-bottom:10px;">添加</el-button> -->
      <!-- <el-table :data="addresslist2" border highlight-current-row>
        <el-table-column align="center" label="所在城市" prop="address" />
        <el-table-column align="center" property="logoUrl" label="品牌标志">
          <template slot-scope="scope">
            <img :src="scope.row.logoUrl" width="40" >
          </template>
        </el-table-column>
        <el-table-column align="center" label="门店名称" prop="storeName" />
        <el-table-column align="center" label="负责人" prop="name" />
        <el-table-column align="center" label="联系电话" prop="mobile" />
        <el-table-column align="center" label="门店地址" prop="regionName" />
        <el-table-column
          align="center"
          label="操作"
          width="200"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table> -->

      <!-- <el-dialog :visible.sync="attribute" title="添加门店">
        <el-form
          ref="attributeForm" 
          status-icon
          label-position="left"
          label-width="100px"
          style="margin-left:50px;"
        >

          <el-input
            v-model="listQuery.storeName"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="请输入门店名称"
            v-on:keyup.enter.native="seachcar"
          />
          <el-button class="filter-item" icon="el-icon-search" @click="seachcar">查找</el-button>
          <el-table :data="addresslist" border highlight-current-row @selection-change="changeFun" style="margin-top:10px;">
            <el-table-column type="selection" width="55" @selection-change="changeFun"/>
            <el-table-column align="center" label="所在城市" prop="address" width="100"/>

            <el-table-column align="center" property="logoUrl" label="品牌标志">
              <template slot-scope="scope">
                <img :src="scope.row.logoUrl" width="40" >
              </template>
            </el-table-column>

            <el-table-column align="center" label="门店名称" prop="storeName" />

            <el-table-column align="center" label="联系电话" prop="mobile" />

            <el-table-column align="center" label="门店地址" prop="regionName" />

          </el-table>

        </el-form>
        <div slot="footer" class="dialog-footer" >
          <el-button @click="attribute = false">取消</el-button>
          <el-button @click="handleaddressbuteAdd">确定</el-button>
        </div>
      </el-dialog> -->

    </div>
      
    <div class="op-container" style="display:flex;justify-content:center;margin-top:20px;">
      <el-button @click="handleCancel">取消</el-button>
      <el-button @click="handleEdit">更新车辆</el-button>
    </div>
  </div>
</template>

<style scoped>
.el-upload--picture-card{
  background-color:#fff;
}
.avatar-uploader-icon[data-v-bab414ca]{
  border:1px dashed #d9d9d9;
  border-radius: 6px;
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
  height:60px;
  width:100%;
  line-height: 60px;
  background:#f3f3f3;
  margin-bottom:20px;
}
.el-card {
  margin-bottom: 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.input-new-keyword {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
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

.box {
  display: flex !important;
}
.drag img {
  width: 180px;
  height: 120px;
}
</style>

<script>
import { detailGoods, editGoods, listCatAndBrand } from "@/api/goods";
import { createStorage, uploadPath } from "@/api/storage";
import Editor from "@tinymce/tinymce-vue";
import { MessageBox } from "element-ui";
import { getToken } from "@/utils/auth";
import { listAd} from '@/api/merchant'

import draggable from "vuedraggable";

export default {
  name: "GoodsEdit",
  components: { Editor, draggable },
  data() {
    return {
      categoryProps: {
        label: "name",
        value: "brandId",
        expandTrigger: "hover"

      },
      addresslist:[],
      choosedata:[],
      attribute:false,
      listQuery: {
        page: 1,
        limit: 20,
        storeName: undefined,
        content: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      addresslist2:[],
      brandname: { order: "asc", sort: "word_begin" },
      arr: [],
      upid: null,
      uploadPath,
      newKeywordVisible: false,
      newKeyword: "",
      galleryFileList: [],
      categoryList: [],
      brandList: [],
      carTypeList:[],
      carTypeName:[],
      carType:[],
      brandId: [],
      goods: { gallery: [] },
      // goods: {},
      editorInit: {
        language: "zh_CN",
        convert_urls: false,
        plugins: [
          "advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount"
        ],
        toolbar: [
          "searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample",
          "hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen"
        ],
        images_upload_handler: function(blobInfo, success, failure) {
          const formData = new FormData();
          formData.append("file", blobInfo.blob());
          createStorage(formData)
            .then(res => {
              success(res.data.data.url);
            })
            .catch(() => {
              failure("上传失败，请重新上传");
            });
        }
      },

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
    this.init();
  },
  methods: {
    handleDelete(id){
      Array.prototype.del = function(filter) {
        var index = filter
        if (typeof filter === 'function') {
          for (var i = 0; i < this.length; i++) {
            if (filter(this[i], i)) index = i
          }
        }
        this.splice(index, 1)
      }
      var arr = this.addresslist2
      arr.del(function(arr) {
        return arr.id == id
      })
    },
    changeFun(data) {
      this.choosedata = data
    },
    handleaddressbuteAdd(){
      for (var i = 0; i < this.choosedata.length; i++) {
        this.addresslist2.unshift(this.choosedata[i])
      }
      this.attribute=false
      this.listQuery.storeName=""
      this.choosedata=[]
    },
    seachcar(){
      listAd(this.listQuery).then(response=>{
        this.addresslist=response.data.data.list
        console.log(this.addresslist)
      })
    },
    handleAttributeShow() {
      this.attribute= true
    },
    init: function() {
      if (this.$route.query.id == null) {
        return;
      }

      const goodsId = this.$route.query.id;

      detailGoods(goodsId).then(response => {
        // console.log(typeof response.data.data);
        this.arr = response.data.data.photos;
        this.goods = response.data.data;
        this.upid = response.data.data.id;
        this.brandId = response.data.data.brandId;
        this.carTypeName=response.data.data.carTypeName
        // console.log(this.brandId);

        for (var i = 0; i < this.goods.photos.length; i++) {
          this.galleryFileList.push({
            url: this.goods.photos[i]
          });
        }
        // console.log(response);
      });

      listCatAndBrand(this.brandname).then(response => {

        this.categoryList = response.data.data.list;

        //  debugger
        // console.log(this.categoryList[0].id);

        this.brandList = response.data.data.brandList;
        this.carTypeList=response.data.data.carTypeList
      });
    },
    // handleCategoryChange(value) {
    //   // this.goods.brandId = value[value.length - 1];
    //   console.log(value);
    // },
    handleCancel: function() {
      this.$router.push({ path: "/test-marketing/test-list" });
    },
    handleEdit: function() {
      var num
      for(var i=0;i<this.carTypeList.length;i++){
        if(this.goods.carTypeName==this.carTypeList[i].name){
          num=this.carTypeList[i].type
        }
      }
      const finalGoods = {
        carType:'',
        brandId: this.goods.brandId,
        buyDeadline: this.goods.buyDeadline,
        carDetails: this.goods.carDetails,
        coverUrl: this.goods.coverUrl,
        detail: this.goods.detail,
        detailTitle: this.goods.detailTitle,
        endTime: this.goods.endTime,
        isSpecial: this.goods.isSpecial,
        name: this.goods.name,
        number: this.goods.number,
        photos: this.goods.photos,
        sort: this.goods.sort,
        status: 1,
        isHot:1,
        isPopular:1,
        isRecommend:1,
        updateTime: this.goods.updateTime,
        wordBegin: this.goods.wordBegin,
        remark:this.goods.remark
        // goods: this.goods,
        // specifications: this.specifications,
        // products: this.products,
        // attributes: this.attributes
      };
      // console.log(finalGoods);
      if(num>1){
        finalGoods.carType=num
      }else{
        finalGoods.carType=this.goods.carTypeName
      }
      editGoods(finalGoods, this.upid)
        .then(response => {
          this.$notify.success({
            title: "成功",
            message: "更新成功"
          });
          this.$router.push({ path: "/test-marketing/test-list" });
        })
        .catch(response => {
          MessageBox.alert("业务错误：" + response.data.errmsg, "警告", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },

    uploadPicUrl: function(response) {
      this.goods.coverUrl = response.data.url;
    },
    uploadPica: function(response) {
      this.goods.detail = response.data.url;
    },
    uploadOverrun: function() {
      this.$message({
        type: "error",
        message: "上传文件个数超出限制!最多上传5张图片!"
      });
    },
    handleGalleryUrl(response, file, fileList) {
      if (response.errno === 0) {
        this.goods.photos = this.arr;
        this.arr.push(response.data.url);
      }
    },
    handleRemove: function(file, fileList) {
      for (var i = 0; i < this.goods.photos.length; i++) {
        // 这里存在两种情况
        // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
        //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
        // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
        var url;
        if (file.response === undefined) {
          url = file.url;
        } else {
          url = file.response.data.url;
        }

        if (this.goods.photos[i] === url) {
          this.goods.photos.splice(i, 1);
        }
      }
    }
  }
};
</script>
