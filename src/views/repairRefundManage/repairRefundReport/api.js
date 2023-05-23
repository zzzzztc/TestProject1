import request from '../../../utils/request'
import qs from 'qs'

// 系统管理 -- 数据表格
export function queryRepairRefund (data) {
  return request({
    url: '/mid_manager/repairRefund/queryRepairRefund',
    method: 'post',
    data: qs.stringify(data)
  })
}
