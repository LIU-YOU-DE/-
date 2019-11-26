<template>
  <div style="width:90%;margin:0 auto;">
    <div class="tabletop">
      <p class="address">活动编辑</p>
    </div>
    <p class="address" style="font-size:16px;margin-bottom:40px;margin-left:50px;"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />活动介绍</p>
    <div style="width:70%;margin:0 auto;">
      <el-form
        ref="goods"
        :model="goods"
        label-width="150px"
      >
        <el-form-item
          label="活动Id"
          prop="id"
          class="inputstyle"
        >
          <el-input v-model="goods.id" />
        </el-form-item>
        <el-form-item
          label="活动名称"
          prop="activityName"
          class="inputstyle"
        >
          <el-input v-model="goods.activityName" />
        </el-form-item>
        <el-form-item
          label="活动描述"
          prop="description"
        >
          <template slot-scope="scope">
            <div
              v-for="(d,index) in goods.description"
              :key="index"
              class="inputbox"
            >
              <el-input
                v-model="d.description"
                class="inputwidth"
                type="textarea"
              ></el-input>
              <i
                class="el-icon-circle-plus-outline inputicon"
                @click.prevent="inputadd"
              ></i>
              <i
                class="el-icon-remove-outline inputicon"
                @click.prevent="deleteinput(index)"
                v-if="showdeletebutton"
              ></i>
            </div>
          </template>

        </el-form-item>
        <el-form-item
          label="活动类型"
          prop="type"
        >
          <el-radio
            v-model="goods.type"
            :label="goods.type"
          >水果机抽奖</el-radio>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
          class="inputstyle"
        >
          <el-input
            v-model="goods.remark"
            type="textarea"
            autosize
          />
        </el-form-item>
      </el-form>

    </div>
      
      <p class="address" style="font-size:16px;margin-bottom:40px;margin-left:50px;"><svg-icon icon-class="qi" class-name="card-panel-icon svg" />指定奖品</p>
      <div style="width:90%;margin:0 auto;">
        <p style="font-size:14px;color:#666;">所有奖品中奖概率的和为100,如果输入小数将向下取整。</p>
      <el-button
        :plain="true"
        @click="attributeVisiable=true"
        style="margin-right:20px;margin-bottom:10px;"
      >添加</el-button>
      <span style="color:#666;font-size:16px;display:inline-block;margin-right:20px;">总点数：100</span> 
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

      <el-dialog
        :visible.sync="attributeVisiable"
        title="指定奖品"
      >
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
            v-on:keyup.enter.native="seachprize"
          />
          <el-button
            class="filter-item"
            icon="el-icon-search"
            @click="seachprize"
          >查找</el-button>
          <el-table
            border
            highlight-current-row
            class="prizebox"
            :data="list"
            @selection-change="changeFun"
          >
            <el-table-column
              type="selection"
              width="55"
              @selection-change="changeFun"
            />
            <el-table-column
              align="center"
              label="奖品ID"
              prop="prizeId"
            />
            <el-table-column
              align="center"
              label="奖品名称"
              prop="prizeName"
            />
            <el-table-column
              align="center"
              label="奖品图片"
              prop="imgUrl"
            >
              <template slot-scope="scope">
                <img
                  :src="scope.row.imgUrl"
                  width="40"
                >
              </template>
            </el-table-column>
          </el-table>

        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="attributeVisiable = false">取消</el-button>
          <el-button
            @click="handprize"
          >确定</el-button>
        </div>
      </el-dialog>

      <div style="display:flex;justify-content:center;margin-top:20px;">
        <el-button @click="handUpdateActivity" style="margin-top:10px;margin-left:20px;">更新活动</el-button>
      </div>
    </el-form>
  </div>
</template>


<script>
import {
  updateactivity,
  uploadPath,
  getactivity,
  getprize
} from "@/api/storage";
import { getToken } from "@/utils/auth";

export default {
  data() {
    return {
      radio: "",
      list: [],
      attributeVisiable: false,
      showdeletebutton: false,
      value: "",
      val: "",
      sum: 0,
      attributeForm: { prizeName: "", description: "", imgUrl: "" },
      uploadPath,
      prizeList: [],
      prizeId: "",
      probability: {},
      prizeList4: [],
      prizeList3: {
        prizeId: "",
        probability: ""
      },
      goods: {
        activityName: "",
        description: "",
        imgUrl: "",
        prizeList: [],
        prizeName: "",
        remark: "",
        type: ""
      }
    };
  },
  computed: {
    headers() {
      return {
        "Mf-Token": getToken()
      };
    }
  },
  created() {
    this.getactivitylist();
  },
  methods: {
    deleteinput(index) {
      this.goods.description.splice(index, 1);
      if (this.goods.description.length == 1) {
        this.showdeletebutton = false;
      }
    },
    inputadd() {
      this.goods.description.push({});
      if (this.goods.description.length >= 0) {
        this.showdeletebutton = true;
      }
    },
    // 删除奖品
    deletePrize(row) {
 
      var index = this.prizeList.indexOf(row);
      this.prizeList.splice(index,1)
    },
    test(event, id) {
      this.sum = 0;
      this.prizeList.forEach(ele => {
        ele.prizeId === id ? (ele.probability = Math.floor(event)) : "";
        this.sum = this.sum + ele.probability;
      });

      if (this.sum > 100) {
        this.$alert("所有奖品的中奖概率大于100，请检查并重新设置");
      }
    },
    handprize() {
      for (var i = 0; i < this.choosedata.length; i++) {
        let prise = this.choosedata[i];
        // prise.probability = 30
        this.prizeList.push(prise);
      }
      this.attributeVisiable = false;
    },
    seachprize() {
      getprize(this.attributeForm.prizeName).then(response => {
        this.list = response.data.data;
        let obj = {};
        this.list.map(item => {
          obj = item;
          obj["prizeUrl"] = item["imgUrl"];
          delete obj[imgUrl];
          this.list.push(obj);
        });
      });
    },
    // 更新商品
    handUpdateActivity() {
      let sum = 0
      this.prizeList.forEach(ele => {
        sum = sum+ ele.probability
      })

      if (sum != 100) {
        this.$message('该活动添加的奖品概率之和应为100')
        return 
      }
      this.prizeId = this.$route.query.id;
        
        // this.prizeList2 = {
        //   prizeId: this.prizeId,
        //   probability: this.prizeList.probability
        // };
        // this.prizeList2 = [this.prizeList2];
        let description = []
        this.goods.description.forEach(ele => {
          description.push(ele.description)
        })
        const activityform = {
          activityName: this.goods.activityName,
          description,
          prizeList: this.prizeList,
          remark: this.goods.remark,
          type: this.goods.type
        };
        updateactivity(this.prizeId, activityform)
          .then(response => {
            this.$notify.success({
              title: "成功",
              message: "更新成功"
            });
            this.$router.push({ path: "/test-marketing/test-activity" });
          })
          .catch(response => {
            this.$notify.error({
              title: "失败",
              message: response.data.errmsg,
              duration: 0
            });
          });
      
    },
    getactivitylist() {
      this.prizeId = this.$route.query.id;
      getactivity(this.prizeId).then(response => {
        this.goods = response.data.data;
        if (this.goods.description.length > 1) {
          this.showdeletebutton = true;
        }
        console.log(this.goods.description)
        let tempArr = []
        this.goods.description.forEach(ele => {
          tempArr.push({description: ele})
        })
        this.goods.description = tempArr
        this.prizeList = response.data.data.prizeList;
      });
    },
    changeFun(data) {
      this.choosedata = data;
    }
  }
};
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
.prizeListBox {
  display: flex !important;
  margin: 0;
}
.el-form-item .el-form-item--medium {
  width: 200px;
}
.el-form-item__content {
  margin-left: 0px;
}
.inputicon {
  font-size:25px!important;
  margin-left:10px;
  margin-top:5px;
  color:#888;
}
.inputbox {
  display: flex !important;
  display: inline;
}
.inputwidth {
  width: 700px !important;
  margin-bottom:5px;
}
.inputstyle{
  width:850px!important;
}
</style>