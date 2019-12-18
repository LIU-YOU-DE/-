<template>
  <div class="userlook">
    <div class="form1">
      <el-button @click="handleEdit" v-permission="['PUT /members/{memberId}']" style="margin-left:10%;margin-bottom:10px;">编辑资料</el-button>
      <el-button @click="gousereip">登录日志</el-button>
      <el-button @click="back">返回</el-button>

        <table border="1" width="80%;" style="margin:0 auto;">
          <tr>
            <td rowspan="4" style="vertical-align:middle;align:center;text-align:center;"><img :src="list.avatarUrl" alt=""></td>
            <td  class="tabletile">用户ID</td>
            <td class="tablelist">{{list.memberId}}</td>
            <td  class="tabletile">会员微信openid</td>
            <td class="tablelist">{{list.wxOpenId}}</td>
          </tr>
          <tr>
            <td class="tabletile">用户昵称</td>
            <td class="tablelist">{{list.nickname}}</td>
             <td class="tabletile">手机号码</td>
            <td class="tablelist">{{list.mobile}}</td>
          </tr>
          <tr>
            <td class="tabletile">出生日期</td>
            <td class="tablelist">{{list.birthday}}</td>
            <td class="tabletile">性别</td>
            <td class="tablelist">{{list.gender}}</td>
          </tr>
          <tr>
            <td class="tabletile">城市</td>
            <td class="tablelist">{{list.country}} - {{list.province}} - {{list.city}}</td>
            <td class="tabletile">推荐人ID</td>
            <td class="tablelist">{{list.sourceMemberId}}</td>
          </tr>
        </table>

        <div class="table-box">
        <p class="address"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />收货地址</p>
        <el-table :data="addresslist" border style="width:95%;margin:0 auto;margin-bottom:50px;">
          <el-table-column align="center" label="姓名" prop="name" />
          <el-table-column align="center" label="手机号码" prop="phoneNumber" />
          <el-table-column align="center" label="详细地址" prop="address" />
          <el-table-column align="center" label="邮政编码" prop="addressInfo" />
          <el-table-column align="center" label="是否默认" prop="status"  />
        </el-table>

        <h3 class="address"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />积分记录</h3>
        <el-table border style="width:95%;margin:0 auto;margin-bottom:20px;" :data="pointHistoryList">
          <el-table-column align="center" label="历史总积分" prop="historyCountPoint" />
          <el-table-column align="center" label="当前积分" prop="point" />
          <el-table-column align="center" label="积分变动" prop="updatePoint" />
          <el-table-column align="center" label="积分变动值" prop="memberId" />
          <el-table-column align="center" label="积分变动原因" prop="reason" />
          <el-table-column align="center" label="更新时间" prop="updateTime" />
        </el-table>
        
        </div>

      <el-dialog 
        :visible.sync="dialogVisible"
        :append-to-body="true"
        title="登录日志"
      >
        <el-table border>
          <el-table-column align="center" label="登录时间" prop="memberId" />
          <el-table-column align="center" label="IP地址" prop="memberId" />
          <el-table-column align="center" label="登录地点" prop="memberId" />
          <el-table-column align="center" label="登录方式" prop="memberId" />
        </el-table>
        <el-button @click="dialogVisible = false" style="position:relative;left:90%;margin-top:10px;">取 消</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getlook,updateAd ,listAddress,listHistory} from "@/api/user";
export default {
  data() {
    return {
      dialogVisible:false,
      memberType:undefined,
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
      },
      pointHistoryList:[],
      addresslist:[],
      listQuery: {
        page: 1,
        limit: 20,
        memberId: undefined,
        mobile: undefined,
        sort: "add_time",
        order: "desc"
      },
      pointHistory: {
        page: 1,
        limit: 20,
        memberId: undefined,
        mobile: undefined,
        sort: "update_time",
        order: "desc"
      },
    };
  },
  methods: {
    gousereip(){
      this.$router.push({path:"/test/userip",query:{id:this.list.memberId }})
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex % 5 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
    // getuseraddress(){
    //   this.listQuery.userId=this.list.memberId
    //   listAddress(this.listQuery).then(response=>{
    //     console.log(response)
    //   })
    // },
    back(){
      this.$router.go(-1)
    },
    getHistoryPoint(){
      this.pointHistory.memberId=this.$route.query.id;
      listHistory(this.pointHistory).then(response=>{
        this.pointHistoryList=response.data.data.list
      })
    },
    getlist() {
      this.memberType=this.$route.query.memberType
      const goodsId = this.$route.query.id;
      this.upid =goodsId
      getlook(goodsId).then(response => {
        this.list = response.data.data;
        console.log(this.list)
        this.addresslist=response.data.data.addressList
      });
    },
    handleCancel: function() {
      this.$router.push({ path: "/test/user" });
    },
    handleEdit: function() {
      this.$router.push({path:"/test/useredit",query: { list: this.list, memberType:this.memberType}})
    }
  },
  created() {
    this.getlist();
    this.getHistoryPoint()
  }
};
</script>

<style scoped>
  .form1{
    margin-top: 30px;
  }
table,tr,td{
    border:1px solid #E4E4E4; 
    border-collapse:collapse; 
    color:#909399;
  }
table{
  height:280px;
}
.tabletile{
  text-align:right;
  width:200px;
  padding-right:20px;
  background-color:#F9FAFC;
}
.tablelist{
  padding-left:20px;
}
.table-box{
  border:1px solid #E4E4E4;
  width:80%;
  margin:0 auto;
  margin-top:40px;
  margin-bottom:20px;
}
.address{
  font-size:18px;
  color:#666;
  margin-left:20px;
  font-weight:600;
}
.svg{
  margin-right:5px;
  margin-left:11px;
}
</style>