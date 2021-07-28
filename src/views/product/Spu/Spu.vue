<template>
  <div>
    <el-card style="margin: 10px">
      <category-selector />
    </el-card>
    <el-card style="margin: 10px">
      <spu-board />
    </el-card>
    <el-card style="margin: 10px">
      <spu-edit />
    </el-card>
  </div>
</template>

<script>
import SpuEdit from "views/product/Spu/SpuEdit"
import SpuBoard from "views/product/Spu/SpuBoard"
export default {
  name: "Spu",
  data(){
    return {
      input:""
    }
  },
  methods:{

  },
  components:{
    SpuEdit,
    SpuBoard
  }
}
</script>

<style scoped lang="less">

</style>
