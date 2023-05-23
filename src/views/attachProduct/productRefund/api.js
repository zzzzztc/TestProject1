import request from '../../../utils/request'
import qs from 'qs'
// 列表查询
export function fetchList (data) {
  return request({
    url: '/mid_manager/order/queryProductOrderDetailList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 产品退款审核通过
export function refundPass (data) {
  return request({
    url: '/mid_manager/order/productOrderDetailRefundPass',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 产品退款审核拒绝
export function refundRefuse (data) {
  return request({
    url: '/mid_manager/order/productOrderDetailRefundRefuse',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 产品退款重新审核
export function againApply (data) {
  return request({
    url: '/mid_manager/order/productOrderDetailAgainApply',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 产品退款退款确认
export function refundConfirm (data) {
  return request({
    url: '/mid_manager/order/productOrderDetailRefundConform',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 产品退款批量退款
export function batchRefundConfirm (data) {
  return request({
    url: '/mid_manager/order/batchProductOrderDetailRefundConform',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 产品退款线下退款
export function underLineRefund (data) {
  return request({
    url: '/mid_manager/order/underLineRefund',
    method: 'post',
    data: qs.stringify(data)
  })
}
