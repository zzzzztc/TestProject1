import request from '../../../utils/request'
import qs from 'qs'

export function queryUpgradDataAnalysis (data) {
  return request({
    url: '/mid_manager/report/upgradDataAnalysis',
    method: 'post',
    data: qs.stringify(data)
  })
}
