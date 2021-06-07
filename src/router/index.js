import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:  '/',
    name: 'home',
    component:() => import('@/views/Home.vue'),
  },
  {
    path: '/MachineLearning',
    component:() => import('@/views/MachineLearning/Index.vue'),
    children: [
      {
        path:  "JapanColor",
        name: 'MachineLearning_JapanColor',
        component:() => import('@/views/MachineLearning/JapanColor.vue'),
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
