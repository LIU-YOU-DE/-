<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.memberId"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入用户id"
      />
      <el-button
        v-permission="['GET /notices']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
      <el-button
        v-permission="['POST /notice']"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
      <el-button
        v-permission="['GET /notices']"
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>
    </div>
    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
      row-key="id"
    >
      <el-table-column width="100" align="center" label="消息id" prop="id" />

      <el-table-column width="100" align="center" label="用户id" prop="memberId" />

      <el-table-column align="center" label="通知标题" prop="noticeTitle" />

      <el-table-column align="center" label="通知内容" prop="noticeContent" />

      <el-table-column align="center" label="要跳转的路径" prop="path" />

      <el-table-column align="center" label="管理员发送此通知时间" prop="sendTime" />

      <el-table-column align="center" label="用户账户状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="success">显示</el-tag>
          <el-tag v-if="scope.row.status==2" type="warning">被用户删除</el-tag>
          <el-tag v-if="scope.row.status==3" type="info">被管理员删除</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="跳转类型" prop="type">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type==1" type="success">不跳转页面</el-tag>
          <el-tag v-if="scope.row.type==2" type="warning">跳转到小程序页面</el-tag>
          <el-tag v-if="scope.row.type==3" type="info">跳转到H5页面</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="100" align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)" v-permission="['DELETE /notice/{id}']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="dataForm" label-width="180px">
        <el-form-item label="请输入用户id">
          <el-select v-model="dataForm.memberId" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.memberId"
              :label="item.memberId + item.nickname"
              :value="item.memberId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="通知内容" prop="noticeContent">
          <el-input v-model="dataForm.noticeContent"/>
        </el-form-item>

        <el-form-item label="通知标题" prop="noticeTitle">
          <el-input v-model="dataForm.noticeTitle"/>
        </el-form-item>

        <el-form-item label="预留字段" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio :label="1" @change="showPath=false">不跳转页面</el-radio>
            <el-radio :label="2" @change="showPath=true">跳转到小程序页面</el-radio>
            <el-radio :label="3" @change="showPath=true">跳转到H5页面</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="要跳转的路径" prop="path" v-if="showPath">
          <el-input v-model="dataForm.path"></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.filter-item {
  margin-left: 5px;
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
</style>

<script>
import {
  listCategory,
  listCatL1,
  createCategory,
  updateCategory,
  deleteCategory
} from '@/api/notices'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'

export default {
  name: 'Category',
  data() {
    return {
      showPath: false,
      options: [],
      uploadPath,
      list: [],
      listLoading: true,
      downloadLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        memberId: undefined,
        sort: "id",
        order: "desc"
      },
      catL1: {},
      dataForm: {
        id: undefined,
        memberId: undefined,
        noticeContent: '',
        noticeTitle: '',
        path: '',
        sendTime: '',
        type: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [{ required: true, message: '类目名不能为空', trigger: 'blur' }]
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
    this.getList()
  },
  methods: {
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '消息ID',
          '用户ID',
          '通知标题',
          '通知内容',
          '要跳转的路径',
          '管理员发送时间',
          '用户账户状态',
          '跳转类型'
        ]
        const filterVal = [
          'id',
          'memberId',
          'noticeTitle',
          'noticeContent',
          'path',
          'sendTime',
          'status',
          'type'
        ]
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '系统通知')
        this.downloadLoading = false
      })
    },
    getList() {
      this.listLoading = true;
      listCategory(this.listQuery)
        .then(response => {
          this.list = response.data.data.list
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })

      listCatL1().then(response => {
        //  console.log(response);
        this.options = response.data.data
      })
    },
    handleFilter() {
      this.getList();
    },
    resetForm() {
      this.dataForm = {
        memberId: undefined,
        noticeContent: '',
        noticeTitle: '',
        path: '',
        sendTime: '',
        type: undefined
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
      // console.log(this.dataForm);

      createCategory(this.dataForm)
        .then(response => {
          this.getList()
          // 更新L1目录
          this.dialogFormVisible = false
          this.getCatL1()

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
    },
    handleUpdate(row) {
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
          updateCategory(this.dataForm)
            .then(() => {
              this.getList()
              // 更新L1目录
              this.getCatL1()
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
    handleDelete(row) {
      deleteCategory(row.id)
        .then(response => {
          this.getList()
          this.$notify.success({
            title: '成功',
            message: '删除成功'
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
