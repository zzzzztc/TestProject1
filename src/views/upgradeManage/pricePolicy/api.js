import request from '../../../utils/request'
import qs from 'qs'

export function fetchChannelList (data) { // 渠道列表
  return request({
    url: '/mid_manager/common/channels',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function fetchUpgradList (data) { // 升舱产品列表
  return request({
    url: '/mid_manager/upgradFlightPolicy/queryUpgradTree',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function fetchList (data) { // 价格政策列表
  return request({
    url: '/mid_manager/upgradFlightPolicy/queryPolicyList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function addPricePolicy (data) { // 新增价格政策
  return request({
    url: '/mid_manager/upgradFlightPolicy/addPolicy',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function editPricePolicy (data) { // 编辑价格政策
  return request({
    url: '/mid_manager/upgradFlightPolicy/updatePolicy',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function deletePolicy (data) { // 删除
  return request({
    url: '/mid_manager/upgradFlightPolicy/deletePolicy',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function modifyPolicyStatus (data) { // 修改启用禁用状态
  return request({
    url: '/mid_manager/upgradFlightPolicy/updatePolicyStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function importPolicy (data) { // 上传运价文件
  return request({
    url: '/mid_manager/upgradFlightPolicy/importPolicy',
    method: 'post',
    data: data
  })
}
