<template>
  <div>
    <el-button type="primary" style="margin: 10px">主要按钮</el-button>
    <!--表格区域-->
    <el-table
      ref="singleTable" :data="tableData" highlight-current-row
      @current-change="handleCurrentRowChange" style="width: 90%; margin:10px">
      <el-table-column align="center" type="index" label="序号" width="100" ></el-table-column>
      <el-table-column align="center" property="tmName" label="品牌名称" width="270" ></el-table-column>
      <el-table-column align="center" label="品牌Logo" width="270" >
        <!--通过作用域插槽可以拿到该table-column中每个row的信息-->
        <template v-slot="{row}">
          <img style="width: 100px; height: 100px" :src="row.logoUrl" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="270">
        <el-button type="warning" icon="el-icon-edit">修改</el-button>
        <el-button type="danger" icon="el-icon-delete">删除</el-button>
      </el-table-column>
    </el-table>
    <!--分页区域-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentPageChange"
      :current-page="currentPage"
      :page-sizes="[1,2,3,4,5]"
      :page-size="pageSize"
      layout=" prev, pager, next, jumper, ->, sizes, total"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "trademark",
  data(){
    return {
      tableData:[],    // 当前页所有品牌信息
      currentPage:2,   // 当前页码
      pageSize:5,      // 每页可显示品牌数量
      total:0,        // 总品牌数量
    }
  },
  async created() {
    // 根据data中的当前页与每页显示数量进行请求获取品牌信息
    await this.getTrademark(this.currentPage,this.pageSize)
  },
  methods:{
    // 获取品牌信息的函数
    async getTrademark(page,limit){
      const {code,data} = await this.$api.products.trademark.getBaseTrademarkWithPageAndLimit(page,limit)
      if(code === 200){
        this.tableData = data.records
        this.total = data.total
      }
    },
    // 当前行被选中时触发该函数
    handleCurrentRowChange(){

    },
    // 当前页码被修改时触发
    handleCurrentPageChange(){

    },
    // 当分页的选择每页显示品牌个数被修改时触发
    handleSizeChange(){

    },

  }
}
</script>

<style scoped lang="less">

</style>
