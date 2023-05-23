import request from '../../../utils/request'

// 列表数据
export function queryticketList (data) {
  return request({
    url: '/electro-user/admin/v1/invoice/ticket/list',
    method: 'post',
    data: data
  })
}
