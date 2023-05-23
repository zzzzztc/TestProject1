import request from '../../../utils/request'
import qs from 'qs'

// 免费升舱 -- 表格展示接口
export function queryPolicyList (data) {
  return request({
    url: '/mid_manager/upgradFlightPolicy/queryPolicyList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 免费升舱 -- 修改接口
export function updatePolicyList (data) {
  return request({
    url: '/mid_manager/upgradFlightPolicy/updatePolicy',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 免费升舱 -- 增加接口
export function addPolicyList (data) {
  return request({
    url: '/mid_manager/upgradFlightPolicy/addPolicy',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 免费升舱 -- 删除接口
export function delPolicyList (data) {
  return request({
    url: '/mid_manager/upgradFlightPolicy/deletePolicy',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 免费升舱 -- 禁止/启用
export function updatePolicyStatus (data) {
  return request({
    url: '/mid_manager/upgradFlightPolicy/updatePolicyStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 免费升舱 -- 渠道
export function channels (data) {
  return request({
    url: '/mid_manager/common/channels',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 免费升舱 -- 升舱产品
export function queryUpgradTree (data) {
  return request({
    url: '/mid_manager/upgradFlightPolicy/queryUpgradTree',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 免费升舱 -- 文件上传
export function importFree (data) {
  return request({
    url: '/mid_manager/upgradFlightPolicy/importFree',
    method: 'post',
    data: data
  })
}
