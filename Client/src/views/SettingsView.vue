<script setup>
import Toggle from '@/components/toggle/toggle.vue';
import { ref, computed, onMounted, watch } from 'vue';
import { useThemeStore } from '@/stores/theme.store';

// Reactive variables
const fgColor = ref(localStorage.getItem('fgColor') || '#ffffff');
const bgColor = ref(localStorage.getItem('bgColor') || '#000000');
const switch1 = ref(false);
const themeChoice = ref(localStorage.getItem('theme') || 'dark-mode');

// Theme Store
const themeStore = useThemeStore();

// Computed properties
const fontColor = computed(() => fgColor.value);
const backgroundColor = computed(() => bgColor.value);

// On component mount
onMounted(() => {
  themeStore.foregroundColor = fgColor.value;
  themeStore.backgroundColor = bgColor.value;

  if (localStorage.getItem('theme') === 'light-mode') {
    switch1.value = false;
    localStorage.setItem('theme', 'light-mode');
  } else if (localStorage.getItem('theme') === 'dark-mode') {
    switch1.value = true;
    localStorage.setItem('theme', 'dark-mode');
  }
});

// Update theme in local storage and store
const updateTheme = (mode, fg, bg) => {
  themeStore.setTheme(mode);
  themeStore.setCustomColors(fg, bg);
  localStorage.setItem('theme', mode);
  localStorage.setItem('fgColor', fg);
  localStorage.setItem('bgColor', bg);
};

// Background Color Selected
const updateBackgroundColor = () => {
  themeChoice.value = 'custom-mode';
  updateTheme('custom-mode', fontColor.value, bgColor.value);
};

// Font Color Selected
const updateFontColor = () => {
  themeChoice.value = 'custom-mode';
  updateTheme('custom-mode', fgColor.value, backgroundColor.value);
};

// Toggle Dark / Light
const handleToggle = (value) => {
  const mode = value ? 'dark-mode' : 'light-mode';
  const fg = value ? '#ffffff' : '#000000';
  const bg = value ? '#000000' : '#ffffff';
  updateTheme(mode, fg, bg);
  value ? switch1.value = true : switch1.value = false;
};

// Handle DropDown Theme Selection
const handleThemeSelection = () => {
  const modes = {
    'light-mode': { fg: '#000000', bg: '#ffffff' },
    'dark-mode': { fg: '#ffffff', bg: '#000000' },
    'custom-mode': { fg: fontColor.value, bg: backgroundColor.value }
  };

  const selected = modes[themeChoice.value];
  if (selected) {
    updateTheme(themeChoice.value, selected.fg, selected.bg);
  }
};

// Throttle Color Picker
function throttle(func, delay) {
  let lastCall = 0;
  let timeoutId;

  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay - (now - lastCall));
    }
  };
}

// Throttled color update
const throttledColor = ref();
const updateValue = throttle((value) => {
  throttledColor.value = value;
  emitColorSelection();
}, 500);

// Handle Input
const handleInput = () => {
  console.log('Input is updating');
};

if (localStorage.getItem('theme') === 'light-mode') {

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
          <Toggle uid="1" v-model="switch1" label="lock-mode" class="toggle" @toggle="handleToggle"
            :initial-value="switch1">
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
        <div class="right">
          <select v-model="themeChoice" @change="handleThemeSelection">
            <option value="light-mode">light</option>
            <option value="dark-mode">dark</option>
            <option value="custom-mode">custom</option>
          </select>
        </div>
      </div>

      <div class="setting" v-if="themeChoice === 'custom-mode'">
        <div class="left">
          <i class='bx bx-lock'></i>
        </div>
        <div class="middle">
          Background Color
        </div>
        <div class="right">
          <input type="color" v-model="bgColor" @input="handleInput" @change="updateBackgroundColor">
        </div>
      </div>

      <div class="setting" v-if="themeChoice === 'custom-mode'">
        <div class="left">
          <i class='bx bx-lock'></i>
        </div>
        <div class="middle">
          Font Color
        </div>
        <div class="right">
          <input type="color" v-model="fgColor" @input="handleInput" @change="updateFontColor">
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.left {
  flex: 1;
}

.middle {
  flex: 2;
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
  gap: 10px;
}

.setting {
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.setting .toggle {
  flex: 1;
  justify-content: end;
}

.settings-grid .title {
  margin: 0 auto;
}

/* Simple css to style it like a toggle switch */
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
