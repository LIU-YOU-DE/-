<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.question"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入问题"
      />
      <el-button
        v-permission="['GET GET /comment']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
      <el-button
        v-permission="['GET /comment']"
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
      <el-table-column align="center" width="100px" label="问题ID" prop="id" sortable />

      <el-table-column align="center" label="问题" min-width="120" prop="requestContent" />

      <el-table-column align="center" label="回复" min-width="200" prop="replyContent" />

      <el-table-column width="120" align="center" label="排序数值(越小越靠前)" prop="sort" />
      <el-table-column width="120" align="center" label="是否显示" prop="status">
        <template slot-scope="scope">
            <el-switch
              v-permission="['PUT /comment/status/{id}']"
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="2"
              active-color="#01bf00"
              inactive-color="#ff4949"
              @change="handleshowswitch(scope.row.id,scope.row.status)"
            ></el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" width="160" label="提问时间" prop="requestTime" />

      <el-table-column align="center" label="备注" prop="remark" />

      <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /admin/issue/update']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-permission="['DELETE /commnet/{id}']"
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
        <el-form-item label="问题" prop="requestContent">
          <el-input v-model="dataForm.requestContent" />
        </el-form-item>
        <el-form-item label="回复" prop="replyContent">
          <el-input v-model="dataForm.replyContent" :rows="8" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" :rows="8" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="排序数值" prop="sort">
          <el-input v-model="dataForm.sort" :rows="8" type="number" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData">更新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listIssue,
  createIssue,
  updateIssue,
  deleteIssue,
  showswitch
} from "@/api/issue";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "Issue",
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        question: undefined,
        sort: "add_time",
        order: "desc"
      },
      dataForm: {
        requestContent: "",
        replyContent: "",
        remark: "",
        sort: ""
      },
      dataup: [],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建"
      },
      rules: {
        question: [
          { required: true, message: "问题不能为空", trigger: "blur" }
        ],
        answer: [{ required: true, message: "回复不能为空", trigger: "blur" }]
      },
      downloadLoading: false,
      showbutton: true
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      listIssue(this.listQuery)
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
        id: undefined,
        requestContent: "",
        replyContent: "",
        remark: ""
      };
    },
    handleCreate() {
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.dataup = {
        remark: row.remark,
        requestContent: row.requestContent,
        replyContent: row.replyContent,
        sort: row.sort
      };
      this.dataForm = Object.assign({}, row);
      // debugger;
      // console.log(this.dataup, this.dataForm);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        // console.log(this.dataup, this.dataForm.id);
        console.log(this.dataForm);
        if (valid) {
          updateIssue(this.dataForm.id, this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v);
                  this.list.splice(index, 1, this.dataForm);
                  break;
                }
              }
              this.dialogFormVisible = false;
              this.$notify.success({
                title: "成功",
                message: "更新成功"
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
            message: response.data.errmsg,
            duration: 0
          });
        });
    },
    handleDelete(row) {
      deleteIssue(row.id)
        .then(response => {
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
            message: response.data.errmsg,
            duration: 0
          });
        });
    },
    // 下载
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["问题ID", "问题内容", "问题回复", "提问时间", "备注"];
        const filterVal = ["id", "requestContent", "replyContent", "requestTime", "remark"];
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          "问答表"
        );
        this.downloadLoading = false;
      });
    }
  }
};
</script>
