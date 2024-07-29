import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    themes: ['light-mode', 'dark-mode', 'custom-mode'],
    theme: localStorage.getItem('theme') || 'light-mode',
    foregroundColor: 'white',
    backgroundColor: 'black'
  }),
  actions: {
    toggleTheme() {
      if (this.theme === 'undefined' || this.theme === null) {
        this.theme = 'light-mode'
      } else if (this.theme == 'light-mode') {
        this.theme = 'dark-mode'
      } else {
        this.theme = 'light-mode'
      }
    },
    setTheme(value) {
      if (value === 'light-mode') {
        this.foregroundColor = 'black'
        this.backgroundColor = 'white'
      } else if ((value = 'dark-mode')) {
        this.foregroundColor = 'white'
        this.backgroundColor = 'black'
      } else {
        this.foregroundColor = localStorage.getItem('fgColor') || 'white'
        this.backgroundColor = localStorage.getItem('bgColor') || 'black'
        document.documentElement.style.setProperty('--font-color', this.foregroundColor)
        document.documentElement.style.setProperty('--bg-color', this.backgroundColor)
      }
      console.log('Setting theme: ', value)
      this.theme = value
      localStorage.setItem('theme', value)
    },
    setCustomColors(fgColor, bgColor) {
      this.foregroundColor = fgColor
      this.backgroundColor = bgColor
    },

    getTheme() {
      this.foregroundColor = localStorage.getItem('fgColor') || 'white'
      this.backgroundColor = localStorage.getItem('bgColor') || 'black'
    }
  }
})
