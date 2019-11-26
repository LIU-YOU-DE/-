<template>
  <div class="app-container">
    <el-button @click="goback" style="margin-left:5%;margin-bottom:20px;">返回</el-button>
    <div class="editbox">
      <div class="tabletop">
        <p class="address"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />规则修改</p>
      </div>
      <el-form ref="goods" :rules="rules" :model="goods" label-width="250px" style="margin-left:20px;">
        <el-form-item label="活动规则id" prop="id">
          <el-input v-model="goods.id" class="top-inp"/>
        </el-form-item>
        <el-form-item label="用户核销订单后奖励多少积分" prop="finishOrderRewardPoint">
          <el-input v-model="goods.finishOrderRewardPoint" class="top-inp" />
        </el-form-item>

        <el-form-item label="新用户注册奖励多少积分" prop="registerRewardPoint">
          <el-input v-model="goods.registerRewardPoint" class="top-inp" />
        </el-form-item>

        <el-form-item label="用户转发成功一次奖励多少积分" prop="shareRewardPoint">
          <el-input v-model="goods.shareRewardPoint"  class="top-inp"/>
        </el-form-item>

        <el-form-item label="汽车活动规则图片地址" prop="carRulePicture">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="goods.carRulePicture" :src="goods.carRulePicture" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1024kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="礼品活动规则图片地址" prop="giftRulePicture">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl1"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="goods.giftRulePicture" :src="goods.giftRulePicture" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1024kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="商家备注" prop="remark">
          <el-input v-model="goods.remark" type="textarea" style="width:400px;"/>
        </el-form-item>

        <el-form-item label="购车服务券包含" prop="ruleContent">
          <el-tag
            v-for="tag in ruleContent"
            :key="tag"
            :disable-transitions="false"
            closable
            @close="handleClose(tag)"
          >{{ tag }}</el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">添加规则</el-button>
        </el-form-item>
      </el-form>
    </div>



    <div class="editbox">
      <div class="tabletop">
        <p class="address"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />购买须知</p>
      </div>
      <el-button :plain="true" @click="handleAttributeShow" style="margin-bottom:10px;margin-left:10px;">添加标签</el-button>
      <el-dialog :visible.sync="attributeVisiable" title="添加购买须知标签">
        <el-input v-model="name"/>
        <div slot="footer" class="dialog-footer">
          <el-button @click="attributeVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleAttributeAdd">确定</el-button>
        </div>
      </el-dialog>

      <el-table :data="notice" border highlight-current-row>
        <el-table-column align="center" label="标签" prop="name" width="200"/>

        <el-table-column
          align="left"
          label="操作"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scoped">
            <!-- {{scoped.row}} -->
            <!-- 渲染标签 start -->
            <el-tag
              v-for="(tag,index) in scoped.row.content"
              :key="index"
              :disable-transitions="false"
              closable
              @close="handleClose1(scoped.row,index)"
            >{{ tag }}</el-tag>
            <!-- 渲染标签 ended -->
            <!-- 编辑标签 start -->
            <el-input
              v-if="scoped.row.inputVisible1"
              ref="saveTagInput1"
              v-model="scoped.row.inputValue1"
              class="input-new-tag"
              size="small"
              @keyup.enter.native="handleInputConfirm1(scoped.row)"
              @blur="handleInputConfirm1(scoped.row)"
            />
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput1(scoped.row)"
            >添加规则</el-button>
            <!-- 编辑标签 ended -->
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="操作"
          width="100"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
      


    <div class="op-container" style="margin-left:5%;">
      <el-button @click="handleCancel">取消</el-button>
      <el-button @click="handleEdit" v-permission="['PUT /rule/{id}']">更新规则</el-button>
    </div>
  </div>
</template>

<style scoped>
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
.svg{
  margin-right:5px;
  margin-left:11px;
}
.address{
  font-size:18px;
  color:#666;
  margin-left:20px;
  font-weight:600;
}
.editbox{
  width:90%;
  margin:0 auto;
  border:1px solid #EBEEF5;
  margin-bottom:20px;
}
.tabletop{
  height:60px;
  width:100%;
  background:#f3f3f3;
  padding-top:20px;
  margin-bottom:20px;
}
p{
  margin:0;
}
.top-inp{
  width:300px;
}
.cell .el-tag{
  margin-left:10px;
}
.el-tag--medium{
  margin-bottom:5px;
}
</style>

<script>
import { readAd, updateAd } from '@/api/rules'
import { createStorage, uploadPath } from '@/api/storage'
import { MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      contentarr: [],
      name: '',
      content: [],
      ruleContent: [],
      notice: [],
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
      inputVisible: false,
      inputValue: '',
      keywords: [],
      galleryFileList: [],
      categoryList: [],
      brandList: [],
      categoryIds: [],
      // goods: { gallery: [] },
      goods: {
        carRulePicture: '',
        finishOrderRewardPoint: null,
        remark: '',
        giftRulePicture: '',
        notice: [],
        ruleContent: [],
        shareRewardPoint: null,
        registerRewardPoint: null
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
      attributeForm: { name: '' },
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
    goback(){
      this.$router.go(-1)
    },
    //   活动规则
    handleClose(tag) {
      this.ruleContent.splice(this.ruleContent.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.ruleContent.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },

    // 购买须知规则
    async handleInputConfirm1(row) {
      // console.log(row);
      // 失去焦点让input隐藏

      // 当有值的时候 我们会把值添加到数组中去 但是当我把值添加到数组中去的时候 我还把值清空了
      // 当第二次又触发handleInputConfirm的时候 值就是空的 这时候 就没必要再触发 让代码停止执行
      if (!row.inputValue1.trim()) {
        row.inputValue1 = ''
        row.inputVisible1 = false
        return false
      }
      // console.log("ok");

      // 判断 this.inputvalue值的length是不是大于0 如果大于0 把该值通过push方法添加到数组中去
      // 去掉两边的空格之后 还剩下的长度 如果大于0
      if (row.inputValue1.trim().length > 0) {
        row.content.push(row.inputValue1.trim())
      }

      row.inputValue1 = ''
      row.inputVisible1 = false
    },
    // 点击按钮 让input显示
    showInput1(row) {
      row.inputVisible1 = true
      // 让input自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput1.$refs.input.focus()
      })
    },
    // 删除标签
    async handleClose1(row, index) {
      // console.log(row);
      // console.log(index);
      row.content.splice(index, 1)
      // console.log(row);
      // this.notice = {
      //   name: row.name,
      //   content: row.content.join(" ")
      // };
    },

    init: function() {
      const goodsId = this.$route.query.id
      this.upid = goodsId
      readAd(goodsId).then(response => {
        // console.log(response);
        this.goods = response.data.data
        this.ruleContent = response.data.data.ruleContent
        this.notice = response.data.data.notice
        // console.log(this.goods);
      })
    },
    handleCancel: function() {
      this.$router.push({ path: '/mall/rules' })
    },
    handleEdit: function() {
      // debugger;
      // console.log(this.notice);
      // function isString(str) {
      //   return typeof str == "string" && str.constructor == String;
      // }
      for (let i = 0; i < this.notice.length; i++) {
        // if (isString(this.notice[i].content)) {
        //   this.contentarr.push(this.notice[i].content);
        // }
        delete this.notice[i].inputValue1
        delete this.notice[i].inputVisible1
      }

      // console.log(isString(this.notice[0].content));
      // console.log(typeof this.notice[0].content.length==String);
      console.log(this.notice)

      const finalGoods = {
        carRulePicture: this.goods.carRulePicture,
        finishOrderRewardPoint: this.goods.finishOrderRewardPoint,
        giftRulePicture: this.goods.giftRulePicture,
        notice: this.notice,
        registerRewardPoint: this.goods.registerRewardPoint,
        remark: this.goods.remark,
        ruleContent: this.goods.ruleContent,
        shareRewardPoint: this.goods.shareRewardPoint
      }
      //  console.log(finalGoods);

      updateAd(finalGoods, this.upid)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '更新成功'
          })
          this.$router.push({ path: '/mall/rules' })
        })
        .catch(response => {
          MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
    },
    uploadPicUrl: function(response) {
      this.goods.carRulePicture = response.data.url
    },
    uploadPicUrl1: function(response) {
      this.goods.giftRulePicture = response.data.url
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
      this.name = {
        name: this.name,
        content: []
      }
      this.notice.push(this.name)

      this.name = ''

      this.attributeVisiable = false
    },
    handleDelete(data) {
      Array.prototype.del = function(value) {
        var index = this.length
        var deleindex = 0
        for (var i = 0; i < index; i++) {
          if (this[i].name == value.name) {
            deleindex = i
          }
        }

        this.splice(deleindex, 1)
        return this
      }

      // 要操作的数组
      // var arr = [america,china,japan];
      var arr = this.notice
      // console.log(arr);

      arr.del(data)
      // console.log(arr);
    },
    handleAttributeDelete(row) {
      const index = this.attributes.indexOf(row)
      this.attributes.splice(index, 1)
    }
  }
}
</script>
