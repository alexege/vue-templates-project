import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    themes: ['light', 'dark', 'custom'],
    theme: localStorage.getItem('theme') || 'light',
    foregroundColor: 'white',
    backgroundColor: 'black'
  }),
  actions: {
    toggleTheme() {
      if (this.theme === 'undefined' || this.theme === null) {
        this.theme = 'light'
      } else if (this.theme == 'light') {
        this.theme = 'dark'
      } else {
        this.theme = 'light'
      }
    },
    setTheme(value) {
      console.log('Setting theme: ', value)
      this.theme = value
      localStorage.setItem('theme', value)
    }
  }
})
