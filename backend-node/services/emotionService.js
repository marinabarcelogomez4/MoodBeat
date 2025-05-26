const axios = require('axios');

async function getEmotion(text) {
    const response = await axios.post('http://127.0.0.1:5000/predict_emotion', { text });
    return response.data.emotion;
}

module.exports = { getEmotion };
