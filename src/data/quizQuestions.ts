export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  chaosLevel: 'mild' | 'medium' | 'extreme'
  category: 'Science' | 'History' | 'Nature' | 'Space' | 'Human Body' | 'Food' | 'Sport' | 'Film' | 'Country' | 'Animals'
}

// Seeded random number generator for consistent randomization
class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  // Linear congruential generator
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % Math.pow(2, 32)
    return this.seed / Math.pow(2, 32)
  }

  // Shuffle array using seeded random
  shuffle<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }

  // Select random items from array
  selectRandom<T>(array: T[], count: number): T[] {
    const shuffled = this.shuffle(array)
    return shuffled.slice(0, count)
  }
}

export const allQuizQuestions: QuizQuestion[] = [
  // Science Questions
  {
    id: 1,
    question: "What happens when you mix baking soda and vinegar?",
    options: [
      "It creates a fizzy volcano reaction",
      "It turns into chocolate sauce",
      "Nothing happens, it's a myth",
      "It creates a tiny black hole"
    ],
    correctAnswer: 0,
    chaosLevel: 'mild',
    category: 'Science'
  },
  {
    id: 2,
    question: "What absolutely mental thing happens to time near a black hole?",
    options: [
      "Time starts running backwards for laughs",
      "Time dilates and slows down dramatically",
      "Clocks become existentially depressed",
      "Time files a complaint with the universe management"
    ],
    correctAnswer: 1,
    chaosLevel: 'extreme',
    category: 'Science'
  },
  {
    id: 3,
    question: "What's the deal with static electricity shocking you?",
    options: [
      "Tiny invisible lightning bolts having a party",
      "Your body is secretly a Tesla coil",
      "Build-up of electrical charge that jumps to balance out",
      "The universe is testing your pain tolerance"
    ],
    correctAnswer: 2,
    chaosLevel: 'medium',
    category: 'Science'
  },
  {
    id: 4,
    question: "Why is glass technically a liquid that's pretending to be solid?",
    options: [
      "It's an amorphous solid with no crystal structure",
      "Glass molecules are just really slow dancers",
      "It's having an identity crisis",
      "Glass is method acting as a solid"
    ],
    correctAnswer: 0,
    chaosLevel: 'extreme',
    category: 'Science'
  },
  {
    id: 5,
    question: "What's the bonkers deal with quantum entanglement?",
    options: [
      "Particles are having long-distance relationships",
      "It's just really good particle WiFi",
      "Subatomic particles invented telepathy before humans",
      "Particles remain connected instantly across any distance"
    ],
    correctAnswer: 3,
    chaosLevel: 'extreme',
    category: 'Science'
  },

  // History Questions
  {
    id: 6,
    question: "What did people use before toilet paper was invented?",
    options: [
      "Leaves, moss, and whatever was handy",
      "They just held it in forever",
      "Silk handkerchiefs (fancy!)",
      "They invented time travel to get modern toilet paper"
    ],
    correctAnswer: 0,
    chaosLevel: 'mild',
    category: 'History'
  },
  {
    id: 7,
    question: "What unhinged thing did the ancient Romans use for toothpaste?",
    options: [
      "Crushed diamonds and gold",
      "Human urine (yes, really)",
      "Whatever the gladiators left behind",
      "Prayers to the tooth gods"
    ],
    correctAnswer: 1,
    chaosLevel: 'extreme',
    category: 'History'
  },
  {
    id: 8,
    question: "What bizarre thing did ancient Egyptians do with their dead pharaohs?",
    options: [
      "Turned them into fancy furniture",
      "Sent them on luxury cruises down the Nile",
      "Removed organs and wrapped them in bandages",
      "Used them as really expensive bookends"
    ],
    correctAnswer: 2,
    chaosLevel: 'medium',
    category: 'History'
  },
  {
    id: 9,
    question: "What ridiculous thing caused the Great Molasses Flood of 1919?",
    options: [
      "A giant molasses tank burst and killed 21 people",
      "Someone confused molasses with water in city planning",
      "Pancakes evolved and demanded their syrup back",
      "It was nature's way of making Boston extra sweet"
    ],
    correctAnswer: 0,
    chaosLevel: 'extreme',
    category: 'History'
  },
  {
    id: 10,
    question: "What absolutely mental military unit did Australia deploy against emus?",
    options: [
      "A crack team of professional bird whisperers",
      "The Royal Australian Emu Negotiation Squad",
      "Time-traveling kangaroos",
      "Actual soldiers with machine guns (and lost)"
    ],
    correctAnswer: 3,
    chaosLevel: 'extreme',
    category: 'History'
  },

  // Nature Questions
  {
    id: 11,
    question: "Why do cats purr?",
    options: [
      "They're happy or content",
      "They're plotting world domination",
      "Their internal engines are running",
      "They're trying to hypnotize humans"
    ],
    correctAnswer: 0,
    chaosLevel: 'mild',
    category: 'Nature'
  },
  {
    id: 12,
    question: "What absolutely mental fact about bananas will ruin your day?",
    options: [
      "They're plotting the downfall of humanity",
      "They're radioactive enough to trigger airport sensors",
      "They're actually tiny spaceships",
      "All of the above because nature is having a laugh"
    ],
    correctAnswer: 1,
    chaosLevel: 'extreme',
    category: 'Nature'
  },
  {
    id: 13,
    question: "How do chameleons change color?",
    options: [
      "They're tiny mood rings with legs",
      "Magic (obviously)",
      "Special cells called chromatophores",
      "They have built-in Instagram filters"
    ],
    correctAnswer: 2,
    chaosLevel: 'medium',
    category: 'Nature'
  },
  {
    id: 14,
    question: "What ridiculous fact about octopuses proves they're alien overlords?",
    options: [
      "They have three hearts and blue blood",
      "They're running a secret underwater government",
      "They invented ink before humans invented writing",
      "All of the above, they're clearly plotting something"
    ],
    correctAnswer: 0,
    chaosLevel: 'extreme',
    category: 'Nature'
  },
  {
    id: 15,
    question: "What mental superpower do mantis shrimp have?",
    options: [
      "They can punch through aquarium glass",
      "They invented underwater kung fu",
      "They're plotting to overthrow all other sea creatures",
      "They can see 16 types of color receptors (humans have 3)"
    ],
    correctAnswer: 3,
    chaosLevel: 'extreme',
    category: 'Nature'
  },

  // Space Questions
  {
    id: 16,
    question: "Why do we have day and night?",
    options: [
      "Earth rotates, so different parts face the Sun",
      "The Sun goes to sleep at night",
      "Space has a giant light switch",
      "Day and night are just suggestions anyway"
    ],
    correctAnswer: 0,
    chaosLevel: 'mild',
    category: 'Space'
  },
  {
    id: 17,
    question: "What mad thing happens if you fold a piece of paper 42 times?",
    options: [
      "It creates a portal to the paper dimension",
      "It becomes thicker than the distance to the Moon",
      "It becomes self-aware and starts folding you",
      "The paper files a restraining order"
    ],
    correctAnswer: 1,
    chaosLevel: 'extreme',
    category: 'Space'
  },
  {
    id: 18,
    question: "Why don't we fall off the Earth when it's spinning?",
    options: [
      "We're all wearing invisible magnetic boots",
      "The Earth spins slowly enough that we don't notice",
      "Gravity keeps us stuck to the surface",
      "We do fall off, but we fall back on"
    ],
    correctAnswer: 2,
    chaosLevel: 'medium',
    category: 'Space'
  },
  {
    id: 19,
    question: "What bonkers thing happens to your body in space?",
    options: [
      "You grow 2 inches taller instantly",
      "You develop space madness",
      "Your organs decide to rearrange themselves",
      "All of the above, space is mental"
    ],
    correctAnswer: 0,
    chaosLevel: 'extreme',
    category: 'Space'
  },
  {
    id: 20,
    question: "How many possible ways can you arrange a deck of 52 cards?",
    options: [
      "Exactly 42 (the answer to everything)",
      "Infinite, because math gave up counting",
      "However many ways the cards feel like being arranged",
      "More than there are atoms in the observable universe"
    ],
    correctAnswer: 3,
    chaosLevel: 'extreme',
    category: 'Space'
  },

  // Human Body Questions
  {
    id: 21,
    question: "Why do we need to sleep?",
    options: [
      "Our brains need time to rest and repair",
      "Because beds get lonely without us",
      "To practice for being dead",
      "So our dreams can update our software"
    ],
    correctAnswer: 0,
    chaosLevel: 'mild',
    category: 'Human Body'
  },
  {
    id: 22,
    question: "What percentage of your DNA do you share with bananas?",
    options: [
      "Only 5% (thankfully)",
      "About 60% (which explains a lot about humans)",
      "85% (you're basically a walking banana)",
      "0% (humans and bananas are sworn enemies)"
    ],
    correctAnswer: 1,
    chaosLevel: 'extreme',
    category: 'Human Body'
  },
  {
    id: 23,
    question: "Why do you get brain freeze from cold drinks?",
    options: [
      "Your brain is temporarily turning into ice cream",
      "Blood vessels in your mouth constrict then expand rapidly",
      "Brain cells are having a cold war",
      "Your skull is trying to become an ice cube"
    ],
    correctAnswer: 1,
    chaosLevel: 'medium',
    category: 'Human Body'
  },
  {
    id: 24,
    question: "What percentage of your body weight is just bacteria?",
    options: [
      "Roughly 50% (you're mostly microbes)",
      "Only 0.1% (you're pristine)",
      "About 1-3% of your total body weight",
      "100% (you ARE the bacteria)"
    ],
    correctAnswer: 2,
    chaosLevel: 'extreme',
    category: 'Human Body'
  },
  {
    id: 25,
    question: "How many times does your heart beat in an average lifetime?",
    options: [
      "Exactly enough to annoy you",
      "It depends on how much coffee you drink",
      "Your heart stops counting after the first million",
      "About 2.5 billion times"
    ],
    correctAnswer: 3,
    chaosLevel: 'extreme',
    category: 'Human Body'
  },

  // Food Questions
  {
    id: 26,
    question: "What makes onions make you cry?",
    options: [
      "They release sulfur compounds when cut",
      "They're emotionally manipulative vegetables",
      "They contain tiny invisible ninjas",
      "They're just really dramatic"
    ],
    correctAnswer: 0,
    chaosLevel: 'mild',
    category: 'Food'
  },
  {
    id: 27,
    question: "What insane thing happens when you eat spicy food?",
    options: [
      "Your taste buds temporarily gain superpowers",
      "You briefly become part dragon",
      "Your brain releases endorphins to fight the 'pain'",
      "Your mouth declares war on the rest of your body"
    ],
    correctAnswer: 2,
    chaosLevel: 'medium',
    category: 'Food'
  },
  {
    id: 28,
    question: "Why does chocolate contain a chemical also found in your brain when you're in love?",
    options: [
      "Chocolate is literally made of condensed emotions",
      "It contains phenylethylamine, which triggers similar feelings",
      "Cocoa beans are grown in fields of pure romance",
      "All of the above, chocolate is magic"
    ],
    correctAnswer: 1,
    chaosLevel: 'extreme',
    category: 'Food'
  },
  {
    id: 29,
    question: "What bizarre fact about honey will blow your mind?",
    options: [
      "Bees invented the first subscription service",
      "It's actually bee vomit (technically)",
      "It contains the secret to eternal happiness",
      "It never expires and can last thousands of years"
    ],
    correctAnswer: 3,
    chaosLevel: 'extreme',
    category: 'Food'
  },
  {
    id: 30,
    question: "Why do Brussels sprouts taste bitter to some people?",
    options: [
      "They're naturally grumpy vegetables",
      "Some people have mutant tongues",
      "Genetic differences in taste receptors",
      "Brussels sprouts choose their victims"
    ],
    correctAnswer: 2,
    chaosLevel: 'medium',
    category: 'Food'
  },

  // Sport Questions
  {
    id: 31,
    question: "How many dimples does a regulation golf ball have?",
    options: [
      "Between 300-500 dimples",
      "Exactly 42 (golf's answer to everything)",
      "However many it takes to confuse golfers",
      "They're not dimples, they're tiny craters from space debris"
    ],
    correctAnswer: 0,
    chaosLevel: 'mild',
    category: 'Sport'
  },
  {
    id: 32,
    question: "What mental thing happens in 'the zone' during sports?",
    options: [
      "They temporarily become one with the equipment",
      "Their brain switches to autopilot mode",
      "They access the sports dimension",
      "Athletes enter a flow state where time slows down"
    ],
    correctAnswer: 3,
    chaosLevel: 'medium',
    category: 'Sport'
  },
  {
    id: 33,
    question: "Why do tennis balls lose their bounce over time?",
    options: [
      "They get tired from all the hitting",
      "The pressurized gas inside slowly leaks out",
      "Tennis balls have existential crises",
      "They're protesting working conditions"
    ],
    correctAnswer: 1,
    chaosLevel: 'medium',
    category: 'Sport'
  },
  {
    id: 34,
    question: "What ridiculous origin does the marathon distance have?",
    options: [
      "Someone just picked a random really long distance",
      "It's based on a Greek messenger's route, but changed for London Olympics",
      "It was determined by ancient torture methods",
      "Marathon runners are secretly masochists who chose the distance"
    ],
    correctAnswer: 1,
    chaosLevel: 'extreme',
    category: 'Sport'
  },
  {
    id: 35,
    question: "Why do athletes bite their medals?",
    options: [
      "Medals taste surprisingly delicious",
      "It's a secret athlete code",
      "Historical tradition from testing gold authenticity",
      "They're checking if the medal is actually chocolate"
    ],
    correctAnswer: 2,
    chaosLevel: 'extreme',
    category: 'Sport'
  },

  // Film Questions
  {
    id: 36,
    question: "What creates the sound of rain in movies?",
    options: [
      "Often bacon frying or rice on a drum",
      "Actual rain (they wait for storms)",
      "Tiny sound gnomes with watering cans",
      "Movie magic (literally)"
    ],
    correctAnswer: 0,
    chaosLevel: 'mild',
    category: 'Film'
  },
  {
    id: 37,
    question: "Why do movies use Wilhelm Scream?",
    options: [
      "Wilhelm was the greatest screamer in history",
      "It's a famous stock scream used as an inside joke",
      "All movie sound comes from one very dramatic man",
      "It's required by law in action movies"
    ],
    correctAnswer: 1,
    chaosLevel: 'medium',
    category: 'Film'
  },
  {
    id: 38,
    question: "What crazy technique makes movie explosions look so big?",
    options: [
      "They actually blow up entire buildings for every movie",
      "CGI has replaced all real explosions",
      "Movie directors have access to military-grade explosives",
      "They use forced perspective and multiple smaller explosions"
    ],
    correctAnswer: 3,
    chaosLevel: 'extreme',
    category: 'Film'
  },
  {
    id: 39,
    question: "Why don't movie characters ever go to the bathroom?",
    options: [
      "Movie people don't have bodily functions",
      "Bathroom scenes are banned by the Cinema Council",
      "It breaks narrative flow unless plot-relevant",
      "All movie characters are actually androids"
    ],
    correctAnswer: 2,
    chaosLevel: 'extreme',
    category: 'Film'
  },
  {
    id: 40,
    question: "What makes movie theater popcorn smell so good?",
    options: [
      "They pump artificial scents into the theater",
      "Flavacol seasoning salt with artificial butter flavoring",
      "Movie popcorn is actually made from happiness",
      "It's psychological manipulation to make you hungry"
    ],
    correctAnswer: 1,
    chaosLevel: 'medium',
    category: 'Film'
  },

  // Country Questions
  {
    id: 41,
    question: "Which country has more pyramids than Egypt?",
    options: [
      "Sudan (over 250 pyramids)",
      "Mexico (those Mayans were busy)",
      "China (they build everything)",
      "Australia (pyramid-shaped rocks count, right?)"
    ],
    correctAnswer: 0,
    chaosLevel: 'mild',
    category: 'Country'
  },
  {
    id: 42,
    question: "What bizarre law exists in Switzerland?",
    options: [
      "Yodeling is mandatory on Sundays",
      "You can't own just one guinea pig (they get lonely)",
      "All chocolate must be blessed by a Swiss monk",
      "Everyone must own at least one cuckoo clock"
    ],
    correctAnswer: 1,
    chaosLevel: 'extreme',
    category: 'Country'
  },
  {
    id: 43,
    question: "Which country is wider than the moon?",
    options: [
      "Russia (obviously, it's huge)",
      "Canada (those moose need space)",
      "The moon is actually tiny, most countries are wider",
      "Australia (the moon is only 3,474 km wide)"
    ],
    correctAnswer: 3,
    chaosLevel: 'extreme',
    category: 'Country'
  },
  {
    id: 44,
    question: "What country has a national bird that can't fly?",
    options: [
      "Antarctica (penguins, if it were a country)",
      "Madagascar (cartoon birds don't count)",
      "New Zealand (the kiwi)",
      "All birds can fly, this is a trick question"
    ],
    correctAnswer: 2,
    chaosLevel: 'medium',
    category: 'Country'
  },
  {
    id: 45,
    question: "Which country's national animal is a unicorn?",
    options: [
      "England (they're just being fancy)",
      "Scotland (they chose a mythical creature)",
      "Ireland (leprechauns need transportation)",
      "Unicorns are real, they're just very good at hiding"
    ],
    correctAnswer: 1,
    chaosLevel: 'extreme',
    category: 'Country'
  },

  // Animals Questions
  {
    id: 46,
    question: "How do cats purr?",
    options: [
      "Vibrating muscles in their throat",
      "They have tiny internal motors",
      "Magic (obviously)",
      "They're secretly small motorcycles"
    ],
    correctAnswer: 0,
    chaosLevel: 'mild',
    category: 'Animals'
  },
  {
    id: 47,
    question: "What superpower do dolphins have?",
    options: [
      "They can communicate with aliens",
      "Echolocation - they see with sound",
      "Time travel (only forwards though)",
      "They're plotting to take over the oceans"
    ],
    correctAnswer: 1,
    chaosLevel: 'medium',
    category: 'Animals'
  },
  {
    id: 48,
    question: "Why do flamingos stand on one leg?",
    options: [
      "They're practicing yoga",
      "The other leg is on vacation",
      "To conserve body heat",
      "They're showing off their balance skills"
    ],
    correctAnswer: 2,
    chaosLevel: 'medium',
    category: 'Animals'
  },
  {
    id: 49,
    question: "What ridiculous fact about elephants proves they're emotional geniuses?",
    options: [
      "They mourn their dead and have funeral-like rituals",
      "They remember every human who was ever mean to them",
      "They can sense earthquakes days before they happen",
      "All of the above, elephants are basically wise giants"
    ],
    correctAnswer: 0,
    chaosLevel: 'extreme',
    category: 'Animals'
  },
  {
    id: 50,
    question: "What mental ability do crows have that's scary smart?",
    options: [
      "They've figured out how to use public transportation",
      "They're building a secret crow society",
      "They can predict the future (but choose not to tell us)",
      "They can recognize human faces and hold grudges"
    ],
    correctAnswer: 3,
    chaosLevel: 'extreme',
    category: 'Animals'
  }
]

// Generate a quiz with a specific seed
export function generateSeededQuiz(
  seed: number,
  totalQuestions: number = 50,
  categories: QuizQuestion['category'][] = []
): QuizQuestion[] {
  const rng = new SeededRandom(seed)

  // Filter questions by categories if specified
  const availableQuestions = categories.length > 0
    ? allQuizQuestions.filter(q => categories.includes(q.category))
    : allQuizQuestions

  // If requesting all questions or more than available, just shuffle all available questions
  if (totalQuestions >= availableQuestions.length) {
    return rng.shuffle([...availableQuestions])
  }

  // For smaller subsets, try to maintain some balance across chaos levels
  const questionsPerLevel = Math.ceil(totalQuestions / 3)

  // Group available questions by chaos level
  const mildQuestions = availableQuestions.filter(q => q.chaosLevel === 'mild')
  const mediumQuestions = availableQuestions.filter(q => q.chaosLevel === 'medium')
  const extremeQuestions = availableQuestions.filter(q => q.chaosLevel === 'extreme')

  // Select questions for each level using seeded randomization
  const selectedQuestions: QuizQuestion[] = [
    ...rng.selectRandom(mildQuestions, Math.min(questionsPerLevel, mildQuestions.length)),
    ...rng.selectRandom(mediumQuestions, Math.min(questionsPerLevel, mediumQuestions.length)),
    ...rng.selectRandom(extremeQuestions, Math.min(questionsPerLevel, extremeQuestions.length))
  ]

  // If we need more questions, randomly select from remaining available questions
  if (selectedQuestions.length < totalQuestions) {
    const remaining = availableQuestions.filter(q => !selectedQuestions.includes(q))
    const additionalNeeded = totalQuestions - selectedQuestions.length
    selectedQuestions.push(...rng.selectRandom(remaining, Math.min(additionalNeeded, remaining.length)))
  }

  // Shuffle the final selection and trim to exact count
  const shuffled = rng.shuffle(selectedQuestions)
  return shuffled.slice(0, totalQuestions)
}

// Default quiz (maintains backward compatibility) - now uses all 50 questions
export const quizQuestions: QuizQuestion[] = generateSeededQuiz(12345, 50)

// Helper functions
export const getQuestionsByCategory = (category: QuizQuestion['category']): QuizQuestion[] => {
  return allQuizQuestions.filter(q => q.category === category)
}

export const getQuestionsByChaosLevel = (level: QuizQuestion['chaosLevel']): QuizQuestion[] => {
  return allQuizQuestions.filter(q => q.chaosLevel === level)
}

// Get seeded quiz by seed value
export const getSeededQuiz = (
  seed: number,
  totalQuestions: number = 50,
  categories: QuizQuestion['category'][] = []
): QuizQuestion[] => {
  return generateSeededQuiz(seed, totalQuestions, categories)
}