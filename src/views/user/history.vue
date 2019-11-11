<template>
  <div class="app-container calendar-list-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.memberId"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入用户ID"
      />
      <!-- <el-input
        v-model="listQuery.keyword"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入搜索历史关键字"
      /> -->
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" v-permission="['GET /pointRecords']">查找</el-button>
      <el-button
        v-permission="['GET /pointRecords']"
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
      <el-table-column align="center" width="100px" label="会员id" prop="memberId" />

      <!-- <el-table-column align="center" min-width="100px" label="会员积分变更记录表id" prop="id" /> -->

      <el-table-column align="center" min-width="100px" label="历史总积分" prop="historyCountPoint" />

      <el-table-column align="center" min-width="100px" label="实时积分值" prop="point" />

      <el-table-column align="center" min-width="100px" label="变动原因" prop="reason" />

      <el-table-column align="center" min-width="100px" label="新用户id" prop="targetMemberId" />

      <el-table-column align="center" min-width="100px" label="积分变动值" prop="updatePoint" />

      <el-table-column align="center" min-width="100px" label="更新时间" prop="updateTime" />

      <el-table-column align="center" label="积分是增加还是减少" prop="type">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type==1?'success':(scope.row.type==2?'primary':'warning')"> {{ scope.row.type|showPointsChange }}</el-tag>

          <!-- <el-tag v-if="scope.row.source==1" type="error">新增积分</el-tag>
          <el-tag v-if="scope.row.source==2" type="info">消费积分</el-tag>
          <el-tag v-if="scope.row.source==3" type="success">邀请用户</el-tag> -->
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
import { listHistory } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'History',
  components: { Pagination },
  filters: {
    showPointsChange(status) {
      const statusText = ['新增积分', '消费积分', '邀请用户']
      return statusText[status - 1]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        userId: undefined,
        keyword: undefined,
        sort: 'update_time',
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
      this.listLoading = true
      listHistory(this.listQuery)
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
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户ID', '搜索历史关键字', '添加时间']
        const filterVal = ['userId', 'keyword', 'addTime']
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          '用户搜索历史信息'
        )
        this.downloadLoading = false
      })
    }
  }
}
</script>
