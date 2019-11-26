<template>
    <div class="box">
        <el-button @click="goback" style="margin-top:20px;">返回</el-button> 
        <div class="tabletop">
            <p class="address">发货列表</p>
        </div>
        <el-table :data="list" border>
            <el-table-column align="center" label="订单编号" prop="orderId"></el-table-column>

            <el-table-column align="center" label="收货人" prop="memberName"></el-table-column>

            <el-table-column align="center" label="手机号码" prop="memberPhoneNumber"></el-table-column>

            <el-table-column align="center" label="收货地址" prop="memberAddress"></el-table-column>

            <el-table-column align="center" label="配送方式">
                <template slot-scope="scope">
                     <el-select v-model="value" placeholder="请选择物流公司" @change="handleChange">
                        <el-option
                        v-for="item in logisticsList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>

            <el-table-column align="center" label="物流单号">
                <tamplate slot-scope="scope">
                    <el-input v-model="listQuery.logisticCode"></el-input>
                </tamplate>
            </el-table-column>

            <el-table-column align="center" label="操作" prop="prizeId">
                <tamplate slot-scope="scope">
                    <el-button size="mini" @click="createLogistics">确定</el-button>
                </tamplate>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { detailOrder, orderShip} from "@/api/order";


export default {
    data(){
        return {
            list:[],
            value:'',
            listQuery:{
                id:undefined,
                orderType:undefined,
                shipperCode:undefined,  //快递公司
                logisticCode:undefined  //单号
            },
            logisticsList:[
                {
                    value:"ZTO",
                    label:"中通快递"
                },
                {
                    value:"STO",
                    label:"申通快递"
                },
                {
                    value:"YTO",
                    label:"圆通快递"
                }
            ]
        }
    },
    created(){
        this.getlist()
    },
    methods:{
        // 获取物流单号
        createLogistics(){
            var type
            var id
            for(var i=0;i<this.list.length;i++){
                type=this.list[i].type
            }
            id=this.$route.query.id
            const shipForm={
                id:id,
                orderType:type,
                shipperCode:this.listQuery.shipperCode,
                logisticCode:this.listQuery.logisticCode
            }
            orderShip(shipForm).then(response=>{
                this.$notify.success({
                    title:"成功",
                    message:"发货成功"
                })
                this.$router.push({path:"/test-goods/test-orders"})
            }).catch(response=>{
                this.$notify.error({
                    title:"失败",
                    message:response.data.errmsg,
                    duration:0
                })
            })
        },
        // 获取选中的物流公司
        handleChange(value){
            this.listQuery.shipperCode=value
        },
        goback(){
            this.$router.push({path:'/test-goods/test-orders'})
        },
        getlist(){
            detailOrder(this.$route.query.id).then(response=>{
                this.list=[response.data.data]
            })
        }
    }
}
</script>
<style scoped>
.box{
    width:90%;
    margin:0 auto;
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
.address{
  font-size:18px;
  color:#666;
  margin-left:20px;
  font-weight:600;
}
</style>