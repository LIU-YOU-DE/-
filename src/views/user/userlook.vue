<template>
  <div class="userlook">
    <div class="form1">
      <el-form ref="form" :model="list" label-width="180px" prop>
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

      </el-form>
    </div>
    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleEdit" v-permission="['PUT /members/{memberId}']">更新会员信息</el-button>
    </div>
  </div>
</template>

<script>
import { getlook,updateAd } from "@/api/user";
export default {
  data() {
    return {
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
    getlist() {
      const goodsId = this.$route.query.id;
      this.upid =goodsId
      getlook(goodsId).then(response => {
        this.list = response.data.data;
        // console.log(response);
      });
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
          this.$router.push({ path: "/user/user" });
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
    this.getlist();
  }
};
</script>

<style scoped>
  .form1{
    margin-top: 30px;
  }
</style>