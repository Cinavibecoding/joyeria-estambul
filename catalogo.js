/* ============================================================
   CATÁLOGO Y PRECIOS — JOYERÍA ESTAMBUL
   ------------------------------------------------------------
   Este es el ÚNICO archivo que hay que tocar para:
     · actualizar el precio del oro y la plata
     · añadir, quitar o cambiar productos
     · marcar una pieza como recién llegada, única o de stock

   No hace falta tocar index.html para nada de eso.
   Después de editar: guardar y subir este archivo. Nada más.

   ATENCIÓN — este catálogo se generó de la sesión de fotos del 24 de
   agosto de 2026. Falta confirmar tres cosas antes de publicar:
     1. El PESO EN GRAMOS de cada pieza. Los de aquí son estimados por
        tipo, no medidos. Por eso todas las piezas llevan `consultar:true`
        y la página muestra "Consultar" en vez de un precio inventado.
     2. El COLOR de la piedra: se leyó de la foto, no del inventario.
     3. El NOMBRE real de cada modelo y la carrera que lleva grabada.
   ============================================================ */

/* ------------------------------------------------------------
   1. PRECIO DEL METAL   ← revisar cada semana en kitco.com
   ------------------------------------------------------------ */
const ORO_ONZA   = 4341.30;   // dólares por onza troy de oro
const PLATA_ONZA = 63.46;     // dólares por onza troy de plata
const SPOT = { oro24_g: ORO_ONZA/31.1035, plata999_g: PLATA_ONZA/31.1035, fecha:"7 ago 2026" };

/* ------------------------------------------------------------
   2. MANO DE OBRA Y EXTRAS
   ------------------------------------------------------------ */
const OBRA  = { oro:45, plata:10 };            // dólares por gramo trabajado
const EXTRA = { rodio:20, engaste:25 };

/* ------------------------------------------------------------
   3. MEDIDAS
   ------------------------------------------------------------
   El número (4x3, 6x8, 10x12...) son MILÍMETROS: ancho por largo.
   En un anillo o un zarcillo es el tamaño de la piedra; en una cadena,
   el tamaño del eslabón. Es como se vende aquí: no por gramo, sino por
   medida — y la medida arrastra el peso.

   Si añades una medida nueva, añádela también aquí para que salga en el
   apartado que se lo explica al cliente. */
/* ------------------------------------------------------------
   ESTILO DEL ANILLO DE GRADO
   ------------------------------------------------------------
   Dos familias, y el cliente escoge por ahí antes que por nada más:

     clasico  el de siempre: macizo, sello ancho, piedra grande y
              grabado profundo. Es el que compró su mamá.
     moderno  más fino, con orla de circonitas alrededor de la piedra
              y formas más estilizadas. Es lo que se lleva ahora.

   ATENCIÓN: el estilo de cada pieza está puesto por una estimación
   automática (cuenta los destellos de circonita en la foto) y NO es de
   fiar: la separación entre los dos grupos no es limpia. Hay que
   revisarlo pieza por pieza y corregir a mano el campo `estilo`.
   ------------------------------------------------------------ */
const ESTILOS = [
  {id:"clasico", nombre:"Clásicos", nota:"Macizo, sello ancho, piedra grande."},
  {id:"moderno", nombre:"Modernos", nota:"Más fino, con circonitas alrededor."}
];

/* MEDIDAS — milímetros de la piedra (anillos/zarcillos) o del eslabón (cadenas).
   4x3 NO aplica para anillos de grado (no existen en ese tamaño).
   En todo lo demás (zarcillos, cadenas, pulseras, esclavas) sí existe 4x3.
   Anillos de grado empiezan desde 6x4. */
const MEDIDAS = [
  {id:"4x3",   mm:[4,3],   nombre:"Discreta",  nota:"La más pequeña. No disponible en anillos de grado."},
  {id:"6x4",   mm:[6,4],   nombre:"Menuda",    nota:"Pequeña pero visible. La entrada en anillos."},
  {id:"6x8",   mm:[6,8],   nombre:"Clásica",   nota:"La medida más pedida."},
  {id:"10x8",  mm:[10,8],  nombre:"Amplia",    nota:"Se ve de lejos."},
  {id:"10x12", mm:[10,12], nombre:"Grande",    nota:"La de mayor presencia."}
];

/* ------------------------------------------------------------
   TEJIDOS DE CADENA
   ------------------------------------------------------------
   Cada cadena se puede fabricar en distintos tipos de tejido
   (entrelazado). El eslabón marino es el más común.

   NOTA LEGAL: los nombres "Gucci" y "Rolex" son marcas registradas.
   NOTA LEGAL: los nombres "Gucci", "Rolex", "Cartier", "Chanel" son marcas
   registradas. Se usan aquí como referencia del tipo de eslabón porque es
   la jerga que maneja el gremio, pero en la página pública se usarán
   nombres genéricos en cuanto se confirmen los definitivos.
   Por ahora se muestran así para que la dueña vea cómo queda.
   ------------------------------------------------------------ */
const TEJIDOS = [
  {id:"gucci",        nombre:"Tipo Gucci",
   nota:"Eslabones ovalados entrelazados. Se puede hacer en todas las medidas.",
   medidas:["4x3","6x4","6x8","10x8","10x12"]},
  {id:"rolex",        nombre:"Tipo Rolex",
   nota:"Eslabón plano y macizo. Presencia elegante.",
   medidas:["6x8","10x8","10x12"]},
  {id:"liso",         nombre:"Eslabón liso",
   nota:"Cadena lisa y pulida. Minimalista y versátil.",
   medidas:["4x3","6x4","6x8"]},
];

/* ------------------------------------------------------------
   LARGOS DE CADENA
   ------------------------------------------------------------
   Todas las cadenas se fabrican desde 45 cm en adelante.
   El largo estándar es 50 cm (gargantilla). */
const LARGOS_CADENA = [
  {id:"45", cm:45, nombre:"45 cm", nota:"Pegada al cuello."},
  {id:"50", cm:50, nombre:"50 cm", nota:"Largo estándar, la más pedida."},
  {id:"55", cm:55, nombre:"55 cm", nota:"Holgada."},
  {id:"60", cm:60, nombre:"60 cm", nota:"Por debajo del pecho."},
];

/* ------------------------------------------------------------
   PRECIOS FIJOS DE ANILLOS DE GRADO
   ------------------------------------------------------------
   Los anillos de grado se venden POR PIEZA, no por gramo: el molde
   ya existe y la hechura se cobra fija. El precio base es en plata
   Ley 950 y sube ~$20–25 por medida.

   Para oro: se calcula automáticamente tomando el precio en plata,
   restándole el costo del metal plata y sumándole el del oro al
   quilate elegido. Así el precio de oro sale proporcional sin tener
   que poner cada cifra a mano.

   ESTOS PRECIOS SON LOS REALES — confirmados por la dueña.
   ------------------------------------------------------------ */
/* Precios confirmados 8 sep 2026 por la dueña.
   Precio BASE en plata Ley 950 con la piedra más pequeña.
   Conforme agranda la piedra, sube el precio — consultar por WhatsApp.
   Clásicos desde $100 plata, modernos desde $120 plata. */
const PRECIOS_GRADO = {
  clasico: { "6x4": 100, "6x8": 120, "10x8": 150, "10x12": 180 },
  moderno: { "6x4": 120, "6x8": 140, "10x8": 170, "10x12": 200 }
};

/* ------------------------------------------------------------
   4. PRODUCTOS
   ------------------------------------------------------------
   Cada pieza se escribe así:

     {n:"Nombre visible", tipo:"anillo", g:4.5,
      medida:"6x8",          ← tamaño de piedra o eslabón (opcional)
      consultar:true,        ← muestra "Consultar" en vez de precio
      unica:true,            ← pieza única, no se repite
      stock:true,            ← stock limitado
      nuevo:true,            ← recién llegada
      img:"piezas/archivo.jpg", alt:"Descripción de la foto"}

   · tipo    anillo · aro · cadena · pulsera · zarcillo · dije · grado
   · g       peso en gramos (de ahí sale el precio si no lleva consultar)
   ------------------------------------------------------------ */

const GRADO = [
  {n:"Anillo de Grado Amatista 01", tipo:"grado", g:6.5, piedra:"morado", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-013-2.jpg", "piezas/gal/grado-013-3.jpg"], img:"piezas/grado-013.jpg", alt:"Anillo de Grado Amatista 01, foto del taller"},
  {n:"Anillo de Grado Aguamarina 01", tipo:"grado", g:6.5, piedra:"celeste", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-014-2.jpg", "piezas/gal/grado-014-3.jpg"], img:"piezas/grado-014.jpg", alt:"Anillo de Grado Aguamarina 01, foto del taller"},
  {n:"Anillo de Grado · Queseras del Medio 1987", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", grabado:"Queseras del Medio 1987", institucion:"Academia Militar", consultar:true,
   mas:["piezas/gal/grado-015-2.jpg", "piezas/gal/grado-015-3.jpg"], img:"piezas/grado-015.jpg", alt:"Anillo de Grado · Queseras del Medio 1987, foto del taller"},
  {n:"Anillo de Grado Granate 02", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-016-2.jpg", "piezas/gal/grado-016-3.jpg"], img:"piezas/grado-016.jpg", alt:"Anillo de Grado Granate 02, foto del taller"},
  {n:"Anillo de Grado Aguamarina 02", tipo:"grado", g:6.5, piedra:"celeste", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-017-2.jpg", "piezas/gal/grado-017-3.jpg"], img:"piezas/grado-017.jpg", alt:"Anillo de Grado Aguamarina 02, foto del taller"},
  {n:"Anillo de Grado · Policía Nacional Bolivariana", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", grabado:"Policía Nacional Bolivariana", institucion:"PNB", consultar:true,
   mas:["piezas/gal/grado-018-2.jpg", "piezas/gal/grado-018-3.jpg"], img:"piezas/grado-018.jpg", alt:"Anillo de Grado · Policía Nacional Bolivariana, foto del taller"},
  {n:"Anillo de Grado · Médico Cirujano", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"clasico", grabado:"Médico Cirujano", consultar:true,
   mas:["piezas/gal/grado-019-2.jpg", "piezas/gal/grado-019-3.jpg"], img:"piezas/grado-019.jpg", alt:"Anillo de Grado · Médico Cirujano, foto del taller"},
  {n:"Anillo de Grado · Médico Cirujano", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"clasico", grabado:"Médico Cirujano", consultar:true,
   mas:["piezas/gal/grado-020-2.jpg", "piezas/gal/grado-020-3.jpg"], img:"piezas/grado-020.jpg", alt:"Anillo de Grado · Médico Cirujano, foto del taller"},
  {n:"Anillo de Grado Amatista 02", tipo:"grado", g:6.5, piedra:"morado", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-021-2.jpg", "piezas/gal/grado-021-3.jpg"], img:"piezas/grado-021.jpg", alt:"Anillo de Grado Amatista 02, foto del taller"},
  {n:"Anillo de Grado Cuarzo 01", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-022-2.jpg", "piezas/gal/grado-022-3.jpg"], img:"piezas/grado-022.jpg", alt:"Anillo de Grado Cuarzo 01, foto del taller"},
  {n:"Anillo de Grado Cuarzo 02", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-023-2.jpg", "piezas/gal/grado-023-3.jpg"], img:"piezas/grado-023.jpg", alt:"Anillo de Grado Cuarzo 02, foto del taller"},
  {n:"Anillo de Grado Granate 03", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-024-2.jpg", "piezas/gal/grado-024-3.jpg"], img:"piezas/grado-024.jpg", alt:"Anillo de Grado Granate 03, foto del taller"},
  {n:"Anillo de Grado Granate 04", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-025-2.jpg", "piezas/gal/grado-025-3.jpg"], img:"piezas/grado-025.jpg", alt:"Anillo de Grado Granate 04, foto del taller"},
  {n:"Anillo de Grado Citrino 03", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-026-2.jpg", "piezas/gal/grado-026-3.jpg"], img:"piezas/grado-026.jpg", alt:"Anillo de Grado Citrino 03, foto del taller"},
  {n:"Anillo de Grado Zafiro 02", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-027-2.jpg", "piezas/gal/grado-027-3.jpg"], img:"piezas/grado-027.jpg", alt:"Anillo de Grado Zafiro 02, foto del taller"},
  {n:"Anillo de Grado Zafiro 03", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-028-2.jpg", "piezas/gal/grado-028-3.jpg"], img:"piezas/grado-028.jpg", alt:"Anillo de Grado Zafiro 03, foto del taller"},
  {n:"Anillo de Grado Granate 05", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-029-2.jpg", "piezas/gal/grado-029-3.jpg"], img:"piezas/grado-029.jpg", alt:"Anillo de Grado Granate 05, foto del taller"},
  {n:"Anillo de Grado Citrino 04", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-030-2.jpg", "piezas/gal/grado-030-3.jpg"], img:"piezas/grado-030.jpg", alt:"Anillo de Grado Citrino 04, foto del taller"},
  {n:"Anillo de Grado · Policía Nacional Bolivariana", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", grabado:"Policía Nacional Bolivariana", institucion:"PNB", consultar:true,
   mas:["piezas/gal/grado-031-2.jpg", "piezas/gal/grado-031-3.jpg"], img:"piezas/grado-031.jpg", alt:"Anillo de Grado · Policía Nacional Bolivariana, foto del taller"},
  {n:"Anillo de Grado · Médico Cirujano", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"moderno", grabado:"Médico Cirujano", consultar:true,
   mas:["piezas/gal/grado-032-2.jpg", "piezas/gal/grado-032-3.jpg"], img:"piezas/grado-032.jpg", alt:"Anillo de Grado · Médico Cirujano, foto del taller"},
  {n:"Anillo de Grado Citrino 06", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"moderno", tipo_joya:true, consultar:true,
   mas:["piezas/gal/grado-033-2.jpg", "piezas/gal/grado-033-3.jpg"], img:"piezas/grado-033.jpg", alt:"Anillo de Grado Citrino 06, foto del taller"},
  {n:"Anillo de Grado · Psiquiatra", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"moderno", grabado:"Psiquiatra", consultar:true,
   mas:["piezas/gal/grado-034-2.jpg", "piezas/gal/grado-034-3.jpg"], img:"piezas/grado-034.jpg", alt:"Anillo de Grado · Psiquiatra, foto del taller"},
  {n:"Anillo de Grado Zafiro 05", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-035-2.jpg", "piezas/gal/grado-035-3.jpg"], img:"piezas/grado-035.jpg", alt:"Anillo de Grado Zafiro 05, foto del taller"},
  {n:"Anillo de Grado Zafiro 06", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-036-2.jpg", "piezas/gal/grado-036-3.jpg"], img:"piezas/grado-036.jpg", alt:"Anillo de Grado Zafiro 06, foto del taller"},
  {n:"Anillo de Grado Citrino 08", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-037-2.jpg", "piezas/gal/grado-037-3.jpg"], img:"piezas/grado-037.jpg", alt:"Anillo de Grado Citrino 08, foto del taller"},
  {n:"Anillo de Grado · T.S.U. Informática", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", grabado:"T.S.U. Informática", consultar:true,
   mas:["piezas/gal/grado-038-2.jpg", "piezas/gal/grado-038-3.jpg"], img:"piezas/grado-038.jpg", alt:"Anillo de Grado · T.S.U. Informática, foto del taller"},
  {n:"Anillo de Grado · Lic. Administración", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", grabado:"Lic. Administración", consultar:true,
   mas:["piezas/gal/grado-039-2.jpg", "piezas/gal/grado-039-3.jpg"], img:"piezas/grado-039.jpg", alt:"Anillo de Grado · Lic. Administración, foto del taller"},
  {n:"Anillo de Grado Granate 08", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-040-2.jpg", "piezas/gal/grado-040-3.jpg"], img:"piezas/grado-040.jpg", alt:"Anillo de Grado Granate 08, foto del taller"},
  {n:"Anillo de Grado Aguamarina 03", tipo:"grado", g:6.5, piedra:"celeste", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-041-2.jpg", "piezas/gal/grado-041-3.jpg"], img:"piezas/grado-041.jpg", alt:"Anillo de Grado Aguamarina 03, foto del taller"},
  {n:"Anillo de Grado Granate 09", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-042-2.jpg", "piezas/gal/grado-042-3.jpg"], img:"piezas/grado-042.jpg", alt:"Anillo de Grado Granate 09, foto del taller"},
  {n:"Anillo de Grado Granate 10", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", tipo_joya:true, consultar:true,
   mas:["piezas/gal/grado-043-2.jpg", "piezas/gal/grado-043-3.jpg"], img:"piezas/grado-043.jpg", alt:"Anillo de Grado Granate 10, foto del taller"},
  {n:"Anillo de Grado Amatista 03", tipo:"grado", g:6.5, piedra:"morado", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-044-2.jpg", "piezas/gal/grado-044-3.jpg"], img:"piezas/grado-044.jpg", alt:"Anillo de Grado Amatista 03, foto del taller"},
  {n:"Anillo de Grado Turmalina 01", tipo:"grado", g:6.5, piedra:"rosa", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-045-2.jpg", "piezas/gal/grado-045-3.jpg"], img:"piezas/grado-045.jpg", alt:"Anillo de Grado Turmalina 01, foto del taller"},
  {n:"Anillo de Grado Granate 11", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", tipo_joya:true, consultar:true,
   mas:["piezas/gal/grado-046-2.jpg", "piezas/gal/grado-046-3.jpg"], img:"piezas/grado-046.jpg", alt:"Anillo de Grado Granate 11, foto del taller"},
  {n:"Anillo de Grado Granate 12", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", tipo_joya:true, consultar:true,
   mas:["piezas/gal/grado-047-2.jpg", "piezas/gal/grado-047-3.jpg"], img:"piezas/grado-047.jpg", alt:"Anillo de Grado Granate 12, foto del taller"},
  {n:"Anillo de Grado Zafiro 07", tipo:"grado", g:6.5, piedra:"azul", estilo:"moderno", tipo_joya:true, consultar:true,
   mas:["piezas/gal/grado-048-2.jpg", "piezas/gal/grado-048-3.jpg"], img:"piezas/grado-048.jpg", alt:"Anillo de Grado Zafiro 07, foto del taller"},
  {n:"Anillo de Grado · Diseño Gráfico", tipo:"grado", g:6.5, piedra:"celeste", estilo:"clasico", grabado:"Diseño Gráfico", consultar:true,
   mas:["piezas/gal/grado-049-2.jpg", "piezas/gal/grado-049-3.jpg"], img:"piezas/grado-049.jpg", alt:"Anillo de Grado · Diseño Gráfico, foto del taller"},
  {n:"Anillo de Grado Zafiro 08", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-050-2.jpg", "piezas/gal/grado-050-3.jpg"], img:"piezas/grado-050.jpg", alt:"Anillo de Grado Zafiro 08, foto del taller"},
  {n:"Anillo de Grado · Abogado", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", grabado:"Abogado", consultar:true,
   mas:["piezas/gal/grado-051-2.jpg", "piezas/gal/grado-051-3.jpg"], img:"piezas/grado-051.jpg", alt:"Anillo de Grado · Abogado, foto del taller"},
  {n:"Anillo de Grado · Lic. Relaciones Industriales", tipo:"grado", g:6.5, piedra:"azul", estilo:"moderno", tipo_joya:true, grabado:"Lic. Relaciones Industriales", consultar:true,
   mas:["piezas/gal/grado-052-2.jpg", "piezas/gal/grado-052-3.jpg"], img:"piezas/grado-052.jpg", alt:"Anillo de Grado · Lic. Relaciones Industriales, foto del taller"},
  {n:"Anillo de Grado · T.S.U. Publicidad y Mercadeo", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", tipo_joya:true, grabado:"T.S.U. Publicidad y Mercadeo", consultar:true,
   mas:["piezas/gal/grado-053-2.jpg", "piezas/gal/grado-053-3.jpg"], img:"piezas/grado-053.jpg", alt:"Anillo de Grado · T.S.U. Publicidad y Mercadeo, foto del taller"},
  {n:"Anillo de Grado Citrino 09", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-054-2.jpg", "piezas/gal/grado-054-3.jpg"], img:"piezas/grado-054.jpg", alt:"Anillo de Grado Citrino 09, foto del taller"},
  {n:"Anillo de Grado Granate 15", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", tipo_joya:true, consultar:true,
   mas:["piezas/gal/grado-055-2.jpg", "piezas/gal/grado-055-3.jpg"], img:"piezas/grado-055.jpg", alt:"Anillo de Grado Granate 15, foto del taller"},
  {n:"Anillo de Grado Zafiro 10", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-056-2.jpg", "piezas/gal/grado-056-3.jpg"], img:"piezas/grado-056.jpg", alt:"Anillo de Grado Zafiro 10, foto del taller"},
  {n:"Anillo de Grado · Administración", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", tipo_joya:true, grabado:"Administración", consultar:true,
   mas:["piezas/gal/grado-057-2.jpg", "piezas/gal/grado-057-3.jpg"], img:"piezas/grado-057.jpg", alt:"Anillo de Grado · Administración, foto del taller"},
  {n:"Anillo de Grado Zafiro 11", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", tipo_joya:true, consultar:true,
   mas:["piezas/gal/grado-058-2.jpg", "piezas/gal/grado-058-3.jpg"], img:"piezas/grado-058.jpg", alt:"Anillo de Grado Zafiro 11, foto del taller"},
  {n:"Anillo de Grado Citrino 10", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-059-2.jpg", "piezas/gal/grado-059-3.jpg"], img:"piezas/grado-059.jpg", alt:"Anillo de Grado Citrino 10, foto del taller"},
  {n:"Anillo de Grado Aguamarina 05", tipo:"grado", g:6.5, piedra:"celeste", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-060-2.jpg", "piezas/gal/grado-060-3.jpg"], img:"piezas/grado-060.jpg", alt:"Anillo de Grado Aguamarina 05, foto del taller"},
  {n:"Anillo de Grado Granate 17", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", tipo_joya:true, consultar:true,
   mas:["piezas/gal/grado-061-2.jpg", "piezas/gal/grado-061-3.jpg"], img:"piezas/grado-061.jpg", alt:"Anillo de Grado Granate 17, foto del taller"},
  {n:"Anillo de Grado Citrino 11", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-062-2.jpg", "piezas/gal/grado-062-3.jpg"], img:"piezas/grado-062.jpg", alt:"Anillo de Grado Citrino 11, foto del taller"},
  {n:"Anillo de Grado Granate 18", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", tipo_joya:true, consultar:true,
   mas:["piezas/gal/grado-063-2.jpg", "piezas/gal/grado-063-3.jpg"], img:"piezas/grado-063.jpg", alt:"Anillo de Grado Granate 18, foto del taller"},
  {n:"Anillo de Grado Cuarzo 03", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-096-2.jpg", "piezas/gal/grado-096-3.jpg"], img:"piezas/grado-096.jpg", alt:"Anillo de Grado Cuarzo 03, foto del taller"},
  {n:"Anillo de Grado Citrino 12", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"moderno", tipo_joya:true, consultar:true,
   mas:["piezas/gal/grado-099-2.jpg","piezas/gal/grado-100.jpg"], img:"piezas/grado-099.jpg", alt:"Anillo de Grado Citrino 12, foto del taller"},
  {n:"Anillo de Grado Cuarzo 04", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-110-2.jpg", "piezas/gal/grado-110-3.jpg"], img:"piezas/grado-110.jpg", alt:"Anillo de Grado Cuarzo 04, foto del taller"},
  {n:"Anillo de Grado Cuarzo 05", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-111-2.jpg", "piezas/gal/grado-111-3.jpg"], img:"piezas/grado-111.jpg", alt:"Anillo de Grado Cuarzo 05, foto del taller"},
  {n:"Anillo de Grado Cuarzo 06", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-112-2.jpg", "piezas/gal/grado-112-3.jpg"], img:"piezas/grado-112.jpg", alt:"Anillo de Grado Cuarzo 06, foto del taller"},
  {n:"Anillo de Grado Cuarzo 07", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-113-2.jpg", "piezas/gal/grado-113-3.jpg"], img:"piezas/grado-113.jpg", alt:"Anillo de Grado Cuarzo 07, foto del taller"},
  {n:"Anillo de Grado Cuarzo 08", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-114-2.jpg", "piezas/gal/grado-114-3.jpg"], img:"piezas/grado-114.jpg", alt:"Anillo de Grado Cuarzo 08, foto del taller"},
  {n:"Anillo de Grado Cuarzo 09", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-115-2.jpg", "piezas/gal/grado-115-3.jpg"], img:"piezas/grado-115.jpg", alt:"Anillo de Grado Cuarzo 09, foto del taller"},
  {n:"Anillo de Grado Cuarzo 10", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-116-2.jpg", "piezas/gal/grado-116-3.jpg"], img:"piezas/grado-116.jpg", alt:"Anillo de Grado Cuarzo 10, foto del taller"},
  {n:"Anillo de Grado Cuarzo 11", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-117-2.jpg", "piezas/gal/grado-117-3.jpg"], img:"piezas/grado-117.jpg", alt:"Anillo de Grado Cuarzo 11, foto del taller"},
  {n:"Anillo de Grado Citrino 14", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-118-2.jpg", "piezas/gal/grado-118-3.jpg"], img:"piezas/grado-118.jpg", alt:"Anillo de Grado Citrino 14, foto del taller"},
  {n:"Anillo de Grado · Abogado", tipo:"grado", g:6.5, piedra:"rosa", estilo:"clasico", grabado:"Abogado", consultar:true,
   mas:["piezas/gal/grado-119-2.jpg", "piezas/gal/grado-119-3.jpg"], img:"piezas/grado-119.jpg", alt:"Anillo de Grado · Abogado, foto del taller"},
  {n:"Anillo de Grado Amatista 04", tipo:"grado", g:6.5, piedra:"morado", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-120-2.jpg", "piezas/gal/grado-120-3.jpg"], img:"piezas/grado-120.jpg", alt:"Anillo de Grado Amatista 04, foto del taller"},
  {n:"Anillo de Grado · T.S.U. Administración de Aduanas", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", grabado:"T.S.U. Administración de Aduanas", institucion:"CUAM", consultar:true,
   mas:["piezas/gal/grado-121-2.jpg", "piezas/gal/grado-121-3.jpg"], img:"piezas/grado-121.jpg", alt:"Anillo de Grado · T.S.U. Administración de Aduanas, foto del taller"},
  {n:"Anillo de Grado · Ingeniería de Sistemas", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", grabado:"Ingeniería de Sistemas", consultar:true,
   mas:["piezas/gal/grado-122-2.jpg", "piezas/gal/grado-122-3.jpg"], img:"piezas/grado-122.jpg", alt:"Anillo de Grado · Ingeniería de Sistemas, foto del taller"},
  {n:"Anillo de Grado · Abogado", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", grabado:"Abogado", consultar:true,
   mas:["piezas/gal/grado-123-2.jpg", "piezas/gal/grado-123-3.jpg"], img:"piezas/grado-123.jpg", alt:"Anillo de Grado · Abogado, foto del taller"},
  {n:"Anillo de Grado · Contador Público", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", grabado:"Contador Público", consultar:true,
   mas:["piezas/gal/grado-124-2.jpg", "piezas/gal/grado-124-3.jpg"], img:"piezas/grado-124.jpg", alt:"Anillo de Grado · Contador Público, foto del taller"},
  {n:"Anillo de Grado · Criminalística", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", grabado:"Criminalística", institucion:"CICPC", consultar:true,
   mas:["piezas/gal/grado-125-2.jpg", "piezas/gal/grado-125-3.jpg"], img:"piezas/grado-125.jpg", alt:"Anillo de Grado · Criminalística, foto del taller"},
  {n:"Anillo de Grado · Abogado", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", grabado:"Abogado", consultar:true,
   mas:["piezas/gal/grado-126-2.jpg", "piezas/gal/grado-126-3.jpg"], img:"piezas/grado-126.jpg", alt:"Anillo de Grado · Abogado, foto del taller"},
  {n:"Anillo de Grado Aguamarina 06", tipo:"grado", g:6.5, piedra:"celeste", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-127-2.jpg", "piezas/gal/grado-127-3.jpg"], img:"piezas/grado-127.jpg", alt:"Anillo de Grado Aguamarina 06, foto del taller"},
  {n:"Anillo de Grado Granate 22", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-128-2.jpg", "piezas/gal/grado-128-3.jpg"], img:"piezas/grado-128.jpg", alt:"Anillo de Grado Granate 22, foto del taller"},
  {n:"Anillo de Grado Zafiro 14", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-129-2.jpg", "piezas/gal/grado-129-3.jpg"], img:"piezas/grado-129.jpg", alt:"Anillo de Grado Zafiro 14, foto del taller"},
  {n:"Anillo de Grado Amatista 05", tipo:"grado", g:6.5, piedra:"morado", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-130-2.jpg", "piezas/gal/grado-130-3.jpg"], img:"piezas/grado-130.jpg", alt:"Anillo de Grado Amatista 05, foto del taller"},
  {n:"Anillo de Grado Granate 23", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-131-2.jpg", "piezas/gal/grado-131-3.jpg"], img:"piezas/grado-131.jpg", alt:"Anillo de Grado Granate 23, foto del taller"},
  {n:"Anillo de Grado Aguamarina 07", tipo:"grado", g:6.5, piedra:"celeste", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-132-2.jpg", "piezas/gal/grado-132-3.jpg"], img:"piezas/grado-132.jpg", alt:"Anillo de Grado Aguamarina 07, foto del taller"},
  {n:"Anillo de Grado Granate 24", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-133-2.jpg", "piezas/gal/grado-133-3.jpg"], img:"piezas/grado-133.jpg", alt:"Anillo de Grado Granate 24, foto del taller"},
  {n:"Anillo de Grado Citrino 15", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-134-2.jpg", "piezas/gal/grado-134-3.jpg"], img:"piezas/grado-134.jpg", alt:"Anillo de Grado Citrino 15, foto del taller"},
  {n:"Anillo de Grado Cuarzo 13", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-135-2.jpg", "piezas/gal/grado-135-3.jpg"], img:"piezas/grado-135.jpg", alt:"Anillo de Grado Cuarzo 13, foto del taller"},
  {n:"Anillo de Grado Granate 25", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-136-2.jpg", "piezas/gal/grado-136-3.jpg"], img:"piezas/grado-136.jpg", alt:"Anillo de Grado Granate 25, foto del taller"},
  {n:"Anillo de Grado Cuarzo 14", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-137-2.jpg", "piezas/gal/grado-137-3.jpg"], img:"piezas/grado-137.jpg", alt:"Anillo de Grado Cuarzo 14, foto del taller"},
  {n:"Anillo de Grado Zafiro 15", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", consultar:true,
   img:"piezas/grado-138.jpg", alt:"Anillo de Grado Zafiro 15, foto del taller"},
  {n:"Anillo de Grado Zafiro 16", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-139-2.jpg", "piezas/gal/grado-139-3.jpg"], img:"piezas/grado-139.jpg", alt:"Anillo de Grado Zafiro 16, foto del taller"},
  {n:"Anillo de Grado Cuarzo 15", tipo:"grado", g:6.5, piedra:"blanco", estilo:"moderno", tipo_joya:true, consultar:true,
   mas:["piezas/gal/grado-140-2.jpg", "piezas/gal/grado-140-3.jpg"], img:"piezas/grado-140.jpg", alt:"Anillo de Grado Cuarzo 15, foto del taller"},
  {n:"Anillo de Grado Granate 26", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-141-2.jpg", "piezas/gal/grado-141-3.jpg"], img:"piezas/grado-141.jpg", alt:"Anillo de Grado Granate 26, foto del taller"},
  {n:"Anillo de Grado Cuarzo 16", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-142-2.jpg", "piezas/gal/grado-142-3.jpg"], img:"piezas/grado-142.jpg", alt:"Anillo de Grado Cuarzo 16, foto del taller"},
  {n:"Anillo de Grado Granate 27", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   img:"piezas/grado-143.jpg", alt:"Anillo de Grado Granate 27, foto del taller"},
  {n:"Anillo de Grado Granate 28", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-144-2.jpg", "piezas/gal/grado-144-3.jpg"], img:"piezas/grado-144.jpg", alt:"Anillo de Grado Granate 28, foto del taller"},
  {n:"Anillo de Grado Zafiro 17", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-145-2.jpg", "piezas/gal/grado-145-3.jpg"], img:"piezas/grado-145.jpg", alt:"Anillo de Grado Zafiro 17, foto del taller"},
  {n:"Anillo de Grado Amatista 06", tipo:"grado", g:6.5, piedra:"morado", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-146-2.jpg", "piezas/gal/grado-146-3.jpg"], img:"piezas/grado-146.jpg", alt:"Anillo de Grado Amatista 06, foto del taller"},
  {n:"Anillo de Grado Amatista 07", tipo:"grado", g:6.5, piedra:"morado", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-147-2.jpg", "piezas/gal/grado-147-3.jpg"], img:"piezas/grado-147.jpg", alt:"Anillo de Grado Amatista 07, foto del taller"},
  {n:"Anillo de Grado Esmeralda 01", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-148-2.jpg", "piezas/gal/grado-148-3.jpg"], img:"piezas/grado-148.jpg", alt:"Anillo de Grado Esmeralda 01, foto del taller"},
  {n:"Anillo de Grado Granate 29", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-149-2.jpg", "piezas/gal/grado-149-3.jpg"], img:"piezas/grado-149.jpg", alt:"Anillo de Grado Granate 29, foto del taller"},
  {n:"Anillo de Grado Granate 30", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-150-2.jpg", "piezas/gal/grado-150-3.jpg"], img:"piezas/grado-150.jpg", alt:"Anillo de Grado Granate 30, foto del taller"},
  {n:"Anillo de Grado Granate 31", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", tipo_joya:true, consultar:true,
   mas:["piezas/gal/grado-151-2.jpg", "piezas/gal/grado-151-3.jpg"], img:"piezas/grado-151.jpg", alt:"Anillo de Grado Granate 31, foto del taller"},
  {n:"Anillo de Grado Esmeralda 02", tipo:"grado", g:6.5, piedra:"verde", estilo:"moderno", tipo_joya:true, consultar:true,
   mas:["piezas/gal/grado-152-2.jpg", "piezas/gal/grado-152-3.jpg"], img:"piezas/grado-152.jpg", alt:"Anillo de Grado Esmeralda 02, foto del taller"},
  {n:"Anillo de Grado Granate 32", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", tipo_joya:true, consultar:true,
   mas:["piezas/gal/grado-153-2.jpg", "piezas/gal/grado-153-3.jpg"], img:"piezas/grado-153.jpg", alt:"Anillo de Grado Granate 32, foto del taller"},

  /* ── Anillos migrados de Registro (todos son de grado) ───────
     La medida está puesta en 6×8 por defecto. Confirmar cuáles
     son 10×8 o 10×12 y corregir el campo `medida`.
     El campo `estilo` falta: clasificar a mano. ──────────────── */
  {n:"Anillo de Grado Citrino 16", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"amarillo", consultar:true,
   mas:["piezas/gal/anillo-064-2.jpg", "piezas/gal/anillo-064-3.jpg"], img:"piezas/anillo-064.jpg", alt:"Anillo de Grado Citrino 16, foto del taller"},
  {n:"Anillo de Grado Esmeralda 03", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"blanco", consultar:true,
   mas:["piezas/gal/anillo-065-2.jpg", "piezas/gal/anillo-065-3.jpg"], img:"piezas/anillo-065.jpg", alt:"Anillo de Grado Esmeralda 03, foto del taller"},
  {n:"Anillo de Grado Aguamarina 08", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"celeste", consultar:true,
   mas:["piezas/gal/anillo-066-2.jpg", "piezas/gal/anillo-066-3.jpg"], img:"piezas/anillo-066.jpg", alt:"Anillo de Grado Aguamarina 08, foto del taller"},
  {n:"Anillo de Grado Granate 33", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"rojo", consultar:true,
   mas:["piezas/gal/anillo-067-2.jpg", "piezas/gal/anillo-067-3.jpg"], img:"piezas/anillo-067.jpg", alt:"Anillo de Grado Granate 33, foto del taller"},
  {n:"Anillo de Grado Citrino 17", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"amarillo", consultar:true,
   mas:["piezas/gal/anillo-068-2.jpg", "piezas/gal/anillo-068-3.jpg"], img:"piezas/anillo-068.jpg", alt:"Anillo de Grado Citrino 17, foto del taller"},
  {n:"Anillo de Grado Citrino 18", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"amarillo", consultar:true,
   mas:["piezas/gal/anillo-069-2.jpg", "piezas/gal/anillo-069-3.jpg"], img:"piezas/anillo-069.jpg", alt:"Anillo de Grado Citrino 18, foto del taller"},
  {n:"Anillo de Grado Granate 34", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"rojo", consultar:true,
   mas:["piezas/gal/anillo-070-2.jpg", "piezas/gal/anillo-070-3.jpg"], img:"piezas/anillo-070.jpg", alt:"Anillo de Grado Granate 34, foto del taller"},
  {n:"Anillo de Grado Citrino 19", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"amarillo", consultar:true,
   mas:["piezas/gal/anillo-071-2.jpg", "piezas/gal/anillo-071-3.jpg"], img:"piezas/anillo-071.jpg", alt:"Anillo de Grado Citrino 19, foto del taller"},
  {n:"Anillo de Grado Amatista 08", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"morado", consultar:true,
   mas:["piezas/gal/anillo-072-2.jpg", "piezas/gal/anillo-072-3.jpg"], img:"piezas/anillo-072.jpg", alt:"Anillo de Grado Amatista 08, foto del taller"},
  {n:"Anillo de Grado Zafiro 18", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"azul", consultar:true,
   mas:["piezas/gal/anillo-073-2.jpg", "piezas/gal/anillo-073-3.jpg"], img:"piezas/anillo-073.jpg", alt:"Anillo de Grado Zafiro 18, foto del taller"},
  {n:"Anillo de Grado Esmeralda 04", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"blanco", consultar:true,
   mas:["piezas/gal/anillo-074-2.jpg", "piezas/gal/anillo-074-3.jpg"], img:"piezas/anillo-074.jpg", alt:"Anillo de Grado Esmeralda 04, foto del taller"},
  {n:"Anillo de Grado Citrino 20", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"amarillo", consultar:true,
   mas:["piezas/gal/anillo-075-2.jpg", "piezas/gal/anillo-075-3.jpg"], img:"piezas/anillo-075.jpg", alt:"Anillo de Grado Citrino 20, foto del taller"},
  {n:"Anillo de Grado Zafiro 19", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"azul", consultar:true,
   mas:["piezas/gal/anillo-076-2.jpg", "piezas/gal/anillo-076-3.jpg"], img:"piezas/anillo-076.jpg", alt:"Anillo de Grado Zafiro 19, foto del taller"},
  {n:"Anillo de Grado Granate 35", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"rojo", consultar:true,
   mas:["piezas/gal/anillo-077-2.jpg", "piezas/gal/anillo-077-3.jpg"], img:"piezas/anillo-077.jpg", alt:"Anillo de Grado Granate 35, foto del taller"},
  {n:"Anillo de Grado Citrino 21", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"amarillo", consultar:true,
   mas:["piezas/gal/anillo-078-2.jpg", "piezas/gal/anillo-078-3.jpg"], img:"piezas/anillo-078.jpg", alt:"Anillo de Grado Citrino 21, foto del taller"},
  {n:"Anillo de Grado Aguamarina 09", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"celeste", consultar:true,
   mas:["piezas/gal/anillo-079-2.jpg", "piezas/gal/anillo-079-3.jpg"], img:"piezas/anillo-079.jpg", alt:"Anillo de Grado Aguamarina 09, foto del taller"},
  {n:"Anillo de Grado Zafiro 20", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"azul", consultar:true,
   mas:["piezas/gal/anillo-080-2.jpg", "piezas/gal/anillo-080-3.jpg"], img:"piezas/anillo-080.jpg", alt:"Anillo de Grado Zafiro 20, foto del taller"},
  {n:"Anillo de Grado Turmalina 02", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"rosa", consultar:true,
   mas:["piezas/gal/anillo-081-2.jpg", "piezas/gal/anillo-081-3.jpg"], img:"piezas/anillo-081.jpg", alt:"Anillo de Grado Turmalina 02, foto del taller"},
  {n:"Anillo de Grado Citrino 22", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"amarillo", consultar:true,
   mas:["piezas/gal/anillo-082-2.jpg", "piezas/gal/anillo-082-3.jpg"], img:"piezas/anillo-082.jpg", alt:"Anillo de Grado Citrino 22, foto del taller"},
  {n:"Anillo de Grado Zafiro 21", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"azul", consultar:true,
   mas:["piezas/gal/anillo-083-2.jpg", "piezas/gal/anillo-083-3.jpg"], img:"piezas/anillo-083.jpg", alt:"Anillo de Grado Zafiro 21, foto del taller"},
  {n:"Anillo de Grado Amatista 09", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"morado", consultar:true,
   mas:["piezas/gal/anillo-084-2.jpg", "piezas/gal/anillo-084-3.jpg"], img:"piezas/anillo-084.jpg", alt:"Anillo de Grado Amatista 09, foto del taller"},
  {n:"Anillo de Grado Aguamarina 10", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"celeste", consultar:true,
   mas:["piezas/gal/anillo-085-2.jpg", "piezas/gal/anillo-085-3.jpg"], img:"piezas/anillo-085.jpg", alt:"Anillo de Grado Aguamarina 10, foto del taller"},
  {n:"Anillo de Grado Aguamarina 11", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"celeste", consultar:true,
   mas:["piezas/gal/anillo-086-2.jpg", "piezas/gal/anillo-086-3.jpg"], img:"piezas/anillo-086.jpg", alt:"Anillo de Grado Aguamarina 11, foto del taller"},
  {n:"Anillo de Grado Granate 36", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"rojo", consultar:true,
   mas:["piezas/gal/anillo-087-2.jpg", "piezas/gal/anillo-087-3.jpg"], img:"piezas/anillo-087.jpg", alt:"Anillo de Grado Granate 36, foto del taller"},
  {n:"Anillo de Grado Turmalina 03", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"rosa", consultar:true,
   mas:["piezas/gal/anillo-088-2.jpg", "piezas/gal/anillo-088-3.jpg"], img:"piezas/anillo-088.jpg", alt:"Anillo de Grado Turmalina 03, foto del taller"},
  {n:"Anillo de Grado Citrino 23", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"amarillo", consultar:true,
   mas:["piezas/gal/anillo-089-2.jpg", "piezas/gal/anillo-089-3.jpg"], img:"piezas/anillo-089.jpg", alt:"Anillo de Grado Citrino 23, foto del taller"},
  {n:"Anillo de Grado Granate 37", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"rojo", consultar:true,
   mas:["piezas/gal/anillo-090-2.jpg", "piezas/gal/anillo-090-3.jpg"], img:"piezas/anillo-090.jpg", alt:"Anillo de Grado Granate 37, foto del taller"},
  {n:"Anillo de Grado Aguamarina 12", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"celeste", consultar:true,
   mas:["piezas/gal/anillo-091-2.jpg"], img:"piezas/anillo-091.jpg", alt:"Anillo de Grado Aguamarina 12, foto del taller"},
  {n:"Anillo de Grado Aguamarina 13", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"celeste", consultar:true,
   mas:["piezas/gal/anillo-092-2.jpg", "piezas/gal/anillo-092-3.jpg"], img:"piezas/anillo-092.jpg", alt:"Anillo de Grado Aguamarina 13, foto del taller"},
  {n:"Anillo de Grado Turmalina 04", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"rosa", consultar:true,
   mas:["piezas/gal/anillo-093-2.jpg", "piezas/gal/anillo-093-3.jpg"], img:"piezas/anillo-093.jpg", alt:"Anillo de Grado Turmalina 04, foto del taller"},
  {n:"Anillo de Grado Aguamarina 14", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"celeste", consultar:true,
   mas:["piezas/gal/anillo-094-2.jpg", "piezas/gal/anillo-094-3.jpg"], img:"piezas/anillo-094.jpg", alt:"Anillo de Grado Aguamarina 14, foto del taller"},
  {n:"Anillo de Grado Zafiro 22", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"azul", consultar:true,
   mas:["piezas/gal/anillo-095-2.jpg", "piezas/gal/anillo-095-3.jpg"], img:"piezas/anillo-095.jpg", alt:"Anillo de Grado Zafiro 22, foto del taller"},
  {n:"Anillo de Grado Zafiro 23", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"azul", consultar:true,
   mas:["piezas/gal/anillo-097-2.jpg", "piezas/gal/anillo-097-3.jpg"], img:"piezas/anillo-097.jpg", alt:"Anillo de Grado Zafiro 23, foto del taller"},
  {n:"Anillo de Grado Amatista 10", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"morado", consultar:true,
   mas:["piezas/gal/anillo-098-2.jpg", "piezas/gal/anillo-098-3.jpg"], img:"piezas/anillo-098.jpg", alt:"Anillo de Grado Amatista 10, foto del taller"},
  {n:"Anillo de Grado Zafiro 24", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"azul", consultar:true,
   mas:["piezas/gal/anillo-101-2.jpg", "piezas/gal/anillo-101-3.jpg"], img:"piezas/anillo-101.jpg", alt:"Anillo de Grado Zafiro 24, foto del taller"},
  {n:"Anillo de Grado Citrino 24", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"amarillo", consultar:true,
   mas:["piezas/gal/anillo-102-2.jpg", "piezas/gal/anillo-102-3.jpg"], img:"piezas/anillo-102.jpg", alt:"Anillo de Grado Citrino 24, foto del taller"},
  {n:"Anillo de Grado Citrino 25", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"amarillo", consultar:true,
   mas:["piezas/gal/anillo-103-2.jpg", "piezas/gal/anillo-103-3.jpg"], img:"piezas/anillo-103.jpg", alt:"Anillo de Grado Citrino 25, foto del taller"},
  {n:"Anillo de Grado Aguamarina 15", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"celeste", consultar:true,
   mas:["piezas/gal/anillo-104-2.jpg", "piezas/gal/anillo-104-3.jpg"], img:"piezas/anillo-104.jpg", alt:"Anillo de Grado Aguamarina 15, foto del taller"},
  {n:"Anillo de Grado Granate 38", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"rojo", consultar:true,
   mas:["piezas/gal/anillo-105-2.jpg", "piezas/gal/anillo-105-3.jpg"], img:"piezas/anillo-105.jpg", alt:"Anillo de Grado Granate 38, foto del taller"},
  {n:"Anillo de Grado Cuarzo 17", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"blanco", consultar:true,
   mas:["piezas/gal/anillo-106-2.jpg", "piezas/gal/anillo-106-3.jpg"], img:"piezas/anillo-106.jpg", alt:"Anillo de Grado Cuarzo 17, foto del taller"},
  {n:"Anillo de Grado Citrino 26", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"amarillo", consultar:true,
   mas:["piezas/gal/anillo-107-2.jpg", "piezas/gal/anillo-107-3.jpg"], img:"piezas/anillo-107.jpg", alt:"Anillo de Grado Citrino 26, foto del taller"},
  {n:"Anillo de Grado Granate 39", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"rojo", consultar:true,
   mas:["piezas/gal/anillo-108-2.jpg", "piezas/gal/anillo-108-3.jpg"], img:"piezas/anillo-108.jpg", alt:"Anillo de Grado Granate 39, foto del taller"},
  {n:"Anillo de Grado Granate 40", tipo:"grado", g:6.5, medida:"6x8", estilo:"clasico", piedra:"rojo", consultar:true,
   mas:["piezas/gal/anillo-109-2.jpg", "piezas/gal/anillo-109-3.jpg"], img:"piezas/anillo-109.jpg", alt:"Anillo de Grado Granate 40, foto del taller"},
];

const REGISTRO = {
  "Anillos":[
    /* Todos migrados a GRADO — ver arriba */
  ],
  "Aros de Boda":[
  ],
  "Cadenas y Esclavas":[
    {n:"Cadena tipo Gucci 4x3", tipo:"cadena", g:11.0, medida:"4x3", tejido:"gucci", consultar:true,
     mas:["piezas/gal/cadena-000-2.jpg", "piezas/gal/cadena-000-3.jpg"], img:"piezas/cadena-000.jpg", alt:"Cadena tipo Gucci 4x3, foto del taller"},
    {n:"Cadena tipo Gucci 6x4", tipo:"cadena", g:11.0, medida:"6x4", tejido:"gucci", consultar:true,
     img:"piezas/cadena-001.jpg", alt:"Cadena tipo Gucci 6x4, foto del taller"},
    {n:"Cadena tipo Rolex 10x8", tipo:"cadena", g:11.0, medida:"10x8", tejido:"rolex", consultar:true,
     mas:["piezas/gal/cadena-002-2.jpg", "piezas/gal/cadena-002-3.jpg"], img:"piezas/cadena-002.jpg", alt:"Cadena tipo Rolex 10x8, foto del taller"},
    {n:"Cadena tipo Gucci 6x8", tipo:"cadena", g:11.0, medida:"6x8", tejido:"gucci", consultar:true,
     mas:["piezas/gal/cadena-003-2.jpg", "piezas/gal/cadena-003-3.jpg"], img:"piezas/cadena-003.jpg", alt:"Cadena tipo Gucci 6x8, foto del taller"},
    {n:"Cadena tipo Gucci 6x8 en plata", tipo:"cadena", g:11.0, medida:"6x8", tejido:"gucci", consultar:true,
     mas:["piezas/gal/cadena-004-2.jpg", "piezas/gal/cadena-004-3.jpg"], img:"piezas/cadena-004.jpg", alt:"Cadena tipo Gucci 6x8 en plata, foto del taller"},
    {n:"Cadena de oro con dije de las Tres Gracias", tipo:"cadena", g:11.0, unica:true, stock:true, consultar:true,
     mas:["piezas/gal/cadena-005-2.jpg", "piezas/gal/cadena-005-3.jpg"], img:"piezas/cadena-005.jpg", alt:"Cadena de oro con dije de las Tres Gracias, pieza única, foto del taller"},
    {n:"Cadena con dije y medalla", tipo:"cadena", g:11.0, stock:true, consultar:true,
     mas:["piezas/gal/cadena-009-2.jpg"], img:"piezas/cadena-009.jpg", alt:"Cadena con dije y medalla, stock limitado, foto del taller"},
    {n:"Cadena fina de oro", tipo:"cadena", g:11.0, stock:true, consultar:true,
     mas:["piezas/gal/cadena-010-2.jpg", "piezas/gal/cadena-010-3.jpg"], img:"piezas/cadena-010.jpg", alt:"Cadena fina de oro, stock limitado, foto del taller"},
    {n:"Cadena eslabón liso oro 18k", tipo:"cadena", g:11.0, medida:"6x8", tejido:"liso", consultar:true,
     mas:["piezas/gal/pieza-154-2.jpg", "piezas/gal/pieza-154-3.jpg"], img:"piezas/pieza-154.jpg", alt:"Cadena eslabón liso en oro 18k, foto del taller"},
  ],
  "Pulseras":[
    {n:"Pulsera artesanal de esferas volcánicas", tipo:"pulsera", g:9.0,
     precio_fijo:60,
     variantes:[
       {id:"marron",  label:"Marrón",                  precio:60},
       {id:"negra2",  label:"Negra y blanco (par)",     precio:280},
       {id:"negra-p", label:"Negra con piedras negras", precio:200},
       {id:"colores", label:"De tela, colores",         precio:180},
       {id:"roja",    label:"Roja",                     precio:60}
     ],
     mas:["piezas/gal/pulsera-011-2.jpg", "piezas/gal/pulsera-011-3.jpg"], img:"piezas/pulsera-011.jpg", alt:"Pulsera artesanal de esferas volcánicas, foto del taller"},
  ],
  "Zarcillos":[
    {n:"Zarcillo 10x8", tipo:"zarcillo", g:2.4, medida:"10x8", consultar:true,
     img:"piezas/zarcillo-006.jpg", alt:"Zarcillo 10x8, foto del taller"},
    {n:"Zarcillo 6x8", tipo:"zarcillo", g:2.4, medida:"6x8", consultar:true,
     img:"piezas/zarcillo-007.jpg", alt:"Zarcillo 6x8, foto del taller"},
    {n:"Zarcillo 6x4", tipo:"zarcillo", g:2.4, medida:"6x4", consultar:true,
     mas:["piezas/gal/zarcillo-008-2.jpg"], img:"piezas/zarcillo-008.jpg", alt:"Zarcillo 6x4, foto del taller"},
  ],
  /* ----------------------------------------------------------------
     AROS DE MATRIMONIO
     ----------------------------------------------------------------
     Precio en plata: $90 (incluye nombre/fecha personalizada).
     Dama: 3–4mm, Caballero: 5–6mm, se hacen hasta 8mm.
     Oro 10k: ~$800, Oro 18k: ~$1600.
     Todos los aros de Mariano Minio se pueden hacer en todos los mm.
     Precio publicado es promedio — cotizar por WhatsApp. */
  "Aros de Matrimonio":[
    /* --- AROS PLATA (lisos / grabados / diamantados) --- */
    {n:"Aro Liso Plata", tipo:"aro", g:4.0, consultar:true,
     mas:["piezas/gal/pieza-160-2.jpg","piezas/gal/pieza-160-3.jpg"], img:"piezas/pieza-160.jpg", alt:"Aro de matrimonio liso en plata, foto del taller"},
    {n:"Aro Doble Línea Plata", tipo:"aro", g:4.0, consultar:true,
     mas:["piezas/gal/pieza-155-2.jpg","piezas/gal/pieza-155-3.jpg"], img:"piezas/pieza-155.jpg", alt:"Aro de matrimonio con doble línea en plata"},
    {n:"Aro Liso Ancho Plata", tipo:"aro", g:5.0, consultar:true,
     mas:["piezas/gal/pieza-156-2.jpg","piezas/gal/pieza-156-3.jpg"], img:"piezas/pieza-156.jpg", alt:"Aro de matrimonio liso ancho en plata"},
    {n:"Aro Grabado Floral Plata", tipo:"aro", g:4.5, consultar:true,
     mas:["piezas/gal/pieza-157-2.jpg","piezas/gal/pieza-157-3.jpg"], img:"piezas/pieza-157.jpg", alt:"Aro de matrimonio con grabado floral en plata"},
    {n:"Aro Love Plata", tipo:"aro", g:4.0, consultar:true,
     mas:["piezas/gal/pieza-158-2.jpg","piezas/gal/pieza-158-3.jpg"], img:"piezas/pieza-158.jpg", alt:"Aro de matrimonio con texto Love en plata"},
    {n:"Aro Fino Plata", tipo:"aro", g:3.0, consultar:true,
     mas:["piezas/gal/pieza-159-2.jpg","piezas/gal/pieza-159-3.jpg"], img:"piezas/pieza-159.jpg", alt:"Aro de matrimonio fino en plata"},
    {n:"Aro Detalle Color Plata", tipo:"aro", g:4.0, consultar:true,
     mas:["piezas/gal/pieza-161-2.jpg","piezas/gal/pieza-161-3.jpg"], img:"piezas/pieza-161.jpg", alt:"Aro de matrimonio con detalle de color en plata"},
    {n:"Aro Geométrico Plata", tipo:"aro", g:4.5, consultar:true,
     mas:["piezas/gal/pieza-162-2.jpg","piezas/gal/pieza-162-3.jpg"], img:"piezas/pieza-162.jpg", alt:"Aro de matrimonio con grabado geométrico en plata"},
    {n:"Aro Línea Central Plata", tipo:"aro", g:4.0, consultar:true,
     mas:["piezas/gal/pieza-163-2.jpg","piezas/gal/pieza-163-3.jpg"], img:"piezas/pieza-163.jpg", alt:"Aro de matrimonio con línea central en plata"},
    {n:"Aro Ancho Clásico Plata", tipo:"aro", g:5.5, consultar:true,
     mas:["piezas/gal/pieza-164-2.jpg","piezas/gal/pieza-164-3.jpg"], img:"piezas/pieza-164.jpg", alt:"Aro de matrimonio ancho clásico en plata"},
    {n:"Aro Hoja de Laurel Plata", tipo:"aro", g:4.5, consultar:true,
     mas:["piezas/gal/pieza-165-2.jpg","piezas/gal/pieza-165-3.jpg"], img:"piezas/pieza-165.jpg", alt:"Aro de matrimonio con hoja de laurel grabada en plata"},
    {n:"Aro Tipo Cartier Plata", tipo:"aro", g:4.0, consultar:true,
     mas:["piezas/gal/pieza-166-2.jpg","piezas/gal/pieza-166-3.jpg"], img:"piezas/pieza-166.jpg", alt:"Aro de matrimonio tipo Cartier en plata"},
    {n:"Aro Doble Canal Plata", tipo:"aro", g:4.0, consultar:true,
     mas:["piezas/gal/pieza-167-2.jpg","piezas/gal/pieza-167-3.jpg"], img:"piezas/pieza-167.jpg", alt:"Aro de matrimonio doble canal en plata"},
    {n:"Aro Mate Ancho Plata", tipo:"aro", g:5.5, consultar:true,
     mas:["piezas/gal/pieza-168-2.jpg","piezas/gal/pieza-168-3.jpg"], img:"piezas/pieza-168.jpg", alt:"Aro de matrimonio mate ancho en plata"},
    {n:"Aro Delgado Plata", tipo:"aro", g:3.0, consultar:true,
     mas:["piezas/gal/pieza-169-2.jpg","piezas/gal/pieza-169-3.jpg"], img:"piezas/pieza-169.jpg", alt:"Aro de matrimonio delgado en plata"},
    {n:"Aro con Línea Plata", tipo:"aro", g:4.0, consultar:true,
     mas:["piezas/gal/pieza-170-2.jpg","piezas/gal/pieza-170-3.jpg"], img:"piezas/pieza-170.jpg", alt:"Aro de matrimonio con línea en plata"},
    {n:"Aro Latido de Corazón Plata", tipo:"aro", g:4.0, consultar:true,
     mas:["piezas/gal/pieza-171-2.jpg","piezas/gal/pieza-171-3.jpg"], img:"piezas/pieza-171.jpg", alt:"Aro de matrimonio con latido de corazón en plata"},
    {n:"Aro Canal Central Plata", tipo:"aro", g:4.0, consultar:true,
     mas:["piezas/gal/pieza-172-2.jpg","piezas/gal/pieza-172-3.jpg"], img:"piezas/pieza-172.jpg", alt:"Aro de matrimonio con canal central en plata"},
    {n:"Aro Satinado Plata", tipo:"aro", g:4.0, consultar:true,
     mas:["piezas/gal/pieza-173-2.jpg","piezas/gal/pieza-173-3.jpg"], img:"piezas/pieza-173.jpg", alt:"Aro de matrimonio satinado en plata"},

    /* --- AROS ORO (lisos / grabados / diamantados) --- */
    {n:"Aro Liso con Borde Oro", tipo:"aro", g:4.5, consultar:true,
     mas:["piezas/gal/pieza-174-2.jpg","piezas/gal/pieza-174-3.jpg"], img:"piezas/pieza-174.jpg", alt:"Aro de matrimonio liso con borde en oro"},
    {n:"Aro Diamantado Estrellas Oro", tipo:"aro", g:5.0, consultar:true,
     mas:["piezas/gal/pieza-175-2.jpg","piezas/gal/pieza-175-3.jpg"], img:"piezas/pieza-175.jpg", alt:"Aro de matrimonio diamantado con estrellas en oro"},
    {n:"Aro Clásico Fino Oro", tipo:"aro", g:3.5, consultar:true,
     mas:["piezas/gal/pieza-176-2.jpg","piezas/gal/pieza-176-3.jpg"], img:"piezas/pieza-176.jpg", alt:"Aro de matrimonio clásico fino en oro"},
    {n:"Aro Línea Central Oro", tipo:"aro", g:4.5, consultar:true,
     mas:["piezas/gal/pieza-177-2.jpg","piezas/gal/pieza-177-3.jpg"], img:"piezas/pieza-177.jpg", alt:"Aro de matrimonio con línea central en oro"},
    {n:"Aro Liso Ancho Oro", tipo:"aro", g:5.5, consultar:true,
     mas:["piezas/gal/pieza-178-2.jpg","piezas/gal/pieza-178-3.jpg"], img:"piezas/pieza-178.jpg", alt:"Aro de matrimonio liso ancho en oro"},
    {n:"Aro Milgrain Oro", tipo:"aro", g:5.0, consultar:true,
     mas:["piezas/gal/pieza-179-2.jpg","piezas/gal/pieza-179-3.jpg"], img:"piezas/pieza-179.jpg", alt:"Aro de matrimonio con borde milgrain en oro"},
    {n:"Aro Diamantado Oro", tipo:"aro", g:5.0, consultar:true,
     mas:["piezas/gal/pieza-180-2.jpg","piezas/gal/pieza-180-3.jpg"], img:"piezas/pieza-180.jpg", alt:"Aro de matrimonio diamantado en oro"},
    {n:"Aro Ondas Oro", tipo:"aro", g:5.0, consultar:true,
     mas:["piezas/gal/pieza-181-2.jpg","piezas/gal/pieza-181-3.jpg"], img:"piezas/pieza-181.jpg", alt:"Aro de matrimonio con diseño de ondas en oro"},
    {n:"Aro Trenza Laurel Oro", tipo:"aro", g:4.5, consultar:true,
     mas:["piezas/gal/pieza-182-2.jpg","piezas/gal/pieza-182-3.jpg"], img:"piezas/pieza-182.jpg", alt:"Aro de matrimonio con trenza de laurel en oro"},
    {n:"Aro Diamantado Flores Oro", tipo:"aro", g:5.0, consultar:true,
     mas:["piezas/gal/pieza-183-2.jpg","piezas/gal/pieza-183-3.jpg"], img:"piezas/pieza-183.jpg", alt:"Aro de matrimonio diamantado con flores en oro"},
    {n:"Aro Corazones Oro", tipo:"aro", g:4.5, consultar:true,
     mas:["piezas/gal/pieza-184-2.jpg","piezas/gal/pieza-184-3.jpg"], img:"piezas/pieza-184.jpg", alt:"Aro de matrimonio con corazones grabados en oro"},
    {n:"Aro Liso Oro", tipo:"aro", g:5.0, consultar:true,
     mas:["piezas/gal/pieza-185-2.jpg","piezas/gal/pieza-185-3.jpg"], img:"piezas/pieza-185.jpg", alt:"Aro de matrimonio liso en oro"},
    {n:"Aro Escamas Oro", tipo:"aro", g:5.0, consultar:true,
     mas:["piezas/gal/pieza-186-2.jpg","piezas/gal/pieza-186-3.jpg"], img:"piezas/pieza-186.jpg", alt:"Aro de matrimonio con patrón de escamas en oro"},
    {n:"Aro Canal Oro", tipo:"aro", g:4.5, consultar:true,
     mas:["piezas/gal/pieza-187-2.jpg","piezas/gal/pieza-187-3.jpg"], img:"piezas/pieza-187.jpg", alt:"Aro de matrimonio con canal central en oro"},
  ],
  /* ----------------------------------------------------------------
     MATRIMONIO CON PIEDRAS
     ----------------------------------------------------------------
     Cada piedra pequeña: +$3.
     En promedio $40 más que matrimonio sin piedra.
     Cotizar por WhatsApp. */
  "Matrimonio con Piedras":[
    {n:"Aro Doble Fila de Piedras", tipo:"matrimonio", g:4.5, consultar:true,
     mas:["piezas/gal/pieza-188-2.jpg","piezas/gal/pieza-188-3.jpg"], img:"piezas/pieza-188.jpg", alt:"Aro de matrimonio con doble fila de piedras en plata"},
    {n:"Aro Fila de Piedras", tipo:"matrimonio", g:4.0, consultar:true,
     mas:["piezas/gal/pieza-189-2.jpg","piezas/pieza-190.jpg","piezas/gal/pieza-190-2.jpg","piezas/gal/pieza-190-3.jpg"], img:"piezas/pieza-189.jpg", alt:"Aro de matrimonio con fila de piedras en plata"},
    /* Aro con Hilera de Circonitas ELIMINADO — era el mismo anillo que Aro Fila de Piedras (pieza-190 = vista lateral de pieza-189) */
    {n:"Aro Cruzado con Piedras", tipo:"matrimonio", g:4.5, consultar:true,
     mas:["piezas/gal/pieza-191-2.jpg","piezas/gal/pieza-191-3.jpg"], img:"piezas/pieza-191.jpg", alt:"Aro de matrimonio cruzado con piedras en plata"},
    {n:"Aro Pavé Cuadrado", tipo:"matrimonio", g:4.5, consultar:true,
     mas:["piezas/gal/pieza-192-2.jpg","piezas/gal/pieza-192-3.jpg"], img:"piezas/pieza-192.jpg", alt:"Aro de matrimonio con pavé cuadrado de piedras"},
    {n:"Aro Ancho con Piedra Central", tipo:"matrimonio", g:5.0, consultar:true,
     mas:["piezas/gal/pieza-193-2.jpg","piezas/gal/pieza-193-3.jpg"], img:"piezas/pieza-193.jpg", alt:"Aro de matrimonio ancho con piedra central"},
    {n:"Aro Líneas con Bloque de Piedras", tipo:"matrimonio", g:4.5, consultar:true,
     mas:["piezas/gal/pieza-194-2.jpg","piezas/gal/pieza-194-3.jpg"], img:"piezas/pieza-194.jpg", alt:"Aro de matrimonio con líneas y bloque de piedras"},
    {n:"Aro Ancho con Piedras", tipo:"matrimonio", g:5.0, consultar:true,
     mas:["piezas/gal/pieza-195-2.jpg","piezas/gal/pieza-195-3.jpg"], img:"piezas/pieza-195.jpg", alt:"Aro de matrimonio ancho con piedras en plata"},
    {n:"Cintillo Medio Eternity", tipo:"matrimonio", g:3.0, consultar:true,
     mas:["piezas/gal/pieza-203-2.jpg","piezas/gal/pieza-203-3.jpg"], img:"piezas/pieza-203.jpg", alt:"Cintillo medio eternity con piedras"},
    {n:"Cintillo Fino con Piedras", tipo:"matrimonio", g:2.5, consultar:true,
     mas:["piezas/gal/pieza-206-2.jpg","piezas/gal/pieza-206-3.jpg"], img:"piezas/pieza-206.jpg", alt:"Cintillo fino con piedras pequeñas"},
    {n:"Cintillo Delgado con Piedras", tipo:"matrimonio", g:2.5, consultar:true,
     mas:["piezas/gal/pieza-207-2.jpg","piezas/gal/pieza-207-3.jpg"], img:"piezas/pieza-207.jpg", alt:"Cintillo delgado con piedras"},
  ],
  /* ----------------------------------------------------------------
     ANILLOS DE COMPROMISO
     ----------------------------------------------------------------
     Plata: desde $40. Oro 10k: desde $300. Oro 18k: desde $500.
     Cotizar por WhatsApp. */
  "Compromiso":[
    {n:"Solitario Oval", tipo:"compromiso", g:3.0, consultar:true,
     mas:["piezas/gal/pieza-197-2.jpg","piezas/gal/pieza-197-3.jpg"], img:"piezas/pieza-197.jpg", alt:"Anillo de compromiso solitario oval"},
    {n:"Solitario Redondo Clásico", tipo:"compromiso", g:3.0, consultar:true,
     mas:["piezas/gal/pieza-198-2.jpg","piezas/gal/pieza-198-3.jpg"], img:"piezas/pieza-198.jpg", alt:"Anillo de compromiso solitario redondo clásico"},
    {n:"Compromiso con Lazo de Piedras", tipo:"compromiso", g:3.0, consultar:true,
     mas:["piezas/gal/pieza-199-2.jpg","piezas/gal/pieza-199-3.jpg"], img:"piezas/pieza-199.jpg", alt:"Anillo de compromiso con lazo de piedras"},
    {n:"Solitario Clásico", tipo:"compromiso", g:3.0, consultar:true,
     mas:["piezas/gal/pieza-200-2.jpg","piezas/gal/pieza-200-3.jpg"], img:"piezas/pieza-200.jpg", alt:"Anillo de compromiso solitario clásico"},
    {n:"Compromiso Vintage con Halo", tipo:"compromiso", g:3.5, consultar:true,
     mas:["piezas/gal/pieza-201-2.jpg","piezas/gal/pieza-201-3.jpg"], img:"piezas/pieza-201.jpg", alt:"Anillo de compromiso estilo vintage con halo de piedras"},
    {n:"Solitario Delicado", tipo:"compromiso", g:2.5, consultar:true,
     mas:["piezas/gal/pieza-202-2.jpg","piezas/gal/pieza-202-3.jpg"], img:"piezas/pieza-202.jpg", alt:"Anillo de compromiso solitario delicado"},
    {n:"Halo Oval con Banda de Piedras", tipo:"compromiso", g:3.5, consultar:true,
     mas:["piezas/gal/pieza-204-2.jpg"], img:"piezas/pieza-204.jpg", alt:"Anillo de compromiso halo oval con banda de piedras"},
    {n:"Halo Redondo", tipo:"compromiso", g:3.5, consultar:true,
     mas:["piezas/gal/pieza-205-2.jpg","piezas/gal/pieza-205-3.jpg"], img:"piezas/pieza-205.jpg", alt:"Anillo de compromiso con halo redondo de piedras"},
    {n:"Anillo Zafiro con Halo", tipo:"compromiso", g:4.0, unica:true, consultar:true,
     mas:["piezas/gal/pieza-208-2.jpg","piezas/gal/pieza-208-3.jpg"], img:"piezas/pieza-208.jpg", alt:"Anillo con zafiro azul y halo de piedras blancas, pieza unica"},
  ],
  "Dijes":[
  ],
};
