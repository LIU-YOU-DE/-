<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入名字"
      />
      <el-button
        v-permission="['GET /merchants']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate" v-permission="['POST /merchant']">添加</el-button>
      <el-button
        v-permission="['GET /merchants']"
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
    >
      <el-table-column align="center" label="商家id" prop="id" sortable />

      <el-table-column align="center" label="负责人姓名" prop="name" />

      <el-table-column align="center" label="联系电话" prop="mobile" />
      <el-table-column align="center" label="商家logo" prop="logoUrl">
        <template slot-scope="scope">
          <img v-if="scope.row.logoUrl" :src="scope.row.logoUrl" width="80" >
        </template>
      </el-table-column>

      <el-table-column align="center" label="商家门店名称" prop="storeName" />

      <el-table-column align="center" label="门店地址" prop="address" />

      <el-table-column align="center" label="所在城市" prop="regionName" />
      <el-table-column align="center" label="备注" prop="remark" />

      <el-table-column align="center" label="合作状态" prop="status">
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
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)" v-permission="['PUT /merchant/{id}','GET /merchant/{id}']">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)" v-permission="['DELETE /merchant/{id}']">删除</el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="负责人姓名" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="dataForm.mobile" />
        </el-form-item>
        <el-form-item label="汽车id列表" prop="carIds">
          <!-- <el-cascader
            v-model="carid"
            :options="options"
            :props="caridprops"
          ></el-cascader>-->
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
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        content: undefined,
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
      this.$router.push({ path: '/goods/merchantAdd' })
    },
    handleUpdate(row) {
      // debugger
      this.$router.push({ query: { id: row.id }, path: '/goods/merchantEdit' })
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
