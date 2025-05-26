# 🎧 MoodBeat Emotion Detection API

Este proyecto es una API desarrollada con Flask que detecta emociones en texto **escrito en español**, usando modelos de **traducción automática** y **clasificación emocional con BERT**.

Combina:
- Traducción de texto de español a inglés.
- Clasificación de emociones con un modelo de HuggingFace.
- Un servidor web con Flask que expone un endpoint para predecir emociones.

---

## 🚀 ¿Cómo Funciona?

1. El usuario envía un texto en **español** a la API.
2. El texto es traducido al **inglés** usando un modelo de Helsinki-NLP.
3. El texto traducido es procesado con el modelo `pysentimiento/bertweet-base-emotion`.
4. Se devuelve la **emoción detectada**, su traducción al español y la **confianza** del modelo.

---

## 🛠️ Tecnologías y Modelos Utilizados

| Componente | Tecnología / Modelo |
|-----------|----------------------|
| Backend   | Flask, Flask-CORS |
| NLP       | `pysentimiento/bertweet-base-emotion` |
| Traducción | `Helsinki-NLP/opus-mt-es-en` |
| Deep Learning | PyTorch, Transformers (Hugging Face) |



