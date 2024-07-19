import { createRouter, createWebHistory } from 'vue-router'
import AdminDashboard from '@/views/AdminDashboard.vue'
import Dashboard from '../views/Dashboard.vue'
import Drag from '../views/Drag.vue'
// import DragAndDrop from '../views/DragAndDrop.vue'
import ToDoView from '@/views/ToDoView.vue'
import Profile from '../views/Profile.vue'
import NotesView from '@/views/NotesView.vue'
import SettingsView from '@/views/SettingsView.vue'
import MessagesView from '@/views/MessagesView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginRegView from '@/views/LoginRegView.vue'

import { useAuthStore } from '@/stores/auth.store'
import TimerView from '@/views/TimerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: AdminDashboard
    },
    {
      path: '/login',
      name: 'login',
      component: LoginRegView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/drag',
      name: 'drag',
      component: Drag
    },
    // {
    //   path: '/draganddrop',
    //   name: 'draganddrop',
    //   component: DragAndDrop
    // },
    {
      path: '/timers',
      name: 'timers',
      component: TimerView
    },
    {
      path: '/todo',
      name: 'todo',
      component: ToDoView
    },
    {
      path: '/todo/category/:category',
      name: 'todoCategory',
      component: ToDoView,
      props: true
    },
    {
      path: '/user',
      name: 'profile',
      component: Profile
    },
    {
      path: '/notes',
      name: 'notes',
      component: NotesView
    },
    {
      path: '/messages',
      name: 'messages',
      component: MessagesView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    }
  ]
})

router.beforeEach(async (to) => {
  console.log('redirecting you to :', to.path)

  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  const auth = useAuthStore()

  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath
    return '/login'
  }
})

export default router
