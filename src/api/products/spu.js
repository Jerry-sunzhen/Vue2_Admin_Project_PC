import request from "utils/request";

const COMMON_PATH = "/admin/product"


function getSpuInfo (page,limit,category3Id){
  return request.get(COMMON_PATH+`/${page}/${limit}`,{
    params:{category3Id}
  })
}

function addSpuInfo(spuInfo){
  return request.post(COMMON_PATH+`/saveSpuInfo`,spuInfo)
}

function updateSpuInfo(spuInfo){
  return request.post(COMMON_PATH+`/updateSpuInfo`,spuInfo)
}

function removeSpuInfo(spuId){
  return request.delete(COMMON_PATH+`/deleteSpu/${spuId}`)
}

function getSpuSaleAttrList(spuId){
  return request.get(COMMON_PATH+`/spuSaleAttrList/${spuId}`)
}

function getSpuImageList(spuId){
  return request.get(COMMON_PATH+`/spuImageList/${spuId}`)
}

export {
  getSpuInfo,
  getSpuSaleAttrList,
  removeSpuInfo,
  addSpuInfo,
  updateSpuInfo
}
