import { defineStore } from 'pinia'

export const useTimerStore = defineStore('timer', {
  state: () => ({
    timers: [],
    timer: null,
    loading: false,
    error: null
  }),
  getters: {},
  actions: {
    async fetchTimers() {
      this.timers = await fetch('').then((response) => response.json())
    }
  }
})
