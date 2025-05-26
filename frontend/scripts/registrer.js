const registerForm = document.getElementById('registerForm');
const errorMsg = document.getElementById('errorMsg');
const successMsg = document.getElementById('successMsg');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  errorMsg.textContent = '';
  successMsg.textContent = '';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();

  if (!email || !password || !confirmPassword) {
    errorMsg.textContent = 'Por favor, completa todos los campos.';
    console.log('Registro fallido: campos incompletos');
    return;
  }

  if (password !== confirmPassword) {
    errorMsg.textContent = 'Las contraseñas no coinciden.';
    console.log('Registro fallido: contraseñas no coinciden');
    return;
  }

  console.log(`Intentando registrar usuario: ${email}`);

  try {
    const res = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      successMsg.textContent = '¡Registro exitoso! Ahora puedes iniciar sesión.';
      console.log(`Usuario registrado exitosamente: ${email}`);
      registerForm.reset();

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    } else {
      errorMsg.textContent = data.message || 'Error en el registro';
      console.log(`Error en registro para ${email}: ${data.message || 'Error desconocido'}`);
    }

  } catch (err) {
    console.error('Error de conexión con el servidor:', err);
    errorMsg.textContent = 'Error de conexión con el servidor.';
    console.error(`❌ Error registrando ${email}:`, err.message);
  }
});

