<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>添加礼品</h3>
      <el-form ref="goods" :model="goods" label-width="150px">
        <!-- <el-form-item label="商品编号" prop="goodsSn">
          <el-input class="custom" v-model="goods.goodsSn"/>
        </el-form-item>-->

        <el-form-item label="所属分类">
          <el-cascader
            :options="categoryList"
            v-model="categoryIds"
            :props="categoryProps"
            expand-trigger="hover"
            @change="handleCategoryChange"
          />
        </el-form-item>

        <el-form-item label="礼品名称" prop="name">
          <el-input class="custom" v-model="goods.name" />
        </el-form-item>
        <el-form-item label="礼品原价" prop="name">
          <el-input class="custom" v-model="goods.priceMoney" />
        </el-form-item>
        <el-form-item label="兑换所需积分" prop="pricePoint">
          <el-input-number :min="0" :step="1" v-model="goods.pricePoint"/><span style="margin-left:10px;">建议值:{{goods.priceMoney==null ? 0 : goods.priceMoney*1000}} (原价x1000)</span>
        </el-form-item>
        <el-form-item label="商品简介" prop="describe">
          <el-input class="custom" v-model="goods.describe"/>
        </el-form-item>
        <el-form-item label="库存数量" prop="stock">
          <el-input-number :min="0" :step="1" v-model="goods.stock"/>
        </el-form-item>
        <el-form-item label="礼品单位" prop="unit">
          <el-col :span="7">
          <el-input class="custom" v-model="goods.unit"/><span style="margin-left:10px;">示例：个/只</span>
          </el-col>
        </el-form-item>
        <el-form-item label="预警数量" prop="warnStock">
          <el-input-number :step="1" :min="0" v-model="goods.warnStock"/>
        </el-form-item>
        
        <el-form-item label="详情图图片url">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="goods.detailUrl" :src="goods.detailUrl" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="礼品缩略图">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl1"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="goods.coverUrl" :src="goods.coverUrl" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

        <el-form-item label="图册">
          <el-upload
            :action="uploadPath"
            :headers="headers"
            :limit="5"
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

        <el-form-item label="礼品排序">
          <draggable v-model="goods.picture" class="drag">
            <transition-group class="box">
              <div v-for="item in goods.picture" :key="item" style="margin-right: 10px;">
                <img :src="item" alt />
              </div>
            </transition-group>
          </draggable>
        </el-form-item>

        <el-form-item label="是否推荐" prop="isHot">
          <el-radio-group v-model="goods.isHot">
            <el-radio :label="1">不推荐</el-radio>
            <el-radio :label="2">推荐</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否显示" prop="status">
          <el-radio-group v-model="goods.status">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="2">不显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
            <el-input class="custom" type="textarea" autosize v-model="goods.remark"/>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleEdit" >添加礼品</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 10px;
}
.box-card{
  .custom{
    width: 50%;
  }
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
.avatar-uploader-icon[data-v-14b9dacd]{
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
</style>

<script>
import {
  detailliping,
  listCatAndBrand,
  editGoods,
  publishGoods
} from '@/api/liping'
import { createStorage, uploadPath } from '@/api/storage'
import Editor from '@tinymce/tinymce-vue'
import { MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'
import draggable from "vuedraggable";

export default {
  name: 'GoodsEdit',
  components: { Editor,draggable },
  data() {
    return {
      categoryProps: {
        label: 'name',
        value: 'id',
        children: 'children',
        expandTrigger: 'hover'
      },
      categoryIds: null,
      brandname: { order: 'asc', sort: 'word_begin' },
      arr: [],
      upid: null,
      uploadPath,
      newKeywordVisible: false,
      newKeyword: '',
      galleryFileList: [],
      categoryList: [],
      brandList: [],
      brandId: [],
      //   goods: { gallery: [] },
      goods: {
        detailUrl: '',
        coverUrl: '',
        picture: [],
      },
      editorInit: {
        language: 'zh_CN',
        convert_urls: false,
        plugins: [
          'advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'
        ],
        toolbar: [
          'searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample',
          'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'
        ],
        images_upload_handler: function(blobInfo, success, failure) {
          const formData = new FormData()
          formData.append('file', blobInfo.blob())
          createStorage(formData)
            .then(res => {
              success(res.data.data.url)
            })
            .catch(() => {
              failure('上传失败，请重新上传')
            })
        }
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
  created() {
    this.init()
  },
  methods: {
    init: function() {
      //   if (this.$route.query.id == null) {
      //     return;
      //   }

      //   const goodsId = this.$route.query.id;

      //   detailliping(goodsId).then(response => {
      //     // console.log(response);
      //     this.arr = response.data.data.picture;
      //     // console.log(this.arr);

      //     this.goods = response.data.data;
      //     this.upid = response.data.data.id;
      //     this.categoryId = response.data.data.categoryId;
      //     // console.log(this.brandId);

      //     for (var i = 0; i < this.goods.picture.length; i++) {
      //       this.galleryFileList.push({
      //         url: this.goods.picture[i]
      //       });
      //     }
      //     // console.log(response);
      //   });

      listCatAndBrand().then(response => {
        // console.log(response.data.data.list);

        this.categoryList = response.data.data.list

        
        // console.log(this.categoryList[0].id);

        // this.brandList = response.data.data.list;
      })
    },
    handleCategoryChange(value) {
      this.goods.categoryId = value[value.length - 1]
      console.log(this.goods.categoryId)
    },
    handleCancel: function() {
      this.$router.push({ path: '/gift/liping' })
    },
    handleEdit: function() {
      const finalGoods = {
        describe: this.goods.describe,
        buyDeadline: this.goods.buyDeadline,
        detailUrl: this.goods.detailUrl,
        coverUrl: this.goods.coverUrl,
        details: this.goods.details,
        isHot: this.goods.isHot,
        name: this.goods.name,
        number: this.goods.number,
        picture: this.goods.picture,
        remark: this.goods.remark,
        saleQuantity: this.goods.saleQuantity,
        stock: this.goods.stock,
        sort: this.goods.sort,
        status: this.goods.status,
        unit: this.goods.unit,
        stock: this.goods.stock,
        warnStock: this.goods.warnStock,
        categoryId: this.goods.categoryId,
        pricePoint: this.goods.pricePoint,
        priceMoney:this.goods.priceMoney
      }

      publishGoods(finalGoods)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '创建成功'
          })
          this.$router.push({ path: '/gift/liping' })
        })
        .catch(response => {
          MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
    },

    uploadPicUrl: function(response) {
      this.goods.detailUrl = response.data.url
    },
    uploadPicUrl1: function(response) {
      this.goods.coverUrl = response.data.url
    },
    uploadPica: function(response) {
      this.goods.detail = response.data.url
    },
    uploadOverrun: function() {
      this.$message({
        type: 'error',
        message: '上传文件个数超出限制!最多上传5张图片!'
      })
    },
    handleGalleryUrl(response, file, fileList) {
      if (response.errno === 0) {
        this.goods.picture = this.arr
        this.arr.push(response.data.url)
      }
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
    }
  }
}
</script>
