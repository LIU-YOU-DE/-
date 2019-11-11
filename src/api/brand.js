import request from '@/utils/request'

export function listBrand(query) {
  return request({
    url: '/brands',
    method: 'get',
    params: query
  })
}

export function createBrand(data) {
  return request({
    url: '/brand',
    method: 'post',
    data
  })
}

export function readBrand(data) {
  return request({
    url: '/brand/read',
    method: 'get',
    data
  })
}

export function updateBrand(data) {
  return request({
    url: `/brand/${data.id}`,
    method: 'put',
    data
  })
}
export function showswitch(id, data) {
  return request({
    url: `/brand/status/${id}?status=${data}`,
    method: "put"
  })
}
export function deleteBrand(data) {
  return request({
    url: `/brand/${data.id}`,
    method: 'delete',
  })
}
