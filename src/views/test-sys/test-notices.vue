<template>
  <div class="app-container">
     <!-- 查询和其他操作 -->
    <div style="border:1px solid #DCDFE6;margin-bottom:20px;height:115px;margin:0 auto;">
      <div style="width:100%;height:50px;background-color:#F3F3F3;position:relative;margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;padding-right:20px;">
                <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;font-size:15px;"><svg-icon icon-class="search" class-name="card-panel-icon svg" />筛选查找</p>           
                <div>
                    <el-button class="filter-item" icon="el-icon-search" @click="handleFilter" v-permission="['GET /notices']">查找</el-button>
                    <el-button @click="handleCreate" style="margin-top:10px;" v-permission="['POST /notice']">添加</el-button>
                </div>
            </div>
        </div>
        <span class="search">用户ID：</span>
        <el-input
        v-model.trim="listQuery.memberId"
        clearable
        class="filter-item"
        style="width: 140px;"
        placeholder="用户id"
      />
      <span class="search">通知标题：</span>
      <el-input
        v-model.trim="listQuery.memberId"
        clearable
        class="filter-item"
        style="width: 140px;"
        placeholder="通知标题"
      />
      <span class="search">通知内容：</span>
      <el-input
        v-model.trim="listQuery.memberId"
        clearable
        class="filter-item"
        style="width: 140px;"
        placeholder="通知内容"
      />
      <span class="search">通知时间：</span>
      <el-date-picker
      style="width:160px;"
      @change="handchange"
      value-format="yyyy-MM-dd HH:mm:ss"
      v-model="listQuery.startDate"
      type="datetime"
      placeholder="选择开始时间">
    </el-date-picker>
    <span>-</span>
    <el-date-picker
      style="width:160px;"
      v-model="listQuery.endDate"
      @change="handchange"
      value-format="yyyy-MM-dd HH:mm:ss"
      type="datetime"
      placeholder="选择结束时间">
    </el-date-picker>
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
      row-key="id"
    >

      <el-table-column width="100" align="center" label="用户id" prop="memberId" />

      <el-table-column align="center" label="通知标题" prop="noticeTitle" />

      <el-table-column align="center" label="通知内容" prop="noticeContent" />

      <el-table-column align="center" label="跳转路径" prop="path" />

      <el-table-column align="center" label="跳转类型" prop="type">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type==1" type="success">不跳转页面</el-tag>
          <el-tag v-if="scope.row.type==2" type="warning">跳转到小程序页面</el-tag>
          <el-tag v-if="scope.row.type==3" type="info">跳转到H5页面</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否显示" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="success">显示</el-tag>
          <el-tag v-if="scope.row.status==2" type="warning">被用户删除</el-tag>
          <el-tag v-if="scope.row.status==3" type="info">被管理员删除</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="通知时间" prop="sendTime" />

      <el-table-column width="100" align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)" v-permission="['DELETE /notice/{id}']">删除</el-button>
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
    <div class="popContainer" v-show="popcontainer">
      <div  class="createbox" v-show="createBox">
        <div class="cartitle">
          <p class="cretitle">添加通知</p>
        </div>
        <el-form ref="dataForm" :model="dataForm" label-width="180px" style="margin-right:30px;">

        <el-form-item label="通知标题" prop="noticeTitle">
          <el-input v-model="dataForm.noticeTitle"/>
        </el-form-item>

        <el-form-item label="通知内容" prop="noticeContent">
          <el-input v-model="dataForm.noticeContent"/>
        </el-form-item>

        <el-form-item label="跳转类型" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio :label="1" @change="showPath=false">不跳转页面</el-radio>
            <el-radio :label="2" @change="showPath=true">跳转到小程序页面</el-radio>
            <el-radio :label="3" @change="showPath=true">跳转到H5页面</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="跳转路径" prop="path" v-if="showPath">
          <el-input v-model="dataForm.path"></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer" style="display:flex;justify-content:flex-end;margin-right:20px;margin-bottom:20px;">
        <el-button @click="removecrebox">取消</el-button>
        <el-button  @click="createData">确定</el-button>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.createbox{
  position:fixed;
  top:20%;
  left:30%;
  background:#fff;
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
.cartitle{
    background-color:#F3F3F3;
    height:50px;
    width:100%;
    margin-bottom:20px;
}
.table-title{
  display:inline-block;
  margin-left:10px;
  margin-top:20px;
  color:#555;
  margin-right:75%;
  font-size:18px;
}
.table-title{
  display:inline-block;
  margin-left:10px;
  margin-top:20px;
  color:#555;
  margin-right:75%;
  font-size:15px;
}
.cretitle{
  display:inline-block;
  margin-left:10px;
  margin-top:20px;
  color:#555;
  margin-right:75%;
  font-size:18px;
  font-weight: 600;
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
.search{
  font-size:14px;
  color:#909399;
  font-weight:600;
  display:inline-block;
  display:inline-block;
  margin-left:10px;
}
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
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { getToken } from '@/utils/auth'

export default {
  components: { Pagination },
  name: 'Category',
  data() {
    return {
      showPath: false,
      createBox:false,
      popcontainer:false,
      total: 0,
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
        order: "desc",
        endDate:'',
        endDate:'',
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
      time:"",
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
    handchange(val){
      console.log(val)
    },
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
          this.total = response.data.data.total;
          this.list = response.data.data.list
          console.log(this.list)
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
    removecrebox(){
      this.createBox = false
      this.popcontainer=false
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.createBox = true
      this.popcontainer=true
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
          this.createBox = false
          this.popcontainer=false
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
