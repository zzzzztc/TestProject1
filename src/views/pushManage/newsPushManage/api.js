import request from '../../../utils/request'
import qs from 'qs'

// 消息推送管理 -- 表格数据
export function queryPushNoticeList (data) {
  return request({
    url: '/mid_manager/pushNotice/queryPushNoticeList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 消息推送管理 -- 删除数据
export function deletePushNotice (data) {
  return request({
    url: '/mid_manager/pushNotice/deletePushNotice',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 消息推送管理 -- 添加
export function addPushNotice (data) {
  return request({
    url: '/mid_manager/pushNotice/addPushNotice',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 消息推送管理 -- 修改
export function updatePushNotice (data) {
  return request({
    url: '/mid_manager/pushNotice/updatePushNotice',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 消息推送管理 -- 根据消息类型获取
export function querySystemInfoTree (data) {
  return request({
    url: '/mid_manager/business/querySystemInfoTree',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 消息推送管理 -- 推送
export function pushNoticeInfo (data) {
  return request({
    url: '/mid_manager/pushNotice/pushNoticeInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}
