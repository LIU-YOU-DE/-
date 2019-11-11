import request from '@/utils/request'

export function listCategory(query) {
  return request({
    url: '/notices',
    method: 'get',
    params: query
  })
}

export function listCatL1() {
  return request({
    url: '/members/short',
    method: 'get'
  })
}

export function createCategory(data) {
  return request({
    url: '/notice',
    method: 'post',
    data
  })
}

export function readCategory(data) {
  return request({
    url: '/category/read',
    method: 'get',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/category/update',
    method: 'post',
    data
  })
}

export function deleteCategory(data) {
  return request({
    url: `/notice/${data}`,
    method: 'delete',
    data
  })
}
