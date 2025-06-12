import { computed } from 'vue'

export function useChaos(questionNumber: number) {
  const chaosLevel = computed(() => Math.min(questionNumber, 10))

  // Color schemes that get progressively more chaotic
  const colorSchemes = [
    // Level 1: Gentle blues and purples
    { primary: '#3f51b5', secondary: '#9c27b0', accent: '#e91e63', bg: 'linear-gradient(45deg, #1a237e, #4a148c)' },
    // Level 2: Warmer purples and magentas
    { primary: '#673ab7', secondary: '#e91e63', accent: '#ff5722', bg: 'linear-gradient(45deg, #4a148c, #880e4f)' },
    // Level 3: Reds and oranges
    { primary: '#f44336', secondary: '#ff9800', accent: '#ffeb3b', bg: 'linear-gradient(45deg, #bf360c, #e65100)' },
    // Level 4: Fiery oranges and yellows
    { primary: '#ff5722', secondary: '#ffeb3b', accent: '#4caf50', bg: 'linear-gradient(45deg, #e65100, #f57f17)' },
    // Level 5: Electric greens and cyans
    { primary: '#4caf50', secondary: '#00bcd4', accent: '#2196f3', bg: 'linear-gradient(45deg, #1b5e20, #006064)' },
    // Level 6: Neon cyans and blues
    { primary: '#00bcd4', secondary: '#2196f3', accent: '#9c27b0', bg: 'linear-gradient(45deg, #006064, #0d47a1)' },
    // Level 7: Electric blues and purples
    { primary: '#2196f3', secondary: '#9c27b0', accent: '#e91e63', bg: 'linear-gradient(45deg, #0d47a1, #4a148c)' },
    // Level 8: Hot pinks and magentas
    { primary: '#e91e63', secondary: '#9c27b0', accent: '#f44336', bg: 'linear-gradient(45deg, #880e4f, #4a148c)' },
    // Level 9: Strobing magentas and reds
    { primary: '#9c27b0', secondary: '#f44336', accent: '#ff5722', bg: 'linear-gradient(45deg, #4a148c, #bf360c)' },
    // Level 10: MAXIMUM CHAOS - all colors
    { primary: '#ff0040', secondary: '#ff8000', accent: '#40ff00', bg: 'conic-gradient(from 0deg, #ff0040, #ff8000, #ffff00, #40ff00, #00ff80, #0080ff, #4000ff, #8000ff, #ff0080, #ff0040)' }
  ]

  const currentColors = computed(() => colorSchemes[Math.min(chaosLevel.value - 1, colorSchemes.length - 1)])

  // Animation intensities that escalate
  const animationIntensity = computed(() => ({
    rotation: chaosLevel.value * 2,
    scale: 1 + chaosLevel.value * 0.1,
    speed: 0.5 + chaosLevel.value * 0.3,
    shake: chaosLevel.value * 0.5,
    wobble: chaosLevel.value * 1.5,
    pulse: chaosLevel.value * 0.2
  }))

  // Background effects
  const backgroundStyle = computed(() => ({
    background: currentColors.value.bg,
    animation: chaosLevel.value > 5 ? `chaos-bg-shift ${3 - chaosLevel.value * 0.2}s infinite alternate` : 'none'
  }))

  // Text effects - gets progressively more unhinged
  const getTextChaosClass = () => {
    const effectsByLevel = [
      ['gentle-wobble'], // Level 1
      ['gentle-wobble', 'soft-pulse'], // Level 2
      ['wobbling-text', 'shaking-text'], // Level 3
      ['shaking-text', 'pulsing-text', 'bounce-text'], // Level 4
      ['spinning-text', 'crazy-shake', 'glitch-text'], // Level 5
      ['manic-spin', 'violent-shake', 'strobe-text'], // Level 6
      ['chaos-wobble', 'insane-pulse', 'matrix-rain'], // Level 7
      ['deranged-spin', 'epileptic-flash', 'floating-text'], // Level 8
      ['absolute-madness', 'seizure-mode', 'dimension-shift'], // Level 9
      ['maximum-chaos', 'reality-break', 'cosmic-horror'] // Level 10
    ]

    const levelEffects = effectsByLevel[Math.min(chaosLevel.value - 1, effectsByLevel.length - 1)]
    return levelEffects[Math.floor(Math.random() * levelEffects.length)]
  }

  const getTextChaosStyle = () => {
    const level = chaosLevel.value
    return {
      textShadow: level > 5 ?
        `0 0 ${level * 3}px ${currentColors.value.accent}, 0 0 ${level * 6}px ${currentColors.value.primary}` :
        `0 0 ${level * 2}px ${currentColors.value.accent}`,
      transform: level > 7 ?
        `rotate(${(Math.random() - 0.5) * level * 5}deg) scale(${1 + Math.random() * 0.3})` :
        `rotate(${(Math.random() - 0.5) * level * 2}deg)`,
      fontSize: level > 8 ? `${1 + Math.random() * 0.5}em` : level > 7 ? '1.1em' : '1em',
      filter: level > 6 ? `hue-rotate(${Math.random() * 360}deg)` : 'none',
      position: level > 8 ? 'relative' : 'static',
      left: level > 8 ? `${(Math.random() - 0.5) * 20}px` : '0',
      top: level > 8 ? `${(Math.random() - 0.5) * 10}px` : '0'
    }
  }

  // Question-specific chaos
  const getQuestionChaosClass = () => {
    const level = chaosLevel.value
    if (level >= 9) return 'question-maximum-chaos'
    if (level >= 7) return 'question-insane'
    if (level >= 5) return 'question-manic'
    if (level >= 3) return 'question-wild'
    return 'question-gentle'
  }

  const getQuestionChaosStyle = () => {
    const level = chaosLevel.value
    return {
      position: level > 6 ? 'relative' : 'static',
      animation: level > 8 ? 'question-chaos 0.1s infinite' :
                level > 6 ? 'question-float 2s ease-in-out infinite' :
                level > 4 ? 'question-sway 3s ease-in-out infinite' : 'none',
      transform: level > 7 ? `scale(${0.8 + Math.random() * 0.6})` : 'none',
      filter: level > 8 ? 'blur(1px) contrast(150%)' : level > 6 ? 'contrast(120%)' : 'none'
    }
  }

  // Button effects
  const getButtonChaosClass = () => {
    const effects = ['', 'wobbling-button', 'shaking-button', 'pulsing-button', 'spinning-button']
    const intensity = Math.min(Math.floor(chaosLevel.value / 2), effects.length - 1)
    return effects[intensity]
  }

  const getButtonChaosStyle = () => ({
    borderWidth: `${chaosLevel.value}px`,
    borderColor: currentColors.value.accent,
    boxShadow: `0 0 ${chaosLevel.value * 3}px ${currentColors.value.primary}`,
    transform: `scale(${1 + chaosLevel.value * 0.05}) rotate(${(Math.random() - 0.5) * chaosLevel.value}deg)`
  })

    // Card effects - escalating madness
  const getCardChaosStyle = () => {
    const level = chaosLevel.value
    return {
      borderWidth: `${Math.max(1, level * 2)}px`,
      borderColor: currentColors.value.secondary,
      borderStyle: level > 7 ? 'dashed' : level > 5 ? 'dotted' : 'solid',
      boxShadow: level > 8 ?
        `0 0 ${level * 8}px ${currentColors.value.primary}, inset 0 0 ${level * 4}px ${currentColors.value.accent}` :
        `0 0 ${level * 5}px ${currentColors.value.primary}`,
      transform: level > 8 ?
        `rotate(${(Math.random() - 0.5) * level * 8}deg) scale(${0.8 + Math.random() * 0.6}) skew(${(Math.random() - 0.5) * 20}deg)` :
        `rotate(${(Math.random() - 0.5) * level * 3}deg) scale(${1 + level * 0.02})`,
      background: level > 8 ?
        `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, ${currentColors.value.primary}44, ${currentColors.value.secondary}22, ${currentColors.value.accent}11)` :
        level > 5 ?
        `linear-gradient(${Math.random() * 360}deg, ${currentColors.value.primary}22, ${currentColors.value.secondary}22)` :
        `rgba(255,255,255,0.1)`,
      filter: level > 9 ? 'saturate(200%) contrast(150%) hue-rotate(45deg)' :
              level > 7 ? 'saturate(150%) contrast(120%)' : 'none',
      animation: level > 8 ? 'card-chaos 0.2s infinite' :
                level > 6 ? 'card-wobble 1s ease-in-out infinite' : 'none'
    }
  }

  // Option chaos effects
  const getOptionChaosClass = (index: number) => {
    const level = chaosLevel.value
    const baseEffects = ['option-normal', 'option-wiggle', 'option-bounce', 'option-spin']
    const chaosEffects = ['option-glitch', 'option-strobe', 'option-float', 'option-shake']
    const insaneEffects = ['option-madness', 'option-dimension', 'option-reality-break', 'option-cosmic']

    if (level >= 9) return insaneEffects[index % insaneEffects.length]
    if (level >= 6) return chaosEffects[index % chaosEffects.length]
    if (level >= 3) return baseEffects[index % baseEffects.length]
    return 'option-normal'
  }

  const getOptionChaosStyle = (index: number) => {
    const level = chaosLevel.value
    const delay = index * 0.1

    return {
      animationDelay: `${delay}s`,
      transform: level > 8 ?
        `translate(${(Math.random() - 0.5) * 30}px, ${(Math.random() - 0.5) * 15}px) rotate(${(Math.random() - 0.5) * 15}deg)` :
        level > 5 ?
        `rotate(${(Math.random() - 0.5) * level}deg)` : 'none',
      borderColor: level > 6 ? currentColors.value.accent : currentColors.value.secondary,
      borderWidth: level > 7 ? `${1 + Math.random() * 3}px` : '1px',
      borderStyle: level > 8 ? (Math.random() > 0.5 ? 'dashed' : 'dotted') : 'solid',
      backgroundColor: level > 8 ?
        `${currentColors.value.primary}${Math.floor(Math.random() * 99).toString().padStart(2, '0')}` :
        `${currentColors.value.primary}22`,
      filter: level > 9 ? `hue-rotate(${index * 72}deg) saturate(200%)` : 'none',
      position: level > 7 ? 'relative' : 'static',
      zIndex: level > 8 ? Math.floor(Math.random() * 10) : 'auto'
    }
  }

  // Floating shapes
  const getFloatingShapeCount = () => Math.min(chaosLevel.value * 2, 20)

  const getFloatingShapeStyle = (index: number) => ({
    width: `${20 + chaosLevel.value * 10}px`,
    height: `${20 + chaosLevel.value * 10}px`,
    backgroundColor: Math.random() > 0.5 ? currentColors.value.primary : currentColors.value.secondary,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${5 - chaosLevel.value * 0.3}s`,
    animationDelay: `${index * 0.2}s`,
    opacity: 0.3 + chaosLevel.value * 0.1,
    borderRadius: chaosLevel.value > 5 ? '50%' : '0%'
  })

  // Progress bar chaos
  const getProgressChaosStyle = () => ({
    background: chaosLevel.value > 5 ?
      `linear-gradient(90deg, ${currentColors.value.primary}, ${currentColors.value.secondary}, ${currentColors.value.accent})` :
      currentColors.value.primary,
    height: `${10 + chaosLevel.value * 2}px`,
    animation: chaosLevel.value > 7 ? 'progress-pulse 0.5s infinite alternate' : 'none'
  })

  return {
    chaosLevel,
    currentColors,
    animationIntensity,
    backgroundStyle,
    getTextChaosClass,
    getTextChaosStyle,
    getQuestionChaosClass,
    getQuestionChaosStyle,
    getButtonChaosClass,
    getButtonChaosStyle,
    getCardChaosStyle,
    getOptionChaosClass,
    getOptionChaosStyle,
    getFloatingShapeCount,
    getFloatingShapeStyle,
    getProgressChaosStyle
  }
}