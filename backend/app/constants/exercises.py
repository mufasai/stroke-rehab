"""Exercise type constants and configurations"""

EXERCISE_TYPES = {
    "FINGER_SPREAD": {
        "code": "finger_spread",
        "name": "Finger Spread Exercise",
        "description": "Merenggangkan jari-jari tangan selebar mungkin",
        "default_threshold": 0.15,
        "default_repetitions": 10,
    },
    "THUMB_TO_TIPS": {
        "code": "thumb_to_tips",
        "name": "Thumb-to-Fingertips Opposition",
        "description": "Sentuhan ibu jari ke ujung jari lainnya",
        "default_threshold": 0.03,
        "default_repetitions": 10,
    },
    "FIST_CURL": {
        "code": "fist_curl",
        "name": "Fist Open-Close Exercise",
        "description": "Membuka dan menutup kepalan tangan",
        "default_threshold_open": 150,  # degrees
        "default_threshold_closed": 60,  # degrees
        "default_repetitions": 10,
    }
}

QUALITY_LABELS = {
    "CORRECT": "correct",
    "COMPENSATORY": "compensatory",
    "INCOMPLETE": "incomplete",
}
