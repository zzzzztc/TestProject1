import request from '../../../utils/request'
import qs from 'qs'

// 获取版本号信息
export function getAllVersion (data) {
  return request({
    url: '/mid_manager/payMethod/getAllVersion',
    method: 'get'
  })
}
// 获取支付方式列表
export function payMethods (data) {
  return request({
    url: '/mid_manager/payMethod/getPayMethod',
    method: 'get'
  })
}
// 获取列表数据
export function queryPayMethodVersionConfigList (data) {
  return request({
    url: '/mid_manager/payMethod/queryPayMethodVersionConfigList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 删除支付配置
export function deleteConfig (data) {
  return request({
    url: 'mid_manager/payMethod/deletePayMethodVersionConfigBean',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 编辑支付配置
export function updateConfig (data) {
  return request({
    url: 'mid_manager/payMethod/updatePayMethodVersionConfig',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 新增支付配置
export function addPayMethodVersionConfig (data) {
  return request({
    url: 'mid_manager/payMethod/addPayMethodVersionConfig',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 支付优先级排序
export function payMethodVersionConfigSort (data) {
  return request({
    url: 'mid_manager/payMethod/payMethodVersionConfigSort',
    method: 'post',
    data: data
  })
}
