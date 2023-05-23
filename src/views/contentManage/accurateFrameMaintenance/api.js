import request from '../../../utils/request'

export function fetchList (data) { // 查询
  return request({
    url: '/zuul/ticket/v1/epid/query',
    method: 'post',
    data
  })
}

export function insert (data) { // 新增
  return request({
    url: '/zuul/ticket/v1/epid/insert',
    method: 'post',
    data
  })
}

export function update (data) { // 修改
  return request({
    url: '/zuul/ticket/v1/epid/update',
    method: 'post',
    data
  })
}

export function deleteNotice (data) { // 删除
  return request({
    url: '/zuul/ticket/v1/epid/delete',
    method: 'post',
    data
  })
}
