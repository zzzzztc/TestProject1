import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 获取列表
  return request({
    url: '/mid_manager/refund/queryTicketInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function applyRefundByhand (data) { // 提交退票
  return request({
    url: '/mid_manager/refund/applyRefundByhand',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function applyRefundByforce (data) { // 已退票补退
  return request({
    url: '/mid_manager/refund/applyRefundByforce',
    method: 'post',
    data: qs.stringify(data)
  })
}
