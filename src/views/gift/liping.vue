<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入礼品名称"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" v-permission="['GET /gifts']">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate" v-permission="['POST /gift']">添加</el-button>
      <el-button
        v-permission="['GET /gifts']"
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
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="table-expand">
            <el-form-item label="礼品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="礼品编号">
              <span>{{ props.row.number }}</span>
            </el-form-item>
            <el-form-item label="商品简介">
              <span>{{ props.row.describe }}</span>
            </el-form-item>
            <el-form-item label="图册">
              <img v-for="pic1 in props.row.picture" :key="pic1" :src="pic1" class="gallery" >
            </el-form-item>
            <el-form-item label="当前已卖出">
              <span>{{ props.row.saleQuantity }}</span>
            </el-form-item>
            <el-form-item label="库存数量">
              <span>{{ props.row.stock }}</span>
            </el-form-item>
            <el-form-item label="预警数量">
              <span>{{ props.row.warnStock }}</span>
            </el-form-item>
            <el-form-item label="预扣数量">
              <span>{{ props.row.withhold }}</span>
            </el-form-item>
            <el-form-item label="礼品单位">
              <span>{{ props.row.unit }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column width="100" align="center" label="礼品id" prop="id" />
      <el-table-column min-width="300" align="center" label="礼品名称" prop="name" />
      <el-table-column align="center" label="所属分类" prop="categoryName" >
        <template slot-scope="scope">
          <el-tag
            :type="'success'"
          >{{ scope.row.categoryName }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" property="coverUrl" label="礼品缩略图">
        <template slot-scope="scope">
          <img :src="scope.row.coverUrl" width="40" @click="showDetail(scope.row.detailUrl)" >
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" property="iconUrl" label="分享图">
        <template slot-scope="scope">
          <img :src="scope.row.shareUrl" width="40">
        </template>
      </el-table-column>-->

      <!-- <el-table-column align="center" label="商品详情" prop="detailUrl">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showDetail(scope.row.detailUrl)">查看</el-button>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="兑换所需积分" prop="pricePoint" />
      

      <el-table-column align="center" label="是否推荐" prop="isHot">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isHot === 2 ? 'success' : 'error' "
          >{{ scope.row.isHot === 2 ? '推荐' : '不推荐' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否显示" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-permission="['PUT /gift/status/{id}']"
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="2"
            active-color="#01bf00"
            inactive-color="#ff4949"
            @change="handleshowswitch(scope.row.id,scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column min-width="150" align="center" label="备注" prop="remark" />
      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)" v-permission="['GET /gift/{id}','PUT /gift/{id}']">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)" v-permission="['DELETE /gift/{id}']">删除</el-button>
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

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

    <el-dialog :visible.sync="detailDialogVisible" title="商品详情">
      <img :src="goodsDetail" alt >
    </el-dialog>
  </div>
</template>

<style scoped>
.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 100px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}
.gallery {
  height: 80px;
  margin-right: 10px;
}
</style>

<script>
import { listliping, deleteliping, showswitch } from '@/api/liping'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: { BackToTop, Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        goodsSn: undefined,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      goodsDetail: '',
      detailDialogVisible: false,
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listliping(this.listQuery)
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
    handleCreate() {
      this.$router.push({ path: '/gift/lipingadd' })
    },
    handleUpdate(row) {
      this.$router.push({ path: '/gift/lipingedit', query: { id: row.id }})
    },
    showDetail(detailUrl) {
      this.goodsDetail = detailUrl
      this.detailDialogVisible = true
    },
    handleDelete(row) {
      deleteliping(row)
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '商品ID',
          '商品编号',
          '名称',
          '专柜价格',
          '当前价格',
          '是否新品',
          '是否热品',
          '是否在售',
          '首页主图',
          '宣传图片列表',
          '商品介绍',
          '详细介绍',
          '商品图片',
          '商品单位',
          '关键字',
          '类目ID',
          '品牌商ID'
        ]
        const filterVal = [
          'id',
          'goodsSn',
          'name',
          'counterPrice',
          'retailPrice',
          'isNew',
          'isHot',
          'isOnSale',
          'listPicUrl',
          'gallery',
          'brief',
          'detail',
          'picUrl',
          'goodsUnit',
          'keywords',
          'categoryId',
          'brandId'
        ]
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '商品信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
