import request from '@/utils/request'

export function listAd(query) {
  return request({
    url: '/rules',
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
export function showswitch(id,data){
  return request({
    url:`/banner/status/${id}?status=${data}`,
    method:"put"
  })
}
export function readAd(id) {
  return request({
    url: `/rule/${id}`,
    method: 'get',
  })
}
export function getdate(data,id) {
  return request({
    url: `/merchant/${id}`,
    method: 'get',
    data
  })
}
export function updateAd(data,id) {
  return request({
    url: `/rule/${id}`,
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
