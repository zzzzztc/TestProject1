import request from '../../../utils/request'
import qs from 'qs'

// 补退款申请 -- 数据表格
export function queryRefundList (data) {
  return request({
    url: '/mid_manager/repairRefund/queryRefundList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 补退款申请 -- 渠道
export function channels (data) {
  return request({
    url: '/mid_manager/common/channels',
    method: 'post',
    data: qs.stringify(data)
  })
}
