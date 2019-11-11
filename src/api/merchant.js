import request from '@/utils/request'

export function listAd(query) {
  return request({
    url: '/merchants',
    method: 'get',
    params: query
  })
}

export function createAd(data) {
  return request({
    url: '/merchant',
    method: 'post',
    data
  })
}
export function showswitch(id,data){
  return request({
    url:`/merchant/status/${id}?status=${data}`,
    method:"put"
  })
}
export function listCatAndBrand(){
  return request({
    url:`/regions/short`,
    method:"get"
  })
}

export function readAd(data) {
  return request({
    url: `/cars?name=${data}`,
    method: 'get',
  })
}
export function getdate(id) {
  return request({
    url: `/merchant/${id}`,
    method: 'get',
  })
}
export function getcars() {
  return request({
    url: `/cars`,
    method: 'get',
  })
}
export function updateAd(data,id) {
  return request({
    url: `/merchant/${id}`,
    method: 'put',
    data
  })
}

export function deleteAd(data) {
  return request({
    url: `/merchant/${data}`,
    method: 'delete',
    data
  })
}
