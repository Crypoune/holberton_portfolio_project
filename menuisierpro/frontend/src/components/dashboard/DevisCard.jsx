import Badge from "../ui/Badge";
import WhatsAppButton from "../ui/WhatsAppButton";

function DevisCard({ devis }) {
  const {
    client,
    type_meuble,
    statut,
    date_creation,
    date_relance_j3,
    date_relance_j7,
    message_whatsapp_genere,
  } = devis;

  const joursDepuis = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const jours = joursDepuis(date_creation);

  const labelBouton = () => {
    if (statut === "converti") return null;
    if (!date_relance_j3) return `Relance J+3`;
    if (!date_relance_j7) return `Relance J+7`;
    return "Contacter";
  };

  const bouton = labelBouton();

  return (
    <div className="devis-card">
      <div className="devis-card__header">
        <div>
          <h3 className="devis-card__nom">{client?.nom}</h3>
          <p className="devis-card__meuble">{type_meuble}</p>
        </div>
        <Badge statut={statut} />
      </div>

      <div className="devis-card__meta">
        <span>📞 {client?.telephone_whatsapp}</span>
        <span>📅 {new Date(date_creation).toLocaleDateString("fr-FR")}</span>
        {jours > 2 && (
          <span className="devis-card__jours">🕐 Il y a {jours} jours</span>
        )}
      </div>

      {(date_relance_j3 || date_relance_j7) && (
        <p className="devis-card__contact">
          Dernier contact :{" "}
          {new Date(date_relance_j3 || date_relance_j7).toLocaleDateString(
            "fr-FR",
          )}
        </p>
      )}

      {bouton && (
        <div className="devis-card__action">
          <WhatsAppButton
            telephone={client?.telephone_whatsapp}
            message={
              message_whatsapp_genere ||
              `Bonjour ${client?.nom}, je vous relance concernant votre devis pour : ${type_meuble}.`
            }
            label={bouton}
          />
        </div>
      )}
    </div>
  );
}

export default DevisCard;
