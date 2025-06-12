export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  chaosLevel: 'mild' | 'medium' | 'extreme'
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What absolutely mental fact about bananas will ruin your day?",
    options: [
      "They're technically berries but strawberries aren't",
      "They're all clones and genetically identical",
      "They're radioactive enough to trigger airport sensors",
      "All of the above because nature is having a laugh"
    ],
    correctAnswer: 3,
    chaosLevel: 'extreme'
  },
  {
    id: 2,
    question: "How long would it take to walk to the Moon at average walking speed?",
    options: [
      "About 9 years of non-stop walking",
      "Roughly 3 years if you're quite nippy",
      "Nearly 10 years of constant trudging",
      "Just pop on the M25, you'll get there eventually"
    ],
    correctAnswer: 0,
    chaosLevel: 'mild'
  },
  {
    id: 3,
    question: "What bonkers thing happens to your body in space?",
    options: [
      "You grow 2 inches taller instantly",
      "Your heart shrinks like a raisin",
      "You can't cry properly because tears don't fall",
      "All of the above, space is mental"
    ],
    correctAnswer: 3,
    chaosLevel: 'medium'
  },
  {
    id: 4,
    question: "What ridiculous fact about octopuses proves they're alien overlords?",
    options: [
      "They have three hearts and blue blood",
      "They can taste with their arms",
      "They're basically immortal until they decide to die",
      "All of the above, they're clearly plotting something"
    ],
    correctAnswer: 3,
    chaosLevel: 'extreme'
  },
  {
    id: 5,
    question: "How many trees does it take to make enough oxygen for one person per year?",
    options: [
      "About 2 mature trees (so stop panicking)",
      "At least 7 trees working overtime",
      "Roughly 22 trees having a proper go",
      "One massive tree that's been to the gym"
    ],
    correctAnswer: 0,
    chaosLevel: 'medium'
  },
  {
    id: 6,
    question: "What unhinged thing did the ancient Romans use for toothpaste?",
    options: [
      "Crushed bones and oyster shells",
      "Human urine (yes, really)",
      "Powdered charcoal and salt",
      "Whatever they could nick from Gaul"
    ],
    correctAnswer: 1,
    chaosLevel: 'mild'
  },
  {
    id: 7,
    question: "What percentage of your DNA do you share with bananas?",
    options: [
      "About 60% (which explains a lot about humans)",
      "Roughly 25% (still concerning)",
      "Only 10% (thankfully)",
      "None, that's absolutely mad"
    ],
    correctAnswer: 0,
    chaosLevel: 'extreme'
  },
  {
    id: 8,
    question: "How fast is the Earth spinning right now as you sit there?",
    options: [
      "About 1,000 mph at the equator",
      "Roughly 500 mph (still mental)",
      "Around 250 mph (explains the dizziness)",
      "It's not spinning, that's just the alcohol"
    ],
    correctAnswer: 0,
    chaosLevel: 'medium'
  },
  {
    id: 9,
    question: "What mad thing happens if you fold a piece of paper 42 times?",
    options: [
      "It reaches the Moon",
      "It becomes thicker than the distance to the Moon",
      "It creates a black hole",
      "Your nan appears to tell you to stop mucking about"
    ],
    correctAnswer: 1,
    chaosLevel: 'extreme'
  },
  {
    id: 10,
    question: "How many possible ways can you arrange a deck of 52 cards?",
    options: [
      "More than there are atoms in the observable universe",
      "About a trillion trillion ways",
      "Roughly the same as grains of sand on Earth",
      "Fewer than the number of tea bags consumed in Britain daily"
    ],
    correctAnswer: 0,
    chaosLevel: 'extreme'
  }
]