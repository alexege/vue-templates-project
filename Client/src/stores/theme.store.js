import { defineStore } from 'pinia'
import { onMounted } from 'vue'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    themes: ['light', 'dark'],
    theme: null
  }),
  actions: {
    toggleTheme() {
      console.log('toggling theme', this.theme)
      if (this.theme === 'undefined' || this.theme === null) {
        this.theme = 'light'
      } else if (this.theme == 'light') {
        this.theme = 'dark'
      } else {
        this.theme = 'light'
      }
    }
  }
})

onMounted(() => {
  if (this.$state.theme == undefined) {
    this.$state.theme = 'light'
  }
})
