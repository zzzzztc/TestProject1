import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 获取列表数据
  return request({
    url: '/mid_manager/errorRefunds/queryRefunds',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function fetchRefundById (data) { // 获取详情
  return request({
    url: '/mid_manager/errorRefunds/getRefundById',
    method: 'get',
    params: data
  })
}
