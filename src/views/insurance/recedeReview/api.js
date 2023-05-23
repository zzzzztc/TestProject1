import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { //  获取列表数据
  return request({
    url: '/mid_manager/insurance/queryInsuranceInfoList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function exportAchangeList (data) { // 导出
  return request({
    url: '/mid_manager/refund/exportAchangeList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function firstInsurancePass (data) { // 退保审核
  return request({
    url: '/mid_manager/insurance/firstInsuracePass',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function firstInsuraceRefuse (data) { // 退保拒绝
  return request({
    url: '/mid_manager/insurance/firstInsuraceRefuse',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryOrderProcessingList (data) { // 审核记录
  return request({
    // url: '/min_manager/refund/queryOrderProcessingList',
    url: '/mid_manager/refund/queryOrderProcessingList',
    method: 'post',
    data: qs.stringify(data)
  })
}
