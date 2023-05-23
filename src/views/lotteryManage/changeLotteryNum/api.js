import request from '../../../utils/request'
// import qs from 'qs'

// 列表数据
export function queryExchangeList (data) {
  return request({
    url: '/luckdraw/v1/point/exchange/list',
    method: 'post',
    data: data
  })
}
// 添加
export function queryExchangeAdd (data) {
  return request({
    url: '/luckdraw/v1/point/exchange',
    method: 'post',
    data: data
  })
}

// 删除
export function queryExchangeDelete (data) {
  return request({
    url: '/luckdraw/v1/point/exchange/' + data,
    method: 'DELETE'
  })
}

// 启用、禁用
export function queryExchangeStatus (data) {
  return request({
    url: '/luckdraw/v1/point/exchange/' + data.id + '/state/' + data.status + '',
    method: 'PUT'
  })
}
