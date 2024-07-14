<template>
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input type="text" v-model="username" id="username" class="form-control" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input type="password" v-model="password" id="password" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
      <p>Don't have an account? <router-link to="/register">Register</router-link></p>
    </div>
  </template>
  
  <script setup>
  /* eslint-disable */
  import { ref, inject } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const username = ref('');
  const password = ref('');
  const error = ref(null);
  const router = useRouter();
  // Inject the handleLogin function from the parent component
  const handleLogin = inject('handleLogin');
  
  // Function to handle user login
  const login = async () => {
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username: username.value,
        password: password.value
      });
      localStorage.setItem('token', response.data.token);
      handleLogin(response.data.token);
      error.value = null;
      router.push('/weather');
    } catch (err) {
      error.value = 'Invalid username or password.';
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 1rem;
    background: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 1rem;
  }
  </style>
  