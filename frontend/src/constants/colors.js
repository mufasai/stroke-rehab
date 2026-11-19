export const colors = {
  // Primary color - Rukana Dark Green (#34613A)
  primary: {
    50: '#F1FAE6',   // Foreshadow / very soft green
    100: '#E2F5D1',
    200: '#C6EBAB',
    300: '#A4DC7B',
    400: '#8EBD55',  // Soft green
    500: '#4D8343',
    600: '#34613A',  // Main primary color (Rukana)
    700: '#2A5030',  // Darker primary (hover)
    800: '#1F3D24',
    900: '#152A19',
    950: '#0A160C',
  },

  // Secondary color - Rukana Secondary Slate/Teal (#5A7A7E)
  secondary: {
    50: '#F3F7F7',
    100: '#E4EDEE',
    200: '#CBDBDD',
    300: '#A7C2C5',
    400: '#7DA2A7',
    500: '#5A7A7E',  // Main secondary
    600: '#476367',
    700: '#394F52',
    800: '#314245',
    900: '#2A383A',
    950: '#001B1A',  // Desa black
  },

  // Success - Soft Green (correct movement)
  success: {
    50: '#F4FAEE',
    100: '#E5F4D7',
    200: '#CDEAB2',
    300: '#ADDD84',
    400: '#8EBD55',
    500: '#8EBD55',  // Main success (Rukana Soft Green)
    600: '#72A13D',
    700: '#587D30',
    800: '#425E25',
    900: '#2F431B',
  },

  // Warning - Yellow/Amber (incomplete movement)
  warning: {
    50: '#FFF9F0',
    100: '#FFF1DE',
    200: '#FFE0B8',
    300: '#FFC887',
    400: '#FBAD4A',
    500: '#FBAD4A',  // Main warning (Rukana Yellow)
    600: '#E09030',
    700: '#B86F1C',
    800: '#915317',
    900: '#734114',
  },

  // Error - Red (compensatory movement / error)
  error: {
    50: '#FFF1F3',
    100: '#FFE0E5',
    200: '#FFBAC6',
    300: '#FF8AA0',
    400: '#FF5070',
    500: '#FF5070',  // Main error (Rukana Red)
    600: '#E8405F',
    700: '#C22D49',
    800: '#9C233A',
    900: '#7D1E30',
  },

  // Info - Blue
  info: {
    50: '#F0F7FD',
    100: '#E0EFFB',
    200: '#B8DBF6',
    300: '#85BEED',
    400: '#4C9EE2',
    500: '#005CAA',  // Rukana Blue
    600: '#005299',
    700: '#00427D',
    800: '#003563',
    900: '#00294F',
  },

  // Rukana Direct Design Tokens
  desa: {
    black: '#001B1A',
    secondary: '#5A7A7E',
    darkGreen: '#34613A',
    softGreen: '#8EBD55',
    foreshadow: '#F1FAE6',
    yellow: '#FBAD4A',
    orange: '#FA7139',
    background: '#F2F9F6',
    blue: '#005CAA',
    red: '#FF5070',
    grey: '#DBDBDB',
    lime: '#DEFF6E',
  },

  // Semantic UI colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F9F6',  // Rukana Background
    tertiary: '#F1FAE6',   // Foreshadow
  },

  text: {
    primary: '#001B1A',    // Rukana Black
    secondary: '#5A7A7E',  // Rukana Secondary
    tertiary: '#94A3B8',
    inverted: '#FFFFFF',
  },

  border: {
    light: '#F1FAE6',
    DEFAULT: '#DBDBDB',   // Rukana Grey
    dark: '#5A7A7E',
  }
}

// Quality status colors (untuk badge & indicators)
export const qualityColors = {
  correct: colors.success[500],       // Soft Green (#8EBD55)
  compensatory: colors.error[500],    // Red (#FF5070)
  incomplete: colors.warning[500],    // Yellow (#FBAD4A)
}

// Gradient backgrounds
export const gradients = {
  primary: 'linear-gradient(135deg, #89B854 0%, #34613A 100%)',
  vertical: 'linear-gradient(209.83deg, #89B854 1.15%, #042F2B 100%)',
  horizontal: 'linear-gradient(272.68deg, #89B854 0%, #042F2B 100%)',
  success: 'linear-gradient(135deg, #8EBD55 0%, #34613A 100%)',
}
