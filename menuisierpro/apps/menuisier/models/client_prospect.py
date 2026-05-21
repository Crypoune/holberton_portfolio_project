from django.db import models


class Client_Prospect(models.Model):
    nom                = models.CharField(max_length=150)
    telephone_whatsapp = models.CharField(max_length=20)
    email              = models.EmailField(blank=True)  # optionnel selon le canal
    date_creation      = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nom} ({self.telephone_whatsapp})"

    class Meta:
        verbose_name        = "Client / Prospect"
        verbose_name_plural = "Clients / Prospects"
        ordering            = ["-date_creation"]
