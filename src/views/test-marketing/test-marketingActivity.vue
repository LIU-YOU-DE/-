<template>
<div style="width:98%;margin:0 auto;">
    <div class="box">
       <div style="width:100%;height:50px;background-color:#F3F3F3;position:relative;margin-bottom:10px;border-bottom:1px solid #DCDFE6;">
        <div style="display:flex;justify-content:space-between;padding-right:20px;">
          <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;font-size:15px;"><svg-icon icon-class="search" class-name="card-panel-icon" style="margin-right:5px;"/>筛选查找</p>
        <div>
          <el-button class="filter-item" icon="el-icon-search" style="margin-top:8px;display:inline-block;">查找</el-button>
          <el-button class="filter-item" icon="el-icon-edit"style="margin-top:8px;display:inline-block;" @click="createLuckDraw">添加</el-button>
        </div>
        </div>
      </div>
      <span class="search">活动名称：</span>
        <el-input
            v-model.trim="listQuery.name"
            clearable
            class="filter-item"
            style="width: 200px;margin-bottom:10px;"
            placeholder="请输入活动名称"
        />
    </div>
    <!-- 查询结果 -->
    <div class="tabletop" style="margin-top:20px;">
      <p class="table-title"><svg-icon icon-class="list2" class-name="card-panel-icon" style="margin-right:5px;"/>数据列表</p>
    </div>
    <el-table 
        :data="list"
        border
    >
        <el-table-column align="center" property="brandName" label="编号"/>
        <el-table-column align="center" property="brandName" label="活动名称"/>
        <el-table-column align="center" property="brandName" label="开始时间"/>
        <el-table-column align="center" property="brandName" label="结束时间"/>
        <el-table-column align="center" property="brandName" label="状态"/>
        <el-table-column align="center" property="brandName" label="操作">
            <template slot-scope="scope">
                <el-button size="mini" @click="showLuckDraw(scope.row)">查看</el-button>
                <el-button size="mini" @click="luckDrawEdit(scope.row)">编辑</el-button>
                <el-button type="danger">删除</el-button>
            </template>
        </el-table-column>

    </el-table>
</div>
</template>
<script>
export default {
    data(){
        return {
            list:[],
            listQuery: {
                page: 1,
                limit: 10,
                name: undefined,
                sort: "add_time",
                order: "desc"
            },
        }
    },
    methods:{
        luckDrawEdit(row){
            this.$router.push({
                path: "test-luckDrawEdit",
                query: {id:row.id, row:row}
            });
        },
        // 查看抽奖活动
        showLuckDraw(row){
            this.$router.push({
                path:'test-showLuckDraw',
                query:{row:row}
            })
        },
        // 添加抽奖活动
        createLuckDraw(){
        }
    }
}
</script>
<style scoped>
    .box{
        margin-top:10px;
        border:1px solid #DCDFE6;
    }
    .search{
        font-size:14px;
        color:#909399;
        font-weight:600;
        display:inline-block;
        display:inline-block;
        margin-left:10px;
    }
    .tabletop{
        border-top:1px solid #DCDFE6;
        border-left:1px solid #DCDFE6;
        border-right:1px solid #DCDFE6;
        height:50px;
        width:100%;
        background-color:#F3F3F3;
        margin-top:20px;
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