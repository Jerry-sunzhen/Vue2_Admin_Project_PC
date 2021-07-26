<!--该文件负责对el-tooltip和el-button进行二次封装-->
<template>
  <el-tooltip v-bind="$props" style="margin: 5px">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </el-tooltip>
</template>

<script>
export default {
  name: "TipButton",
  // props中获取的属性都绑定给了tooltip组件,剩余的属性可以使用$attrs配合v-on绑定给button组件
  props:{
    effect:{
      type:String,
      default:"light"
    },
    placement: {
      type:String,
      default:"top"
    },
    content:String
  }
}
</script>

<style scoped lang="less">

</style>
