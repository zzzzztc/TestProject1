import request from '../../../utils/request'
import qs from 'qs'
export function fetchList (data) {
  return request({
    url: '/mid_manager/order/queryProductOrderList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 查看详情
export function fetchDetail (data) {
  return request({
    url: '/mid_manager/order/queryProductOrderDetailList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 改期
export function postPoneApi (data) {
  return request({
    url: '/mid_manager/order/productOrderDetailChangeDate',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 退毛毯
export function refundBlanket (data) {
  return request({
    url: '/productservice/v1/refundOrder',
    method: 'post',
    data: data
  })
}
