import request from '../../../utils/request'
// import qs from 'qs'

// 列表数据
export function queryRecordList (data) {
  return request({
    url: '/luckdraw/v1/record/list',
    method: 'post',
    data: data
  })
}
// 绑定
export function queryBinding (data) {
  return request({
    url: '/luckdraw/v1/record/bind/' + data,
    method: 'PUT'
  })
}
// 修改备注
export function queryUpdate (data) {
  return request({
    url: '/luckdraw/v1/record/update',
    method: 'put',
    data: data
  })
}
