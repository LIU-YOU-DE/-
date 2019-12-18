<template>
  <div class="app-container"   style="width:90%;margin:0 auto;">
    <div class="tabletop">
      <p class="address">新增车辆</p>
    </div>
      <p class="address" style="font-size:16px;margin-bottom:40px;margin-left:50px;"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />车型基本信息</p>
      <el-form ref="goods" :rules="rules" :model="goods" label-width="150px"  style="margin-left:30%;">
        <!-- <el-form-item label="品牌id" prop="brandId">
          <el-input v-model="goods.brandId" />
        </el-form-item> -->
        <el-form-item label="品牌名称">
          <el-select v-model="goods.brandId" style="width:250px;">
            <el-option
              v-for="item in brandList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车型种类">
        <el-select v-model="goods.carType" placeholder="请选择" style="width:250px;">
          <el-option
            v-for="item in carTypeList"
            :key="item.type"
            :label="item.name"
            :value="item.type">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="车型名称" prop="name">
          <el-input v-model="goods.name" style="width:250px;"/>
        </el-form-item>

        <el-form-item label="特卖车" prop="isSpecial">
          <el-radio-group v-model="goods.isSpecial">
            <el-radio :label="1">否</el-radio>
            <el-radio :label="2">是</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- <el-form-item label="首字母" prop="wordBegin">
          <el-input v-model="goods.wordBegin">
            <template slot="append">元</template>
          </el-input>
        </el-form-item> -->
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
        
        <!-- <el-form-item label="是否添加" prop="status">
          <el-radio-group v-model="goods.status">
            <el-radio :label="2">上架</el-radio>
            <el-radio :label="1">下架</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <p class="address" style="font-size:16px;margin-bottom:40px;margin-left:-37%;"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />车型照片</p>
        <el-form-item label="车型图">
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
          <span style="font-size:14px;color:#666;">只能上传jpg/png格式文件，文件不能超过10kb</span>
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
      <!-- <el-button :plain="true" @click="handleAttributeShow" style="margin-bottom:10px;">添加</el-button>
      <el-table :data="addresslist2" border highlight-current-row>
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

      <!-- 查找门店 -->
      <!-- <el-dialog :visible.sync="attributeVisiable" title="添加门店">
        <el-form
          ref="attributeForm" 
          status-icon
          label-position="left"
          label-width="100px"
          style="margin-left:50px;"
        >

          <el-input
            v-model="listQuery.name"
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

            <el-table-column align="center" prop="logoUrl" label="品牌标志">
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
          <el-button @click="attributeVisiable = false">取消</el-button>
          <el-button @click="handleaddressbuteAdd">确定</el-button>
        </div>
      </el-dialog> -->

      

    <div class="op-container" style="display:flex;justify-content:center;margin-top:20px;">
      <el-button @click="handleCancel">取消</el-button>
      <el-button @click="handlePublish">添加</el-button>
    </div>
  </div>
</template>

<style scoped>
.avatar-uploader-icon[data-v-a41a7566]{
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
import { listAd} from '@/api/merchant'

export default {
  name: 'GoodsCreate',
  components: { Editor,draggable },

  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        content: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      arr: [],
      addresslist:[],
      addresslist2:[],
      choosedata: [],
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
        isSpecial: 1,
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
      this.attributeVisiable=false
      this.listQuery.name=""
      this.choosedata=[]
    },
    seachcar(){
      listAd(this.listQuery).then(response=>{
        this.addresslist=response.data.data.list
      })
    },
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
      this.$router.push({ path: '/test-marketing/test-list' })
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
        isHot:1,
        isPopular:1,
        isRecommend:1,
        name: this.goods.name,
        number: this.goods.number,
        photos: this.goods.photos,
        sort: this.goods.sort,
        status: 1,
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
          this.$router.push({ path: '/test-marketing/test-list' })
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
