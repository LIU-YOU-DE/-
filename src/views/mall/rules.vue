<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-button
        v-permission="['GET /rules']"
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
      <el-table-column align="center" label="活动规则id" prop="id" sortable />

      <el-table-column align="center" label="用户购买优惠券后奖励多少积分" prop="finishOrderRewardPoint" />

      <el-table-column align="center" label="礼品活动规则图片地址" prop="giftRulePicture">
        <template slot-scope="scope">
          <img v-if="scope.row.giftRulePicture" :src="scope.row.giftRulePicture" width="80" @click="showgiftRulePicture(scope.row.giftRulePicture)">
        </template>
      </el-table-column>

      <el-table-column align="center" label="汽车活动规则图片地址" prop="carRulePicture">
        <template slot-scope="scope">
          <img v-if="scope.row.carRulePicture" :src="scope.row.carRulePicture" width="80" @click="showcarRulePicture(scope.row.carRulePicture)" >
        </template>
      </el-table-column>

      <el-table-column align="center" label="新用户注册奖励多少积分" prop="registerRewardPoint" />

      <el-table-column align="center" label="用户成功转发一次(有新用户登录)奖励多少积分" prop="shareRewardPoint" />

      <el-table-column align="center" label="备注" prop="remark" />

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)" v-permission="['GET /rule/{id}']">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 礼品活动规则大图 -->
     <el-dialog title="礼品活动规则详情" :visible.sync="dialogVisible" align="center">
        <img :src="goodsdetail" alt="">
      </el-dialog>

    <el-dialog title="汽车活动规则详情" :visible.sync="dialogVisible" align="center">
        <img :src="goodsdetail" alt="">
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
import { listAd, createAd, updateAd, deleteAd, showswitch } from '@/api/rules'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Brand',
  components: { Pagination },
  data() {
    return {
      notice: [],
      ruleContent: [],
      updata: {},
      uploadPath,
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        name: undefined,
        sort: 'update_time',
        order: 'desc'
      },
      dataForm: {
        carRulePicture: '',
        finishOrderRewardPoint: null,
        remark: '',
        giftRulePicture: '',
        notice: [],
        ruleContent: [],
        shareRewardPoint: null,
        registerRewardPoint: null
      },
      dialogFormVisible: false,
      goodsdetail:"",
      dialogVisible:false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
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
    showcarRulePicture(detail){
      this.goodsdetail=detail
      this.dialogVisible=true
    },
    showgiftRulePicture(detail){
      this.goodsdetail=detail
      this.dialogVisible=true
    },
    getList() {
      this.listLoading = true
      listAd(this.listQuery)
        .then(response => {
          // console.log(response);
          this.notice = response.data.data.notice
          this.ruleContent = response.data.data.ruleContent
          this.list = response.data.data
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
        id: '',
        title: '',
        remark: '',
        targetType: '',
        coverUrl: '',
        sort: '',
        targetId: '',
        type: ''
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
      this.dataForm.carRulePicture = response.data.url
    },
    uploadPicUrl1: function(response) {
      this.dataForm.giftRulePicture = response.data.url
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createAd(this.dataForm)
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
      this.$router.push({ query: { id: row.id }, path: '/mall/rulesedit' })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.updata = {
            id: this.dataForm.id,
            title: this.dataForm.title,
            remark: this.dataForm.remark,
            targetType: this.dataForm.targetType,
            status: this.dataForm.status,
            coverUrl: this.dataForm.coverUrl,
            sort: this.dataForm.sort,
            targetId: this.dataForm.targetId
          }

          updateAd(this.updata)
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
