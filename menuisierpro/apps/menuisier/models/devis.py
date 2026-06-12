from django.db import models
from .client_prospect import Client_Prospect


class Devis(models.Model):

    class Statut(models.TextChoices):
        EN_ATTENTE = "en_attente", "En attente"
        RELANCE_J3 = "relance_j3", "Relancé à J+3"
        RELANCE_J7 = "relance_j7", "Relancé à J+7"
        CONVERTI   = "converti",   "Converti en chantier"
        ABANDONNE  = "abandonne",  "Abandonné"

    client                    = models.ForeignKey(
                                  Client_Prospect,
                                  on_delete=models.SET_NULL,
                                  null=True,
                                  blank=True,
                                  related_name="devis"
                                )
    type_meuble               = models.CharField(max_length=150)         # ex : "Cuisine équipée"
    dimensions_approximatives = models.CharField(max_length=200, blank=True)  # ex : "3m x 2.5m"
    materiau                  = models.CharField(max_length=100, blank=True)   # ex : "Chêne massif"
    message_whatsapp_genere   = models.TextField(blank=True)  # message prêt à copier/envoyer
    date_creation             = models.DateTimeField(auto_now_add=True)
    statut                    = models.CharField(
                                  max_length=20,
                                  choices=Statut.choices,
                                  default=Statut.EN_ATTENTE
                                )
    date_relance_j3           = models.DateTimeField(null=True, blank=True)
    date_relance_j7           = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Devis {self.id} — {self.type_meuble} ({self.get_statut_display()})"

    class Meta:
        verbose_name        = "Devis"
        verbose_name_plural = "Devis"
        ordering            = ["-date_creation"]
