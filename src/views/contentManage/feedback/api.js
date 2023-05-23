import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 获取数据列表
  return request({
    url: '/mid_manager/business/queryMetsuggestList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function querySuggestResultList (data) { // 获取详情数据
  return request({
    url: '/mid_manager/business/querySuggestResultList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryKnowledgeList (data) { // 获取知识库列表
  return request({
    url: '/mid_manager/business/queryKnowledgeList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function addSuggestResult (data) { // 提交审核意见
  return request({
    url: '/mid_manager/business/addSuggestResult',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function deleteKnowledge (data) { // 删除知识库
  return request({
    url: '/mid_manager/business/deleteKnowledge',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function queryAgreeContent (data) { // 获取开关功能状态
	return request({
		url: '/mid_manager/agreeContent/queryAgreeContent',
		method: 'post',
		data: qs.stringify(data)
	})
}

// 功能开关 -- 启用/禁用
export function validityAgreeContent (data) {
	return request({
		url: '/mid_manager/agreeContent/validityAgreeContent',
		method: 'post',
		data: qs.stringify(data)
	})
}
