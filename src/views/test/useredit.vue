<template>
  <div class="userlook">
    <div class="form1" style="margin-left:10%;margin-bottom:20px;">
      <div>
        <el-button @click="gouserLook">用户详情</el-button>
        <el-button @click="gouserip">登录日志</el-button>
        <el-button @click="gouserLook">返回</el-button>
      </div>
      <div style="margin-top:20px;border:1px solid #E4E4E4;width:90%;">
        <div class="tabletop">
          <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;margin-right:75%;">编辑资料</p>
        </div>
        <el-form ref="form" :model="list" label-width="180px" prop class="form-box">
        <el-form-item label="会员id" prop="memberId">
          {{list.memberId}}
        </el-form-item>

        <el-form-item label="会员微信openid" prop="wxOpenId">
          <el-col :span="12">
            <el-input v-model="list.wxOpenId" disabled></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-col :span="12">
            <el-input v-model="list.nickname" disabled></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="头像" prop="avatarUrl">
          <img :src="list.avatarUrl" />
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-col :span="12">
            <el-input v-model="list.mobile"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="list.gender" disabled>
            <el-radio :label="0">未知</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>


        <el-form-item label="出生日期" prop="city">
          <el-col :span="12">
            <el-input v-model="list.birthday" disabled></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="微信地址" prop="country">
          <el-col :span="12">
            <span>{{list.country}} - {{list.province}} - {{list.city}}</span>
          </el-col>
        </el-form-item>


        <el-form-item label="微信语言" prop="language">
          <span>{{list.language}}</span>
        </el-form-item>

        <el-form-item label="注册时间" prop="addTime">
          <el-col :span="12">
            <el-input v-model="list.addTime" disabled></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="账户状态" prop="status">
          <el-radio-group v-model="list.status">
            <el-radio :label="1">可用</el-radio>
            <el-radio :label="2">禁用</el-radio>
            <el-radio :label="3">注销</el-radio>
            <el-radio :label="4">删除</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="账户类型" prop="memberType">
          <!-- <el-radio-group v-model="memberType">
            <el-radio :label="1">普通用户</el-radio>
            <el-radio :label="2">汽车商家</el-radio>
            <el-radio :label="3">保养商家</el-radio>
          </el-radio-group> -->
            <el-radio :label="1"  v-model="memberType">普通用户</el-radio>
            <el-radio :label="2"  v-model="memberType">汽车商家</el-radio>
            <el-radio :label="3"  v-model="memberType" @change="dialogVisible=true">保养商家</el-radio>
        </el-form-item>

        <el-form-item label="邀请人id" prop="sourceMemberId">
          <el-col :span="12">
            <el-input v-model="list.sourceMemberId" disabled></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-col :span="12">
            <el-input type="textarea" autosize v-model="list.remark"></el-input>
          </el-col>
        </el-form-item>

        
        <el-form-item label="信息更新时间" prop="updateTime">
          <el-col :span="12">
            <el-input v-model="list.updateTime" disabled></el-input>
          </el-col>
        </el-form-item>

        <div class="op-container">
          <el-button @click="handleEdit" v-permission="['PUT /members/{memberId}']" style="margin-left:30%;margin-top:20px;">更新会员信息</el-button>
        </div>

      </el-form>
      </div>
      <el-dialog
        title="添加商家关联"
        :visible.sync="dialogVisible"
        width="30%">
        <el-select v-model="merchantname" placeholder="请选择" @change="handMerchantId">
          <el-option
            v-for="item in merChantList"
            :key="item.merchantId"
            :label="item.merchantName"
            :value="item.merchantName">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button @click="handMerchantList">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getlook,updateAd,merchantList ,handMerchant} from "@/api/user";
export default {
  data() {
    return {
      merchantId:undefined,
      merchantname:'',
      merChantList:[],
      dialogVisible:false,
      memberType:undefined,
      id:"",
      list: {
        upid:null,
        addTime: "",
        avatarUrl: "",
        birthday: "",
        city: "",
        country: "",
        dreamPoint: null,
        gender: null,
        historyCountPoint: null,
        introduction: "",
        language: "",
        memberId: "",
        mobile: "",
        nickname: "",
        password: "",
        province: "",
        remark: "",
        sourceMemberId: "",
        status: "",
        updateTime: "",
        wxOpenId: "",
        birthday: ""
      }
    };
  },
  methods: {
    handMerchantId(event){
      for(let i=0;i<this.merChantList.length;i++){
        if(event==this.merChantList[i].merchantName){
          this.merchantId=this.merChantList[i].merchantId
        }
      }
    },
    getMerchantList(){
      merchantList().then(response=>{
        this.merChantList=response.data.data
      })
    },
    handMerchantList(){
      const merchant={
        merchantId:this.merchantId,
        memberId:this.list.memberId
      }
      handMerchant(merchant).then(response=>{
        this.dialogVisible=false
        this.$notify.success({
          title:"成功",
          message:"添加成功"
        })
      })
    },
    gouserip(){
      this.$router.push({path:"/test/userip",query:{id:this.id}})
    },
    gouserLook(){
      this.$router.go(-1)
    },
    getlist() {
      const goodsId = this.$route.query.id;
      this.upid =goodsId
      this.list = this.$route.query.list;
      this.id=this.list.memberId
      this.memberType=this.$route.query.memberType
      // getlook(goodsId).then(response => {
      //   this.list = this.$route.query.list;
      //   // console.log(response);
      // });
    },
    handleCancel: function() {
      this.$router.push({ path: "/user/user" });
    },
    handleEdit: function() {
      const finalGoods = {
        mobile: this.list.mobile,
        remark: this.list.remark,
        status: this.list.status
      };
      updateAd(finalGoods, this.upid)
        .then(response => {
          this.$notify.success({
            title: "成功",
            message: "更新成功"
          });
          this.$router.push({ path: "/test/user" });
        })
        .catch(response => {
          MessageBox.alert("业务错误：" + response.data.errmsg, "警告", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    }
  },
  created() {
    this.getMerchantList()
    this.getlist();
  }
};
</script>

<style scoped>
  .form1{
    margin-top: 30px;
  }

.tabletop{
  height:60px;
  background:#f3f3f3;
  border-bottom:1px solid #E4E4E4;
}
.form-box{
  margin-left:20%;
  margin-top:20px;
  margin-bottom:20px;
}
.el-form-item__label{
  padding:0 20px 0 0!important;
}
</style>