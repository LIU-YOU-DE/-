import request from '@/utils/request'

export function listStorage(query) {
  return request({
    url: '/storage/list',
    method: 'get',
    params: query
  })
}

export function createStorage(data) {
  return request({
    url: '/storage/create',
    method: 'post',
    data
  })
}

export function readStorage(data) {
  return request({
    url: '/storage/read',
    method: 'get',
    data
  })
}

export function updateStorage(data) {
  return request({
    url: '/storage/update',
    method: 'post',
    data
  })
}

export function deleteStorage(key) {
  return request({
    url: `/storage/delete?key=${key}`,
    method: 'post',
  })
}

export function deleteList(keylist){
  return request({
    url :'/storage/delete/multiple',
    method:'post',
    data: keylist
  })
}


// 活动奖品
export function getPrizeList(query){
  return request({
    url :`/prize`,
    method:'get',
    params: query
  })
}

export function pushPrize(data){
  return request({
    url:`/prize`,
    method:"post",
    data
  })
}

export function createactivity(data){
  return request({
    url:`/activity`,
    method:'post',
    data
  })
}

export function getprize(data){
  return request({
    url:`/prize/name/${data}`,
    method:'get',
    data
  })
}

export function deleteprize(id){
  return request({
    url:`/prize/${id}`,
    method:'delete'
  })
}

export function updateprize(id,data){
  return request({
    url:`/prize/${id}`,
    method:'put',
    data
  })
}

export function activitylist(query){
  return request({
    url:`/activity`,
    method:'get',
    params: query
  })
}

export function deleteactivity(id){
  return request({
    url:`/activity/${id}`,
    method:'delete'
  })
}
export function updateactivity(id,data) {
  return request({
    url: `/activity/${id}`,
    method: 'put',
    data
  })
}

export function getactivity(id){
  return request({
    url:`/activity/${id}`,
    method:'get'
  })
}

export function updateactivity2(id,data){
  return request({
    url:`/activity/status/${id}?status=${data}`,
    method:'put'
  })
}

// 用户中奖记录
export function getprizerecord(query){
  return request({
    url:`/prizeRecord`,
    method:'get',
    params: query
  })
}

export function updatestatus(id,data){
  return request({
    url:`/prizeRecord/${id}?status=${data}`,
    method:'put'
  })
}

export function deleteprizeroc(id){
  return request({
    url:`/prizeRecord/${id}`,
    method:'delete'
  })
}
const uploadPath = process.env.BASE_API + '/storage/create'
export { uploadPath }
