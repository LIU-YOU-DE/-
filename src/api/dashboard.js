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
