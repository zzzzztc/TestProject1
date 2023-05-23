import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 获取列表数据
  return request({
    url: '/mid_manager/errorRefunds/queryOrdersForRefund',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function applyErrorRefund (data) { // 支付差错退款申请
  return request({
    url: '/mid_manager/errorRefunds/applyErrorRefund',
    method: 'post',
    data: qs.stringify(data)
  })
}
