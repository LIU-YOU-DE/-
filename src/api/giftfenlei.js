import request from '@/utils/request'

export function listCategory(query) {
  return request({
    url: '/giftCategorys',
    method: 'get',
    params: query
  })
}

export function listCatL1() {
  return request({
    url: '/giftCategorys/parentId',
    method: 'get'
  })
}

export function createCategory(data) {
  return request({
    url: '/giftCategory',
    method: 'post',
    data
  })
}
export function showswitch(id,data){
  return request({
    url:`/giftCategory/status/${id}?status=${data}`,
    method:"put"
  })
}
export function readCategory(data) {
  return request({
    url: '/category/read',
    method: 'get',
    data
  })
}

export function updateCategory(data,id) {
  return request({
    url: `/giftCategory/${id}`,
    method: 'put',
    data
  })
}

export function deleteCategory(data) {
  return request({
    url: `/giftCategory/${data}`,
    method: 'delete',
    data
  })
}
