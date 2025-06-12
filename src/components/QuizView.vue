<template>
  <v-container
    class="quiz-container"
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

    <div class="chaos-header">
      <h1
        class="title"
        :class="chaos.getTextChaosClass()"
        :style="chaos.getTextChaosStyle()"
      >
        🌪️ CHAOS QUIZ 🌪️
      </h1>
      <div class="progress-chaos">
        <span class="tiny-text" :style="{ color: chaos.currentColors.accent }">
          Question {{ currentQuestionIndex + 1 }} of {{ questions.length }} - CHAOS LEVEL {{ chaos.chaosLevel }} - SEED: {{ quizSeed }}
        </span>
        <div class="keyboard-hints" :style="{ color: chaos.currentColors.secondary }">
          <span>🎮 ↑↓ navigate • 1-4 select • Enter/→ continue • ← back</span>
        </div>
        <v-progress-linear
          :model-value="progress"
          :style="chaos.getProgressChaosStyle()"
          class="progress-bar"
        ></v-progress-linear>
      </div>
    </div>

    <div v-if="!quizCompleted && !currentQuestion" class="loading-chaos">
      <h2
        class="loading-title"
            :class="chaos.getTextChaosClass()"
        :style="{ color: chaos.currentColors.primary }"
      >
        🌀 Loading Chaos Level {{ chaos.chaosLevel }}... 🌀
      </h2>
      <p style="color: white; margin-top: 1rem;">
        Debug: Questions loaded: {{ questions.length }}, Current page: {{ currentPage }}, Current index: {{ currentQuestionIndex }}, Route page: {{ route.params.page }}
      </p>
    </div>

    <v-card
      v-if="!quizCompleted && currentQuestion"
      class="question-card chaos-card"
      :style="chaos.getCardChaosStyle()"
    >
            <v-card-title
        class="question-title"
        :class="[chaos.getQuestionChaosClass(), chaos.getTextChaosClass(), { 'beat-bounce': isBeatBouncing }]"
        :style="{ ...chaos.getQuestionChaosStyle(), ...chaos.getTextChaosStyle() }"
      >
        <span
          v-for="(word, index) in currentQuestion.question.split(' ')"
          :key="index"
          :class="chaos.getTextChaosClass()"
          :style="{
            ...chaos.getTextChaosStyle(),
            animationDelay: `${index * 0.1}s`,
            display: 'inline-block',
            margin: '0 0.2em'
          }"
        >
          {{ word }}
        </span>
      </v-card-title>

      <v-card-text>
        <v-radio-group v-model="selectedAnswer" class="options-group">
                    <v-radio
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            :value="index"
            class="option-radio"
                          :class="chaos.getOptionChaosClass(index)"
            :style="{
              ...chaos.getOptionChaosStyle(index),
              borderColor: chaos.currentColors.secondary,
              backgroundColor: `${chaos.currentColors.primary}22`
            }"
            @mouseenter="playHoverSound(chaos.chaosLevel)"
          >
            <template v-slot:label>
              <span
                v-for="(word, wordIndex) in option.split(' ')"
                :key="wordIndex"
                :class="chaos.getTextChaosClass()"
                :style="{
                  ...chaos.getTextChaosStyle(),
                  color: chaos.currentColors.accent,
                  fontSize: chaos.chaosLevel > 7 ? '1.1em' : '1em',
                  textShadow: `0 0 ${chaos.chaosLevel}px ${chaos.currentColors.primary}`,
                  animationDelay: `${(index * 4 + wordIndex) * 0.05}s`,
                  display: 'inline-block',
                  margin: '0 0.15em'
                }"
              >
                {{ word }}
              </span>
            </template>
          </v-radio>
        </v-radio-group>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn
          @click="nextQuestion"
          @mouseenter="playHoverSound(chaos.chaosLevel)"
          :disabled="selectedAnswer === null"
          size="large"
          class="chaos-button"
          :class="chaos.getButtonChaosClass()"
          :style="chaos.getButtonChaosStyle()"
        >
          {{ currentQuestionIndex === questions.length - 1 ? 'FINISH CHAOS' : 'NEXT CHAOS' }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <div v-if="quizCompleted" class="completion-chaos">
      <h2
        class="completion-title"
        :class="chaos.getTextChaosClass()"
        :style="{ color: chaos.currentColors.accent }"
      >
        🎉 CHAOS LEVEL {{ chaos.chaosLevel }} COMPLETE! 🎉
      </h2>
      <p class="tiny-text" :style="{ color: chaos.currentColors.secondary }">
        Calculating chaos results...
      </p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { quizQuestions, getSeededQuiz, type QuizQuestion } from '@/data/quizQuestions'
import { useAudio } from '@/composables/useAudio'
import { useChaos } from '@/composables/useChaos'

// Props
interface Props {
  page?: string
}
const props = defineProps<Props>()

const router = useRouter()
const route = useRoute()

// Initialize chaos system based on current page and total questions
const currentPage = computed(() => {
  const page = route.params.page
  const pageNum = typeof page === 'string' ? parseInt(page) : 1
  const totalQuestions = questions.value.length || 25
  // Scale chaos level from 1-10 based on progress through quiz
  const chaosLevel = Math.ceil((pageNum / totalQuestions) * 10)
  return Math.max(1, Math.min(chaosLevel, 10)) // Ensure it's between 1-10
})

// Make chaos reactive to page changes
const chaos = computed(() => useChaos(currentPage.value))

// Audio composable with chaos level
const { playHoverSound, playClickSound, setChaosLevel, isDrumBeatPlaying } = useAudio()

// State
const questions = ref<QuizQuestion[]>([])
const currentQuestionIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const answers = ref<number[]>([])
const quizCompleted = ref(false)

// Seed for consistent randomization
const quizSeed = ref<number>(12345)

// Beat tracking for bounce animation
const isBeatBouncing = ref(false)
const beatBounceInterval = ref<number | null>(null)

// Computed
const currentQuestion = computed(() => {
  const question = questions.value[currentQuestionIndex.value]
  console.log('Current question computed:', {
    questionsLength: questions.value.length,
    currentIndex: currentQuestionIndex.value,
    question: question?.question
  })
  return question
})
const progress = computed(() => ((currentQuestionIndex.value + 1) / questions.value.length) * 100)

// Methods
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Generate or get seed from URL
const initializeSeed = () => {
  const urlSeed = route.query.seed
  if (urlSeed && typeof urlSeed === 'string') {
    const parsedSeed = parseInt(urlSeed)
    if (!isNaN(parsedSeed)) {
      quizSeed.value = parsedSeed
      return parsedSeed
    }
  }

  // Generate a random seed if none provided
  quizSeed.value = Math.floor(Math.random() * 1000000)
  return quizSeed.value
}

// Load questions using the seed and count
const loadQuestionsWithSeed = (seed: number, count: number = 25) => {
  questions.value = getSeededQuiz(seed, count)
  console.log('Questions loaded with seed:', seed, 'count:', count)
  console.log('Generated questions:', questions.value.length)
}

// All styling now handled by chaos system

const nextQuestion = () => {
  if (selectedAnswer.value !== null) {
    playClickSound(chaos.value.chaosLevel.value)
    answers.value.push(selectedAnswer.value)

    if (currentQuestionIndex.value < questions.value.length - 1) {
      const nextPage = currentQuestionIndex.value + 2
      router.push(`/question/${nextPage}`)
      selectedAnswer.value = null
    } else {
      quizCompleted.value = true
      setTimeout(() => {
        router.push({
          path: '/results',
          query: { answers: JSON.stringify(answers.value) }
        })
      }, 2000)
    }
  }
}

// Beat bounce functionality
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

// Watch for route changes to update question index and chaos level
watch(() => route.params.page, (newPage) => {
  const pageNum = parseInt((newPage as string) || '1')

  if (pageNum >= 1 && pageNum <= questions.value.length && questions.value.length > 0) {
    currentQuestionIndex.value = pageNum - 1
    selectedAnswer.value = null
    // Scale chaos level from 1-10 based on progress through quiz
    const chaosLevel = Math.ceil((pageNum / questions.value.length) * 10)
    setChaosLevel(chaosLevel)
  }
}, { immediate: true })

// Also watch for questions to be loaded
watch(() => questions.value.length, (newLength) => {
  if (newLength > 0) {
    const pageNum = parseInt((route.params.page as string) || '1')
    if (pageNum >= 1 && pageNum <= newLength) {
      currentQuestionIndex.value = pageNum - 1
      selectedAnswer.value = null
      // Scale chaos level from 1-10 based on progress through quiz
      const chaosLevel = Math.ceil((pageNum / newLength) * 10)
      setChaosLevel(chaosLevel)
    }
  }
})

// Watch for chaos level changes
watch(() => chaos.value.chaosLevel.value, (newLevel) => {
  setChaosLevel(newLevel)
})

// Watch for drum beat status to sync bounce animation
watch(isDrumBeatPlaying, (isPlaying) => {
  if (isPlaying) {
    startBeatBounce()
  } else {
    stopBeatBounce()
  }
})

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (!currentQuestion.value) return

  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault()
      if (selectedAnswer.value === null) {
        selectedAnswer.value = 0
      } else if (selectedAnswer.value > 0) {
        selectedAnswer.value--
      } else {
        selectedAnswer.value = currentQuestion.value.options.length - 1
      }
      playHoverSound(chaos.value.chaosLevel.value)
      break

    case 'ArrowDown':
      event.preventDefault()
      if (selectedAnswer.value === null) {
        selectedAnswer.value = 0
      } else if (selectedAnswer.value < currentQuestion.value.options.length - 1) {
        selectedAnswer.value++
      } else {
        selectedAnswer.value = 0
      }
      playHoverSound(chaos.value.chaosLevel.value)
      break

    case 'ArrowLeft':
      event.preventDefault()
      if (currentQuestionIndex.value > 0) {
        router.push(`/question/${currentQuestionIndex.value}`)
      }
      break

    case 'ArrowRight':
    case 'Enter':
      event.preventDefault()
      if (selectedAnswer.value !== null) {
        nextQuestion()
      }
      break

    case '1':
    case '2':
    case '3':
    case '4':
      event.preventDefault()
      const optionIndex = parseInt(event.key) - 1
      if (optionIndex < currentQuestion.value.options.length) {
        selectedAnswer.value = optionIndex
        playHoverSound(chaos.value.chaosLevel.value)
      }
      break
  }
}

onMounted(() => {
  console.log('Component mounted, loading questions...')

  // Initialize seed and question count
  const seed = initializeSeed()
  const urlCount = route.query.count
  const questionCount = urlCount && typeof urlCount === 'string' ? parseInt(urlCount) : 25

  // Validate question count (1-25)
  const validCount = Math.max(1, Math.min(questionCount, 25))

  loadQuestionsWithSeed(seed, validCount)

  const pageNum = parseInt((route.params.page as string) || '1')
  console.log('Current page:', pageNum)
  console.log('Using seed:', seed)
  console.log('Question count:', validCount)
  console.log('Route params:', route.params)

  // Set question index (1-validCount)
  if (pageNum >= 1 && pageNum <= questions.value.length) {
    currentQuestionIndex.value = pageNum - 1
    // Scale chaos level from 1-10 based on progress through quiz
    const chaosLevel = Math.ceil((pageNum / questions.value.length) * 10)
    setChaosLevel(chaosLevel)
  }

  // Add keyboard event listener
  window.addEventListener('keydown', handleKeydown)
})

// Clean up on unmount
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  stopBeatBounce()
})
</script>

<style scoped>
.quiz-container {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.chaos-header {
  text-align: center;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 800px;
}

.title {
  font-family: 'Creepster', cursive;
  font-size: 3rem;
  color: #fff;
  text-shadow: 3px 3px 0px #000, 6px 6px 10px rgba(0,0,0,0.7);
  margin-bottom: 1rem;
}

.question-card {
  max-width: 800px;
  width: 100%;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.question-title {
  font-size: 1.5rem;
  text-align: center;
  padding: 2rem;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  transition: transform 0.1s ease-out;
}

/* Beat bounce animation - syncs with 120 BPM drum kick */
.beat-bounce {
  transform: scale(1.05) translateY(-2px);
}

.options-group {
  padding: 1rem;
}

.option-radio {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 10px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(5px);
}

.chaos-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.progress-chaos {
  width: 100%;
}

.tiny-text {
  font-size: 0.7rem;
  opacity: 0.8;
  color: #fff;
}

.completion-chaos {
  text-align: center;
  color: #fff;
}

.completion-title {
  font-family: 'Bungee', cursive;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.loading-chaos {
  text-align: center;
  color: #fff;
}

.loading-title {
  font-family: 'Fredoka One', cursive;
  font-size: 2rem;
  margin-bottom: 1rem;
}

/* Progressive Chaos Animations */

/* Level 1-2: Gentle chaos */
.gentle-wobble {
  animation: gentle-wobble 4s ease-in-out infinite;
}

.soft-pulse {
  animation: soft-pulse 3s ease-in-out infinite;
}

/* Level 3-4: Building chaos */
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

/* Level 5: Getting wild */
.spinning-text {
  animation: gentle-spin 8s linear infinite;
}

.crazy-shake {
  animation: crazy-shake 0.2s ease-in-out infinite;
}

.glitch-text {
  animation: glitch 0.5s ease-in-out infinite;
}

/* Level 6: Manic */
.manic-spin {
  animation: manic-spin 2s linear infinite;
}

.violent-shake {
  animation: violent-shake 0.1s ease-in-out infinite;
}

.strobe-text {
  animation: strobe 0.2s ease-in-out infinite;
}

/* Level 7: Chaos */
.chaos-wobble {
  animation: chaos-wobble 0.8s ease-in-out infinite;
}

.insane-pulse {
  animation: insane-pulse 0.3s ease-in-out infinite;
}

.matrix-rain {
  animation: matrix-rain 2s linear infinite;
}

/* Level 8: Deranged */
.deranged-spin {
  animation: deranged-spin 0.5s linear infinite;
}

.epileptic-flash {
  animation: epileptic-flash 0.1s ease-in-out infinite;
}

.floating-text {
  animation: floating-text 1s ease-in-out infinite;
}

/* Level 9: Absolute madness */
.absolute-madness {
  animation: absolute-madness 0.3s ease-in-out infinite;
}

.seizure-mode {
  animation: seizure-mode 0.05s ease-in-out infinite;
}

.dimension-shift {
  animation: dimension-shift 0.8s ease-in-out infinite;
}

/* Level 10: Maximum chaos */
.maximum-chaos {
  animation: maximum-chaos 0.1s ease-in-out infinite;
}

.reality-break {
  animation: reality-break 0.2s ease-in-out infinite;
}

.cosmic-horror {
  animation: cosmic-horror 0.6s ease-in-out infinite;
}

/* Question-specific animations */
.question-gentle {
  animation: question-gentle 6s ease-in-out infinite;
}

.question-wild {
  animation: question-wild 3s ease-in-out infinite;
}

.question-manic {
  animation: question-manic 1s ease-in-out infinite;
}

.question-insane {
  animation: question-insane 0.5s ease-in-out infinite;
}

.question-maximum-chaos {
  animation: question-maximum-chaos 0.1s ease-in-out infinite;
}

/* Button animations */
.spinning-button {
  animation: button-spin 4s linear infinite;
}

.wobbling-button {
  animation: wobble 3s ease-in-out infinite;
}

.pulsing-button {
  animation: pulse 2s ease-in-out infinite;
}

.spinning-progress {
  animation: progress-spin 2s linear infinite;
}

.mirror-text {
  transform: scaleX(-1);
  display: inline-block;
}

.option-chaos-1 {
  transform: rotate(2deg);
}

.option-chaos-2 {
  transform: rotate(-1deg);
}

.option-chaos-3 {
  transform: rotate(1deg);
}

.option-chaos-4 {
  transform: rotate(-2deg);
}

/* Basic keyframes */
@keyframes gentle-wobble {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(1deg) scale(1.01); }
  75% { transform: rotate(-1deg) scale(0.99); }
}

@keyframes soft-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.02); opacity: 0.9; }
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

@keyframes crazy-shake {
  0% { transform: translate(0); }
  25% { transform: translate(-5px, 5px); }
  50% { transform: translate(5px, -5px); }
  75% { transform: translate(-3px, -3px); }
  100% { transform: translate(0); }
}

@keyframes glitch {
  0%, 100% { transform: translate(0); filter: hue-rotate(0deg); }
  10% { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
  20% { transform: translate(2px, -2px); filter: hue-rotate(180deg); }
  30% { transform: translate(-2px, -2px); filter: hue-rotate(270deg); }
  40% { transform: translate(2px, 2px); filter: hue-rotate(360deg); }
}

@keyframes manic-spin {
  from { transform: rotate(0deg) scale(1); }
  to { transform: rotate(360deg) scale(1.1); }
}

@keyframes violent-shake {
  0% { transform: translate(0); }
  10% { transform: translate(-10px, 10px); }
  20% { transform: translate(10px, -10px); }
  30% { transform: translate(-8px, -8px); }
  40% { transform: translate(8px, 8px); }
  50% { transform: translate(-6px, 6px); }
  60% { transform: translate(6px, -6px); }
  70% { transform: translate(-4px, -4px); }
  80% { transform: translate(4px, 4px); }
  90% { transform: translate(-2px, 2px); }
  100% { transform: translate(0); }
}

@keyframes strobe {
  0%, 50% { opacity: 1; background-color: transparent; }
  25%, 75% { opacity: 0.5; background-color: rgba(255,255,255,0.2); }
}

@keyframes chaos-wobble {
  0% { transform: rotate(0deg) scale(1) skew(0deg); }
  25% { transform: rotate(5deg) scale(1.1) skew(2deg); }
  50% { transform: rotate(-3deg) scale(0.9) skew(-1deg); }
  75% { transform: rotate(7deg) scale(1.05) skew(3deg); }
  100% { transform: rotate(0deg) scale(1) skew(0deg); }
}

@keyframes insane-pulse {
  0%, 100% { transform: scale(1); filter: brightness(1); }
  33% { transform: scale(1.3); filter: brightness(1.5); }
  66% { transform: scale(0.7); filter: brightness(0.5); }
}

@keyframes matrix-rain {
  0% { transform: translateY(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
}

@keyframes deranged-spin {
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(1.2); }
  50% { transform: rotate(180deg) scale(0.8); }
  75% { transform: rotate(270deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
}

@keyframes epileptic-flash {
  0% { background-color: transparent; transform: scale(1); }
  50% { background-color: rgba(255,255,255,0.8); transform: scale(1.1); }
  100% { background-color: transparent; transform: scale(1); }
}

@keyframes floating-text {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-15px) rotate(2deg); }
  75% { transform: translateY(-5px) rotate(-2deg); }
}

@keyframes absolute-madness {
  0% { transform: translate(0) rotate(0deg) scale(1); }
  20% { transform: translate(-20px, 10px) rotate(180deg) scale(1.5); }
  40% { transform: translate(15px, -15px) rotate(-90deg) scale(0.5); }
  60% { transform: translate(-10px, -20px) rotate(270deg) scale(1.3); }
  80% { transform: translate(25px, 5px) rotate(45deg) scale(0.8); }
  100% { transform: translate(0) rotate(0deg) scale(1); }
}

@keyframes seizure-mode {
  0% { transform: translate(0) scale(1); filter: invert(0); }
  25% { transform: translate(-5px, 5px) scale(1.1); filter: invert(1); }
  50% { transform: translate(5px, -5px) scale(0.9); filter: invert(0); }
  75% { transform: translate(-3px, -3px) scale(1.05); filter: invert(1); }
  100% { transform: translate(0) scale(1); filter: invert(0); }
}

@keyframes dimension-shift {
  0%, 100% { transform: perspective(500px) rotateX(0deg) rotateY(0deg); }
  25% { transform: perspective(500px) rotateX(20deg) rotateY(10deg); }
  50% { transform: perspective(500px) rotateX(-15deg) rotateY(-20deg); }
  75% { transform: perspective(500px) rotateX(10deg) rotateY(15deg); }
}

@keyframes maximum-chaos {
  0% { transform: translate(0) rotate(0deg) scale(1) skew(0deg); filter: hue-rotate(0deg); }
  10% { transform: translate(-30px, 20px) rotate(45deg) scale(1.5) skew(10deg); filter: hue-rotate(36deg); }
  20% { transform: translate(25px, -25px) rotate(-30deg) scale(0.5) skew(-5deg); filter: hue-rotate(72deg); }
  30% { transform: translate(-15px, -30px) rotate(180deg) scale(1.3) skew(15deg); filter: hue-rotate(108deg); }
  40% { transform: translate(35px, 10px) rotate(-90deg) scale(0.7) skew(-10deg); filter: hue-rotate(144deg); }
  50% { transform: translate(-20px, 25px) rotate(270deg) scale(1.2) skew(8deg); filter: hue-rotate(180deg); }
  60% { transform: translate(10px, -20px) rotate(120deg) scale(0.9) skew(-12deg); filter: hue-rotate(216deg); }
  70% { transform: translate(-25px, 15px) rotate(-150deg) scale(1.4) skew(6deg); filter: hue-rotate(252deg); }
  80% { transform: translate(20px, -10px) rotate(60deg) scale(0.6) skew(-8deg); filter: hue-rotate(288deg); }
  90% { transform: translate(-10px, 30px) rotate(-45deg) scale(1.1) skew(12deg); filter: hue-rotate(324deg); }
  100% { transform: translate(0) rotate(0deg) scale(1) skew(0deg); filter: hue-rotate(360deg); }
}

@keyframes reality-break {
  0%, 100% { transform: scale(1); opacity: 1; filter: blur(0px); }
  25% { transform: scale(1.5); opacity: 0.3; filter: blur(2px); }
  50% { transform: scale(0.1); opacity: 0.8; filter: blur(5px); }
  75% { transform: scale(2); opacity: 0.1; filter: blur(1px); }
}

@keyframes cosmic-horror {
  0% { transform: scale(1) rotate(0deg); filter: contrast(1) saturate(1); }
  20% { transform: scale(1.2) rotate(72deg); filter: contrast(2) saturate(3); }
  40% { transform: scale(0.8) rotate(144deg); filter: contrast(0.5) saturate(0.5); }
  60% { transform: scale(1.3) rotate(216deg); filter: contrast(3) saturate(2); }
  80% { transform: scale(0.6) rotate(288deg); filter: contrast(0.3) saturate(4); }
  100% { transform: scale(1) rotate(360deg); filter: contrast(1) saturate(1); }
}

/* Question animations */
@keyframes question-gentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes question-wild {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(1deg); }
  75% { transform: translateY(5px) rotate(-1deg); }
}

@keyframes question-manic {
  0% { transform: translateY(0) rotate(0deg) scale(1); }
  25% { transform: translateY(-15px) rotate(2deg) scale(1.02); }
  50% { transform: translateY(5px) rotate(-1deg) scale(0.98); }
  75% { transform: translateY(-8px) rotate(3deg) scale(1.01); }
  100% { transform: translateY(0) rotate(0deg) scale(1); }
}

@keyframes question-insane {
  0% { transform: translate(0) rotate(0deg) scale(1); }
  25% { transform: translate(-10px, -20px) rotate(5deg) scale(1.1); }
  50% { transform: translate(15px, 10px) rotate(-3deg) scale(0.9); }
  75% { transform: translate(-5px, 15px) rotate(4deg) scale(1.05); }
  100% { transform: translate(0) rotate(0deg) scale(1); }
}

@keyframes question-maximum-chaos {
  0% { transform: translate(0) rotate(0deg) scale(1) skew(0deg); }
  20% { transform: translate(-30px, 20px) rotate(180deg) scale(1.3) skew(5deg); }
  40% { transform: translate(25px, -15px) rotate(-90deg) scale(0.7) skew(-3deg); }
  60% { transform: translate(-15px, 25px) rotate(270deg) scale(1.2) skew(4deg); }
  80% { transform: translate(20px, -20px) rotate(45deg) scale(0.8) skew(-2deg); }
  100% { transform: translate(0) rotate(0deg) scale(1) skew(0deg); }
}

@keyframes button-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes progress-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes chaos-bg-shift {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

@keyframes progress-pulse {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.2); }
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

.progress-bar {
  border-radius: 10px;
  overflow: hidden;
}

/* Option-specific chaos animations */
.option-normal {
  animation: none;
}

.option-wiggle {
  animation: option-wiggle 2s ease-in-out infinite;
}

.option-bounce {
  animation: option-bounce 1.5s ease-in-out infinite;
}

.option-spin {
  animation: option-spin 3s linear infinite;
}

.option-glitch {
  animation: option-glitch 0.5s ease-in-out infinite;
}

.option-strobe {
  animation: option-strobe 0.3s ease-in-out infinite;
}

.option-float {
  animation: option-float 2s ease-in-out infinite;
}

.option-shake {
  animation: option-shake 0.2s ease-in-out infinite;
}

.option-madness {
  animation: option-madness 0.4s ease-in-out infinite;
}

.option-dimension {
  animation: option-dimension 1s ease-in-out infinite;
}

.option-reality-break {
  animation: option-reality-break 0.6s ease-in-out infinite;
}

.option-cosmic {
  animation: option-cosmic 0.8s ease-in-out infinite;
}

/* Card chaos animations */
@keyframes card-wobble {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(2deg) scale(1.01); }
  75% { transform: rotate(-2deg) scale(0.99); }
}

@keyframes card-chaos {
  0% { transform: rotate(0deg) scale(1) skew(0deg); }
  25% { transform: rotate(5deg) scale(1.05) skew(1deg); }
  50% { transform: rotate(-3deg) scale(0.95) skew(-2deg); }
  75% { transform: rotate(4deg) scale(1.02) skew(1deg); }
  100% { transform: rotate(0deg) scale(1) skew(0deg); }
}

/* Option animation keyframes */
@keyframes option-wiggle {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

@keyframes option-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes option-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes option-glitch {
  0%, 100% { transform: translate(0); filter: hue-rotate(0deg); }
  20% { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
  40% { transform: translate(2px, -2px); filter: hue-rotate(180deg); }
  60% { transform: translate(-1px, -1px); filter: hue-rotate(270deg); }
  80% { transform: translate(1px, 1px); filter: hue-rotate(360deg); }
}

@keyframes option-strobe {
  0%, 50% { opacity: 1; }
  25%, 75% { opacity: 0.3; }
}

@keyframes option-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(-5px) rotate(-1deg); }
}

@keyframes option-shake {
  0% { transform: translate(0); }
  25% { transform: translate(-5px, 3px); }
  50% { transform: translate(3px, -5px); }
  75% { transform: translate(-2px, -2px); }
  100% { transform: translate(0); }
}

@keyframes option-madness {
  0% { transform: translate(0) rotate(0deg) scale(1); }
  20% { transform: translate(-10px, 5px) rotate(90deg) scale(1.1); }
  40% { transform: translate(8px, -8px) rotate(-45deg) scale(0.9); }
  60% { transform: translate(-5px, 10px) rotate(180deg) scale(1.05); }
  80% { transform: translate(12px, -3px) rotate(-90deg) scale(0.95); }
  100% { transform: translate(0) rotate(0deg) scale(1); }
}

@keyframes option-dimension {
  0%, 100% { transform: perspective(300px) rotateX(0deg) rotateY(0deg); }
  50% { transform: perspective(300px) rotateX(180deg) rotateY(180deg); }
}

@keyframes option-reality-break {
  0%, 100% { transform: scale(1); opacity: 1; filter: blur(0px); }
  33% { transform: scale(0.1); opacity: 0.3; filter: blur(3px); }
  66% { transform: scale(1.5); opacity: 0.7; filter: blur(1px); }
}

@keyframes option-cosmic {
  0% { transform: scale(1) rotate(0deg); filter: hue-rotate(0deg) saturate(1); }
  25% { transform: scale(1.2) rotate(90deg); filter: hue-rotate(90deg) saturate(2); }
  50% { transform: scale(0.8) rotate(180deg); filter: hue-rotate(180deg) saturate(3); }
  75% { transform: scale(1.1) rotate(270deg); filter: hue-rotate(270deg) saturate(1.5); }
  100% { transform: scale(1) rotate(360deg); filter: hue-rotate(360deg) saturate(1); }
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .title {
    font-size: 2rem;
  }

  .question-title {
    font-size: 1.2rem;
    padding: 1rem;
  }

  .quiz-container {
    padding: 10px;
  }
}
</style>