# À compléter — sprint 1
from django.contrib import admin
from .models import Client_Prospect, Chantier, ImageChantier, Temoignage, Devis

admin.site.register(Client_Prospect)
admin.site.register(Chantier)
admin.site.register(ImageChantier)
admin.site.register(Temoignage)
admin.site.register(Devis)
