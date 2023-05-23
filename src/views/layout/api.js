import request from '../../utils/request'

export function logoff (data) {
  return request({
    url: 'mid_manager/toPage/logoff',
    method: 'get'
  })
}
