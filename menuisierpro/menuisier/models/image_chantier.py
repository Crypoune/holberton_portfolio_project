from django.db import models
from .chantier import Chantier


class ImageChantier(models.Model):

    class Categorie(models.TextChoices):
        AVANT   = "avant",   "Avant"
        PENDANT = "pendant", "Pendant"
        APRES   = "apres",   "Après"

    chantier      = models.ForeignKey(
                      Chantier,
                      on_delete=models.CASCADE,
                      related_name="images"
                    )
    fichier_image = models.ImageField(upload_to="chantiers/")
    categorie     = models.CharField(
                      max_length=10,
                      choices=Categorie.choices,
                      default=Categorie.AVANT
                    )
    ordre         = models.PositiveSmallIntegerField(default=0)  # tri croissant

    def __str__(self):
        return f"{self.chantier.titre} — {self.get_categorie_display()} (ordre {self.ordre})"

    class Meta:
        verbose_name        = "Image de chantier"
        verbose_name_plural = "Images de chantier"
        ordering            = ["ordre"]
