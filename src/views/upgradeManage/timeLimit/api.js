import request from '../../../utils/request'
import qs from 'qs'

// 时间限制 -- 表格展示接口
export function upgradTimeList (data) {
  return request({
    url: '/mid_manager/upgradTime/queryUpgradTimeList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 时间限制 -- 修改接口
export function editTimeList (data) {
  // console.log(data)
  return request({
    url: '/mid_manager/upgradTime/updateUpgradTime',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 时间限制 -- 增加接口
export function addTimeList (data) {
  // console.log(data)
  return request({
    url: '/mid_manager/upgradTime/saveUpgradTime',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 时间限制 -- 删除接口
export function delTimeList (data) {
  return request({
    url: '/mid_manager/upgradTime/deleteUpgradTime',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 时间限制 -- 禁止/启用
export function updateStatus (data) {
  return request({
    url: '/mid_manager/upgradTime/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 时间限制 -- 渠道
export function channels (data) {
  return request({
    url: '/mid_manager/common/channels',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 时间限制 -- 升舱产品
export function getUpgradProductList (data) {
  return request({
    url: '/mid_manager/upgradTime/getUpgradProductList',
    method: 'post',
    data: qs.stringify(data)
  })
}
