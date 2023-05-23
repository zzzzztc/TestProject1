import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) {
  return request({
    url: '/mid_manager/refund/queryAchangeList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function batchRefundConform (data) {
  return request({
    url: '/mid_manager/refund/batchRefundConform',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 再次退款
export function refundAgainApi (data) {
  return request({
    url: '/mid_manager/refund/refundConformAgain',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function underLineRefund (data) { // 线下处理成功
  return request({
    url: '/mid_manager/refund/underLineRefund',
    method: 'post',
    data: qs.stringify(data)
  })
}
