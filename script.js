/* ===== EDITA AQUÍ: todo lo personal está en este bloque ===== */
const CONFIG = {
  nombre: "Para Anjhaly",                 // su nombre, aparece gigante arriba
  subtitulo: "Espero que te guste.",
  fechaAmistad: "2022-06-22",               // desde cuándo son amigas (AAAA-MM-DD)
  tuNombre: "Joao.",                     // cómo firmas la carta
  papelitos: [
    "Tu compañía es siempre indispensable.",
    "Recuerda que siempre contarás conmigo.",
    "Eres la persona a la que eh admirado.",
    "Gracias por quedarte incluso en mis días malos.",
    "Es bonito saber que siempre estarás presente.",
    "Me haces querer ser mejor persona.",
    "Contigo siempre me sentí en casa.",
    "Quiero que nuestra amistad dure para siempre.",
    "Marcaste un antes y un después en mi vida."
  ],
  carta: [
    "OIE recuerdas que te dije que aprendi a programar?, aqui están los resultados djaskdjask.",
    "Hola down, no entiendo como desde un inicio nos llevamos bien, ni yo se SOLO TU SABES jkasjdk pero no me imaginé que pudieras ser tan buena persona, es bonito pensar que aunque ciertas amistades acaban, siempre hay una acompañandome ahí y se llama Sharon. Sabes que siempre fui malo explicando cosas pero no entiendo como me logras comprenderme jaksdjak pero agradezco que siempre me escuches y estes para mí, desde siempre has estado ahí presente, en todas, pero recuerda que tú también eres importante para mi y siempre te voy apoyar. Ultimamente me sentia de una forma diferente  y en verdad lo siento por no darte tu regalo con tiempo, me pasé de irresponsable, y es por eso que a veces pienso que no soy un buen amigo para tí, debido a que tú me das muchas cosas y yo no se que responder, no me voy a justificar jaskdjak pero perdón, solo quisiera que este detalle te guste y de nuevo gracias por ser mi amiga y estar para mi siempre en verdad aprecio mucho eso.",
    "PDT: Recuerdo que esa música te gustaba jaksdj."
  ],
  final: "Gracias por existir, eres mi persona favorita."
};
/* ============================================================ */

const $ = id => document.getElementById(id);
document.title =CONFIG.nombre + " ✨";
$("nombre").textContent = CONFIG.nombre;
$("subtitulo").textContent = CONFIG.subtitulo;
$("carta").innerHTML = CONFIG.carta.map(t => "<p>" + t + "</p>").join("") + '<p class="firma">— ' + CONFIG.tuNombre + '</p>';

/* Contador de amistad */
function pintaContador(){
  const ini = new Date(CONFIG.fechaAmistad + "T00:00:00"), ahora = new Date();
  let ms = Math.max(0, ahora - ini);
  const dias = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4), s = Math.floor(ms % 6e4 / 1e3);
  $("contador").innerHTML = [[dias,"días"],[h,"horas"],[m,"minutos"],[s,"segundos"]]
    .map(([n,u]) => "<div><b>" + n.toLocaleString("es") + "</b><span>" + u + "</span></div>").join("");
}
pintaContador(); setInterval(pintaContador, 1000);

/* Papelitos (sin repetir hasta agotarlos) */
let bolsa = [];
$("sacar").onclick = () => {
  if (!bolsa.length) bolsa = CONFIG.papelitos.slice().sort(() => Math.random() - .5);
  const p = $("papelito");
  p.classList.remove("nuevo"); void p.offsetWidth;
  p.textContent = bolsa.pop(); p.classList.add("nuevo");
};

/* Cielo de estrellas + explosión al tocar */
const cv = $("cielo"), ctx = cv.getContext("2d");
const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
let W, H, estrellas = [], chispas = [];
const colores = ["#ffcf5c", "#ff7a9a", "#b9a7ff", "#f6f2ff"];
function ajusta(){
  const d = devicePixelRatio || 1;
  W = cv.width = innerWidth * d; H = cv.height = innerHeight * d;
  estrellas = Array.from({length: 90}, () => ({x: Math.random()*W, y: Math.random()*H, r: (Math.random()*1.6+.4)*d, f: Math.random()*6.28}));
}
addEventListener("resize", ajusta); ajusta();
function explota(x, y, n, corazones){
  const d = devicePixelRatio || 1;
  for (let i = 0; i < n; i++){
    const a = Math.random()*6.28, v = (Math.random()*4+1.5)*d;
    chispas.push({x: x*d, y: y*d, vx: Math.cos(a)*v, vy: Math.sin(a)*v - 1.5*d, vida: 1, c: colores[i % 4], r: (Math.random()*3+2)*d, h: corazones});
  }
}
addEventListener("pointerdown", e => explota(e.clientX, e.clientY, 26, false));
function dibujaCorazon(x, y, s){
  ctx.beginPath(); ctx.moveTo(x, y + s*.35);
  ctx.bezierCurveTo(x - s, y - s*.3, x - s*.5, y - s, x, y - s*.4);
  ctx.bezierCurveTo(x + s*.5, y - s, x + s, y - s*.3, x, y + s*.35); ctx.fill();
}
function frame(t){
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#f6f2ff";
  for (const e of estrellas){
    ctx.globalAlpha = reduce ? .6 : .35 + .55*Math.abs(Math.sin(t/1200 + e.f));
    ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 6.28); ctx.fill();
  }
  for (let i = chispas.length - 1; i >= 0; i--){
    const c = chispas[i];
    c.x += c.vx; c.y += c.vy; c.vy += .08*(devicePixelRatio||1); c.vida -= .016;
    if (c.vida <= 0){ chispas.splice(i, 1); continue; }
    ctx.globalAlpha = c.vida; ctx.fillStyle = c.c;
    if (c.h) dibujaCorazon(c.x, c.y, c.r*2.4); else { ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, 6.28); ctx.fill(); }
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* Sorpresa final: lluvia de corazones */
$("sorpresa").onclick = () => {
  $("mensajeFinal").textContent = CONFIG.final;
  let k = 0;
  const id = setInterval(() => {
    explota(Math.random()*innerWidth, innerHeight*(.25 + Math.random()*.5), 14, true);
    if (++k > 14 || reduce) clearInterval(id);
  }, 180);
};

/* Música */
const audio = $("audio"), pl = $("player");
let pausadoPorUsuario = false;
function estado(){
  const on = !audio.paused;
  pl.classList.toggle("on", on);
  $("pIcon").textContent = on ? "❚❚" : "▶";
  $("pEstado").textContent = on ? "Sonando…" : "Pausado";
}
audio.addEventListener("play", estado); audio.addEventListener("pause", estado);
pl.addEventListener("click", e => {
  e.stopPropagation();
  if (audio.paused) { pausadoPorUsuario = false; audio.play().catch(()=>{}); }
  else { pausadoPorUsuario = true; audio.pause(); }
});
pl.addEventListener("pointerdown", e => e.stopPropagation());
addEventListener("pointerdown", () => { if (audio.paused && !pausadoPorUsuario) audio.play().catch(()=>{}); }, {once:true});
