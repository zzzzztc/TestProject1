import request from '../../../utils/request'
import qs from 'qs'

export function queryDTicketLimitList (data) { // 列表数据
  return request({
    url: '/mid_manager/dticketlimit/getDTicketLimitList',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryAddDTicketLimit (data) { // 添加
  return request({
    url: '/mid_manager/dticketlimit/addDTicketLimit',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryUpdateDTicketLimit (data) { // 修改
  return request({
    url: '/mid_manager/dticketlimit/updateDTicketLimit',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryDeleteDTicketLimit (data) { // 删除
  return request({
    url: '/mid_manager/dticketlimit/deleteDTicketLimit',
    method: 'post',
    data: qs.stringify(data)
  })
}
