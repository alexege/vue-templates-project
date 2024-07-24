<script setup>
import Toggle from '@/components/toggle/toggle.vue'
import { ref, computed } from 'vue'
const dataToggle = ref()
const checkVal = (val) => {
  console.log('checked value is: ', val)
}

import { useThemeStore } from '@/stores/theme.store'
const themeStore = useThemeStore()

const toggleLightMode = () => {
  console.log('toggling light mode', switch1.value)
  if (switch1.value) {
    themeStore.setTheme('light')
  } else {
    themeStore.setTheme('dark')
  }
}

const switch1 = ref(false)

//Color Picker
import ColorPicker from '@/components/color/ColorPicker.vue'

const backgroundColor = ref()
const fontColor = ref()
const themeChoice = ref('dark')

const updateBackgroundColor = (color) => {
  backgroundColor.value = color;
}

const updateFontColor = (color) => {
  fontColor.value = color;
}

const updateColors = () => {
  console.log(`sending values to database: ${backgroundColor} and ${fontColor}`)
}

</script>
<template>
  <div>
    <div class="settings-grid">

      <h2 class="title">Settings</h2>

      <div class="setting">
        <div class="left">
          <span class="material-symbols-outlined icon">
            contrast
          </span>
        </div>
        <div class="middle">
          Toggle
          <span :class="{ active: !switch1 }">Light</span>
          /
          <span :class="{ active: switch1 }">Dark</span>
          Mode
        </div>
        <div class="right">
          <Toggle uid="1" v-model="switch1" label="lock-mode" class="toggle" @change="toggleLightMode">
            Toggle Lock mode
          </Toggle>
        </div>
      </div>

      <div class="setting">
        <div class="left">
          <span class="material-symbols-outlined icon">
            lock
          </span>
        </div>
        <div class="middle">
          Selected Theme
        </div>
        <div class="right">
          <select v-model="themeChoice">
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </div>
      </div>

      <div class="setting">
        <div class="left">
          <span class="material-symbols-outlined icon">
            lock
          </span>
        </div>
        <div class="middle">
          Background Color
        </div>
        <div class="right">
          <color-picker @color="updateBackgroundColor" />
        </div>
      </div>

      <div class="setting">
        <div class="left">
          <span class="material-symbols-outlined icon">
            lock
          </span>
        </div>
        <div class="middle">
          Font Color
        </div>
        <div class="right">
          <color-picker @color="updateFontColor" />

        </div>
      </div>


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