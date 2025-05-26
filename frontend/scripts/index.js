window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.warn('🔒 No hay token. Redirigiendo a login...');
    return redirectToLogin();
  }

  try {
      const res = await fetch('http://localhost:3000/auth/verify', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      console.warn('🔒 Token inválido o expirado.');
      localStorage.removeItem('token');
      return redirectToLogin();
    }

    const { email } = await res.json();
    console.log('✅ Sesión activa como:', email);

    loadUserHistory();// Llama a cargar el historial 
    // bind del botón de refresco
    const refreshBtn = document.getElementById('refreshHistory');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        loadUserHistory();
      });
    }

    const usernameDisplay = document.getElementById('usernameDisplay');
    if (usernameDisplay) {
      usernameDisplay.innerText = `👤 ${email}`;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    const recommendBtn = document.getElementById('recommendBtn');

    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (recommendBtn) recommendBtn.addEventListener('click', handleRecommendationClick);

  } catch (err) {
    console.error('❌ Error verificando token:', err);
    redirectToLogin();
  }
});

function redirectToLogin() {
  window.location.href = 'login.html';
}

async function handleLogout() {
  localStorage.removeItem('token');
  console.log('🚪 Sesión cerrada.');
  redirectToLogin();
}

const promptHistory = [];

async function handleRecommendationClick() {
  const inputEl = document.getElementById('userInput');
  const input = inputEl?.value.trim();

  if (!input) return;

  // promptHistory.push(input);
  // updatePromptHistory();

  await getRecommendation(input);
}

function updatePromptHistory() {
  const list = document.getElementById('promptHistory');
  if (!list) return;

  list.innerHTML = '';
  promptHistory.slice().reverse().forEach(prompt => {
    const li = document.createElement('li');
    li.textContent = prompt;
    list.appendChild(li);
  });
}

async function getRecommendation(text) {
  const loadingDiv = document.getElementById("loading");
  const recommendBtn = document.getElementById("recommendBtn");

  if (!text) {
    alert("Por favor, escribe cómo te sientes.");
    return;
  }

  try {
    if (loadingDiv) loadingDiv.style.display = "block";
    if (recommendBtn) recommendBtn.disabled = true;

    // 1. Obtener emoción desde backend Flask
    const emotionRes = await fetch("http://localhost:5000/predict_emotion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    if (!emotionRes.ok) throw new Error('Error al obtener emoción');

    const emotionData = await emotionRes.json();
    const detectedEmotion = emotionData.emotion;

    const emotionOutput = document.getElementById("emotionOutput");
    if (emotionOutput) {
      emotionOutput.innerText = `Emoción detectada: ${detectedEmotion}`;
    }

  // 2. Obtener recomendaciones desde backend Node
const recRes = await fetch("http://localhost:3000/recommend", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: detectedEmotion })
});

if (!recRes.ok) throw new Error('Error al obtener recomendaciones');

const recData = await recRes.json();
console.log("📀 Recomendaciones recibidas:", recData.recommendations);

const playlistDiv = document.getElementById("playlists");
if (!playlistDiv) return;
playlistDiv.innerHTML = '';

// 👉 Guardar en historial
const token = localStorage.getItem('token');
if (token) {
  const saveRes = await fetch("http://localhost:3000/history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      prompt: text,
      emotion: detectedEmotion,
      recommendations: recData.recommendations
    })
  });

  if (saveRes.ok) {
    console.log("✅ Prompt guardado correctamente. Actualizando historial...");
    await loadUserHistory();  // <<<<<< ACTUALIZA SOLO CUANDO SE GUARDA BIEN
  } else {
    console.warn("⚠️ No se pudo guardar el prompt");
  }
}





if (Array.isArray(recData.recommendations)) {
  recData.recommendations.forEach(item => {
    const card = document.createElement('div');
    card.className = 'playlist-card';

    const img = document.createElement('img');
    img.src = item.image || 'img/images.jpeg'; // Ruta a una imagen de respaldo local
    img.alt = item.name;

    const title = document.createElement('div');
    title.className = 'playlist-title';
    title.textContent = item.name;

    card.appendChild(img);
    card.appendChild(title);

    card.addEventListener('click', () => {
      openSpotifyModal(item.url);
    });

    playlistDiv.appendChild(card);
  });
} else {
  playlistDiv.innerText = "No se encontraron recomendaciones.";
}

  } catch (err) {
    console.error('❌', err);
    alert("Error al obtener recomendaciones.");
  } finally {
    if (loadingDiv) loadingDiv.style.display = "none";
    if (recommendBtn) recommendBtn.disabled = false;
  }
}


function updatePromptHistory() {
  const list = document.getElementById('promptHistory');
  list.innerHTML = '';

  promptHistory.slice().reverse().forEach(prompt => {
    const li = document.createElement('li');

    const link = document.createElement('a');
    link.href = "#";
    link.textContent = prompt;

    link.addEventListener('click', async (e) => {
      e.preventDefault();
      document.getElementById('userInput').value = prompt;
      await getRecommendation(prompt);  // Ejecuta toda la función con el prompt del historial
    });

    li.appendChild(link);
    list.appendChild(li);
  });
}


// Abrir modal con un URI de Spotify
function openSpotifyModal(spotifyUrl) {
  const modal = document.getElementById("modal");
  const iframe = document.getElementById("spotifyEmbed");

  // Convierte links de Spotify en formato embed
  const embedUrl = spotifyUrl.replace("open.spotify.com", "open.spotify.com/embed");

  iframe.src = embedUrl;
  modal.classList.add("active");
}

// Cerrar el modal al hacer clic en la X
document.getElementById("modalClose").addEventListener("click", () => {
  const modal = document.getElementById("modal");
  const iframe = document.getElementById("spotifyEmbed");

  modal.classList.remove("active");
  iframe.src = ""; // para detener reproducción
});

// También cierra al hacer clic fuera del modal
document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target.id === "modal") {
    document.getElementById("modal").classList.remove("active");
    document.getElementById("spotifyEmbed").src = "";
  }
});

// Al hacer clic en un enlace de playlist
document.getElementById('playlists').addEventListener('click', function (e) {
  if (e.target.tagName === 'A') {
    e.preventDefault();
    openSpotifyModal(e.target.href); // usa la función definida
  }
});


async function loadUserHistory() {
  const token = localStorage.getItem('token');
  const historyDiv = document.getElementById('userHistory');

  if (!historyDiv) return;

  try {
    const res = await fetch('http://localhost:3000/history', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error('No se pudo obtener el historial');

    const history = await res.json();

    if (history.length === 0) {
      historyDiv.innerText = 'No hay historial disponible.';
      return;
    }

    historyDiv.innerHTML = '';
    history.forEach((entry, index) => {
      const card = document.createElement('div');
      card.className = 'history-card';
      const date = new Date(entry.createdAt || Date.now()).toLocaleString();

       card.innerHTML = `
        <div class="history-content">
          <h4>${entry.emotion}</h4>
          <p class="history-date">${date}</p>
        </div>
        <button class="delete-history-btn" title="Eliminar entrada">🗑️</button>
      `;

      // Abrir modal al hacer clic en la parte de contenido (no en el botón)
        card.querySelector('.history-content').addEventListener('click', () => openHistoryModal(entry));

        // Eliminar historial al hacer clic en el botón
        const deleteBtn = card.querySelector('.delete-history-btn');
        deleteBtn.addEventListener('click', async (e) => {
          e.stopPropagation(); // Para que no dispare el modal
          if (confirm("¿Estás seguro de que deseas eliminar esta entrada?")) {
            await deleteHistoryEntry(entry._id);
            console.log("🧾 Eliminando historial con ID:", entry._id);
            console.log("🧾 Eliminando historial con email:", entry.email);

          }
        });

        historyDiv.appendChild(card);

      card.addEventListener('click', () => openHistoryModal(entry));
      historyDiv.appendChild(card);
    });
  } catch (err) {
    console.error('❌ Error cargando historial:', err);
    historyDiv.innerText = 'Error al cargar historial.';
  }
}


async function deleteHistoryEntry(id) {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`http://localhost:3000/history/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error('No se pudo eliminar el historial');

    console.log('🗑️ Entrada eliminada con éxito');
    await loadUserHistory(); // Recargar historial actualizado
  } catch (err) {
    console.error('❌ Error eliminando entrada:', err);
    alert("No se pudo eliminar la entrada del historial.");
  }
}


function openHistoryModal(entry) {
  const modal = document.getElementById("historyModal");
  const modalContent = document.getElementById("historyModalContent");

  modalContent.innerHTML = `
    <h3>Emoción: ${entry.emotion}</h3>
    <p><strong>Fecha:</strong> ${new Date(entry.createdAt || Date.now()).toLocaleString()}</p>
    <p><strong>Prompt:</strong> ${entry.prompt}</p>
    <p><strong>Recomendaciones:</strong></p>
    <div class="recommendation-grid">
      ${entry.recommendations.map(rec => `
        <div class="rec-card">
          <img src="${rec.image || 'img/images.jpeg'}" alt="${rec.name}" />
          <a href="${rec.url}" target="_blank">${rec.name}</a>
        </div>
      `).join('')}
    </div>
  `;

  modal.classList.add("active");
}


// Cerrar el modal
document.getElementById("historyModalClose").addEventListener("click", () => {
  document.getElementById("historyModal").classList.remove("active");
});





