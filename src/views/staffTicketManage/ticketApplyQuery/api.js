import request from '../../../utils/request'
import qs from 'qs'

export function queryDTicketApplyList (data) { // 列表数据
  return request({
    url: '/mid_manager/dticketapply/getDTicketApplyList',
    method: 'post',
    data: qs.stringify(data)
  })
}
