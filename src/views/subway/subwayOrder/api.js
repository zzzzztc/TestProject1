import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) {
  return request({
    url: '/mid_manager/airRailwayTicket/queryAirRailwayTicketList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 退票
export function refundHandle (data) {
  return request({
    url: '/mid_manager/airRailwayTicket/airRailwayTicketRefundApply',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 改期
export function airRailwayTicketModifyExpireDate (data) {
  return request({
    url: '/mid_manager/airRailwayTicket/airRailwayTicketModifyExpireDate',
    method: 'post',
    data: qs.stringify(data)
  })
}
