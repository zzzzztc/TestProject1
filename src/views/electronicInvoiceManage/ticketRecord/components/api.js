import request from '../../../../utils/request'

// 查询
export function queryInvoiceDetail (data) {
  return request({
    url: '/electro-user/admin/v1/invoice/detail/' + data,
    method: 'post'
  })
}
// 添加
export function queryInvoiceImport (id, data) {
  return request({
    url: '/electro-user/admin/v1/invoice/import/' + id,
    method: 'post',
    data: data
  })
}
