<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container" style="border:1px solid #DCDFE6;margin-bottom:20px;height:115px;">
      <div style="width:100%;height:50px;background-color:#F3F3F3;position:relative;margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;padding-right:20px;">
          <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;font-size:15px;"><svg-icon icon-class="search" class-name="card-panel-icon svg" />筛选查找</p>
        <div>
         <el-button v-permission="['GET /banners']" class="filter-item" style="margin-top:8px;display:inline-block;" icon="el-icon-search" @click="handleFilter">查找</el-button>
         <el-button class="filter-item" icon="el-icon-edit" style="margin-top:8px;display:inline-block;"  @click="handleCreate" v-permission="['POST /banner']">添加</el-button>
        </div>
        </div>
      </div>
      <span class="search">轮播图标题：</span>
      <el-input
        v-model.trim="listQuery.title"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入轮播图标题"
      />
      <span class="search">轮播图所在页面：</span>
      <el-input
        v-model.trim="listQuery.title"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="轮播图所在页面"
      />
    </div>

    <!-- 查询结果 -->
    <div>
      <div class="tabletop">
        <p class="table-title"><svg-icon icon-class="list2" class-name="card-panel-icon svg"/>数据列表</p>
      </div>
      <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >

      <el-table-column align="center" label="轮播图标题" prop="title" />

      <el-table-column align="center" label="缩略图" prop="coverUrl">
        <template slot-scope="scope">
          <img
            v-if="scope.row.coverUrl"
            :src="scope.row.coverUrl"
            width="80"
            @click="showBigPicture(scope.row.coverUrl)"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" label="所在页面" prop="type">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.type==1 ? 'warning' : 'error' "
          >{{ scope.row.type==1 ? '汽车页面' : '礼品页面' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="目标页面类型" prop="targetType">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.targetType==1" type="success">汽车车型</el-tag>
          <el-tag v-if="scope.row.targetType==2" type="warning">礼品</el-tag>
          <el-tag v-if="scope.row.targetType==3" type="error">活动h5页面</el-tag>
          <el-tag v-if="scope.row.targetType==4" type="error">小程序页面</el-tag>
          <el-tag v-if="scope.row.targetType==5" type="error">跳转到指定tab页</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="对应url" prop="url" sortable />

      <!-- <el-table-column align="center" label="对应id">
        <template slot-scope="scope">
          {{ scope.row|showTargetIdOrH5url }}
          <!-- {{scope.row.targetType==3?scope.row.targetId:scope.row.h5Url}}
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="备注" prop="remark" />

      <el-table-column align="center" label="是否显示" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="2"
            :inactive-value="1"
            active-color="#01bf00"
            inactive-color="#ff4949"
            @change="handleshowswitch(scope.row.id,scope.row.status)"
            v-permission="['PUT /banner/status/{id}']"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleUpdate(scope.row)" v-permission="['PUT /banner/{id}']">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)" v-permission="['DELETE /banner/{id}']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 添加或修改对话框 -->
    <div class="popContainer" v-show="createbox">
      <div class="createbox">
        <div class="tabletop" style="margin-bottom:20px;">
           <h3 class="address">新增轮播图</h3>
        </div>
        <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="轮播图标题" prop="title">
          <el-input v-model="dataForm.title" />
        </el-form-item>

        <el-form-item label="缩略图" prop="coverUrl">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            :before-upload="beforeUpload"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="dataForm.coverUrl" :src="dataForm.coverUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10240kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="所在页面" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio :label="1">首页</el-radio>
            <el-radio :label="2">积分商城</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="目标页面类型" prop="targetType">
          <el-radio-group v-model="dataForm.targetType" style="margin-right:10px;">
            <el-radio :label="1" @change="onRadioChange">汽车</el-radio>
            <el-radio :label="2" @change="onRadioChange">礼品</el-radio>
            <el-radio :label="3" @change="onRadioChange">h5活动页面</el-radio>
            <el-radio :label="4" @change="onRadioChange">小程序页面</el-radio>
            <el-radio :label="5" @change="onRadioChange">跳转到指定tab页</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="dataForm.targetType===1? '对应车型' : (dataForm.targetType===2?'对应礼品':'对应链接')" prop="targetId">
          <el-select
            v-if="dataForm.targetType === 1 || dataForm.targetType === 2"
            v-model="dataForm.targetId"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in candidateTargetList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >{{ item.name }}</el-option>
          </el-select>

          <el-input
            ref="test"
            v-if="dataForm.targetType === 3"
            v-model="dataForm.url"
            placeholder="请输入h5页面链接"
          />
          <el-input
            v-if="dataForm.targetType === 4"
            v-model="dataForm.url"
            placeholder="请输入小程序页面链接"
          />
          <el-radio-group 
            v-if="dataForm.targetType === 5"
            v-model="dataForm.url">
            <el-radio :label="1" :data-id="1">汽车首页</el-radio>
            <el-radio :label="2" :data-id="2" >礼品商城</el-radio>
            <el-radio :label="3" :data-id="3" >我的</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" />
        </el-form-item>

        <el-form-item label="是否显示" prop="status">
           <el-radio v-model="radio" label="1">是</el-radio>
          <el-radio v-model="radio" label="2">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="display:flex;justify-content:flex-end;margin-right:20px;margin-bottom:20px">
        <el-button @click="createbox = false">取消</el-button>
        <el-button @click="createData">确定</el-button>
        <!-- <el-button v-else type="primary" @click="updateData">确定</el-button> -->
      </div>
      </div>
      
    </div>

    
    <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="轮播图标题" prop="title">
          <el-input v-model="dataForm.title" />
        </el-form-item>
        <el-form-item label="轮播图排序" prop="sort">
          <el-input v-model="dataForm.sort" />

          content="数值越小越靠前"

          <el-tooltip class="item" effect="dark" content="数值越小越靠前" placement="top-start">
            <svg-icon icon-class="question-mark" class="icon-question"></svg-icon>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="轮播图url" prop="coverUrl">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            :before-upload="beforeUpload"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="dataForm.coverUrl" :src="dataForm.coverUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10240kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="轮播图所在页面" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio :label="1">首页</el-radio>
            <el-radio :label="2">积分商城</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="轮播图指向" prop="targetType">
          <el-radio-group v-model="dataForm.targetType">
            <el-radio :label="1" @change="onRadioChange">汽车</el-radio>
            <el-radio :label="2" @change="onRadioChange">礼品</el-radio>
            <el-radio :label="3" @change="onRadioChange">h5活动页面</el-radio>
            <el-radio :label="4" @change="onRadioChange">小程序页面</el-radio>
            <el-radio :label="5" @change="onRadioChange">跳转到指定tab页</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="dataForm.targetType===1? '对应车型' : (dataForm.targetType===2?'对应礼品':'对应链接')" prop="targetId">
          <el-select
            v-if="dataForm.targetType === 1 || dataForm.targetType === 2"
            v-model="dataForm.targetId"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in candidateTargetList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >{{ item.name }}</el-option>
          </el-select>

          <el-input
            ref="test"
            v-if="dataForm.targetType === 3"
            v-model="dataForm.url"
            placeholder="请输入h5页面链接"
          />
          <el-input
            v-if="dataForm.targetType === 4"
            v-model="dataForm.url"
            placeholder="请输入小程序页面链接"
          />
          <el-radio-group 
            v-if="dataForm.targetType === 5"
            v-model="dataForm.url">
            <el-radio :label="1" :data-id="1">汽车首页</el-radio>
            <el-radio :label="2" :data-id="2" >礼品商城</el-radio>
            <el-radio :label="3" :data-id="3" >我的</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog> -->

    <div class="popContainer" v-show="updatebox">
      <div class="createbox">
        <div class="tabletop" style="margin-bottom:20px;">
          <h3 class="address">编辑轮播图</h3>
        </div>
        <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="轮播图标题" prop="title">
          <el-input v-model="dataForm.title" />
        </el-form-item>
        <!-- <el-form-item label="轮播图排序" prop="sort">
          <el-input v-model="dataForm.sort" />

           content="数值越小越靠前"

          <el-tooltip class="item" effect="dark" content="数值越小越靠前" placement="top-start">
            <svg-icon icon-class="question-mark" class="icon-question"></svg-icon>
          </el-tooltip>
        </el-form-item>  -->

        <el-form-item label="缩略图" prop="coverUrl">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            :before-upload="beforeUpload"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="dataForm.coverUrl" :src="dataForm.coverUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10240kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="所在页面" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio :label="1">首页</el-radio>
            <el-radio :label="2">积分商城</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="轮播图指向" prop="targetType">
          <el-radio-group v-model="dataForm.targetType" style="margin-right:10px;">
            <el-radio :label="1" @change="onRadioChange">汽车</el-radio>
            <el-radio :label="2" @change="onRadioChange">礼品</el-radio>
            <el-radio :label="3" @change="onRadioChange">h5活动页面</el-radio>
            <el-radio :label="4" @change="onRadioChange">小程序页面</el-radio>
            <el-radio :label="5" @change="onRadioChange">跳转到指定tab页</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="dataForm.targetType===1? '对应车型' : (dataForm.targetType===2?'对应礼品':'对应链接')" prop="targetId">
          <el-select
            v-if="dataForm.targetType === 1 || dataForm.targetType === 2"
            v-model="dataForm.targetId"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in candidateTargetList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >{{ item.name }}</el-option>
          </el-select>

          <el-input
            ref="test"
            v-if="dataForm.targetType === 3"
            v-model="dataForm.url"
            placeholder="请输入h5页面链接"
          />
          <el-input
            v-if="dataForm.targetType === 4"
            v-model="dataForm.url"
            placeholder="请输入小程序页面链接"
          />
          <el-radio-group 
            v-if="dataForm.targetType === 5"
            v-model="dataForm.url">
            <el-radio :label="1" :data-id="1">汽车首页</el-radio>
            <el-radio :label="2" :data-id="2" >礼品商城</el-radio>
            <el-radio :label="3" :data-id="3" >我的</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer"  style="display:flex;justify-content:flex-end;margin-right:20px;margin-bottom:20px">
        <el-button @click="updatebox = false">取消</el-button>
        <el-button  @click="updateData">确定</el-button>
      </div>
      </div>
    </div>

    <el-dialog title="查看大图" :visible.sync="isShowBigPic">
      <img :src="activeUrl" alt  class="img2"/>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon[data-v-bf06ab00]{
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
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
  display: block;
}

.el-form {
  width: 100% !important;
  .el-input {
    width: 50%;
  }
  .icon-question {
      font-size: inherit;
      width: 1.5em;
      height: 1.5em;
      display: inline-block;
      margin-left: 10px;
    }
}
.img2{
  width:686px;
  height:360px;
}
.search{
  font-size:14px;
  color:#909399;
  font-weight:600;
  display:inline-block;
  display:inline-block;
  margin-left:10px;
}
.svg{
  margin-right:5px;
}
.table-title{
  display:inline-block;
  margin-left:10px;
  margin-top:20px;
  color:#555;
  margin-right:75%;
  font-size:15px;
}
.tabletop{
  height:60px;
  width:100%;
  background:#f3f3f3;
  border-top:1px solid #EBEEF5;
  border-left:1px solid #EBEEF5;
  border-right:1px solid #EBEEF5;
}
.popContainer{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.3);
    z-index:1000
}
.createbox{
  background-color:#fff;
  position:fixed;
  top:10%;
  left:35%;
}
.address{
  font-size:18px;
  color:#666;
  margin-left:20px;
  font-weight:600;
}
// 1px dashed #d9d9d9
.avatar-uploader-icon[data-v-471224dc]{
  border:1px dashed #d9d9d9;
  border-radius: 6px;
}
</style>

<script>
import {
  listAd,
  createAd,
  updateAd,
  deleteAd,
  showswitch,
  getGiftsBySimple,
  getCarListBySimple
} from "@/api/lunbotu";
import { uploadPath } from "@/api/storage";
import { getToken } from "@/utils/auth";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "Brand",
  components: { Pagination },
  filters: {
    showTargetIdOrH5url(row) {
      if (row.targetType === 3) {
        return row.h5Url;
      } else {
        return row.targetId;
      }
    }
  },
  data() {
    return {
      radio:"2",
      updatebox:false,
      updata: {},
      uploadPath,
      list: [],
      total: 0,
      createbox:false,
      test:"",
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        name: undefined,
        sort: "add_time",
        order: "desc"
      },
      dataForm: {
        id: "",
        title: "",
        remark: "",
        targetType: "",
        coverUrl: "",
        sort: "",
        targetId: "",
        type: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建"
      },
      rules: {
        name: [
          { required: true, message: "品牌商名称不能为空", trigger: "blur" }
        ]
      },
      downloadLoading: false,

      candidateTargetList: [], // 轮播图指向候选列表
      isShowBigPic: false, // 是否显示大图
      activeUrl: "", // 要查看大图的图片url
      floatingNote: false // 是否显示漂浮注释
    };
  },
  computed: {
    headers() {
      return {
        "Mf-Token": getToken()
      };
    }
  },
  watch: {
    // 实时监听 targetType 的变化，改变相应的列表
    "dataForm.targetType": function(n, o) {
      if (n === 1) {
        // 汽车
        getCarListBySimple().then(data => {
          this.candidateTargetList = data.data.data;
        });
        // 汽车
      } else if (n === 2) {
        // 礼品
        getGiftsBySimple().then(data => {
          this.candidateTargetList = data.data.data;
        });
      } else if (n === 3) {
        // 活动页面
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      listAd(this.listQuery)
        .then(response => {
          this.list = response.data.data.list;
          this.total = response.data.data.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetForm() {
      this.dataForm = {
        id: "",
        title: "",
        remark: "",
        targetType: "",
        coverUrl: "",
        sort: "",
        targetId: "",
        type: ""
      };
    },
    handleCreate() {
      this.resetForm();
      this.createbox = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    uploadPicUrl: function(response) {
      this.dataForm.coverUrl = response.data.url;
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createAd(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data);
              this.getList();
              this.createbox = false;
              this.$notify.success({
                title: "成功",
                message: "创建成功"
              });
            })
            .catch(response => {
              this.$notify.error({
                title: "失败",
                message: response.data.errmsg,
                duration: 0
              });
            });
        }
      });
    },

    handleUpdate(row) {
      // console.log(row);
      console.log(this.dataForm.targetType)
      this.dataForm = Object.assign({}, row);
      this.updatebox = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.updata = {
            id: this.dataForm.id,
            title: this.dataForm.title,
            remark: this.dataForm.remark,
            targetType: this.dataForm.targetType,
            status: this.dataForm.status,
            coverUrl: this.dataForm.coverUrl,
            sort: this.dataForm.sort,
            targetId: this.dataForm.targetId,
            url: this.dataForm.url
          };

          updateAd(this.updata)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v);
                  this.list.splice(index, 1, this.dataForm);
                  break;
                }
              }
              this.updatebox = false;
              this.$notify.success({ 
                title: "成功",
                message: "更新成功"
              });
            })
            .catch(response => {
              this.test=this.$refs.test.value
              this.$notify.error({
                title: "失败",
                message:response.data.errmsg,
                duration: 0
              });
            });
        }
      });
    },
    // 修改状态
    handleshowswitch(id, data) {
      showswitch(id, data)
        .then(response => {
          this.$notify.success({
            title: "成功",
            message: "修改成功"
          });
        })
        .catch(response => {
          this.$notify.error({
            title: "失败",
            message: response.data.message,
            duration: 0
          });
        });
    },
    handleDelete(row) {
      deleteAd(row)
        .then(response => {
          this.getList();
          this.$notify.success({
            title: "成功",
            message: "删除成功"
          });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        })
        .catch(response => {
          this.$notify.error({
            title: "失败",
            message: response.data.message,
            duration: 0
          });
        });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "品牌商ID",
          "品牌商名称",
          "介绍",
          "低价",
          "品牌商图片"
        ];
        const filterVal = ["id", "name", "desc", "floorPrice", "picUrl"];
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          "品牌商信息"
        );
        this.downloadLoading = false;
      });
    },

    // 单选按钮选中事件处理函数，事件参数的值是选中的label的值
    onRadioChange(e) {},

    // 上传之前验证是否是图片
    beforeUpload(file) {
      const extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      const types = ["jpg", "jpeg", "png", "gif"];
      types.includes(extension);
      return types.includes(extension);
    },

    // 点击表格中缩略图查看大图
    showBigPicture(url) {
      this.isShowBigPic = true;
      this.activeUrl = url;
    },

    // 鼠标移入事件
    onMouseEnter() {
      // debugger;
      this.floatingNote = true;
    },

    // 鼠标移出事件
    onMouseOut() {
      this.floatingNote = false;
    },

    // 鼠标在元素上移动事件
    onMouseOver() {
      this.floatingNote = true;
    }
  }
};
</script>
