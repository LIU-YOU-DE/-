<template>
  <div class="app-container" style="width:90%;margin:0 auto;">
    <div class="tabletop">
      <p class="address">门店修改</p>
    </div>
    <p class="address" style="font-size:16px;margin-bottom:40px;margin-left:50px;"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />门店信息</p>
    <div style="display:flex;justify-content:center;">
      <el-form ref="goods" :rules="rules" v-model="goods" label-width="200px">
        <el-form-item label="门店名称" prop="storeName">
          <el-input v-model="goods.storeName"  style="width:400px;"/>
        </el-form-item>

        <el-form-item label="负责人" prop="name">
          <el-input v-model="goods.name"  style="width:400px;"/>
        </el-form-item>

        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="goods.mobile" style="width:400px;" />
        </el-form-item>

        <el-form-item label="品牌标志" prop="logoUrl">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="goods.logoUrl" :src="goods.logoUrl" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1024kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="所在城市">
          <el-cascader
            :options="categoryList"
            v-model="categoryIds"
            :props="categoryProps"
            expand-trigger="hover"
            @change="handleCategoryChange"
          />
        </el-form-item>
        
        <el-form-item label="门店地址" prop="address">
          <el-input v-model="goods.address"  style="width:400px;"/>
        </el-form-item>
      
        <el-form-item label="备注" prop="remark">
          <el-input v-model="goods.remark"  style="width:400px;" type="textarea"/>
        </el-form-item>
      </el-form>
    </div>
    

      <p class="address" style="font-size:16px;margin-bottom:40px;margin-left:50px;"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />车型信息</p>
      <el-button :plain="true" @click="handleAttributeShow" style="margin-bottom:20px;">添加</el-button>
      <el-table :data="cardata" border highlight-current-row>
        <el-table-column align="center" label="车型名称" prop="id" />

        <el-table-column align="center" label="品牌名称" prop="name" />

        <el-table-column align="center" property="coverUrl" label="车型图">
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
      <el-dialog :visible.sync="attributeVisiable" title="添加车型">
        <el-form
          ref="attributeForm"
          :model="attributeForm"
          status-icon
          label-position="left"
          label-width="100px"
          style="margin-left:50px;"
        >
          <el-input
            v-model="attributeForm.name"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="请输入汽车名称"
            v-on:keyup.enter.native="seachcar"
          />
          <el-button class="filter-item" icon="el-icon-search" @click="seachcar">查找</el-button>
          <el-table :data="carlist" border highlight-current-row @selection-change="changeFun" style="margin-top:10px;">
            <el-table-column type="selection" width="55" @selection-change="changeFun"/>
            <el-table-column align="center" label="车型名称" prop="id" />
            <el-table-column align="center" label="品牌名称" prop="name" />
            <el-table-column align="center" property="coverUrl" label="车型图">
              <template slot-scope="scope">
                <img :src="scope.row.coverUrl" width="40" >
              </template>
            </el-table-column>
          </el-table>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="attributeVisiable = false">取消</el-button>
          <el-button @click="handleAttributeAdd">确定</el-button>
        </div>
      </el-dialog>

    <div class="op-container" style="margin-top:20px;display:flex;justify-content:center;">
      <el-button @click="handleCancel">取消</el-button>
      <el-button @click="handleEdit">更新商家</el-button>
    </div>
  </div>
</template>

<style scoped>
.address{
  font-size:18px;
  color:#666;
  margin-left:20px;
  font-weight:600;
}
.avatar-uploader-icon[data-v-42d25afa]{
  border:1px dashed #d9d9d9;
  border-radius: 6px;
}
.svg{
  margin-right:5px;
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
.avatar[data-v-6ac28425]{
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
</style>

<script>
import { listAd, createAd, getdate, updateAd, readAd, listCatAndBrand } from '@/api/merchant'
import { createStorage, uploadPath } from '@/api/storage'
import { MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      categoryProps: {
        label: 'name',
        value: 'id',
        children: 'children',
        expandTrigger: 'hover'
      },
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
      goods: [],
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
      // debugger
      // console.log(this.$route);

      const goodsId = this.$route.query.id
      this.upid = goodsId
      getdate(goodsId).then(response => {
        // console.log(response.data.data.regionId);
        this.goods = response.data.data
        this.categoryIds = response.data.data.regionId
        for (var i = 0; i < response.data.data.carVoList.length; i++) {
          this.cardata1 = response.data.data.carVoList[i]
          // this.cardata=cardata2
          this.cardata.unshift({
            id: this.cardata1.id,
            name: this.cardata1.name,
            coverUrl: this.cardata1.coverUrl
          })
        }

        //  console.log(this.cardata);

        //  debugger
      })

      listCatAndBrand().then(response => {
        // console.log(response.data.data.list);

        this.categoryList = response.data.data.list
        // this.brandList = response.data.data.brandList;
      })
    },
    handleCategoryChange(value) {
      //  console.log(value);

      this.goods.regionId = value
    },
    handleCancel: function() {
      this.$router.push({ path: '/test-marketing/test-merchant' })
    },
    handleEdit: function() {
      // debugger;
      // console.log(this.goods.regionId );

      this.goods.regionId = this.goods.regionId[this.goods.regionId.length - 1]

      for (var i = 0; i < this.cardata.length; i++) {
        this.carid.unshift(this.cardata[i].id)
      }
      // console.log(this.carid);
      // debugger
      const finalGoods = {
        address: this.goods.address,
        carIds: this.carid,
        latitude: this.goods.latitude,
        logoUrl: this.goods.logoUrl,
        longitude: this.goods.longitude,
        mobile: this.goods.mobile,
        name: this.goods.name,
        regionId: this.goods.regionId,
        remark: this.goods.remark,
        status: this.goods.status,
        storeName: this.goods.storeName
      }
      //  console.log(finalGoods);

      updateAd(finalGoods, this.upid)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '更新成功'
          })
          this.$router.push({ path: '/test-marketing/test-merchant' })
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
        console.log(response)
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
