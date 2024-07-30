<script setup>
import Toggle from '@/components/toggle/toggle.vue'
import { ref, computed, onMounted, watch } from 'vue'


const fgColor = ref("#fff");
const bgColor = ref("#000");

import { useThemeStore } from '@/stores/theme.store'
const themeStore = useThemeStore()
const switch1 = ref(false)

const fontColor = ref()
const backgroundColor = ref()
const themeChoice = ref('dark')

onMounted(() => {
  themeStore.foregroundColor = localStorage.getItem('fgColor') || '#ffffff'
  themeStore.backgroundColor = localStorage.getItem('bgColor') || '#000000'
  fgColor.value = themeStore.foregroundColor
  bgColor.value = themeStore.backgroundColor
  themeStore.getTheme()
})

//Background Color Selected
const updateBackgroundColor = () => {
  themeChoice.value = 'custom'
  themeStore.setTheme('custom-mode')
  themeStore.setCustomColors(fontColor.value, bgColor.value)
  backgroundColor.value = bgColor.value;

  localStorage.setItem('theme', 'custom-mode')
  localStorage.setItem('bgColor', bgColor.value)
  localStorage.setItem('fgColor', fontColor.value)
}

//Font Color Selected
const updateFontColor = () => {
  themeChoice.value = 'custom'
  themeStore.setTheme('custom-mode')
  themeStore.setCustomColors(fgColor.value, backgroundColor.value)
  fontColor.value = fgColor.value;

  localStorage.setItem('theme', 'custom-mode')
  localStorage.setItem('bgColor', backgroundColor.value)
  localStorage.setItem('fgColor', fgColor.value)
}

//Toggle Dark / Light
const handleToggle = (value) => {
  console.log("Value is: ", value)
  value ? themeStore.setTheme('dark-mode') : themeStore.setTheme('light-mode')
  value ? themeStore.setCustomColors('#ffffff', '#000000') : themeStore.setCustomColors('#000000', '#ffffff')
}

//Handle DropDown Theme Selection
const handleThemeSelection = () => {
  if (themeChoice.value === 'light') {
    console.log("Light mode selected")
    fgColor.value = '#ffffff'
    bgColor.value = '#000000'
    themeStore.setTheme('light-mode')
    themeStore.setCustomColors('#000000', '#ffffff')
    localStorage.setItem('fgColor', '#ffffff')
    localStorage.setItem('bgColor', '#000000')
    localStorage.setItem('theme', 'light-mode')
  } else if (themeChoice.value === 'dark') {
    console.log("Dark mode selected")
    fgColor.value = '#000000'
    bgColor.value = '#ffffff'
    themeStore.setTheme('dark-mode')
    themeStore.setCustomColors('#ffffff', '#000000')
    localStorage.setItem('fgColor', '#000000')
    localStorage.setItem('bgColor', '#ffffff')
    localStorage.setItem('theme', 'dark-mode')
  } else if (themeChoice.value === 'custom') {
    console.log("Custom mode selected")
    themeStore.setTheme('custom-mode')
    themeStore.setCustomColors(fontColor.value, backgroundColor.value)
    localStorage.setItem('fgColor', fontColor.value)
    localStorage.setItem('bgColor', backgroundColor.value)
    localStorage.setItem('theme', 'custom-mode')
  }
}

//Throttle Color Picker
function throttle(func, delay) {
  let lastCall = 0;
  let timeoutId;

  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

const updateValue = throttle((value) => {
  throttledColor.value = value;
  emitColorSelection();
}, 500);

// watch(color, (newValue) => {
//   throttledColor.value = newValue;
// })

const handleInput = () => {
  console.log("Input is updating")
}

</script>
<template>
  <div>
    <div class="settings-grid">

      <h2 class="title">Settings</h2>

      <div class="setting">
        <div class="left">
          <i class='bx bx-sun'></i>
        </div>
        <div class="middle">
          Toggle
          <span :class="{ active: !switch1 }">Light</span>
          /
          <span :class="{ active: switch1 }">Dark</span>
          Mode
        </div>
        <div class="right">
          <Toggle uid="1" v-model="switch1" label="lock-mode" class="toggle" @toggle="handleToggle">
            Toggle Lock mode
          </Toggle>
        </div>
      </div>

      <div class="setting">
        <div class="left">
          <i class='bx bx-lock'></i>
        </div>
        <div class="middle">
          Selected Theme
        </div>
        {{ themeChoice }}
        <div class="right">
          <select v-model="themeChoice" @change="handleThemeSelection">
            <option value="light">light</option>
            <option value="dark">dark</option>
            <option value="custom">custom</option>
          </select>
        </div>
      </div>

      <div class="setting">
        <div class="left">
          <i class='bx bx-lock'></i>
        </div>
        <div class="middle">
          Background Color
        </div>
        <div class="right">
          {{ bgColor }}
          <input type="color" v-model="bgColor" @input="handleInput" @change="updateBackgroundColor">
        </div>
      </div>

      <div class="setting">
        <div class="left">
          <i class='bx bx-lock'></i>
        </div>
        <div class="middle">
          Font Color
        </div>
        <div class="right">
          {{ fgColor }}
          <input type="color" v-model="fgColor" @input="handleInput" @change="updateFontColor">
        </div>
      </div>

      <pre>{{ themeStore }}</pre>

      Color:{{ fontColor }} <br />
      Background: {{ backgroundColor }}

    </div>

  </div>
</template>
<style scoped>
.left {
  flex: 1;
}

.middle {
  flex: 1;
}

.right {
  flex: 1;
  text-align: right;
}

.right select {
  width: 50%;
}

.active {
  color: #42b883;
}

.settings-grid {
  padding: 2em;
  width: 40%;
  margin: 0 auto;
  display: grid;
  /* grid-template-columns: 1fr 1fr; */
  gap: 10px;
}

.setting {
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* padding: 20px; */
  min-height: 30px;
  padding: 5px;
  border-radius: 5px;
  background-color: rgb(16, 15, 28);
  border: 2px solid rgb(16, 15, 28);
}

.setting .icon {
  flex: 1;
  font-size: 1em;
}

.setting .body {
  /* flex: 3; */
}

.setting .toggle {
  flex: 1;
  justify-content: end;
}

.settings-grid .title {
  margin: 0 auto;
  color: white;
}

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