<script setup>
import { ref } from 'vue'

//File Upload
const file = ref(null)

const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        file.value = selectedFile;
    }
}

// Function to upload the file
const uploadFile = () => {
    if (file.value) {
        // Here you can implement your file upload logic
        console.log('Uploading file:', file.value);
        // Reset file after upload
        file.value = null;
    } else {
        console.error('No file selected');
    }
};
</script>
<template>
    <div>
        <h2>File Upload</h2>

        <!-- File Upload -->
        <div>
            <input type="file" @change="handleFileChange">
            <button @click="uploadFile">Upload</button>
            <div v-if="file">
                <h2>File Details:</h2>
                <p><strong>Name:</strong> {{ file.name }}</p>
                <p><strong>Type:</strong> {{ file.type }}</p>
                <p><strong>Size:</strong> {{ file.size }} bytes</p>
            </div>
        </div>

    </div>
</template>