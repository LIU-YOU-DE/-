import request from '@/utils/request'
import Qs from 'qs'

export function listOrder(query) {
  return request({
    url: '/orders',
    method: 'get',
    params: query,
    // paramsSerializer: function(params) {
    //   return Qs.stringify(params, { arrayFormat: 'repeat' })
    // }
  })
}

export function modifyOrderStatus(status){
  return request({
    url: `/orders/${status}`,
    method: 'PUT'
  })
}

export function detailOrder(id) {
  return request({
    url: `/orders/${id}`,
    method: 'get',
  })
}

export function shipOrder(data) {
  return request({
    url: '/order/ship',
    method: 'post',
    data
  })
}

export function orderShip(shipForm){
  return request({
    url:`/orders/shipStatus/`+shipForm.id,
    method:'put',
    params: {
      'orderType':shipForm.orderType,
      'shipperCode': shipForm.shipperCode,
      'logisticCode': shipForm.logisticCode
    }
  })
}

export function ordersList(data){
  return request({
    url:`/orders/statistics`,
    method:'get',
    data
  })
}

export function refundOrder(data) {
  return request({
    url: '/order/refund',
    method: 'post',
    data
  })
}

export function replyComment(data) {
  return request({
    url: '/order/reply',
    method: 'post',
    data
  })
}

export function editRemark(id,remark){
  return request({
    url:`/order/remark/${id}?remark=${remark}`,
    method:'PUT'
  })
}

/** 修改订单状态 */
export function editOrderStatus(id,status){
  return request({
    url:`/order/${id}?status=${status}`,
    method:'PUT'
  })
}

// 取消订单
export function updateOrderStatus(id,orderType){
  return request({
    url:`/orders/orderStatus/${id}?orderType=${orderType}`,
    method:'put'
  })
}
/**
 * 根据凭证id修改凭证审核状态
 * @param {*} id 凭证id
 * @param {*} orderId 订单id
 * @param {*} status 状态码 1审核中； 2-》审核通过 ；3-》审核未通过 需要填写原因
 * @param {*} reason 原因，非必选项
 * @addtime 2019.10.22
 */
export function modifyVoucherStatus(id,orderId,status,reason){
  return request({
    url: `/voucher/${id}?orderId=${orderId}&status=${status}&reason=${reason}`,
    method: 'PUT',
    // data: {id,orderId,status,reason}
  })
}
