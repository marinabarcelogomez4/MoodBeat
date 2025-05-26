from flask import Flask, request, jsonify
from flask_cors import CORS

import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModelForSequenceClassification, MarianMTModel, MarianTokenizer

# --- Configuración del modelo de emociones ---
EMOTION_MODEL_NAME = "pysentimiento/bertweet-base-emotion"
emotion_tokenizer = AutoTokenizer.from_pretrained(EMOTION_MODEL_NAME)
emotion_model = AutoModelForSequenceClassification.from_pretrained(EMOTION_MODEL_NAME)
emotion_model.eval()
print("Etiquetas del modelo:", emotion_model.config.id2label)

# --- Configuración del modelo de traducción (español a inglés) ---
TRANSLATION_MODEL_NAME = "Helsinki-NLP/opus-mt-es-en"
translation_tokenizer = MarianTokenizer.from_pretrained(TRANSLATION_MODEL_NAME)
translation_model = MarianMTModel.from_pretrained(TRANSLATION_MODEL_NAME)

# --- Inicializar Flask ---
app = Flask(__name__)
CORS(app, supports_credentials=True)

# --- Mapeo de etiquetas a emociones generales (traducción personalizada) ---
emotion_group_map = {
    "joy": "alegría",
    "excitement": "emoción",
    "gratitude": "gratitud",
    "amusement": "diversión",
    "love": "amor",
    "optimism": "optimismo",
    "pride": "orgullo",
    "admiration": "admiración",

    "anger": "enojo",
    "annoyance": "molestia",
    "disapproval": "desaprobación",

    "sadness": "tristeza",
    "grief": "duelo",
    "remorse": "arrepentimiento",
    "disappointment": "decepción",

    "fear": "miedo",
    "nervousness": "nerviosismo",

    "surprise": "sorpresa",
    "realization": "revelación",

    "neutral": "neutral",
    "confusion": "confusión",
    "curiosity": "curiosidad",
    "approval": "aprobación",
    "relief": "alivio",
    "embarrassment": "vergüenza",
    "disgust": "asco",
    "desire": "deseo",
    "caring": "cariño"
}


# --- Función de traducción ---
def translate_es_to_en(text):
    translation_inputs = translation_tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    translated = translation_model.generate(**translation_inputs)
    return translation_tokenizer.decode(translated[0], skip_special_tokens=True)

# --- Función de predicción de emoción ---
def predict_emotion(text):
    print("Texto original:", text)

    # Traducir del español al inglés
    translated_text = translate_es_to_en(text)
    print("Texto traducido:", translated_text)

    inputs = emotion_tokenizer(translated_text, return_tensors="pt", truncation=True, padding=True, max_length=128)
    with torch.no_grad():
        outputs = emotion_model(**inputs)
        logits = outputs.logits
        probs = F.softmax(logits, dim=1).squeeze()
        predicted_class = torch.argmax(probs).item()
        label_en = emotion_model.config.id2label[predicted_class]
        confidence = probs[predicted_class].item()

        emotion_general = emotion_group_map.get(label_en.lower(), "neutral")
        print("Emoción detectada:", label_en, "->", emotion_general)

        return label_en, emotion_general, confidence

# --- Ruta de la API para predecir emoción ---
@app.route('/predict_emotion', methods=['POST'])
def emotion_endpoint():
    data = request.get_json()
    text = data.get('text', '')
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    label_en, emotion_general, confidence = predict_emotion(text)

    return jsonify({
        'emotion': emotion_general,
        'confidence': round(confidence, 4),
        'label_detected': label_en  # opcional: para debug
    })


# --- Ejecutar si se llama directamente ---
if __name__ == '__main__':
    app.run(debug=True)
