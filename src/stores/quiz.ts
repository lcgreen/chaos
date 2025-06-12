import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getSeededQuiz, generateSeededQuiz, type QuizQuestion } from '@/data/quizQuestions'

export const useQuizStore = defineStore('quiz', () => {
  // State
  const questions = ref<QuizQuestion[]>([])
  const userAnswers = ref<number[]>([])
  const currentQuestionIndex = ref(0)
  const selectedAnswer = ref<number | null>(null)
  const quizCompleted = ref(false)
  const quizSeed = ref<number>(12345)
  const questionCount = ref<number>(50)
  const categories = ref<string[]>([])
  const quizStarted = ref(false)

  // Computed
  const currentQuestion = computed(() => {
    return questions.value[currentQuestionIndex.value]
  })

  const progress = computed(() => {
    if (questions.value.length === 0) return 0
    return ((currentQuestionIndex.value + 1) / questions.value.length) * 100
  })

  const score = computed(() => {
    return userAnswers.value.reduce((total, answer, index) => {
      // Only count as correct if the answer matches and is not -1 (no answer)
      if (answer !== -1 && answer === questions.value[index]?.correctAnswer) {
        return total + 1
      }
      return total
    }, 0)
  })

  const percentage = computed(() => {
    if (questions.value.length === 0) return 0
    return Math.round((score.value / questions.value.length) * 100)
  })

  const isLastQuestion = computed(() => {
    return currentQuestionIndex.value >= questions.value.length - 1
  })

  const hasQuestions = computed(() => {
    return questions.value.length > 0
  })

  // Actions
  const initializeQuiz = (seed?: number, count?: number, selectedCategories?: string[]) => {
    // Set seed
    if (seed !== undefined) {
      quizSeed.value = seed
    } else {
      quizSeed.value = Math.floor(Math.random() * 1000000)
    }

    // Set question count (validate 1-50)
    questionCount.value = Math.max(1, Math.min(count || 50, 50))

    // Set categories
    categories.value = selectedCategories || []

    // Generate questions
    questions.value = getSeededQuiz(quizSeed.value, questionCount.value, categories.value as any[])

    // Reset other state
    userAnswers.value = []
    currentQuestionIndex.value = 0
    selectedAnswer.value = null
    quizCompleted.value = false
    quizStarted.value = true

    console.log('Quiz initialized:', {
      seed: quizSeed.value,
      count: questionCount.value,
      categories: categories.value,
      questionsGenerated: questions.value.length
    })
  }

  const loadQuizFromParams = (seed: number, count: number, selectedCategories: string[] = []) => {
    quizSeed.value = seed
    questionCount.value = Math.max(1, Math.min(count, 50))
    categories.value = selectedCategories
    questions.value = getSeededQuiz(seed, questionCount.value, categories.value as any[])

    console.log('Quiz loaded from params:', {
      seed,
      count: questionCount.value,
      categories: categories.value,
      questionsGenerated: questions.value.length
    })
  }

  const selectAnswer = (answerIndex: number) => {
    selectedAnswer.value = answerIndex
  }

  const submitAnswer = () => {
    if (selectedAnswer.value !== null) {
      userAnswers.value.push(selectedAnswer.value)
      selectedAnswer.value = null
      return true
    }
    return false
  }

  const nextQuestion = () => {
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++
      return false // Not finished
    } else {
      quizCompleted.value = true
      return true // Finished
    }
  }

  const goToQuestion = (questionIndex: number) => {
    if (questionIndex >= 0 && questionIndex < questions.value.length) {
      currentQuestionIndex.value = questionIndex
      selectedAnswer.value = null
    }
  }

  const resetQuiz = () => {
    questions.value = []
    userAnswers.value = []
    currentQuestionIndex.value = 0
    selectedAnswer.value = null
    quizCompleted.value = false
    quizSeed.value = 12345
    questionCount.value = 50
    categories.value = []
    quizStarted.value = false
  }

  const getQuizParams = () => {
    return {
      seed: quizSeed.value,
      count: questionCount.value,
      categories: categories.value.length > 0 ? categories.value : undefined,
      answers: userAnswers.value
    }
  }

  const validateAnswersLength = () => {
    if (questions.value.length !== userAnswers.value.length) {
      console.warn(`Length mismatch! Questions: ${questions.value.length}, Answers: ${userAnswers.value.length}`)

      // Pad answers array if it's shorter than questions
      if (userAnswers.value.length < questions.value.length) {
        const missingAnswers = questions.value.length - userAnswers.value.length
        console.warn(`Padding ${missingAnswers} missing answers with -1 (no answer)`)
        userAnswers.value = [...userAnswers.value, ...Array(missingAnswers).fill(-1)]
      }

      // Trim answers array if it's longer than questions
      if (userAnswers.value.length > questions.value.length) {
        const extraAnswers = userAnswers.value.length - questions.value.length
        console.warn(`Trimming ${extraAnswers} extra answers`)
        userAnswers.value = userAnswers.value.slice(0, questions.value.length)
      }

      console.log('After validation - Questions:', questions.value.length, 'Answers:', userAnswers.value.length)
    }
  }

  const loadAnswersFromString = (answersString: string) => {
    try {
      const parsedAnswers = JSON.parse(answersString)
      if (Array.isArray(parsedAnswers)) {
        userAnswers.value = parsedAnswers
        validateAnswersLength()
      }
    } catch (error) {
      console.error('Failed to parse answers:', error)
      userAnswers.value = []
    }
  }

  return {
    // State
    questions,
    userAnswers,
    currentQuestionIndex,
    selectedAnswer,
    quizCompleted,
    quizSeed,
    questionCount,
    categories,
    quizStarted,

    // Computed
    currentQuestion,
    progress,
    score,
    percentage,
    isLastQuestion,
    hasQuestions,

    // Actions
    initializeQuiz,
    loadQuizFromParams,
    selectAnswer,
    submitAnswer,
    nextQuestion,
    goToQuestion,
    resetQuiz,
    getQuizParams,
    validateAnswersLength,
    loadAnswersFromString
  }
})