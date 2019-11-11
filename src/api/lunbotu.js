import request from '@/utils/request'

export function listAd(query) {
  return request({
    url: '/banners',
    method: 'get',
    params: query
  })
}

export function createAd(data) {
  return request({
    url: '/banner',
    method: 'post',
    data
  })
}
export function showswitch(id, data) {
  return request({
    url: `/banner/status/${id}?status=${data}`,
    method: 'put'
  })
}
export function readAd(data) {
  return request({
    url: '/ad/read',
    method: 'get',
    data
  })
}
export function getdate(data, id) {
  return request({
    url: `/merchant/${id}`,
    method: 'get',
    data
  })
}
export function updateAd(data) {
  return request({
    url: `/banner/${data.id}`,
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

// 获取所有的礼品的id和name
function getGiftsBySimple() {
  return request({
    url: '/gifts/short',
    method: 'GET'
  })
}

// 获取所有的汽车的id和name
function getCarListBySimple() {
  return request({
    url: '/cars/short',
    method: 'GET'
  })
}

export {
  getGiftsBySimple,
  getCarListBySimple
}
