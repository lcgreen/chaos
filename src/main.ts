import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { createRouter, createWebHistory } from 'vue-router'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import IntroView from '@/components/IntroView.vue'
import QuizView from '@/components/QuizView.vue'
import ResultsView from '@/components/ResultsView.vue'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark'
  }
})

const routes = [
  { path: '/', component: IntroView },
  { path: '/question/:page', component: QuizView, props: true },
  { path: '/results', component: ResultsView, props: (route: any) => ({ answers: route.query.answers }) }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.mount('#app')