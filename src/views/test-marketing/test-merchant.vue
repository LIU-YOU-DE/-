<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container" style="border:1px solid #DCDFE6;margin-bottom:20px;height:115px;">
      <div style="width:100%;height:50px;background-color:#F3F3F3;position:relative;margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;padding-right:20px;">
          <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;font-size:15px;"><svg-icon icon-class="search" class-name="card-panel-icon svg" />筛选查找</p>
        <div>
          <el-button v-permission="['GET /merchants']" class="filter-item" icon="el-icon-search" @click="handleFilter" style="margin-top:8px;display:inline-block;">查找</el-button>
          <el-button class="filter-item" icon="el-icon-edit" @click="handleCreate" v-permission="['POST /merchant']"style="margin-top:8px;display:inline-block;">添加</el-button>
          <el-button class="filter-item" style="margin-top:8px;display:inline-block;" @click="showsearbox">高级检索</el-button>
          
          <!-- <el-button
            v-permission="['GET /members']"
            :loading="downloadLoading"
            icon="el-icon-download"
            @click="handleDownload"
            style="margin-top:8px;"
          >导出</el-button> -->
        </div>
        </div>
      </div>
      <span class="search">门店名称:</span>
      <el-input
        v-model.trim="listQuery.storeName"
        clearable
        class="filter-item"
        style="width: 200px;height:28px;"
        placeholder="请输入门店名称"
      />
      <span class="search" style="margin-left:10px;">负责人:</span>
      <el-input
        v-model.trim="listQuery.name"
        clearable
        maxlength="11"
        class="filter-item"
        style="width: 200px;height:28px;margin-right:10px;"
        placeholder="请输入负责人姓名"
      />
      <span class="search" style="margin-left:10px;">联系电话:</span>
      <el-input
        v-model.trim="listQuery.mobile"
        clearable
        maxlength="11"
        class="filter-item"
        style="width: 200px;height:28px;margin-right:10px;"
        placeholder="请输入手机号"
      />
    </div>

    <!-- 查询结果 -->
    <div class="tabletop" style="margin-top:20px;">
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
      <el-table-column align="center" label="所在城市" prop="regionName" />

      <el-table-column align="center" label="汽车门店" prop="storeName" />

      <el-table-column align="center" label="品牌标志" prop="logoUrl">
        <template slot-scope="scope">
          <img v-if="scope.row.logoUrl" :src="scope.row.logoUrl" width="80" >
        </template>
      </el-table-column>

      <el-table-column align="center" label="负责人" prop="name" />

      <el-table-column align="center" label="联系电话" prop="mobile" />

      <el-table-column align="center" label="门店地址" prop="address" />

      <el-table-column align="center" label="是否合作店" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-permission="['PUT /merchant/status/{id}']"
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="2"
            active-color="#01bf00"
            inactive-color="#ff4949"
            @change="handleshowswitch(scope.row.id,scope.row.status)"
          />
        </template>
      </el-table-column>

      
      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleUpdate(scope.row)" v-permission="['GET /merchant/{id}','PUT /merchant/{id}']">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)" v-permission="['DELETE /merchant/{id}']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

       <!-- 高级检索弹框 -->
      <div class="popContainer" v-show="searchform">
        <div v-show="searchform" class="searbox">
        <div style="width:100%;height:50px;background-color:#F3F3F3;position:relative;margin-bottom:10px;border-bottom:1px solid #C0C4CC;">
          <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;margin-right:75%;">高级检索</p>
        </div>
        <el-form label-position="top" label-width="100" style="margin-left:20px;margin-right:10px;">
            <el-row>
            <el-col :span="12">
              <el-form-item label="门店名称" prop="storeName">
                <el-input v-model="listQuery2.storeName" placeholder="请输入门店名称" style="width:250px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人" prop="name">
                <el-input v-model="listQuery2.name" placeholder="请输入负责人姓名" style="width:250px;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="mobile">
                <el-input v-model="listQuery2.mobile" placeholder="请输入联系电话" style="width:250px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合作状态" prop="status">
                <el-radio v-model="listQuery2.status" label="1">正常合作</el-radio>
                <el-radio v-model="listQuery2.status" label="2">取消合作</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所在城市" prop="regionName">
                <el-input v-model="listQuery2.regionName" placeholder="请输入门店所在城市" style="width:250px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="门店地址" prop="address">
                <el-input v-model="listQuery2.address" placeholder="请输入门店地址" style="width:250px;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="display:flex;justify-content:flex-end;margin-bottom:20px;">
            <el-button @click="searchform = false">取 消</el-button>
            <el-button @click="handlist">确 定</el-button>
          </div>
            
        </el-form>
        <!-- <el-form label-position="top" ref="dataForm" :model="dataForm" label-width="200" class="searchForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户ID" prop="memberId" class="searchboxtitle">
                <el-input style="width:200px;" placeholder="请输入用户ID" v-model="searchForm.id" @input="change($event)"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户昵称" prop="nickname" class="searchboxtitle">
                <el-input placeholder="请输入用户昵称" style="width:200px;" v-model="searchForm.name" @input="change($event)"></el-input>
            </el-form-item>
            </el-col>
          </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户手机号" prop="mobile" maxlength="11" class="searchboxtitle">
                <el-input placeholder="请输入用户手机号" style="width:200px;" maxlength="11" v-model="searchForm.mobile" @input="change($event)"></el-input>
            </el-form-item>
              </el-col>
            </el-row>
        </el-form> -->
          
      </div>
      </div>


    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;margin-right:50px;"
      >
        <el-form-item label="负责人姓名" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="dataForm.mobile" />
        </el-form-item>
        <el-form-item label="汽车id列表" prop="carIds">

          <el-cascader
            v-model="carid"
            :options="options"
            :props="caridprops"
          ></el-cascader>

          <el-select v-model="dataForm.carIds" placeholder="请选择" multiple>
            <el-option v-for="item in options" :key="item.id" :label="item.id" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="商家logo" prop="logoUrl">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadUrl"
            :before-upload="checkFileSize"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="dataForm.logoUrl" :src="dataForm.logoUrl" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1024kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="所在城市" prop="regionId">
          <el-input v-model="dataForm.regionId" />
        </el-form-item>
        <el-form-item label="门店地址" prop="address">
          <el-input v-model="dataForm.address" />
        </el-form-item>
        <el-form-item label="商家门店名称" prop="storeName">
          <el-input v-model="dataForm.storeName" />
        </el-form-item>
        <el-form-item label="商家备注" prop="remark">
          <el-input v-model="dataForm.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
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
.search{
  font-size:14px;
  color:#909399;
  font-weight:600;
  display:inline-block;
  display:inline-block;
  margin-left:10px;
}
.searbox{
  width:600px;
  border:1px solid #C0C4CC;
  background:#fff;
  position:fixed;
  left:40%;
  top:20%;
}
.tabletop{
  border-top:1px solid #DCDFE6;
  border-left:1px solid #DCDFE6;
  border-right:1px solid #DCDFE6;
  height:50px;
  width:100%;
  background-color:#F3F3F3;
  margin-top:20px;
}
.popContainer{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.3);
    z-index:10001
}
</style>

<script>
import {
  listAd,
  createAd,
  updateAd,
  deleteAd,
  showswitch
} from '@/api/merchant'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Ad',
  components: { Pagination },
  data() {
    return {
      redio:'1',
      options: [],
      caridprops: {
        label: 'name',
        value: 'carIds',
        expandTrigger: 'hover'
      },
      carid: [],
      upid: null,
      uploadPath,
      list: [],
      total: 0,
      listLoading: true,
      searchform:false,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        storeName:undefined,
        content: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      listQuery2: {
        page: 1,
        limit: 20,
        address:undefined,
        storeName:undefined,
        regionName:undefined,
        name: undefined,
        mobile:undefined,
        content: undefined,
        status:undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        name: undefined,
        content: undefined,
        url: undefined,
        link: undefined,
        position: 1,
        enabled: true
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [
          { required: true, message: '广告标题不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '广告内容不能为空', trigger: 'blur' }
        ],
        url: [{ required: true, message: '广告链接不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
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
    this.getList()
  },
  methods: {
    //   显示高级检索弹窗
    showsearbox(){
        this.searchform=true
    },
    getList() {
      this.listLoading = true
      listAd(this.listQuery)
        .then(response => {
          // console.log(response);

          this.list = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 高级检索
    handlist() {
      this.listLoading = true
      listAd(this.listQuery2)
        .then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
          this.listQuery2.storeName=undefined
          this.listQuery2.name=undefined
          this.listQuery2.mobile=undefined
          this.listQuery2.regionName=undefined
          this.listQuery2.address=undefined
          this.listQuery2.status=undefined
          this.searchform=false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: undefined,
        content: undefined,
        url: undefined,
        link: undefined,
        position: 1,
        enabled: true
      }
    },
    // handleCreate() {
    //   this.resetForm();
    //   this.dialogStatus = "create";
    //   this.dialogFormVisible = true;
    //   this.$nextTick(() => {
    //     this.$refs["dataForm"].clearValidate();
    //   });
    // },
    uploadUrl: function(response) {
      this.dataForm.logoUrl = response.data.url
    },
    checkFileSize: function(file) {
      if (file.size > 1048576) {
        this.$message.error(
          `${file.name}文件大于1024KB，请选择小于1024KB大小的图片`
        )
        return false
      }
      return true
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createAd(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '创建成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg,
                duration: 0
              })
            })
        }
      })
    },

    handleCreate() {
      this.$router.push({ path: '/test-marketing/test-merchantAdd' })
    },
    handleUpdate(row) {
      // debugger
      this.$router.push({ query: { id: row.id }, path: '/test-marketing/test-merchantEdit' })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        // console.log(this.dataForm, this.upid);

        if (valid) {
          updateAd(this.dataForm, this.upid)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '更新广告成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg,
                duration: 0
              })
            })
        }
      })
    },
    // 修改状态
    handleshowswitch(id, data) {
      showswitch(id, data)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '修改成功'
          })
        })
        .catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg,
            duration: 0
          })
        })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAd(row)
            .then(response => {
              this.getList()
              this.$notify.success({
                title: '成功',
                message: '删除成功'
              })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
        .catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg,
            duration: 0
          })
        })
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消删除'
        });   
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '广告ID',
          '广告标题',
          '广告内容',
          '广告图片',
          '广告位置',
          '活动链接',
          '是否启用'
        ]
        const filterVal = [
          'id',
          'name',
          'content',
          'url',
          'postion',
          'link',
          'enabled'
        ]
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '广告信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
