from django.db import models
from django.utils.text import slugify
from .client_prospect import Client_Prospect


class Chantier(models.Model):
    client             = models.ForeignKey(
                           Client_Prospect,
                           on_delete=models.SET_NULL,
                           null=True,
                           blank=True,
                           related_name="chantiers"
                         )
    titre              = models.CharField(max_length=200)
    description        = models.TextField(blank=True)
    type_travaux       = models.CharField(max_length=100)       # ex : "Cuisine", "Armoire"
    materiau_utilise   = models.CharField(max_length=100, blank=True)  # ex : "Chêne", "Pin"
    budget_indicatif   = models.PositiveIntegerField(null=True, blank=True)
    localisation       = models.CharField(max_length=150, blank=True)  # ex : "Antananarivo"
    slug               = models.SlugField(max_length=220, unique=True, blank=True)
    est_termine        = models.BooleanField(default=False)
    date_debut         = models.DateField(null=True, blank=True)
    date_fin           = models.DateField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # Génération automatique du slug à partir du titre si absent
        if not self.slug:
            base_slug = slugify(self.titre)
            slug      = base_slug
            counter   = 1
            while Chantier.objects.filter(slug=slug).exists():
                slug    = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.titre

    class Meta:
        verbose_name        = "Chantier"
        verbose_name_plural = "Chantiers"
        ordering            = ["-date_fin"]
