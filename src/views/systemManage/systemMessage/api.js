import request from '../../../utils/request'
import qs from 'qs'

// 获取版本号信息
export function getAllVersion (data) {
  return request({
    url: '/mid_manager/payMethod/getAllVersion',
    method: 'get'
  })
}
