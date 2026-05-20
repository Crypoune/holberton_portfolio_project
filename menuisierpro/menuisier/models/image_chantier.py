from io import BytesIO
from django.core.files.base import ContentFile
from django.db import models
from PIL import Image

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

    def save(self, *args, **kwargs):
        if self.fichier_image:
            # Ouvrir l'image avec Pillow
            img = Image.open(self.fichier_image)
            
            # Conversion en RGB si nécessaire (pour éviter les erreurs avec RGBA/PNG)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
                
            # Redimensionner si l'image est trop grande (max 1200x1200px)
            max_size = (1200, 1200)
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Sauvegarder dans un buffer en mémoire avec compression
            img_io = BytesIO()
            img.save(img_io, format='JPEG', quality=70, optimize=True)
            
            # Remplacer le fichier original par le fichier compressé (en forçant l'extension .jpg)
            filename = self.fichier_image.name.split('/')[-1]
            filename = filename.rsplit('.', 1)[0] + '.jpg'
            
            self.fichier_image.save(filename, ContentFile(img_io.getvalue()), save=False)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.chantier.titre} — {self.get_categorie_display()} (ordre {self.ordre})"

    class Meta:
        verbose_name        = "Image de chantier"
        verbose_name_plural = "Images de chantier"
        ordering            = ["ordre"]
