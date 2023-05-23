import request from '../../../utils/request'
import qs from 'qs'
// 获取列表数据
export function fetchList (data) {
  return request({
    url: '/mid_manager/airRailwayTicket/queryAirRailwayTicketList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 审核通过
export function refundPass (data) {
  return request({
    url: '/mid_manager/airRailwayTicket/airRailwayTicketRefundPass',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 审核通过
export function refundRefuse (data) {
  return request({
    url: '/mid_manager/airRailwayTicket/airRailwayTicketRefundRefuse',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 退款确认
export function refund (data) {
  return request({
    url: '/mid_manager/airRailwayTicket/airRailwayTicketRefundConform',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 批量退款
export function batchRefund (data) {
  return request({
    url: '/mid_manager/airRailwayTicket/batchAirRailwayTicketRefundConform',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 线下退款
export function underLineRefund (data) {
  return request({
    url: '/mid_manager/airRailwayTicket/underLineRefund',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 线下退款
export function TicketRefundConformAgain (data) {
	return request({
		url: '/mid_manager/airRailwayTicket/airRailwayTicketRefundConformAgain',
		method: 'post',
		data: qs.stringify(data)
	})
}
