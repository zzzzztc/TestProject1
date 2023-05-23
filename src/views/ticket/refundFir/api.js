import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 获取列表数据
  return request({
    url: '/mid_manager/refund/queryAchangeList',
    method: 'post',
    data: qs.stringify(data)
  })
}
