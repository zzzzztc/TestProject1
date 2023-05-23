import request from '../../../utils/request'
import qs from 'qs'
// 获取列表数据
export function fetchList (data) {
  return request({
    url: '/mid_manager/refund/queryMetticketUpgradFailInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 确认升舱
export function updateUpgradStatus (data) {
  return request({
    url: '/mid_manager/refund/updateUpgradStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 确认退款
export function upgradApplyRefundByhand (data) {
  return request({
    url: '/mid_manager/refund/upgradApplyRefundByhand',
    method: 'post',
    data: qs.stringify(data)
  })
}
