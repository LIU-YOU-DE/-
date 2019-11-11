<template>
  <div>
     <el-dialog :visible.sync="attributeVisiable" title="指定车型">
        <el-form
          ref="attributeForm"
          :model="attributeForm"
          status-icon
          label-position="left"
          label-width="100px"
          style="width: 400px; margin-left:50px;"
        >

          <el-input
            v-model="attributeForm.name"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="请输入汽车名称"
            v-on:keyup.enter.native="seachcar"
          />
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="seachcar">查找</el-button>
          <el-table :data="carlist" border highlight-current-row @selection-change="changeFun">
            <el-table-column type="selection" width="55" @selection-change="changeFun"/>
            <el-table-column align="center" label="汽车id" prop="id" />
            <el-table-column align="center" label="汽车名字" prop="name" />
            <el-table-column align="center" property="coverUrl" label="车子封面图片">
              <template slot-scope="scope">
                <img :src="scope.row.coverUrl" width="40" >
              </template>
            </el-table-column>
          </el-table>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="attributeVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleAttributeAdd">确定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
export default {
  methods: {
    handleCancel: function() {
      this.$router.push({ path: '/merchant/merchant' })
    },
    handleEdit: function() {
      for (var i = 0; i < this.cardata.length; i++) {
        this.carid.unshift(this.cardata[i].id)
      }
      const finalGoods = {
        address: this.goods.address,
        carIds: this.carid,
        latitude: this.goods.latitude,
        logoUrl: this.goods.logoUrl,
        longitude: this.goods.longitude,
        mobile: this.goods.mobile,
        name: this.goods.name,
        regionId: this.goods.regionId[this.goods.regionId.length - 1],
        // regionId: this.goods.regionId,
        remark: this.goods.remark,
        status: this.goods.status,
        storeName: this.goods.storeName
      }
      //  console.log(finalGoods);

      createAd(finalGoods)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '添加成功'
          })
          this.$router.push({ path: '/merchant/merchant' })
        })
        .catch(response => {
          MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
    },
  }
}
</script>

<style scoped>

</style>