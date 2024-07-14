<template>
  <div>
    <header class="header">
      <nav class="navbar navbar-expand-lg fixed-top">
        <div class="container">
          <a class="navbar-brand" href="#">
            <img src="@/assets/glarweather4.png" alt="Logo" class="d-inline-block align-text-top" height="40">
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto" v-if="isLoggedIn">
              <li class="nav-item" v-for="cityName in cities" :key="cityName">
                <a
                  class="nav-link"
                  :class="{ active: selectedCity === cityName }"
                  @click="selectCity(cityName)"
                  href="#"
                >
                  {{ capitalize(cityName) }}
                </a>
              </li>
            </ul>
            <button v-if="isLoggedIn" class="btn btn-secondary" @click="handleLogout">
                  Logout
          </button>
          </div>
          
        </div>
      </nav>
    </header>
    <div class="container">
      <router-view :city="selectedCity" @login="handleLogin" />
      <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <div class="col-md-4 d-flex align-items-center">
          <a href="/" class="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
            <img class="bi" width="50" src="@/assets/glarweather1.png" alt="weather icon">
          </a>
          <span class="mb-3 mb-md-0 text-muted">© 2024 Glarweather</span>
        </div>
        <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
          <li class="ms-3"><a class="text-muted" href="https://x.com/OpenWeatherMap" target="_blank"><i class="bi bi-twitter-x"></i></a></li>
          <li class="ms-3"><a class="text-muted" href="https://www.linkedin.com/company/openweathermap/" target="_blank"><i class="bi bi-linkedin"></i></a></li>
          <li class="ms-3"><a class="text-muted" href="https://www.facebook.com/groups/270748973021342" target="_blank"><i class="bi bi-facebook"></i></a></li>
        </ul>
      </footer>
      <button @click="scrollToTop" class="scroll-to-top" v-show="showScrollToTop"><i class="bi bi-arrow-up-short"></i></button>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, onMounted, onUnmounted, provide, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const cities = ref(['lisboa', 'leiria', 'coimbra', 'porto', 'faro']);
const selectedCity = ref('lisboa');
const isLoggedIn = ref(false);
const showScrollToTop = ref(false);
const router = useRouter();

const selectCity = (city) => {
  selectedCity.value = city;
};

const handleLogin = () => {
  isLoggedIn.value = true;
};

const handleLogout = () => {
  localStorage.removeItem('token');
  isLoggedIn.value = false;
  router.push('/');
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Provide the isLoggedIn state to child components
provide('handleLogin', handleLogin);

// Function to capitalize the first letter of a string
const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// Add event listener to handle scroll events for the header
onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    isLoggedIn.value = true;
  }

  const handleScroll = () => {
    const header = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      header.classList.add('navbar-scrolled');
      showScrollToTop.value = true;
    } else {
      header.classList.remove('navbar-scrolled');
      showScrollToTop.value = false;
    }
  };
  
  window.addEventListener('scroll', handleScroll);

  // Clean up the event listener when the component is unmounted
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});

// Watch for changes in isLoggedIn and redirect if necessary
watchEffect(() => {
  console.log('isLoggedIn changed to', isLoggedIn.value);
  if (isLoggedIn.value) {
    router.push('/weather');
  }
});
</script>

<style scoped>
.nav-text-color {
  color: #4e4e4e;
}
.header {
  position: relative;
  height: 30vh;
  background:
    linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1)),
    url('@/assets/sky.webp') no-repeat center center/cover;
}

.navbar-brand img {
  height: 40px;
}

.navbar-scrolled {
  background-color: #5b98cd;
  transition: background-color 0.3s;
}

.navbar-nav .nav-link.active {
  color: #fff;
}

.scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #5b98cd;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s;
}

.scroll-to-top:hover {
  background-color: #4a89cc;
}
</style>
