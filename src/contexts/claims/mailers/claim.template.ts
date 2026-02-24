export function buildClaimEmailTemplate(params: {
  itemTitle: string;
  itemStatus: 'LOST' | 'FOUND';
  requesterUsername: string;
  message: string;
}) {
  const title =
    params.itemStatus === 'FOUND'
      ? `Quelqu’un pense être le propriétaire de "${params.itemTitle}"`
      : `Quelqu’un pense avoir trouvé "${params.itemTitle}"`;

  const subtitle =
    params.itemStatus === 'FOUND'
      ? `Une personne affirme que l’objet trouvé lui appartient.`
      : `Une personne affirme avoir retrouvé l’objet perdu.`;

  return `
  <div style="font-family: Arial, sans-serif; line-height:1.4">
    <h2>${title}</h2>
    <p>${subtitle}</p>

    <p><b>Demandeur :</b> ${params.requesterUsername}</p>
    <p><b>Message :</b></p>
    <div style="padding:12px;border:1px solid #ddd;border-radius:8px">
      ${escapeHtml(params.message).replace(/\n/g, '<br/>')}
    </div>

    <p style="margin-top:16px;color:#666">
      Lost & Found — demande de mise en relation
    </p>
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