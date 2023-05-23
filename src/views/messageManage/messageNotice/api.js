import request from '../../../utils/request'
import qs from 'qs'

// 客户消息通知 -- 表格数据
export function querySmsTemplates (data) {
  return request({
    url: '/mid_manager/messageTemplate/querySmsTemplates',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 客户消息通知 -- 删除数据
export function deleteSmsTemplate (data) {
  return request({
    url: '/mid_manager/messageTemplate/deleteSmsTemplate',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 客户消息通知 -- 添加
export function addSmsTemplate (data) {
  return request({
    url: '/mid_manager/messageTemplate/addSmsTemplate',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 客户消息通知 -- 修改
export function updateSmsTemplate (data) {
  return request({
    url: '/mid_manager/messageTemplate/updateSmsTemplate',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 客户消息通知 -- 启用/禁用
export function updateSmsTemplateStatus (data) {
  return request({
    url: '/mid_manager/messageTemplate/updateSmsTemplateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
