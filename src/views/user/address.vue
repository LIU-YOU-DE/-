<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.memberId" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户ID"/>
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入收货人名称"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" v-permission="['GET /memberAddress']">查找</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload" v-permission="['GET /memberAddress']">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="地址id" prop="id" sortable/>

      <el-table-column align="center" width="100px" label="用户ID" prop="memberId"/>

      <el-table-column align="center" width="100px" label="收货人姓名" prop="name"/>

      <el-table-column align="center" min-width="120px" label="手机号码" prop="phoneNumber"/>

      <el-table-column align="center" min-width="200px" label="省市" prop="address">
      </el-table-column>

      <el-table-column align="center" min-width="300px" label="详细地址" prop="addressInfo"/>

      <el-table-column align="center" min-width="100px" label="是否为默认收货地址" prop="isDefault">
        <template slot-scope="scope">
          {{ scope.row.isDefault==1 ? '是' : '否' }}
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="170px" label="更新时间" prop="updateTime"/>

      <el-table-column align="center" min-width="300px" label="备注" prop="remark"/>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { listAddress } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'UserAddress',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        userId: undefined,
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
      listAddress(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
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
        const tHeader = ['地址ID', '用户ID', '收货人姓名', '手机号', '省市', '详细地址']
        const filterVal = ['id', 'memberId', 'name', 'phoneNumber', 'address', 'addressInfo']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '用户地址信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
