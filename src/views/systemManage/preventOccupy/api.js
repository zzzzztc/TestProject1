import request from '../../../utils/request'
import qs from 'qs'

// 系统管理 -- 数据表格
export function queryUnpayOrder (data) {
  return request({
    url: '/mid_manager/member/queryUnpayOrder',
    method: 'get',
    params: data
  })
}
// 系统管理 -- 查看弹出框表格
export function queryUnpayOrderDetail (data) {
  return request({
    url: '/mid_manager/member/queryUnpayOrderDetail',
    method: 'get',
    params: data
  })
}
// 系统管理 -- 封禁
export function addToBlack (data) {
  return request({
    url: '/mid_manager/member/addToBlack',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 系统管理 -- 解禁
export function outOfBlack (data) {
  return request({
    url: '/mid_manager/member/outOfBlack',
    method: 'post',
    data: qs.stringify(data)
  })
}
