<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.memberId"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入会员ID"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" v-permission="['GET /loginRecords']">查找</el-button>
      <el-button
        v-permission="['GET /loginRecords']"
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
      <el-table-column align="center" width="100px" label="会员id" prop="memberId" sortable />

      <el-table-column align="center" min-width="100px" label="城市编码" prop="lastLoginAdcode" />

      <el-table-column align="center" min-width="100px" label="IP地址" prop="lastLoginIp" />

      <el-table-column align="center" min-width="100px" label="登录地点" prop="lastLoginLocation" />

      <el-table-column align="center" min-width="100px" label="登录时间" prop="lastLoginTime" />

      <el-table-column align="center" label="用户来源" prop="source">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.source==1" type="success">微信小程序</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="备注" prop="remark" />
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

<script>
import { listLoginRecord } from "@/api/user";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "listLoginRecord",

  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        userId: undefined,
        goodsId: undefined,
        sort: 'last_login_time',
        order: 'desc'
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true;
      listLoginRecord(this.listQuery)
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
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["会员ID", "IP地址", "登录地点", "登录时间", "用户来源", "备注"];
        const filterVal = ["memberId", "lastLoginIp", "lastLoginLocation", "lastLoginTime", "source", "remark"];

        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          "用户登录记录表"
        );
        this.downloadLoading = false;
      });
    }
  }
}
</script>
