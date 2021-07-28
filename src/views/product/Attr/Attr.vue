<template>
  <div>
    <el-card style="margin: 10px" >
      <category-selector :isEdit="isEdit"/>
    </el-card>
    <el-card style="margin: 10px" >
      <attr-board @editModeChange="editModeChange" />
    </el-card>
  </div>
</template>

<script>
import AttrBoard from "./childComps/AttrBoard";
export default {
  name: "Attr",
  data(){
    return {
      isEdit:false
    }
  },
  methods:{
    editModeChange(value){
      this.isEdit = value
    }
  },
  components:{
    AttrBoard
  }
}
</script>

<style scoped lang="less">

</style>
