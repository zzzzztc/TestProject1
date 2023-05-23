import request from '../../../utils/request'
import qs from 'qs'

// 婴儿姓氏维护 -- 数据表格
export function querySurnameList (data) {
  return request({
    url: '/mid_manager/surname/querySurnameList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 婴儿姓氏维护 -- 添加
export function addSurname (data) {
  return request({
    url: '/mid_manager/surname/addSurname',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 婴儿姓氏维护 -- 修改
export function updateCabinName (data) {
  return request({
    url: '/mid_manager/surname/updateSurname',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 婴儿姓氏维护 -- 删除
export function deleteSurname (data) {
  return request({
    url: '/mid_manager/surname/deleteSurname',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 婴儿姓氏维护 -- 启用/禁用
export function updateSeatLabel (data) {
  return request({
    url: '/mid_manager/cabinName/updateSeatLabel',
    method: 'post',
    data: qs.stringify(data)
  })
}
