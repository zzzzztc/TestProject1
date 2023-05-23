import request from '../../../utils/request'

// 列表数据
export function queryInvoiceList (data) {
  return request({
    url: '/electro-user/admin/v1/invoice/list',
    method: 'post',
    data: data
  })
}
// 作废发票
export function queryDiscardInvoice (data) {
  return request({
    url: '/electro-user/admin/v1/invoice/cancel/' + data.serialNumber,
    method: 'DELETE',
    data: data
  })
}
// 机票详情
export function queryticketDetail (data) {
  return request({
    url: '/electro-user/admin/v1/invoice/' + data,
    method: 'GET',
    data: data
  })
}
