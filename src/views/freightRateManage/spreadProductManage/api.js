import request from '../../../utils/request'
import qs from 'qs'

export function queryRulers (data) { // 列表数据
  return request({
    url: '/config_manager/configManager/queryRulers',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryRulerByInfo (data) { // 列表数据 -- 模糊查询
  // console.log(data)
  return request({
    url: '/config_manager/ruleManager/queryAllRules',
    method: 'post',
    data: data
  })
}
export function queryConfigsInRuler (data) { // 查询上浮规则中的配置
  return request({
    url: '/config_manager/configManager/queryConfigsInRuler',
    method: 'post',
    data: data
  })
}
export function queryProductsInRuler (data) { // 查询动态规则中的产品
  return request({
    url: '/config_manager/configManager/queryProductsInRuler',
    method: 'post',
    data: data
  })
}
export function updateConfigsInRuler (data) { // 修改/绑定上浮规则的配置
  return request({
    url: '/config_manager/configManager/updateConfigsInRuler',
    method: 'post',
    data: data
  })
}
export function updateProductsInRuler (data) { // 修改/绑定动态规则的产品
  return request({
    url: '/config_manager/configManager/updateProductsInRuler',
    method: 'post',
    data: data
  })
}
export function addRulers (data) { // 新增规则
  return request({
    url: '/config_manager/ruleManager/addRules',
    method: 'post',
    data: data
  })
}
export function updateRuler (data) { // 修改规则
  return request({
    url: '/config_manager/ruleManager/updateRule',
    method: 'post',
    data: data
  })
}
export function deleteRulers (data) { // 删除规则
  return request({
    url: '/config_manager/ruleManager/deleteRulers',
    method: 'post',
    data: data
  })
}

export function fetchConfig (id) { // 查规则
  return request({
    url: '/config_manager/ruleRelate/queryConfigsByRule?ruleId=' + id,
    method: 'get'
  })
}
// 更新配置
export function updateRuleConfig (data) {
  return request({
    url: '/config_manager/ruleRelate/updateConfigsInRuler',
    method: 'post',
    data: data
  })
}
// 查商品
export function fetchProduct (id) {
  return request({
    url: `/config_manager/ruleRelate/queryProductsByRule?ruleId=${id}`,
    method: 'get'
  })
}
// 更新商品
export function updateProduct (data) {
  return request({
    url: '/config_manager/ruleRelate/updateProductsInRuler',
    method: 'post',
    data: data
  })
}
