import request from '../../../utils/request'
import qs from 'qs'

// 会员注销信息 -- 查询
export function queryMemberWriteOffList (data) {
  return request({
    url: '/mid_manager/memberWriteOff/getMemberWriteOffList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 会员注销信息 -- 注销
export function queryWriteOffConfirm (data) {
  return request({
    url: '/mid_manager/memberWriteOff/writeOffConfirm',
    method: 'post',
    data: qs.stringify(data)
  })
}
