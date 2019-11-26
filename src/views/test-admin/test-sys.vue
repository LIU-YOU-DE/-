<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container" style="border:1px solid #DCDFE6;margin-bottom:20px;height:115px;">
      <div style="display:flex;justify-content:space-between;padding-right:20px;background-color:#F3F3F3;">
        <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;font-size:15px;"><svg-icon icon-class="search" class-name="card-panel-icon svg" />筛选查找</p>
        <div>
          <el-button v-permission="['GET /admin']" class="filter-item" icon="el-icon-search" @click="handleFilter" style="margin-top:8px;display:inline-block;">查找</el-button>
          <el-button v-permission="['POST /admin']" class="filter-item" icon="el-icon-edit" @click="dialogFormVisible=true" style="margin-top:8px;display:inline-block;">添加</el-button>
        </div>
      </div>
      <div style="margin-top:10px;">
        <span class="search" style="display:inline-block;margin-left:10px;margin-top:-5px;">管理员名称:</span>
        <el-input v-model.trim="listQuery.username" clearable class="filter-item" style="width:200px;margin-top:5px;" placeholder="请输入管理员名称"/>
      </div>
    </div>

    <div>
      <div class="tabletop">
      <p class="table-title"><svg-icon icon-class="list2" class-name="card-panel-icon svg"/>数据列表</p>
      </div>
      <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="管理员ID" prop="id" sortable/>

      <el-table-column align="center" label="管理员名称" prop="username"/>

      <el-table-column align="center" label="管理员头像" prop="avatar">
        <template slot-scope="scope">
          <img v-if="scope.row.avatar" :src="scope.row.avatar" width="40">
        </template>
      </el-table-column>

      <el-table-column align="center" label="管理员角色" prop="roleIds">
        <template slot-scope="scope">
          <el-tag v-for="role in scope.row.roles"  :key="1" type="primary" style="margin-right: 20px;"> {{ formatRole(role.id) }} </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['GET /admin/{id}','PUT /admin/{id}']" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['DELETE /admin/{id}']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />


<!-- 编辑管理员信息 -->
    <div class="popContainer" v-show="updatebox">
      <div class="createbox">
        <div class="tabletop" style="margin-bottom:20px;">
           <h3 class="address">编辑管理员</h3>
        </div>
        <el-form ref="updatedataForm" :model="updatedataForm" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="管理员名称" prop="username">
          <el-input v-model="updatedataForm.username"/>
        </el-form-item>
        <el-form-item label="管理员密码" prop="password">
          <el-input v-model="updatedataForm.password" auto-complete="off" show-password/>
        </el-form-item>
        <el-form-item label="管理员头像" prop="avatar">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadAvatar"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="updatedataForm.avatar" :src="updatedataForm.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="管理员角色" prop="roleIds">
          <el-select v-model="updatedataForm.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="display:flex;justify-content:flex-end;padding-right:20px;margin-bottom:20px">
        <el-button @click="updatebox = false">取消</el-button>
        <el-button @click="updateData" style="margin-left:10px;">确定</el-button>
      </div>
      </div>
    </div>

    <!-- 添加管理员 -->
    <div class="popContainer" v-show="dialogFormVisible">
      <div class="createbox">
        <div class="tabletop" style="margin-bottom:20px;">
           <h3 class="address">添加管理员</h3>
        </div>
        <el-form ref="dataForm" :model="dataForm" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="管理员名称" prop="username">
          <el-input v-model="dataForm.username"/>
        </el-form-item>
        <el-form-item label="管理员密码" prop="password">
          <el-input v-model="dataForm.password" auto-complete="off" show-password/>
        </el-form-item>
        <el-form-item label="管理员头像" prop="avatar">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadAvatar"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.avatar" :src="dataForm.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="管理员角色" prop="roleIds">
          <el-select v-model="dataForm.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="display:flex;justify-content:flex-end;padding-right:20px;margin-bottom:20px">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button @click="createData" style="margin-left:10px;">确定</el-button>
      </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
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
.avatar-uploader-icon[data-v-bbbefb3a]{
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.el-button+.el-button{
  margin-left:0;
}
.search{
  font-size:14px;
  color:#909399;
  font-weight:600;
  display:inline-block;
  display:inline-block;
  margin-left:10px;
}
.tabletop{
  height:60px;
  width:100%;
  background:#f3f3f3;
  border-top:1px solid #EBEEF5;
  border-left:1px solid #EBEEF5;
  border-right:1px solid #EBEEF5;
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

.popContainer{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.3);
    z-index:1000;
}
.createbox{
  position:fixed;
  background:#fff;
  border:1px solid #EBEEF5;
  width:40%;
  top:20%;
  left:30%;
}
.tabletop{
  height:60px;
  width:100%;
  background:#f3f3f3;
  border-bottom:1px solid #EBEEF5;
}
.address{
  font-size:18px;
  color:#666;
  margin-left:20px;
  font-weight:600;
}
.avatar-uploader-icon[data-v-e4964176]{
  border:1px dashed #d9d9d9;
  border-radius:6px;
}
</style>

<script>
import { listAdmin, createAdmin, updateAdmin, deleteAdmin } from '@/api/admin'
import {listRole} from '@/api/role'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Admin',
  components: { Pagination },
  data() {
    return {
      uploadPath,
      updatebox:false,
      list: null,
      total: 0,
      roleOptions: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        username: undefined,
        sort: 'create_time',
        order: 'desc'
      },
      updatedataForm: {
        id: undefined,
        username: undefined,
        password: undefined,
        avatar: undefined,
        roleIds: []
      },
      dataForm: {
        id: undefined,
        username: undefined,
        password: undefined,
        avatar: undefined,
        roleIds: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
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
    listRole().then(response => {
      this.roleOptions = response.data.data;
    })
  },
  methods: {
    formatRole(roleId) {
      for (let i = 0; i < this.roleOptions.length; i++) {
        if (roleId === this.roleOptions[i].id) {
          return this.roleOptions[i].name
        }
      }
      return ''
    },
    getList() {
      this.listLoading = true
      listAdmin(this.listQuery)
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
        username: undefined,
        password: undefined,
        avatar: undefined,
        roleIds: []
      }
    },
    uploadAvatar: function(response) {
      this.dataForm.avatar = response.data.url
    },
    handleCreate() {
      this.resetForm()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createAdmin(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '添加管理员成功'
              })
              this.getList();
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
      this.updatedataForm = row
      this.updatebox = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['updatedataForm'].validate(valid => {
        if (valid) {
          updateAdmin(this.updatedataForm.id,this.updatedataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.updatedataForm.id) {
                  const index = this.list.indexOf(v)
                  console.log(this.list)
                  this.list.splice(index, 1, this.updatedataForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '更新管理员成功'
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
    handleDelete(row) {
      deleteAdmin(row)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '删除管理员成功'
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
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['管理员ID', '管理员名称', '管理员头像']
        const filterVal = ['id', 'username', 'avatar']
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          '管理员信息'
        )
        this.downloadLoading = false
      })
    }
  }
}
</script>
