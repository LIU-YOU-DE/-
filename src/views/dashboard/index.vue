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
    <div style="margin-top:30px;position:relative;">
        <div class="tabletop" style="border:1px solid #DCDFE6;">
          <p class="table-title">概览数据</p>
        </div>
        <div style="display:flex;margin-top:10px;color:#666;position:absolute;z-index:1000;background:#fff;top:0%;"  v-show="showBox">
          <p style="margin-left:20px;margin-bottom:10px;margin-top:10px;">拼团订单数:{{groupBuyOrderCount}}</p>
          <p style="margin:0 20px;margin-top:10px;">车型订单数:{{carOrderCount}}</p>
          <p style="margin-right:20px;margin-top:10px;">积分订单数:{{giftOrderCount}}</p>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:10px;">
          <div class="numlist"  @mouseleave="showOrderBox" @mouseenter="showBoxOrder">
            <div><svg-icon icon-class="order2" id="user2" class-name="card-panel-icon"/></div>
            <div style="margin-left:20px;margin-top:10px;text-align:center;">
              <p style="color:#666;">今日订单总数</p>
              <p style="margin-top:10px;">{{todayOrderCount}}</p>
            </div>
          </div>
          <div class="numlist">
            <div><svg-icon icon-class="money new" id="user2" class-name="card-panel-icon"/></div>
            <div style="margin-left:20px;margin-top:10px;text-align:center;">
              <p style="color:#666;">今日销售总额</p>
              <p style="margin-top:10px;">{{todayOrderTotal}}</p>
            </div>
          </div>
          <div class="numlist">
            <div><svg-icon icon-class="money (1)" id="user2" class-name="card-panel-icon"/></div>
            <div style="margin-left:20px;margin-top:10px;text-align:center;">
              <p style="color:#666;">昨日销售总额</p>
              <p style="margin-top:10px;">{{yesterdayOrderTotal}}</p>
            </div>
          </div>
          <div class="numlist">
            <div><svg-icon icon-class="money3" id="user2" class-name="card-panel-icon"/></div>
            <div style="margin-left:20px;margin-top:10px;text-align:center;">
              <p style="color:#666;">近七日销售总额</p>
              <p style="margin-top:10px;">{{lastSevenDaysOrderTotal}}</p>
            </div>
          </div>
          <div class="numlist">
            <div><svg-icon icon-class="jifen" id="user2" class-name="card-panel-icon"/></div>
            <div style="margin-left:20px;margin-top:10px;text-align:center;">
              <p style="color:#666;">今日积分兑换数</p>
              <p style="margin-top:10px;">{{todayPointTotal}}</p>
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
                <p class="list-left-title">{{giftUpCount}}</p>
                <p class="list-left-title2">已上架</p>
              </div>
              <div style="color:#555;font-size:16px;text-align:center;">
                <p class="list-left-title">{{giftDownCount}}</p>
                <p class="list-left-title2">已下架</p>
              </div>
              <div style="color:#555;font-size:16px;text-align:center;">
                <p class="list-left-title">{{giftWronStockCount}}</p>
                <p class="list-left-title2">库存紧张</p>
              </div>
              <div style="color:#555;font-size:16px;text-align:center;margin-right:40px;margin-bottom:30px;">
                <p class="list-left-title">{{giftUpCount+giftDownCount}}</p>
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
                <p class="list-left-title">{{memberTodayIncreaseCount}}</p>
                <p class="list-left-title2">今日新增</p>
              </div>
              <div style="color:#555;font-size:16px;text-align:center;">
                <p class="list-left-title">{{memberYesterDayIncreaseCount}}</p>
                <p class="list-left-title2">昨日新增</p>
              </div>
              <div style="color:#555;font-size:16px;text-align:center;">
                <p class="list-left-title">{{memberMonthIncreseCount}}</p>
                <p class="list-left-title2">本月新增</p>
              </div>
              <div style="color:#555;font-size:16px;text-align:center;margin-right:40px;margin-bottom:30px;">
                <p class="list-left-title">{{memberCount}}</p>
                <p class="list-left-title2">会员总数</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 积分统计 -->
        <div style="border:1px solid #DCDFE6;;">
          <div class="tabletop">
            <p class="table-title">积分统计</p>
          </div>
          <div style="display:flex;">
            <div>
              <div class="order-left">
                <p style="font-size:14px;">本月兑换积分</p>
                <p style="font-size:25px;color:#666;font-weight:600;">{{thisMonthPoint}}</p>
                <span style="color:#19B161">{{monthPointSum}}</span>
                <span style="font-size:14px;color:#999;">同比上月</span>
              </div>
              <div class="order-left" style="margin-top:20px;">
                <p style="font-size:14px;">本周兑换积分</p>
                <p style="font-size:25px;color:#666;font-weight:600;">{{thisWeekPoint}}</p>
                <span style="color:#19B161">{{weekPointSum}}</span>
                <span style="font-size:14px;color:#999;">同比上周</span>
              </div>
            </div>
            <div  class="order-right">
                <div style="display:flex;justify-content:flex-end;margin-right:30px;margin-top:20px;width:100%;">
                  <div style="display:flex;margin-top:10px;">
                    <p :class="{red:isToday}" @click="showToday" style="cursor:pointer;">今日</p>
                    <p style="margin-left:20px;margin-right:20px;cursor:pointer;" :class="{red:isWeek}" @click="showWeek">本周</p>
                    <p :class="{red:isMonth}" @click="showMonth" style="cursor:pointer;">本月</p>
                  </div>
                  <el-date-picker
                    v-model="date"
                    style="margin-right:30px;margin-left:20px;"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </div>
                <div id="myChart" style="width:100%;height:270px;"></div>
            </div>
          </div> 
        </div>

      <!-- 订单统计 -->
        <div style="border:1px solid #DCDFE6;margin-top:20px">
          <div class="tabletop">
            <p class="table-title">订单统计</p>
          </div>
          <div style="display:flex;">
            <div>
              <div class="order-left">
                <p style="font-size:14px;">本月订单总数</p>
                <p style="font-size:25px;color:#666;font-weight:600;">{{thisMonthCount}}</p>
                <span>{{monthOrderSum}}</span>
                <span style="font-size:14px;color:#999;">同比上月</span>
              </div>
              <div class="order-left" style="margin-top:20px;">
                <p style="font-size:14px;">本周订单总数</p>
                <p style="font-size:25px;color:#666;font-weight:600;">{{thisWeekCount}}</p>
                <span>{{weekOrderSum}}</span>
                <span style="font-size:14px;color:#999;">同比上周</span>
              </div>
            </div>
            <div class="order-right">
              <div style="display:flex;justify-content:flex-end;margin-right:30px;margin-top:20px;width:100%;">
                  <div style="display:flex;margin-top:10px;">
                    <p :class="{orderred:isOrderToday}" @click="showOrderToday" style="cursor:pointer;">今日</p>
                    <p style="margin-left:20px;margin-right:20px;cursor:pointer;" :class="{orderred:isOrderWeek}" @click="showOrderWeek">本周</p>
                    <p :class="{orderred:isOrderMonth}" @click="showOrderMonth" style="cursor:pointer;">本月</p>
                  </div>
                  <el-date-picker
                    v-model="date"
                    style="margin-right:30px;margin-left:20px;"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </div>
                <div id="orderMyChart" style="width:100%;height:270px;"></div>
            </div>
          </div> 
        </div>

        <!-- 销售统计 -->
        <div style="border:1px solid #DCDFE6;margin-top:20px">
          <div class="tabletop">
            <p class="table-title">销售统计</p>
          </div>
          <div style="display:flex;">
            <div>
              <div class="order-left">
                <p style="font-size:14px;">本月销售总额</p>
                <p style="font-size:25px;color:#666;font-weight:600;">1000</p>
                <p style="font-size:14px;color:#999;">同比上月</p>
              </div>
              <div class="order-left" style="margin-top:20px;">
                <p style="font-size:15px;">本周销售总额</p>
                <p style="font-size:25px;color:#666;font-weight:600;">1000</p>
                <p style="font-size:14px;color:#999;">同比上周</p>
              </div>
            </div>
            <div class="order-right">
              <div style="display:flex;justify-content:flex-end;margin-right:30px;margin-top:20px;width:100%;">
                  <div style="display:flex;margin-top:10px;">
                    <p :class="{ordetotalrred:isTodayOrderTotal}" @click="showOrderTotalToday" style="cursor:pointer;">今日</p>
                    <p style="margin-left:20px;margin-right:20px;cursor:pointer;" :class="{ordetotalrred:isWeekOrderTotal}" @click="showOrderTotalWeek">本周</p>
                    <p :class="{ordetotalrred:isMonthOrderTotal}" @click="showOrderTotalMonth" style="cursor:pointer;">本月</p>
                  </div>
                  <el-date-picker
                    v-model="date"
                    style="margin-right:30px;margin-left:20px;"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </div>
                <div id="orderTotalCharts" style="width:100%;height:270px;"></div>
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
.ordetotalrred{
  color:blue;
}
.orderred{
  color:blue;
}
.red{
  color:blue;
}
.order-right{
  border-left:1px solid #DCDFE6;
  height:300px;
  width:100%;
}
.order-left{
  font-size:16px;
  min-width:110px;
  margin:0 10px;
  color:#555;
  margin-top:20px;
  text-align: center;
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
import { info,getPoint,getOrderPoint } from "@/api/dashboard";
import { resolve, reject } from 'q';

export default {
  data(){
    return {
        orderList:[],
        weekDashBoardOrderVos:[],
        monthDashBoardOrderVos:[],
        dayDashBoardOrderVos:[],
        lastMonthCount:0,
        lastWeekCount:0,
        thisMonthCount:0,
        thisWeekCount:0,
        thisWeekPoint:0,
        lastWeekPoint:0,
        lastMonthPoint:0,
        thisMonthPoint:0,
        monthOrderSum:0,
        weekOrderSum:0,
        monthPointSum:0,
        weekPointSum:0,
        isTodayOrderTotal:false,
        isWeekOrderTotal:true,
        isMonthOrderTotal:false,
        isOrderToday:false,
        isOrderWeek:true,
        isOrderMonth:false,
        showBox:false,
        isMonth:false,
        isWeek:true,
        isToday:false,
        date:'',
        arr:[],
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
        yesterdayOrderTotal:0,
        list:[],
        weekDashBoardPointVos:[],
        monthDashBoardPointVos:[],
        dayDashBoardPointVos:[]
    }
  },
  created(){
    this.getList()
    this.getPointList()
    this.getOrderList()
  },
  mounted(){
    this.drawLine()
    this.orderTotalCharts()
    this.orderCharts()
  },
  methods:{
    // 获取百分比
    GetPercent(num, total) {
      num = parseFloat(num);
      total = parseFloat(total);
      if (isNaN(num) || isNaN(total)) {
        return "-";
      } 
      return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00 + "%");
    },
    // 获取每月有几周
  getWeeks(year, month) {
        var d = new Date();
        // 该月第一天
        d.setFullYear(year, month-1, 1);
        var w1 = d.getDay();
        if (w1 == 0) w1 = 7;
        // 该月天数
        d.setFullYear(year, month, 0);
        var dd = d.getDate();
        // 第一个周一
        let d1;
        if (w1 != 1){
            d1 = 7 - w1 + 2;
        } else{ d1 = 1};
        let week_count = Math.ceil((dd-d1+1)/7);
        return week_count
    },
    // 获取每周的日期
    getWeekTime(year, month,weekday) {
        var d = new Date();
        // 该月第一天
        d.setFullYear(year, month-1, 1);
        var w1 = d.getDay();
        if (w1 == 0) w1 = 7;
        // 该月天数
        d.setFullYear(year, month, 0);
        var dd = d.getDate();
        // 第一个周一
        let d1;
        if (w1 != 1) d1 = 7 - w1 + 2;
        else d1 = 1;
        var monday = d1+(weekday-1)*7;
        var sunday = monday + 6;
        var from = year+"-"+month+"-"+monday;
        var to;
        if (sunday <= dd) {
            to = year+"-"+month+"-"+sunday;
        } else {
            d.setFullYear(year, month-1, sunday);
            let days=d.getDate();
            to = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+days;
        }
          return from + '-'+ to 
    },
    showBoxOrder(){
      this.showBox=true
    },
    showOrderBox(){
      this.showBox=false
    },
    showMonth(){
      this.isMonth=true
      this.isWeek=false
      this.isToday=false
      var now = new Date();  
      var nowTime = now.getTime();  
      var day = now.getDay();  
      var oneDayLong = 24 * 60 * 60 * 1000; 
      var month=now.getMonth()+1
      var day=this.getWeeks(2019,month)
      var arr=[]
      for(var i=1;i<=day;i++){
        arr.push(this.getWeekTime(2019,month,i))
      }
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      myChart.setOption({
        title: { text: '本月积分统计' },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#DBEEFC'
            }
          }
            },
            xAxis: {
                data:arr
            },
            yAxis: {},
            series: [{
                name: '积分兑换量',
                type: 'line',
                data:[100,250,865,411,354,699,445,666]
            }]
        })
    },
    showWeek(){
      this.isWeek=true
      this.isToday=false
      this.isMonth=false
      var now = new Date();  
      var nowTime = now.getTime();  
      var day = now.getDay();  
      var oneDayLong = 24 * 60 * 60 * 1000; 
      var date=[]
      for (var i = 1; i < 8; i++) {  
        var SundayTime = nowTime + (i - day) * oneDayLong;  
        var SundayTime = new Date(SundayTime);  
        var y = SundayTime.getFullYear();//年  
        var m = SundayTime.getMonth() + 1;//月  
        var d = SundayTime.getDate();//日  
        var h = SundayTime.getHours();//时  
        var mm = SundayTime.getMinutes();//分  
        var s = SundayTime.getSeconds();//秒  
        date.push(m+'-'+d)
      }
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      myChart.setOption({
        title: { text: '本周积分统计' },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#DBEEFC'
            }
          }
            },
            xAxis: {
                data:date
            },
            yAxis: {},
            series: [{
                name: '积分兑换量',
                type: 'line',
                data:[88,444,562,763,326,951,264]
            }]
        })

    },
    showToday(){
      this.isToday=true
      this.isMonth=false
      this.isWeek=false
      var now = new Date();  
      var nowTime = now.getTime();  
      var day = now.getDay();  
      var oneDayLong = 24 * 60 * 60 * 1000; 
      var date=[]
      for (var i = 1; i < 8; i++) {  
        var SundayTime = nowTime + (i - day) * oneDayLong;  
        var SundayTime = new Date(SundayTime);  
        var y = SundayTime.getFullYear();//年  
        var m = SundayTime.getMonth() + 1;//月  
        var d = SundayTime.getDate();//日  
        var h = SundayTime.getHours();//时  
        var mm = SundayTime.getMinutes();//分  
        var s = SundayTime.getSeconds();//秒  
        date.push(m+'-'+d)
      }
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      myChart.setOption({
        title: { text: '今日积分统计' },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#DBEEFC'
            }
          }
            },
            xAxis: {
                data:date
            },
            yAxis: {},
            series: [{
                name: '积分兑换量',
                type: 'line',
                data:[964,452,466,478,541,641]
            }]
        })
    },
    // 获取订单数
    getOrderList(){
      getOrderPoint().then(response=>{
        this.orderList=response.data.data
        this.lastMonthCount=this.orderList.lastMonthCount
        this.lastWeekCount=this.orderList.lastWeekCount
        this.thisMonthCount=this.orderList.thisMonthCount
        this.thisWeekCount=this.orderList.thisWeekCount
        for(let i in this.orderList.monthDashBoardOrderVos){
         this.monthDashBoardPointVos.push(this.orderList.monthDashBoardOrderVos[i])
        }
        for(let i in this.orderList.dayDashBoardOrderVos){
         this.dayDashBoardOrderVos.push(this.orderList.dayDashBoardOrderVos[i])
        }
        for(let i in this.orderList.weekDashBoardOrderVos){
         this.weekDashBoardOrderVos.push(this.orderList.weekDashBoardOrderVos[i])
        }
        this.monthOrderSum=this.GetPercent(this.thisMonthCount,this.lastMonthCount)
        this.weekOrderSum=this.GetPercent(this.thisWeekCount,this.lastWeekCount)
      })
    },
    // 获取积分数
    getPointList(){
      getPoint().then(response=>{
        this.list=response.data.data
        this.thisMonthPoint=response.data.data.thisMonthPoint
        this.lastMonthPoint=response.data.data.lastMonthPoint
        this.thisWeekPoint=response.data.data.thisWeekPoint
        this.lastWeekPoint=response.data.data.lastWeekPoint
        for(let i in this.list.weekDashBoardPointVos){
          this.weekDashBoardPointVos.push(this.list.weekDashBoardPointVos[i])
        }
        this.monthPointSum=this.GetPercent(this.thisMonthPoint,this.lastMonthPoint)
        this.weekPointSum=this.GetPercent(this.thisWeekPoint,this.lastWeekPoint)
      })
    },
    //订单
    showOrderToday(){
      this.isOrderToday=true
      this.isOrderMonth=false
      this.isOrderWeek=false
      var now = new Date();  
      var nowTime = now.getTime();  
      var day = now.getDay();  
      var oneDayLong = 24 * 60 * 60 * 1000; 
      var date=[]
      for (var i = 1; i < 8; i++) {  
        var SundayTime = nowTime + (i - day) * oneDayLong;  
        var SundayTime = new Date(SundayTime);  
        var y = SundayTime.getFullYear();//年  
        var m = SundayTime.getMonth() + 1;//月  
        var d = SundayTime.getDate();//日  
        var h = SundayTime.getHours();//时  
        var mm = SundayTime.getMinutes();//分  
        var s = SundayTime.getSeconds();//秒  
        date.push(m+'-'+d)
      }
      let myChart = this.$echarts.init(document.getElementById('orderMyChart'))
      myChart.setOption({
        title: { text: '今日订单统计' },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#DBEEFC'
            }
          }
            },
            xAxis: {
                data:date
            },
            yAxis: {},
            series: [{
                name: '订单数量',
                type: 'line',
                data:[153,652,45,125,778,65,124]
            }]
        })
    },
    showOrderMonth(){
      this.isOrderToday=false
      this.isOrderMonth=true
      this.isOrderWeek=false
      var now = new Date();  
      var nowTime = now.getTime();  
      var day = now.getDay();  
      var oneDayLong = 24 * 60 * 60 * 1000; 
      var month=now.getMonth()+1
      var day=this.getWeeks(2019,month)
      var arr=[]
      for(var i=1;i<=day;i++){
        arr.push(this.getWeekTime(2019,month,i))
      }
      let myChart = this.$echarts.init(document.getElementById('orderMyChart'))
      myChart.setOption({
        title: { text: '本月订单统计' },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#DBEEFC'
            }
          }
            },
            xAxis: {
                data:arr
            },
            yAxis: {},
            series: [{
                name: '订单数量',
                type: 'line',
                data:[534,610,243,879,456,456,123]
            }]
        })
    },
    showOrderWeek(){
      this.isOrderToday=false
      this.isOrderMonth=false
      this.isOrderWeek=true
      var now = new Date();  
      var nowTime = now.getTime();  
      var day = now.getDay();  
      var oneDayLong = 24 * 60 * 60 * 1000; 
      var date=[]
      for (var i = 1; i < 8; i++) {  
        var SundayTime = nowTime + (i - day) * oneDayLong;  
        var SundayTime = new Date(SundayTime);  
        var y = SundayTime.getFullYear();//年  
        var m = SundayTime.getMonth() + 1;//月  
        var d = SundayTime.getDate();//日  
        var h = SundayTime.getHours();//时  
        var mm = SundayTime.getMinutes();//分  
        var s = SundayTime.getSeconds();//秒  
        date.push(m+'-'+d)
      }
      let myChart = this.$echarts.init(document.getElementById('orderMyChart'))
      myChart.setOption({
        title: { text: '本周订单统计' },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#DBEEFC'
            }
          }
            },
            xAxis: {
                data:date
            },
            yAxis: {},
            series: [{
                name: '订单数量',
                type: 'line',
                data:[120,123,410,263,487,674,134]
            }]
        })
    },
    orderCharts(){
            var now = new Date();  
            var nowTime = now.getTime();  
            var day = now.getDay();  
            var oneDayLong = 24 * 60 * 60 * 1000; 
            var date=[]
            for (var i = 1; i < 8; i++) {  
                var SundayTime = nowTime + (i - day) * oneDayLong;  
                var SundayTime = new Date(SundayTime);  
                var y = SundayTime.getFullYear();//年  
                var m = SundayTime.getMonth() + 1;//月  
                var d = SundayTime.getDate();//日  
                var h = SundayTime.getHours();//时  
                var mm = SundayTime.getMinutes();//分  
                var s = SundayTime.getSeconds();//秒  
                date.push(m+'-'+d)
            }  
        let myChart = this.$echarts.init(document.getElementById('orderMyChart'))
        myChart.setOption({
            title: { text: '本周订单统计' },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#DBEEFC'
                }
              }
            },
            xAxis: {
                data:date
            },
            yAxis: {},
            series: [{
                name: '订单数量统计',
                type: 'line',
                data:[120,654,35,856,452,254,360]
            }]
        })
    },
    // 销售额
    orderTotalCharts(){
            var now = new Date();  
            var nowTime = now.getTime();  
            var day = now.getDay();  
            var oneDayLong = 24 * 60 * 60 * 1000; 
            var date=[]
            for (var i = 1; i < 8; i++) {  
                var SundayTime = nowTime + (i - day) * oneDayLong;  
                var SundayTime = new Date(SundayTime);  
                var y = SundayTime.getFullYear();//年  
                var m = SundayTime.getMonth() + 1;//月  
                var d = SundayTime.getDate();//日  
                var h = SundayTime.getHours();//时  
                var mm = SundayTime.getMinutes();//分  
                var s = SundayTime.getSeconds();//秒  
                date.push(m+'-'+d)
            }  
        let myChart = this.$echarts.init(document.getElementById('orderTotalCharts'))
        myChart.setOption({
            title: { text: '本周销售额统计' },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#DBEEFC'
                }
              }
            },
            xAxis: {
                data:date
            },
            yAxis: {},
            series: [{
                name: '销售额数量',
                type: 'line',
                data:[88,52,45,36,54,87,96]
            }]
        })
    },
    showOrderTotalToday(){
      this.isTodayOrderTotal=true
      this.isMonthOrderTotal=false
      this.isWeekOrderTotal=false
      var now = new Date();  
            var nowTime = now.getTime();  
            var day = now.getDay();  
            var oneDayLong = 24 * 60 * 60 * 1000; 
            var date=[]
            for (var i = 1; i < 8; i++) {  
                var SundayTime = nowTime + (i - day) * oneDayLong;  
                var SundayTime = new Date(SundayTime);  
                var y = SundayTime.getFullYear();//年  
                var m = SundayTime.getMonth() + 1;//月  
                var d = SundayTime.getDate();//日  
                var h = SundayTime.getHours();//时  
                var mm = SundayTime.getMinutes();//分  
                var s = SundayTime.getSeconds();//秒  
                date.push(m+'-'+d)
            }  
        let myChart = this.$echarts.init(document.getElementById('orderTotalCharts'))
        myChart.setOption({
            title: { text: '今日销售额统计' },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#DBEEFC'
                }
              }
            },
            xAxis: {
                data:date
            },
            yAxis: {},
            series: [{
                name: '销售额数量',
                type: 'line',
                data:[88,56,25,98,63,78,42]
            }]
        })
    },
    showOrderTotalWeek(){
      this.isTodayOrderTotal=false
      this.isMonthOrderTotal=false
      this.isWeekOrderTotal=true
      var now = new Date();  
            var nowTime = now.getTime();  
            var day = now.getDay();  
            var oneDayLong = 24 * 60 * 60 * 1000; 
            var date=[]
            for (var i = 1; i < 8; i++) {  
                var SundayTime = nowTime + (i - day) * oneDayLong;  
                var SundayTime = new Date(SundayTime);  
                var y = SundayTime.getFullYear();//年  
                var m = SundayTime.getMonth() + 1;//月  
                var d = SundayTime.getDate();//日  
                var h = SundayTime.getHours();//时  
                var mm = SundayTime.getMinutes();//分  
                var s = SundayTime.getSeconds();//秒  
                date.push(m+'-'+d)
            }  
        let myChart = this.$echarts.init(document.getElementById('orderTotalCharts'))
        myChart.setOption({
            title: { text: '本周销售额统计' },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#DBEEFC'
                }
              }
            },
            xAxis: {
                data:date
            },
            yAxis: {},
            series: [{
                name: '销售额数量',
                type: 'line',
                data:[88,26,38,79,51,63,46]
            }]
        })
    },
    showOrderTotalMonth(){
      this.isTodayOrderTotal=false
      this.isMonthOrderTotal=true
      this.isWeekOrderTotal=false
      var now = new Date();  
            var nowTime = now.getTime();  
            var day = now.getDay();  
            var oneDayLong = 24 * 60 * 60 * 1000; 
            var month=now.getMonth()+1
            var day=this.getWeeks(2019,month)
            var arr=[]
            for(var i=1;i<=day;i++){
                arr.push(this.getWeekTime(2019,month,i))
            }  
        let myChart = this.$echarts.init(document.getElementById('orderTotalCharts'))
        myChart.setOption({
            title: { text: '本月销售额统计' },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#DBEEFC'
                }
              }
            },
            xAxis: {
                data:arr
            },
            yAxis: {},
            series: [{
                name: '销售额数量',
                type: 'line',
                data:[88,52,45,36,54,87,96]
            }]
        })
    },
    // 积分
    drawLine(){
            var now = new Date();  
            var nowTime = now.getTime();  
            var day = now.getDay();  
            var oneDayLong = 24 * 60 * 60 * 1000; 
            var date=[]
            for (var i = 1; i < 8; i++) {  
                var SundayTime = nowTime + (i - day) * oneDayLong;  
                var SundayTime = new Date(SundayTime);  
                var y = SundayTime.getFullYear();//年  
                var m = SundayTime.getMonth() + 1;//月  
                var d = SundayTime.getDate();//日  
                var h = SundayTime.getHours();//时  
                var mm = SundayTime.getMinutes();//分  
                var s = SundayTime.getSeconds();//秒  
                date.push(m+'-'+d)
            }  
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        myChart.setOption({
            title: { text: '本周积分统计' },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#DBEEFC'
                }
              }
            },
            xAxis: {
                data:date
            },
            yAxis: {},
            series: [{
                name: '积分兑换量',
                type: 'line',
                data:[88,444,562,763,326,951,264]
            }]
        })
    },
  getList(){
      info().then(response => {
        console.log(response)
        this.carOrderCount=response.data.data.carOrderCount
         this.giftCount=response.data.data.giftCount
        this.giftDownCount=response.data.data.giftDownCount
        this.giftUpCount=response.data.data.giftUpCount
        this.giftWronStockCount=response.data.data.giftWronStockCount
        this.groupBuyOrderCount=response.data.data.groupBuyOrderCount
        this.lastSevenDaysOrderTotal=response.data.data.lastSevenDaysOrderTotal
        this.memberCount=response.data.data.memberCount
        this.memberMonthIncreseCount=response.data.data.memberMonthIncreseCount
        this.memberTodayIncreaseCount=response.data.data.memberTodayIncreaseCount
        this.memberYesterDayIncreaseCount=response.data.data.memberYesterDayIncreaseCount
        this.todayOrderCount=response.data.data.todayOrderCount
        this.todayOrderTotal=response.data.data.todayOrderTotal
        this.todayPointTotal=response.data.data.todayPointTotal
        this.yesterdayOrderTotal=response.data.data.yesterdayOrderTotal
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
  }
}
</script>