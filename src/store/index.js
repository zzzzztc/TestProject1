import Vue from 'vue'
import Vuex from 'vuex'
import tagsView from './modules/tagsView/index'
import app from './modules/app/index'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    tagsView
  }
})

export default store
