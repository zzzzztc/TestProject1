import request from '../../../utils/request'
// import qs from 'qs'

// 列表数据
export function queryUserList (data) {
  return request({
    url: '/luckdraw/v1/user/list',
    method: 'post',
    data: data
  })
}
