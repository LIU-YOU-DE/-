<template>
    <div style="width:90%;margin:0 auto;">
      <div class="tabletop">
        <p class="address">抽奖活动详情</p>
      </div>
      <p class="address" style="font-size:16px;margin-bottom:40px;margin-left:50px;"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />抽奖活动介绍</p>
      <div style="width:70%;margin:0 auto;">
        <el-form ref="dataForm" :model="dataForm" label-width="150px;" label-position="right">
            <el-form-item label="抽奖活动名称:">
                <span>{{dataForm.activityName}}</span>
            </el-form-item>
            <el-form-item label="抽奖活动类型:">
              <span>{{dataForm.type}}</span>
            </el-form-item>
            <el-form-item label="抽奖活动描述:">
              <template slot-scope="scope">
                <div v-for="(d,index) in dataForm.description" :key="index" style="padding-left:67px;">
                  <span>{{dataForm.description[index]}}</span>
              </div>
              </template>
            </el-form-item>
            <el-form-item label="抽奖活动状态:">
              <el-tag>{{dataForm.payStatus==1?'未开始':'进行中'}}</el-tag>
            </el-form-item>
            <el-form-item label="备注:">
              
            </el-form-item>
      </el-form>
      </div>
      

         <p class="address" style="font-size:16px;margin-bottom:40px;margin-left:50px;"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />活动奖品列表</p>
        <el-table border :data="dataForm.prizeList" style="width:90%;margin:0 auto;">
        <el-table-column align="center" label="奖品名称" prop="prizeName"/>
        <el-table-column align="center" label="奖品描述" prop="description" type="textarea"/>
        <el-table-column align="center" prop="imgUrl" label="奖品图片">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl" width="40" >
          </template>
        </el-table-column>
        <el-table-column align="center" label="中奖概率" prop="probability">
          <div>{{dataForm.prizeList.probability}}</div>
        </el-table-column>
         </el-table-column>
      </el-table>
    </div>
</template>
<script>
export default {
    data(){
        return{
             dataForm:{
              id:'',
              activityName:'',
              type:'',
              description:'',
              payStatus:'',
              prizeList:""
            },
        }
    },
    created(){
        this.geilist()
    },
    methods:{
        geilist(){
            var row=this.$route.query.row
         this.dataForm.id=row.id
         this.dataForm.activityName=row.activityName
         this.dataForm.type=row.type
         this.dataForm.description=row.description
         this.dataForm.prizeList=row.prizeList
         this.dataForm.payStatus=row.status
        }
    }
}
</script>
<style scoped>
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
  height:60px;
  width:100%;
  line-height: 60px;
  background:#f3f3f3;
  margin-bottom:20px;
}
</style>