import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Drag from '../views/Drag.vue'
import DragAndDrop from '../views/DragAndDrop.vue'
import ToDoView from '@/views/ToDoView.vue'
import Profile from '../views/Profile.vue'
import NotesView from '@/views/NotesView.vue'
import SettingsView from '@/views/SettingsView.vue'
import MessagesView from '@/views/MessagesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    {
      path: '/draganddrop',
      name: 'draganddrop',
      component: DragAndDrop
    },
    {
      path: '/todo',
      name: 'todo',
      component: ToDoView
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

export default router
