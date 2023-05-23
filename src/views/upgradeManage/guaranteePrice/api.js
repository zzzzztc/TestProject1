import request from '../../../utils/request'
import qs from 'qs'

//  初始化列表
export function priceList (data) {
  return request({
    url: '/mid_manager/upgradLowestPrice/queryUpgradLowestPriceList',
    method: 'post',
    data: stringify(data)
  })
}

//  添加
export function addList (data) {
  return request({
    url: '/mid_manager/upgradLowestPrice/saveUpgradLowestPrice',
    method: 'post',
    data: stringify(data)
  })
}
//  修改
export function revise (data) {
  return request({
    url: '/mid_manager/upgradLowestPrice/updateUpgradLowestPrice',
    method: 'post',
    data: stringify(data)
  })
}

//  添加
export function channels (data) {
  return request({
    url: '/mid_manager/upgradTime/getUpgradProductList',
    method: 'post',
    data: stringify(data)
  })
}

//  删除
export function deleteUpgradLowestPrice (lowestPriceIds) {
  let parma = {
    lowestPriceIds
  }
  return request({
    url: '/mid_manager/upgradLowestPrice/deleteUpgradLowestPrice',
    method: 'post',
    data: stringify(parma)
  })
}

//  修改启用禁用状态
export function updateStatus (data) {
  return request({
    url: 'mid_manager/upgradLowestPrice/updateStatus',
    method: 'post',
    data: stringify(data)
  })
}

//  单条数据upgradLowestPrice/viewUpgradLowestPric
export function viewUpgradLowestPriceInfo (data) {
  return request({
    url: 'mid_manager/upgradLowestPrice/viewUpgradLowestPriceInfo',
    method: 'post',
    data: stringify(data)
  })
}
function stringify (param) {
  return qs.stringify(param)
}
