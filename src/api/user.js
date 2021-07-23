import request from 'utils/request'

export function login(data) {
  return request.post('/admin/acl/index/login', data)
}

export function getInfo(token) {
  return request.get('/admin/acl/index/info', {params: { token }})
}

export function logout() {
  return request.post('/admin/acl/index/logout')
}
