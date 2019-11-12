<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.username"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入用户名"
      />
      <el-input
        v-model="listQuery.id"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入反馈ID"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button
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
      <el-table-column align="center" label="用户id" prop="memberId" />

      <el-table-column align="center" label="用户浏览记录表id" prop="browseId" />

      <el-table-column align="center" label="浏览的车型id" prop="carId" />

      <el-table-column align="center" label="用户进入页面时间" prop="enterTime" />

      <el-table-column align="center" label="用户离开界面时间" prop="outTime" />

      <el-table-column align="center" label="性别" prop="source">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.source==1" type="error">未处理</el-tag>
          <el-tag v-if="scope.row.source==2" type="error">已处理</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="浏览停留的时间单位秒" prop="residenceTime" />
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
import { listFeedback } from "@/api/user";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "Feedback",
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        username: undefined,
        sort: "out_time",
        order: "desc"
      },
      downloadLoading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      listFeedback(this.listQuery)
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
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "反馈ID",
          "用户名称",
          "反馈内容",
          "反馈图片列表",
          "反馈时间"
        ];
        const filterVal = ["id", "username", "content", "picUrls", "addTime"];
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          "意见反馈信息"
        );
        this.downloadLoading = false;
      });
    }
  }
};
</script>
