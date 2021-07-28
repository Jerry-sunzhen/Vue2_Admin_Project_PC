<template>
  <div>
    <!--展示属性的界面-->
    <div v-if="!isEditMode">
      <!--如果三级分类为空,则添加属性按钮需要被禁用-->
      <el-button
        type="primary" icon="el-icon-plus"
        @click="toAddAttr" :disabled="!categoryInfo.category3Id">添加属性</el-button>
      <el-table
        ref="attrTable" :data="attrList"
        highlight-current-row border>
        <el-table-column align="center" type="index" label="序号" width="100px"></el-table-column>
        <el-table-column align="center" property="attrName" label="属性名称" min-width="250"></el-table-column>
        <el-table-column align="center" label="属性值列表" min-width="250">
          <template v-slot="{row}">
            <el-tag type="info"
                    v-for="attrVal in row.attrValueList"
                    :key="attrVal.id">{{ attrVal.valueName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="250">
          <template v-slot="{row}">
            <tip-button
              content="修改" size="mini"
              type="warning" icon="el-icon-edit" @click="toUpdateAttr(row)" />

            <el-popconfirm  :title="confirmTitle"  @onConfirm="removeAttr(row)">
              <tip-button
                content="删除" size="mini"
                type="danger" icon="el-icon-delete"
                slot="reference" />
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--编辑属性的界面-->
    <el-form ref="attrValueForm" :model="form" v-else>
      <el-form-item label="属性名" prop="name">
        <el-input v-model="form.name" style="width: 200px" placeholder="请输入属性名"></el-input>
      </el-form-item>
      <el-button
        type="primary" icon="el-icon-plus"
        :disabled="isAllowedToAddAttrValue" @click="addAttrValue">添加属性值</el-button>
      <el-table style="margin: 20px 0"
        ref="attrValueList" :data="form.attrValueList" highlight-current-row border>
        <el-table-column align="center" type="index" label="序号" width="100px"></el-table-column>
        <el-table-column align="center" label="属性值名称" min-width="250">
          <template v-slot="{row}">
            <el-input  v-model="row.valueName"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="250">
          <template v-slot="{$index}">
            <el-popconfirm @onConfirm="removeAttrValue($index)" :title="confirmTitle">
              <el-button type="danger" size="mini" icon="el-icon-delete" slot="reference"></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary" @click="createOrUpdateAttrValueList"
        :disabled="isAllowedToSave"
      >保存</el-button>
      <el-button @click="cancelAttrEdit">取消</el-button>
    </el-form>
  </div>
</template>

<script>
import _ from "lodash"
export default {
  name: "AttrBoard",
  created() {
    // 在初始化属性展示版面的时候注册selectorChange事件,
    // 当attrCategorySelector中的select选中值发生改变的时候emit该事件
    this.$bus.$on("selectorChange",async(payload)=>{
      // 根据传入的payload对象中的level属性确定需要修改的是哪个categoryId
      switch (payload.level){
        case 1:
          // 将category1Id同步至categoryInfo中,
          this.categoryInfo.category1Id = payload.categoryId
          // 初始化category2Id,category3Id
          this.categoryInfo.category2Id = ""
          this.categoryInfo.category3Id = ""
          break
        case 2:
          this.categoryInfo.category2Id = payload.categoryId
          this.categoryInfo.category3Id = ""
          break
        case 3:
          // 如果传入的是第三级分类,那么需要发送请求获取对应的属性列表进行渲染
          this.categoryInfo.category3Id = payload.categoryId
          // 发送请求获取属性列表信息
          await this.getAttrList()
          break
      }
    })
  },
  data(){
    return {
      isEditMode:false,
      // 存放selectChange事件传送过来的category参数
      categoryInfo:{
        category1Id:"",
        category2Id:"",
        category3Id:""
      },
      attrList: [], // 三级分类对应的属性列表
      confirmTitle:"确定删除该属性吗?",   // popConfirm弹框显示数据
      form:{
        name:"",
        attrValueList:[],
        id:""
      },
      // 设置两个布尔值用来实时监听form中的attrValueList中每个对象
      isItemValueNameExist:true,    // 是否所有的ValueName都存在(需要额外考虑attrValueList为空的情况)
      isItemValueNameDuplicate:false // attrValueList中是否存在重复的属性名

    }
  },
  computed:{
    // 禁用添加属性值按钮的情况,返回值为true保存按钮就会被禁用
    // 1. 属性名为空 2. 属性值存在重名 3. 属性值存在重复
    isAllowedToAddAttrValue(){
      return !this.form.name || this.isItemValueNameDuplicate || !this.isItemValueNameExist
    },
    // 禁用保存属性值按钮的情况,返回值为true保存按钮就会被禁用
    // 1. attrValueList数组为空 2. 数组中属性名存在重复 3. 数组中属性名存在空值
    isAllowedToSave(){
      return !this.form.attrValueList.length || this.isItemValueNameDuplicate || !this.isItemValueNameExist
    },

    // 由于watch监听的是一个对象,因此如果需要获取对象修改的新值与旧值,可以利用计算属性进行监听
    getOldAttrValueList(){
      // 使用lodash进行深拷贝
      return _.cloneDeep(this.form.attrValueList)
    }
  },
  watch:{
    // 监听isEditMode属性的变化,一旦切换为编辑模式
    isEditMode(newVal){
      // 1. 向selector发射一个事件,让selector修改三个select选择框的可用状态
      this.$emit("editModeChange",newVal)

      // 当editMode被关闭
      if(newVal === false){
        // 2. 清空form.attrValueList中的数据
        this.form.name = ""
        this.form.attrValueList = []

        // 3. 需要重新进行展示界面数据请求
        this.getAttrList()
      }
    },

    getOldAttrValueList:{
      handler(newList,oldList){
        this.isItemValueNameExist = newList.every(item=>!!item.valueName)
        if(!this.isItemValueNameExist && (newList.length === oldList.length)){
          this.$message.warning("属性值不能为空")
        }
        this.isItemValueNameDuplicate = this.isValueNameDuplicate()
        if(this.isItemValueNameDuplicate){
          this.$message.warning("属性值不能重复")
        }
      },
      deep:true
    }

  },
  methods:{
    // 获取属性列表并同步到attrList中
    async getAttrList(){
      const { category1Id,category2Id,category3Id } = this.categoryInfo
      const {code,data} = await this.$api.products.productAttr.getAttrList(category1Id,category2Id,category3Id)
      if(code === 200){
        this.attrList = data
      }
    },


    // 点击添加属性触发
    toAddAttr(){
      this.isEditMode = true
    },

    // 点击添加属性值触发
    addAttrValue(){
      this.form.attrValueList.push({
        valueName:""
      })
    },

    // 点击属性列表后的修改按钮触发
    async toUpdateAttr(row){
      const {code,data} = await this.$api.products.productAttr.getAttrValueList(row.id)
      if(code === 200){
        this.form = {
          name:row.attrName,
          attrValueList:data,
          id:row.id
        }
        this.isEditMode = true
      }
    },

    // 点击属性列表后的删除按钮,弹出popConfirm后触发的事件
    async removeAttr(row){
      // 调用删除属性的接口
      const {code} =await this.$api.products.productAttr.removeAttrValueList(row.id)
      if(code === 200 ){
        this.$message.success("删除成功")
        await this.getAttrList()
      }
    },

    // 删除attr中value的函数
    removeAttrValue(index){
      this.form.attrValueList.splice(index,1)
    },

    // 新增一组attr属性
    async createOrUpdateAttrValueList(){
      const attrInfo = {
        attrName:this.form.name,
        attrValueList: this.form.attrValueList,
        categoryId: this.categoryInfo.category3Id,
        id:this.form.id,
        categoryLevel:3
      }
      // 发送请求新增/更新attrValue
      const {code} = await this.$api.products.productAttr.createOrUpdateAttrValue(attrInfo)
      if(code === 200){
        this.$message.success("添加属性成功")
        this.isEditMode = false
      }
    },

    cancelAttrEdit(){
      this.isEditMode = false
    },

    // 工具函数,用来判断attrValueList数组的每个对象中的valueName是否有重复
    isValueNameDuplicate(){
      const valueNameList = this.form.attrValueList.map(item=> item.valueName)
      const setArr = new Set(valueNameList)
      return setArr.size !== valueNameList.length  // 如果长度不等就说明存在重复的值
    }
  }
}
</script>

<style scoped lang="less">

</style>
