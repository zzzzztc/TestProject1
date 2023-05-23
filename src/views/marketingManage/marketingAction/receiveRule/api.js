import request from '../../../../utils/request'
import qs from 'qs'

export function querySaleReceiveRuleList (data) { // 领用规则查询
  return request({
    url: '/mid_manager/saleReceiveRule/querySaleReceiveRuleList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryAddSaleReceiveRule (data) { // 领用规则添加
  return request({
    url: '/mid_manager/saleReceiveRule/addSaleReceiveRule',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryUpdateSaleReceiveRule (data) { // 领用规则修改
  return request({
    url: '/mid_manager/saleReceiveRule/updateSaleReceiveRule',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function querySaleReceiveRuleStatus (data) { // 领用规则状态启用禁用
  return request({
    url: '/mid_manager/saleReceiveRule/updateSaleReceiveRuleStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function querySaleReceiveRuleById (data) { // 领用规则详情
  return request({
    url: '/mid_manager/saleReceiveRule/querySaleReceiveRuleById',
    method: 'post',
    data: qs.stringify(data)
  })
}
