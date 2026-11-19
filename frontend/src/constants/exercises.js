
export const EXERCISE_TYPES = {
  FINGER_SPREAD: {
    code: 'finger_spread',
    name: 'Finger Spread Exercise',
    nameId: 'Jari Merengang',
    description: 'Merenggangkan jari-jari tangan selebar mungkin',
    defaultThreshold: 0.15,
    defaultRepetitions: 10,
  },
  THUMB_TO_TIPS: {
    code: 'thumb_to_tips',
    name: 'Thumb-to-Fingertips Opposition',
    nameId: 'Oposisi Ibu Jari',
    description: 'Sentuhan ibu jari ke ujung jari lainnya',
    defaultThreshold: 0.03,
    defaultRepetitions: 10,
  },
  FIST_CURL: {
    code: 'fist_curl',
    name: 'Fist Open-Close Exercise',
    nameId: 'Buka-Tutup Kepalan',
    description: 'Membuka dan menutup kepalan tangan',
    defaultThresholdOpen: 150, // degrees
    defaultThresholdClosed: 60, // degrees
    defaultRepetitions: 10,
  }
}

export const QUALITY_LABELS = {
  CORRECT: 'correct',
  COMPENSATORY: 'compensatory',
  INCOMPLETE: 'incomplete',
}

export const QUALITY_COLORS = {
  correct: '#10b981', // green
  compensatory: '#ef4444', // red
  incomplete: '#f59e0b', // yellow
}

export const AFFECTED_HAND = {
  LEFT: 'left',
  RIGHT: 'right',
  BOTH: 'both',
}
