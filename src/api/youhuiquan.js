import request from '@/utils/request'

export function listAd(query) {
  return request({
    url: '/coupons',
    method: 'get',
    params: query
  })
}

export function createAd(data) {
  return request({
    url: '/coupon',
    method: 'post',
    data
  })
}

export function readAd(data) {
  return request({
    url: `/cars?name=${data}`,
    method: 'get',
  })
}
export function showswitch(id,data){
  return request({
    url:`/coupon/status/${id}?status=${data}`,
    method:"put"
  })
}
export function getdate(id) {
  return request({
    url: `/coupon/${id}`,
    method: 'get',
  })
}
export function updateAd(data,id) {
  return request({
    url: `/coupon/${id}`,
    method: 'put',
    data
  })
}

export function deleteAd(data) {
  return request({
    url: `/banner/${data}`,
    method: 'delete',
    data
  })
}
