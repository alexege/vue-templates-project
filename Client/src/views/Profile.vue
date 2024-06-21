<script setup>

//Auth Store
import { useAuthStore } from '@/stores/auth.store';
const authStore = useAuthStore();

import FileUpload from '@/components/fileUpload/FileUpload.vue';

const roleConverter = (role) => {

  let roles = []

  console.log("role", role)
  const roleNames = {
    "ROLE_USER": "User",
    "ROLE_MODERATOR": "Moderator",
    "ROLE_ADMIN": "Admin"
  }

  role.map((role) => roles.push(roleNames[role]))

  return roles.join(', ')
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
  <div class="profile">
    <h2>{{ authStore.user.username }}</h2>
    <p>Roles:</p>
    <span>{{ roleConverter(authStore.user.roles) }}</span>
    <span style="font-size: 3em" class="profile-image">
      <img :src="authStore.user.img" alt="" width="200px;" height="200px;">
    </span>

    <!-- Info Boxes -->
    <div class="profile-numbers">
      <div class="profile-statistic">
        <label>Posts:</label>
        <p v-if="authStore.user.posts">{{ authStore.user.posts.length ? authStore.user.posts.length : 0 }}</p>
      </div>
      <div class="profile-statistic">
        <label>Todos:</label>
        <p v-if="authStore.user.todos">{{ authStore.user.todos.length }}</p>
      </div>
      <div class="profile-statistic">
        <label>Timers:</label>
        <p v-if="authStore.user.timers">{{ authStore.user.timers.length }}</p>
      </div>
    </div>

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
</template>
<style scoped>
.profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.profile-image {}

.profile-numbers {}
</style>