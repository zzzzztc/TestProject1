import request from '../../../utils/request'
import qs from 'qs'

export function querySaleActivityDataAnalysis (data) {
  return request({
    url: '/mid_manager/saleActivity/querySaleActivityDataAnalysis',
    method: 'post',
    data: qs.stringify(data)
  })
}
