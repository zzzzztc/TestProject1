import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) {
  return request({
    url: '/mid_manager/refund/queryAchangeList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 退积分弹出框 -- 提交
export function comfirmReturnIntegral (data) {
  return request({
    url: '/mid_manager/refund/comfirmReturnIntegral',
    method: 'post',
    data: qs.stringify(data)
  })
}
