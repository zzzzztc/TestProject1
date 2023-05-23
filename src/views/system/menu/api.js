import request from '../../../utils/request'
import qs from 'qs'
export function queryMenu (data) {
  return request({
    url: '/mid_manager/menu/listAllMenu',
    method: 'get',
    params: data
  })
}

export function updateMenu (data) {
  return request({
    url: '/mid_manager/menu/modifyMenu',
    method: 'post',
    data: qs.stringify(data)
  })
}
