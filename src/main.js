import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import VueWechatTitle from 'vue-wechat-title'
import store from './store/index'
import * as filters from './filters/index'
// element-ui
import ElementUI from 'element-ui'
// 富文本
import VueTinymce from '@packy-tang/vue-tinymce'
// import 'element-ui/lib/theme-chalk/index.css'
import '../element-variables.scss'
// 全局样式
import './styles/index.scss'
import './utils/directives'

Vue.use(ElementUI)
Vue.use(VueWechatTitle)
Vue.use(VueTinymce)
// 注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
// 捕获错误信息
// Vue.config.errorHandler = (err, vm, info) => {
//   console.log(err, vm, info)
// }

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
