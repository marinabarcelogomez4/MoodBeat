const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.textContent = '';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    errorMsg.textContent = 'Por favor, completa todos los campos.';
    console.log('Login fallido: campos incompletos');
    return;
  }

  console.log(`Intentando login para usuario: ${email}`);

  try {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),

      // IMPORTANTE: Si usas cookies para sesiones o token en cookie
      credentials: 'include' 
    });

    const data = await res.json();
    if (res.ok) {
        localStorage.setItem('token', data.token);  // ✅ Aquí sí tiene sentido
        console.log('🔐 Token guardado en localStorage:', data.token);
        window.location.href = 'index.html';
    } else {
      errorMsg.textContent = data.message || 'Error en el inicio de sesión';
      console.log(`Error en login para ${email}: ${data.message || 'Error desconocido'}`);
    }
  } catch (err) {
    console.error('Error de conexión con el servidor:', err);
    errorMsg.textContent = 'Error de conexión con el servidor.';
  }
});
