import request from '../../../utils/request'
import qs from 'qs'

// 补退款退款 -- 数据表格
export function queryRepairRefund (data) {
  return request({
    url: '/mid_manager/repairRefund/queryRepairRefund',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 补退款线下退款
export function underLineRefund (data) {
  return request({
    url: '/mid_manager/repairRefund/underLineRefund',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 批量退款
export function batchRefundHandle (data) {
  return request({
    url: '/mid_manager/repairRefund/batchRefundPass',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 重新退款
export function refundPassAgain (data) {
	return request({
		url: '/mid_manager/repairRefund/refundPassAgain',
		method: 'post',
		data: qs.stringify(data)
	})
}
