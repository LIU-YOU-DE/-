<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-button
        v-permission="['POST /giftCategory']"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
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
      <el-table-column align="center" label="礼品分类表id" prop="id" />

      <el-table-column align="center" label="分类名称" prop="name" />

      <el-table-column align="center" property="iconUrl" label="分类图标url">
        <template slot-scope="scope">
          <img v-if="scope.row.iconUrl" :src="scope.row.iconUrl" width="40" >
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注" prop="remark" />

      <el-table-column align="center" min-width="100" label="排序" prop="sort" />

      <el-table-column align="center" label="级别" prop="parentId">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.parentId == '0' ? 'primary' : 'info' "
          >{{ scope.row.parentId == '0' ? '一级类目' : '二级类目' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否显示" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-permission="['PUT /giftCategory/status/{id}']"
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
          <el-button
            v-permission="['PUT /giftCategory/{id}','GET /giftCategory/{id}']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-permission="['DELETE /giftCategory/{id}']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加 -->
    <el-dialog :visible.sync="dialogFormVisible" title="添加">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="类目名称" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="级别">
          <el-select v-model="jibie">
            <el-option label="一级类目" value="1" />
            <el-option label="二级类目" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="jibie==2" label="父类目" prop="parentId">
          <el-select v-model="dataForm.parentId">
            <el-option v-for="item in catL1" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="类目图标" prop="iconUrl">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadIconUrl"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="dataForm.iconUrl" :src="dataForm.iconUrl" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="dataForm.sort" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog :visible.sync="dialogFormVisible1" title="编辑">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="类目名称" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <!-- <el-form-item label="级别">
          <el-select v-model="jibie">
            <el-option label="一级类目"  value="1" />
            <el-option label="二级类目"  value="2" />
          </el-select>
        </el-form-item>-->
        <el-form-item v-if="dataForm.parentId!=0" label="父类目" prop="parentId">
          <el-select v-model="dataForm.parentId">
            <el-option v-for="item in catL1" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="类目图标" prop="iconUrl">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadIconUrl"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="dataForm.iconUrl" :src="dataForm.iconUrl" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="dataForm.sort" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取消</el-button>
        <!-- <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button> -->
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.filter-item {
  margin-left: 100px;
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
.avatar-uploader-icon[data-v-59b01066]{
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.filter-item[data-v-59b01066]{
  margin-left:0;
}
</style>

<script>
import {
  listCategory,
  listCatL1,
  createCategory,
  updateCategory,
  deleteCategory,
  showswitch
} from '@/api/giftfenlei'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'

export default {
  name: 'Category',
  data() {
    return {
      dialogFormVisible1: false,
      jibie: [1, 2],
      updataid: null,
      uploadPath,
      list: [],
      listLoading: true,
      catL1: {},
      dataForm: {
        id: undefined,
        name: '',
        parentId: 0,
        remark: '',
        iconUrl: '',
        sort: ''
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
    this.getCatL1()
  },
  methods: {
    getList() {
      this.listLoading = true
      listCategory()
        .then(response => {
          this.list = response.data.data.list
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },
    getCatL1() {
      listCatL1().then(response => {
        // console.log(response.data.data);

        this.catL1 = response.data.data
      })
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: '',
        parentId: 0,
        remark: '',
        iconUrl: '',
        sort: ''
      }
    },
    onLevelChange: function(value) {
      if (value === 1) {
        this.jibie == 0
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
    uploadIconUrl: function(response) {
      this.dataForm.iconUrl = response.data.url
    },
    uploadPicUrl: function(response) {
      this.dataForm.picUrl = response.data.url
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        const createup = {
          id: this.dataForm.id,
          name: this.dataForm.name,
          parentId: this.dataForm.parentId,
          remark: this.dataForm.remark,
          iconUrl: this.dataForm.iconUrl,
          sort: this.dataForm.sort
        }
        console.log(createup)

        if (valid) {
          createCategory(createup)
            .then(response => {
              this.getList()
              // 更新L1目录
              this.getCatL1()
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
      this.updataid = row.id
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible1 = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateCategory(this.dataForm, this.updataid)
            .then(() => {
              this.getList()
              // 更新L1目录
              this.getCatL1()
              this.dialogFormVisible1 = false
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
          // 更新L1目录
          this.getCatL1()
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
    }
  }
}
</script>
