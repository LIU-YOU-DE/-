<template>
    <div>
        <div class="filter-container">
            <el-button class="filter-item addbtn" type="primary" icon="el-icon-edit" @click="showAddCarTypeDialog">添加车型</el-button>
        </div>

        <!-- 查询结果 -->
        <el-table
            width="800"
            style="margin-left:20px;width:70%;"
            :data="list"
            element-loading-text="正在查询中。。。"
            border
            fit
            highlight-current-row
        >
            <el-table-column align="center" label="车型名称" prop="name"/>
            <el-table-column align="center" label="类型值" prop="type"/>
        </el-table>

        
        <el-dialog
            title="添加车型"
            :visible.sync="dialogVisible"
            width="30%">
            <el-form  label-position="left">    
                 <el-form-item label="车型名称">
                     <el-input v-model="carTypeName" style="width:300px;"></el-input>
                 </el-form-item>
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCarType">确 定</el-button>
            </el-form>
        </el-dialog>
    </div>
</template>>
<style scoped>
.addbtn{
    margin-left:20px;
    margin-top:10px;
}
</style>

<script>
import { carTypeList, addCarType } from "@/api/goods";
export default {
    data(){
        return {
            list:[],
            dialogVisible: false,
            carTypeName: "",
        }
    },
     created(){
         this.getList()
     },
    methods:{
        showAddCarTypeDialog(){
            this.dialogVisible=true
        },
        addCarType(){
            var typeName=this.carTypeName
            if(typeName==""){
                this.$message('车型名称不能为空');
            }
            addCarType(typeName).then(response=>{
                this.dialogVisible=false;
                this.getList();
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