<template>
<div class="app-container">
    <div style="border:1px solid #DCDFE6;margin-bottom:20px;height:115px;margin:0 auto;">
        <div style="width:100%;height:50px;background-color:#F3F3F3;position:relative;margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;padding-right:20px;">
                <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;font-size:15px;"><svg-icon icon-class="search" class-name="card-panel-icon svg" />筛选查找</p>           
                <div>
                    <el-button class="filter-item" icon="el-icon-search" @click="seachprize" v-permission="['GET /gifts/short','GET /gifts']">查找</el-button>
                    <el-button @click="pushPrizeBox" style="margin-top:10px;" v-permission="['POST /gift']">添加</el-button>
                    <el-button @click="searchBox" style="margin-top:10px;">高级检索</el-button>
                </div>
            </div>
        </div>
        <span class="search">礼品名称：</span>
        <el-input 
            v-model.trim="listQuery.giftName"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="请输入礼品名称"
            v-on:keyup.enter.native="seachprize"></el-input>
        <span class="search">所属分类：</span>
             <el-cascader
                v-model="categoryIds"
                :options="categoryList"
                :props="categoryProps"
                expand-trigger="hover"
                @change="handleChange"></el-cascader>
        <span class="search">积分兑换区间值：</span>
        <el-input 
            v-model.trim="listQuery.minPoint"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="请输入数值"
            onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
            v-on:keyup.enter.native="seachprize"></el-input>
            <span>-</span>
            <el-input 
            v-model.trim="listQuery.maxPoint"
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="请输入数值"
            onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
            v-on:keyup.enter.native="seachprize"></el-input>
    </div>

        <div class="tabletop" style="margin-top:20px;">
            <p class="table-title"><svg-icon icon-class="list2" class-name="card-panel-icon svg"/>数据列表</p>
        </div>
            <el-table 
                :data="list" 
                border
                fit
                highlight-current-row>
        <el-table-column align="center" label="礼品编号" prop="number"></el-table-column>
        <el-table-column align="center" label="所属分类" prop="categoryName"></el-table-column>
        <el-table-column align="center" label="礼品名称" prop="name"></el-table-column>
        <el-table-column align="center" label="礼品缩略图" prop="coverUrl">
                <template  slot-scope="scope">
                    <img :src="scope.row.coverUrl" v-if="scope.row.coverUrl" style="width:50px;">
                </template>
        </el-table-column>
        <el-table-column align="center" label="兑换积分" prop="pricePoint"></el-table-column>
        <el-table-column align="center" label="已兑换数量" prop="saleQuantity"></el-table-column>
        <el-table-column align="center" label="库存数量" prop="stock"></el-table-column>
        <el-table-column align="center" label="预警数量" prop="warnStock"></el-table-column>
        <el-table-column align="center" label="标签" prop="prizeId"></el-table-column>
        <el-table-column align="center" label="备注" prop="remark"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
                <el-button size="mini" @click="handleUpdate(scope.row)" v-permission="['PUT /gift/{id}','GET /gift/{id}']">编辑</el-button>
                 <el-button type="danger" size="mini" @click="handDeletePrize(scope.row)"v-permission="['DELETE /gift/{id}']">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 高级检索框 -->
    <div class="popContainer" v-show="popcontainer">
        <div v-show="searchbox" class="searbox">
        <div style="width:100%;height:50px;background-color:#F3F3F3;position:relative;margin-bottom:10px;border-bottom:1px solid #C0C4CC;">
          <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;margin-right:75%;">高级检索</p>
        </div>
        <el-form label-position="top" ref="searchForm" :model="searchForm" label-width="200" class="searchForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="礼品名称" prop="memberId" class="searchboxtitle">
                <el-input style="width:200px;margin-right:30px;" placeholder="请输入礼品名称" v-model="listQuery2.giftName" @input="change($event)"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="分类级别" prop="nickname" class="searchboxtitle">
                <el-cascader
                    v-model="searchCategoryIds"
                    :options="categoryList"
                    :props="categoryProps"
                    expand-trigger="hover"
                    @change="handleChange2"></el-cascader>
            </el-form-item>
            </el-col>
          </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否热门" prop="mobile" maxlength="11" class="searchboxtitle">
                    <el-radio-group v-model="listQuery2.isHot">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item label="积分兑换区间值" class="searchboxtitle">
                        <el-input 
                        style="width:95px;" 
                        v-model.trim="listQuery2.minPoint" 
                        onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                        ></el-input>
                            <span>-</span>
                        <el-input 
                        style="width:95px;" 
                        v-model.trim="listQuery2.maxPoint"  
                        onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                        ></el-input>
              </el-form-item>
              </el-col>
            </el-row>
        </el-form>
        <div style="display:flex;justify-content:flex-end;">
            <el-button @click="searchBox2" class="btn">取 消</el-button>
            <el-button @click="seachprize2" class="btn" style="margin-right:20px;">确 定</el-button>
        </div>
          
      </div>
    </div>
    
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
import { getGiftList,pushPrize,uploadPath ,updateprize,deleteprize,getprize,getgiftlist} from '@/api/storage'
import { deleteliping,listCatAndBrand} from '@/api/liping'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
    components: {Pagination },
    data(){
        return {
            uploadPath,
            list:[],
            galleryFileList:[],
            searchCategoryIds:[],
            categoryIds:[],
            categoryList:[],
            counter:[{}],
            giftlist:{},
            childrenlist:{},
            firstname:"",
            twoname:"",
            total: 0,
            value:[],
            ishsow:false,
            createbox:false,
            num:0,
            searchbox:false,
            popcontainer:false,
            dialogVisible: false,
            dialogVisible2: false,
            showdeletebutton:false,
            modalOFF:1,
            labelPosition:"right",
            name:"",
            prizeId:null,
            imgUrl:"",
            searchForm:{
                page: 1,
                limit: 20,
                memberId:"",
                nickname:"",
                mobile:"",
                birthday:"",
                regday:"",
                sort: "add_time",
                order: "desc"
            },
            goods:{
                description:[],
                imgUrl:'',
                prizeName:'',
                remark:''
            },
            attributeForm: { prizeName: '', description: '', imgUrl: '' },
            listQuery: {
                page: 1,
                limit: 10,
                giftName: undefined,
                sort: "add_time",
                order: "desc",
                giftCategroy:undefined,
                isHot:undefined,
                maxPoint:undefined,
                minPoint:undefined

            },
            listQuery2: {
                page: 1,
                limit: 10,
                giftName: undefined,
                sort: "add_time",
                order: "desc",
                giftCategroy:undefined,
                isHot:undefined,
                maxPoint:undefined,
                minPoint:undefined

            },
            categoryProps: {
                label: 'name',
                value: 'id',
                children: 'children',
                expandTrigger: 'hover'
            },
            dataup: [],
            dataForm:{
                description:'',
                imgUrl:'',
                prizeName:'',
                remark:''
            },
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
        this.getList()
        this.handgetgigtlist()
        this.giftCat()
    },
    methods:{
        handleChange2(value) {
             this.listQuery2.giftCategroy=value[1]
            },
         handleChange(value) {
             this.listQuery.giftCategroy=value[1]
            },
        giftCat(){
            listCatAndBrand().then(response=>{
                this.categoryList=response.data.data.list
            })
        },
        searchBox(){
            this.searchbox=true;
            this.popcontainer=true;
        },
        searchBox2(){
            this.searchbox=false;
            this.popcontainer=false;
        },
        updatecss(index){
            this.num=index
        },
        gettwoname(name){
            this.twoname=name.name
        },
        getgiftname(name){
            this.firstname=name.name
            this.childrenlist=name.children
        },
        handgetgigtlist(){
            getgiftlist().then(response=>{
                this.giftlist=response.data.data.list
            })
        },
        updatedeleteinput(index) {
        this.dataForm.description.splice(index, 1);
        if (this.dataForm.description.length == 1) {
        this.showdeletebutton = false;
      }
    },
    updateinputadd() {
      this.dataForm.description.push({});
      if (this.dataForm.description.length >= 0) {
        this.showdeletebutton = true;
      }
    },
       deleteinput(index){
      this.counter.splice(index, 1);
      this.goods.description.splice(index,1);
      if(this.counter.length==1){
        this.showdeletebutton=false
      }
    },
    inputadd(){
      this.counter.push({})
      if(this.counter.length>=0){
        this.showdeletebutton=true
      }
    },
        // 查找礼品
        seachprize(){
          getGiftList(this.listQuery).then(response=>{
              this.list=response.data.data.list
          })
      },
      seachprize2(){
           getGiftList(this.listQuery2).then(response=>{
               this.list=response.data.data.list
               this.searchbox=false
               this.listQuery2.giftName=undefined
               this.listQuery2.minPoint=undefined
               this.listQuery2.maxPoint=undefined
               this.popcontainer=false
           })
      },
        handDeletePrize(row){
            deleteliping(row.id).then(response=>{
                this.$notify.success({
                    title:"成功",
                    message:"删除成功"
                })
                this.getList()
            }).catch(response=>{
                this.$notify.error({
                    title:"失败",
                    message:response.data.errmsg,
                    duration:0
                })
            })
        },
        // 编辑礼品
        handleUpdate(row){
           this.$router.push({ path: '/test-marketing/prizeedit', query: { id: row.id,row:row}})
        },
        handUpdatePrize(){
            const prizeForm={
                prizeId:this.dataForm.prizeId,
                imgUrl:this.dataForm.imgUrl,
                description:[],
                prizeName:this.dataForm.prizeName,
                remark:this.dataForm.remark,
            }
            for(var i=0;i<this.dataForm.description.length;i++){
                prizeForm.description[i]=this.dataForm.description[i].description
            }
            updateprize(this.dataForm.prizeId,prizeForm).then(response=>{
                this.$notify.success({
                    title:"成功",
                    message:"更新成功",
                })
                this.getList()
                this.dialogVisible2=false
            }).catch(response=>{
                this.$notify.error({
                    title:"失败",
                    message:respose.data.errmsg,
                    duration:0
                })
            })
        },
        updateuploadPicUrl:function(response){
            this.dataForm.imgUrl=response.data.url
        },
        uploadPicUrl:function(response){
            this.goods.imgUrl = response.data.url
        },
        pushPrizeBox(){
            this.$router.push({path:'/test-marketing/test-prizeadd',query:{ row:this.giftlist}})
            this.createbox=!this.createbox
        },
        // 添加奖品
        pushPrize(){
            const finalGoods={
                description:this.goods.description,
                imgUrl:this.goods.imgUrl,
                prizeName:this.goods.prizeName,
                remark:this.goods.remark
            }
            pushPrize(finalGoods).then(response=>{
                this.$notify.success({
                    title:'成功',
                    message:'礼品添加成功'
                })
                this.getList()
                this.createbox=false
            }).catch(response=>{
                    this.$notify.error({
                        title:'失败',
                         message: response.data.errmsg,
                        duration: 0
                    })
                    this.dialogVisible=true
                })
        },
        // 获取奖品列表
        getList(){
            getGiftList(this.listQuery).then(response=>{
                this.list=response.data.data.list
                this.total = response.data.data.total
            }).catch(response=>{
                this.$notify.error({
                        title:'获取失败',
                        message: response.data.errmsg,
                        duration: 0
                    })
            })
        },
    }
}
</script>>
<style scoped>
.search{
  font-size:14px;
  color:#909399;
  font-weight:600;
  display:inline-block;
  display:inline-block;
  margin-left:10px;
}

.svg{
  margin-right:5px;
}
.text{
    display: inline-block;
    border-top: 4px solid;
    border-right: 4px solid;
    width:30px;
    height: 30px;
    border-color: #999999;
    transform: rotate(45deg);
    position:absolute;
    top:22px;
    left:21px;

}
.xian{
    width:40px;
    height:5px;
    background:#999;
    display: inline-block;
    position:absolute;
    top:34px;
    left:12px;
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
  background-color:#F3F3F3;
  margin-top:20px;
}
.searchForm{
  margin:0 50px;
}
.createbox{
  background-color:#fff;
  position:fixed;
  left:35%;
}
.table-title{
  display:inline-block;
  margin-left:10px;
  margin-top:20px;
  color:#555;
  margin-right:75%;
  font-size:15px;
}
.prizeinp{
    width:80%!important;
}
.btn{
    display: inline-block;
    margin-bottom:20px;
}
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
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
.avatar-uploader-icon[data-v-0309833f]{
    border: 1px dashed #20a0ff;
    border-radius: 6px;
}
.avatar[data-v-0309833f]{
    border: 1px dashed #20a0ff;
    border-radius: 6px;
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
.inputwidth{
  width:700px!important;
  margin-bottom:5px;
}
.inputstyle{
  width:850px!important;
}
.prizedesc{
    margin-top:5px; 
}
.firstbox{
    width:250px;
    margin-left:20px;
    margin-right:20px;
    margin-bottom:20px; 
    border-radius: 6px;
    border:1px solid #E4E4E4;
}
.twobox{
    width:250px;
    margin-left:20px;
    margin-right:20px;
    margin-bottom:20px; 
    border-radius: 6px;
    border:1px solid #E4E4E4;
}
.firstboxtitle{
    font-size:16px;
    margin-left:20px;
    color:#999999;
}
p{
    padding:0;
    margin:0;
}
.firstlist{
    height:40px;
    padding-left:20px;
    line-height: 40px;
    font-size:15px;
    color:#999999;
    display: flex;
    justify-content: space-between;
    border-bottom:1px solid #E4E4E4;
}
.test{
    height:40px;
    padding-left:20px;
    line-height: 40px;
    font-size:15px;
    color:#999999;
    display: flex;
    background-color:#F2F2F2;
    justify-content: space-between;
    border-bottom:1px solid #E4E4E4;
}
.one{
    width:40px;
    height: 40px;
    border-radius: 50%;
    line-height:40px;
    text-align: center;
    color:#fff;
    font-size:30px;
    background-color:#1ABC9C;
}
.one-a{
    width:40px;
    height: 40px;
    border-radius: 50%;
    line-height:40px;
    text-align: center;
    color:#CCCCCC;
    font-size:30px;
    border:1px solid #E4E4E4;
}
.giftfenlei{
    display:flex;
    justify-content:space-between;
    font-size:16px;
    color:#1ABC9C;
    margin-top:10px;
}
.one-d{
    width:250px;
    height:0;
    border-bottom:1px dashed #1ABC9C;
    margin-top:20px;
}
.content{
    width:80px;
    height:80px;
    border-radius: 50%;
    border:3px solid #999999;
    position: absolute;;
    top:50%;
    left:43%;
}
.searbox{
    position: fixed;
    top:10%;
    left:40%;
    background-color:#fff;
}
.popContainer{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.3);
    z-index:1000
}
</style>