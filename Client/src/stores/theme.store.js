import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'dark-mode',
    foregroundColor: localStorage.getItem('fgColor') || '#ffffff',
    backgroundColor: localStorage.getItem('bgColor') || '#000000'
  }),
  actions: {
    setTheme(theme) {
      this.theme = theme
      const colors = this.getColorsForTheme(theme)
      this.setCustomColors(colors.fg, colors.bg)
      this.updateLocalStorage(theme, colors.fg, colors.bg)
      this.updateCSSVariables(colors.fg, colors.bg)
    },
    setCustomColors(fgColor, bgColor) {
      this.foregroundColor = fgColor
      this.backgroundColor = bgColor
      this.updateCSSVariables(fgColor, bgColor)
    },
    updateCSSVariables(fgColor, bgColor) {
      document.documentElement.style.setProperty('--font-color', fgColor)
      document.documentElement.style.setProperty('--bg-color', bgColor)
    },
    updateLocalStorage(theme, fgColor, bgColor) {
      localStorage.setItem('theme', theme)
      localStorage.setItem('fgColor', fgColor)
      localStorage.setItem('bgColor', bgColor)
    },
    getColorsForTheme(theme) {
      const themes = {
        'light-mode': { fg: '#000000', bg: '#ffffff' },
        'dark-mode': { fg: '#ffffff', bg: '#000000' }
      }
      return themes[theme] || { fg: this.foregroundColor, bg: this.backgroundColor }
    },
    getTheme() {
      this.foregroundColor = localStorage.getItem('fgColor') || '#ffffff'
      this.backgroundColor = localStorage.getItem('bgColor') || '#000000'
      this.updateCSSVariables(this.foregroundColor, this.backgroundColor)
    }
  }
})
