export function buildClaimResolvedEmailTemplate(params: {
  itemTitle: string;
  resolution: 'ACCEPTED' | 'REJECTED';
  ownerUsername: string;
  ownerMessage?: string;
}) {
  const title =
    params.resolution === 'ACCEPTED'
      ? `✅ Réclamation acceptée pour "${params.itemTitle}"`
      : `❌ Réclamation refusée pour "${params.itemTitle}"`;

  const subtitle =
    params.resolution === 'ACCEPTED'
      ? `Bonne nouvelle : le propriétaire de l’annonce a accepté votre demande.`
      : `Le propriétaire de l’annonce a refusé votre demande.`;

  return `
  <div style="font-family: Arial, sans-serif; line-height:1.4">
    <h2>${title}</h2>
    <p>${subtitle}</p>

    <p><b>Réponse de :</b> ${escapeHtml(params.ownerUsername)}</p>

    ${
      params.ownerMessage
        ? `<p><b>Message :</b></p>
           <div style="padding:12px;border:1px solid #ddd;border-radius:8px">
             ${escapeHtml(params.ownerMessage).replace(/\n/g, '<br/>')}
           </div>`
        : ''
    }

    <p style="margin-top:16px;color:#666">Lost & Found</p>
  </div>
  `;
}

function escapeHtml(str: string) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}