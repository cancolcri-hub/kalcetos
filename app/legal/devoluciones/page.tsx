import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devoluciones",
  description:
    "Política de devoluciones de Kalcetos conforme a la Ley de Consumo (14 días de desistimiento).",
};

export default function DevolucionesPage() {
  return (
    <>
      <h1>Devoluciones y desistimiento</h1>
      <p className="text-xs uppercase tracking-wider">
        Última actualización: 29 de mayo de 2026
      </p>

      <div className="rounded-md border-l-4 border-primary bg-primary/5 p-4 text-sm">
        <strong>⚠ Política pendiente de afinar.</strong> Los plazos, dirección
        de devolución y quién asume los gastos de envío se deben confirmar
        antes de aceptar pedidos reales. Esta versión refleja los mínimos
        legales para España.
      </div>

      <h2>Derecho de desistimiento (14 días)</h2>
      <p>
        Conforme al Real Decreto Legislativo 1/2007 (Ley General para la
        Defensa de los Consumidores y Usuarios), tienes derecho a desistir de
        tu compra en un plazo de <strong>14 días naturales</strong> desde que
        recibes el pedido, sin necesidad de justificar la decisión y sin
        penalización.
      </p>

      <h2>Cómo solicitar la devolución</h2>
      <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
        <li>
          Escríbenos a{" "}
          <a
            href="mailto:devoluciones@kalcetos.shop"
            className="text-primary underline"
          >
            devoluciones@kalcetos.shop
          </a>{" "}
          indicando el número de pedido y el motivo (opcional). Te
          contestaremos en menos de 48 h con las instrucciones.
        </li>
        <li>
          Devuelve los calcetines{" "}
          <strong>sin usar, con etiquetas y embalaje original</strong>, en un
          plazo de 14 días desde que nos avisas.
        </li>
        <li>
          En cuanto recibamos y revisemos la devolución (máximo 14 días desde
          la recepción), te reembolsamos por el mismo medio de pago que usaste.
        </li>
      </ol>

      <h2>Gastos de devolución</h2>
      <p>
        <strong>Por defecto, los gastos de envío de la devolución corren a
        cargo del cliente</strong>, salvo si el producto llegó defectuoso o
        equivocado por nuestra parte — en ese caso, los asumimos nosotros.
      </p>

      <h2>Productos no aptos para devolución</h2>
      <p>Conforme al art. 103 RDL 1/2007, no se aceptan devoluciones de:</p>
      <ul>
        <li>
          Calcetines <strong>usados</strong>, abiertos o sin embalaje original,
          por razones de higiene.
        </li>
        <li>
          Productos personalizados o hechos a medida (no aplica a nuestro
          catálogo actual).
        </li>
      </ul>

      <h2>Productos defectuosos o equivocados</h2>
      <p>
        Si recibes un producto defectuoso o distinto del pedido, escríbenos en
        las 48 h siguientes a la recepción. Asumimos los gastos de envío de la
        devolución y te enviamos un producto correcto sin coste adicional o,
        si prefieres, te reembolsamos el importe completo.
      </p>

      <h2>Plazo de reembolso</h2>
      <p>
        Una vez recibida y verificada la devolución, el reembolso se procesa en
        un plazo máximo de <strong>14 días naturales</strong>. El abono se
        realiza por el mismo medio de pago que usaste en la compra. El plazo en
        que veas el dinero en tu cuenta depende de tu banco.
      </p>

      <h2>Garantía legal</h2>
      <p>
        Todos nuestros productos tienen una garantía legal de{" "}
        <strong>3 años</strong> conforme a la Ley 7/1996 y RDL 7/2021. Esta
        garantía cubre defectos de fabricación o conformidad, no el desgaste
        normal por uso.
      </p>
    </>
  );
}
