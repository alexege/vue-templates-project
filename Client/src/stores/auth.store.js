import { defineStore } from 'pinia';
import router from '../router/index';
import axios from "axios";

const baseUrl = `${import.meta.env.VITE_API_URL}/auth`;

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user')),
        users: [],
        returnUrl: null
    }),
    actions: {
        async login(username, password) {
            const user = await axios.post(`${baseUrl}/signin`, { username, password });

            // update pinia state
            this.user = user.data;

            // store user details and jwt in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            // redirect to previous url or default to home page
            router.push(this.returnUrl || '/');
        },

        async register(signUpData) {

            try {
                await axios.post(`${baseUrl}/signup`, signUpData)
                .then((response) => {
                    this.users.push(response.data)
                    router.push('/')
                })
    
            } catch (e) {
                console.log("error:", e)
            }

        },

        async logout() {
            this.user = null;
            localStorage.removeItem('user');
            await router.push('/login');
        }
    }
});