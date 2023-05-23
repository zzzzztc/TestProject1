import request from '../../../utils/request'
import qs from 'qs'

//  下拉列表/postAddress/queryPostAddressInfoList
export function querydictsByType (data) { // 列表数据
  return request({
    url: '/mid_manager/common/querydictsByType',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  表格/member/getMemberOperateRecordList
export function getMemberOperateRecordList (data) {
  return request({
    url: '/mid_manager/member/getMemberOperateRecordList',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  ip查询/member/getIpAdress
export function getIpAdress (data) {
  return request({
    url: '/mid_manager/member/getIpAdress',
    method: 'post',
    data: qs.stringify(data)
  })
}
