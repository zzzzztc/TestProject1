import request from '../../../utils/request'
import qs from 'qs'

export function queryAllConfigs (data) { // 获取所有配置
  return request({
    url: '/config_manager/configManager/queryAllConfigs',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function addConfigs (data) { // 添加配置
  return request({
    url: '/config_manager/configManager/addConfigs',
    method: 'post',
    data: data
  })
}
export function updateConfig (data) { // 修改配置
  return request({
    url: '/config_manager/configManager/updateConfig',
    method: 'post',
    data: data
  })
}
export function deleteConfigs (data) { // 删除配置
  return request({
    url: '/config_manager/configManager/deleteConfig',
    method: 'post',
    data: data
  })
}
