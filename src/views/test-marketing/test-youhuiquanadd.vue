<template>
  <div class="app-youhuiquanadd" style="width:90%;margin:0 auto;">
      <div class="tabletop">
        <p class="address">添加优惠券</p>
      </div>
       <p class="address" style="font-size:16px;margin-bottom:40px;margin-left:50px;"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />优惠券介绍</p>
      <el-form ref="goods" :rules="rules" :model="goods" label-width="150px" style="margin-left:30%;">
        <el-form-item label="优惠券种类" prop="kind" >
          <el-radio-group v-model="goods.kind" >
            <el-radio :label="1" @change="showFaceValue=true">购车补贴</el-radio>
            <el-radio :label="2" @change="showFaceValue=false">服务券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="面值" prop="faceValue" v-if="showFaceValue">
          <el-input-number v-model="goods.faceValue" :step="1" class="priceInput" /> 元
        </el-form-item>
        <el-form-item label="优惠券内容" prop="next">
          <el-col :span="12">
            <el-input v-model="goods.next"/>  
          </el-col>
          示例: 元购车补贴券
        </el-form-item>
        <el-form-item label="优惠券价格" prop="price">
          <el-input-number v-model="goods.price" :step="1" class="priceInput"/> 元
        </el-form-item>
        <!-- <el-form-item label="排序" prop="sort">
          <el-input-number v-model="goods.sort" :step="1" />
        </el-form-item> -->

        <el-form-item label="备注" prop="remark">
          <el-input v-model="goods.remark" type="textarea" autosize style="width:50%;"/>
        </el-form-item>
        <el-form-item label="使用范围" prop="type">
          <el-radio-group v-model="goods.type" >
            <el-radio :label="1" @change="showtable=false">全部通用</el-radio>
            <el-radio :label="2" @change="showtable=true">指定车辆</el-radio>
          </el-radio-group>
        </el-form-item>
        
      </el-form>


    <div v-if="showtable">
      <p class="address" style="font-size:16px;margin-bottom:40px;margin-left:50px;"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />指定汽车</p>
      <el-button :plain="true" @click="handleAttributeShow" style="margin-left:77px;margin-bottom:20px;">添加</el-button>
      <el-table :data="cardata" border highlight-current-row style="width:90%;margin:0 auto;">
        <el-table-column align="center" label="汽车id" prop="id" />
        <el-table-column align="center" label="汽车名字" prop="name" />
        <el-table-column align="center" property="coverUrl" label="车子封面图片">
          <template slot-scope="scope">
            <img :src="scope.row.coverUrl" width="40" >
          </template>
        </el-table-column>
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
      </el-table>
      <el-dialog :visible.sync="attributeVisiable" title="指定车型">
        <el-form
          ref="attributeForm"
          :model="attributeForm"
          status-icon
          label-position="left"
          label-width="100px"
          style="margin-left:50px;"
          v-on:keyup.enter.native="seachcar"
        >
        
          <el-input
            v-model="attributeForm.name"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="请输入汽车名称"
          />
          <el-button class="filter-item" icon="el-icon-search" @click="seachcar">查找</el-button>
          <el-table :data="carlist" border highlight-current-row @selection-change="changeFun" style="margin-top:10px;">
            <el-table-column type="selection" width="55" @selection-change="changeFun"/>
            <el-table-column align="center" label="车型id" prop="id" />
            <el-table-column align="center" label="车型名称" prop="name" />
            <el-table-column align="center" property="coverUrl" label="车型图片">
              <template slot-scope="scope">
                <img :src="scope.row.coverUrl" width="40" >
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-form-item label="车型名字" prop="attribute">
            <el-input v-model="attributeForm.name" />
          </el-form-item>
          -->
          <!-- <el-form-item label="货品图片" prop="coverUrl">
            <el-upload
              :headers="headers"
              :action="uploadPath"
              :show-file-list="false"
              :on-success="uploadProductUrl"
              class="avatar-uploader"
              accept=".jpg,.jpeg,.png,.gif">
              <img v-if="attributeForm.coverUrl" :src="attributeForm.coverUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="attributeVisiable = false">取消</el-button>
          <el-button @click="handleAttributeAdd">确定</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="op-container" style="display:flex;justify-content:center;margin-top:20px;">
      <el-button @click="handleCancel">取消</el-button>
      <el-button @click="handleEdit" v-permission="['POST /coupon']">添加优惠券</el-button>
    </div>
  </div>
</template>

<style scoped>
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
.priceInput{
  width:200px!important;
}
</style>

<script>
import { listAd, createAd, getdate, updateAd, readAd } from '@/api/youhuiquan'
import { createStorage, uploadPath } from '@/api/storage'
import { MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      showFaceValue: true,   //是否显示面值
      showtable: false,
      carid: [],
      cardata1: [],
      cardata: [],
      finalGoods: {},
      carupid: [],
      choosedata: [],
      carlist: [],
      arr: [],
      upid: null,
      uploadPath,
      newKeywordVisible: false,
      newKeyword: '',
      keywords: [],
      galleryFileList: [],
      categoryList: [],
      brandList: [],
      categoryIds: [],
      // goods: { gallery: [] },
      goods: {

       kind: 1
      },
      specVisiable: false,
      specForm: { specification: '', value: '', picUrl: '' },
      specifications: [{ specification: '规格', value: '标准', picUrl: '' }],
      productVisiable: false,
      productForm: {
        id: 0,
        specifications: [],
        price: 0.0,
        number: 0,
        url: ''
      },
      // products: [
      //   { id: 0, specifications: ["标准"], price: 0.0, number: 0, url: "" }
      // ],
      attributeVisiable: false,
      attributeForm: { id: '', name: '', coverUrl: '' },
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
        // toolbar: [
        //   "searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample",
        //   "hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen"
        // ],
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

    },
    handleCancel: function() {
      this.$router.push({ path: '/test-marketing/test-youhuiquan' })
    },
    handleEdit: function() {
      // debugger;

      for (var i = 0; i < this.cardata.length; i++) {
        this.carid.unshift(this.cardata[i].id)
      }
      // console.log(this.carid);
      // debugger
      const finalGoods = {
        carIds: this.carid,
        remark: this.goods.remark,
        expireTime: this.goods.expireTime,
        faceValue: this.goods.faceValue,
        kind: this.goods.kind,
        next: this.goods.next,
        price: this.goods.price,
        sort: this.goods.sort,
        status: this.goods.status,
        type: this.goods.type,
        up: this.goods.up
      }

      createAd(finalGoods)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '创建成功'
          })
          this.$router.push({ path: '/test-marketing/test-youhuiquan' })
        })
        .catch(response => {
          MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
    },
    uploadPicUrl: function(response) {
      this.goods.logoUrl = response.data.url
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
        this.arr.push(response.data.url)
      }
    },
    handleRemove: function(file, fileList) {
      for (var i = 0; i < this.goods.photos.length; i++) {
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

        if (this.goods.photos[i] === url) {
          this.goods.photos.splice(i, 1)
        }
      }
    },

    uploadSpecPicUrl: function(response) {
      this.specForm.picUrl = response.data.url
    },

    uploadProductUrl: function(response) {
      this.productForm.url = response.data.url
    },
    uploadProductUr: function(response) {
      this.productForm.coverUrl = response.data.url
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
    seachcar() {
      readAd(this.attributeForm.name).then(response => {
        // console.log(response);
        this.carlist = response.data.data.list
        // debugger;
      })
    },
    changeFun(data) {
      this.choosedata = data
      //   for(i=0;i<this.choosedata.length;i++){
      // this.carupid.push(this.choosedata[i].id)
      //   }
      // console.log(this.choosedata);
      // console.log(this.carupid);
    },
    handleAttributeAdd() {
      // this.attributes.unshift(this.attributeForm);
      // this.cardata.unshift(this.choosedata)
      for (var i = 0; i < this.choosedata.length; i++) {
        this.cardata.unshift(this.choosedata[i])
      }
      //   for(var i=0;i<this.cardata1.length;i++){
      //    this.cardata2.unshift(this.cardata[i])

      // }

      // console.log(this.cardata);

      // console.log(this.cardata.length);

      this.attributeVisiable = false
    },
    handleDelete(id) {
      Array.prototype.del = function(filter) {
        var index = filter
        if (typeof filter === 'function') {
          for (var i = 0; i < this.length; i++) {
            if (filter(this[i], i)) index = i
          }
        }
        this.splice(index, 1)
      }
      var arr = this.cardata
      arr.del(function(arr) {
        return arr.id == id
      })
      // console.log(arr);
    },
    handleAttributeDelete(row) {
      const index = this.attributes.indexOf(row)
      this.attributes.splice(index, 1)
    }
  }
}
</script>
