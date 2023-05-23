import request from '../../../utils/request'
import qs from 'qs'

//  初始化
export function getSafeQuestionList (data) {
  return request({
    url: 'mid_manager/safeQuestion/getSafeQuestionList',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  状态修改/safeQuestion/updateStatus
export function updateStatus (data) {
  return request({
    url: 'mid_manager/safeQuestion/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
// /safeQuestion/deleteSafeQuestion 删除
export function deleteSafeQuestion (data) {
  return request({
    url: 'mid_manager/safeQuestion/deleteSafeQuestion',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  /safeQuestion/addSafeQuestion添加
export function addSafeQuestion (data) {
  return request({
    url: 'mid_manager/safeQuestion/addSafeQuestion',
    method: 'post',
    data: qs.stringify(data)
  })
}
//  /safeQuestion/updateSafeQuestion修改
export function updateSafeQuestion (data) {
  return request({
    url: 'mid_manager/safeQuestion/updateSafeQuestion',
    method: 'post',
    data: qs.stringify(data)
  })
}
