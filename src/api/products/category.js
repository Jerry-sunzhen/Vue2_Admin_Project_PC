import request from "utils/request";

const COMMON_PATH = "/admin/product"

// 获取一级分类数据
function getFirstCategory(){
  return request.get(COMMON_PATH+"/getCategory1")
}

// 根据一级分类获取对应二级分类数据
function getSecondCategory(category1Id){
  return request.get(COMMON_PATH+`/getCategory2/${category1Id}`)
}

// 根据二级分类获取对应三级分类数据
function getThirdCategory(category2Id){
  return request.get(COMMON_PATH+`/getCategory3/${category2Id}`)
}


export {
  getFirstCategory,
  getSecondCategory,
  getThirdCategory
}
