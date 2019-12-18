import request from '@/utils/request'
import { get } from 'http'

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

export function getGiftList(query){
  return request({
    url :`/gifts`,
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

export function intersUpkeepAdd(data){
  return request({
    url:`/Upkeep/intersUpkeep`,
    method:'post',
    data
  })
}

export function upkeepMerChantAdd(data){
  return request({
    url:`/upkeepMerChant/intersUpkeepChant`,
    method:'post',
    data
  })
}

export function upkeepList(type){
  return request({
    url:`/Upkeep/upkeepList/${type}`,
    method:'get'
  })
}

export function handProduct(data){
  return request({
    url:`/product/intersProduct`,
    method:'post',
    data
  })
}

export function getMearchList(query){
  return request({
    url:`/upkeepMerChant/keyword`,
    method:'get',
    params: query
  })
}

export function getMearProduct(query){
  return request({
    url:`/product/query/${query.merchantId}`,
    method:'get',
    params:query
  })
}

export function updateMearchar(data){
  return request({
    url:`/upkeepMerChant/update/${data.merchantId}`,
    method:'put',
    data
  })
}

export function getProduct(query){
  return request({
    url:`/product/inquire/${query.merchantId}`,
    method:'get',
    params:query
  })
}

export function updateProduAndMerchant(data){
  return request({
    url:`/produAndMerchant/amend/${data.id}`,
    method:'put',
    data
  })
}

export function getProductSelection(){
  return request({
    url:`/product/selectList`,
    method:'get',
  })
}

export function handUpdateProduct(data){
  return request({
    url:`/produAndMerchant/Addingssociated`,
    method:'post',
    data
  })
}

export function drawType(){
  return request({
    url:`/Upkeep/upkeepList`,
    method:'get'
  })
}

export function deleteProductList(idList){
  return request({
    url:`/product/delect`,
    method:'post',
    data:idList
  })
}

export function updateProduct(data){
  return request({
    url:`/product/update/${data.productId}`,
    method:'put',
    data
  })
}

export function getProductList(){
  return request({
    url:`/product/statusList`,
    method:'get'
  })
}

export function updateStatus(query){
  return request({
    url:`/product/updateStatus/${query.productId}`,
    method:'put',
    params:query
  })
}

export function getUpList(query){
  return request({
    url:`/Upkeep/selectList/${query.currentPage}`,
    method:'get',
    params:query
  })
}

export function intersUpdateUpkeepAdd(data){
  return request({
    url:`/Upkeep/update/${data.upkeepId}`,
    method:'put',
    data
  })
}

export function deleteUpkeep(data){
  return request({
    url:`/Upkeep/delect`,
    method:'post',
    data
  })
}


// -----------------------------------------------------------------------------------
export function getgiftlist(data){
  return request({
    url:`/shortGiftCategorys`,
    method:'get',
    data
  })
}


// -----------------------------------------------------------------------------------------
const uploadPath = process.env.BASE_API + '/storage/create'
export { uploadPath }
