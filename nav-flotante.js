/**
 * nav-flotante.js — botón "← Proyectos" para las páginas de cada proyecto.
 * Agrégalo antes de </body> en cada proyecto:  <script src="/nav-flotante.js"></script>
 * Vuelve al portafolio en el mismo punto donde estabas (lo recuerda main.js).
 * Si publicas en un subdirectorio (p. ej. GitHub Pages de proyecto), cambia INICIO.
 */
(function () {
   var INICIO = "/index.html?volver=1";

   var boton = document.createElement("a");
   boton.href = INICIO;
   boton.textContent = "← Proyectos";
   boton.setAttribute("aria-label", "Volver al portafolio");
   Object.assign(boton.style, {
      position: "fixed", left: "16px", bottom: "16px", zIndex: "999999",
      padding: "10px 18px", borderRadius: "999px",
      background: "rgba(20, 20, 20, 0.85)", color: "#fff",
      fontFamily: "system-ui, sans-serif", fontSize: "14px", fontWeight: "600",
      textDecoration: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
      backdropFilter: "blur(6px)", transition: "transform .15s ease, opacity .15s ease", opacity: "0.9",
   });
   boton.addEventListener("mouseenter", function () { boton.style.transform = "translateY(-2px)"; boton.style.opacity = "1"; });
   boton.addEventListener("mouseleave", function () { boton.style.transform = "translateY(0)"; boton.style.opacity = "0.9"; });

   function poner() { if (!boton.isConnected) document.body.appendChild(boton); }
   if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", poner);
   else poner();
})();
