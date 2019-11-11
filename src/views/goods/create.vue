<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>添加汽车</h3>
      <el-form ref="goods" :rules="rules" :model="goods" label-width="150px">
        <!-- <el-form-item label="品牌id" prop="brandId">
          <el-input v-model="goods.brandId" />
        </el-form-item> -->
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
        <el-select v-model="goods.carType" placeholder="请选择">
          <el-option
            v-for="item in carTypeList"
            :key="item.type"
            :label="item.name"
            :value="item.type">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="车型名字" prop="name">
          <el-input v-model="goods.name" />
        </el-form-item>
        <!-- <el-form-item label="首字母" prop="wordBegin">
          <el-input v-model="goods.wordBegin">
            <template slot="append">元</template>
          </el-input>
        </el-form-item> -->
        <el-form-item label="购买截止日期" prop="buyDeadline">
          <el-date-picker
            v-model="goods.buyDeadline"
            type="datetime"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 33%;"
          />
        </el-form-item>
        <el-form-item label="活动截止日期" prop="endTime">
          <el-date-picker
            v-model="goods.endTime"
            type="datetime"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 33%;"
          />
        </el-form-item>
        <el-form-item label="是否特卖车" prop="isSpecial">
          <el-radio-group v-model="goods.isSpecial">
            <el-radio :label="1">非特卖车</el-radio>
            <el-radio :label="2">特卖车</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="是否添加" prop="status">
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
            :on-success="uploadPicUrla"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="goods.coverUrl" :src="goods.coverUrl" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

        <el-form-item label="车型详情图">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="goods.detail" :src="goods.detail" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

        <el-form-item label="车型图集">
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

        <el-form-item label="车型排序">
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
      <el-button type="primary" @click="handlePublish">添加</el-button>
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
  width: 145px;
  height: 145px;
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
.el-textarea__inner{
  width:400px;
}
.el-time{
  width:400px;
}
.box {
  display: flex !important;
}
.drag img {
  width: 180px;
  height: 120px;
}
.avatar-uploader-icon[data-v-2ab64f22]{
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
</style>

<script>
import { publishGoods, listCatAndBrand } from '@/api/goods'
import { createStorage, uploadPath } from '@/api/storage'
import Editor from '@tinymce/tinymce-vue'
import { MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'
import draggable from "vuedraggable";

export default {
  name: 'GoodsCreate',
  components: { Editor,draggable },

  data() {
    return {
      arr: [],
      galleryFileList: [],
      uploadPath,
      newKeywordVisible: false,
      newKeyword: '',
      keywords: [],
      categoryList: [],
      brandList: [],
      carTypeList:"",
      value:'',
      goods: {
        brandId: '',
        buyDeadline: '',
        carDetails: '',
        coverUrl: '',
        detail: '',
        detailTitle: '',
        detailHtml: '',
        endTime: '',
        isSpecial: '',
        name: '',
        number: '',
        photos: '',
        sort: '',
        status: '',
        updateTime: '',
        wordBegin: '',
        remark: '',
        carType:'',
      },
      specVisiable: false,
      specForm: { specification: '', value: '', picUrl: '' },
      multipleSpec: false,
      specifications: [{ specification: '规格', value: '标准', picUrl: '' }],
      productVisiable: false,
      productForm: {
        id: 0,
        specifications: [],
        price: 0.0,
        number: 0,
        url: ''
      },
      products: [
        { id: 0, specifications: ['标准'], price: 0.0, number: 0, url: '' }
      ],
      attributeVisiable: false,
      attributeForm: { attribute: '', value: '' },
      attributes: [],
      rules: {
        goodsSn: [
          { required: true, message: '商品编号不能为空', trigger: 'blur' }
        ],
        name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }]
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
      listCatAndBrand().then(response => {
        // this.categoryList = response.data.data.categoryList;
        this.brandList = response.data.data.brandList
        this.carTypeList = response.data.data.carTypeList
        // console.log(this.brandList);
      })
    //   listCatAndBrand().then(response => {
    //     this.categoryList = response.data.data.categoryList;
    //     this.brandList = response.data.data.brandList;
    //   });
    // },
    // handleCategoryChange(value) {
    //   this.goods.categoryId = value[value.length - 1];
    },
    handleCancel: function() {
      this.$router.push({ path: '/goods/list' })
    },
    handlePublish: function() {
      const finalGoods = {
        brandId: this.goods.brandId,
        buyDeadline: this.goods.buyDeadline,
        carDetails: this.goods.carDetails,
        coverUrl: this.goods.coverUrl,
        detail: this.goods.detail,
        detailTitle: this.goods.detailTitle,
        detailHtml: this.goods.detailHtml,
        endTime: this.goods.endTime,
        isSpecial: this.goods.isSpecial,
        name: this.goods.name,
        number: this.goods.number,
        photos: this.goods.photos,
        sort: this.goods.sort,
        status: this.goods.status,
        updateTime: this.goods.updateTime,
        wordBegin: this.goods.wordBegin,
        remark: this.goods.remark,
        carType:this.goods.carType,
      }
      // console.log(finalGoods);
      publishGoods(finalGoods)
        .then(response => {
          this.$notify.success({
            title: '汽车已上传',
            message: '请在商家管理中添加该汽车'
          })
          this.$router.push({ path: '/goods/list' })
        })
        .catch(response => {
          MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
    },
    handleClose(tag) {
      this.keywords.splice(this.keywords.indexOf(tag), 1)
      this.goods.keywords = this.keywords.toString()
    },
    showInput() {
      this.newKeywordVisible = true
      this.$nextTick(_ => {
        this.$refs.newKeywordInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const newKeyword = this.newKeyword
      if (newKeyword) {
        this.keywords.push(newKeyword)
        this.goods.keywords = this.keywords.toString()
      }
      this.newKeywordVisible = false
      this.newKeyword = ''
    },
    uploadPicUrl: function(response) {
      this.goods.detail = response.data.url
      // console.log(this.goods.detail);
    },
    uploadPicUrla: function(response) {
      this.goods.coverUrl = response.data.url

      // console.log(this.goods.coverUrl);
    },
    uploadOverrun: function() {
      this.$message({
        type: 'error',
        message: '上传文件个数超出限制!最多上传5张图片!'
      })
    },
    handleGalleryUrl(response, file, fileList) {
      if (response.errno === 0) {
        this.goods.photos = this.arr
        this.goods.photos.push(response.data.url)
      }
    },
    handleRemove: function(file, fileList) {
      for (var i = 0; i < this.goods.gallery.length; i++) {
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

        if (this.goods.gallery[i] === url) {
          this.goods.gallery.splice(i, 1)
        }
      }
    },
    specChanged: function(label) {
      if (label === false) {
        this.specifications = [
          { specification: '规格', value: '标准', picUrl: '' }
        ]
        this.products = [
          { id: 0, specifications: ['标准'], price: 0.0, number: 0, url: '' }
        ]
      } else {
        this.specifications = []
        this.products = []
      }
    },
    uploadSpecPicUrl: function(response) {
      this.specForm.picUrl = response.data.url
    },
    handleSpecificationShow() {
      this.specForm = { specification: '', value: '', picUrl: '' }
      this.specVisiable = true
    },
    handleSpecificationAdd() {
      var index = this.specifications.length - 1
      for (var i = 0; i < this.specifications.length; i++) {
        const v = this.specifications[i]
        if (v.specification === this.specForm.specification) {
          if (v.value === this.specForm.value) {
            this.$message({
              type: 'warning',
              message: '已经存在规格值:' + v.value
            })
            this.specForm = {}
            this.specVisiable = false
            return
          } else {
            index = i
          }
        }
      }

      this.specifications.splice(index + 1, 0, this.specForm)
      this.specVisiable = false

      this.specToProduct()
    },
    handleSpecificationDelete(row) {
      const index = this.specifications.indexOf(row)
      this.specifications.splice(index, 1)
      this.specToProduct()
    },
    specToProduct() {
      if (this.specifications.length === 0) {
        return
      }
      // 根据specifications创建临时规格列表
      var specValues = []
      var spec = this.specifications[0].specification
      var values = []
      values.push(0)

      for (var i = 1; i < this.specifications.length; i++) {
        const aspec = this.specifications[i].specification

        if (aspec === spec) {
          values.push(i)
        } else {
          specValues.push(values)
          spec = aspec
          values = []
          values.push(i)
        }
      }
      specValues.push(values)

      // 根据临时规格列表生产货品规格
      // 算法基于 https://blog.csdn.net/tyhj_sf/article/details/53893125
      var productsIndex = 0
      var products = []
      var combination = []
      var n = specValues.length
      for (var s = 0; s < n; s++) {
        combination[s] = 0
      }
      var index = 0
      var isContinue = false
      do {
        var specifications = []
        for (var x = 0; x < n; x++) {
          var z = specValues[x][combination[x]]
          specifications.push(this.specifications[z].value)
        }
        products[productsIndex] = {
          id: productsIndex,
          specifications: specifications,
          price: 0.0,
          number: 0,
          url: ''
        }
        productsIndex++

        index++
        combination[n - 1] = index
        for (var j = n - 1; j >= 0; j--) {
          if (combination[j] >= specValues[j].length) {
            combination[j] = 0
            index = 0
            if (j - 1 >= 0) {
              combination[j - 1] = combination[j - 1] + 1
            }
          }
        }
        isContinue = false
        for (var p = 0; p < n; p++) {
          if (combination[p] !== 0) {
            isContinue = true
          }
        }
      } while (isContinue)

      this.products = products
    },
    handleProductShow(row) {
      this.productForm = Object.assign({}, row)
      this.productVisiable = true
    },
    uploadProductUrl: function(response) {
      this.productForm.url = response.data.url
    },
    handleProductEdit() {
      for (var i = 0; i < this.products.length; i++) {
        const v = this.products[i]
        if (v.id === this.productForm.id) {
          this.products.splice(i, 1, this.productForm)
          break
        }
      }
      this.productVisiable = false
    },
    handleAttributeShow() {
      this.attributeForm = {}
      this.attributeVisiable = true
    },
    handleAttributeAdd() {
      this.attributes.unshift(this.attributeForm)
      this.attributeVisiable = false
    },
    handleAttributeDelete(row) {
      const index = this.attributes.indexOf(row)
      this.attributes.splice(index, 1)
    }
  }
}
</script>
