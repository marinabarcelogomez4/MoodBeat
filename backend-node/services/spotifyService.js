const axios = require('axios');

const moodMap = {
  'alegría': 'happy',
  'emoción': 'party',
  'gratitud': 'chill',
  'diversión': 'fun',
  'amor': 'romantic',
  'optimismo': 'optimistic',
  'orgullo': 'pride',
  'admiración': 'inspirational',

  'enojo': 'metal',
  'molestia': 'rock',
  'desaprobación': 'angry',

  'tristeza': 'sad',
  'duelo': 'melancholy',
  'arrepentimiento': 'blues',
  'decepción': 'sad',

  'miedo': 'dark',
  'nerviosismo': 'ambient',

  'sorpresa': 'surprise',
  'revelación': 'mystery',

  'neutral': 'chill',
  'confusión': 'ambient',
  'curiosidad': 'discovery',
  'aprobación': 'positive',
  'alivio': 'relax',
  'vergüenza': 'calm',
  'asco': 'grunge',
  'deseo': 'love',
  'cariño': 'romantic'
};

async function getToken() {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        'Authorization': `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data.access_token;
}

async function getRecommendations(emotion) {
  const token = await getToken();
  const query = moodMap[emotion.toLowerCase()] || 'mood';

  const response = await axios.get(`https://api.spotify.com/v1/search`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      q: query,
      type: 'playlist',
      limit: 5
    }
  });

 return response.data.playlists.items
  .filter(p => p && p.name && p.external_urls && p.external_urls.spotify)
  .map(p => ({
    name: p.name,
    url: p.external_urls.spotify,
    image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0].url : null
  }));

}

module.exports = { getRecommendations };
