## request

封装axios,对回调进行统一处理。

::: tip TIP
  在service.interceptors.response 拦截器中对回调状态再一次判断。
  ``` bash
if (response.data.isSuccessOrfail === 'FAIL') {
    Message({
      type: 'info',
      message: response.data.message
    })
    return Promise.reject(response.data)
  } else {
    return response.data
  }
```
:::

::: tip TIP
异常捕获
``` bash
if (error.message === 'Network Error') {
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
```
:::