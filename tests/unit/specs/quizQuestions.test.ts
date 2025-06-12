import { describe, it, expect } from 'vitest'
import { quizQuestions, allQuizQuestions, getSeededQuiz, generateSeededQuiz } from '@/data/quizQuestions'

describe('Quiz Questions', () => {
  describe('Default seeded quiz', () => {
    it('should generate a valid number of questions', () => {
      expect(quizQuestions.length).toBe(50) // Default should now generate all 50 questions
    })

    it('should have valid question structure', () => {
      quizQuestions.forEach((question) => {
        expect(question).toHaveProperty('id')
        expect(question).toHaveProperty('question')
        expect(question).toHaveProperty('options')
        expect(question).toHaveProperty('correctAnswer')
        expect(question).toHaveProperty('chaosLevel')
        expect(question).toHaveProperty('category')

        // Check question is not empty
        expect(question.question.trim()).toBeTruthy()

        // Check options array
        expect(question.options).toHaveLength(4)
        question.options.forEach(option => {
          expect(option.trim()).toBeTruthy()
        })

        // Check correct answer is valid index
        expect(question.correctAnswer).toBeGreaterThanOrEqual(0)
        expect(question.correctAnswer).toBeLessThan(4)

        // Check chaos level is valid
        expect(['mild', 'medium', 'extreme']).toContain(question.chaosLevel)

        // Check category is valid
        expect(['Science', 'History', 'Nature', 'Space', 'Human Body', 'Food', 'Sport', 'Film', 'Country', 'Animals']).toContain(question.category)
      })
    })

    it('should have diverse chaos levels', () => {
      const chaosLevels = quizQuestions.map(q => q.chaosLevel)
      const uniqueLevels = new Set(chaosLevels)
      expect(uniqueLevels.size).toBeGreaterThan(1) // Should have multiple chaos levels
    })

    it('should have unique questions', () => {
      const questions = quizQuestions.map(q => q.question)
      const uniqueQuestions = new Set(questions)
      expect(uniqueQuestions.size).toBe(questions.length)
    })
  })

  describe('Full question pool', () => {
    it('should have exactly 50 questions in total', () => {
      expect(allQuizQuestions).toHaveLength(50)
    })

    it('should have all required categories', () => {
      const categories = allQuizQuestions.map(q => q.category)
      expect(categories).toContain('Science')
      expect(categories).toContain('History')
      expect(categories).toContain('Nature')
      expect(categories).toContain('Space')
      expect(categories).toContain('Human Body')
      expect(categories).toContain('Food')
      expect(categories).toContain('Sport')
      expect(categories).toContain('Film')
      expect(categories).toContain('Country')
      expect(categories).toContain('Animals')
    })

    it('should have all chaos levels represented', () => {
      const chaosLevels = allQuizQuestions.map(q => q.chaosLevel)
      expect(chaosLevels).toContain('mild')
      expect(chaosLevels).toContain('medium')
      expect(chaosLevels).toContain('extreme')
    })

    it('should have unique IDs', () => {
      const ids = allQuizQuestions.map(q => q.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })
  })

  describe('Seeded quiz generation', () => {
    it('should generate consistent results with the same seed', () => {
      const seed = 12345
      const quiz1 = getSeededQuiz(seed, 50)
      const quiz2 = getSeededQuiz(seed, 50)

      expect(quiz1).toHaveLength(50)
      expect(quiz2).toHaveLength(50)

      // Same seed should produce identical results
      quiz1.forEach((question, index) => {
        expect(question.id).toBe(quiz2[index].id)
        expect(question.question).toBe(quiz2[index].question)
      })
    })

    it('should generate different results with different seeds', () => {
      const quiz1 = getSeededQuiz(11111, 50)
      const quiz2 = getSeededQuiz(22222, 50)

      expect(quiz1).toHaveLength(50)
      expect(quiz2).toHaveLength(50)

      // Different seeds should likely produce different first questions
      const sameFirstQuestion = quiz1[0].id === quiz2[0].id
      expect(sameFirstQuestion).toBe(false) // Very unlikely to be the same with different seeds
    })

    it('should respect the requested number of questions', () => {
      const quiz5 = getSeededQuiz(12345, 5)
      const quiz15 = getSeededQuiz(12345, 15)

      expect(quiz5).toHaveLength(5)
      expect(quiz15).toHaveLength(15)
    })

    it('should not exceed available questions', () => {
      const quiz100 = getSeededQuiz(12345, 100)
      expect(quiz100.length).toBeLessThanOrEqual(50) // Cannot exceed total available questions
    })
  })

  describe('Question generation by level', () => {
    it('should generate questions with different chaos level distributions', () => {
      const quiz1 = generateSeededQuiz(12345, 1) // 1 per level = 6 total
      const quiz2 = generateSeededQuiz(12345, 2) // 2 per level = 12 total

      expect(quiz1.length).toBeGreaterThan(0)
      expect(quiz2.length).toBeGreaterThan(quiz1.length)
    })
  })
})