import router from '../router/index'
import axios from 'axios'
import md5 from 'js-md5'
import baseUrl from './http.config'
import { setCookie, getCookie } from '../utils/index'
// import { Message } from 'element-ui'
axios.defaults.withCredentials = true
axios.defaults.baseURL = baseUrl
const service = axios.create({
  timeout: 60 * 1000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
})
service.interceptors.request.use(config => {
  if (config.data && config.data.headers) {
    config.headers = config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      ...config.data.headers
    }
  }
  const nodeEnv = process.env.NODE_ENV
  const mode = process.env.VUE_APP_BUILD_TYPE
  if (nodeEnv === 'production' && mode !== 'pre') {
    // 生产环境
    config.url = config.url.replace('mid_manager', 'mid_manager2.3')
    config.url = config.url.replace('config_manager', 'product')
  } else if (nodeEnv === 'production' && mode === 'pre') {
    // 测试环境
    config.url = config.url.replace('config_manager', 'product')
  } else {
    // 开发环境
  }
  let url = config.url.substring(config.url.lastIndexOf('/') + 1)
  if (url === 'importFdBasicPrice') {
    config.timeout = 300 * 1000
  }
	if (url === 'makeCoupon') {
		console.log('生成优惠券',config.timeout)
		config.timeout = 300 * 1000
	}
  if (config.url.indexOf('zuul') > 0) {
  	return requestConfig(config)
  }
  if (url === 'login' || url === 'logoff') {
    return requestConfig(config)
  } else {
    let cookie = getCookie('HBH_OP_STATE')
    if (cookie && (cookie === md5('isLogin'))) {
      return requestConfig(config)
    } else {
      router.push('/login')
	    // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        response: {
          status: 401
        },
        message: '请登录'
      })
      // 返回登录页
    }
  }
})

service.interceptors.response.use(response => {
  if (response.data.isSuccessOrfail) {
    if (response.data.isSuccessOrfail === 'FAIL') {
      return Promise.reject(response.data)
    } else {
      setCookie('HBH_OP_STATE', md5('isLogin'))
      return response.data
    }
  } else if (response.data.code) {
    if (response.data.code === '1' || response.data.code === 'success') {
      setCookie('HBH_OP_STATE', md5('isLogin'))
      return response.data
    } else {
      return Promise.reject(response.data)
    }
  }
}, error => {
  if (error.message === 'code error') {
    error.message = '系统错误'
  } else if (error.message === 'Network Error') {
    error.message = '网络错误，请重试'
  } else if (error.message.indexOf('timeout') >= 0) {
    error.message = '请求超时，请重试'
  } else {
    if (error.response.status === 500) {
      error.message = '服务器错误'
    } else if (error.response.status === 401) {
      error.message = '验证信息过期，请重新登录'
      router.push('/login')
    } else if (error.response.status === 405) {
      error.message = '请求方法不被允许'
    } else if (error.response.status === 415) {
      error.message = '媒体类型错误'
    } else if (error.response.status === 404) {
      error.message = '资源未找到'
    } else if (error.response.status === 403) {
      error.message = '请求被拒绝'
    } else if (error.response.status === 400) {
      error.message = error.response.data.data
    } else {
      error.message = '未知错误'
    }
  }
  return Promise.reject(error)
})

function requestConfig (config) {
  if ((config.data && config.method === 'post') || (config.data && config.method === 'put')) {
    config.headers['Content-Type'] = config.data.isJson ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8'
    if (config.data.isJson) delete config.data.isJson
  }
  if (config.data && config.data.arr) {
    config.data = config.data.arr
  }
  if (config.url.indexOf('file-manager') !== -1) {
	  console.log('request传参', config.data)
	  config.headers['Content-Type'] = config.data.data.isJson ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8'
	  config.headers['opAccount'] = config.data.headersData.opAccount
	  config.headers['opId'] = config.data.headersData.opId
	  config.headers['opName'] = config.data.headersData.opName
	  config.headers['sourceId'] = config.data.headersData.sourceId
	  config.data = config.data.data
	  if (config.data.isJson) delete config.data.isJson
	  return config
  }
  return config
}

export default service
