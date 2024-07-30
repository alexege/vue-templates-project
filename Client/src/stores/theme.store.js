import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'light-mode',
    foregroundColor: localStorage.getItem('fgColor') || '#ffffff',
    backgroundColor: localStorage.getItem('bgColor') || '#000000'
  }),
  actions: {
    setTheme(theme) {
      this.theme = theme
      if (theme === 'light-mode') {
        this.foregroundColor = '#000000'
        this.backgroundColor = '#ffffff'
      } else if (theme === 'dark-mode') {
        this.foregroundColor = '#ffffff'
        this.backgroundColor = '#000000'
      }
      localStorage.setItem('theme', theme)
      // document.documentElement.style.setProperty('--font-color', this.foregroundColor)
      // document.documentElement.style.setProperty('--bg-color', this.backgroundColor)
    },
    setCustomColors(fgColor, bgColor) {
      this.foregroundColor = fgColor
      this.backgroundColor = bgColor
    },

    getTheme() {
      this.foregroundColor = localStorage.getItem('fgColor') || '#ffffff'
      this.backgroundColor = localStorage.getItem('bgColor') || '#000000'
    }
  }
})
