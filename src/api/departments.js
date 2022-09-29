import request from '@/utils/request'

export function getList() {
  return request({
    method: 'GET',
    url: '/company/department'
  })
}
export const getDepartments = getList
export function addDept(data) {
  return request({
    method: 'POST',
    url: '/company/department',
    data
  })
}

export function delDept(id) {
  return request({
    method: 'DELETE',
    url: '/company/department/' + id
  })
}

export function getDeptById(id) {
  return request({
    method: 'GET',
    url: '/company/department/' + id
  })
}

export function updateDept(data) {
  return request({
    method: 'PUT',
    url: '/company/department/' + data.id,
    data
  })
}

