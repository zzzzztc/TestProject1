import request from '../../../../utils/request'
import qs from 'qs'

export function getMemberDetailInfoByMemId (data) {
  return request({
    url: 'mid_manager/member/getMemberDetailInfoByMemId',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 推广明细
export function promoteList (data) {
  return request({
    url: '/mid_manager/fma/fmaStaffDetail',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 奖励明细
export function awardsList (data) {
  return request({
    url: '/mid_manager/fma/queryMarketAwardDetail',
    method: 'post',
    data: qs.stringify(data)
  })
}
