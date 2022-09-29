import request from '@/utils/request'

export function getCompanyById(id) {
  return request({
    method: 'GET',
    url: '/company/' + id
  })
}

export function getRolesList(params) {
  return request({
    method: 'GET',
    url: '/sys/role',
    // data,post,put传参是通过data
    params// get,delete方式params
  })
}

export function addRole(data) {
  return request({
    method: 'POST',
    url: '/sys/role',
    // data,post,put传参是通过data
    data// get,delete方式params
  })
}

export function delRole(id) {
  return request({
    method: 'delete',
    url: '/sys/role/' + id
  })
}

export function getRoleById(id) {
  return request({
    method: 'get',
    url: '/sys/role/' + id
  })
}

export function updateRole(data) {
  return request({
    method: 'put',
    url: '/sys/role/' + data.id,
    data
  })
}

// 给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
