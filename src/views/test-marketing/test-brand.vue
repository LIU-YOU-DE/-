<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container" style="border:1px solid #DCDFE6;margin-bottom:20px;height:115px;">
      <div style="width:100%;height:50px;background-color:#F3F3F3;position:relative;margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;padding-right:20px;">
          <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;font-size:15px;"><svg-icon icon-class="search" class-name="card-panel-icon svg" />筛选查找</p>
        <div>
          <el-button v-permission="['GET /brandsAndCarTypes','GET /brands']" class="filter-item" icon="el-icon-search" @click="handleFilter" style="margin-top:8px;display:inline-block;">查找</el-button>
          <el-button class="filter-item" icon="el-icon-edit" @click="handleCreate" v-permission="['POST /brand']"style="margin-top:8px;display:inline-block;">添加</el-button>
        </div>
        </div>
        <span class="search">品牌商名称：</span>
        <el-input
        v-model.trim="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入品牌商名称"
      />
      </div>
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

      <el-table-column align="center" label="品牌名称" prop="name" />

      <el-table-column align="center" property="logoUrl" label="品牌图片">
        <template slot-scope="scope">
          <img v-if="scope.row.logoUrl" :src="scope.row.logoUrl" width="80" >
        </template>
      </el-table-column>

      <el-table-column align="center" label="品牌字母" prop="wordBegin" />

      <el-table-column align="center" label="添加时间" prop="addTime" />

      <!-- <el-table-column align="center" label="修改时间" prop="updateTime" />
      <el-table-column align="center" label="排序" prop="sort" />
      <el-table-column align="center" label="备注" prop="remark" />
      <el-table-column align="center" label="是否显示" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-permission="['PUT /brand/status/{id}']"
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="2"
            active-color="#01bf00"
            inactive-color="#ff4949"
            @change="handleshowswitch(scope.row.id,scope.row.status)"
          />
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-permission="['PUT /brand/{id}']"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-permission="['DELETE /brand/{id}']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>

        <el-form-item label="品牌图片" prop="logoUrl">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="updateLogoUrl" :src="updateLogoUrl" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="dataForm.remark" />
        </el-form-item>
        <!-- <el-form-item label="品牌首字母" prop="wordBegin">
          <el-input v-model="dataForm.wordBegin" />
        </el-form-item> -->
        <!-- <el-form-item label="排序" prop="sort">
          <el-input v-model="dataForm.sort" type="number" />
        </el-form-item> -->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.avatar-uploader-icon[data-v-15f59074]{
  border:1px dashed #d9d9d9;
  border-radius: 6px;
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
.table-title{
  display:inline-block;
  margin-left:10px;
  margin-top:20px;
  color:#555;
  margin-right:75%;
  font-size:15px;
}
.svg{
  margin-right:5px;
}
.search{
  font-size:14px;
  color:#909399;
  font-weight:600;
  display:inline-block;
  display:inline-block;
  margin-left:10px;
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
.avatar-uploader-icon[data-v-5a133864]{
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
</style>

<script>
import { listBrand, createBrand, updateBrand, deleteBrand, showswitch } from '@/api/brand'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Brand',
  components: { Pagination },
  data() {
    return {
      updata: {},
      uploadPath,
      list: [],
      total: 0,
      logoEditUrl:'',
      listLoading: true,
      updateLogoUrl:"",
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        name: '',
        remark: '',
        wordBegin: '',
        logoUrl:undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑品牌',
        create: '添加品牌'
      },
      rules: {
        name: [
          { required: true, message: '品牌商名称不能为空', trigger: 'blur' }
        ]
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
    getList() {
      this.listLoading = true
      listBrand(this.listQuery)
        .then(response => {
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
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: '',
        remark: '',
        wordBegin: undefined,
        logoUrl: undefined,
        wordBegin: ''
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    uploadPicUrl: function(response) {
      this.dataForm.logoUrl=response.data.url
      this.logoEditUrl = response.data.url
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createBrand(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data)
              this.getList()
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
    handleUpdate(row) {
       this.updateLogoUrl=row.logoUrl
      this.dataForm = Object.assign({}, row)

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.updata = {
            id: this.dataForm.id,
            name: this.dataForm.name,
            remark: this.dataForm.remark,
            wordBegin: this.dataForm.wordBegin,
            logoUrl: this.dataForm.logoUrl,
            sort: this.dataForm.sort
          }
          updateBrand(this.updata)
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
                message: '更新成功'
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
        }).then(()=>{
          deleteBrand(row)
            .then(response => {
              this.$notify.success({
                title:"成功",
                message:"删除成功"
              })
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
            }).cathch(response=>{
              this.$notify.error({
                title:"失败",
                message:response.data.errmsg,
                duration:0
              })
            })
        })
      // deleteBrand(row)
      //   .then(response => {
      //     const index = this.list.indexOf(row)
      //     this.list.splice(index, 1)
      //   })
      //   .catch(response => {
      //     this.$notify.error({
      //       title: '失败',
      //       message: response.data.errmsg,
      //       duration: 0
      //     })
      //   })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '品牌商ID',
          '品牌商名称',
          '介绍',
          '低价',
          '品牌商图片'
        ]
        const filterVal = ['id', 'name', 'desc', 'floorPrice', 'picUrl']
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          '品牌商信息'
        )
        this.downloadLoading = false
      })
    }
  }
}
</script>
