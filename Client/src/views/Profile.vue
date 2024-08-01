<script setup>

//Auth Store
import { useAuthStore } from '@/stores/auth.store';
const authStore = useAuthStore();

import FileUpload from '@/components/fileUpload/FileUpload.vue';

const roleConverter = (role) => {
  const roleNames = {
    "ROLE_USER": "User",
    "ROLE_MODERATOR": "Moderator",
    "ROLE_ADMIN": "Admin"
  }

  return roleNames[role]
}

// https://github.com/joezimjs/vue-dd-uploader/tree/main

// Components
import DropZone from '@/components/fileUpload/DropZone.vue'
import FilePreview from '@/components/fileUpload/FilePreview.vue'

// File Management
import useFileList from '@/helpers/file-list'
const { files, addFiles, removeFile } = useFileList()

function onInputChange(e) {
  addFiles(e.target.files)
  e.target.value = null // reset so that selecting the same file again will still cause it to fire this change
}

// Uploader
import createUploader from '@/helpers/file-uploader'
const { uploadFiles } = createUploader('YOUR URL HERE')

</script>
<template>
  <div class="main">
    <div class="card profile">
      <span class="profile-image">
        <img :src="authStore.user.img" alt="">
      </span>
      <h2>{{ authStore.user.username }}</h2>
      <div class="roles">
        <label>Roles:</label>
        <ul>
          <li v-for="role in authStore.user.roles" :key="role">
            <span class="role">
              {{ roleConverter(role) }}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="card stats">
      Stats
      <div>
        <label>Todos:</label>
        <ul>
          <li v-for="todo in authStore.user.todos" :key="todo">
            {{ todo }}
          </li>
        </ul>
      </div>
      <div>
        <label>Timers:</label>
        <ul>
          <li v-for="todo in authStore.user.todos" :key="todo">
            {{ todo }}
          </li>
        </ul>
      </div>
      <div>
        <label>Posts:</label>
        <ul>
          <li v-for="todo in authStore.user.todos" :key="todo">
            {{ todo }}
          </li>
        </ul>
      </div>
    </div>
    <div class="card timers">
      Timers
    </div>
    <div class="card todos">
      {{ authStore.user.todos }}
      Todos
    </div>
    <div class="card posts">
      {{ authStore.user.posts }}
      Posts
    </div>

    <div class="file-upload">
      <FileUpload />
      <DropZone class="drop-area" @files-dropped="addFiles" #default="{ dropZoneActive }">
        <label for="file-input">
          <span v-if="dropZoneActive">
            <span>Drop Them Here</span>
            <span class="smaller">to add them</span>
          </span>
          <span v-else>
            <span>Drag Your Files Here</span>
            <span class="smaller">
              or <strong><em>click here</em></strong> to select files
            </span>
          </span>
          <input type="file" id="file-input" multiple @change="onInputChange" />
        </label>
        <ul class="image-list" v-show="files.length">
          <FilePreview v-for="file of files" :key="file.id" :file="file" tag="li" @remove="removeFile" />
        </ul>
      </DropZone>
      <button @click.prevent="uploadFiles(files)" class="upload-button">Upload</button>
    </div>

  </div>
</template>
<style scoped>
* {
  /* font-family: 'Share Tech Mono', sans-serif; */
  font-family: 'Poppins', sans-serif;
}

.main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: minmax(150px, auto);
  justify-items: center;
  gap: 1em;
  margin: 2em;
  flex: 1 1 0;
  color: black;
}

.card {
  /* box-shadow: 3px 3px 5px black; */
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 15px;
  /* margin: 1em; */
  min-height: 100px;
  transition: box-shadow 0.5s, transform 0.5s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
  transform: translateY(-10px);
  cursor: pointer;
}

.profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* grid-column: 1 / 2; */
  grid-row: 1 / 3;
}

.profile-image {}

.profile-image img {
  min-width: 50px;
  width: 200px;
}

.profile-numbers {}

.roles {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50px;
}

.roles ul {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50px;
}

.roles li {
  list-style-type: none;
}

.role {
  padding: .5em;
  margin: .5em;
  background: white;
  border: 1px solid black;
  border-radius: 5px;
}

.stats {
  grid-column: 1 / 2;
}

.timers {
  grid-row: 2;
}

.todos {
  grid-column: 2 / 2;
  grid-row: 1;
}

.posts {}

.file-upload {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>