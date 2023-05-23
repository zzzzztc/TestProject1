import request from '../../../utils/request'
import qs from 'qs'

// APP消息推送模板 -- 表格数据
export function queryAppmsgTempletList (data) {
  return request({
    url: '/mid_manager/pushNotice/queryAppmsgTempletList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// APP消息推送模板 -- 消息类型数据
export function querydictsByType (data) {
  return request({
    url: '/mid_manager/common/querydictsByType',
    method: 'post',
    data: qs.stringify(data)
  })
}

// APP消息推送模板 -- 删除数据
export function deleteAppmsgTemplet (data) {
  return request({
    url: '/mid_manager/pushNotice/deleteAppmsgTemplet',
    method: 'post',
    data: qs.stringify(data)
  })
}

// APP消息推送模板 -- 添加
export function addAppmsgTemplet (data) {
  return request({
    url: '/mid_manager/pushNotice/addAppmsgTemplet',
    method: 'post',
    data: qs.stringify(data)
  })
}

// APP消息推送模板 -- 修改
export function updateAppmsgTemplet (data) {
  return request({
    url: '/mid_manager/pushNotice/updateAppmsgTemplet',
    method: 'post',
    data: qs.stringify(data)
  })
}
