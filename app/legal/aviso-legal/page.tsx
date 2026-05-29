import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal de Kalcetos conforme a la Ley 34/2002 (LSSI).",
};

export default function AvisoLegalPage() {
  return (
    <>
      <h1>Aviso Legal</h1>
      <p className="text-xs uppercase tracking-wider">
        Última actualización: 29 de mayo de 2026
      </p>

      <div className="rounded-md border-l-4 border-primary bg-primary/5 p-4 text-sm">
        <strong>⚠ Datos fiscales pendientes.</strong> Esta tienda es un demo en
        preparación. Antes de operar comercialmente, los datos del titular,
        NIF, domicilio y email de contacto deben completarse con la información
        real del responsable.
      </div>

      <h2>Datos identificativos</h2>
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la
        Sociedad de la Información y del Comercio Electrónico (LSSI), se informa:
      </p>
      <table>
        <tbody>
          <tr>
            <th>Titular</th>
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
            <td>hola@kalcetos.shop</td>
          </tr>
          <tr>
            <th>Actividad</th>
            <td>Comercio electrónico minorista de moda — calcetines</td>
          </tr>
        </tbody>
      </table>

      <h2>Objeto y ámbito</h2>
      <p>
        Este aviso legal regula el uso del sitio web <strong>kalcetos.shop</strong>{" "}
        (en adelante, "la web"), propiedad del titular indicado arriba.
      </p>
      <p>
        El acceso y uso de la web atribuye la condición de usuario e implica la
        aceptación plena de este aviso legal. Si no estás de acuerdo, abstente
        de usar la web.
      </p>

      <h2>Propiedad intelectual e industrial</h2>
      <p>
        Todos los contenidos de la web (textos, imágenes, logotipos, diseño,
        código fuente) son propiedad del titular o de terceros que han
        autorizado su uso, y están protegidos por las leyes de propiedad
        intelectual e industrial. Queda prohibida su reproducción, distribución,
        modificación o comunicación pública sin autorización expresa y por
        escrito.
      </p>

      <h2>Condiciones de uso</h2>
      <ul>
        <li>Usar la web conforme a la ley, la moral y el orden público.</li>
        <li>No usar la web para actividades ilícitas o perjudiciales.</li>
        <li>No introducir virus o código malicioso.</li>
      </ul>

      <h2>Exclusión de responsabilidad</h2>
      <p>El titular no se hace responsable de:</p>
      <ul>
        <li>Los daños derivados del uso incorrecto de la web.</li>
        <li>
          Los contenidos de sitios de terceros enlazados desde esta web.
        </li>
        <li>
          Las interrupciones de servicio por causas técnicas ajenas a su
          control.
        </li>
      </ul>

      <h2>Legislación aplicable y jurisdicción</h2>
      <p>
        Este aviso legal se rige por la legislación española. Para cualquier
        controversia, las partes se someten a los juzgados y tribunales del
        domicilio del titular, renunciando a cualquier otro fuero.
      </p>
    </>
  );
}
