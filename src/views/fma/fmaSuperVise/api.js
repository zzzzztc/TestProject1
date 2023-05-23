import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 获取列表数据
  return request({
    url: '/mid_manager/fma/getFmaSuperviseList',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function updateFmaSpvStatus (data) { // 放弃督办，解除督办
  return request({
    url: '/mid_manager/fma/updateFmaSpvStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
