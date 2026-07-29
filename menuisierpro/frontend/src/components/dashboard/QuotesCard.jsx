import { useState } from "react";
import { Phone, Calendar, Clock, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";
import WhatsAppButton from "../ui/WhatsAppButton";

function QuotesCard({ quotes, onDelete }) {
  // Etat local uniquement utilisé pour désactiver le bouton pendant
  // la suppression et éviter plusieurs clics simultanés.
  const [deleting, setDeleting] = useState(false);

  // On récupère les informations principales du devis reçues en props.
  // Le composant ne récupère pas les données lui-même : il affiche
  // simplement un devis fourni par son parent.
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

  // Calcule le nombre de jours depuis la création du devis.
  // Sert uniquement à afficher une information visuelle à l'utilisateur.
  const daysThen = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const days = daysThen(date_creation);

  // Détermine quelle action proposer selon l'avancement du devis.
  // La logique métier vient principalement de l'état enregistré en base :
  // - devis converti => aucune relance nécessaire
  // - pas de relance J+3 => proposer la première relance
  // - J+3 faite mais pas J+7 => proposer la seconde relance
  // - toutes les relances faites => permettre un contact manuel
  const labelButton = () => {
    if (statut === "converti") return null;
    if (!date_relance_j3) return `Relance J+3`;
    if (!date_relance_j7) return `Relance J+7`;
    return "Contacter";
  };

  const button = labelButton();

  // Gère la suppression d'un devis.
  // Le composant demande une confirmation puis appelle `onDelete`.
  // Il ne connaît pas l'API ni la requête HTTP :
  // cette responsabilité reste dans le parent ou dans le hook.
  const handleDelete = async () => {
    const confirme = window.confirm(
      `Supprimer définitivement le devis de ${client?.nom || client?.name || "ce client"} ` +
        `(${type_meuble}) ? Cette action est irréversible.`,
    );
    if (!confirme) return;

    setDeleting(true);
    const result = await onDelete(id);
    setDeleting(false);

    // Si la suppression échoue, on affiche un message d'erreur à l'utilisateur.
    // Le message précis vient du retour du backend si disponible,
    // sinon on utilise une erreur générique.
    if (!result?.success) {
      window.alert(
        "La suppression a échoué : " + (result?.message || "erreur inconnue"),
      );
    }
  };

  return (
    <div className="devis-card">
      <div className="devis-card__header">
        <div>
          {/* Le fallback permet de supporter deux formats de données :
              `name` venant actuellement des mocks frontend et
              `nom` correspondant au modèle Django.
              À terme, un seul nom de champ devra être conservé. */}
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

      {/* On affiche le dernier contact uniquement si une relance existe.
          La date J+3 est prioritaire car elle arrive avant J+7 dans le
          scénario normal du suivi client. */}
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
              // On utilise en priorité le message généré par le back.
              // Sinon on fournit un message par défaut pour que WhatsApp
              // reste toujours utilisable.
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
