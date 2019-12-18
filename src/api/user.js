import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/members',
    method: 'get',
    params: query
  })
}

export function listAddress(query) {
  return request({
    url: '/memberAddress',
    method: 'get',
    params: query
  })
}

export function getlook(memberid){
return request({
  url:`/members/${memberid}`,
  method:"get",
})
}
export function listCollect(query) {
  return request({
    url: '/collect/list',
    method: 'get',
    params: query
  })
}

export function listFeedback(query) {
  return request({
    url: '/browseRecords',
    method: 'get',
    params: query
  })
}

export function updateAd(data,id) {
  return request({
    url: `/members/${id}`,
    method: 'put',
    data
  })
}
export function listLoginRecord(query) {
  return request({
    url: '/loginRecords',
    method: 'get',
    params: query
  })
}

export function listHistory(query) {
  return request({
    url: '/pointRecords',
    method: 'get',
    params: query
  })
}

export function merchantList(){
  return request({
    url:`/upkeepMerChant/chantList`,
    method:'get'
  })
}

export function handMerchant(data){
  return request({
    url:`/intersMembers`,
    method:'post',
    data
  })
}
