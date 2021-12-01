import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

import init from '@/utils/init'
Vue.use(init)

const app = new Vue(App)
app.$mount()
