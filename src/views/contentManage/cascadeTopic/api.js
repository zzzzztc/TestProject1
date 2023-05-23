import request from '../../../utils/request'
import qs from 'qs'

// 获取列表数据
export function fetchList (data) {
  return request({
    url: '/mid_manager/metCascadeTopic/getMetCascadeTopicList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 启用禁用
export function updateStatus (data) {
  return request({
    url: '/mid_manager/metCascadeTopic/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 编辑
export function updateTopic (data) {
  return request({
    url: '/mid_manager/metCascadeTopic/updateMetCascadeTopic',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 根据级别与父节点查询节点
export function getMetCascadeTopicByClevel (data) {
  return request({
    url: '/mid_manager/metCascadeTopic/getMetCascadeTopicByClevel',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 新增
export function addMetCascadeTopic (data) {
  return request({
    url: '/mid_manager/metCascadeTopic/addMetCascadeTopic',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 查看详情
export function fetchDetail (data) {
  return request({
    url: '/mid_manager/metCascadeTopic/updateMetCascadeTopicBefore',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 编辑
export function updateMetCascadeTopic (data) {
  return request({
    url: '/mid_manager/metCascadeTopic/updateMetCascadeTopic',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 删除
export function deleteCascadeTopic (data) {
  return request({
    url: '/mid_manager/metCascadeTopic/deleteMetCascadeTopic',
    method: 'post',
    data: qs.stringify(data)
  })
}
