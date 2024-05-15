import { defineStore } from 'pinia'
// https://blog.logrocket.com/complex-vue-3-state-management-pinia/
export const useNoteStore = defineStore('note', {
  state: () => ({
    notes: [],
    note: null,
    loading: false,
    error: null
  }),
  getters: {
    getNotesPerAuthor: (state) => {
      return (authorId) => state.notes.filter((note) => note.userId === authorId)
    }
  },
  actions: {
    async fetchNotes() {
      this.notes = []
      this.loading = true

      try {
        this.notes = await fetch('https://jsonplaceholder.typicode.com/posts').then((response) =>
          response.json()
        )
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async fetchNote(id) {
      this.note = null
      this.loading = true
      try {
        this.note = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then(
          (response) => response.json()
        )
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    }
  }
})
