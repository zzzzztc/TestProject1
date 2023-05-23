import request from '../../../utils/request'
// import qs from 'qs'

// 列表数据
export function queryRuleList (data) {
  return request({
    url: '/luckdraw/v1/rule/list',
    method: 'post',
    data: data
  })
}

// 优惠券
export function queryCouponList (data) {
  return request({
    url: '/luckdraw/v1/coupon/list',
    method: 'get',
    data: data
  })
}

// 添加
export function queryRuleAdd (data) {
  return request({
    url: '/luckdraw/v1/rule',
    method: 'post',
    data: data
  })
}

// 修改
export function queryRuleUpdate (data) {
  return request({
    url: '/luckdraw/v1/rule',
    method: 'put',
    data: data
  })
}

// 删除
export function queryRuleDelete (data) {
  return request({
    url: '/luckdraw/v1/rule/' + data,
    method: 'DELETE'
  })
}

// 启用、禁用
export function queryRuleStatus (data) {
  return request({
    url: '/luckdraw/v1/rule/' + data.id + '/state/' + data.status + '',
    method: 'PUT'
  })
}

// 详情
export function queryRuleDetail (data) {
  return request({
    url: '/luckdraw/v1/rule/' + data,
    method: 'get'
  })
}
