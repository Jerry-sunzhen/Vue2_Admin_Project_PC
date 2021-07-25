<template>
  <div>
    Standard Product Unit
    <el-input v-model="input" placeholder="请输入内容" @change="changeFn"></el-input>
  </div>
</template>

<script>
export default {
  name: "Spu",
  data(){
    return {
      input:""
    }
  },
  methods:{
    changeFn(){
      console.log("!!!")
    }
  }
}
</script>

<style scoped lang="less">

</style>
