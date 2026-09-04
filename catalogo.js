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

const MEDIDAS = [
  {id:"4x3",   mm:[4,3],   nombre:"Discreta",  nota:"La más pequeña. Se nota poco, para llevar a diario."},
  {id:"6x4",   mm:[6,4],   nombre:"Menuda",    nota:"Pequeña pero visible."},
  {id:"6x8",   mm:[6,8],   nombre:"Clásica",   nota:"La medida más pedida."},
  {id:"10x8",  mm:[10,8],  nombre:"Amplia",    nota:"Se ve de lejos."},
  {id:"10x12", mm:[10,12], nombre:"Grande",    nota:"La de mayor presencia."}
];

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
  {n:"Anillo de Grado Aguamarina 01", tipo:"grado", g:6.5, piedra:"celeste", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-014-2.jpg", "piezas/gal/grado-014-3.jpg"], img:"piezas/grado-014.jpg", alt:"Anillo de Grado Aguamarina 01, foto del taller"},
  {n:"Anillo de Grado Granate 01", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-015-2.jpg", "piezas/gal/grado-015-3.jpg"], img:"piezas/grado-015.jpg", alt:"Anillo de Grado Granate 01, foto del taller"},
  {n:"Anillo de Grado Granate 02", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-016-2.jpg", "piezas/gal/grado-016-3.jpg"], img:"piezas/grado-016.jpg", alt:"Anillo de Grado Granate 02, foto del taller"},
  {n:"Anillo de Grado Aguamarina 02", tipo:"grado", g:6.5, piedra:"celeste", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-017-2.jpg", "piezas/gal/grado-017-3.jpg"], img:"piezas/grado-017.jpg", alt:"Anillo de Grado Aguamarina 02, foto del taller"},
  {n:"Anillo de Grado Zafiro 01", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-018-2.jpg", "piezas/gal/grado-018-3.jpg"], img:"piezas/grado-018.jpg", alt:"Anillo de Grado Zafiro 01, foto del taller"},
  {n:"Anillo de Grado Citrino 01", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-019-2.jpg", "piezas/gal/grado-019-3.jpg"], img:"piezas/grado-019.jpg", alt:"Anillo de Grado Citrino 01, foto del taller"},
  {n:"Anillo de Grado Citrino 02", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-020-2.jpg", "piezas/gal/grado-020-3.jpg"], img:"piezas/grado-020.jpg", alt:"Anillo de Grado Citrino 02, foto del taller"},
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
  {n:"Anillo de Grado Zafiro 02", tipo:"grado", g:6.5, piedra:"azul", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-027-2.jpg", "piezas/gal/grado-027-3.jpg"], img:"piezas/grado-027.jpg", alt:"Anillo de Grado Zafiro 02, foto del taller"},
  {n:"Anillo de Grado Zafiro 03", tipo:"grado", g:6.5, piedra:"azul", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-028-2.jpg", "piezas/gal/grado-028-3.jpg"], img:"piezas/grado-028.jpg", alt:"Anillo de Grado Zafiro 03, foto del taller"},
  {n:"Anillo de Grado Granate 05", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-029-2.jpg", "piezas/gal/grado-029-3.jpg"], img:"piezas/grado-029.jpg", alt:"Anillo de Grado Granate 05, foto del taller"},
  {n:"Anillo de Grado Citrino 04", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-030-2.jpg", "piezas/gal/grado-030-3.jpg"], img:"piezas/grado-030.jpg", alt:"Anillo de Grado Citrino 04, foto del taller"},
  {n:"Anillo de Grado Zafiro 04", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-031-2.jpg", "piezas/gal/grado-031-3.jpg"], img:"piezas/grado-031.jpg", alt:"Anillo de Grado Zafiro 04, foto del taller"},
  {n:"Anillo de Grado Citrino 05", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-032-2.jpg", "piezas/gal/grado-032-3.jpg"], img:"piezas/grado-032.jpg", alt:"Anillo de Grado Citrino 05, foto del taller"},
  {n:"Anillo de Grado Citrino 06", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-033-2.jpg", "piezas/gal/grado-033-3.jpg"], img:"piezas/grado-033.jpg", alt:"Anillo de Grado Citrino 06, foto del taller"},
  {n:"Anillo de Grado Citrino 07", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-034-2.jpg", "piezas/gal/grado-034-3.jpg"], img:"piezas/grado-034.jpg", alt:"Anillo de Grado Citrino 07, foto del taller"},
  {n:"Anillo de Grado Zafiro 05", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-035-2.jpg", "piezas/gal/grado-035-3.jpg"], img:"piezas/grado-035.jpg", alt:"Anillo de Grado Zafiro 05, foto del taller"},
  {n:"Anillo de Grado Zafiro 06", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-036-2.jpg", "piezas/gal/grado-036-3.jpg"], img:"piezas/grado-036.jpg", alt:"Anillo de Grado Zafiro 06, foto del taller"},
  {n:"Anillo de Grado Citrino 08", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-037-2.jpg", "piezas/gal/grado-037-3.jpg"], img:"piezas/grado-037.jpg", alt:"Anillo de Grado Citrino 08, foto del taller"},
  {n:"Anillo de Grado Granate 06", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-038-2.jpg", "piezas/gal/grado-038-3.jpg"], img:"piezas/grado-038.jpg", alt:"Anillo de Grado Granate 06, foto del taller"},
  {n:"Anillo de Grado Granate 07", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-039-2.jpg", "piezas/gal/grado-039-3.jpg"], img:"piezas/grado-039.jpg", alt:"Anillo de Grado Granate 07, foto del taller"},
  {n:"Anillo de Grado Granate 08", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-040-2.jpg", "piezas/gal/grado-040-3.jpg"], img:"piezas/grado-040.jpg", alt:"Anillo de Grado Granate 08, foto del taller"},
  {n:"Anillo de Grado Aguamarina 03", tipo:"grado", g:6.5, piedra:"celeste", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-041-2.jpg", "piezas/gal/grado-041-3.jpg"], img:"piezas/grado-041.jpg", alt:"Anillo de Grado Aguamarina 03, foto del taller"},
  {n:"Anillo de Grado Granate 09", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-042-2.jpg", "piezas/gal/grado-042-3.jpg"], img:"piezas/grado-042.jpg", alt:"Anillo de Grado Granate 09, foto del taller"},
  {n:"Anillo de Grado Granate 10", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-043-2.jpg", "piezas/gal/grado-043-3.jpg"], img:"piezas/grado-043.jpg", alt:"Anillo de Grado Granate 10, foto del taller"},
  {n:"Anillo de Grado Amatista 03", tipo:"grado", g:6.5, piedra:"morado", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-044-2.jpg", "piezas/gal/grado-044-3.jpg"], img:"piezas/grado-044.jpg", alt:"Anillo de Grado Amatista 03, foto del taller"},
  {n:"Anillo de Grado Turmalina 01", tipo:"grado", g:6.5, piedra:"rosa", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-045-2.jpg", "piezas/gal/grado-045-3.jpg"], img:"piezas/grado-045.jpg", alt:"Anillo de Grado Turmalina 01, foto del taller"},
  {n:"Anillo de Grado Granate 11", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-046-2.jpg", "piezas/gal/grado-046-3.jpg"], img:"piezas/grado-046.jpg", alt:"Anillo de Grado Granate 11, foto del taller"},
  {n:"Anillo de Grado Granate 12", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-047-2.jpg", "piezas/gal/grado-047-3.jpg"], img:"piezas/grado-047.jpg", alt:"Anillo de Grado Granate 12, foto del taller"},
  {n:"Anillo de Grado Zafiro 07", tipo:"grado", g:6.5, piedra:"azul", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-048-2.jpg", "piezas/gal/grado-048-3.jpg"], img:"piezas/grado-048.jpg", alt:"Anillo de Grado Zafiro 07, foto del taller"},
  {n:"Anillo de Grado Aguamarina 04", tipo:"grado", g:6.5, piedra:"celeste", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-049-2.jpg", "piezas/gal/grado-049-3.jpg"], img:"piezas/grado-049.jpg", alt:"Anillo de Grado Aguamarina 04, foto del taller"},
  {n:"Anillo de Grado Zafiro 08", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-050-2.jpg", "piezas/gal/grado-050-3.jpg"], img:"piezas/grado-050.jpg", alt:"Anillo de Grado Zafiro 08, foto del taller"},
  {n:"Anillo de Grado Granate 13", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-051-2.jpg", "piezas/gal/grado-051-3.jpg"], img:"piezas/grado-051.jpg", alt:"Anillo de Grado Granate 13, foto del taller"},
  {n:"Anillo de Grado Zafiro 09", tipo:"grado", g:6.5, piedra:"azul", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-052-2.jpg", "piezas/gal/grado-052-3.jpg"], img:"piezas/grado-052.jpg", alt:"Anillo de Grado Zafiro 09, foto del taller"},
  {n:"Anillo de Grado Granate 14", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-053-2.jpg", "piezas/gal/grado-053-3.jpg"], img:"piezas/grado-053.jpg", alt:"Anillo de Grado Granate 14, foto del taller"},
  {n:"Anillo de Grado Citrino 09", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-054-2.jpg", "piezas/gal/grado-054-3.jpg"], img:"piezas/grado-054.jpg", alt:"Anillo de Grado Citrino 09, foto del taller"},
  {n:"Anillo de Grado Granate 15", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-055-2.jpg", "piezas/gal/grado-055-3.jpg"], img:"piezas/grado-055.jpg", alt:"Anillo de Grado Granate 15, foto del taller"},
  {n:"Anillo de Grado Zafiro 10", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-056-2.jpg", "piezas/gal/grado-056-3.jpg"], img:"piezas/grado-056.jpg", alt:"Anillo de Grado Zafiro 10, foto del taller"},
  {n:"Anillo de Grado Granate 16", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-057-2.jpg", "piezas/gal/grado-057-3.jpg"], img:"piezas/grado-057.jpg", alt:"Anillo de Grado Granate 16, foto del taller"},
  {n:"Anillo de Grado Zafiro 11", tipo:"grado", g:6.5, piedra:"azul", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-058-2.jpg", "piezas/gal/grado-058-3.jpg"], img:"piezas/grado-058.jpg", alt:"Anillo de Grado Zafiro 11, foto del taller"},
  {n:"Anillo de Grado Citrino 10", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-059-2.jpg", "piezas/gal/grado-059-3.jpg"], img:"piezas/grado-059.jpg", alt:"Anillo de Grado Citrino 10, foto del taller"},
  {n:"Anillo de Grado Aguamarina 05", tipo:"grado", g:6.5, piedra:"celeste", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-060-2.jpg", "piezas/gal/grado-060-3.jpg"], img:"piezas/grado-060.jpg", alt:"Anillo de Grado Aguamarina 05, foto del taller"},
  {n:"Anillo de Grado Granate 17", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-061-2.jpg", "piezas/gal/grado-061-3.jpg"], img:"piezas/grado-061.jpg", alt:"Anillo de Grado Granate 17, foto del taller"},
  {n:"Anillo de Grado Citrino 11", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-062-2.jpg", "piezas/gal/grado-062-3.jpg"], img:"piezas/grado-062.jpg", alt:"Anillo de Grado Citrino 11, foto del taller"},
  {n:"Anillo de Grado Granate 18", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-063-2.jpg", "piezas/gal/grado-063-3.jpg"], img:"piezas/grado-063.jpg", alt:"Anillo de Grado Granate 18, foto del taller"},
  {n:"Anillo de Grado Cuarzo 03", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-096-2.jpg", "piezas/gal/grado-096-3.jpg"], img:"piezas/grado-096.jpg", alt:"Anillo de Grado Cuarzo 03, foto del taller"},
  {n:"Anillo de Grado Citrino 12", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-099-2.jpg"], img:"piezas/grado-099.jpg", alt:"Anillo de Grado Citrino 12, foto del taller"},
  {n:"Anillo de Grado Citrino 13", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"moderno", consultar:true,
   img:"piezas/grado-100.jpg", alt:"Anillo de Grado Citrino 13, foto del taller"},
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
  {n:"Anillo de Grado Turmalina 02", tipo:"grado", g:6.5, piedra:"rosa", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-119-2.jpg", "piezas/gal/grado-119-3.jpg"], img:"piezas/grado-119.jpg", alt:"Anillo de Grado Turmalina 02, foto del taller"},
  {n:"Anillo de Grado Amatista 04", tipo:"grado", g:6.5, piedra:"morado", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-120-2.jpg", "piezas/gal/grado-120-3.jpg"], img:"piezas/grado-120.jpg", alt:"Anillo de Grado Amatista 04, foto del taller"},
  {n:"Anillo de Grado Cuarzo 12", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-121-2.jpg", "piezas/gal/grado-121-3.jpg"], img:"piezas/grado-121.jpg", alt:"Anillo de Grado Cuarzo 12, foto del taller"},
  {n:"Anillo de Grado Zafiro 12", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-122-2.jpg", "piezas/gal/grado-122-3.jpg"], img:"piezas/grado-122.jpg", alt:"Anillo de Grado Zafiro 12, foto del taller"},
  {n:"Anillo de Grado Granate 19", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-123-2.jpg", "piezas/gal/grado-123-3.jpg"], img:"piezas/grado-123.jpg", alt:"Anillo de Grado Granate 19, foto del taller"},
  {n:"Anillo de Grado Granate 20", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-124-2.jpg", "piezas/gal/grado-124-3.jpg"], img:"piezas/grado-124.jpg", alt:"Anillo de Grado Granate 20, foto del taller"},
  {n:"Anillo de Grado Zafiro 13", tipo:"grado", g:6.5, piedra:"azul", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-125-2.jpg", "piezas/gal/grado-125-3.jpg"], img:"piezas/grado-125.jpg", alt:"Anillo de Grado Zafiro 13, foto del taller"},
  {n:"Anillo de Grado Granate 21", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-126-2.jpg", "piezas/gal/grado-126-3.jpg"], img:"piezas/grado-126.jpg", alt:"Anillo de Grado Granate 21, foto del taller"},
  {n:"Anillo de Grado Aguamarina 06", tipo:"grado", g:6.5, piedra:"celeste", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-127-2.jpg", "piezas/gal/grado-127-3.jpg"], img:"piezas/grado-127.jpg", alt:"Anillo de Grado Aguamarina 06, foto del taller"},
  {n:"Anillo de Grado Granate 22", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-128-2.jpg", "piezas/gal/grado-128-3.jpg"], img:"piezas/grado-128.jpg", alt:"Anillo de Grado Granate 22, foto del taller"},
  {n:"Anillo de Grado Zafiro 14", tipo:"grado", g:6.5, piedra:"azul", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-129-2.jpg", "piezas/gal/grado-129-3.jpg"], img:"piezas/grado-129.jpg", alt:"Anillo de Grado Zafiro 14, foto del taller"},
  {n:"Anillo de Grado Amatista 05", tipo:"grado", g:6.5, piedra:"morado", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-130-2.jpg", "piezas/gal/grado-130-3.jpg"], img:"piezas/grado-130.jpg", alt:"Anillo de Grado Amatista 05, foto del taller"},
  {n:"Anillo de Grado Granate 23", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-131-2.jpg", "piezas/gal/grado-131-3.jpg"], img:"piezas/grado-131.jpg", alt:"Anillo de Grado Granate 23, foto del taller"},
  {n:"Anillo de Grado Aguamarina 07", tipo:"grado", g:6.5, piedra:"celeste", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-132-2.jpg", "piezas/gal/grado-132-3.jpg"], img:"piezas/grado-132.jpg", alt:"Anillo de Grado Aguamarina 07, foto del taller"},
  {n:"Anillo de Grado Granate 24", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-133-2.jpg", "piezas/gal/grado-133-3.jpg"], img:"piezas/grado-133.jpg", alt:"Anillo de Grado Granate 24, foto del taller"},
  {n:"Anillo de Grado Citrino 15", tipo:"grado", g:6.5, piedra:"amarillo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-134-2.jpg", "piezas/gal/grado-134-3.jpg"], img:"piezas/grado-134.jpg", alt:"Anillo de Grado Citrino 15, foto del taller"},
  {n:"Anillo de Grado Cuarzo 13", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-135-2.jpg", "piezas/gal/grado-135-3.jpg"], img:"piezas/grado-135.jpg", alt:"Anillo de Grado Cuarzo 13, foto del taller"},
  {n:"Anillo de Grado Granate 25", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-136-2.jpg", "piezas/gal/grado-136-3.jpg"], img:"piezas/grado-136.jpg", alt:"Anillo de Grado Granate 25, foto del taller"},
  {n:"Anillo de Grado Cuarzo 14", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-137-2.jpg", "piezas/gal/grado-137-3.jpg"], img:"piezas/grado-137.jpg", alt:"Anillo de Grado Cuarzo 14, foto del taller"},
  {n:"Anillo de Grado Zafiro 15", tipo:"grado", g:6.5, piedra:"azul", estilo:"clasico", consultar:true,
   img:"piezas/grado-138.jpg", alt:"Anillo de Grado Zafiro 15, foto del taller"},
  {n:"Anillo de Grado Zafiro 16", tipo:"grado", g:6.5, piedra:"azul", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-139-2.jpg", "piezas/gal/grado-139-3.jpg"], img:"piezas/grado-139.jpg", alt:"Anillo de Grado Zafiro 16, foto del taller"},
  {n:"Anillo de Grado Cuarzo 15", tipo:"grado", g:6.5, piedra:"blanco", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-140-2.jpg", "piezas/gal/grado-140-3.jpg"], img:"piezas/grado-140.jpg", alt:"Anillo de Grado Cuarzo 15, foto del taller"},
  {n:"Anillo de Grado Granate 26", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-141-2.jpg", "piezas/gal/grado-141-3.jpg"], img:"piezas/grado-141.jpg", alt:"Anillo de Grado Granate 26, foto del taller"},
  {n:"Anillo de Grado Cuarzo 16", tipo:"grado", g:6.5, piedra:"blanco", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-142-2.jpg", "piezas/gal/grado-142-3.jpg"], img:"piezas/grado-142.jpg", alt:"Anillo de Grado Cuarzo 16, foto del taller"},
  {n:"Anillo de Grado Granate 27", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   img:"piezas/grado-143.jpg", alt:"Anillo de Grado Granate 27, foto del taller"},
  {n:"Anillo de Grado Granate 28", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-144-2.jpg", "piezas/gal/grado-144-3.jpg"], img:"piezas/grado-144.jpg", alt:"Anillo de Grado Granate 28, foto del taller"},
  {n:"Anillo de Grado Zafiro 17", tipo:"grado", g:6.5, piedra:"azul", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-145-2.jpg", "piezas/gal/grado-145-3.jpg"], img:"piezas/grado-145.jpg", alt:"Anillo de Grado Zafiro 17, foto del taller"},
  {n:"Anillo de Grado Amatista 06", tipo:"grado", g:6.5, piedra:"morado", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-146-2.jpg", "piezas/gal/grado-146-3.jpg"], img:"piezas/grado-146.jpg", alt:"Anillo de Grado Amatista 06, foto del taller"},
  {n:"Anillo de Grado Amatista 07", tipo:"grado", g:6.5, piedra:"morado", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-147-2.jpg", "piezas/gal/grado-147-3.jpg"], img:"piezas/grado-147.jpg", alt:"Anillo de Grado Amatista 07, foto del taller"},
  {n:"Anillo de Grado Esmeralda 01", tipo:"grado", g:6.5, estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-148-2.jpg", "piezas/gal/grado-148-3.jpg"], img:"piezas/grado-148.jpg", alt:"Anillo de Grado Esmeralda 01, foto del taller"},
  {n:"Anillo de Grado Granate 29", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-149-2.jpg", "piezas/gal/grado-149-3.jpg"], img:"piezas/grado-149.jpg", alt:"Anillo de Grado Granate 29, foto del taller"},
  {n:"Anillo de Grado Granate 30", tipo:"grado", g:6.5, piedra:"rojo", estilo:"clasico", consultar:true,
   mas:["piezas/gal/grado-150-2.jpg", "piezas/gal/grado-150-3.jpg"], img:"piezas/grado-150.jpg", alt:"Anillo de Grado Granate 30, foto del taller"},
  {n:"Anillo de Grado Granate 31", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-151-2.jpg", "piezas/gal/grado-151-3.jpg"], img:"piezas/grado-151.jpg", alt:"Anillo de Grado Granate 31, foto del taller"},
  {n:"Anillo de Grado Esmeralda 02", tipo:"grado", g:6.5, estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-152-2.jpg", "piezas/gal/grado-152-3.jpg"], img:"piezas/grado-152.jpg", alt:"Anillo de Grado Esmeralda 02, foto del taller"},
  {n:"Anillo de Grado Granate 32", tipo:"grado", g:6.5, piedra:"rojo", estilo:"moderno", consultar:true,
   mas:["piezas/gal/grado-153-2.jpg", "piezas/gal/grado-153-3.jpg"], img:"piezas/grado-153.jpg", alt:"Anillo de Grado Granate 32, foto del taller"},
];

const REGISTRO = {
  "Anillos":[
    {n:"Anillo Citrino 01", tipo:"anillo", g:4.2, piedra:"amarillo", consultar:true,
     mas:["piezas/gal/anillo-064-2.jpg", "piezas/gal/anillo-064-3.jpg"], img:"piezas/anillo-064.jpg", alt:"Anillo Citrino 01, foto del taller"},
    {n:"Anillo Esmeralda 01", tipo:"anillo", g:4.2, consultar:true,
     mas:["piezas/gal/anillo-065-2.jpg", "piezas/gal/anillo-065-3.jpg"], img:"piezas/anillo-065.jpg", alt:"Anillo Esmeralda 01, foto del taller"},
    {n:"Anillo Aguamarina 01", tipo:"anillo", g:4.2, piedra:"celeste", consultar:true,
     mas:["piezas/gal/anillo-066-2.jpg", "piezas/gal/anillo-066-3.jpg"], img:"piezas/anillo-066.jpg", alt:"Anillo Aguamarina 01, foto del taller"},
    {n:"Anillo Granate 01", tipo:"anillo", g:4.2, piedra:"rojo", consultar:true,
     mas:["piezas/gal/anillo-067-2.jpg", "piezas/gal/anillo-067-3.jpg"], img:"piezas/anillo-067.jpg", alt:"Anillo Granate 01, foto del taller"},
    {n:"Anillo Citrino 02", tipo:"anillo", g:4.2, piedra:"amarillo", consultar:true,
     mas:["piezas/gal/anillo-068-2.jpg", "piezas/gal/anillo-068-3.jpg"], img:"piezas/anillo-068.jpg", alt:"Anillo Citrino 02, foto del taller"},
    {n:"Anillo Citrino 03", tipo:"anillo", g:4.2, piedra:"amarillo", consultar:true,
     mas:["piezas/gal/anillo-069-2.jpg", "piezas/gal/anillo-069-3.jpg"], img:"piezas/anillo-069.jpg", alt:"Anillo Citrino 03, foto del taller"},
    {n:"Anillo Granate 02", tipo:"anillo", g:4.2, piedra:"rojo", consultar:true,
     mas:["piezas/gal/anillo-070-2.jpg", "piezas/gal/anillo-070-3.jpg"], img:"piezas/anillo-070.jpg", alt:"Anillo Granate 02, foto del taller"},
    {n:"Anillo Citrino 04", tipo:"anillo", g:4.2, piedra:"amarillo", consultar:true,
     mas:["piezas/gal/anillo-071-2.jpg", "piezas/gal/anillo-071-3.jpg"], img:"piezas/anillo-071.jpg", alt:"Anillo Citrino 04, foto del taller"},
    {n:"Anillo Amatista 01", tipo:"anillo", g:4.2, piedra:"morado", consultar:true,
     mas:["piezas/gal/anillo-072-2.jpg", "piezas/gal/anillo-072-3.jpg"], img:"piezas/anillo-072.jpg", alt:"Anillo Amatista 01, foto del taller"},
    {n:"Anillo Zafiro 01", tipo:"anillo", g:4.2, piedra:"azul", consultar:true,
     mas:["piezas/gal/anillo-073-2.jpg", "piezas/gal/anillo-073-3.jpg"], img:"piezas/anillo-073.jpg", alt:"Anillo Zafiro 01, foto del taller"},
    {n:"Anillo Esmeralda 02", tipo:"anillo", g:4.2, consultar:true,
     mas:["piezas/gal/anillo-074-2.jpg", "piezas/gal/anillo-074-3.jpg"], img:"piezas/anillo-074.jpg", alt:"Anillo Esmeralda 02, foto del taller"},
    {n:"Anillo Citrino 05", tipo:"anillo", g:4.2, piedra:"amarillo", consultar:true,
     mas:["piezas/gal/anillo-075-2.jpg", "piezas/gal/anillo-075-3.jpg"], img:"piezas/anillo-075.jpg", alt:"Anillo Citrino 05, foto del taller"},
    {n:"Anillo Zafiro 02", tipo:"anillo", g:4.2, piedra:"azul", consultar:true,
     mas:["piezas/gal/anillo-076-2.jpg", "piezas/gal/anillo-076-3.jpg"], img:"piezas/anillo-076.jpg", alt:"Anillo Zafiro 02, foto del taller"},
    {n:"Anillo Granate 03", tipo:"anillo", g:4.2, piedra:"rojo", consultar:true,
     mas:["piezas/gal/anillo-077-2.jpg", "piezas/gal/anillo-077-3.jpg"], img:"piezas/anillo-077.jpg", alt:"Anillo Granate 03, foto del taller"},
    {n:"Anillo Citrino 06", tipo:"anillo", g:4.2, piedra:"amarillo", consultar:true,
     mas:["piezas/gal/anillo-078-2.jpg", "piezas/gal/anillo-078-3.jpg"], img:"piezas/anillo-078.jpg", alt:"Anillo Citrino 06, foto del taller"},
    {n:"Anillo Aguamarina 02", tipo:"anillo", g:4.2, piedra:"celeste", consultar:true,
     mas:["piezas/gal/anillo-079-2.jpg", "piezas/gal/anillo-079-3.jpg"], img:"piezas/anillo-079.jpg", alt:"Anillo Aguamarina 02, foto del taller"},
    {n:"Anillo Zafiro 03", tipo:"anillo", g:4.2, piedra:"azul", consultar:true,
     mas:["piezas/gal/anillo-080-2.jpg", "piezas/gal/anillo-080-3.jpg"], img:"piezas/anillo-080.jpg", alt:"Anillo Zafiro 03, foto del taller"},
    {n:"Anillo Turmalina 01", tipo:"anillo", g:4.2, piedra:"rosa", consultar:true,
     mas:["piezas/gal/anillo-081-2.jpg", "piezas/gal/anillo-081-3.jpg"], img:"piezas/anillo-081.jpg", alt:"Anillo Turmalina 01, foto del taller"},
    {n:"Anillo Citrino 07", tipo:"anillo", g:4.2, piedra:"amarillo", consultar:true,
     mas:["piezas/gal/anillo-082-2.jpg", "piezas/gal/anillo-082-3.jpg"], img:"piezas/anillo-082.jpg", alt:"Anillo Citrino 07, foto del taller"},
    {n:"Anillo Zafiro 04", tipo:"anillo", g:4.2, piedra:"azul", consultar:true,
     mas:["piezas/gal/anillo-083-2.jpg", "piezas/gal/anillo-083-3.jpg"], img:"piezas/anillo-083.jpg", alt:"Anillo Zafiro 04, foto del taller"},
    {n:"Anillo Amatista 02", tipo:"anillo", g:4.2, piedra:"morado", consultar:true,
     mas:["piezas/gal/anillo-084-2.jpg", "piezas/gal/anillo-084-3.jpg"], img:"piezas/anillo-084.jpg", alt:"Anillo Amatista 02, foto del taller"},
    {n:"Anillo Aguamarina 03", tipo:"anillo", g:4.2, piedra:"celeste", consultar:true,
     mas:["piezas/gal/anillo-085-2.jpg", "piezas/gal/anillo-085-3.jpg"], img:"piezas/anillo-085.jpg", alt:"Anillo Aguamarina 03, foto del taller"},
    {n:"Anillo Aguamarina 04", tipo:"anillo", g:4.2, piedra:"celeste", consultar:true,
     mas:["piezas/gal/anillo-086-2.jpg", "piezas/gal/anillo-086-3.jpg"], img:"piezas/anillo-086.jpg", alt:"Anillo Aguamarina 04, foto del taller"},
    {n:"Anillo Granate 04", tipo:"anillo", g:4.2, piedra:"rojo", consultar:true,
     mas:["piezas/gal/anillo-087-2.jpg", "piezas/gal/anillo-087-3.jpg"], img:"piezas/anillo-087.jpg", alt:"Anillo Granate 04, foto del taller"},
    {n:"Anillo Turmalina 02", tipo:"anillo", g:4.2, piedra:"rosa", consultar:true,
     mas:["piezas/gal/anillo-088-2.jpg", "piezas/gal/anillo-088-3.jpg"], img:"piezas/anillo-088.jpg", alt:"Anillo Turmalina 02, foto del taller"},
    {n:"Anillo Citrino 08", tipo:"anillo", g:4.2, piedra:"amarillo", consultar:true,
     mas:["piezas/gal/anillo-089-2.jpg", "piezas/gal/anillo-089-3.jpg"], img:"piezas/anillo-089.jpg", alt:"Anillo Citrino 08, foto del taller"},
    {n:"Anillo Granate 05", tipo:"anillo", g:4.2, piedra:"rojo", consultar:true,
     mas:["piezas/gal/anillo-090-2.jpg", "piezas/gal/anillo-090-3.jpg"], img:"piezas/anillo-090.jpg", alt:"Anillo Granate 05, foto del taller"},
    {n:"Anillo Aguamarina 05", tipo:"anillo", g:4.2, piedra:"celeste", consultar:true,
     mas:["piezas/gal/anillo-091-2.jpg"], img:"piezas/anillo-091.jpg", alt:"Anillo Aguamarina 05, foto del taller"},
    {n:"Anillo Aguamarina 06", tipo:"anillo", g:4.2, piedra:"celeste", consultar:true,
     mas:["piezas/gal/anillo-092-2.jpg", "piezas/gal/anillo-092-3.jpg"], img:"piezas/anillo-092.jpg", alt:"Anillo Aguamarina 06, foto del taller"},
    {n:"Anillo Turmalina 03", tipo:"anillo", g:4.2, piedra:"rosa", consultar:true,
     mas:["piezas/gal/anillo-093-2.jpg", "piezas/gal/anillo-093-3.jpg"], img:"piezas/anillo-093.jpg", alt:"Anillo Turmalina 03, foto del taller"},
    {n:"Anillo Aguamarina 07", tipo:"anillo", g:4.2, piedra:"celeste", consultar:true,
     mas:["piezas/gal/anillo-094-2.jpg", "piezas/gal/anillo-094-3.jpg"], img:"piezas/anillo-094.jpg", alt:"Anillo Aguamarina 07, foto del taller"},
    {n:"Anillo Zafiro 05", tipo:"anillo", g:4.2, piedra:"azul", consultar:true,
     mas:["piezas/gal/anillo-095-2.jpg", "piezas/gal/anillo-095-3.jpg"], img:"piezas/anillo-095.jpg", alt:"Anillo Zafiro 05, foto del taller"},
    {n:"Anillo Zafiro 06", tipo:"anillo", g:4.2, piedra:"azul", consultar:true,
     mas:["piezas/gal/anillo-097-2.jpg", "piezas/gal/anillo-097-3.jpg"], img:"piezas/anillo-097.jpg", alt:"Anillo Zafiro 06, foto del taller"},
    {n:"Anillo Amatista 03", tipo:"anillo", g:4.2, piedra:"morado", consultar:true,
     mas:["piezas/gal/anillo-098-2.jpg", "piezas/gal/anillo-098-3.jpg"], img:"piezas/anillo-098.jpg", alt:"Anillo Amatista 03, foto del taller"},
    {n:"Anillo Zafiro 07", tipo:"anillo", g:4.2, piedra:"azul", consultar:true,
     mas:["piezas/gal/anillo-101-2.jpg", "piezas/gal/anillo-101-3.jpg"], img:"piezas/anillo-101.jpg", alt:"Anillo Zafiro 07, foto del taller"},
    {n:"Anillo Citrino 09", tipo:"anillo", g:4.2, piedra:"amarillo", consultar:true,
     mas:["piezas/gal/anillo-102-2.jpg", "piezas/gal/anillo-102-3.jpg"], img:"piezas/anillo-102.jpg", alt:"Anillo Citrino 09, foto del taller"},
    {n:"Anillo Citrino 10", tipo:"anillo", g:4.2, piedra:"amarillo", consultar:true,
     mas:["piezas/gal/anillo-103-2.jpg", "piezas/gal/anillo-103-3.jpg"], img:"piezas/anillo-103.jpg", alt:"Anillo Citrino 10, foto del taller"},
    {n:"Anillo Aguamarina 08", tipo:"anillo", g:4.2, piedra:"celeste", consultar:true,
     mas:["piezas/gal/anillo-104-2.jpg", "piezas/gal/anillo-104-3.jpg"], img:"piezas/anillo-104.jpg", alt:"Anillo Aguamarina 08, foto del taller"},
    {n:"Anillo Granate 06", tipo:"anillo", g:4.2, piedra:"rojo", consultar:true,
     mas:["piezas/gal/anillo-105-2.jpg", "piezas/gal/anillo-105-3.jpg"], img:"piezas/anillo-105.jpg", alt:"Anillo Granate 06, foto del taller"},
    {n:"Anillo Cuarzo 01", tipo:"anillo", g:4.2, piedra:"blanco", consultar:true,
     mas:["piezas/gal/anillo-106-2.jpg", "piezas/gal/anillo-106-3.jpg"], img:"piezas/anillo-106.jpg", alt:"Anillo Cuarzo 01, foto del taller"},
    {n:"Anillo Citrino 11", tipo:"anillo", g:4.2, piedra:"amarillo", consultar:true,
     mas:["piezas/gal/anillo-107-2.jpg", "piezas/gal/anillo-107-3.jpg"], img:"piezas/anillo-107.jpg", alt:"Anillo Citrino 11, foto del taller"},
    {n:"Anillo Granate 07", tipo:"anillo", g:4.2, piedra:"rojo", consultar:true,
     mas:["piezas/gal/anillo-108-2.jpg", "piezas/gal/anillo-108-3.jpg"], img:"piezas/anillo-108.jpg", alt:"Anillo Granate 07, foto del taller"},
    {n:"Anillo Granate 08", tipo:"anillo", g:4.2, piedra:"rojo", consultar:true,
     mas:["piezas/gal/anillo-109-2.jpg", "piezas/gal/anillo-109-3.jpg"], img:"piezas/anillo-109.jpg", alt:"Anillo Granate 08, foto del taller"},
  ],
  "Aros de Boda":[
  ],
  "Cadenas y Esclavas":[
    {n:"Cadena eslabón marino 4x3", tipo:"cadena", g:11.0, medida:"4x3", consultar:true,
     mas:["piezas/gal/cadena-000-2.jpg", "piezas/gal/cadena-000-3.jpg"], img:"piezas/cadena-000.jpg", alt:"Cadena eslabón marino 4x3, foto del taller"},
    {n:"Cadena eslabón marino 6x4", tipo:"cadena", g:11.0, medida:"6x4", consultar:true,
     img:"piezas/cadena-001.jpg", alt:"Cadena eslabón marino 6x4, foto del taller"},
    {n:"Cadena eslabón marino 10x8", tipo:"cadena", g:11.0, medida:"10x8", consultar:true,
     mas:["piezas/gal/cadena-002-2.jpg", "piezas/gal/cadena-002-3.jpg"], img:"piezas/cadena-002.jpg", alt:"Cadena eslabón marino 10x8, foto del taller"},
    {n:"Cadena eslabón marino 6x8", tipo:"cadena", g:11.0, medida:"6x8", consultar:true,
     mas:["piezas/gal/cadena-003-2.jpg", "piezas/gal/cadena-003-3.jpg"], img:"piezas/cadena-003.jpg", alt:"Cadena eslabón marino 6x8, foto del taller"},
    {n:"Cadena eslabón marino 6x8 en plata", tipo:"cadena", g:11.0, medida:"6x8", consultar:true,
     mas:["piezas/gal/cadena-004-2.jpg", "piezas/gal/cadena-004-3.jpg"], img:"piezas/cadena-004.jpg", alt:"Cadena eslabón marino 6x8 en plata, foto del taller"},
    {n:"Cadena con dije de las Tres Gracias", tipo:"cadena", g:11.0, unica:true, consultar:true,
     mas:["piezas/gal/cadena-005-2.jpg", "piezas/gal/cadena-005-3.jpg"], img:"piezas/cadena-005.jpg", alt:"Cadena con dije de las Tres Gracias, foto del taller"},
    {n:"Cadena con dije y medalla", tipo:"cadena", g:11.0, stock:true, consultar:true,
     mas:["piezas/gal/cadena-009-2.jpg"], img:"piezas/cadena-009.jpg", alt:"Cadena con dije y medalla, foto del taller"},
    {n:"Cadena fina de oro", tipo:"cadena", g:11.0, stock:true, consultar:true,
     mas:["piezas/gal/cadena-010-2.jpg", "piezas/gal/cadena-010-3.jpg"], img:"piezas/cadena-010.jpg", alt:"Cadena fina de oro, foto del taller"},
  ],
  "Pulseras":[
    {n:"Pulsera de esferas volcánicas", tipo:"pulsera", g:9.0, unica:true, consultar:true,
     mas:["piezas/gal/pulsera-011-2.jpg", "piezas/gal/pulsera-011-3.jpg"], img:"piezas/pulsera-011.jpg", alt:"Pulsera de esferas volcánicas, foto del taller"},
  ],
  "Zarcillos":[
    {n:"Zarcillo 10x8", tipo:"zarcillo", g:2.4, medida:"10x8", consultar:true,
     img:"piezas/zarcillo-006.jpg", alt:"Zarcillo 10x8, foto del taller"},
    {n:"Zarcillo 6x8", tipo:"zarcillo", g:2.4, medida:"6x8", consultar:true,
     img:"piezas/zarcillo-007.jpg", alt:"Zarcillo 6x8, foto del taller"},
    {n:"Zarcillo 6x4", tipo:"zarcillo", g:2.4, medida:"6x4", consultar:true,
     mas:["piezas/gal/zarcillo-008-2.jpg"], img:"piezas/zarcillo-008.jpg", alt:"Zarcillo 6x4, foto del taller"},
  ],
  "Dijes":[
  ],
};
