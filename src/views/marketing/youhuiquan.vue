<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.id"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入id"
      />
      <el-button
        v-permission="['GET /coupons']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate" v-permission="['POST /coupon']">添加</el-button>
      <el-button
        v-permission="['GET /coupons']"
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
      <el-table-column align="center" label="优惠券id" prop="id" sortable />

      <el-table-column align="center" label="面值" prop="faceValue">
        <template slot-scope="scope">{{ scope.row.faceValue?scope.row.faceValue:'无' }}</template>
      </el-table-column>

      <el-table-column align="center" label="优惠券价格" prop="price" />

      <el-table-column align="center" label="优惠券内容" prop="next" />

      <el-table-column align="center" label="优惠券状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="success">正常</el-tag>
          <!-- <el-tag v-if="scope.row.status==2" type="warning">过期</el-tag> -->
          <el-tag v-if="scope.row.status==3" type="error">下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="适用范围" prop="type">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.type==1 ? 'warning' : 'error' "
          >{{ scope.row.type==1 ? '全部通用' : '指定车辆' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="优惠券种类" prop="kind	">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.kind	==1 ? 'warning' : 'error' "
          >{{ scope.row.kind ==1 ? '购车补贴' : '服务券' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否显示" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-permission="['PUT /coupon/status/{id}']"
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="3"
            active-color="#01bf00"
            inactive-color="#ff4949"
            @change="handleshowswitch(scope.row.id,scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" prop="sort" />
      <!-- <el-table-column align="center" label="到期时间" prop="expireTime" /> -->
      <el-table-column align="center" label="添加时间" prop="createTime" />
      <el-table-column align="center" label="更新时间" prop="updateTime" />
      <el-table-column align="center" label="备注" prop="remark" />
      <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)" v-permission="['GET /coupon/{id}']">编辑</el-button>
          <!-- <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button> -->
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
} from "@/api/youhuiquan";
import { uploadPath } from "@/api/storage";
import { getToken } from "@/utils/auth";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "Brand",
  components: { Pagination },
  data() {
    return {
      updata: {},
      uploadPath,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        name: undefined,
        sort: "create_time",
        order: "desc"
      },
      dataForm: {
        id: "",
        title: "",
        remark: "",
        targetType: "",
        coverUrl: "",
        sort: "",
        targetId: "",
        type: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建"
      },
      rules: {
        name: [
          { required: true, message: "品牌商名称不能为空", trigger: "blur" }
        ]
      },
      downloadLoading: false
    };
  },
  computed: {
    headers() {
      return {
        "Mf-Token": getToken()
      };
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      listAd(this.listQuery)
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
    handleCreate() {
      this.$router.push({ path: "/marketing/youhuiquanadd" });
    },
    handleUpdate(row) {
      this.$router.push({
        path: "/marketing/youhuiquanedit",
        query: { id: row.id }
      });
    },
    uploadPicUrl: function(response) {
      this.dataForm.coverUrl = response.data.url;
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
    // handleDelete(row) {
    //   deleteAd(row)
    //     .then(response => {
    //       this.getList();
    //       this.$notify.success({
    //         title: "成功",
    //         message: "删除成功"
    //       });
    //       const index = this.list.indexOf(row);
    //       this.list.splice(index, 1);
    //     })
    //     .catch(response => {
    //       this.$notify.error({
    //         title: "失败",
    //         message: response.data.errmsg
    //       });
    //     });
    // },
    __handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "品牌商ID",
          "品牌商名称",
          "介绍",
          "低价",
          "品牌商图片"
        ];
        const filterVal = ["id", "name", "desc", "floorPrice", "picUrl"];
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          "品牌商信息"
        );
        this.downloadLoading = false;
      });
    },

    // ToDo 导出表格
    handleDownload() {
      // this.downloadLoading = true
      const { THeader, TDataField, TTitle } = this.$route.meta;

      this.$Export2Excel(THeader, this.list, TDataField, TTitle);
    }
  }
};
</script>
