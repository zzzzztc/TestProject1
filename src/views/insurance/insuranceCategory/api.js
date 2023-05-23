import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 获取列表数据
  return request({
    url: '/mid_manager/insurance/queryInsuraces',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function deleteInsuranceCategory (data) { // 删除
  return request({
    url: '/mid_manager/insurance/delInsurace',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function addInsurace (data) { // 新增
  return request({
    url: '/mid_manager/insurance/addInsurace',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateInsurace (data) { // 修改
  return request({
    url: '/mid_manager/insurance/updateInsurace',
    method: 'post',
    data: qs.stringify(data)
  })
}
