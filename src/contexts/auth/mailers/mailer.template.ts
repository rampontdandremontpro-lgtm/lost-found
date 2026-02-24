export function buildWelcomeEmailTemplate(params: { username: string }) {
  const { username } = params;

  return `
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Bienvenue</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.06);">
            <tr>
              <td style="padding:20px 24px;background:#111827;color:#fff;">
                <h1 style="margin:0;font-size:18px;">Lost & Found</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 12px;font-size:16px;color:#111827;">Bonjour <b>${username}</b>,</p>
                <p style="margin:0 0 16px;font-size:14px;line-height:1.5;color:#374151;">
                  Ton compte a bien été créé ✅
                </p>
                <p style="margin:0;font-size:14px;line-height:1.5;color:#374151;">
                  Tu peux maintenant publier des objets <b>perdus</b> ou <b>trouvés</b>, et les classer par catégorie.
                </p>

                <div style="height:16px;"></div>

                <p style="margin:0;font-size:12px;color:#6b7280;">
                  Si tu n’es pas à l’origine de cette inscription, tu peux ignorer cet email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;background:#f9fafb;color:#6b7280;font-size:12px;">
                © ${new Date().getFullYear()} Lost & Found
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();
}
