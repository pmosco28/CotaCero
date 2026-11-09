/**
 * Cota Cero — envío de la ficha gratis por correo.
 *
 * Cómo instalarlo en el Apps Script que ya usa la herramienta (el de APPS_SCRIPT_URL_DOCUMENTOS):
 *  1. Abre el proyecto en script.google.com, crea un archivo nuevo "enviar_ficha.gs" y pega este código.
 *  2. En tu función doPost(e), justo DESPUÉS de leer el JSON y validar el token, agrega esta línea:
 *
 *       if (data.tipo === 'enviar_ficha') return manejarEnviarFicha(data);
 *
 *     (cambia "data" por el nombre que use tu doPost para el JSON parseado).
 *  3. Implementar → Administrar implementaciones → editar la implementación actual → Versión: "Nueva
 *     versión" → Implementar. Así la URL /exec no cambia.
 *  4. La primera vez Google pide permiso para "Enviar correo como tú": acéptalo.
 *
 * Límites: una cuenta Gmail normal envía ~100 correos al día desde Apps Script (Workspace: ~1500).
 * Para evitar abusos, cada correo puede recibir hasta 5 fichas por día y el total por hora es 40.
 */
function manejarEnviarFicha(data) {
  var salida = function (obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); };
  try {
    var correo = String(data.correo || '').trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) return salida({ ok: false, error: 'correo' });
    if (!data.pdf || String(data.pdf).length > 12 * 1024 * 1024) return salida({ ok: false, error: 'pdf' });
    var predio = String(data.predio || '').replace(/[^0-9A-Za-z\-]/g, '').slice(0, 60);

    // límites anti-abuso
    var cache = CacheService.getScriptCache();
    var kC = 'fc_' + Utilities.base64EncodeWebSafe(correo), nC = Number(cache.get(kC) || 0);
    var kH = 'fh_' + Utilities.formatDate(new Date(), 'GMT-5', 'yyyyMMddHH'), nH = Number(cache.get(kH) || 0);
    if (nC >= 5 || nH >= 40) return salida({ ok: false, error: 'limite' });
    if (MailApp.getRemainingDailyQuota() < 1) return salida({ ok: false, error: 'cuota' });

    var nombre = String(data.nombre || ('Ficha-CotaCero-' + predio + '.pdf')).replace(/[^0-9A-Za-z\-_.]/g, '');
    var pdf = Utilities.newBlob(Utilities.base64Decode(data.pdf), 'application/pdf', nombre);
    var enlace = 'https://pmosco28.github.io/CotaCero/herramienta.html?clave=' + encodeURIComponent(predio);
    MailApp.sendEmail({
      to: correo,
      subject: 'Tu ficha del predio ' + predio + ' · Cota Cero',
      name: 'Cota Cero',
      replyTo: 'cotacero.pm@gmail.com',
      htmlBody:
        '<p>Hola,</p>' +
        '<p>Te adjuntamos la ficha del predio <b>' + predio + '</b>: lo que permite la normativa, los usos de suelo, ' +
        'las afectaciones y qué trámites te tocan.</p>' +
        '<p>Puedes volver a verlo en 3D aquí: <a href="' + enlace + '">' + enlace + '</a></p>' +
        '<p style="color:#666;font-size:12px">Información referencial a partir de datos públicos del GAD Municipal de Cuenca. ' +
        'No reemplaza el IPRUS. Si no pediste esta ficha, ignora este correo.</p>' +
        '<p>Cota Cero · Cuenca, Ecuador</p>',
      attachments: [pdf]
    });
    cache.put(kC, String(nC + 1), 21600); // 6 h
    cache.put(kH, String(nH + 1), 3600);
    return salida({ ok: true });
  } catch (err) {
    return salida({ ok: false, error: String(err) });
  }
}
