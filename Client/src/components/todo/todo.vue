<script setup>
import { ref, computed, onMounted, onBeforeMount, onBeforeUnmount } from "vue";
import { storeToRefs } from 'pinia'

defineEmits(['category'])
defineProps(["todo"]);

// Auth Store
import { useAuthStore } from "@/stores/auth.store";
const { activeUser } = storeToRefs(useAuthStore());

// Todo List Store
import { useTodoListStore } from "../../stores/todo.store";
const todoStore = useTodoListStore();
const { toggleCompleted, editTodo, deleteTodo } = todoStore;

const isEditing = ref(false);
const editItem = ref();

const toggleEditMode = (todo) => {
  editItem.value = todo.title;
  isEditing.value = !isEditing.value;
};
const updateTodo = (todo) => {
  todo.title = editItem.value;
  isEditing.value = !isEditing.value;

  todoStore.editTodo(todo._id, todo);
};

const deleteTodoItem = (itemId) => {
  todoStore.deleteTodo(itemId);
};

const timeDiff = (date1, date2) => {
  if (date1 > date2) {
    [date1, date2] = [date2, date1];
  }

  // Get the total difference in milliseconds
  const diffInMs = date2 - date1;

  // Return false if value is too small (nothing shows up)
  if (diffInMs == 0 || diffInMs < 1000) {
    console.log("Diff in time too small, not rendering time since posted")
    return false;
  }

  // Calculate the differences
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

// Permission to interact / edit content
const permissionToManage = (todo) => {

  // Admin, Moderator, Author/Owner

  if (activeUser.value) {

    // Content Owner
    if (todo.author && activeUser.value.id === todo.author._id) {
      //Has full access, as is owner
    } else if (activeUser.value.roles.includes("ROLE_ADMIN")) {
      //Has full access, as is admin
    } else if (activeUser.value.roles.includes("ROLE_MODERATOR")) {
      //Has full access, as is moderator
    } else {
      return false
    }
    return true
  }
}

</script>

<template>
  <div class="todo-container" :class="todo.completed ? 'is-completed' : 'is-incomplete'">
    <div class="todo-left">
      <!-- Checkbox -->
      <input type="checkbox" v-if="permissionToManage(todo)" class="checkbox" @click="toggleCompleted(todo)"
        :checked="todo.completed" />

      <!-- Category -->
      <div v-if="todo.categories" class="todo-category">
        <span v-for="category in todo.categories" :key="category" class="category">
          <a @click.prevent="$emit('category', category.name)">{{ category.name }}</a>
          <!-- <a :href="`/todo/category/${category.name}`">{{ category.name }}</a> -->
        </span>
      </div>

      <span class="priority">{{ todo.priority }}</span>


    </div>

    <!-- Body -->
    <div class="todo-body">

      <div class="todo-top">

        <!-- Editing Mode -->
        <template v-if="isEditing && permissionToManage(todo)">
          <input class="todo-body" type="text" v-model="editItem" @blur="updateTodo(todo)"
            @keydown.enter="$event.target.blur()" autofocus @focus="$event.target.select()">
        </template>
        <template v-else>
          <!-- Todo Body -->
          <span class="todo-body" @dblclick="toggleEditMode(todo)">
            <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
          </span>
        </template>

      </div>


      <!-- Bottom -->
      <div class="todo-bottom">
        <template v-if="todo.author && todo.author.username">
          {{ todo.author.username }}
        </template>

        -

        <!-- Created At Time Since Display -->
        <div class="created-at">
          <template v-if="timeDiff(new Date(), new Date(todo.createdAt)).hours">
            {{ timeDiff(new Date(), new Date(todo.createdAt)).hours }} Hours
          </template>

          <template v-if="timeDiff(new Date(), new Date(todo.createdAt)).minutes">
            {{ timeDiff(new Date(), new Date(todo.createdAt)).minutes }} Minutes
          </template>

          <template v-if="timeDiff(new Date(), new Date(todo.createdAt)).seconds">
            {{ timeDiff(new Date(), new Date(todo.createdAt)).seconds }} Seconds
          </template>
          <span v-if="timeDiff(new Date(), new Date(todo.createdAt))">ago</span>
        </div>
      </div>

    </div>

    <!-- Actions -->
    <div class="todo-actions" v-if="permissionToManage(todo)">
      <span @click="toggleEditMode(todo)">
        <i class="bx bx-edit"></i>
      </span>
      <span @click="deleteTodoItem(todo._id)">
        <i class="bx bx-trash"></i>
      </span>
    </div>
    <div v-else class="todo-actions">
      <span></span>
    </div>

  </div>


</template>

<style scoped>
.todo-container {
  min-width: 50%;
  max-width: 80%;
  /* outline: 1px solid black; */
  padding: 5px;
  margin: 10px auto;
  position: relative;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  /* outline: 1px solid black; */
  border-radius: 2px;
}

.checkbox {
  margin: 5px;
  width: 15px;
  height: 15px;
}

.checkbox:hover {
  cursor: pointer;
}

.todo-category {
  display: flex;
  justify-content: center;
  align-items: center;
}

.todo-category .category {
  margin: 0 .25em;
}

.category {
  /* background-color: #EEF; */
  border-radius: 20px;
  border: 1px #CCF solid;
  /* padding: 2px 5px; */
  padding: 8px 12px;
  /* display: inline; */
  display: flex;
  justify-content: center;
  font-size: .75em;
  cursor: pointer;
  min-width: 30px;
}

.category:hover {
  outline: 1px solid lime;
}

.category a {
  min-height: 20px;
  text-decoration: none;
  /* color: black; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

i {
  padding: .10em .25em;
  font-size: 20px;
  cursor: pointer;

  display: flex;
  justify-content: center;
}

i:hover {
  color: red;
}

.todo-body input {
  text-align: center;
}

.todo-actions {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
}

.todo-actions i {
  font-size: 1em;
  padding: 0 5px;
  cursor: pointer;
}

.todo-actions i:hover {
  color: white;
}

.completed {
  text-decoration: line-through;
}

/* .updated-at,
.created-at {
  font-size: 10px;
} */

.is-completed {
  outline: 2px solid lime;
  /* background-color: rgba(50, 205, 50, 0.25); */
  background-color: black;
}

.is-incomplete {
  outline: 2px solid red;
  /* background-color: rgba(255, 0, 0, 0.25); */
  background-color: black;
}

.todo-top {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 75%;
}

.todo-left {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  /* min-width: 115px; */
  flex: 1;
}

.todo-bottom {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  height: 25%;
}

.todo-body {
  flex: 2;
}

.priority {}
</style>
