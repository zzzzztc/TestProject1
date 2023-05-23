import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 获取列表
  return request({
    url: '/mid_manager/order/queryOrderInfoList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function reorderPnr (data) { // 重订PNR
  return request({
    url: '/mid_manager/order/reorderPNR',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function orderInfoStatistics (data) { // 获取订单统计数据
  return request({
    url: '/mid_manager/order/orderInfoStatistics',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryUpgradOrderInfo (data) {
  return request({
    url: 'mid_manager/order/queryUpgradOrderInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}
