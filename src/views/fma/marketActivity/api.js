import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 获取列表数据
  return request({
    url: '/mid_manager/fma/getMarketActivityList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 活动类型字典查询, 活动状态字典查询
export function querydictsByType (data) {
  return request({
    url: '/mid_manager/common/querydictsByType',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 新增活动
export function addMarketActivity (data) {
  return request({
    url: '/mid_manager/fma/addMarketActivity',
    method: 'post',
    data: data
  })
}
// 修改活动
export function updateMarketActivity (data) {
  return request({
    url: '/mid_manager/fma/updateMarketActivity',
    method: 'post',
    data: data
  })
}
// 修改活动状态
export function updateActyStatus (data) {
  return request({
    url: '/mid_manager/fma/updateActyStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 航线列表
export function airLineList (data) {
  return request({
    url: '/mid_manager/fma/getMarketActivityAirlineList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 城市对
export function queryAirCitiesTree (data) {
  return request({
    url: '/mid_manager/cityAirport/queryAirCitiesTree',
    method: 'post',
    data: data
  })
}
// 新增推广航线
export function addMarketActivityAirline (data) {
  return request({
    url: '/mid_manager/fma/addMarketActivityAirline',
    method: 'post',
    data
  })
}
// 编辑推广航线
export function updateMarketActivityAirline (data) {
  return request({
    url: '/mid_manager/fma/updateMarketActivityAirline',
    method: 'post',
    data
  })
}
// 查询推广航线列表
export function getMarketActivityAirlineList (data) {
  return request({
    url: '/mid_manager/fma/getMarketActivityAirlineList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 删除推广航线
export function deleteMarketActivityAirline (data) {
  return request({
    url: '/mid_manager/fma/deleteMarketActivityAirline',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 奖励规则列表
export function getMarketAwardRuleList (data) {
  return request({
    url: '/mid_manager/fma/getMarketAwardRuleList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 新增奖励规则
export function addMarketAwardRule (data) {
  return request({
    url: '/mid_manager/fma/addMarketAwardRule',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 编辑奖励规则
export function updateMarketAwardRule (data) {
  return request({
    url: '/mid_manager/fma/updateMarketAwardRule',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 奖励规则启用禁用
export function updateMarketAwardRuleStatus (data) {
  return request({
    url: '/mid_manager/fma/updateMarketAwardRuleStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
