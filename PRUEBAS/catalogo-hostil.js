/* TRAMPA 1 — catálogo hostil.
   Todo lo que una dueña puede escribir sin querer en catalogo.js: comillas,
   signos de menor que, HTML, emoji, nombres larguísimos y un intento de
   inyección por el atributo alt. */
const ORO_ONZA = 4341.30, PLATA_ONZA = 63.46;
const SPOT = { oro24_g: ORO_ONZA/31.1035, plata999_g: PLATA_ONZA/31.1035, fecha:'7 ago 2026 "hoy" <b>' };
const OBRA  = { oro:45, plata:10 };
const EXTRA = { rodio:20, engaste:25 };

const GRADO = [
  {n:'Anillo "Clásico" <Zafiro>', tipo:"grado", g:5.2, piedra:"azul", acabado:'Pulido & "brillante"'},
  {n:"Anillo <img src=x onerror=window.__XSS_NOMBRE=1>", tipo:"grado", g:4.8, piedra:"verde"},
  {n:"Anillo con foto trampa", tipo:"grado", g:4.8, piedra:"rojo",
   img:'x.jpg" onerror="window.__XSS_IMG=1', alt:'foto" onload="window.__XSS_ALT=1'},
  {n:"Anillo Ñandú · 18k — «cursivas» y emoji 💍✨", tipo:"grado", g:5.0, piedra:"morado"},
  {n:"A".repeat(400), tipo:"grado", g:5.0, piedra:"rosa"},
  {n:"", tipo:"grado", g:5.0, piedra:"amarillo"},
  {n:"Anillo sin gramos", tipo:"grado", piedra:"blanco"}
];

const REGISTRO = {
  "Aros de boda":[{n:'Aro & "Trenzado"', tipo:"aro", g:8.4, acabado:"Trenzado"}],
  "Cadenas":[{n:"Cadena con <script>window.__XSS_CAT=1</script>", tipo:"cadena", g:12}],
  "Pulseras":[],
  "Zarcillos":[{n:"Zarcillo precio raro", tipo:"zarcillo", g:NaN}],
  "Dijes":[{n:"Dije gramos negativos", tipo:"dije", g:-5}],
  "Anillos":[{n:"Anillo infinito", tipo:"anillo", g:Infinity}]
};
