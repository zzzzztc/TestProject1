import request from '../../../utils/request'
import qs from 'qs'

// 缓存管理 -- 数据表格
export function queryRedisRoute (data) {
  return request({
    url: '/mid_manager/common/queryRedisRoute',
    method: 'get',
    params: data
  })
}

// 缓存管理 -- 清除全部缓存
export function flushRedis (data) {
  return request({
    url: '/mid_manager/common/flushRedis',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 缓存管理 -- 清除多个缓存
export function clearRoute (data) {
  return request({
    url: '/mid_manager/common/clearRoute',
    method: 'post',
    data: qs.stringify(data)
  })
}
