import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 列表数据
  return request({
    url: '/mid_manager/refund/queryRefundManageList',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  数据初始化/member/getHbairMemberList
export function getHbairMemberList (data) { // 列表数据
  return request({
    // url: '/member_manager/member/getHbairMemberList',
    url: '/mid_manager/member/getHbairMemberList',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  安全查询/member/getCredentialsByMemId
export function getCredentialsByMemId (data) { // 列表数据
  return request({
    url: '/mid_manager/member/getCredentialsByMemId',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  实名认证/member/trueNameAuth
export function trueNameAuth (data) { // 列表数据
  return request({
    url: '/mid_manager/member/trueNameAuth',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 会员修改前查询/member/getUpdateMemberInfo
export function getUpdateMemberInfo (data) { // 列表数据
  return request({
    url: '/mid_manager/member/getUpdateMemberInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  会员修改/member/updateMemberInfo
export function updateMemberInfo (data) { // 列表数据
  return request({
    url: '/mid_manager/member/updateMemberInfo',
    method: 'post',
    data: data
  })
}

export function getMemberDetailInfoByMemId (data) {
  return request({
    url: 'mid_manager/member/getMemberDetailInfoByMemId',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 员工解绑
export function unbind (data) {
  return request({
    url: '/mid_manager/fma/unbindFmaStaffMemberBind',
    method: 'post',
    data: qs.stringify(data)
  })
}
