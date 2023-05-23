import request from '../../../utils/request'
import qs from 'qs'

export function queryDTicketDiscountList (data) { // 列表数据
  return request({
    url: '/mid_manager/dticketdiscount/getDTicketDiscountList',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryAddDTicketDiscount (data) { // 添加
  return request({
    url: '/mid_manager/dticketdiscount/addDTicketDiscount',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function queryUpdateDTicketDiscount (data) { // 修改
  return request({
    url: '/mid_manager/dticketdiscount/updateDTicketDiscount',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryDeleteDTicketDiscount (data) { // 删除
  return request({
    url: '/mid_manager/dticketdiscount/deleteDTicketDiscount',
    method: 'post',
    data: qs.stringify(data)
  })
}
