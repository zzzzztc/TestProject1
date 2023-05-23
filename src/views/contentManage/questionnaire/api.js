import request from '../../../utils/request'
import qs from 'qs'

export function fetchList (data) { // 列表数据
  return request({
    url: '/mid_manager/business/querySurveyList',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function addSurvey (data) { // 新增问卷
  return request({
    url: '/mid_manager/business/addSurvey',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateSurvey (data) { // 新增问卷
  return request({
    url: '/mid_manager/business/updateSurvey',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function deleteSurvey (data) { // 删除问卷
  return request({
    url: '/mid_manager/business/deleteSurvey',
    method: 'post',
    data: qs.stringify(data)
  })
}
