/**
 * Meta Pixel — solo se carga si NEXT_PUBLIC_META_PIXEL_ID está configurado.
 * Respeta Consent Mode V2: el Pixel inicia tras `consent: granted` para marketing.
 *
 * Server Component que inyecta un <script> inline. Se ejecuta antes de
 * cualquier interacción para que `fbq` esté disponible cuando los componentes
 * cliente disparen eventos.
 */

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

const PIXEL_INIT = (id: string) => `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');

// Respeta el consentimiento: si el usuario no ha aceptado marketing,
// Pixel queda inicializado pero no envía hasta que llegue grant_consent.
fbq('consent', 'revoke');
fbq('init', '${id}');
fbq('track', 'PageView');

// Cuando cookie-banner haga consent grant, lo conectamos.
(function(){
  var name = 'kalcetos-consent=';
  var parts = document.cookie.split('; ');
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].indexOf(name) === 0) {
      try {
        var c = JSON.parse(decodeURIComponent(parts[i].substring(name.length)));
        if (c.marketing) {
          fbq('consent', 'grant');
        }
      } catch(e) {}
      break;
    }
  }
})();
`;

export function MetaPixel() {
  if (!PIXEL_ID) return null;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: PIXEL_INIT(PIXEL_ID) }} />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
