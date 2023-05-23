import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 获取列表数据
  return request({
    url: '/mid_manager/errorRefunds/queryRefunds',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 线下退款
export function underLineRefund (data) {
  return request({
    url: '/mid_manager/errorRefunds/underLineRefund',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function fetchRefundById (data) { // 获取详情
  return request({
    url: '/mid_manager/errorRefunds/getRefundById',
    method: 'get',
    params: data
  })
}

export function auditErrorRefund (data) {
  return request({
    url: '/mid_manager/errorRefunds/errorRefundConform',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 批量退款
export function batchRefund (data) {
  return request({
    url: '/mid_manager/errorRefunds/batchErrorRefundConform',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 差错退款
export function errorRefundConformAgain (data) {
	return request({
		url: '/mid_manager/errorRefunds/errorRefundConformAgain',
		method: 'post',
		data: qs.stringify(data)
	})
}
