<script setup>
import { useAuthStore } from '@/stores/auth.store';
import { ref, computed } from 'vue'

const details = ref({
    firstName: null,
    lastName: null,
    email: null,
    username: null,
    password: null
})
const formType = ref('login')
const switchForms = () => {
    validationErrors.value = {}
    formType.value == 'login' ? (formType.value = 'register') : (formType.value = 'login')
}
const activeForm = computed(() => {
    return formType.value == 'login' ? 'login' : 'register'
})
const validationErrors = ref({})
const login = () => {
    validationErrors.value = {}
    console.log(`Attempting to login with: ${details.value.username} and ${details.value.password}`)
    fieldValidation()

    const authStore = useAuthStore();
    return authStore.login(details.value)
        .catch(error => console.log(error))

}
const register = () => {
    validationErrors.value = {}
    console.log(`Attempting to register with: ${JSON.stringify(details.value)}`)
    fieldValidation()

    const { register } = useAuthStore();

    const userInfo = {
        username: details.value.username,
        password: details.value.password,
        email: details.value.email
    }

    register(userInfo)
        .then(() => {
            console.log("Registering user: ", userInfo.username)
            login()
        })
        .catch((err) => console.log(err));
}
const validateField = (errorField) => {
    switch (errorField) {
        case 'firstName':
            if (!details.value.firstName) {
                validationErrors.value.firstName = 'First Name required'
            } else {
                validationErrors.value.firstName = null
            }
            break
        case 'lastName':
            if (!details.value.lastName) {
                validationErrors.value.lastName = 'Last Name required'
            } else {
                validationErrors.value.lastName = null
            }
            break
        case 'email':
            console.log('Testing email')
            if (!details.value.email) {
                validationErrors.value.email = 'Email required'
            } else if (
                !/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                    details.value.email
                )
            ) {
                validationErrors.value.email = 'Invalid Email'
            } else {
                validationErrors.value.email = null
            }
            break
        case 'username':
            if (!details.value.username) {
                validationErrors.value.username = 'Username required'
            } else {
                validationErrors.value.username = null
            }
            break
        case 'password':
            if (!details.value.password) {
                validationErrors.value.password = 'Password required'
            } else {
                validationErrors.value.password = null
            }
            break
    }
}

const fieldValidation = () => {
    validateField('firstName')
    validateField('lastName')
    validateField('email')
    validateField('username')
    validateField('password')
}

</script>
<template>
    <div class="bdy">
        <div class="container">
            <div class="page-title">
                <h2 @click="switchForms" :class="[formType == 'login' ? 'active' : 'inactive']">Login</h2>
                /
                <h2 @click="switchForms" :class="[formType == 'register' ? 'active' : 'inactive']">
                    Register
                </h2>
            </div>
            <template v-if="formType == 'register'">
                <div class="form-input">
                    <div class="input-field">
                        <input type="text" id="firstName" autocomplete="off" placeholder="" required
                            v-model="details.firstName" @blur="validateField('firstName')" />
                        <label for="firstName">First Name</label>
                    </div>
                    <span class="error" v-if="validationErrors.firstName">{{
                        validationErrors.firstName
                        }}</span>
                </div>
                <div class="form-input">
                    <div class="input-field">
                        <input type="text" id="lastName" autocomplete="off" placeholder="" required
                            @blur="validateField('lastName')" v-model="details.lastName" />
                        <label for="lastName">Last Name</label>
                    </div>
                    <span class="error" v-if="validationErrors.lastName">{{
                        validationErrors.lastName
                        }}</span>
                </div>
                <div class="form-input">
                    <div class="input-field">
                        <input type="text" id="email" autocomplete="off" placeholder="" required
                            @blur="validateField('email')" v-model="details.email" />
                        <label for="email">Email</label>
                    </div>
                    <span class="error" v-if="validationErrors.email">{{ validationErrors.email }}</span>
                </div>
            </template>
            <div class="form-input">
                <div class="input-field">
                    <input type="text" id="username" autocomplete="off" placeholder="" required
                        @blur="validateField('username')" v-model="details.username" />
                    <label for="username">Username</label>
                </div>
                <span class="error" v-if="validationErrors.username">{{ validationErrors.username }}</span>
            </div>
            <div class="form-input">
                <div class="input-field">
                    <input type="password" id="password" autocomplete="off" placeholder="" required
                        @blur="validateField('password')" v-model="details.password" />
                    <label for="password">Password</label>
                </div>
                <span class="error" v-if="validationErrors.password">{{ validationErrors.password }}</span>
            </div>
            <template v-if="activeForm == 'login'">
                <button @click="login">Login</button>
            </template>
            <template v-else>
                <button @click="register">Register</button>
            </template>
        </div>
    </div>
</template>
<style scoped>
.error {
    display: block;
    width: 100%;
    font-weight: bold;
    color: red;
    font-size: 16px;
    text-shadow: 2px 3px 2px black;
    /* background-color: white; */
    padding: .25em;
}

.bdy {
    display: grid;
    height: 100vh;
    place-items: center;
    background: #0b71ac;
}

.container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    outline: 2px solid white;
    padding: 2em;
    border-radius: 5px;
    color: #fff;
    /* background: #ffffff1f; */
    background: #0b71ac;
}

.container h2 {
    text-align: center;
}

.container button {
    min-height: 30px;
    background: none;
    outline: none;
    border: 2px solid #fff;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    background: #1395e0;
}

.container button:hover {
    background-color: #fff;
    color: #0b71ac;
}

.container button:focus {
    /* border: 2px solid cyan; */
    background-color: #fff;
    color: #0b71ac;
    border: 2px solid cyan;
}

.page-title {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.page-title h2 {
    margin: 0 0.5em;
}

.page-title h2:hover {
    cursor: pointer;
}

.active {
    text-decoration: underline;
}

.inactive {
    color: #ffffff7a;
}

.inactive:hover {
    cursor: pointer;
}

.input-field {
    position: relative;
}

.input-field input {
    /* width: 350px; */
    /* height: 60px; */
    min-width: 250px;
    height: 40px;
    border-radius: 5px;
    font-size: 16px;
    padding: 0 15px;
    border: 2px solid #fff;
    background: none;
    outline: none;
    color: #fff;
}

.input-field label {
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
    color: #fff;
    font-size: 19px;
    pointer-events: none;
    transition: 0.3s;
}

.input-field input:focus {
    border: 2px solid cyan;
}

.input-field input:focus~label,
.input-field input:valid~label {
    top: 0;
    left: 15px;
    font-size: 16px;
    padding: 0 2px;
    background: #0b71ac;
}
</style>