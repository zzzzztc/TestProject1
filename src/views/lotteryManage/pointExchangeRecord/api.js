import request from '../../../utils/request'
// import qs from 'qs'

// 列表数据
export function queryUserpointList (data) {
  return request({
    url: '/luckdraw/v1/userpoint/list',
    method: 'post',
    data: data
  })
}
