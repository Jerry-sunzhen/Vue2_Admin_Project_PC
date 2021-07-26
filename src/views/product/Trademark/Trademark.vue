<template>
  <div>
    <!--添加品牌-->
    <el-button type="primary" style="margin: 10px"
               @click="createOpenDialog" icon="el-icon-plus">添加</el-button>

    <!--表格区域-->
    <el-table
      ref="singleTable" :data="tableData"
      highlight-current-row @current-change="handleCurrentRowChange"
      style="width: 95%; margin:10px" border>
      <el-table-column align="center" type="index" label="序号" width="100px"></el-table-column>
      <el-table-column align="center" property="tmName" label="品牌名称" min-width="270"></el-table-column>
      <el-table-column align="center" label="品牌Logo" min-width="270">
        <!--通过作用域插槽可以拿到该table-column中每个row的信息-->
        <template v-slot="{row}">
          <img style="width: 100px; height: 100px" :src="row.logoUrl" alt=""/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="270">
        <template v-slot="{row}">
          <el-button type="warning" icon="el-icon-edit" @click="updateOpenDialog(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removeTrademark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页区域-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentPageChange"
      style="text-align: center"
      :current-page="currentPage"
      :page-sizes="[1,2,3,4,5]"
      :page-size="pageSize"
      layout=" prev, pager, next, jumper, ->, sizes, total"
      :total="total">
    </el-pagination>

    <!--添加/修改品牌弹窗-->
    <el-dialog
      :title="this.isDialogEdit?'编辑':'添加'+'品牌'"
      :visible.sync="dialogVisible"
      width="60%">
      <el-form ref="trademarkForm" :model="form" :rules="rules">
        <el-form-item label="品牌名称"  prop="name">
          <el-input v-model="form.name" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="品牌Logo" prop="logoUrl" ref="upload">
          <el-upload
            class="avatar-uploader"
            :action="upLoadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" alt="">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过300KB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createOrUpdateTrademark">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "trademark",
  data() {
    return {
      tableData: [],    // 当前页所有品牌信息
      currentRow:"",    // 当前被选中的高亮页
      currentPage: 1,   // 当前页码
      pageSize: 3,      // 每页可显示品牌数量
      total: 0,        // 总品牌数量
      dialogVisible:false,  // 弹出框是否可见
      upLoadUrl:"/dev-api/admin/product/fileUpload", // 品牌图片上传的接口地址
      form:{
        name:"",
        logoUrl:"",
        id:""
      },                // 需要修改的表格信息
      // 通过prop属性对form中的el-form-item进行校验,如果不通过,则无法进行提交
      rules:{
        name:[
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度必须在3-10个字符', trigger: 'blur' }
        ],
        logoUrl:[
          { required: true, message: '请上传品牌logo', trigger: 'blur' },
        ]
      }
    }
  },
  async created() {
    // 根据data中的当前页与每页显示数量进行请求获取品牌信息
    await this.getTrademark()
  },
  methods: {
    // 获取品牌信息的函数
    async getTrademark() {
      const {code, data} = await this.$api.products
        .trademark.getBaseTrademarkWithPageAndLimit(this.currentPage, this.pageSize)
      if (code === 200) {
        this.tableData = data.records
        this.total = data.total
      }
    },
    // 当前行被选中时触发该函数
    handleCurrentRowChange(row) {
      this.currentRow = row
    },
    // 当前页码被修改时触发
    handleCurrentPageChange(page) {
      this.currentPage = page
      this.getTrademark()
    },

    // 当分页的选择每页显示品牌个数被修改时触发
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.getTrademark()
    },

    // 点击添加品牌时触发新增品牌的弹窗显示
    createOpenDialog(){
      // 新增品牌的弹窗出现之前,将form中的信息清空
      this.form = {
        name:"",
        logoUrl:"",
        id:""
      }
      this.dialogVisible = true
    },

    // 点击修改品牌时打开的修改品牌弹窗
    updateOpenDialog(row){
      // 从作用域接口中获取需要修改商标的信息,同步到form状态中,并打开弹窗
      this.form = {
        name:row.tmName,
        logoUrl:row.logoUrl,
        id:row.id
      }
      this.dialogVisible = true
    },

    // 图片上传成功的回调,可以接收三个参数response,file,fileList
    // 上传成功之后在response中可以拿到接口返回的图片Url,保存到data中
    handleAvatarSuccess(response){
      const {code,data} = response
      if(code === 200){
        this.form.logoUrl = data
      }else{
        this.$message.error("图片上传失败")
      }

      // 新图片上传成功后,清除上一次校验可能存在的提示
      this.$refs.upload.clearValidate()
    },

    // 对上传的图片进行校验,如果该函数的返回值为false,那么将停止上传
    beforeAvatarUpload(file){
      // 对图片大小进行校验
      const isLt300KB = (file.size / 1024  < 300) // 图片是否小于300KB
      const isJPG = file.type === 'image/jpeg'
      if(!isLt300KB) this.$message.error("图片不能大于300KB")
      if(!isJPG) this.$message.error("图片格式必须为JPG")
      // 如果上述两个条件不全为true,那么图片就不会同步到form的logoUrl中
      return isLt300KB && isJPG
    },

    // 新增/修改trademark的接口
    async createOrUpdateTrademark(){
      const {name,logoUrl,id} = this.form
      let code

      try {
        // 在此处获取对trademark弹窗中信息的校验结果,如果校验不通过那么就会抛出错误,进入catch逻辑
        await this.$refs.trademarkForm.validate()

        // 如果没有id那么就调用新增trademark的接口
        if(!id){
          const data = await this.$api.products.trademark.addBaseTrademark(name,logoUrl)
          code = data.code
        }
        else{
          // 如果有id那么就调用修改的接口
          const data = await this.$api.products.trademark.updateBaseTrademark(name,logoUrl,id)
          code = data.code
        }

        if(code !== 200){
          this.$message.error(`${id?"修改":"新增"}失败`)
        }

        // 操作成功后,将添加/修改的弹窗进行关闭,将当前页码重置到第一页,重新获取trademark信息
        this.dialogVisible = false
        this.currentPage = 1
        await this.getTrademark()
        this.$message.success(`${id?"修改":"新增"}成功`)

      }catch (e) {
        this.$message.closeAll()
        this.$message.error(`${id?"修改":"新增"}失败`)
      }
    },

    // 删除trademark的接口
    async removeTrademark(row){
      // 注意: 删除之前一定要进行弹窗确认!!!
      try {
        await this.$confirm('此操作将永久删除该品牌, 是否继续?', '删除品牌',{
          cancelButtonText:"取消",
          confirmButtonText:"确认"
        })

        const {code} = await this.$api.products.trademark.removeBaseTrademark(row.id)
        if(code === 200){
          this.$message.success("删除成功")
        }
        // 删除成功之后需要判断当前页与总页数的关系,对当前页进行修正
        // 如果当前页的tableData只有一条数据,并且total的值不是1,那么让当前页码-1(避免删除刷新之后当前页为空白)
        if(this.tableData.length ===1 && this.total !== 1){
          this.currentPage -= 1
        }
        // 重新请求接口获取最新的trademark信息
        await this.getTrademark()
      }catch (e) {}
    }
  },
  computed:{
    // 当前打开trademark中diaLog弹窗是否为编辑操作
    isDialogEdit(){
      return !!this.form.id
    }
  }
}
</script>

<style scoped lang="less">
.avatar-uploader /deep/.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader /deep/.el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
