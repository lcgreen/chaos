<template>
  <v-container class="results-container" fluid>
    <div class="chaos-header">
      <h1 class="title spinning-text">🎊 QUIZ RESULTS 🎊</h1>
      <div class="score-chaos">
        <h2 class="score wobbling-text" :style="getScoreStyle()">
          Score: {{ score }} / {{ questions.length }}
        </h2>
        <p class="percentage pulsing-text" :style="getPercentageStyle()">
          {{ percentage }}% {{ getScoreEmoji() }}
        </p>
      </div>
    </div>

    <div class="questions-review">
      <v-card
        v-for="(question, index) in questions"
        :key="question.id"
        class="question-review-card"
        :style="getCardStyle(index)"
        :class="getCardClass(index)"
      >
        <v-card-title class="question-number" :class="getTitleClass()">
          <span>
            Question {{ index + 1 }}
          </span>
        </v-card-title>

        <v-card-text>
          <div class="question-text" :class="getQuestionClass()" :style="getQuestionStyle()">
            <span>
              {{ question.question }}
            </span>
          </div>

          <div class="answers-section">
            <div
              v-for="(option, optionIndex) in question.options"
              :key="optionIndex"
              class="answer-option"
              :class="getAnswerClass(question, optionIndex, index)"
              :style="getAnswerStyle(optionIndex)"
            >
              <span>
                {{ option }}
              </span>
              <div class="answer-icons">
                <span v-if="optionIndex === question.correctAnswer">✅</span>
                <span v-if="userAnswers[index] === optionIndex && optionIndex !== question.correctAnswer">❌</span>
                <span v-if="userAnswers[index] === optionIndex">👈</span>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <div class="chaos-footer">
      <v-btn
        @click="restartQuiz"
        @mouseenter="playHoverSound"
        :color="getRandomColor()"
        size="large"
        class="restart-button"
        :class="getButtonClass()"
      >
        🔄 Take Quiz Again 🔄
      </v-btn>

      <div class="chaos-stats" :style="getStatsStyle()">
        <p class="tiny-text mirror-text">Chaos Level: {{ getChaosLevel() }}</p>
        <p class="tiny-text">Time traveled through dimensions: ∞</p>
        <p class="tiny-text">Brains twisted: {{ Math.floor(Math.random() * 1000) + 1 }}</p>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getSeededQuiz, type QuizQuestion } from '@/data/quizQuestions'
import { useAudio } from '@/composables/useAudio'

const router = useRouter()
const route = useRoute()

// Audio composable
const { playHoverSound, playClickSound } = useAudio()

// Props
interface Props {
  answers?: string
}
const props = defineProps<Props>()

// State
const questions = ref<QuizQuestion[]>([])
const userAnswers = ref<number[]>([])

// Computed
const score = computed(() => {
  return userAnswers.value.reduce((total, answer, index) => {
    return total + (answer === questions.value[index].correctAnswer ? 1 : 0)
  }, 0)
})

const percentage = computed(() => {
  return Math.round((score.value / questions.value.length) * 100)
})

// Methods
const getRandomColor = () => {
  const colors = ['primary', 'secondary', 'success', 'warning', 'error', 'info']
  return colors[Math.floor(Math.random() * colors.length)]
}

const getRandomFont = () => {
  const fonts = ['Creepster', 'Bungee', 'Fredoka One', 'Monoton', 'Orbitron', 'Press Start 2P', 'Kalam']
  return fonts[Math.floor(Math.random() * fonts.length)]
}

const getScoreEmoji = () => {
  const p = percentage.value
  if (p >= 90) return '🏆 CHAOS MASTER! 🏆'
  if (p >= 70) return '🎯 CHAOS NAVIGATOR! 🎯'
  if (p >= 50) return '🌟 CHAOS APPRENTICE! 🌟'
  return '🌪️ EMBRACE THE CHAOS! 🌪️'
}

const getChaosLevel = () => {
  const p = percentage.value
  if (p >= 90) return 'MAXIMUM CHAOS'
  if (p >= 70) return 'HIGH CHAOS'
  if (p >= 50) return 'MEDIUM CHAOS'
  return 'PURE CHAOS'
}

const getCardStyle = (index: number) => ({
  backgroundColor: `hsl(${(index * 36) % 360}, 60%, 15%)`,
  transform: `rotate(${(Math.random() - 0.5) * 6}deg)`,
  border: `3px solid hsl(${(index * 72) % 360}, 100%, 50%)`
})

const getCardClass = (index: number) => {
  const classes = ['wobbling-card', 'pulsing-card', 'shaking-card']
  return classes[index % classes.length]
}

const getTitleClass = () => {
  const classes = ['spinning-text', 'wobbling-text', 'pulsing-text']
  return classes[Math.floor(Math.random() * classes.length)]
}

const getQuestionClass = () => {
  const classes = ['shaking-text', 'wobbling-text', 'pulsing-text']
  return classes[Math.floor(Math.random() * classes.length)]
}

const getQuestionStyle = () => ({
  fontFamily: getRandomFont(),
  fontSize: '16px', // Fixed size for readability
  color: '#ffffff' // Fixed white color for readability
})

const getAnswerClass = (question: QuizQuestion, optionIndex: number, questionIndex: number) => {
  const baseClass = 'answer-option'
  const chaosClass = ['chaos-answer-1', 'chaos-answer-2', 'chaos-answer-3'][optionIndex % 3]

  if (optionIndex === question.correctAnswer) {
    return `${baseClass} ${chaosClass} correct-answer`
  } else if (userAnswers.value[questionIndex] === optionIndex) {
    return `${baseClass} ${chaosClass} user-wrong-answer`
  }
  return `${baseClass} ${chaosClass}`
}

const getAnswerStyle = (index: number) => ({
  fontFamily: getRandomFont(),
  fontSize: '14px', // Fixed size for readability
  color: '#ffffff' // Fixed white color for readability
})

const getButtonClass = () => {
  const classes = ['spinning-button', 'wobbling-button', 'pulsing-button']
  return classes[Math.floor(Math.random() * classes.length)]
}

const getScoreStyle = () => ({
  fontFamily: getRandomFont(),
  color: '#ffeb3b' // Fixed gold color for score
})

const getPercentageStyle = () => ({
  fontFamily: getRandomFont(),
  color: '#4caf50' // Fixed green color for percentage
})

const getStatsStyle = () => ({
  transform: `rotate(${(Math.random() - 0.5) * 10}deg)`
})

const shouldMirror = () => Math.random() > 0.6

const restartQuiz = () => {
  playClickSound()
  router.push('/')
}

onMounted(() => {
  // Parse answers from query params
  const answersParam = route.query.answers || props.answers
  if (answersParam) {
    try {
      userAnswers.value = JSON.parse(answersParam as string)
    } catch (e) {
      console.error('Failed to parse answers:', e)
      userAnswers.value = []
    }
  }

  // Regenerate the same quiz that was used in QuizView
  const seed = route.query.seed ? parseInt(route.query.seed as string) : 12345
  const count = route.query.count ? parseInt(route.query.count as string) : 50
  const categoriesParam = route.query.categories
  const categories = categoriesParam && typeof categoriesParam === 'string'
    ? categoriesParam.split(',').filter(Boolean)
    : []

  questions.value = getSeededQuiz(seed, count, categories as any[])

  console.log('Results: Regenerated quiz with seed:', seed, 'count:', count, 'categories:', categories)
  console.log('Questions loaded:', questions.value.length)
  console.log('User answers:', userAnswers.value.length)
})
</script>

<style scoped>
.results-container {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  padding: 20px;
}

.chaos-header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-family: 'Bungee', cursive;
  font-size: 3rem;
  color: #fff;
  text-shadow: 3px 3px 0px #000, 6px 6px 10px rgba(0,0,0,0.7);
  margin-bottom: 2rem;
}

.score-chaos {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  border: 3px solid #fff;
  margin: 0 auto;
  max-width: 400px;
}

.score {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.percentage {
  font-size: 1.5rem;
  margin: 0;
}

.questions-review {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.question-review-card {
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  margin-bottom: 1rem;
}

.question-number {
  font-size: 1.3rem;
  color: #fff;
  text-align: center;
  padding: 1rem;
}

.question-text {
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
}

.answers-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.answer-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 10px;
  background: rgba(255,255,255,0.05);
  border: 2px solid transparent;
}

.correct-answer {
  background: rgba(76, 175, 80, 0.3);
  border-color: #4caf50;
}

.user-wrong-answer {
  background: rgba(244, 67, 54, 0.3);
  border-color: #f44336;
}

.answer-icons {
  display: flex;
  gap: 0.5rem;
  font-size: 1.2rem;
}

.chaos-footer {
  text-align: center;
  margin-top: 3rem;
}

.restart-button {
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  margin-bottom: 2rem;
}

.chaos-stats {
  background: rgba(0,0,0,0.3);
  padding: 1rem;
  border-radius: 15px;
  margin: 0 auto;
  max-width: 400px;
}

.tiny-text {
  font-size: 0.8rem;
  color: #fff;
  margin: 0.5rem 0;
}

/* Chaos Animations */
.spinning-text {
  animation: gentle-spin 8s linear infinite;
}

.wobbling-text {
  animation: wobble 2s ease-in-out infinite;
}

.pulsing-text {
  animation: pulse 1.5s ease-in-out infinite;
}

.shaking-text {
  animation: shake 0.5s ease-in-out infinite;
}

.wobbling-card {
  animation: wobble 4s ease-in-out infinite;
}

.pulsing-card {
  animation: pulse 3s ease-in-out infinite;
}

.shaking-card {
  animation: shake 2s ease-in-out infinite;
}

.spinning-button {
  animation: button-spin 4s linear infinite;
}

.wobbling-button {
  animation: wobble 3s ease-in-out infinite;
}

.pulsing-button {
  animation: pulse 2s ease-in-out infinite;
}

.mirror-text {
  transform: scaleX(-1);
  display: inline-block;
}

.chaos-answer-1 {
  transform: rotate(1deg);
}

.chaos-answer-2 {
  transform: rotate(-0.5deg);
}

.chaos-answer-3 {
  transform: rotate(0.5deg);
}

@keyframes gentle-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes wobble {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(2deg); }
  75% { transform: rotate(-2deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-1px); }
  75% { transform: translateX(1px); }
}

@keyframes button-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .title {
    font-size: 2rem;
  }

  .score {
    font-size: 1.5rem;
  }

  .percentage {
    font-size: 1.2rem;
  }

  .question-text {
    font-size: 1rem;
  }

  .results-container {
    padding: 10px;
  }
}
</style>