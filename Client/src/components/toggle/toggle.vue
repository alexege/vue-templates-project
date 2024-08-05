<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
    label: {
        type: String,
        default: 'Toggle'
    },
    initialValue: {
        type: Boolean,
        default: false
    },
    isToggled: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['update:modelValue', 'toggle'])
const isChecked = ref(props.initialValue)
const toggleId = `toggle-${Math.random().toString(36).substr(2, 9)}`
const toggle = (event) => {
    isChecked.value = event.target.checked
    // emit('update:modelValue', isChecked.value)
    emit('toggle', isChecked.value)
}

isChecked.value = props.initialValue

// Flip toggle switch if prop changes
watch(() => props.isToggled, (newValue) => {
    isChecked.value = newValue
});

</script>
<template>
    <!-- {{ initialValue }} -->
    <div class="theme-switch-wrapper">
        <!-- Slider -->
        <label class="theme-switch" :for="toggleId">
            <input type="checkbox" :id="toggleId" :checked="isChecked" @change="toggle" />
            <div class="slider round"></div>
        </label>
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
    /* height: 34px; */
    height: 15px;
    position: relative;
    /* width: 60px; */
    width: 25px;
}

.theme-switch input {
    display: none;
}

.slider {
    background-color: black;
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
    top: 1px;
    left: 1px;
    position: absolute;
    width: 13px;
    height: 13px;
    -webkit-transition: -webkit-transform 0.125s ease-out;
    transition: -webkit-transform 0.125s ease-out;
    transition: transform 0.125s ease-out;
    transition:
        transform 0.125s ease-out,
        -webkit-transform 0.125s ease-out;
}

input:checked+.slider {
    background-color: #42b883;
}

input:checked+.slider:before {
    transform: translateX(10px);
}

.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}
</style>
