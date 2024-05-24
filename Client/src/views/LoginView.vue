<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as Yup from 'yup';

import { useAuthStore } from '../stores/auth.store';

const schema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
});

function onSubmit(values, { setErrors }) {
    const authStore = useAuthStore();
    const { username, password } = values;

    return authStore.login(username, password)
        .catch(error => setErrors({ apiError: error }));
}
</script>

<template>
    <div class="login-container">
        <div class="login-form">
            <h2>Login</h2>
            <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
                <div class="form-group">
                    <label>Username</label>
                    <Field name="username" type="text" class="form-control" :class="{ 'is-invalid': errors.username }" />
                    <div class="invalid-feedback">{{errors.username}}</div>
                </div>            
                <div class="form-group">
                    <label>Password</label>
                    <Field name="password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" />
                    <div class="invalid-feedback">{{errors.password}}</div>
                </div>            
                <div class="form-group">
                    <button class="btn btn-primary" :disabled="isSubmitting">
                        <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                        Login
                    </button>
                </div>
                <div v-if="errors.apiError" class="alert alert-danger mt-3 mb-0">{{errors.apiError}}</div>
            </Form>
            <router-link to="/register">Register</router-link>
        </div>
    </div>
</template>
<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
.login-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 400px;
    width: 50%;
    margin: 0 auto;
    outline: 1px solid black;
    border-radius: 5px;
}
.form-group {
    flex: 1;
}
</style>