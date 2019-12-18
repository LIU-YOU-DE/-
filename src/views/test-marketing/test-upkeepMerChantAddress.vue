<template>
  <div class="app-container" style="width:98%;margin:0 auto;">
    <div class="tabletop">
      <p class="address">添加商家</p>
    </div>
    <div style="width:30%;margin:0 auto;">
      <el-form ref="goods"  :model="goods" label-width="150px">
          <el-form-item label="门店名称：" prop="merchantName">
              <el-input v-model="goods.merchantName" style="width:300px;"></el-input>
          </el-form-item>
           <el-form-item label="负责人姓名：" prop="principal">
              <el-input v-model="goods.principal"style="width:300px;"></el-input>
          </el-form-item>
          <el-form-item label="负责人号码：" prop="phoneNumber">
              <el-input v-model="goods.phoneNumber" style="width:300px;" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>
          </el-form-item>
        <el-form-item label="所在城市：" prop="city" class="inputstyle">
          <el-cascader
            style="width:300px;"
            :options="categoryList"
            :props="categoryProps"
            placeholder="请选择所在城市"
            expand-trigger="hover"
            @change="handleCategoryChange"
          />
        </el-form-item>
        <el-form-item label="门店位置：" prop="address">
              <el-input v-model="goods.address"style="width:300px;"></el-input>
          </el-form-item>
      </el-form>
        <div style="text-align:center;">
            <el-button @click="handCreate('goods')">添加</el-button>
        </div>
    </div>
      
  </div>

</template>

<style scoped>
p{
    margin:0;
    padding:0;
}

.address{
  font-size:18px;
  color:#666;
  margin-left:20px;
  font-weight:600;
}
.tabletop{
  height:50px;
  width:100%;
  line-height: 50px;
  background:#f3f3f3;
  margin-bottom:20px;
}

</style>

<script>
import {uploadPath,upkeepMerChantAdd } from '@/api/storage'
import { listCatAndBrand } from '@/api/merchant'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
        categoryProps: {
            label: 'name',
            value: 'id',
            children: 'children',
            expandTrigger: 'hover'
        },
        categoryList: [],
        goods: {
            address:undefined,
            id:undefined,
            city:undefined,
            cityId:undefined,
            merchantName:undefined,
            phoneNumber:undefined,
            principal:undefined
        },

    }
  },
  mounted(){
    listCatAndBrand().then(response => {
        this.categoryList = response.data.data.list
        // this.brandList = response.data.data.brandList;
      })
  },
  computed: {
    headers() {
      return {
        'Mf-Token': getToken()
      }
    }
  },
  methods:{
    handCreate(goods){
        const fileGoods={
            address:this.goods.address,
            city:this.goods.city,
            cityId:this.goods.cityId,
            merchantName:this.goods.merchantName,
            phoneNumber:this.goods.phoneNumber,
            principal:this.goods.principal
        }
        console.log(fileGoods)
        upkeepMerChantAdd(fileGoods).then(response=>{
          this.$router.push({path:'/test-marketing/test-merChartList'})
            this.$notify.success({
                title:"成功",
                message:"添加成功"
            })
        }).catch(response=>{
            this.$notify.error({
                title:"失败",
                message:response.data.errmsg,
                duration:0
            })
        })
    },
    handleCategoryChange(value) {
        this.goods.id = value
        if(this.goods.id.length==1){
             for(var i=0;i<this.categoryList.length;i++){
                if(value==this.categoryList[i].id){
                    this.goods.city=this.categoryList[i].name
                    this.goods.cityId=this.categoryList[i].id
                }
            }
        }else{
            for(var i=0;i<this.categoryList.length;i++){
                if(value[0]==this.categoryList[i].id){
                    for(var j=0;j<this.categoryList[i].children.length;j++){
                        if(value[1]==this.categoryList[i].children[j].id){
                            this.goods.city=this.categoryList[i].children[j].name
                            this.goods.cityId=this.categoryList[i].children[j].id
                        }
                    }
                }
            }
        }
    },
    changeFun(data) {
        this.choosedata = data
    },
  }
}
</script>

