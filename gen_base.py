#!/usr/bin/env python3
"""
Generate 100 new lessons (20 per level A1-C1).
Strategy: Multiple files append to a temp JSON, then merged.
"""

import json, os, sys

DATA_DIR = os.path.join(os.path.dirname(__file__), 'src', 'data')

def L(level, unit, lid, title, objective, explanation, examples, vocab_pairs,
      grammarFocus, guided_qs, reading_text, reading_qs,
      listening_script, listening_qs, writing, speaking, review):
    return {
        "level": level, "unit": unit, "id": lid, "title": title,
        "objective": objective, "explanation": explanation,
        "examples": examples if isinstance(examples, list) else [examples],
        "vocabulary": [{"word": w, "translation": t} for w, t in vocab_pairs],
        "grammarFocus": grammarFocus,
        "guidedPractice": [{"prompt": p, "answer": a} for p, a in guided_qs],
        "independentPractice": [
            {"prompt": "Write 5 sentences using the grammar from this lesson.", "type": "writing"},
            {"prompt": "Practice the vocabulary with a partner.", "type": "speaking"}
        ],
        "readingTask": {
            "text": reading_text,
            "questions": [{"question": q, "options": [], "answer": a} for q, a in reading_qs]
        },
        "listeningTask": {
            "script": listening_script,
            "questions": [{"question": q, "options": [], "answer": a} for q, a in listening_qs]
        },
        "writingTask": writing, "speakingTask": speaking, "reviewSummary": review
    }

def unit(level, n):
    if 6 <= n <= 10: return f"{level}_unit_1"
    if 11 <= n <= 15: return f"{level}_unit_2"
    if 16 <= n <= 20: return f"{level}_unit_3"
    if 21 <= n <= 25: return f"{level}_unit_4"
    return f"{level}_unit_5"

NEW = []
