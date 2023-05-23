import request from '../../../utils/request'
import qs from 'qs'

// 小程序消息推送模板 -- 表格数据
export function queryMessageTemplates (data) {
  return request({
    url: '/mid_manager/messageTemplate/queryMessageTemplates',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 小程序消息推送模板 -- 删除数据
export function deleteMessageTemplate (data) {
  return request({
    url: '/mid_manager/messageTemplate/deleteMessageTemplate',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 小程序消息推送模板 -- 添加
export function addMessageTemplate (data) {
  return request({
    url: '/mid_manager/messageTemplate/addMessageTemplate',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 小程序消息推送模板 -- 修改
export function updateMessageTemplate (data) {
  return request({
    url: '/mid_manager/messageTemplate/updateMessageTemplate',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 小程序消息推送模板 -- 启用/禁用
export function updateStatus (data) {
  return request({
    url: '/mid_manager/messageTemplate/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
