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
const switch2 = ref(false)
const switch3 = ref(false)
const switch4 = ref(false)

</script>
<template>
  <div>
    <div class="settings-grid">

      <h2 class="title">Settings</h2>

      <div class="setting">
        <span class="material-symbols-outlined icon">
          contrast
        </span>
        <div class="body">Toggle
          <span :class="{ active: !switch1 }">Light</span>
          /
          <span :class="{ active: switch1 }">Dark</span>
          Mode
        </div>
        <Toggle uid="1" v-model="switch1" label="lock-mode" class="toggle" @change="toggleLightMode">
          Toggle Lock mode
        </Toggle>
      </div>

      <div class="setting">
        <span class="material-symbols-outlined icon">
          lock
        </span>
        <div class="body">Example Setting Placeholder</div>
        <Toggle uid="2" v-model="switch2" label="lock-mode" class="toggle">
          Toggle Lock mode
        </Toggle>
      </div>

      <div class="setting">
        <span class="material-symbols-outlined icon">
          lock
        </span>
        <div class="body">Example Setting Placeholder</div>
        <Toggle uid="3" v-model="switch3" label="lock-mode" class="toggle">
          Toggle Lock mode
        </Toggle>
      </div>

      <div class="setting">
        <span class="material-symbols-outlined icon">
          lock
        </span>
        <div class="body">Example Setting Placeholder</div>
        <Toggle uid="4" v-model="switch4" label="lock-mode" class="toggle">
          Toggle Lock mode
        </Toggle>
      </div>

    </div>

  </div>
</template>
<style scoped>
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