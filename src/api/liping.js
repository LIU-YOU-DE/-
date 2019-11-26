import request from '@/utils/request'

export function listliping(query) {
  return request({
    url: '/gifts',
    method: 'get',
    params: query
  })
}

export function deleteliping(id) {
  return request({
    url: `/gift/${id}`,
    method: 'delete',
  })
}

export function publishGoods(data) {
  return request({
    url: '/gift',
    method: 'post',
    data
  })
}
export function showswitch(id, data) {
  return request({
    url: `/gift/status/${id}?status=${data}`,
    method: "put"
  })
}
export function detailliping(id) {
  return request({
    url: `/gift/${id}`,
    method: 'get',
  })
}

export function editGoods(data, id) {
  return request({
    url: `/gift/${id}`,
    method: 'put',
    data
  })
}

export function listCatAndBrand() {
  return request({
    url: '/shortGiftCategorys',
    method: 'get',
  })
}



export function getorder(query) {
  return request({
    url: '/giftOrders',
    method: 'get',
    params: query
  })
}

function shipGiftOrder(shipForm) {
  return request({
    url: '/giftOrder/ship/'+ shipForm.giftOrderId,
    method: 'put',
    params: {
      'shipperCode': shipForm.shipperCode,
      'logisticCode': shipForm.logisticCode
    }
  })
}

function queryShipInfo(query) {
  return request({
    url: '/express',
    method: 'get',
    params: {
      'shipperCode': query.shipperCode,
      'logisticCode': query.logisticCode
    }
  })
}

export {
  shipGiftOrder,
  queryShipInfo
}