import axios from 'axios'
import { Message } from 'element-ui'
import baseUrl from './http.config'
axios.defaults.withCredentials = true
axios.defaults.baseURL = baseUrl
const service = axios.create({
  timeout: 60 * 1000,
  responseType: 'blob',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
})
service.interceptors.request.use(config => {
  const nodeEnv = process.env.NODE_ENV
  const mode = process.env.VUE_APP_BUILD_TYPE
  if (nodeEnv === 'production' && mode !== 'pre') {
    // 生产环境
    config.url = config.url.replace('mid_manager', 'mid_manager2.3')
  } else if (nodeEnv === 'production' && mode === 'pre') {
    // 测试环境
  } else {
    // 开发环境
  }
  if (config.method === 'post') {
    config.headers['Content-Type'] = config.data.isJson ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8'
    if (config.data.isJson) delete config.data.isJson
  }
  return config
})

service.interceptors.response.use(response => {
  if (response.data.isSuccessOrfail === 'FAIL') {
    Message({
      type: 'info',
      message: response.data.message
    })
    return Promise.reject(response.data)
  } else {
    return response.data
  }
}, error => {
  return Promise.reject(error)
})

export default service
