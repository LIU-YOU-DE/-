<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.memberId"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入会员id"
      />
      <el-input
        v-model.trim="listQuery.mobile"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入手机号"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" v-permission="['GET /members']">查找</el-button>
      <el-button
        v-permission="['GET /members']"
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
      <el-table-column align="center" label="会员id" prop="memberId" sortable />

      <el-table-column align="center" label="昵称" prop="nickname" />

      <el-table-column align="center" label="性别" prop="gender">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.gender==0" type="info">{{genderDic[0]}}</el-tag>
          <el-tag v-if="scope.row.gender==1">{{genderDic[1]}}</el-tag>
          <el-tag v-if="scope.row.gender==2" type="success">{{genderDic[2]}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号" prop="mobile" sortable />

      <el-table-column align="center" label="头像" prop="avatarUrl">
        <template slot-scope="scope">
          <img v-if="scope.row.avatarUrl" :src="scope.row.avatarUrl" width="80" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="账户状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="success">{{statusDic[0]}}</el-tag>
          <el-tag v-if="scope.row.status==2" type="danger">{{statusDic[1]}}</el-tag>
          <el-tag v-if="scope.row.status==3" type="info">{{statusDic[2]}}</el-tag>
          <el-tag v-if="scope.row.status==4" type="waring">{{statusDic[3]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="详情" >
        <template slot-scope="scope">
          <el-button  type="primary" size="mini" @click="handleUpdate(scope.row)" v-permission="['GET /members/{memberId}']">查看详情</el-button>
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

<script>
import { fetchList } from "@/api/user";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "User",
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        memberId: undefined,
        mobile: undefined,
        sort: "add_time",
        order: "desc"
      },
      downloadLoading: false,
      genderDic: ["未知", "男", "女"],
      statusDic: ["可用", "禁用", "注销", "被删除"]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery)
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
    handleUpdate(row) {
      this.$router.push({ path: "/user/userlook", query: { id: row.memberId } });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["会员id","会员昵称", "性别", "手机号", "头像地址", "账户状态"];
        const filterVal = [
          "memberId",
          "nickname",
          "gender",
          "mobile",
          "avatarUrl",
          "status"
        ];
        excel.export_json_to_excel2(tHeader, this.list, filterVal, "用户信息");
        this.downloadLoading = false;
      });
    }
  }
};
</script>
