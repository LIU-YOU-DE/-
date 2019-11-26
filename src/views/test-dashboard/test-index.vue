<template>
  <div class="box">
    <div style="border:1px solid #DCDFE6;margin-top:20px;">
      <!--运营快捷入口 -->
       <div class="tabletop">
          <p class="table-title">运营快捷入口</p>
      </div>
      <div style="display:flex;">
        <div class="yunying-content" @click="goUserList">
          <p class="user-title">用户管理</p>
          <svg-icon icon-class="user" id="user" class-name="card-panel-icon"/>
        </div>
        <div class="yunying-content" @click="goOrderList">
          <p class="user-title">订单管理</p>
          <svg-icon icon-class="order" id="user" class-name="card-panel-icon"/>
        </div>
        <div class="yunying-content" @click="goActivityList">
          <p class="user-title">活动管理</p>
          <svg-icon icon-class="activity" id="user" class-name="card-panel-icon"/>
        </div>
        <div class="yunying-content" @click="goCarList">
          <p class="user-title">车辆信息管理</p>
          <svg-icon icon-class="car" id="user" class-name="card-panel-icon"/>
        </div>
        <div class="yunying-content" @click="goCreateCar">
          <p class="user-title">添加汽车</p>
          <svg-icon icon-class="create" id="user" class-name="card-panel-icon"/>
        </div>
        <div class="yunying-content" @click="goGiftList">
          <p class="user-title">礼品信息导入</p>
          <svg-icon icon-class="gift" id="user" class-name="card-panel-icon"/>
        </div>
        <div class="yunying-content" @click="goCarType">
          <p class="user-title">车型设置</p>
          <svg-icon icon-class="car" id="user" class-name="card-panel-icon"/>
        </div>
      </div> 
    </div>

  <!-- 概览数据 -->
    <div style="margin-top:30px;">
        <div class="tabletop" style="border:1px solid #DCDFE6;">
          <p class="table-title">概览数据</p>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:10px;">
          <div class="numlist">
            <div><svg-icon icon-class="order2" id="user2" class-name="card-panel-icon"/></div>
            <div style="margin-left:20px;margin-top:10px;text-align:center;">
              <p style="color:#666;">今日订单总数</p>
              <p style="margin-top:10px;">20000</p>
            </div>
          </div>
          <div class="numlist">
            <div><svg-icon icon-class="money new" id="user2" class-name="card-panel-icon"/></div>
            <div style="margin-left:20px;margin-top:10px;text-align:center;">
              <p style="color:#666;">今日销售总额</p>
              <p style="margin-top:10px;">20000</p>
            </div>
          </div>
          <div class="numlist">
            <div><svg-icon icon-class="money (1)" id="user2" class-name="card-panel-icon"/></div>
            <div style="margin-left:20px;margin-top:10px;text-align:center;">
              <p style="color:#666;">昨日销售总额</p>
              <p style="margin-top:10px;">20000</p>
            </div>
          </div>
          <div class="numlist">
            <div><svg-icon icon-class="money3" id="user2" class-name="card-panel-icon"/></div>
            <div style="margin-left:20px;margin-top:10px;text-align:center;">
              <p style="color:#666;">近七日销售总额</p>
              <p style="margin-top:10px;">20000</p>
            </div>
          </div>
          <div class="numlist">
            <div><svg-icon icon-class="jifen" id="user2" class-name="card-panel-icon"/></div>
            <div style="margin-left:20px;margin-top:10px;text-align:center;">
              <p style="color:#666;">今日积分兑换数</p>
              <p style="margin-top:10px;">20000</p>
            </div>
          </div>
          <div class="numlist">
            <div><svg-icon icon-class="jifen2" id="user2" class-name="card-panel-icon"/></div>
            <div style="margin-left:20px;margin-top:10px;text-align:center;">
              <p style="color:#666;">今日积分兑换量</p>
              <p style="margin-top:10px;">20000</p>
            </div>
          </div>
        </div>

        <!-- 商品总览 -->
        <div style="margin-top:30px;display:flex;justify-content:space-between;">
          <div class="list">
            <div class="tabletop" style="border:1px solid #DCDFE6;">
              <p class="table-title">商品总览</p>
            </div>
            <div class="list-left"> 
              <div style="color:#555;font-size:16px;text-align:center;margin-left:40px;">
                <p class="list-left-title">100</p>
                <p class="list-left-title2">已上架</p>
              </div>
              <div style="color:#555;font-size:16px;text-align:center;">
                <p class="list-left-title">100</p>
                <p class="list-left-title2">已下架</p>
              </div>
              <div style="color:#555;font-size:16px;text-align:center;">
                <p class="list-left-title">100</p>
                <p class="list-left-title2">库存紧张</p>
              </div>
              <div style="color:#555;font-size:16px;text-align:center;margin-right:40px;margin-bottom:30px;">
                <p class="list-left-title">100</p>
                <p class="list-left-title2">全部商品</p>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="tabletop" style="border:1px solid #DCDFE6;">
              <p class="table-title">用户总览</p>
            </div>
            <div class="list-left"> 
              <div style="color:#555;font-size:16px;text-align:center;margin-left:40px;">
                <p class="list-left-title">100</p>
                <p class="list-left-title2">今日新增</p>
              </div>
              <div style="color:#555;font-size:16px;text-align:center;">
                <p class="list-left-title">100</p>
                <p class="list-left-title2">昨日新增</p>
              </div>
              <div style="color:#555;font-size:16px;text-align:center;">
                <p class="list-left-title">100</p>
                <p class="list-left-title2">本月新增</p>
              </div>
              <div style="color:#555;font-size:16px;text-align:center;margin-right:40px;margin-bottom:30px;">
                <p class="list-left-title">100</p>
                <p class="list-left-title2">会员总数</p>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
*{
  padding:0;
  margin:0;
}
.list-left-title2{
  font-size:14px;
  color:#555;
  margin-top:10px;
}
.list-left-title{
  font-size:30px;
  color:red;
}
.list-left{
  display: flex;
  padding-top:30px;
  margin-bottom:30px;
  justify-content: space-between;
  border-left:1px solid #DCDFE6;
  border-right:1px solid #DCDFE6;
  border-bottom:1px solid #DCDFE6;
}
.list{
  width:49.5%;
}
.numlist{
  display: flex;
  min-width:16%;
  height:80px;
  border:1px solid #DCDFE6;
}
.user-title{
  margin-left:30px;
  margin-top:20px;
  font-size:16px;
  color:#555;
}
.yunying-content{
  text-align: center;
  margin-bottom:20px;
  cursor:pointer;
}
#user2{
  font-size:60px;
  margin-top:5px;
  color:#DCDFE6;
  margin-left:10px;
}
#user{
  font-size:40px;
  margin-top:5px;
  color:#DCDFE6;
  margin-left:10px;
}
.box{
    width:95%;
    margin:0 auto;
    margin-top:10px;
  }
  .table-title{
  display:inline-block;
  margin-left:10px;
  color:#555;
  margin-right:75%;
  font-size:18px;
  margin-top:20px;
}
.user-tab{
  border-left:1px solid #DCDFE6;
  border-right:1px solid #DCDFE6;
  border-bottom:1px solid #DCDFE6;
  height:50px;
  width:100%;
}
 .tabletop{
  height:50px;
  width:100%;
  background-color:#F3F3F3;
}
</style>

<script>
import { info } from "@/api/dashboard";
export default {
  data(){
    return {
      carOrderCount:0,
        giftCount:0,
        giftDownCount:0,
        giftOrderCount:0,
        giftUpCount:0,
        giftWronStockCount:0,
        groupBuyOrderCount:0,
        lastSevenDaysOrderTotal:0,
        memberCount:0,
        memberMonthIncreseCount:0,
        memberTodayIncreaseCount:0,
        memberYesterDayIncreaseCount:0,
        todayOrderCount:0,
        todayOrderTotal:0,
        todayPointTotal:0,
        yesterdayOrderTotal:0
    }
  },
  created(){
    this.getList()
  },
  methods:{
    getList(){
      info().then(response=>{
        this.carOrderCount=response.data.data.carOrderCount
        console.log(response.data.data.memberCount)
      })
    },
    goActivityList(){
      this.$router.push({path:'/test-marketing/test-activity'})
    },
    goCarType(){
      this.$router.push({path:'/test-sys/test-cartype'})
    },
    goGiftList(){
      this.$router.push({path:'/test-marketing/test-prize'})
    },
    goCreateCar(){
      this.$router.push({path:"/test-marketing/test-create"})
    },
    goCarList(){
      this.$router.push({path:'/test-marketing/test-list'})
    },
    goOrderList(){
      this.$router.push({path:'/test-goods/test-orders'})
    },
    goUserList(){
      this.$router.push({path:"/test/user"})
    }
  },
}
</script>>