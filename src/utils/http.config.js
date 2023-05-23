// 生产
let baseUrl = '/'
const nodeEnv = process.env.NODE_ENV
const mode = process.env.VUE_APP_BUILD_TYPE
if (nodeEnv === 'production' && mode !== 'pre') {
  // 生产
  baseUrl = 'http://11.146.124.50:8080/'
} else if (nodeEnv === 'production' && mode === 'pre') {
  // 测试travelMailQuery
  baseUrl = 'http://11.146.209.15:8080'
}
export default baseUrl
