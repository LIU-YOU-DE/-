<template>
  <div class="app-container" style="width:90%;margin:0 auto;">
    <div class="tabletop">
      <p class="address">添加活动</p>
    </div>
    <p class="address" style="font-size:16px;margin-bottom:40px;margin-left:50px;"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />活动介绍</p>
    <div style="width:70%;margin:0 auto;">
      <el-form ref="goods"  :model="goods" label-width="150px">
        <el-form-item label="活动名称" prop="activityName" class="inputstyle">
          <el-input v-model="goods.activityName" />
        </el-form-item>
        <el-form-item label="活动描述" prop="description">
          <template slot-scope="scope">
            <div v-for="(d,index) in counter" :key="index" class="inputbox">
                <el-input v-model="goods.description[index]" class="inputwidth" type="textarea"></el-input>
                <i class="el-icon-circle-plus-outline inputicon" @click="inputadd"></i>
                <i class="el-icon-remove-outline inputicon" @click="deleteinput(index)" v-if="showdeletebutton"></i>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="活动类型" prop="type">
          <el-radio v-model="goods.type" label="1">水果机抽奖（需添加8个奖品）</el-radio>
        </el-form-item>
        <el-form-item label="活动图片" prop="imgUrl">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="goods.imgUrl" :src="goods.imgUrl" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark"  class="inputstyle">
          <el-input v-model="goods.remark" type="textarea" autosize/>
        </el-form-item>
      </el-form>
    </div>
      


      <p class="address" style="font-size:16px;margin-bottom:40px;margin-left:50px;"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />指定奖品</p>
      <div style="width:90%;margin:0 auto;">
        <p style="font-size:14px;color:#666;">所有奖品中奖概率的和为100,如果输入小数将向下取整。</p>
        <el-button :plain="true" @click="attributeVisiable=true" style="margin-right:20px;margin-bottom:10px;">添加</el-button>
        <span style="color:#666;font-size:16px;display:inline-block;margin-right:20px;">总点数：100 </span> 
        <span style="font-size:16px;">已分配点数：{{sum}}</span>
        <span style="font-size:16px;color:red;display:inline-block;margin-left:20px;">剩余可分配点数：{{100-sum}}</span>
      </div>
      
      <el-table border :data="prizeList" style="width:90%;margin:0 auto;">
        <el-table-column align="center" label="奖品ID" prop="prizeId" width="100"/>
        <el-table-column align="center" label="奖品名称" prop="prizeName" width="200"/>
        <el-table-column align="center" label="奖品描述" prop="description" type="textarea" width="300"/>
        <el-table-column align="center" prop="imgUrl" label="奖品图片" width="150">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl" width="40" >
          </template>
        </el-table-column>
        <el-table-column align="center" label="中奖概率" prop="probability">
            <template slot-scope="scope">
                <el-slider :min=1 :max=100 v-model="scope.row.probability" @change="test($event,scope.row.prizeId)" show-input></el-slider>
            </template>
        </el-table-column>
        <el-table-column align="center" label="中奖概率" prop="probability" width="100">
          <div>{{list.probability}}</div>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="200"   
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deletePrize(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 查找指定奖品 -->
      <el-dialog :visible.sync="attributeVisiable" title="指定奖品">
        <el-form
            ref="attributeForm"
            :model="goods"
            status-icon
            label-position="left"
            label-width="100px"
            style="margin-left:50px;"
        >

          <el-input
            v-model="attributeForm.prizeName"
            clearable
            class="filter-item"
            style="width: 200px;margin-bottom:10px;"
            placeholder="请输入奖品名称"
            v-on:enter.native="seachprize"
          />
          <el-button  class="filter-item" icon="el-icon-search" @click="seachprize">查找</el-button>
          <el-table border highlight-current-row class="prizebox" :data="list" @selection-change="changeFun">
            <el-table-column type="selection" width="55" @selection-change="changeFun"/>
            <el-table-column align="center" label="奖品ID" prop="prizeId" />
            <el-table-column align="center" label="奖品名称" prop="prizeName" />
            <el-table-column align="center" label="奖品图片" prop="imgUrl">
              <template  slot-scope="scope">
                <img :src="scope.row.imgUrl" width="40" >
              </template>
            </el-table-column>
          </el-table>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="attributeVisiable = false">取消</el-button>
          <el-button @click="handprize">确定</el-button>
        </div>
      </el-dialog>

    <div class="op-container" style="display:flex;justify-content:center;margin-top:20px;">
      <el-button @click="handActivityadd">添加活动</el-button>
    </div>
  </div>

</template>

<style scoped>
.avatar-uploader-icon[data-v-63cc469e]{
  border:1px dashed #d9d9d9;
  border-radius: 6px;
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
  height:60px;
  width:100%;
  line-height: 60px;
  background:#f3f3f3;
  margin-bottom:20px;
}
.el-card {
  margin-bottom: 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.input-new-keyword {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
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
.avatar-uploader-icon[data-v-6dfb729f]{
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
</style>

<script>
import {uploadPath,createactivity,getPrizeList,getprize } from '@/api/storage'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
        attributeVisiable:false,
        showdeletebutton:false,
        uploadPath,
        counter:[{}],
        list:[],
        radio:'',
        value:1,
        val:"",
        a:[],
        sum:0,    //实时已用点数
        prizeList:[],
        prizeList2:[],
        attributeForm: { prizeName: '', description: '', imgUrl: '' },
        goods: {
            activityName:'',
            description:[],
            prizeList:[],
            imgUrl:'',
            prizeName:'',
            remark:'',
            type:""
        },
        listQuery: {
                page: 1,
                limit: 10,
                name: undefined,
                sort: "add_time",
                order: "desc"
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
  methods:{
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
    test(event,id){
      this.sum=0;
       this.prizeList.forEach(ele => {
            ele.prizeId===id?ele.probability=(Math.floor(event)):''

            this.sum=this.sum+ele.probability
        })
        // debugger
        if(this.sum>100){
                this.$alert("所有奖品的中奖概率大于100，请检查并重新设置")
            }
    },
      handActivityadd(){
        this.sum
          if(this.sum!==100){
            this.$alert("所有奖品中奖概率总和需为100.")
          return 
          }
          var aaa=[]
           const activityform={
          activityName:this.goods.activityName,
          description:this.goods.description,
          prizeList:this.prizeList,
          remark:this.goods.remark,
          type:this.goods.type
        }
        createactivity(activityform).then(response=>{
          this.$notify.success({
            title:"成功",
            message:"活动添加成功"
          })
          this.$router.push({path:"/test-marketing/test-activity"})
        }).catch(response=>{
          this.$notify.error({
            title:"失败",
            message:response.data.errmsg,
            duration:0
          })
        })
        
    },
      deletePrize(row){
        var index = this.prizeList.indexOf(row);
        this.prizeList.splice(index,1)
      },
      handprize(){
        for (var i = 0; i < this.choosedata.length; i++) {
          
          //当前列表中存在的奖品id列表
          var prizeIdArray = this.prizeList.map(x => {return x.prizeId});
          
          //要添加的奖品id
          var prizeId = this.choosedata[i].prizeId;

          if(prizeIdArray.indexOf(prizeId) >= 0){
            this.$alert("不能重复添加奖品")
            return 
          }
          // this.choosedata[i]['probability'] = 1
          this.prizeList.push(this.choosedata[i]);
          this.sum += 1
          // debugger
        }
        this.attributeVisiable=false
      },
      seachprize(){
          getprize(this.attributeForm.prizeName).then(response=>{
              this.list=response.data.data
          })
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

