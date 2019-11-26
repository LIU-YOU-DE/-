<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container;" style="border:1px solid #DCDFE6;margin-bottom:20px;height:115px;">
      <div style="display:flex;justify-content:space-between;padding-right:20px;background-color:#F3F3F3;">
        <p style="display:inline-block;margin-left:10px;margin-top:20px;color:#555;font-size:15px;"><svg-icon icon-class="search" class-name="card-panel-icon svg" />筛选查找</p>
      <div>
        <el-button
        v-permission="['GET /admin/storage/list']"
        class="filter-item"
        icon="el-icon-search"
        style="margin-top:8px;display:inline-block;"
        @click="handleFilter"
      >查找</el-button>
      <el-button
        v-permission="['POST /admin/storage/create']"
        class="filter-item"
        style="margin-top:8px;display:inline-block;"
        icon="el-icon-edit"
        @click="setMask"
      >添加</el-button>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        style="margin-top:8px;display:inline-block;"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>
      <el-button
        class="filter-item"
        style="margin-top:8px;display:inline-block;"
        @click="handleDeleteList"
      >多选删除</el-button>
      </div>
      </div>

      <!-- 输入框 -->
      <div style="margin-top:10px;">
        <span class="search" style="display:inline-block;margin-left:10px;margin-top:-5px;">对象KEY:</span>
        <el-input
        v-model.trim="listQuery.key"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入对象KEY"
      />
      <span class="search" style="display:inline-block;margin-left:10px;margin-top:-5px;">对象名称:</span>
      <el-input
        v-model.trim="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入对象名称"
      />
      <span class="search" style="display:inline-block;margin-left:10px;margin-top:-5px;">添加时间:</span>
      <el-input
        v-model.trim="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入对象名称"
      />
      </div>
      
      
    </div>

    <!-- 查询结果 -->
    <div>
      <div class="tabletop">
        <p class="table-title"><svg-icon icon-class="list2" class-name="card-panel-icon svg"/>数据列表</p>
      </div>
      <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
      @select="deleteAll"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>

      <el-table-column align="center" label="对象KEY" prop="key" />

      <el-table-column align="center" label="对象名称" prop="name" />

      <el-table-column align="center" label="对象类型" prop="type" />

      <el-table-column align="center" label="对象大小(kb)" prop="size"/>

      <el-table-column align="center" property="url" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.url" width="40" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="图片链接" prop="url" />

      <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">

          <el-button size="mini" @click="copyUrlToClipboard" :data-clipboard-text="scope.row.url" class="copy">复制</el-button>

          <el-button
            v-permission="['POST /admin/storage/update']"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>

          <el-button
            v-permission="['POST /admin/storage/delete']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 添加对话框 -->
    <div class="popContainer" v-show="createboxshow" @click="setMask">
      <div class="createbox">
      <div class="tabletop" style="margin-bottom:20px;">
        <h3 class="address">上传对象</h3>
      </div>
       <el-upload
        ref="upload"
        :show-file-list="false"
        :limit="1"
        :http-request="handleUpload"
        action="#"
        list-type="picture"
      >
        <el-button style="margin-left:20px;margin-bottom:20px;">点击上传</el-button>
      </el-upload>
    </div>
    </div>


    <!-- 修改对话框 -->
    <div class="popContainer" @click="updatename" v-show="updatebox" >
      <div class="createbox">
        <div  class="tabletop" style="margin-bottom:20px;">
          <h3 class="address">*对象名称</h3>
        </div>
        <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="对象名称" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="display:flex;justify-content:flex-end;padding-right:20px;">
        <el-button @click="updatebox = false" style="margin-bottom:20px;">取消</el-button>
        <el-button @click="updateData" style="margin-left:10px;margin-bottom:20px;">确定</el-button>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  listStorage,
  createStorage,
  updateStorage,
  deleteStorage,
  deleteList
} from "@/api/storage";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import Clipboard from 'clipboard'; 

export default {
  name: "Storage",
  components: { Pagination },
  data() {
    return {
      updatebox:false,
      createboxshow:false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        key: undefined,
        name: undefined,
        sort: "add_time",
        order: "desc",
      },
      createDialogVisible: false,
      dataForm: {
        id: undefined,
        name: ""
      },
      updateDialogVisible: false,
      rules: {
        name: [{ required: true, message: "对象名称不能为空", trigger: "blur" }]
      },
      downloadLoading: false,
      tempDelArr: [],
      keylist:[]
    };
  },
  created() {
    this.getList();
  },
  methods: {
     updatename(){
      this.updatebox = false
    },
    setMask(){
      this.createboxshow = !this.createboxshow;
    },
    // 执行多选删除
    handleDeleteList(){
      this.keylist=this.tempDelArr;
      if(this.keylist!=""){
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        deleteList(this.keylist).then(response=>{
          this.$notify.success({
            title:"成功",
            message:"删除成功"
          })
          this.getList()
        })
      })
      }else{
        this.$message('请勾选您要删除的对象');
      }
    },
    deleteAll(row){
       for(let i=0;i<row.length;i++){
         this.tempDelArr.push(row[i].key)
       }
    },
    getList() {
      this.listLoading = true;
      listStorage(this.listQuery)
        .then(response => {
          this.list = response.data.data.list;
          this.total = response.data.data.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: ""
      };
    },
    handleCreate() {
      this.createDialogVisible = true;
    },
    handleUpload(item) {
      this.$refs.upload.clearFiles();

      const formData = new FormData();
      formData.append("file", item.file);
      createStorage(formData)
        .then(response => {
          let res = response.data.data
          res.key = res.fileKey
          this.list.unshift(res);
          this.$notify.success({
            title: "成功",
            message: "上传成功"
          });
          this.createboxshow = false;
          this.getList()
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("上传失败，请重新上传");
        });
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row);
      this.updatebox = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        this.dataForm.size=parseFloat(this.dataForm.size)
        if (valid) {
          updateStorage(this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v);
                  this.list.splice(index, 1, this.dataForm);
                  break;
                }
              }
              this.updatebox = false;
              this.$notify.success({
                title: "成功",
                message: "更新成功"
              });
            })
            .catch(response => {
              this.$notify.error({
                title: "失败",
                message: response.data.errmsg,
                duration: 0
              });
            });
        }
      });
    },

    // 执行删除功能
    handleDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteStorage(row.key)
            .then(response => {
              this.$notify.success({
                title: "成功",
                message: "删除成功"
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            })
            .catch(response => {
              this.$notify.error({
                title: "失败",
                message: response.data.errmsg,
                duration: 0
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "ID",
          "对象KEY",
          "对象名称",
          "对象类型",
          "对象大小",
          "访问链接"
        ];
        const filterVal = ["id", "key", "name", "type", "size", "url"];
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          "对象存储信息"
        );
        this.downloadLoading = false;
      });
    },

    // 实现一键复制功能
    copyUrlToClipboard() {
     let clipboard = new Clipboard('.copy')  
          clipboard.on('success', e => {  
            this.$notify.success({
              title:"成功",
              message:"复制成功"
            })
              clipboard.destroy()  
            })  
              clipboard.on('error', e => {  
              this.$notify.error({
                title:"失败",
                message:"浏览器不支持自动复制",
                duration: 0
              }) 
               clipboard.destroy()  
            })  

    }
  }
};
</script>

<style scoped>
  .el-button+.el-button{
    margin-left:0;
  }
  .search{
  font-size:14px;
  color:#909399;
  font-weight:600;
  display:inline-block;
  display:inline-block;
  margin-left:10px;
}
.tabletop{
  height:60px;
  width:100%;
  background:#f3f3f3;
  border-top:1px solid #EBEEF5;
  border-left:1px solid #EBEEF5;
  border-right:1px solid #EBEEF5;
}
.table-title{
  display:inline-block;
  margin-left:10px;
  margin-top:20px;
  color:#555;
  margin-right:75%;
  font-size:15px;
}
.createbox{
  position:fixed;
  background:#fff;
  border:1px solid #EBEEF5;
  width:40%;
  top:20%;
  left:30%;
}
.address{
  font-size:18px;
  color:#666;
  margin-left:20px;
  font-weight:600;
}
.popContainer{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.3);
    z-index:10001
}
.svg{
  margin-right:5px;
}
.tabletop{
  height:60px;
  width:100%;
  background:#f3f3f3;
  border-top:1px solid #EBEEF5;
  border-left:1px solid #EBEEF5;
  border-right:1px solid #EBEEF5;
}
</style>
