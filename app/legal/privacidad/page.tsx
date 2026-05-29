import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de Kalcetos conforme al RGPD y LOPDGDD.",
};

export default function PrivacidadPage() {
  return (
    <>
      <h1>Política de Privacidad</h1>
      <p className="text-xs uppercase tracking-wider">
        Última actualización: 29 de mayo de 2026
      </p>

      <div className="rounded-md border-l-4 border-primary bg-primary/5 p-4 text-sm">
        <strong>⚠ Datos fiscales pendientes.</strong> Esta tienda es un demo en
        preparación. Los datos del responsable del tratamiento deben
        completarse antes de procesar datos reales de clientes.
      </div>

      <h2>Responsable del tratamiento</h2>
      <table>
        <tbody>
          <tr>
            <th>Nombre / Razón social</th>
            <td>DEMO — pendiente de rellenar</td>
          </tr>
          <tr>
            <th>NIF / CIF</th>
            <td>DEMO — pendiente</td>
          </tr>
          <tr>
            <th>Domicilio</th>
            <td>DEMO — pendiente</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>privacidad@kalcetos.shop</td>
          </tr>
        </tbody>
      </table>

      <h2>Datos que recogemos y para qué</h2>

      <h3>Gestión de pedidos</h3>
      <p>
        <strong>Datos:</strong> nombre, email, dirección de envío y facturación,
        teléfono (si lo facilitas), historial de pedidos.
      </p>
      <p>
        <strong>Finalidad:</strong> tramitar tu compra, prepararla, enviarla y
        gestionar devoluciones, reclamaciones y obligaciones contables.
      </p>
      <p>
        <strong>Base legal:</strong> ejecución de un contrato (art. 6.1.b RGPD)
        y obligación legal contable y fiscal (art. 6.1.c RGPD).
      </p>
      <p>
        <strong>Conservación:</strong> mientras dure la relación comercial y,
        después, durante los plazos legales obligatorios (hasta 6 años para
        facturación).
      </p>

      <h3>Pago</h3>
      <p>
        <strong>Datos:</strong> los datos de tarjeta los gestiona Stripe Inc. de
        forma cifrada. Nosotros nunca vemos ni almacenamos tu número de
        tarjeta.
      </p>
      <p>
        <strong>Finalidad:</strong> procesar el pago.
      </p>
      <p>
        <strong>Base legal:</strong> ejecución del contrato (art. 6.1.b RGPD).
      </p>

      <h3>Newsletter / comunicaciones comerciales (si te suscribes)</h3>
      <p>
        <strong>Datos:</strong> email.
      </p>
      <p>
        <strong>Finalidad:</strong> enviarte novedades, ofertas y contenido de
        Kalcetos.
      </p>
      <p>
        <strong>Base legal:</strong> consentimiento explícito (art. 6.1.a RGPD).
        Puedes darte de baja en cualquier momento desde el enlace en cada email.
      </p>

      <h2>Destinatarios de los datos</h2>
      <p>
        Tus datos no se ceden a terceros salvo obligación legal. Para prestar el
        servicio usamos los siguientes proveedores (encargados del tratamiento),
        todos con garantías adecuadas de protección de datos:
      </p>
      <table>
        <thead>
          <tr>
            <th>Proveedor</th>
            <th>Para qué</th>
            <th>Tratamiento en</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Supabase Inc.</td>
            <td>Base de datos del catálogo y pedidos</td>
            <td>UE (Frankfurt)</td>
          </tr>
          <tr>
            <td>Stripe Inc.</td>
            <td>Procesamiento de pagos</td>
            <td>UE / EEUU (con cláusulas contractuales tipo)</td>
          </tr>
          <tr>
            <td>Resend Inc.</td>
            <td>Email transaccional (confirmaciones de pedido)</td>
            <td>UE</td>
          </tr>
          <tr>
            <td>Vercel Inc.</td>
            <td>Hosting de la web</td>
            <td>UE</td>
          </tr>
          <tr>
            <td>Meta Platforms Inc.</td>
            <td>Pixel/CAPI para medir conversiones de campañas</td>
            <td>UE / EEUU (con CCT). Solo si aceptas marketing en cookies</td>
          </tr>
        </tbody>
      </table>

      <h2>Tus derechos</h2>
      <p>
        Puedes ejercer los siguientes derechos escribiendo a{" "}
        <a href="mailto:privacidad@kalcetos.shop">privacidad@kalcetos.shop</a>{" "}
        con el asunto "Protección de datos":
      </p>
      <ul>
        <li>
          <strong>Acceso</strong>: saber qué datos tenemos sobre ti.
        </li>
        <li>
          <strong>Rectificación</strong>: corregir datos incorrectos.
        </li>
        <li>
          <strong>Supresión</strong> (derecho al olvido): que eliminemos tus
          datos.
        </li>
        <li>
          <strong>Oposición</strong>: oponerte al tratamiento en ciertos casos.
        </li>
        <li>
          <strong>Limitación</strong>: restringir el tratamiento en ciertos
          casos.
        </li>
        <li>
          <strong>Portabilidad</strong>: recibir tus datos en formato legible
          por máquina.
        </li>
        <li>
          <strong>Retirar el consentimiento</strong>: en cualquier momento, sin
          que afecte al tratamiento previo.
        </li>
      </ul>
      <p>
        También puedes presentar una reclamación ante la{" "}
        <strong>Agencia Española de Protección de Datos (AEPD)</strong>:{" "}
        <a
          href="https://www.aepd.es"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.aepd.es
        </a>
        .
      </p>

      <h2>Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas para proteger tus datos:
        conexión HTTPS, acceso restringido a la base de datos, backups,
        autenticación segura y cifrado de pagos.
      </p>

      <h2>Cambios en esta política</h2>
      <p>
        Podemos actualizar esta política. Te informaremos de cambios relevantes
        por email o mediante aviso en la web. La fecha de última actualización
        aparece al inicio del documento.
      </p>

      <p className="text-xs">
        Esta política cumple con el{" "}
        <strong>Reglamento (UE) 2016/679 (RGPD)</strong>, la{" "}
        <strong>Ley Orgánica 3/2018 (LOPDGDD)</strong> y la{" "}
        <strong>Ley 34/2002 (LSSI)</strong>. Ver también:{" "}
        <Link href="/legal/cookies">política de cookies</Link>.
      </p>
    </>
  );
}
