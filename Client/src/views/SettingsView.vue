<script setup>
import { ref, onMounted, watch } from 'vue'

//Store References
import { useThemeStore } from '@/stores/theme.store'
//Light / Dark Mode
const themeStore = useThemeStore()

const toggleTheme = () => {
  themeStore.toggleTheme()
}

//Themes
const theme = ref("Default")

const selectedTheme = () => {
  localStorage.setItem('Theme', theme.value)
}

watch(theme, async (oldTheme, newTheme) => {
  console.log("new theme: ", newTheme)
})

onMounted(() => {
  const selectedTheme = localStorage.getItem('Theme');
  if (selectedTheme) {
    //Set theme to color
    console.log(selectedTheme)
  }
})
</script>
<template>
  <div>
    <div>Settings Page</div>

    <h3>Light/Dark</h3>
    <div class="theme-switch-wrapper">
      <label class="theme-switch" for="checkbox">
        <input type="checkbox" id="checkbox" @click="toggleTheme" />
        <div class="slider round"></div>
      </label>
    </div>

    <h3>Theme</h3>
    <div>
      <select v-model="theme">
        <option value="Default">Default</option>
        <option value="Future">Future</option>
      </select>
    </div>
  </div>
</template>
<style scoped>
/*Simple css to style it like a toggle switch*/
.theme-switch-wrapper {
  display: flex;
  align-items: center;
}

.theme-switch-wrapper em {
  margin-left: 10px;
  font-size: 1rem;
}

.theme-switch {
  display: inline-block;
  height: 34px;
  position: relative;
  width: 60px;
}

.theme-switch input {
  display: none;
}

.slider {
  background-color: #ccc;
  bottom: 0;
  cursor: pointer;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: 0.4s;
}

.slider:before {
  background-color: #fff;
  bottom: 4px;
  content: '';
  height: 26px;
  left: 4px;
  position: absolute;
  transition: 0.4s;
  width: 26px;
}

input:checked+.slider {
  background-color: black;
}

input:checked+.slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
