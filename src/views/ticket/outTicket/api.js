import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 列表数据
  return request({
    url: '/mid_manager/refund/outTicketList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryOutTicketByOrderId (data) { // 人工出票所需数据
  return request({
    url: '/mid_manager/refund/queryOutTicketByOrderId',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function outTicketByHand (data) {
  return request({
    url: '/mid_manager/refund/outTicketByHand',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 取消订单
export function cancelOrderApi (data) {
  return request({
    url: '/mid_manager/refund/caneclOrderByErrorOrder',
    method: 'post',
    data: qs.stringify(data)
  })
}
