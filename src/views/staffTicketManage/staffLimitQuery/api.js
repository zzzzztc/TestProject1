import request from '../../../utils/request'
import qs from 'qs'

export function queryDStaffLimitList (data) { // 列表数据
  return request({
    url: '/mid_manager/dstafflimit/getDStaffLimitList',
    method: 'post',
    data: qs.stringify(data)
  })
}
