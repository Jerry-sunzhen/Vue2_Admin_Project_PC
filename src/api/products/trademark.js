// 定义trademark相关接口

import request from "utils/request";

// 将请求路径的公共部分进行常量抽离
const COMMON_PATH = "/admin/product/baseTrademark"

// 根据页码与每页显示数据获取品牌信息
function getBaseTrademarkWithPageAndLimit(page,limit){
  return request.get(COMMON_PATH+`/${page}/${limit}`)
}
// 新增品牌信息
function addBaseTrademark(tmName,logoUrl){
  return request.post(COMMON_PATH+"/save",{tmName,logoUrl})
}
// 修改品牌信息(需要提供修改品牌对应的id)
function updateBaseTrademark(tmName,logoUrl,id){
  return request.put(COMMON_PATH+"/update",{tmName,logoUrl,id})
}
// 删除品牌信息
function removeBaseTrademark(id){
  return request.delete(COMMON_PATH+`/remove/${id}`)
}


// 使用export关键字导出一个**代码块**(注意不是一个对象)
export {
  getBaseTrademarkWithPageAndLimit,
  addBaseTrademark,
  updateBaseTrademark,
  removeBaseTrademark
}
