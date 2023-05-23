import request from '../../../utils/request'
import qs from 'qs'

// 系统操作日志查询 -- 数据表格
export function queryOperatorLogList (data) {
  return request({
    url: '/mid_manager/common/queryOperatorLogList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 系统操作日志查询 -- 数据表格
export function exportOperatorLog (data) {
  return request({
    url: '/mid_manager/common/exportOperatorLog',
    method: 'post',
    data: qs.stringify(data)
  })
}
