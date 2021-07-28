<template>
 <div>
   <el-button
     type="primary" icon="el-icon-plus"
     @click="toAddSpuInfo" :disabled="!category3Id">添加SPU</el-button>
   <el-table
     ref="attrTable" :data="spuList"
     highlight-current-row border>
     <el-table-column align="center" type="index" label="序号" width="100px" />
     <el-table-column align="center" property="spuName" label="SPU名称" min-width="250" />
     <el-table-column align="center" property="description" label="SPU描述" min-width="250" />
     <el-table-column align="center" label="操作" min-width="250">
       <template v-slot="{row}">
         <tip-button
           content="添加SPU" size="mini"
           type="primary" icon="el-icon-plus" @click="toUpdateSpuInfo(row)" />
         <tip-button
           content="修改SPU" size="mini"
           type="primary" icon="el-icon-edit" @click="toUpdateSpuInfo(row)" />
         <tip-button
           content="查看SPU列表" size="mini"
           type="info" icon="el-icon-info" @click="toUpdateSpuInfo(row)" />

         <el-popconfirm  title="confirmTitle"  @onConfirm="removeSpu(row)">
           <tip-button
             content="删除SPU" size="mini"
             type="danger" icon="el-icon-delete"
             slot="reference" />
         </el-popconfirm>
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
 </div>
</template>

<script>
export default {
  name: "SpuBoard",
  created() {
    // 在初始化属性展示版面的时候注册selectorChange事件,
    // 当attrCategorySelector中的select选中值发生改变的时候emit该事件
    this.$bus.$on("selectorChange",async(payload)=>{
      // 根据传入的payload对象中的level属性确定需要修改的是哪个categoryId
      switch (payload.level){
        case 1:
          // 将category1Id同步至categoryInfo中,
          this.category1Id = payload.categoryId
          // 初始化category2Id,category3Id
          this.category2Id = ""
          this.category3Id = ""
          break
        case 2:
          this.category2Id = payload.categoryId
          this.category3Id = ""
          break
        case 3:
          // 如果传入的是第三级分类,那么需要发送请求获取对应的属性列表进行渲染
          this.category3Id = payload.categoryId
          // 发送请求获取属性列表信息
          await this.getSpuInfoList()
          break
      }
    })
  },
  data(){
    return {
      // 三级下拉框相关
      category1Id:"",
      category2Id:"",
      category3Id:61,
      spuList:[],
      // 分页相关
      currentPage: 1,   // 当前页码
      pageSize: 5,      // 每页可显示品牌数量
      total: 0,
    }
  },
  methods:{

    async getSpuInfoList(){
      const {code,data} = await this.$api.products.spu
                                .getSpuInfo(this.currentPage,this.pageSize,this.category3Id)
      this.spuList = data.records
      this.total = data.total
    },

    handleSizeChange(size){
      this.pageSize = size
      this.currentPage = 1
      this.getSpuInfoList()
    },
    handleCurrentPageChange(page){
      this.currentPage = page
      this.getSpuInfoList()
    },

    // 跳转到编辑界面新增spuInfo
    toAddSpuInfo(){

    },

    // 跳转到编辑界面进行spuInfo的修改
    toUpdateSpuInfo(){

    },

    // 移除spuInfo
    removeSpu(){

    }
  },
  // 测试结束删除
  mounted() {
    this.getSpuInfoList()
  }
}
</script>

<style scoped lang="less">

</style>
