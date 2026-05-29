/**
 * Inline <script> que inicializa window.dataLayer + gtag y pone Consent Mode V2
 * en estado "denied" por defecto antes de cualquier otro script.
 *
 * Si la cookie de consentimiento ya existe, se aplica esa elección.
 * Sin esto, Pixel/CAPI y analytics no respetarían GDPR en el primer paint.
 */

const INLINE_SCRIPT = `
(function(){
  try {
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;

    // Defaults: todo denegado salvo lo estrictamente necesario.
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
      wait_for_update: 500,
    });

    // Si ya hay elección guardada, aplicarla inmediatamente.
    var name = 'kalcetos-consent=';
    var parts = document.cookie.split('; ');
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].indexOf(name) === 0) {
        try {
          var raw = decodeURIComponent(parts[i].substring(name.length));
          var c = JSON.parse(raw);
          var g = function(b){ return b ? 'granted' : 'denied'; };
          gtag('consent', 'update', {
            ad_storage: g(c.marketing),
            ad_user_data: g(c.marketing),
            ad_personalization: g(c.marketing),
            analytics_storage: g(c.analytics),
          });
        } catch (e) {}
        break;
      }
    }
  } catch (e) {}
})();
`;

export function ConsentInit() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: INLINE_SCRIPT }}
      // El script debe ejecutarse lo antes posible — sin async/defer.
    />
  );
}
