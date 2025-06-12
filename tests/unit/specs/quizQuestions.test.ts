import { describe, it, expect } from 'vitest'
import { quizQuestions } from '@/data/quizQuestions'

describe('Quiz Questions', () => {
  it('should have exactly 10 questions', () => {
    expect(quizQuestions).toHaveLength(10)
  })

  it('should have valid question structure', () => {
    quizQuestions.forEach((question, index) => {
      expect(question).toHaveProperty('id')
      expect(question).toHaveProperty('question')
      expect(question).toHaveProperty('options')
      expect(question).toHaveProperty('correctAnswer')
      expect(question).toHaveProperty('chaosLevel')

      // Check ID matches index + 1
      expect(question.id).toBe(index + 1)

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
    })
  })

  it('should have diverse chaos levels', () => {
    const chaosLevels = quizQuestions.map(q => q.chaosLevel)
    expect(chaosLevels).toContain('mild')
    expect(chaosLevels).toContain('medium')
    expect(chaosLevels).toContain('extreme')
  })

  it('should have unique questions', () => {
    const questions = quizQuestions.map(q => q.question)
    const uniqueQuestions = new Set(questions)
    expect(uniqueQuestions.size).toBe(questions.length)
  })
})