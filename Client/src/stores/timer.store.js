import { defineStore } from 'pinia'
import axios from "axios"

const API_URL = 'http://localhost:8080/api'

export const useTimerStore = defineStore('timer', {
  state: () => ({
    timers: [],
    timer: null,
    type: null,
    img: null,
    loading: false,
    error: null
  }),
  getters: {
    allTimers: (state) => {
      return state.timers;
    },

    allCountdownTimers: (state) => {
      return state.timers.filter(timer => timer.type == "countdown")
    },
    
    allStopwatchTimers: (state) => {
      return state.timers.filter(timer => timer.type == "stopwatch")
    }
  },
  actions: {
    async fetchTimers() {
        this.timers = []
        this.loading = true
        try {
          this.timers = await fetch(`${API_URL}/timers/`).then((response) => response.json())
        } catch (error) {
          this.error = error
        } finally {
          this.loading = false
        }
    },
    async fetchTimer(id) {
        this.timer = null
        this.loading = true
        try {
          this.timer = await fetch('').then((response) => response.json())
        } catch (error) {
          this.error = error
        } finally {
          this.loading = false
        }
    },

    async addTimer(timer) {
      const newTimer = await axios.post(`${API_URL}/timers/add`, timer)
      this.timers.push(newTimer.data)
    },

    async updateTimer(updatedTimer) {
      console.log("updatedTimer")
      try {
        await axios.patch(`${API_URL}/timers/update/${updatedTimer._id}`, updatedTimer)
        
        let timerToUpdateIdx = this.timers.indexOf(this.timers.find((timer) => timer._id == updatedTimer._id));

        let merged = {
          ...this.timers[timerToUpdateIdx],
          ...updatedTimer
        }

        this.timers[timerToUpdateIdx] = merged;
      } catch (error) {
        console.log("error:", error);
      }
    },

    async deleteTimer(id) {
        try {
            await axios.delete(`${API_URL}/timers/delete/${id}`)
            .then(() => {
              let index = this.timers.findIndex(timer => timer._id == id)
              this.timers.splice(index, 1)
            })
        } catch (error) {
            console.log("error:", error);
        }
    }
  }
})
