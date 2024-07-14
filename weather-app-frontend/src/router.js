import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';
import Weather from './components/WeatherWidget.vue';
import Register from './components/Register.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/register', component: Register },
  { path: '/weather', component: Weather, props: true },
];

// Create a router instance with history mode
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global navigation guard to protect the weather route
router.beforeEach((to, from, next) => {
  if (to.path === '/weather' && !localStorage.getItem('token')) {
    next('/');
  } else {
    next();
  }
});

export default router;

