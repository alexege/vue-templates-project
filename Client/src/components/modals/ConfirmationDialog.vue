<script setup>
import BaseModal from '@/components/modals/BaseModal.vue'

defineProps(['show', 'item'])

const emit = defineEmits(['e', 'value', 'result'])

// We might want to delegate the process of emitting
// the result to somewhere else, so we define a function
// we can pass through scoped slots
function emitResult(value) {
  emit('result', value)
}
</script>

<template>
  <BaseModal :show="show">
    <!-- Default slot, when we want to override the whole component -->
    <slot :emit-result="emitResult">
      <div class="container">
        <!-- Title slot, we pass the `emitResult` in case
        we add a close button or something to it -->
        <slot name="title" :emit-result="emitResult">
          <div class="confirm-title">Please confirm</div>
        </slot>

        <!-- Body slot to customize the content -->
        <slot name="body">
          <div class="confirmation">Are you sure you want to delete:
            <span v-if="item.username">{{ item.username }}</span>
            <span v-if="item.name">{{ item.name }}</span>
            <span v-if="item.title">{{ item.title }}</span>
            ?
          </div>
        </slot>

        <i @click="emitResult(false)" class="bx-x"></i>

        <!-- Actions slot, to customize the dialog buttons -->
        <slot name="actions" :emit-result="emitResult">
          <div class="actions">
            <button class="actions-button deny" @click="emitResult(false)">Cancel</button>

            <button class="actions-button confirm" @click="emitResult(true)">Ok</button>
          </div>
        </slot>
      </div>
    </slot>
  </BaseModal>
</template>
<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.confirm-title {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.actions-button {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  font-weight: 500;
  background-color: rgb(28, 27, 48);
  /* border: 1px solid rgb(16, 15, 28); */
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  border-radius: 10px;
  padding: .5em 1em;
  min-width: 6em;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.actions-button:hover {
  transform: translateY(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.actions .confirm {
  box-sizing: border-box;
  color: lime;
}

.actions .confirm:hover {
  border: 1px solid lime;
}

.actions .deny {
  box-sizing: border-box;
  color: red;
}

.actions .deny:hover {
  border: 1px solid red;
}

.confirmation {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.close {
  position: absolute;
  top: 0;
  right: 0;
  margin: .5em;
  cursor: pointer;
}
</style>
