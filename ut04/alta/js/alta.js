/*
 * alta.js · Validación propia del formulario de alta en la red.
 * Usa setCustomValidity() para que el navegador muestre los mensajes
 * como los nativos y bloquee el envío.
 */
const usuario = document.querySelector('#usuario');
const clave   = document.querySelector('#clave');
const clave2  = document.querySelector('#clave2');
const cuota   = document.querySelector('#cuota');
const cuotaTx = document.querySelector('#cuota-valor');

/* Regla 1 · La contraseña no puede contener el nombre de usuario
   (es lo primero que prueba un atacante). */
function comprobarClave() {
  const u = usuario.value.toLowerCase();
  if (u.length >= 4 && clave.value.toLowerCase().includes(u)) {
    clave.setCustomValidity('La contraseña no puede contener tu nombre de usuario.');
  } else {
    clave.setCustomValidity('');
  }
  comprobarRepeticion();
}

/* Regla 2 · Las dos contraseñas deben ser iguales. */
function comprobarRepeticion() {
  clave2.setCustomValidity(
    clave2.value && clave2.value !== clave.value ? 'Las contraseñas no coinciden.' : ''
  );
}

usuario.addEventListener('input', comprobarClave);
clave.addEventListener('input', comprobarClave);
clave2.addEventListener('input', comprobarRepeticion);

/* Mostrar el valor del range junto a su etiqueta */
cuota.addEventListener('input', () => { cuotaTx.textContent = cuota.value; });
