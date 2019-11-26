<template>
    <div>
        <div class="filter-container" style="margin-left:8.8%;margin-top:20px;">
            <el-button class="filter-item addbtn" icon="el-icon-edit" @click="showAddCarTypeDialog">添加车型</el-button>
        </div>

        <!-- 查询结果 -->
        <div class="tabletop">
            <p class="table-title"><svg-icon icon-class="list2" class-name="card-panel-icon svg"/>数据列表</p>
        </div>
        <el-table
        style="width:80%;margin:0 auto;"
            :data="list"
            element-loading-text="正在查询中。。。"
            border
            fit
            highlight-current-row
        >
            <el-table-column align="center" label="车型名称" prop="name"/>
            <el-table-column align="center" label="类型值" prop="type"/>
        </el-table>

        <div class="popContainer" v-show="popcontainer">
            <div class="carbox" v-show="cartype">
                <div class="cartitle">
                    <p class="table-title">添加车型</p>
                </div>
                <el-form  label-position="left" style="margin:0 30px 0 50px;">    
                 <el-form-item label="车型名称">
                      <el-input v-model="carTypeName" style="width:300px;"></el-input>
                 </el-form-item>
                
                <div style="margin-bottom:20px;display:flex;justify-content:flex-end;">
                    <el-button @click="handremove">取 消</el-button>
                    <el-button @click="addCarType">确 定</el-button>
                </div>
                
            </el-form>
            </div>
        </div>
            
    </div>
</template>>
<style scoped>
.carbox{
    position:fixed;
    background:#fff;
    top:20%;
    left:40%;
    min-width: 500px;
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
.addbtn{
    margin-left:20px;
    margin-top:10px;
}
.cartitle{
    background-color:#F3F3F3;
    height:50px;
    width:100%;
    margin-bottom:20px;
}
.tabletop{
  height:50px;
  width:80%;
  background-color:#F3F3F3;
  margin:0 auto;
}
.table-title{
  display:inline-block;
  margin-left:10px;
  margin-top:20px;
  color:#555;
  margin-right:75%;
  font-size:15px;
}
</style>

<script>
import { carTypeList, addCarType } from "@/api/goods";
export default {
    data(){
        return {
            list:[],
            popcontainer:false,
            cartype:false,
            options:[
                {   value:'1',
                    label:'轿车'
                },
                {
                    value:'2',
                    label:'小型车'
                },
                {
                    value:'3',
                    label:'大型车'
                },
                {
                    value:'4',
                    label:'货车'
                },
                {
                    value:'5',
                    label:'小货车'
                },
                {
                    value:'6',
                    label:'越野车'
                },
                {
                    value:'7',
                    label:'MPV'
                },
            ],
            dialogVisible: false,
            carTypeName: "",
        }
    },
     created(){
         this.getList()
     },
    methods:{
        handchange(value){
            this.carTypeName=value
        },
        handremove(){
            this.cartype=false
            this.popcontainer=false
        },
        showAddCarTypeDialog(){
            this.cartype=true
            this.popcontainer=true
        },
        addCarType(){
            var typeName=this.carTypeName
            if(typeName==""){
                this.$message('车型名称不能为空');
            }
            addCarType(typeName).then(response=>{
                this.$notify.success({
                    title:"成功",
                    message:"车型添加成功"
                })
                this.carTypeName=""
                this.cartype=false;
                this.popcontainer=false;
                this.getList();
            }).catch(response=>{
                this.$notify.error({
                    title:"失败",
                    message:response.data.errmsg,
                    duration:0
                })
            })
        },
        getList(){
            var that = this;
           carTypeList(1)
           .then(response=>{  
               that.list=response.data.data.params
           }) 
        }
    }
}
</script>>