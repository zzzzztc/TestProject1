import request from '../../../utils/request'
import qs from 'qs'

// 版本升级记录 -- 数据表格
export function queryVersionList (data) {
  return request({
    url: '/mid_manager/version/queryVersionList',
    method: 'get',
    params: data
  })
}

// 版本升级记录 -- 添加
export function addVersion (data) {
  return request({
    url: '/mid_manager/version/addVersion',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 版本升级记录 -- 修改
export function updateVersion (data) {
  return request({
    url: '/mid_manager/version/updateVersion',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 版本升级记录 -- 删除
export function deleteVersion (data) {
  return request({
    url: '/mid_manager/version/deleteVersion',
    method: 'post',
    data: qs.stringify(data)
  })
}
