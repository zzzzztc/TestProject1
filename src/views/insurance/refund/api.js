import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 获取列表数据
  return request({
    url: '/mid_manager/insurance/queryInsuranceInfoList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function insuranceConfirm (data) { // 退款确认
  return request({
    url: '/mid_manager/insurance/insuranceConfirm',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 线下退款确认
export function underRefund (data) {
  return request({
    url: '/mid_manager/insurance/underLineRefund',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryOrderProcessingList (data) {
  return request({
    url: '/mid_manager/refund/queryOrderProcessingList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 重新退款
export function insuranceConfirmAgain (data) {
	return request({
		url: '/mid_manager/insurance/insuranceConfirmAgain',
		method: 'post',
		data: qs.stringify(data)
	})
}

// 批量退款
export function batchInsuranceConfirm (data) {
	return request({
		url: '/mid_manager/insurance/batchInsuranceConfirm',
		method: 'post',
		data: qs.stringify(data)
	})
}

// 批量退款查询
export function queryInsuranceInfoList (data) {
	return request({
		url: '/mid_manager/insurance/queryInsuranceInfoList',
		method: 'post',
		data: qs.stringify(data)
	})
}
