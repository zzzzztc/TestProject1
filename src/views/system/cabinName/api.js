import request from '../../../utils/request'
import qs from 'qs'

// 舱位名称维护 -- 数据表格
export function queryCabinNameList (data) {
  return request({
    url: '/mid_manager/cabinName/queryCabinNameList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 舱位名称维护 -- 添加
export function addCabinName (data) {
  return request({
    url: '/mid_manager/cabinName/addCabinName',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 舱位名称维护 -- 修改
export function updateCabinName (data) {
  return request({
    url: '/mid_manager/cabinName/updateCabinName',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 舱位名称维护 -- 删除
export function deleteCabinName (data) {
  return request({
    url: '/mid_manager/cabinName/deleteCabinName',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 舱位名称维护 -- 启用/禁用
export function updateSeatLabel (data) {
  return request({
    url: '/mid_manager/cabinName/updateSeatLabel',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 舱位名称维护 -- 修改生效时间
export function batchUpdateCabinName (data) {
  return request({
    url: '/mid_manager/cabinName/batchUpdateCabinName',
    method: 'post',
    data: qs.stringify(data)
  })
}
