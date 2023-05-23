import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 获取列表
  // console.log(data)
  return request({
    url: '/mid_manager/upgradProduct/queryUpgradProductList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function addUpgradProduct (data) { // 新增
  // console.log(data)
  return request({
    url: '/mid_manager/upgradProduct/saveUpgradProduct',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function deleteUpgradProduct (data) { // 删除
  return request({
    url: '/mid_manager/upgradProduct/deleteUpgradProduct',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateUpgradProduct (data) {
  return request({
    url: '/mid_manager/upgradProduct/updateUpgradProduct',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function modifyUpgradStatus (data) { // 修改启用禁用状态
  return request({
    url: '/mid_manager/upgradProduct/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
