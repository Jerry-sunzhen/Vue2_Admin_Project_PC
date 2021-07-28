<template>
  <el-form ref="attrForm" :model="form" inline>
    <el-form-item label="一级分类">
      <el-select
        v-model="category1Id" placeholder="请选择"
        @change="category1Change" :disabled="isEdit">
        <el-option
          v-for="cate1 in category1List" :key="cate1.id"
          :label="cate1.name" :value="cate1.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select
        v-model="category2Id" placeholder="请选择"
        @change="category2Change" :disabled="isEdit">
        <el-option
          v-for="cate2 in category2List" :key="cate2.id"
          :label="cate2.name" :value="cate2.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select
        v-model="category3Id" placeholder="请选择"
        @change="category3Change" :disabled="isEdit">
        <el-option
          v-for="cate3 in category3List" :key="cate3.id"
          :label="cate3.name" :value="cate3.id" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "CategorySelector",
  props:{
    // board是否为编辑状态,初始化为false,则三级分类的selector都处于可用状态
    isEdit:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      form:{},
      category1List:[],
      category1Id:"",
      category2List:[],
      category2Id:"",
      category3List:[],
      category3Id:"",

    }
  },

  async created() {
    // 在初始化钩子中请求一级分类包含的数据
    const {code,data} = await this.$api.products.category.getFirstCategory()
    if(code === 200){
      this.category1List = data
    }
  },
  methods:{
    // 只要三级分类中的任意一级内容发生了改变,就需要使用事件总线向外发射数据
    // 发射数据格式统一为一个对象{level:"",categoryId:""}


    // 一级分类中的选项改变时触发
    async category1Change(cate1Id){
      // 当一级分类发生改变时,首先初始化二级三级分类中的数据
      this.initCategory2()
      this.initCategory3()

      // 获取到选中的一级分类的id
      this.category1Id = cate1Id
      this.$bus.$emit("selectorChange",{level:1,categoryId:cate1Id})

      const {code,data} = await this.$api.products.category.getSecondCategory(cate1Id)
      if(code === 200){
        this.category2List = data
      }
    },

    // 二级分类中的选项改变时触发
    async category2Change(cate2Id){
      // 当二级分类发生改变时,首先初始化三级分类中的数据
      this.initCategory3()

      this.category2Id = cate2Id
      this.$bus.$emit("selectorChange",{level:2,categoryId:cate2Id})
      const {code,data} = await this.$api.products.category.getThirdCategory(cate2Id)
      if(code === 200){
        this.category3List = data
      }
    },

    // 三级分类中选项发生改变时触发
    async category3Change(cate3Id){
      this.category3Id = cate3Id
      this.$bus.$emit("selectorChange",{level:3,categoryId:cate3Id})
    },
    initCategory2(){
      this.category2List = []
      this.category2Id = ""

    },
    initCategory3(){
      this.category3List = []
      this.category3Id = ""
    }
  }
}
</script>

<style scoped lang="less">

</style>
