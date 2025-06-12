<template>
  <v-app>
    <div class="chaos-background">
      <div class="floating-shapes">
        <div v-for="n in 20" :key="n" class="shape" :style="getRandomShapeStyle()"></div>
      </div>
      <router-view />
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const getRandomShapeStyle = () => {
  const colors = ['#ff006e', '#fb5607', '#ffbe0b', '#8338ec', '#3a86ff', '#06ffa5', '#ff4081', '#7c4dff']
  const shapes = ['50%', '0%', '25% 75%', '75% 25%']

  return {
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    borderRadius: shapes[Math.floor(Math.random() * shapes.length)],
    left: Math.random() * 100 + 'vw',
    top: Math.random() * 100 + 'vh',
    animationDelay: Math.random() * 10 + 's',
    animationDuration: (Math.random() * 3 + 2) + 's'
  }
}
</script>

<style scoped>
.chaos-background {
  min-height: 100vh;
  background: linear-gradient(45deg,
    #ff006e 0%,
    #fb5607 14%,
    #ffbe0b 28%,
    #8338ec 42%,
    #3a86ff 57%,
    #06ffa5 71%,
    #ff4081 85%,
    #7c4dff 100%);
  background-size: 400% 400%;
  animation: rainbow-shift 3s ease infinite;
  position: relative;
  overflow: hidden;
}

.floating-shapes {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.shape {
  position: absolute;
  width: 20px;
  height: 20px;
  animation: float 4s ease-in-out infinite, spin 2s linear infinite;
  opacity: 0.7;
}

@keyframes rainbow-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>