import request from '../../../utils/request'
import qs from 'qs'

//  初始化表格/mailMode/queryMailMode
export function queryMailMode (data) {
  return request({
    url: 'mid_manager/mailMode/queryMailMode',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  修改/mailMode/updateMailMode
export function updateMailMode (data) {
  return request({
    url: 'mid_manager/mailMode/updateMailMode',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  添加/mailMode/addMailMode
export function addMailMode (data) {
  return request({
    url: 'mid_manager/mailMode/addMailMode',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  删除/mailMode/deleteMailMode
export function deleteMailMode (data) {
  return request({
    url: 'mid_manager/mailMode/deleteMailMode',
    method: 'post',
    data: qs.stringify(data)
  })
}

//  启用禁用状态/mailMode/validityMailMode
export function validityMailMode (data) {
  return request({
    url: 'mid_manager/mailMode/validityMailMode',
    method: 'post',
    data: qs.stringify(data)
  })
}
