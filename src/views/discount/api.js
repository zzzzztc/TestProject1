import request from '../../utils/request'
import qs from 'qs'

//  折扣类型
export function querydictsByType (data) {
  return request({
    url: 'mid_manager/common/querydictsByType',
    method: 'get',
    params: data
  })
}
//  初始化
export function queryFreightRates (data) {
  return request({
    url: 'mid_manager/freightRateRule/queryFreightRates',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function importRate (data) {
  return request({
    url: 'mid_manager/freightRateRule/importRate',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function updateRuleStatus (data) {
  return request({
    url: 'mid_manager/freightRateRule/updateRuleStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 批量启用批量禁用
export function batchOnOrOff (data) {
  return request({
    url: 'mid_manager/freightRateRule/batchOnOrOff',
    method: 'post',
    data: qs.stringify(data)
  })
}
// delete
export function deleteFreightRate (data) {
  return request({
    url: 'mid_manager/freightRateRule/deleteFreightRate',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 折扣方向
export function discountDirection (data) {
  return request({
    url: 'mid_manager/common/querydictsByType',
    method: 'get',
    params: data
  })
}
//  运价
export function applyFreightType (data) {
  return request({
    url: 'mid_manager/common/querydictsByType',
    method: 'get',
    params: data
  })
}
//  添加
// /freightRateRule/addFreightRate
export function addFreightRate (data) {
  return request({
    url: 'mid_manager/freightRateRule/addFreightRate',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  上传/freightRateRule/importRate
export function importRates (data) {
  return request({
    url: 'mid_manager/freightRateRule/importRate',
    method: 'post',
    data: data
  })
}
//  修改
// /freightRateRule/updateFreightRate
export function updateFreightRate (data) {
  return request({
    url: 'mid_manager/freightRateRule/updateFreightRate',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function addOrUpdateBefore (data) {
  return request({
    url: 'mid_manager/freightRateRule/addOrUpdateBefore',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function getActyList (data) {
  return request({
    url: 'mid_manager/fma/queryActySelect',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  data选中的数组 state总状态
export function chanenl (data, state) {
  let arr = []
  for (let item of data) {
    let sp = item.channel.split(',')
    for (let itemi of sp) {
      for (let items of state) {
        if (itemi === items.chalCode) {
          arr.push(items.chalName)
          item.channel = arr.join(',')
        }
      }
    }
    arr = []
  }
  return data
}
// /freightRateRule/queryFreightRates
