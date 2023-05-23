import request from '../../../utils/request'
import qs from 'qs'

export function queryMetCouponTempletDataAnalysis (data) {
  return request({
    url: '/mid_manager/metCouponTemplet/queryMetCouponTempletDataAnalysis',
    method: 'post',
    data: qs.stringify(data)
  })
}
