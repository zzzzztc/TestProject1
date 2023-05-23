import request from '../../../utils/request'
import qs from 'qs'

// 业务参数配置维护 -- 数据表格
export function queryBussParamConfig (data) {
  return request({
    url: '/mid_manager/bussParamConfig/queryBussParamConfig',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 业务参数配置维护 -- 添加
export function addBussParamConfig (data) {
  return request({
    url: '/mid_manager/bussParamConfig/addBussParamConfig',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 业务参数配置维护 -- 修改
export function editBussParamConfig (data) {
  return request({
    url: '/mid_manager/bussParamConfig/editBussParamConfig',
    method: 'post',
    data: qs.stringify(data)
  })
}
