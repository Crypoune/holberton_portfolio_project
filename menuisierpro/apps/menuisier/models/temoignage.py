import uuid
from django.db import models
from .chantier import Chantier
from .client_prospect import Client_Prospect


class Temoignage(models.Model):
    chantier          = models.OneToOneField(
                          Chantier,
                          on_delete=models.CASCADE,
                          related_name="temoignage"
                        )
    client            = models.ForeignKey(
                          Client_Prospect,
                          on_delete=models.SET_NULL,
                          null=True,
                          blank=True,
                          related_name="temoignages"
                        )
    contenu           = models.TextField()
    note              = models.PositiveSmallIntegerField(default=5)  # valeurs attendues : 1 à 5
    est_valide        = models.BooleanField(default=False)  # l'artisan valide avant publication
    token_validation  = models.UUIDField(
                          default=uuid.uuid4,
                          editable=False,
                          unique=True
                        )  # token envoyé au client pour accéder au formulaire sans compte
    date_soumission   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        statut = "validé" if self.est_valide else "en attente"
        return f"Témoignage — {self.chantier.titre} ({statut})"

    class Meta:
        verbose_name        = "Témoignage"
        verbose_name_plural = "Témoignages"
        ordering            = ["-date_soumission"]
