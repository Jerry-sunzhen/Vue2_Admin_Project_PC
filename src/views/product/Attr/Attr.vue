<template>
  <div>
    <el-card style="margin: 10px" >
      <attr-category-selector />
    </el-card>
    <el-card style="margin: 10px" >
      <attr-board />
    </el-card>
  </div>
</template>

<script>
import AttrCategorySelector from "./childComps/AttrCategorySelector";
import AttrBoard from "./childComps/AttrBoard";
export default {
  name: "Attr",
  components:{
    AttrCategorySelector,
    AttrBoard
  }
}
</script>

<style scoped lang="less">

</style>
