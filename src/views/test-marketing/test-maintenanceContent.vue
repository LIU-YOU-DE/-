<template>
  <div style="width:95%;margin:0 auto;">
    <div class="tabletop" style="margin-top:20px;display:flex;position:relative;">
      <p class="table-title"><svg-icon icon-class="list2" class-name="card-panel-icon svg"/>数据列表</p>
      <div style="position:absolute;right:10px;">
        <el-button icon="el-icon-edit" style="margin-top:8px;display:inline-block;" @click="dialogVisible = true">添加</el-button>
      </div>
    </div>
    <el-table :data="list" border fit>
      <el-table-column align="center" label="分类" prop="type">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type==1">保养专区</el-tag>
          <el-tag v-if="scope.row.type==2">洗车专区</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标题" prop="pupTitle"/>
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <el-switch
            @change="handUpdateStatus(scope.row.productId,scope.row.status)"
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="2"
            active-color="#01bf00"
            inactive-color="#ff4949"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="可购买数量" prop="limitTimes"/>
      <el-table-column align="center" label="操作" prop="limitTimes">
        <template slot-scope="scope">
          <el-button size="mini" @click="handUpdateProduct(scope.row)">编辑</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 添加养车产品 -->
    <el-dialog
      title="添加养车产品"
      :visible.sync="dialogVisible">
      <el-form ref="goods"  :model="goods" label-width="150px">
          <el-form-item label="分类专区" prop="upkeepId" class="inputstyle">
            <el-select v-model="goods.title" placeholder="请选择" @change="handProductDraw">
              <el-option
                v-for="item in options"
                :key="item.productId"
                :label="item.label"
                :value="item.title">
              </el-option>
              </el-select>
            </el-form-item>
        <el-form-item label="产品名称" prop="pupTitle" class="inputstyle">
            <el-input v-model="goods.pupTitle" class="titlebinput"></el-input>
        </el-form-item>
        <el-form-item label="用户可购买次数" prop="limitTimes" class="inputstyle">
            <el-input-number v-model="goods.limitTimes"></el-input-number>
        </el-form-item>
        <el-form-item label="产品内容" prop="contentList">
          <template slot-scope="scope">
            <div v-for="(d,index) in counter" :key="index" class="inputbox">
                <el-input v-model="goods.contentList[index]" class="inputwidth" type="textarea"></el-input>
                <i class="el-icon-circle-plus-outline inputicon" @click="inputadd"></i>
                <i class="el-icon-remove-outline inputicon" @click="deleteinput(index)" v-if="showdeletebutton"></i>
            </div>
          </template>
        </el-form-item>

        <el-form-item label="购买须知" prop="buyRulesList">
          <template slot-scope="scope">
            <div v-for="(d,index) in buyCounter" :key="index" class="inputbox">
                <el-input v-model="goods.buyRulesList[index]" class="inputwidth" type="textarea"></el-input>
                <i class="el-icon-circle-plus-outline inputicon" @click="buyInputadd"></i>
                <i class="el-icon-remove-outline inputicon" @click="buyDeleteinput(index)" v-if="showBuyDeleteButton"></i>
            </div>
          </template>
        </el-form-item>

        <el-form-item label="预览产品内容" prop="buyRulesList">
          <p v-for="item in goods.contentList" class="list">{{item}}</p>
        </el-form-item>
        <el-form-item label="预览购买须知" prop="buyRulesList">
          <p v-for="item in goods.buyRulesList" class="list">{{item}}</p>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handCreate('goods')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑养车产品 -->
    <el-dialog  
      title="编辑养车产品"
      :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" model="dataForm" label-width="150px">
        <el-form-item label="分类专区" prop="upkeepId" class="inputstyle">
          <el-select v-model="dataForm.title" placeholder="请选择" @change="updateHandProductDraw">
            <el-option
              v-for="item in options"
              :key="item.productId"
              :label="item.label"
              :value="item.title">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="pupTitle" class="inputstyle">
            <el-input v-model="dataForm.pupTitle" class="titlebinput"></el-input>
        </el-form-item>

        <el-form-item label="用户可购买次数" prop="limitTimes" class="inputstyle">
            <el-input-number v-model="dataForm.limitTimes"></el-input-number>
        </el-form-item>

        <el-form-item label="产品内容" prop="contentList">
          <template slot-scope="scope">
            <div v-for="(d,index) in dataForm.content" :key="index" class="inputbox">
                <el-input v-model="d.content" class="inputwidth" type="textarea"></el-input>
                <i class="el-icon-circle-plus-outline inputicon" @click="contentInputadd"></i>
                <i class="el-icon-remove-outline inputicon" @click="ContentDeleteinput(index)" v-if="showContentdeletebutton"></i>
            </div>
          </template>
        </el-form-item>

        <el-form-item label="购买须知" prop="contentList">
          <template slot-scope="scope">
            <div v-for="(d,index) in dataForm.buyRules" :key="index" class="inputbox">
                <el-input v-model="d.buyRules" class="inputwidth" type="textarea"></el-input>
                <i class="el-icon-circle-plus-outline inputicon" @click="buyRulesAdd"></i>
                <i class="el-icon-remove-outline inputicon" @click="buyRulesDeleteinput(index)" v-if="buyShowContentdeletebutton"></i>
            </div>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handUpdateProductList">确 定</el-button>
      </span>  
    </el-dialog>

  </div>
</template>

<style scoped>
.table-title{
  display:inline-block;
  margin-left:10px;
  margin-top:20px;
  color:#555;
  margin-right:75%;
  font-size:15px;
}
.tabletop{
  border-top:1px solid #DCDFE6;
  border-left:1px solid #DCDFE6;
  border-right:1px solid #DCDFE6;
  height:50px;
  width:100%;
  margin:0 auto;
  background-color:#F3F3F3;
  margin-top:20px;
}
p{
    margin:0;
    padding:0;
}
.list{
    font-size:14px;
    color:#666;
}
.address{
  font-size:18px;
  color:#666;
  margin-left:20px;
  font-weight:600;
}


.input-new-keyword {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.inputicon{
  font-size:25px!important;
  margin-left:10px;
  margin-top:5px;
  color:#888;
}
.inputbox{
  display:flex!important;
  display: inline;
}
.titlebinput{
  width:500px!important;
}
.inputwidth{
  width:500px!important;
  margin-bottom:5px;
}
.inputstyle{
  width:850px!important;
}
</style>

<script>
import {uploadPath ,upkeepList,handProduct,drawType,getProductList,updateStatus,updateProduct} from '@/api/storage'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
        list:[],
        buyShowContentdeletebutton:false,
        showContentdeletebutton:false,
        dialogFormVisible:false,
        dialogVisible:false,
        value:'',
        options: [],
        showBuyDeleteButton:false,
        showdeletebutton:false,
        categoryProps: {
          label: 'name',
          value: 'id',
          children: 'children',
          expandTrigger: 'hover'
        },
        content:[{}],
        buyRules:[{}],
        counter:[{}],
        buyCounter:[{}],
        categoryList: [],
        goods: {
            buyRulesList:[],
            name:undefined,
            title:undefined,
            limitTimes:undefined,
            contentList:[],
            upkeepId:undefined,
        },
        dataForm:{
          content:'',
          buyRules:''
        }
    }
  },
  computed: {
    headers() {
      return {
        'Mf-Token': getToken()
      }
    }
  },
  created(){
    this.getlist()
    this.getDrawType()
  },
  methods:{
    handUpdateProductList(){
      var buyRules=[]
        for(var i=0;i<this.dataForm.buyRules.length;i++){
          buyRules.push(this.dataForm.buyRules[i].buyRules)
        }
        var content=[]
        for(var i=0;i<this.dataForm.content.length;i++){
          content.push(this.dataForm.content[i].content)
        }
          const fileGoods={
            buyRules:buyRules,
            content:content,
            pupTitle:this.dataForm.pupTitle,
            upkeepId:this.dataForm.upkeepId,
            limitTimes:this.dataForm.limitTimes,
            productId: this.dataForm.productId,
          }
        updateProduct(fileGoods).then(response=>{
            this.dialogFormVisible=false
            this.getlist()
            this.$notify.success({
                title:"成功",
                message:"修改成功"
            })
        })
    },
    // 编辑产品购买须知
    buyRulesDeleteinput(index){
      this.dataForm.buyRules.splice(index, 1);
      if (this.dataForm.buyRules.length == 1) {
        this.buyShowContentdeletebutton = false;
      }
    },
    buyRulesAdd() {
      this.dataForm.buyRules.push({});
      if (this.dataForm.buyRules.length >= 0) {
        this.buyShowContentdeletebutton = true;
      }
    },
    // 编辑产品内容
    ContentDeleteinput(index){
      this.dataForm.content.splice(index, 1);
      if (this.dataForm.content.length == 1) {
        this.showContentdeletebutton = false;
      }
    },
    contentInputadd() {
      this.dataForm.content.push({});
      if (this.dataForm.content.length >= 0) {
        this.showContentdeletebutton = true;
      }
    },
    handUpdateProduct(row){
      this.dialogFormVisible=true
      this.dataForm=row
      if (this.dataForm.content.length > 1) {
        this.showContentdeletebutton = true;
      }
      
      if (this.dataForm.buyRules.length > 1) {
        this.buyShowContentdeletebutton = true;
      }

      let tempArr=[]
      this.dataForm.content.forEach(ele => {
        tempArr.push({content: ele})
      })
      this.dataForm.content=tempArr
      let buyTemArr=[]
      this.dataForm.buyRules.forEach(ele => {
        buyTemArr.push({buyRules: ele})
      })
      this.dataForm.buyRules=buyTemArr
    },
    handUpdateStatus(productId,status){
      const dataForm={
        productId:productId,
        status:status
      }
      updateStatus(dataForm).then(response=>{
        this.getlist()
        this.$notify.success({
          title:"成功",
          message:"状态修改成功"
        })
      })
    },
    getlist(){
      getProductList().then(response=>{
        this.list=response.data.data
      })
    },
    updateHandProductDraw(event){
      for(var i=0;i<this.options.length;i++){
        if(event==this.options[i].title){
          this.dataForm.upkeepId=this.options[i].upkeepId
        }
      }
    },
    handProductDraw(event){
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
    handCreate(goods){
        const fileGoods={
            buyRulesList:this.goods.buyRulesList,
            name:this.goods.name,
            limitTimes:this.goods.limitTimes,
            title:this.goods.title,
            contentList:this.goods.contentList,
            upkeepId:this.goods.upkeepId
        }
        handProduct(fileGoods).then(response=>{
            this.$refs[goods].resetFields()
            this.dialogVisible=false
            this.getlist()
            this.$notify.success({
                title:"成功",
                message:"添加成功"
            })
        }).catch(response=>{
            this.$$notify.error({
                title:"失败",
                message:response.data.errmsg,
                duration:0
            })
        })
    },
    handleCategoryChange(value) {
        this.goods.id = value
    },
    buyDeleteinput(index){
      this.buyCounter.splice(index, 1);
      this.goods.buyRulesList.splice(index,1);
      if(this.buyCounter.length==1){
        this.showBuyDeleteButton=false
      }
    },
    deleteinput(index){
      this.content.splice(index, 1);
      this.dataForm.contentList.splice(index,1);
      if(this.content.length==1){
        this.showdeletebutton=false
      }
    },
    buyInputadd(){
      this.buyCounter.push({})
      if(this.buyCounter.length>=0){
        this.showBuyDeleteButton=true
      }
    },
    updateInputadd() {
      this.content.push({});
      if (this.dataForm.content.length >= 0) {
        this.showdeletebutton = true;
      }
    },
    inputadd(){
      this.counter.push({})
      if(this.counter.length>=0){
        this.showdeletebutton=true
      }
    },

    uploadPicUrl:function(response){
        this.goods.imgUrl = response.data.url
    },
    changeFun(data) {
        this.choosedata = data
    },
  }
}
</script>

