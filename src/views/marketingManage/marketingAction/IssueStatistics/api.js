import request from '../../../../utils/request'
import qs from 'qs'

export function querySaleActivityAnalysis (data) { // 活动发放数据统计查询
  return request({
    url: '/mid_manager/saleActivityAnalysis/querySaleActivityAnalysis',
    method: 'post',
    data: qs.stringify(data)
  })
}
