import request from '@/utils/request'

export function info() {
  return request({
    url: '/dashboard',
    method: 'get'
  })
}

export function getPoint(){
  return request({
    url:'/dashboard/point',
    method:'get'
  })
}

export function getOrderPoint(){
  return request({
    url:'/dashboard/order',
    method:'get'
  })
}

export function getOrderPrize(){
  return request({
    url:'/dashboard/orderPrize',
    method:'get'
  })
}

export function getPointCustom(query){
  return request({
    url:'/dashboard/point/custom',
    method:'get',
    params: query
  })
}

export function getOrderCustom(query){
  return request({
    url:'/dashboard/order/custom',
    method:'get',
    params:query
  })
}

export function getorderPrizeCustom(query){
  return request({
    url:'/dashboard/orderPrize/custom',
    method:'get',
    params:query
  })
}
