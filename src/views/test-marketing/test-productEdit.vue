<template>
  <div style="width:95%;margin:0 auto;">
    <div class="tabletop">
      <p class="address">编辑产品信息</p>
    </div>
    <div style="width:70%;margin:0 auto;">
      <el-form ref="goods" :model="goods" label-width="150px">
        <el-form-item label="分类" prop="type" class="inputstyle">
            <el-select v-model="goods.title" placeholder="请选择" @change="handProduct">
              <el-option
                v-for="item in options"
                :key="item.productId"
                :label="item.label"
                :value="item.title">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="pupTitle" class="inputstyle">
            <el-select v-model="goods.pupTitle" placeholder="请选择" @change="handProduct">
                <el-option
                v-for="item in downList"
                :key="item.index"
                :label="item"
                :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="限购数量" prop="limitTimes"class="inputstyle">
          <el-input-number v-model="goods.limitTimes"/>
        </el-form-item>
        <el-form-item label="产品内容" prop="description">
          <template slot-scope="scope">
            <div v-for="(d,index) in goods.content" :key="index" class="inputbox">
              <el-input v-model="d.content" class="inputwidth" type="textarea"></el-input>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="购买须知" prop="description">
          <template slot-scope="scope">
            <div v-for="(d,index) in goods.buyRules" :key="index" class="inputbox">
              <el-input v-model="d.buyRules" class="inputwidth" type="textarea"></el-input>
            </div>
          </template>
        </el-form-item>
      </el-form>
    </div>    
      <div style="display:flex;justify-content:center;margin-top:20px;">
        <el-button style="margin-top:10px;margin-left:20px;" @click="updateActivity">更新</el-button>
      </div>
    </el-form>
  </div>
</template>


<script>
import {getProduct,updateProduct,uploadPath,drawType,handProduct} from "@/api/storage";
import { getToken } from "@/utils/auth";

export default {
  data() {
    return {
        options:[],
        merchantId:undefined,
        productId:undefined,
        goods: {
            cover:[],
            buyRules:'',
            content:'',
            title: "",
            price:'',
            images:[],
            limitTimes:'',
            productId: "",
            title: '',
            upkeepId: "",
      },
      downList:[],
      productList:''
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
      this.getDrawType()
      this.getactivitylist()
  },
  methods: {
    handProduct(event){
      for(var i=0;i<this.options.length;i++){
        if(event==this.options[i].title){
          this.goods.upkeepId=this.options[i].upkeepId
        }
      }
    },
    getDrawType(){
      drawType().then(response=>{
        this.options=response.data.data
      })
    },
      updateActivity(){
        var buyRules=[]
        for(var i=0;i<this.goods.buyRules.length;i++){
          buyRules.push(this.goods.buyRules[i].buyRules)
        }
        var content=[]
        for(var i=0;i<this.goods.content.length;i++){
          content.push(this.goods.content[i].content)
        }
          const dataForm={
            title:this.goods.title,
            buyRules:buyRules,
            content:content,
            upkeepId:this.goods.upkeepId,
            limitTimes:this.goods.limitTimes,
            productId: this.productId,
          }
        updateProduct(dataForm).then(response=>{
            this.$router.push({path:'/test-marketing/test-maintenanceEdit',query:{id:this.merchantId}})
            this.$notify.success({
                title:"成功",
                message:"修改成功"
            })
        })
      },
      handProduct(event){
        for(var i=0;i<this.productList.length;i++){
            if(event==this.productList[i].title){
                this.goods.limitTimes=this.productList[i].limitTimes
                this.goods.buyRules=this.productList[i].buyRules
                this.goods.content=this.productList[i].content
                let tempArr = []
                this.goods.content.forEach(ele => {
                tempArr.push({content: ele})
                })
                this.goods.content = tempArr

                let buyTempArr = []
                this.goods.buyRules.forEach(ele => {
                buyTempArr.push({buyRules: ele})
                })
                this.goods.buyRules = buyTempArr
            }
        }
      },
    getactivitylist() {
      this.goods=this.$route.query.row
      this.merchantId=this.$route.query.id,
      this.productId=this.goods.productId
      if(this.merchantId==undefined){
          return 
      }else{
          const filGoods={
              merchantId:this.merchantId,
              productId:this.productId
          }
          getProduct(filGoods).then(response=>{
              this.productList=response.data.data
              for(var i=0;i<this.productList.length;i++){
                  this.downList.push(this.productList[i].title)
              }
          })
      }
        let tempArr = []
        this.goods.content.forEach(ele => {
          tempArr.push({content: ele})
        })
        this.goods.content = tempArr

        let buyTempArr = []
        this.goods.buyRules.forEach(ele => {
          buyTempArr.push({buyRules: ele})
        })
        this.goods.buyRules = buyTempArr
    },
    changeFun(data) {
      this.choosedata = data;
    }
  }
};
</script>
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
 .svg{
  margin-right:5px;
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

.el-form-item .el-form-item--medium {
  width: 200px;
}
.el-form-item__content {
  margin-left: 0px;
}
.inputicon {
  font-size:25px!important;
  margin-left:10px;
  margin-top:5px;
  color:#888;
}
.inputbox {
  display: flex !important;
  display: inline;
}
.inputwidth {
  width: 500px !important;
  margin-bottom:5px;
}
.inputstyle{
  width:650px!important;
}
</style>