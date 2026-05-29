import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Política de cookies de Kalcetos conforme a la guía AEPD.",
};

export default function CookiesPage() {
  return (
    <>
      <h1>Política de Cookies</h1>
      <p className="text-xs uppercase tracking-wider">
        Última actualización: 29 de mayo de 2026
      </p>

      <h2>¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos de texto que los sitios web almacenan
        en tu dispositivo al visitarlos. Permiten recordar información sobre tu
        visita (idioma, preferencias, carrito) para mejorar tu experiencia.
      </p>

      <h2>Cookies que usamos</h2>

      <h3>Cookies técnicas (estrictamente necesarias)</h3>
      <p>
        No requieren tu consentimiento porque son imprescindibles para el
        funcionamiento básico de la web.
      </p>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Finalidad</th>
            <th>Duración</th>
            <th>Proveedor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>kalcetos-cart-v1</td>
            <td>Mantener tu carrito entre visitas</td>
            <td>Localmente en navegador</td>
            <td>Propio</td>
          </tr>
          <tr>
            <td>kalcetos-consent</td>
            <td>Recordar tu elección sobre cookies</td>
            <td>12 meses</td>
            <td>Propio</td>
          </tr>
          <tr>
            <td>__stripe_*</td>
            <td>Prevenir fraude en el pago</td>
            <td>Sesión / 1 año</td>
            <td>Stripe</td>
          </tr>
        </tbody>
      </table>

      <h3>Cookies analíticas (requieren consentimiento)</h3>
      <p>
        Nos permiten medir el uso de la web para mejorarla. Solo se cargan si
        las aceptas en el banner de cookies.
      </p>
      <p>
        <em>
          Pendiente de configuración. Cuando integremos analítica, esta tabla se
          completará con los identificadores reales.
        </em>
      </p>

      <h3>Cookies de marketing / publicidad (requieren consentimiento)</h3>
      <p>
        Solo se instalan si aceptas marketing en el banner de cookies. Nos
        permiten medir la efectividad de las campañas y mostrarte anuncios
        relevantes.
      </p>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Finalidad</th>
            <th>Duración</th>
            <th>Proveedor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>_fbp</td>
            <td>Seguimiento de conversiones Meta Ads</td>
            <td>3 meses</td>
            <td>Meta (Facebook)</td>
          </tr>
          <tr>
            <td>_fbc</td>
            <td>Atribución de clics de anuncios</td>
            <td>2 años</td>
            <td>Meta (Facebook)</td>
          </tr>
        </tbody>
      </table>

      <h2>Cómo gestionar las cookies</h2>

      <h3>Desde el banner de cookies</h3>
      <p>
        Al entrar en la web por primera vez aparece un banner donde puedes
        aceptar todas, rechazar todas o configurar por categoría. Puedes
        cambiar tus preferencias en cualquier momento borrando la cookie{" "}
        <code>kalcetos-consent</code> desde tu navegador y recargando la web.
      </p>

      <h3>Desde tu navegador</h3>
      <p>
        Puedes configurar tu navegador para bloquear o eliminar cookies:
      </p>
      <ul>
        <li>
          <strong>Chrome</strong>: Configuración → Privacidad y seguridad →
          Cookies
        </li>
        <li>
          <strong>Firefox</strong>: Opciones → Privacidad y seguridad
        </li>
        <li>
          <strong>Safari</strong>: Preferencias → Privacidad
        </li>
        <li>
          <strong>Edge</strong>: Configuración → Privacidad, búsqueda y servicios
        </li>
      </ul>
      <p>
        Ten en cuenta que bloquear cookies técnicas puede afectar al
        funcionamiento de la web (carrito, pago).
      </p>

      <h2>Más información</h2>
      <ul>
        <li>
          <a
            href="https://www.aepd.es"
            target="_blank"
            rel="noopener noreferrer"
          >
            Agencia Española de Protección de Datos (AEPD)
          </a>
        </li>
        <li>
          <a
            href="https://www.aepd.es/guia-cookies"
            target="_blank"
            rel="noopener noreferrer"
          >
            Guía de cookies AEPD
          </a>
        </li>
        <li>
          <Link href="/legal/privacidad">Nuestra política de privacidad</Link>
        </li>
      </ul>

      <p className="text-xs">
        Conforme a la Ley 34/2002 (LSSI), el RGPD y la Guía sobre el uso de las
        cookies de la AEPD (2023).
      </p>
    </>
  );
}
