import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 获取列表数据
  return request({
    url: '/mid_manager/insurance/queryInsuranceInfoList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function singleCancelInsure (data) { // 单独退保
  return request({
    url: '/mid_manager/refund/singleCancelInsure',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function cancelInsureByTicketNo (data) { // 票号退保
  return request({
    url: '/mid_manager/refund/cancelInsureByTicketNo',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function planPolicySchedule (data) { // 重新购保
  return request({
    url: '/mid_manager/refund/planPolicySchedule',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 保险改期
export function insurancePostpone (data) {
  return request({
    url: '/mid_manager/refund/changeInsureByTicketid',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 自愿改期查询
export function natureBefore (data) {
  return request({
    url: '/mid_manager/refund/changeInsureByTicketidNatureBefore',
    method: 'post',
    data: qs.stringify(data)
  })
}
