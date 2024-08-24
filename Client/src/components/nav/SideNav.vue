<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const openSideNav = ref(false)

import { useAuthStore } from '@/stores/auth.store';
const authStore = useAuthStore();
const { user } = storeToRefs(authStore)

const logout = () => {
  authStore.logout()
}

//Show Admin Page
const showAdminPage = computed(() => {
  if (user.value && user.value.roles) {
    return user.value.roles.includes('ROLE_ADMIN');
  }
  return false
})

//Search Bar
const sideNavSearch = ref()

const showTimers = ref(false)
const toggleTimersView = () => {
  showTimers.value = !showTimers.value;
  if (showTimers.value == true && openSideNav.value == false) {
    openSideNav.value = !openSideNav.value
  }
}

import TransitionExpand from '@/components/transitions/TransitionExpand.vue'
import SideNavTimerContainer from '@/components/timers/SideNavTimerContainer.vue'

// Navbar lock/unlock
const isNavLocked = ref(false)

const toggleNavLock = () => {
  console.log("Toggle navlock")
  isNavLocked.value = !isNavLocked.value
  // openSideNav.value = !openSideNav.value

  localStorage.setItem('isNavLocked', isNavLocked.value)
}

const showNav = () => {
  if (!isNavLocked.value) openSideNav.value = true;
}

const hideNav = () => {
  if (!isNavLocked.value) openSideNav.value = false;
}

onMounted(() => {
  isNavLocked.value = JSON.parse(localStorage.getItem('isNavLocked'))
})

const toggleNav = () => {
  console.log("toggling side nav")
  openSideNav.value = !openSideNav.value
}

const searchCategories = (query) => {
  if (query.length > 0) {
    console.log("query: ", query)
  }
}

</script>
<template>
  <aside class="sidebar" :class="{ open: openSideNav }" @mouseover="showNav" @mouseleave="hideNav">
    <div class="logo-details">
      <i class="bx bxl-c-plus-plus icon"></i>
      <div class="logo_name">Templates</div>
      <div class="nav-icons">


        <span @click="toggleNavLock">
          <i v-if="isNavLocked" class='bx bx-lock'></i>
          <i v-else class='bx bx-lock-open'></i>
        </span>

        <span @click="toggleNav()">
          <i v-if="openSideNav" class='bx bx-chevron-left'></i>
          <i v-else class='bx bx-chevron-right'></i>
        </span>

      </div>
    </div>
    {{ sideNavSearch }}
    <ul class="nav-list" :class="{ sideNavScrollBar: !openSideNav }">
      <li>
        <i class="bx bx-search" @click="openSideNav = !openSideNav"></i>
        <input type="text" placeholder="Search..." v-model="sideNavSearch" />
        <span class="tooltip">Search</span>
      </li>
      <li v-if="showAdminPage">
        <a href="#">
          <RouterLink to="/admin">
            <i class="bx bx-grid-alt"></i>
            <span class="links_name">Admin Dashboard</span>
          </RouterLink>
        </a>
        <span class="tooltip">Admin Dashboard</span>
      </li>
      <li>
        <a href="#">
          <RouterLink to="/">
            <i class="bx bx-grid-alt"></i>
            <span class="links_name">Dashboard</span>
          </RouterLink>
        </a>
        <span class="tooltip">Dashboard</span>
      </li>
      <li>
        <div style="display: flex;">
          <a href="#" id="">
            <RouterLink to="/timers" id="sideNavTimers" :class="{ sideNavTimersExpanded: openSideNav }">
              <i class="bx bx-timer"></i>
              <span class="links_name">Timers</span>
            </RouterLink>
          </a>
          <span @click="toggleTimersView" class="timer-extend" v-if="openSideNav">
            <span>
              <i v-if="!showTimers" class='bx bx-chevron-down'></i>
              <i v-else class='bx bx-chevron-up'></i>
            </span>
          </span>
        </div>
        <span class="tooltip">Timers</span>
        <TransitionExpand class="accordion">
          <div v-if="showTimers">
            <!-- <SideNavTimerContainer style="overflow: auto; overflow-x: hidden; height: 300px;" /> -->
            <SideNavTimerContainer style="overflow-y: scroll; overflow-x: hidden;" />
          </div>
        </TransitionExpand>
      </li>
      <li>
        <a href=" #">
          <RouterLink to="/user">
            <i class="bx bx-user"></i>
            <span class="links_name">User</span>
          </RouterLink>
        </a>
        <span class="tooltip">User</span>
      </li>
      <li>
        <a href="#">
          <RouterLink to="/todo">
            <i class="bx bx-list-ul"></i>
            <span class="links_name">Todo</span>
          </RouterLink>
        </a>
        <span class="tooltip">Todo</span>
      </li>
      <li>
        <a href="#">
          <RouterLink to="/notes">
            <i class="bx bx-edit"></i>
            <span class="links_name">Notes</span>
          </RouterLink>
        </a>
        <span class="tooltip">Notes</span>
      </li>
      <li>
        <a href="#">
          <RouterLink to="/messages">
            <i class="bx bx-chat"></i>
            <span class="links_name">Messages</span>
          </RouterLink>
        </a>
        <span class="tooltip">Messages</span>
      </li>
      <!-- <li>
            <a href="#">
              <i class="bx bx-pie-chart-alt-2"></i>
              <span class="links_name">Analytics</span>
            </a>
            <span class="tooltip">Analytics</span>
          </li> -->
      <li>
        <a href="#">
          <i class="bx bx-folder"></i>
          <span class="links_name">File Manager</span>
        </a>
        <span class="tooltip">Files</span>
      </li>
      <!-- <li>
        <a href="#">
          <i class="bx bx-cart-alt"></i>
          <span class="links_name">Order</span>
        </a>
        <span class="tooltip">Order</span>
      </li>
      <li>
        <a href="#">
          <i class="bx bx-heart"></i>
          <span class="links_name">Saved</span>
        </a>
        <span class="tooltip">Saved</span>
      </li> -->
      <li>
        <a href="#">
          <RouterLink to="/settings">
            <i class="bx bx-cog"></i>
            <span class="links_name">Setting</span>
          </RouterLink>
        </a>
        <span class="tooltip">Setting</span>
      </li>
      <li class="profile">
        <div class="profile-details">
          <div class="name_job">
            <div class="name" v-if="user && user.username">{{ user.username }}</div>
            <div class="job">Software Developer</div>
          </div>
        </div>
        <i class="bx bx-log-out" id="log_out" @click="logout"></i>
      </li>
    </ul>
  </aside>
</template>
<style scoped>
.sideNavScrollBar {
  overflow: hidden;
}

/* Google Font Link */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

aside {
  display: flex;
  flex-direction: column;

  width: calc(2rem + 48px);
  overflow: hidden;
  min-height: 100vh;
  padding: 1rem;

  transition: 0.2 ease-in-out;
}

.sidebar-container {
  position: fixed;
  height: 100%;
}

.sidebar {
  position: relative;
  /* position: fixed; */
  /* left: 0; */
  /* top: 0; */
  /* height: 100%; */
  width: 78px;
  background: #11101d;
  /* background: #209fe954; */
  padding: 6px 14px;
  z-index: 99;
  transition: all 0.5s ease;
}

.sidebar.open {
  width: 250px;
}

.sidebar .logo-details {
  height: 60px;
  display: flex;
  align-items: center;
  position: relative;
  color: white;
}

.sidebar .logo-details .icon {
  opacity: 0;
  transition: all 0.5s ease;
}

.sidebar .logo-details .nav-icons {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  cursor: pointer;
}

.sidebar .logo-details .logo_name {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  opacity: 0;
  transition: all 0.5s ease;
}

.sidebar.open .logo-details .icon,
.sidebar.open .logo-details .logo_name {
  opacity: 1;
}

.sidebar .logo-details #btn {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  font-size: 22px;
  transition: all 0.4s ease;
  font-size: 23px;
  text-align: center;
  cursor: pointer;
  transition: all 0.5s ease;
}

.sidebar.open .logo-details #btn {
  text-align: right;
}

.sidebar i {
  color: #fff;
  height: 60px;
  min-width: 50px;
  font-size: 28px;
  text-align: center;
  line-height: 60px;
}

.sidebar .nav-list {
  /* margin-top: 20px; */
  height: 100%;
  /* height: calc(100% - 140px); */


  /* overflow-y: scroll; */
  overflow-x: hidden;
  /* overflow: auto; */
  /* margin: -6px -14px; */
}

.sidebar .nav-list li {
  margin: 5px 0;
}

.router-link-active,
.router-link-exact-active {
  background-color: white !important;
  color: black !important;
}

.router-link-exact-active span,
.router-link-exact-active i {
  color: black !important;
}

.sidebar li {
  position: relative;
  /* margin: 8px 6px; */
  list-style: none;
}

.sidebar li .tooltip {
  position: absolute;
  top: -20px;
  left: calc(100% + 15px);
  z-index: 3;
  background: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 400;
  opacity: 0;
  white-space: nowrap;
  pointer-events: none;
  transition: 0s;
}

.sidebar li:hover .tooltip {
  opacity: 1;
  pointer-events: auto;
  transition: all 0.4s ease;
  top: 50%;
  transform: translateY(-50%);
}

.sidebar.open li .tooltip {
  display: none;
}

.sidebar input {
  font-size: 15px;
  color: #fff;
  font-weight: 400;
  outline: none;
  height: 50px;
  width: 100%;
  width: 50px;
  border: none;
  border-radius: 12px;
  transition: all 0.5s ease;
  background: #1d1b31;
}

.sidebar.open input {
  padding: 0 20px 0 50px;
  width: 100%;
}

.sidebar .bx-search {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  font-size: 22px;
  background: #1d1b31;
  color: #fff;
}

.sidebar.open .bx-search:hover {
  background: #1d1b31;
  color: #fff;
}

.sidebar .bx-search:hover {
  background: #fff;
  color: #11101d;
}

.sidebar li a {
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: 12px;
  align-items: center;
  text-decoration: none;
  transition: all 0.4s ease;
  background: #11101d;
}

.sidebar li a:hover {
  background: #fff;
}

/* .sidebar li a>#sideNavTimers {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
} */

/* #sideNavTimers {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
} */

.sideNavTimersCompressed {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.sideNavTimersExpanded {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.sidebar li a .links_name {
  color: #fff;
  font-size: 15px;
  font-weight: 400;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: 0.4s;
}

.sidebar.open li a .links_name {
  opacity: 1;
  pointer-events: auto;
}

.sidebar li a:hover .links_name,
.sidebar li a:hover i {
  transition: all 0.5s ease;
  color: #11101d;
}

.sidebar li i {
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  border-radius: 12px;
}

.sidebar li.profile {
  display: flex;
  position: fixed;
  height: 60px;
  width: 78px;
  left: 0;
  bottom: -8px;
  padding: 10px 14px;
  background: #1d1b31;
  transition: all 0.5s ease;
  overflow-x: hidden;
}

.sidebar.open li.profile {
  width: 250px;
}

.sidebar li .profile-details {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.sidebar li img {
  height: 45px;
  width: 45px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 10px;
}

.sidebar li.profile .name,
.sidebar li.profile .job {
  font-size: 15px;
  font-weight: 400;
  color: #fff;
  white-space: nowrap;
}

.sidebar li.profile .job {
  font-size: 12px;
}

.sidebar .profile #log_out {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  background: #1d1b31;
  width: 100%;
  height: 60px;
  line-height: 60px;
  border-radius: 0px;
  transition: all 0.5s ease;
}

.sidebar.open .profile #log_out {
  width: 50px;
  background: none;
}

.home-section {
  position: relative;
  /* background: #e4e9f7; */
  background: #34363b;
  min-height: 100vh;
  top: 0;
  left: 78px;
  width: calc(100% - 78px);
  transition: all 0.5s ease;
  z-index: 2;
}

.sidebar.open~.home-section {
  left: 250px;
  width: calc(100% - 250px);
}

.home-section .text {
  display: inline-block;
  color: #11101d;
  font-size: 25px;
  font-weight: 500;
  margin: 18px;
}

.timer-extend {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: none;
  color: white;
  background: rgba(28, 27, 48, 1);
  height: 50px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  cursor: pointer;
}

.timer-extend:hover {
  color: black;
  background: white;
}

@media (max-width: 420px) {
  .sidebar li .tooltip {
    display: none;
  }
}

/* Scrollbar */
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  /* background: #f1f1f1; */
  background: black;
  height: 40px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  /* background: #888; */
  background: #1d1b31;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: white;
}
</style>
