/*
 * cita.js · Reglas de validación que HTML no puede expresar solo.
 * Todos los errores se dan con setCustomValidity(): el navegador los
 * muestra igual que los suyos y no deja enviar mientras haya alguno.
 */

const campoFecha    = document.querySelector('#fecha');
const casillaCuenta = document.querySelector('#quiero-cuenta');
const bloqueCuenta  = document.querySelector('#bloque-cuenta');
const pass1         = document.querySelector('#password');
const pass2         = document.querySelector('#password2');
const descripcion   = document.querySelector('#descripcion');
const contador      = document.querySelector('#contador');

/* ---------- Regla 1 · Fecha mínima = mañana ---------- */
// toLocaleDateString('sv-SE') devuelve la fecha LOCAL como "aaaa-mm-dd",
// el mismo formato que usa input[type=date]. (toISOString usaría UTC y
// entre las 00:00 y la 01:00 en España daría el día anterior.)
const manana = new Date();
manana.setDate(manana.getDate() + 1);
campoFecha.min = manana.toLocaleDateString('sv-SE');

/* ---------- Regla 2 · Domingos cerrados ---------- */
function esDomingo(textoFecha) {
  // "2026-12-06" -> año 2026, mes 12, día 6. Se crea en hora local:
  // new Date("2026-12-06") se leería en UTC y podría cambiar de día.
  const [anio, mes, dia] = textoFecha.split('-').map(Number);
  return new Date(anio, mes - 1, dia).getDay() === 0;   // 0 = domingo
}

campoFecha.addEventListener('change', () => {
  if (campoFecha.value && esDomingo(campoFecha.value)) {
    campoFecha.setCustomValidity('El taller cierra los domingos');
  } else {
    campoFecha.setCustomValidity('');   // sin esto el error no se borraría nunca
  }
});

/* ---------- Regla 3 · Cuenta opcional ---------- */
casillaCuenta.addEventListener('change', () => {
  bloqueCuenta.disabled = !casillaCuenta.checked;  // disabled = ni se valida ni se envía
  if (casillaCuenta.checked) pass1.focus();
});

/* ---------- Regla 4 · Las contraseñas deben coincidir ---------- */
// La longitud y la mezcla de letras y números ya las controla el pattern del HTML.
function comprobarClaves() {
  pass2.setCustomValidity(
    pass2.value && pass2.value !== pass1.value ? 'Las contraseñas no coinciden.' : ''
  );
}
pass1.addEventListener('input', comprobarClaves);
pass2.addEventListener('input', comprobarClaves);

/* ---------- Extra · Contador de caracteres ---------- */
function contar() {
  contador.textContent = `${descripcion.value.length} / 500 caracteres`;
}
descripcion.addEventListener('input', contar);
contar();

/* ---------- Ampliación · Letra del DNI ---------- */
// La letra es un dígito de control: resto de dividir el número entre 23,
// usado como posición en esta cadena.
const campoDni = document.querySelector('#dni');
const TABLA_LETRAS = 'TRWAGMYFPDXBNJZSQVHLCKE';

function letraCorrecta(numero) {
  return TABLA_LETRAS.charAt(numero % 23);
}

campoDni.addEventListener('input', () => {
  const dni = campoDni.value.trim().toUpperCase();
  campoDni.setCustomValidity('');
  // Si no tiene la forma 8 números + letra, avisa el pattern del HTML
  if (!/^\d{8}[A-Z]$/.test(dni)) return;
  const esperada = letraCorrecta(parseInt(dni.slice(0, 8), 10));
  if (dni.at(-1) !== esperada) {
    campoDni.setCustomValidity(`La letra no es correcta para ese número (sería ${esperada}).`);
  }
});
