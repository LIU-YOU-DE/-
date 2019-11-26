import request from '@/utils/request'

export function listGoods(query) {
  return request({
    url: '/cars',
    method: 'get',
    params: query
  })
}

export function deleteGoods(data) {
  return request({
    url: `/car/${data.id}`,
    method: 'delete',
  })
}

export function publishGoods(data) {
  return request({
    url: '/car',
    method: 'post',
    data
  })
}

export function detailGoods(id) {
  return request({
    url: `/car/${id}`,
    method: 'get',
  })
}

export function editGoods(data,id) {
  return request({
    url: `/car/${id}`,
    method: 'put',
    data
  })
}

export function listCatAndBrand(data) {
  return request({
    url: '/brandsAndCarTypes',
    method: 'get',
    data
  })
}

export function carTypeList(type){
  return request({
    url:`/commonParam/${type}`,
    method:'get',
    type
  })
}

export function addCarType(typeName){
  return request({
    url:'/commonParam',
    method:'post',
    data:{
      "type": 1,
	    "typeName": typeName
    }
  })
}
export function updateStatus(id,data){
  return request({
    url:`/car/status/${id}?status=${data}`,
    method:'put'
  })
}

export function updateIsHot(id,data){
  return request({
    url:`/car/isHot/${id}?isHot=${data}`,
    method:'put'
  })
}

export function updateIsPopular(id,data){
  return request({
    url:`/car/isPopular/${id}?isPopular=${data}`,
    method:'put'
  })
}

export function updateIsRecommend(id,data){
  return request({
    url:`/car/isRecommend/${id}?isRecommend=${data}`,
    method:'put'
  })
}

export function updateIsSpecial(id,data){
  return request({
    url:`/car/isSpecial/${id}?isSpecial=${data}`,
    method:'put'
  })
}

export function getindex(query) {
  return request({
    url: '/dashboard',
    method: 'get',
    params:query
  })
}

