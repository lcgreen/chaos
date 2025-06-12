import { ref, onMounted, onUnmounted } from 'vue'

export function useAudio() {
  const audioContext = ref<AudioContext | null>(null)
  const droneOscillators = ref<OscillatorNode[]>([])
  const isAudioInitialized = ref(false)
  const currentChaosLevel = ref(1)

  // Drum beat state
  const isDrumBeatPlaying = ref(false)
  const drumBeatInterval = ref<number | null>(null)
  const drumBPM = 120 // 120 beats per minute
  const drumInterval = (60 / drumBPM) * 1000 // Convert to milliseconds

  // Chaos level drone configurations - gets progressively more unhinged
  const chaosConfigs = [
    // Level 1: Gentle chaos
    { frequencies: [55, 82.5, 110], waveTypes: ['sine', 'triangle'], lfoSpeed: 0.1, pitchBendInterval: 8000, gain: 0.06 },
    // Level 2: Building tension
    { frequencies: [65.4, 98.1, 130.8, 174.6], waveTypes: ['sine', 'triangle', 'sawtooth'], lfoSpeed: 0.15, pitchBendInterval: 7000, gain: 0.07 },
    // Level 3: Getting strange
    { frequencies: [73.4, 110.1, 146.8, 195.8, 220], waveTypes: ['triangle', 'sawtooth'], lfoSpeed: 0.2, pitchBendInterval: 6000, gain: 0.08 },
    // Level 4: Unsettling
    { frequencies: [82.4, 123.5, 164.8, 220, 277.2], waveTypes: ['sawtooth', 'square'], lfoSpeed: 0.25, pitchBendInterval: 5000, gain: 0.09 },
    // Level 5: Chaotic
    { frequencies: [92.5, 138.6, 185, 246.9, 311], waveTypes: ['sawtooth', 'square'], lfoSpeed: 0.3, pitchBendInterval: 4000, gain: 0.10 },
    // Level 6: Manic
    { frequencies: [103.8, 155.6, 207.7, 277.2, 349.2, 415.3], waveTypes: ['square'], lfoSpeed: 0.4, pitchBendInterval: 3000, gain: 0.11 },
    // Level 7: Unhinged
    { frequencies: [116.5, 174.6, 233, 311, 392, 466.2, 554.4], waveTypes: ['square'], lfoSpeed: 0.5, pitchBendInterval: 2500, gain: 0.12 },
    // Level 8: Deranged
    { frequencies: [130.8, 196.1, 261.6, 349.2, 440, 523.3, 622.3, 740], waveTypes: ['square'], lfoSpeed: 0.6, pitchBendInterval: 2000, gain: 0.13 },
    // Level 9: Insane
    { frequencies: [146.8, 220.1, 293.7, 392, 493.9, 587.3, 698.5, 830.6, 987.8], waveTypes: ['square'], lfoSpeed: 0.8, pitchBendInterval: 1500, gain: 0.14 },
    // Level 10: MAXIMUM CHAOS
    { frequencies: [164.8, 247.2, 329.6, 440, 554.4, 659.3, 784, 932.3, 1109, 1319, 1568], waveTypes: ['square'], lfoSpeed: 1.0, pitchBendInterval: 1000, gain: 0.15 }
  ]

  const initializeAudio = () => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      audioContext.value = new AudioContext()
      isAudioInitialized.value = true
      return true
    }
    return false
  }

  const createChaoticDroneMusic = (chaosLevel: number = 1) => {
    if (!audioContext.value) return

    // Stop any existing drones
    stopDroneMusic()

    const context = audioContext.value
    const config = chaosConfigs[Math.min(chaosLevel - 1, chaosConfigs.length - 1)]

    const masterGain = context.createGain()
    masterGain.gain.setValueAtTime(config.gain, context.currentTime)
    masterGain.connect(context.destination)

    config.frequencies.forEach((freq, index) => {
      const osc = context.createOscillator()
      const gain = context.createGain()
      const filter = context.createBiquadFilter()

      // Use wave types based on chaos level
      osc.type = config.waveTypes[Math.floor(Math.random() * config.waveTypes.length)] as OscillatorType

      // More detuning at higher chaos levels
      const detuneAmount = chaosLevel * 2
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * detuneAmount, context.currentTime)

      // Filter settings get more aggressive with chaos
      filter.type = chaosLevel > 5 ? 'bandpass' : 'lowpass'
      filter.frequency.setValueAtTime(400 + Math.random() * (200 * chaosLevel), context.currentTime)
      if (chaosLevel > 3) {
        filter.Q.setValueAtTime(1 + chaosLevel * 0.5, context.currentTime)
      }

      // Individual gain control - more variation at higher chaos
      gain.gain.setValueAtTime(0.2 + Math.random() * (0.3 + chaosLevel * 0.1), context.currentTime)

      // Connect the chain
      osc.connect(filter)
      filter.connect(gain)
      gain.connect(masterGain)

      // LFO modulation gets faster and more chaotic
      const lfo = context.createOscillator()
      const lfoGain = context.createGain()
      lfo.frequency.setValueAtTime(config.lfoSpeed + Math.random() * config.lfoSpeed, context.currentTime)
      lfo.type = 'sine'
      lfoGain.gain.setValueAtTime(5 + Math.random() * (10 * chaosLevel), context.currentTime)

      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)

      // Start everything
      osc.start()
      lfo.start()

      droneOscillators.value.push(osc)
    })

    // Pitch bends get more frequent and aggressive
    const createRandomPitchBend = () => {
      if (droneOscillators.value.length > 0) {
        const randomOsc = droneOscillators.value[Math.floor(Math.random() * droneOscillators.value.length)]
        const currentTime = context.currentTime
        const bendAmount = (Math.random() - 0.5) * (50 + chaosLevel * 20)

        randomOsc.frequency.setTargetAtTime(
          randomOsc.frequency.value + bendAmount,
          currentTime,
          1 + Math.random() * (4 - chaosLevel * 0.3)
        )
      }

      setTimeout(createRandomPitchBend, config.pitchBendInterval + Math.random() * config.pitchBendInterval)
    }

    setTimeout(createRandomPitchBend, 1000)
  }

  const stopDroneMusic = () => {
    droneOscillators.value.forEach(osc => {
      try {
        osc.stop()
      } catch (e) {
        // Oscillator might already be stopped
      }
    })
    droneOscillators.value = []
  }

  const playHoverSound = (chaosLevel: number = 1) => {
    if (!audioContext.value) return

    const context = audioContext.value
    const osc = context.createOscillator()
    const gain = context.createGain()
    const filter = context.createBiquadFilter()

    // More chaotic frequency range based on chaos level
    const baseFreq = 200 + Math.random() * (600 + chaosLevel * 200)
    osc.frequency.setValueAtTime(baseFreq, context.currentTime)

    // Wave type gets more aggressive with chaos
    const waveTypes: OscillatorType[] = chaosLevel > 5 ? ['square'] : ['square', 'triangle', 'sawtooth']
    osc.type = waveTypes[Math.floor(Math.random() * waveTypes.length)]

    // Filter settings
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(baseFreq * (1 + chaosLevel * 0.2), context.currentTime)
    filter.Q.setValueAtTime(5 + chaosLevel, context.currentTime)

    // Volume increases with chaos
    const volume = 0.1 + chaosLevel * 0.02
    gain.gain.setValueAtTime(0, context.currentTime)
    gain.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.15)

    // Connect everything
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(context.destination)

    // Play the sound
    osc.start(context.currentTime)
    osc.stop(context.currentTime + 0.15)
  }

  const playClickSound = (chaosLevel: number = 1) => {
    if (!audioContext.value) return

    const context = audioContext.value
    const osc = context.createOscillator()
    const gain = context.createGain()

    // Higher pitch and more aggressive with chaos
    osc.frequency.setValueAtTime(800 + Math.random() * (400 + chaosLevel * 100), context.currentTime)
    osc.type = 'square'

    const volume = 0.2 + chaosLevel * 0.03
    gain.gain.setValueAtTime(0, context.currentTime)
    gain.gain.linearRampToValueAtTime(volume, context.currentTime + 0.001)
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.05)

    osc.connect(gain)
    gain.connect(context.destination)

    osc.start(context.currentTime)
    osc.stop(context.currentTime + 0.05)
  }

  const playDrumKick = (chaosLevel: number = 1) => {
    if (!audioContext.value) return

    const context = audioContext.value

    // Create the main kick drum oscillator
    const kickOsc = context.createOscillator()
    const kickGain = context.createGain()
    const kickFilter = context.createBiquadFilter()

    // Base frequency for kick drum (around 60-80Hz)
    const baseFreq = 60 + Math.random() * (20 + chaosLevel * 5)
    kickOsc.frequency.setValueAtTime(baseFreq * 2, context.currentTime)
    kickOsc.frequency.exponentialRampToValueAtTime(baseFreq, context.currentTime + 0.1)
    kickOsc.type = 'sine'

    // Filter for that punchy kick sound
    kickFilter.type = 'lowpass'
    kickFilter.frequency.setValueAtTime(300 + chaosLevel * 50, context.currentTime)
    kickFilter.Q.setValueAtTime(1 + chaosLevel * 0.5, context.currentTime)

    // Volume envelope - quick attack, medium decay
    const volume = 1.2 + chaosLevel * 0.2
    kickGain.gain.setValueAtTime(0, context.currentTime)
    kickGain.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01)
    kickGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.2 + chaosLevel * 0.1)

    // Add some noise for texture at higher chaos levels
    if (chaosLevel > 3) {
      const noiseBuffer = context.createBuffer(1, context.sampleRate * 0.1, context.sampleRate)
      const noiseData = noiseBuffer.getChannelData(0)
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * 0.1
      }

      const noiseSource = context.createBufferSource()
      const noiseGain = context.createGain()
      const noiseFilter = context.createBiquadFilter()

      noiseSource.buffer = noiseBuffer
      noiseFilter.type = 'highpass'
      noiseFilter.frequency.setValueAtTime(200, context.currentTime)

      noiseGain.gain.setValueAtTime(0, context.currentTime)
      noiseGain.gain.linearRampToValueAtTime(0.1 * chaosLevel * 0.02, context.currentTime + 0.005)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.05)

      noiseSource.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(context.destination)

      noiseSource.start(context.currentTime)
      noiseSource.stop(context.currentTime + 0.1)
    }

    // Connect the main kick chain
    kickOsc.connect(kickFilter)
    kickFilter.connect(kickGain)
    kickGain.connect(context.destination)

    // Start and stop the kick
    kickOsc.start(context.currentTime)
    kickOsc.stop(context.currentTime + 0.3)
  }

  const startDrumBeat = (chaosLevel: number = 1) => {
    if (!audioContext.value || isDrumBeatPlaying.value) return

    isDrumBeatPlaying.value = true

    const playBeat = () => {
      if (!isDrumBeatPlaying.value) return

      playDrumKick(chaosLevel)

      // At higher chaos levels, add some variation to the timing
      const variation = chaosLevel > 5 ? Math.random() * 50 - 25 : 0
      const nextBeatTime = drumInterval + variation

      drumBeatInterval.value = window.setTimeout(playBeat, Math.max(nextBeatTime, 100))
    }

    // Start the first beat immediately
    playDrumKick(chaosLevel)
    // Schedule the next beat
    drumBeatInterval.value = window.setTimeout(playBeat, drumInterval)
  }

  const stopDrumBeat = () => {
    isDrumBeatPlaying.value = false
    if (drumBeatInterval.value) {
      clearTimeout(drumBeatInterval.value)
      drumBeatInterval.value = null
    }
  }

  const setChaosLevel = (level: number) => {
    currentChaosLevel.value = level
    if (isAudioInitialized.value) {
      createChaoticDroneMusic(level)
      // Restart drum beat with new chaos level if it was playing
      if (isDrumBeatPlaying.value) {
        stopDrumBeat()
        startDrumBeat(level)
      }
    }
  }

  const startAudioOnUserInteraction = () => {
    const startAudio = () => {
      if (initializeAudio()) {
        createChaoticDroneMusic(currentChaosLevel.value)
        startDrumBeat(currentChaosLevel.value)
        document.removeEventListener('click', startAudio)
        document.removeEventListener('keydown', startAudio)
        document.removeEventListener('touchstart', startAudio)
      }
    }

    document.addEventListener('click', startAudio, { once: true })
    document.addEventListener('keydown', startAudio, { once: true })
    document.addEventListener('touchstart', startAudio, { once: true })
  }

  onMounted(() => {
    startAudioOnUserInteraction()
  })

  onUnmounted(() => {
    stopDroneMusic()
    stopDrumBeat()
    if (audioContext.value) {
      audioContext.value.close()
    }
  })

  return {
    isAudioInitialized,
    currentChaosLevel,
    isDrumBeatPlaying,
    playHoverSound,
    playClickSound,
    playDrumKick,
    createChaoticDroneMusic,
    stopDroneMusic,
    startDrumBeat,
    stopDrumBeat,
    setChaosLevel
  }
}