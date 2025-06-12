<template>
  <v-container
    class="intro-container"
    fluid
    :style="chaos.backgroundStyle"
  >
    <!-- Floating chaos shapes -->
    <div
      v-for="i in chaos.getFloatingShapeCount()"
      :key="i"
      class="floating-shape"
      :style="chaos.getFloatingShapeStyle(i - 1)"
    ></div>

    <div class="intro-content">
      <h1
        class="main-title"
        :class="chaos.getTextChaosClass()"
        :style="chaos.getTextChaosStyle()"
      >
        🌪️ CHAOS QUIZ 🌪️
      </h1>

      <p
        class="subtitle"
        :class="chaos.getTextChaosClass()"
        :style="{ color: chaos.currentColors.secondary }"
      >
        Prepare your brain for maximum confusion!
      </p>

      <v-card
        class="seed-card"
        :style="chaos.getCardChaosStyle()"
      >
        <v-card-title
          class="seed-title"
          :class="chaos.getTextChaosClass()"
          :style="{ color: chaos.currentColors.accent }"
        >
          🎯 SEED SELECTION 🎯
        </v-card-title>

        <v-card-text class="seed-content">
          <p
            class="seed-description"
            :style="{ color: chaos.currentColors.secondary }"
          >
            Enter a seed number to create a consistent quiz experience.<br>
            Same seed = same questions (perfect for challenging friends!)
          </p>

          <div class="seed-input-section">
            <v-text-field
              v-model="seedInput"
              label="Enter Seed (or leave empty for random)"
              type="number"
              variant="outlined"
              :style="{
                '--v-field-input-color': chaos.currentColors.accent,
                '--v-field-label-color': chaos.currentColors.secondary
              }"
              class="seed-input"
              :class="{ 'beat-bounce': isBeatBouncing }"
              @mouseenter="playHoverSound(chaos.chaosLevel)"
            />

            <v-select
              v-model="selectedQuestionCount"
              :items="questionCountOptions"
              label="Number of Questions"
              variant="outlined"
              :style="{
                '--v-field-input-color': chaos.currentColors.accent,
                '--v-field-label-color': chaos.currentColors.secondary
              }"
              class="question-count-select"
              :class="{ 'beat-bounce': isBeatBouncing }"
              @mouseenter="playHoverSound(chaos.chaosLevel)"
            />

            <v-select
              v-model="selectedCategories"
              :items="categoryOptions"
              label="Select Categories (leave empty for all)"
              variant="outlined"
              multiple
              chips
              :style="{
                '--v-field-input-color': chaos.currentColors.accent,
                '--v-field-label-color': chaos.currentColors.secondary
              }"
              class="category-select"
              :class="{ 'beat-bounce': isBeatBouncing }"
              @mouseenter="playHoverSound(chaos.chaosLevel)"
            />

            <div class="seed-examples">
              <p :style="{ color: chaos.currentColors.secondary }">Quick seeds:</p>
              <div class="example-seeds">
                <v-chip
                  v-for="example in exampleSeeds"
                  :key="example.seed"
                  :color="chaos.currentColors.primary"
                  variant="outlined"
                  class="example-seed"
                  :class="chaos.getTextChaosClass()"
                  @click="selectSeed(example.seed)"
                  @mouseenter="playHoverSound(chaos.chaosLevel)"
                >
                  {{ example.name }}: {{ example.seed }}
                </v-chip>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="seed-actions">
          <v-btn
            @click="startQuiz"
            @mouseenter="playHoverSound(chaos.chaosLevel)"
            size="large"
            class="start-button"
            :class="[chaos.getButtonChaosClass(), { 'beat-bounce': isBeatBouncing }]"
            :style="chaos.getButtonChaosStyle()"
          >
            🚀 START CHAOS 🚀
          </v-btn>

          <v-btn
            @click="randomSeed"
            @mouseenter="playHoverSound(chaos.chaosLevel)"
            variant="outlined"
            class="random-button"
            :class="chaos.getTextChaosClass()"
            :style="{ borderColor: chaos.currentColors.secondary, color: chaos.currentColors.secondary }"
          >
            🎲 RANDOM SEED
          </v-btn>
        </v-card-actions>
      </v-card>

      <div class="info-section">
        <v-card
          class="info-card"
          :style="{
            ...chaos.getCardChaosStyle(),
            backgroundColor: `${chaos.currentColors.primary}11`
          }"
        >
          <v-card-text>
            <h3
              :class="chaos.getTextChaosClass()"
              :style="{ color: chaos.currentColors.accent }"
            >
              What to Expect:
            </h3>
            <ul class="chaos-features" :style="{ color: chaos.currentColors.secondary }">
              <li>🧠 Mind-bending questions across 5 categories</li>
              <li>📈 Progressive chaos levels (1-10)</li>
              <li>🔢 Configurable quiz length (5-25 questions)</li>
              <li>🥁 120 BPM drum beats to keep you on edge</li>
              <li>🎨 Visual effects that escalate with madness</li>
              <li>🎯 Consistent results with the same seed</li>
            </ul>
          </v-card-text>
        </v-card>

        <div class="current-config-display" v-if="currentSeed || selectedQuestionCount !== 50 || selectedCategories.length > 0">
          <p
            :class="chaos.getTextChaosClass()"
            :style="{ color: chaos.currentColors.accent }"
          >
            <span v-if="currentSeed">Seed: <strong>{{ currentSeed }}</strong></span>
            <span v-if="currentSeed && (selectedQuestionCount !== 50 || selectedCategories.length > 0)"> • </span>
            <span v-if="selectedQuestionCount !== 50">Questions: <strong>{{ selectedQuestionCount }}</strong></span>
            <span v-if="selectedQuestionCount !== 50 && selectedCategories.length > 0"> • </span>
            <span v-if="selectedCategories.length > 0">Categories: <strong>{{ selectedCategories.join(', ') }}</strong></span>
          </p>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAudio } from '@/composables/useAudio'
import { useChaos } from '@/composables/useChaos'
import { useQuizStore } from '@/stores/quiz'

const router = useRouter()
const quizStore = useQuizStore()

// Use chaos level 3 for the intro page (medium chaos)
const chaos = useChaos(3)

// Audio composable
const { playHoverSound, playClickSound, isDrumBeatPlaying } = useAudio()

// State
const seedInput = ref<string>('')
const currentSeed = ref<number | null>(null)
const selectedQuestionCount = ref<number>(50)
const selectedCategories = ref<string[]>([])

// Beat tracking for bounce animation
const isBeatBouncing = ref(false)
const beatBounceInterval = ref<number | null>(null)

// Question count options
const questionCountOptions = [
  { title: '5 Questions (Quick)', value: 5 },
  { title: '10 Questions (Medium)', value: 10 },
  { title: '15 Questions (Long)', value: 15 },
  { title: '20 Questions (Extended)', value: 20 },
  { title: '25 Questions (Classic)', value: 25 },
  { title: '50 Questions (Full Chaos)', value: 50 }
]

// Category options
const categoryOptions = [
  { title: '🍕 Food', value: 'Food' },
  { title: '⚽ Sport', value: 'Sport' },
  { title: '🎬 Film', value: 'Film' },
  { title: '🌍 Country', value: 'Country' },
  { title: '🐾 Animals', value: 'Animals' },
  { title: '🔬 Science', value: 'Science' },
  { title: '📚 History', value: 'History' },
  { title: '🌿 Nature', value: 'Nature' },
  { title: '🚀 Space', value: 'Space' },
  { title: '🫀 Human Body', value: 'Human Body' }
]

// Example seeds for quick selection
const exampleSeeds = [
  { name: 'Classic', seed: 12345 },
  { name: 'Lucky', seed: 777 },
  { name: 'Chaos', seed: 666 },
  { name: 'Answer', seed: 42 },
  { name: 'Elite', seed: 1337 }
]

// Methods
const selectSeed = (seed: number) => {
  seedInput.value = seed.toString()
  currentSeed.value = seed
  playClickSound(chaos.chaosLevel.value)
}

const randomSeed = () => {
  const newSeed = Math.floor(Math.random() * 1000000)
  seedInput.value = newSeed.toString()
  currentSeed.value = newSeed
  playClickSound(chaos.chaosLevel.value)
}

const startQuiz = () => {
  let finalSeed: number

  if (seedInput.value.trim()) {
    finalSeed = parseInt(seedInput.value)
    if (isNaN(finalSeed)) {
      finalSeed = Math.floor(Math.random() * 1000000)
    }
  } else {
    finalSeed = Math.floor(Math.random() * 1000000)
  }

  playClickSound(chaos.chaosLevel.value)

  // Initialize the quiz in the store
  quizStore.resetQuiz()
  quizStore.initializeQuiz(finalSeed, selectedQuestionCount.value, selectedCategories.value)

  // Navigate to first question with seed, question count, and categories
  const queryParams: Record<string, string> = {
    seed: finalSeed.toString(),
    count: selectedQuestionCount.value.toString()
  }

  if (selectedCategories.value.length > 0) {
    queryParams.categories = selectedCategories.value.join(',')
  }

  router.push({
    path: '/question/1',
    query: queryParams
  })
}

// Beat bounce functionality (same as QuizView)
const startBeatBounce = () => {
  if (beatBounceInterval.value) return

  const drumBPM = 120
  const beatInterval = (60 / drumBPM) * 1000 // 500ms for 120 BPM

  const bounce = () => {
    isBeatBouncing.value = true
    setTimeout(() => {
      isBeatBouncing.value = false
    }, 150) // Bounce duration
  }

  // Start immediately
  bounce()

  // Continue bouncing
  beatBounceInterval.value = window.setInterval(bounce, beatInterval)
}

const stopBeatBounce = () => {
  if (beatBounceInterval.value) {
    clearInterval(beatBounceInterval.value)
    beatBounceInterval.value = null
  }
  isBeatBouncing.value = false
}

// Watch for drum beat status to sync bounce animation
watch(isDrumBeatPlaying, (isPlaying) => {
  if (isPlaying) {
    startBeatBounce()
  } else {
    stopBeatBounce()
  }
})

// Watch seed input for changes
watch(() => seedInput.value, (newValue) => {
  if (newValue.trim()) {
    const parsed = parseInt(newValue)
    if (!isNaN(parsed)) {
      currentSeed.value = parsed
    }
  } else {
    currentSeed.value = null
  }
})

onMounted(() => {
  console.log('Intro page mounted')
})

onUnmounted(() => {
  stopBeatBounce()
})
</script>

<style scoped>
.intro-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow-x: hidden;
}

.intro-content {
  max-width: 800px;
  width: 100%;
  text-align: center;
  z-index: 10;
  position: relative;
}

.main-title {
  font-family: 'Creepster', cursive;
  font-size: 4rem;
  color: #fff;
  text-shadow: 4px 4px 0px #000, 8px 8px 15px rgba(0,0,0,0.8);
  margin-bottom: 1rem;
}

.subtitle {
  font-family: 'Bungee', cursive;
  font-size: 1.2rem;
  margin-bottom: 3rem;
}

.seed-card {
  max-width: 600px;
  margin: 0 auto 2rem;
  backdrop-filter: blur(15px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.6);
}

.seed-title {
  font-family: 'Orbitron', monospace;
  font-size: 1.5rem;
  text-align: center;
}

.seed-content {
  padding: 2rem;
}

.seed-description {
  font-size: 1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.seed-input-section {
  margin-bottom: 1rem;
}

.seed-input {
  margin-bottom: 1.5rem;
  transition: transform 0.1s ease-out;
}

.question-count-select {
  margin-bottom: 1.5rem;
  transition: transform 0.1s ease-out;
}

.category-select {
  margin-bottom: 1.5rem;
  transition: transform 0.1s ease-out;
}

.seed-examples {
  text-align: left;
}

.example-seeds {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.example-seed {
  cursor: pointer;
  transition: transform 0.2s;
}

.example-seed:hover {
  transform: scale(1.05);
}

.seed-actions {
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
}

.start-button {
  font-family: 'Orbitron', monospace;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 1rem 2rem;
  transition: transform 0.1s ease-out;
}

.random-button {
  font-family: 'Orbitron', monospace;
}

.info-section {
  margin-top: 2rem;
}

.info-card {
  max-width: 500px;
  margin: 0 auto;
  backdrop-filter: blur(10px);
}

.chaos-features {
  text-align: left;
  list-style: none;
  padding-left: 0;
}

.chaos-features li {
  margin: 0.5rem 0;
  padding-left: 1rem;
}

.current-config-display {
  margin-top: 1rem;
  font-size: 1.1rem;
}

/* Beat bounce animation - syncs with 120 BPM drum kick */
.beat-bounce {
  transform: scale(1.05) translateY(-2px);
}

.floating-shape {
  position: fixed;
  pointer-events: none;
  z-index: 1;
  animation: float-around 5s infinite linear;
}

@keyframes float-around {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0.3;
  }
  25% {
    transform: translate(50px, -50px) rotate(90deg);
    opacity: 0.6;
  }
  50% {
    transform: translate(-30px, -100px) rotate(180deg);
    opacity: 0.4;
  }
  75% {
    transform: translate(-80px, -20px) rotate(270deg);
    opacity: 0.7;
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
    opacity: 0.3;
  }
}

/* Chaos animations */
@keyframes gentle-wobble {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(1deg) scale(1.01); }
  75% { transform: rotate(-1deg) scale(0.99); }
}

@keyframes wobble {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(2deg); }
  75% { transform: rotate(-2deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes gentle-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.gentle-wobble {
  animation: gentle-wobble 4s ease-in-out infinite;
}

.wobbling-text {
  animation: wobble 2s ease-in-out infinite;
}

.shaking-text {
  animation: shake 0.5s ease-in-out infinite;
}

.pulsing-text {
  animation: pulse 1.5s ease-in-out infinite;
}

.bounce-text {
  animation: bounce 1s ease-in-out infinite;
}

.spinning-text {
  animation: gentle-spin 8s linear infinite;
}

.wobbling-button {
  animation: wobble 3s ease-in-out infinite;
}

.pulsing-button {
  animation: pulse 2s ease-in-out infinite;
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .main-title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .seed-content {
    padding: 1rem;
  }

  .example-seeds {
    justify-content: center;
  }

  .seed-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>