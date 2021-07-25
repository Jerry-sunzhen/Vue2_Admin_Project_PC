// 将mock的接口修改为本项目的登录接口

import request from 'utils/request'

const COMMON_PATH = "/admin/acl/index"

export function login(data) {
  return request.post(COMMON_PATH+'/login', data)
}

export function getInfo(token) {
  return request.get(COMMON_PATH+'/info', {params: { token }})
}

export function logout() {
  return request.post(COMMON_PATH+'/logout')
}
