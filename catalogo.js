/* ============================================================
   CATÁLOGO Y PRECIOS — LAKSMY
   ------------------------------------------------------------
   Este es el ÚNICO archivo que hay que tocar para:
     · actualizar el precio del oro y la plata
     · añadir, quitar o cambiar productos
     · marcar una pieza como recién llegada

   No hace falta tocar index.html para nada de eso.
   Después de editar: guardar y subir este archivo. Nada más.
   ============================================================ */

/* ------------------------------------------------------------
   1. PRECIO DEL METAL   ← revisar cada semana en kitco.com
   ------------------------------------------------------------
   Copia el precio de la ONZA que aparece en Kitco y ponlo aquí.
   La página divide sola entre 31,1035 para sacar el gramo.
   Cambia también la fecha: sale visible en el pie de la página. */
const ORO_ONZA   = 4341.30;   // dólares por onza troy de oro
const PLATA_ONZA = 63.46;     // dólares por onza troy de plata
const SPOT = { oro24_g: ORO_ONZA/31.1035, plata999_g: PLATA_ONZA/31.1035, fecha:"7 ago 2026" };

/* ------------------------------------------------------------
   2. MANO DE OBRA Y EXTRAS
   ------------------------------------------------------------ */
const OBRA  = { oro:45, plata:10 };            // dólares por gramo trabajado
/* El grabado interno va incluido en toda pieza que se fabrica: no suma.
   El precio de $12 del listado de servicios es para grabar una pieza que el
   cliente ya tiene, que es otro trabajo. */
const EXTRA = { rodio:20, engaste:25 };

/* ------------------------------------------------------------
   3. PRODUCTOS
   ------------------------------------------------------------
   Cada pieza se escribe así:

     {n:"Nombre visible", tipo:"anillo", g:4.5,
      acabado:"Cómo se ve",
      nuevo:true,                                  ← opcional
      img:"archivo.jpg", alt:"Descripción de la foto"}   ← opcional

   · n       nombre que ve el cliente
   · tipo    anillo · aro · cadena · pulsera · zarcillo · dije · grado
             (decide qué opciones salen al personalizar)
   · g       peso en gramos de la pieza (de ahí sale el precio)
   · nuevo   ponle  nuevo:true  y aparece en "Recién llegados"
             con su sello. Quítalo cuando deje de ser novedad.
   · img     nombre del archivo dentro de assets/img/
             SIN foto: no pongas img ni alt — sale la ficha, que
             se ve bien. Nunca pongas la foto de otra pieza.
   ------------------------------------------------------------ */

const GRADO = [
  {n:"Anillo de Grado Zafiro",   piedra:"azul",     tipo:"grado", g:9.5},
  {n:"Anillo de Grado Citrino",  piedra:"amarillo", tipo:"grado", g:9.5},
  {n:"Anillo de Grado Rubí",     piedra:"rojo",     tipo:"grado", g:10},
  {n:"Anillo de Grado Amatista", piedra:"morado",   tipo:"grado", g:8.5},
  {n:"Anillo de Grado Cuarzo",   piedra:"blanco",   tipo:"grado", g:8},
  {n:"Anillo de Grado Turmalina",piedra:"rosa",     tipo:"grado", g:8.5},
  {n:"Anillo de Grado Ópalo",    piedra:"blanco",   tipo:"grado", g:9},
  {n:"Anillo de Grado Esmeralda",piedra:"verde",    tipo:"grado", g:8.5},
  {n:"Anillo de Grado Granate",  piedra:"rojo",     tipo:"grado", g:10.5,
   img:"grado-oro-granate-09.jpg", alt:"Anillo de grado en oro 18k con piedra granate"},
  {n:"Anillo de Grado Lila",     piedra:"morado",   tipo:"grado", g:9}
];

const REGISTRO = {
  "Anillos":[
    {n:"Anillo Pavé Abierto", tipo:"anillo", g:4.5, acabado:"Pavé, pulido espejo"},
    {n:"Anillo Media Caña",   tipo:"anillo", g:4,   acabado:"Bruñido"},
    {n:"Anillo Sello Liso",   tipo:"anillo", g:6,   acabado:"Satinado, apto grabado", nuevo:true},
    {n:"Anillo Trenzado",     tipo:"anillo", g:5,   acabado:"Trenzado a mano"}
  ],
  "Aros de Boda":[
    {n:"Par Alianzas Trenzadas", tipo:"aro", g:9,  acabado:"Trenzado a mano", img:"aro-oro-trenzado-par-01.jpg", alt:"Par de alianzas de boda en oro 18k, trenzadas"},
    {n:"Par Alianzas Clásicas",  tipo:"aro", g:8,  acabado:"Media caña, pulido"},
    {n:"Par Alianzas Mate",      tipo:"aro", g:8.5,acabado:"Satinado mate"},
    {n:"Par Alianzas Delgadas",  tipo:"aro", g:6,  acabado:"Pulido espejo"}
  ],
  "Cadenas y Esclavas":[
    {n:"Cadena Eslabón Bruñido", tipo:"cadena", g:9,  acabado:"Bruñido"},
    {n:"Cadena Mariner Doble",   tipo:"cadena", g:11, acabado:"Mariner doble", img:"cadena-oro-mariner-doble-01.jpg",   alt:"Cadena en oro 18k, eslabón mariner doble"},
    {n:"Cadena Veneciana",       tipo:"cadena", g:7,  acabado:"Veneciana pulida"},
    {n:"Esclava Clásica",        tipo:"pulsera",g:13, acabado:"Pulido espejo"}
  ],
  "Pulseras":[
    {n:"Pulsera Cordón",  tipo:"pulsera", g:8,  acabado:"Tejido cordón"},
    {n:"Pulsera Eslabón", tipo:"pulsera", g:11, acabado:"Eslabón bruñido"},
    {n:"Pulsera Tejida",  tipo:"pulsera", g:9,  acabado:"Tejido plano"},
    {n:"Esclava Grabada", tipo:"pulsera", g:12, acabado:"Satinada, apta grabado"}
  ],
  "Zarcillos":[
    {n:"Zarcillo Aro",      tipo:"zarcillo", g:3,   acabado:"Aro pulido"},
    {n:"Zarcillo Botón",    tipo:"zarcillo", g:1.8, acabado:"Botón con circonia"},
    {n:"Zarcillo Candonga", tipo:"zarcillo", g:4,   acabado:"Bruñido"},
    {n:"Zarcillo Gota",     tipo:"zarcillo", g:2.5, acabado:"Colgante, engaste garra", nuevo:true}
  ],
  "Dijes":[
    {n:"Dije Osito",           tipo:"dije", g:2.5, acabado:"Relieve, pulido",   img:"dije-oro-osito-01.jpg",           alt:"Dije en oro 18k en forma de osito"},
    {n:"Dije Medallón Grecas", tipo:"dije", g:3.5, acabado:"Grecas cinceladas", img:"dije-oro-medallon-grecas-01.jpg", alt:"Dije en oro 18k, medallón con grecas"},
    {n:"Dije Corazón",         tipo:"dije", g:2,   acabado:"Liso, apto grabado"},
    {n:"Dije Placa",           tipo:"dije", g:3,   acabado:"Placa satinada"}
  ]
};
