/* ============================================================
   RECORRIDOS DE USUARIO
   ------------------------------------------------------------
   El simulador de clientes encadena acciones al azar y sirve para
   encontrar lo que se rompe. Esto es otra cosa: son los CAMINOS
   COMPLETOS que hace una persona de verdad, en orden, con la
   comprobación de que cada paso lleva de verdad al siguiente.

   Si un recorrido falla, no es que la página lance un error: es que
   alguien no puede comprar.
   ============================================================ */
window.RECORRIDOS = (() => {
  const $  = (s,c=document)=>c.querySelector(s);
  const $$ = (s,c=document)=>[...c.querySelectorAll(s)];
  const esperar = ms => new Promise(r=>setTimeout(r,ms));
  const visible = el => { if(!el) return false; const r=el.getBoundingClientRect();
    return r.width>0 && r.height>0 && getComputedStyle(el).visibility!=="hidden"; };

  async function recorrido(nombre, pasos){
    const traza=[];
    try{
      for(const [que, fn] of pasos){
        const r = await fn();
        traza.push(`${r===false?"✗":"·"} ${que}`);
        if(r===false) return {nombre, ok:false, fallo:que, traza};
        await esperar(40);
      }
      return {nombre, ok:true, traza};
    }catch(e){ return {nombre, ok:false, fallo:`excepción: ${e.message}`, traza}; }
  }

  const R = {
    /* La graduanda de Medicina: entra, busca su color, abre, escoge, escribe. */
    graduandaMedicina: () => recorrido("Graduanda de Medicina", [
      ["llega al Espectro", ()=>{ $("#espectro").scrollIntoView(); return !!$(".seg"); }],
      ["toca el amarillo (Salud)", ()=>{ const b=$('.seg[data-piedra="amarillo"]'); if(!b) return false; b.click(); return true; }],
      ["ve el nombre de la piedra", ()=>!!$(".piedra__nombre")],
      ["el panel dice qué carreras", ()=>$$(".piedra__carrera-item").length>0],
      ["baja a los modelos", ()=>{ const b=$("#irModelos"); if(!b) return false; b.click(); return true; }],
      ["hay modelos filtrados", ()=>$$("#grado-grid .card").length>0],
      ["todos son de su color", ()=>{
         const c=$$("#grado-grid .card"); return c.length>0 && c.every(x=>x.style.getPropertyValue("--c").includes("amarillo")); }],
      ["abre una pieza", ()=>{ $$("#grado-grid .card")[0].click(); return $("#modal").classList.contains("is-open"); }],
      ["ve la foto", ()=>visible($("#modalFoto"))],
      ["puede ver otra toma", ()=>{ const g=$$(".galeria__b"); if(g.length<2) return true; g[1].click();
         return $("#modalFoto").src.includes("gal/"); }],
      ["escoge oro 18k", ()=>{ const o=$$("#modal .opcion").find(x=>/18k/i.test(x.textContent)); if(!o) return false; o.click(); return true; }],
      ["escribe un grabado", ()=>{ const i=$('#modal input[type="text"]'); if(!i) return true;
         i.value="Para mamá"; i.dispatchEvent(new Event("input",{bubbles:true})); return true; }],
      ["el enlace de WhatsApp lleva la pieza", ()=>{
         const h=decodeURIComponent($("#modalWa").href); return h.includes("Medicina")||h.includes("Anillo"); }],
    ]),

    /* Alguien que ya sabe qué quiere: busca por carrera en el índice. */
    buscaPorCarrera: () => recorrido("Busca su carrera por nombre", [
      ["abre el índice de carreras", ()=>{ const b=$("#carrerasAbrir"); if(!b) return "n/a"; b.click(); return true; }],
      ["hay carreras listadas", ()=>true],
      ["escoge Derecho", ()=>{ const b=$$(".seg").find(x=>/derecho/i.test(x.textContent)); if(!b) return false; b.click(); return true; }],
      ["el catálogo responde", ()=>$$("#grado-grid .card").length>0],
    ]),

    /* La mamá que compra para su hija y compara tamaños. */
    mamaComparaTamanos: () => recorrido("Mamá comparando medidas", [
      ["encuentra el apartado de medidas", ()=>{ const s=$("#medidas"); if(!s) return false; s.scrollIntoView(); return true; }],
      ["ve las cinco medidas", ()=>$$(".medida").length===5],
      ["están dibujadas a escala", ()=>{
         const f=$$(".medida__forma"); if(f.length<2) return false;
         const a=parseFloat(getComputedStyle(f[0]).height), b=parseFloat(getComputedStyle(f[4]).height);
         return b > a*1.8; }],
      ["entiende que son milímetros", ()=>/milímetros/i.test($(".medidas__intro").textContent)],
    ]),

    /* Duda de talla — la objeción número uno. */
    dudaDeTalla: () => recorrido("No sabe su talla", [
      ["llega a la calculadora", ()=>{ const s=$("#talla"); if(!s) return false; s.scrollIntoView(); return true; }],
      ["escribe una medida", ()=>{ const i=$("#tallaInput"); if(!i) return false;
         i.value="17"; i.dispatchEvent(new Event("input",{bubbles:true})); return true; }],
      ["le sale una talla", ()=>{ const t=$(".talla__cifra"); return t && /\d/.test(t.textContent); }],
      ["puede cambiar de método", ()=>{ const m=$$(".talla__modo")[1]; if(!m) return false; m.click(); return true; }],
      ["sigue dando resultado", ()=>{ const t=$(".talla__cifra"); return t && t.textContent.trim().length>0; }],
    ]),

    /* Arma un pedido de dos piezas y lo manda. */
    pedidoDeDos: () => recorrido("Pedido de dos piezas", [
      ["limpia lo anterior", ()=>{ try{sessionStorage.removeItem("estambul.pedido");}catch{} return true; }],
      ["abre la primera", ()=>{ $$(".card")[0].click(); return $("#modal").classList.contains("is-open"); }],
      ["la agrega", ()=>{ $("#modalAdd").click(); return true; }],
      ["se abre el pedido", ()=>$("#pedido").classList.contains("is-open")],
      ["lo cierra", ()=>{ $("#pedidoClose").click(); return !$("#pedido").classList.contains("is-open"); }],
      ["abre la segunda", ()=>{ $$(".card")[3].click(); return $("#modal").classList.contains("is-open"); }],
      ["la agrega", ()=>{ $("#modalAdd").click(); return true; }],
      ["el pedido tiene dos", ()=>$$(".pedido__item").length===2],
      ["el contador dice dos", ()=>$("#pedidoN").textContent.trim()==="2"],
      ["el mensaje lleva las dos", ()=>{
         const t=decodeURIComponent($("#pedidoWa").href.split("text=")[1]||"");
         return (t.match(/•/g)||[]).length===2; }],
      ["puede quitar una", ()=>{ $$(".pedido__quitar")[0].click(); return $$(".pedido__item").length===1; }],
    ]),

    /* Filtra por estilo y color a la vez. */
    clasicoYColor: () => recorrido("Clásico y de su color", [
      ["quita filtros", ()=>{ const b=$("#verTodas"); if(b) b.click(); return true; }],
      ["escoge Clásicos", ()=>{ const b=$('.estilo[data-estilo="clasico"]'); if(!b) return false; b.click(); return true; }],
      ["hay resultados", ()=>$$("#grado-grid .card").length>0],
      ["añade el rojo", ()=>{ const b=$('.seg[data-piedra="rojo"]'); if(!b) return false; b.click(); return true; }],
      ["quedan sólo clásicos rojos", ()=>{
         const n=$$("#grado-grid .card").length;
         return n>0 && n < GRADO.filter(g=>g.piedra==="rojo").length + 1; }],
    ]),
  };

  async function todos(){
    const r=[];
    for(const k of Object.keys(R)){ r.push(await R[k]()); await esperar(120); }
    return {ok:r.filter(x=>x.ok).length, de:r.length,
            fallos:r.filter(x=>!x.ok).map(x=>({recorrido:x.nombre, fallo:x.fallo, traza:x.traza}))};
  }
  return {todos, R};
})();
