<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container"style="border:1px solid #DCDFE6;margin-bottom:20px;height:115px;">
      <div style="display:flex;justify-content:space-between;padding-right:20px;background-color:#F3F3F3;">
        <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;font-size:15px;"><svg-icon icon-class="search" class-name="card-panel-icon svg" />筛选查找</p>
        <div>
          <el-button v-permission="['GET /roles']" class="filter-item"  style="margin-top:8px;display:inline-block;" icon="el-icon-search" @click="handleFilter">查找</el-button>
        <el-button v-permission="['POST /role']" class="filter-item"  style="margin-top:8px;display:inline-block;" icon="el-icon-edit" @click="createboxshow=true">添加</el-button>
        </div>
      </div>
        <span class="search" style="display:inline-block;margin-left:10px;margin-top:-5px;">请输入角色名称:</span>
        <el-input v-model.trim="listQuery.name" clearable class="filter-item" style="width:200px;margin-top:8px;" placeholder="请输入角色名称"/> 
    </div>

    <!-- 查询结果 -->
    <div>
      <div class="tabletop">
        <p class="table-title"><svg-icon icon-class="list2" class-name="card-panel-icon svg"/>数据列表</p>
      </div>
      <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="角色名称" prop="name" sortable/>

      <el-table-column align="center" label="说明" prop="describe"/>

      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['PUT /role/{id}']" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['DELETE /role/{id}']" type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
          <el-button size="mini" @click="handpermission(scope.row)" v-permission="['GET /permissions','GET /role/{id}']">授权</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 权限配置对话框 -->
    <el-dialog
      title="权限配置"
      :visible.sync="permissbox"
      width="30%"
      >
      <el-tree
        class="perform"
        ref="tree"
        :data="systemPermissions"
        :default-checked-keys="assignedPermissions"
        show-checkbox
        node-key="id"
        highlight-current>
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ data.label }}</span>
          <el-tag v-if="data.api" type="success" size="mini">{{ data.api }}</el-tag>
        </span>
      </el-tree>
        <span slot="footer" class="dialog-footer">
        <el-button @click="permissbox = false">取 消</el-button>
        <el-button @click="updatePermission" v-permission="['POST /permissions']">确 定</el-button>
        </span>
    </el-dialog>
      
      <!-- <div class="perbox">
        <div class="tabletop" style="margin-bottom:20px;margin-bottom:1px solid #EBEEF5">
          <h3 class="address">权限配置</h3>
        </div>
        <el-tree
        class="perform"
        ref="tree"
        :data="systemPermissions"
        :default-checked-keys="assignedPermissions"
        show-checkbox
        node-key="id"
        highlight-current>
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ data.label }}</span>
          <el-tag v-if="data.api" type="success" size="mini">{{ data.api }}</el-tag>
        </span>
      </el-tree>
      <div slot="footer" class="dialog-footer" style="display:flex;justify-content:flex-end;margin-top:20px;padding-right:20px;margin-bottom:20px;">
        <el-button @click="permissionbox = false" style="display:inline-block;">取消</el-button>
        <el-button @click="updatePermission" style="display:inline-block;margin-left:10px;">确定</el-button>
      </div>
      </div> -->


     <!-- 添加角色 -->
    <div class="popContainer" v-show="createboxshow">
      <div class="createbox">
        <div class="tabletop" style="margin-bottom:20px;">
          <h3 class="address">添加角色</h3>
        </div>
        <el-form ref="dataForm" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="dataForm.name" @blur="message($event)"/>
        </el-form-item>
        <el-form-item label="说明" prop="describe">
          <el-input v-model="dataForm.describe"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="display:flex;justify-content:flex-end;padding-right:20px;">
        <el-button @click="createboxshow=false" style="margin-bottom:20px;">取消</el-button>
        <el-button style="margin-left:10px;margin-bottom:20px;" @click="createData" >确定</el-button>
      </div>
      </div>
    </div>

    <div class="popContainer" v-show="updatebox">
      <div class="createbox">
        <div class="tabletop" style="margin-bottom:20px;">
          <h3 class="address">编辑角色</h3>
        </div>
        <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>
        <el-form-item label="说明" prop="describe">
          <el-input v-model="dataForm.describe"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="display:flex;justify-content:flex-end;padding-right:20px;">
        <el-button @click="updatebox = false" style="margin-bottom:20px;">取消</el-button>
        <el-button @click="updateData" style="margin-left:10px;margin-bottom:20px;">确定</el-button>
      </div>
      </div>
    </div>



  </div>
</template>

<script>
import { listRole, createRole, updateRole, deleteRole, getPermission, updatePermission } from '@/api/role'
import Pagination from '@/components/Pagination'
export default {
  name: 'Role',
  components: { Pagination },
  data() {
    return {
      permissbox:false,
      list: null,
      total: 0,
      permissionbox:false,
      updatebox:false,
      createboxshow:false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        sort: 'create_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        name: undefined,
        describe: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      permissionDialogFormVisible: false,
      systemPermissions: null,
      assignedPermissions: null,
      permissionForm: {
        roleId: undefined,
        permissions: []
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handpermission(row){
      this.permissbox=true
      this.permissionbox = true
      this.permissionForm.roleId = row.id
      getPermission(row.id)
        .then(response => {
          this.systemPermissions = response.data.data.systemPermissions
          this.assignedPermissions = response.data.data.assignedPermissions
        })
    },
    message(event){
      if(event==''){
        this.$alert("名称不能为空")
      }
    },
    setMask(){
      this.createboxshow = !this.createboxshow;
    },
    getList() {
      this.listLoading = true
      listRole(this.listQuery)
        .then(response => {
          this.list = response.data.data;
          this.total = response.data.data.length;
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
        name: undefined,
        desc: undefined
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
    createData() {
      console.log(this.dataForm)
          createRole(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data)
              this.createboxshow = false
              this.$notify.success({
                title: '成功',
                message: '添加角色成功'
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
    },
    handleUpdate(row) {
      this.updatebox=true
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
          updateRole(this.dataForm.id,this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
              this.updatebox = false
              this.$notify.success({
                title: '成功',
                message: '更新角色成功'
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
    handleDelete(id) {
      this.handleDelete=true
      deleteRole(id)
        .then(response => {
          this.getList()
          this.$notify.success({
            title: '成功',
            message: '删除角色成功'
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
    handlePermission(row) {
      this.permissionbox = true
      this.permissionForm.roleId = row.id
      getPermission(row.id)
        .then(response => {
          this.systemPermissions = response.data.data.systemPermissions
          this.assignedPermissions = response.data.data.assignedPermissions
        })
    },
    updatePermission() {
      this.permissionForm.permissions = this.$refs.tree.getCheckedKeys(true)
      updatePermission(this.permissionForm)
        .then(response => {
          this.permissbox = false
          this.$notify.success({
            title: '成功',
            message: '授权成功'
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
  }
}
</script>

<style scoped>
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
.popContainer{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.3);
    z-index:10001
}
.createbox{
  position:fixed;
  background:#fff;
  border:1px solid #EBEEF5;
  width:40%;
  top:20%;
  left:30%;
}
.address{
  font-size:18px;
  color:#666;
  margin-left:20px;
  font-weight:600;
}
.perbox{
  width:30%;
  position:fixed;
  background:#fff;
  border:1px solid #EBEEF5;
  top:20%;
  left:30%;
}
.perform{
  margin-left:35%;
  margin-top:10px;
}
</style>
