import request from "utils/request";

const COMMON_PATH = "/admin/product"

// 获取三级分类商品的商品属性
function getAttrList(category1Id,category2Id,category3Id){
  return request.get(COMMON_PATH+`/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
}

// 为指定的三级分类商品添加商品属性
function createOrUpdateAttrValue(attrInfo){
  return request.post(COMMON_PATH+"/saveAttrInfo",attrInfo)
}

// 获取指定attrId对应的商品属性的列表
function getAttrValueList(attrId){
  return request.get(COMMON_PATH+`/getAttrValueList/${attrId}`)
}

// 删除指定attrId对应的商品属性列表
function removeAttrValueList(attrId){
  return request.delete(COMMON_PATH+`/deleteAttr/${attrId}`)
}

export {
  getAttrList,
  getAttrValueList,
  createOrUpdateAttrValue,
  removeAttrValueList
}
