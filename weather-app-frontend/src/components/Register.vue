<template>
    <div class="register-container">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input type="text" v-model="username" id="username" class="form-control" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input type="password" v-model="password" id="password" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">Register</button>
      </form>
      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
      <p>Already have an account? <router-link to="/">Login</router-link></p>
    </div>
  </template>
  
  <script setup>
   /* eslint-disable */
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const username = ref('');
  const password = ref('');
  const error = ref(null);
  const router = useRouter();
  
  // Function to handle user registration
  const register = async () => {
    try {
      await axios.post('http://localhost:3000/register', {
        username: username.value,
        password: password.value
      });
      error.value = null;
      router.push('/');
    } catch (err) {
      error.value = err.response.data.message || 'Registration failed.';
    }
  };
  </script>
  
  <style scoped>
  .register-container {
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
  