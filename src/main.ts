import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { createRouter, createWebHistory } from 'vue-router'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import QuizView from '@/components/QuizView.vue'
import ResultsView from '@/components/ResultsView.vue'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark'
  }
})

const routes = [
  { path: '/', redirect: '/question/1' },
  { path: '/question/:page', component: QuizView, props: true },
  { path: '/results', component: ResultsView, props: route => ({ answers: route.query.answers }) }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.mount('#app')