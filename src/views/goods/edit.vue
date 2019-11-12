<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>修改汽车信息</h3>
      <el-form ref="goods" :model="goods" label-width="150px">
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
        <el-form-item label="品牌名字">
          <el-select v-model="goods.brandId">
            <el-option
              v-for="item in brandList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="汽车种类">
          <el-select v-model="goods.carTypeName">
            <el-option
              v-for="item in carTypeList"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车型名字" prop="name">
          <el-input v-model="goods.name" />
        </el-form-item>
        <el-form-item label="首字母" prop="wordBegin">
          <el-input v-model="goods.wordBegin" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="goods.sort" type="number" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="goods.remark" />
        </el-form-item>
        <el-form-item label="购买截止日期" prop="buyDeadline">
          <el-date-picker
            v-model="goods.buyDeadline"
            type="datetime"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="活动截止日期" prop="endTime">
          <el-date-picker
            v-model="goods.endTime"
            type="datetime"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="汽车详情" prop="carDetails">
          <el-input v-model="goods.carDetails" />
        </el-form-item>
        <el-form-item label="是否特卖车" prop="isSpecial">
          <el-radio-group v-model="goods.isSpecial">
            <el-radio :label="1">非特卖车</el-radio>
            <el-radio :label="2">特卖车</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="是否上架" prop="status">
          <el-radio-group v-model="goods.status">
            <el-radio :label="2">上架</el-radio>
            <el-radio :label="1">下架</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="车子缩略图">
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
        <el-form-item label="车型图集排序">
          <draggable v-model="goods.photos" class="drag">
            <transition-group class="box">
              <div v-for="item in goods.photos" :key="item" style="margin-right: 10px;">
                <img :src="item" alt />
              </div>
            </transition-group>
          </draggable>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleEdit">更新商品</el-button>
    </div>
  </div>
</template>

<style scoped>
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
      this.$router.push({ path: "/goods/list" });
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
        status: this.goods.status,
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
          this.$router.push({ path: "/goods/list" });
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
