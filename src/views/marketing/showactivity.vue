<template>
    <div style="margin-left:20px;">
      <el-form ref="dataForm" :model="dataForm" label-width="150px;" label-position="right">
          <el-form-item label="活动ID:" style="padding-left:16px;">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="活动名称:">
                <span>{{dataForm.activityName}}</span>
            </el-form-item>
            <el-form-item label="活动类型:">
              <span>{{dataForm.type}}</span>
            </el-form-item>
            <el-form-item label="活动描述:">
              <template slot-scope="scope">
                <div v-for="(d,index) in dataForm.description" :key="index" style="padding-left:67px;">
                  <span>{{dataForm.description[index]}}</span>
              </div>
              </template>
            </el-form-item>
            <el-form-item label="活动状态:">
              <el-tag>{{dataForm.payStatus==1?'未开始':'进行中'}}</el-tag>
            </el-form-item>
      </el-form>

        <p style="font-size:16px;">奖品列表</p>
        <el-table border :data="dataForm.prizeList" style="width:70%">
        <el-table-column align="center" label="奖品ID" prop="prizeId"/>
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