import { useState } from "react";
import { Phone, Calendar, Clock, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";
import WhatsAppButton from "../ui/WhatsAppButton";

function QuotesCard({ quotes, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const {
    id,
    client,
    type_meuble,
    statut,
    date_creation,
    date_relance_j3,
    date_relance_j7,
    message_whatsapp_genere,
  } = quotes;

  const daysThen = (date) => {
    // eslint-disable-next-line react-hooks/purity
    const diff = Date.now() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const days = daysThen(date_creation);

  const labelButton = () => {
    if (statut === "converti") return null;
    if (!date_relance_j3) return `Relance J+3`;
    if (!date_relance_j7) return `Relance J+7`;
    return "Contacter";
  };

  const button = labelButton();

  const handleDelete = async () => {
    const confirme = window.confirm(
      `Supprimer définitivement le devis de ${client?.nom || client?.name || "ce client"} ` +
      `(${type_meuble}) ? Cette action est irréversible.`
    );
    if (!confirme) return;

    setDeleting(true);
    const result = await onDelete(id);
    setDeleting(false);

    if (!result?.success) {
      window.alert("La suppression a échoué : " + (result?.message || "erreur inconnue"));
    }
  };

  return (
    <div className="devis-card">
      <div className="devis-card__header">
        <div>
          <h3 className="devis-card__nom">{client?.name || client?.nom}</h3>
          <p className="devis-card__meuble">{type_meuble}</p>
        </div>
        <div className="devis-card__header-actions">
          <Badge statut={statut} />
          <button
            type="button"
            className="devis-card__delete"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Supprimer ce devis"
            title="Supprimer ce devis"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="devis-card__meta">
        <span>
          <Phone size={14} /> {client?.telephone_whatsapp}
        </span>
        <span>
          <Calendar size={14} />{" "}
          {new Date(date_creation).toLocaleDateString("fr-FR")}
        </span>
        {days > 2 && (
          <span className="devis-card__jours">
            <Clock size={14} /> Il y a {days} jours
          </span>
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

      {button && (
        <div className="devis-card__action">
          <WhatsAppButton
            telephone={client?.telephone_whatsapp}
            message={
              message_whatsapp_genere ||
              `Bonjour ${client?.name || client?.nom}, je vous relance concernant votre devis pour : ${type_meuble}.`
            }
            label={button}
          />
        </div>
      )}
    </div>
  );
}

export default QuotesCard;