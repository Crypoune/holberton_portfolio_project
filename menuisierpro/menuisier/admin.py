from django.contrib import admin
from django.utils.html import format_html
from .models import Client_Prospect, Chantier, ImageChantier, Temoignage, Devis


# ==============================================================================
# INLINE : ImageChantier dans Chantier
# Permet d'ajouter/supprimer des images directement depuis la fiche chantier
# sans avoir à naviguer vers un autre écran.
# ==============================================================================

class ImageChantierInline(admin.TabularInline):
    model   = ImageChantier
    extra   = 3          # 3 lignes vides proposées par défaut
    ordering = ['ordre']
    fields  = ['fichier_image', 'categorie', 'ordre', 'apercu']
    readonly_fields = ['apercu']

    def apercu(self, instance):
        if instance.fichier_image:
            return format_html(
                '<img src="{}" style="height:60px; border-radius:4px;" />',
                instance.fichier_image.url
            )
        return "—"
    apercu.short_description = "Aperçu"


# ==============================================================================
# INLINE : Temoignage dans Chantier
# Un chantier a au maximum un témoignage (OneToOne).
# L'artisan valide ou invalide le témoignage directement depuis la fiche.
# ==============================================================================

class TemoignageInline(admin.StackedInline):
    model       = Temoignage
    extra       = 0
    fields      = ['contenu', 'note', 'est_valide', 'date_soumission', 'token_validation']
    readonly_fields = ['date_soumission', 'token_validation']


# ==============================================================================
# CHANTIER
# Vue centrale de l'admin. L'artisan gère ses chantiers avec images et
# témoignages depuis un seul écran.
# ==============================================================================

@admin.register(Chantier)
class ChantierAdmin(admin.ModelAdmin):
    inlines         = [ImageChantierInline, TemoignageInline]
    list_display    = ['titre', 'type_travaux', 'localisation', 'est_termine', 'date_fin', 'lien_partage']
    list_filter     = ['est_termine', 'type_travaux', 'materiau_utilise']
    search_fields   = ['titre', 'description', 'localisation']
    prepopulated_fields = {'slug': ('titre',)}  # slug auto-rempli depuis le titre
    ordering        = ['-date_fin']
    fieldsets = (
        ("Informations générales", {
            'fields': ('client', 'titre', 'slug', 'description')
        }),
        ("Détails du chantier", {
            'fields': ('type_travaux', 'materiau_utilise', 'budget_indicatif', 'localisation')
        }),
        ("Statut et dates", {
            'fields': ('est_termine', 'date_debut', 'date_fin')
        }),
    )

    def lien_partage(self, obj):
        if obj.slug:
            return format_html(
                '<a href="/chantiers/{}/" target="_blank">Voir la page</a>',
                obj.slug
            )
        return "—"
    lien_partage.short_description = "Page partageable"


# ==============================================================================
# CLIENT / PROSPECT
# ==============================================================================

@admin.register(Client_Prospect)
class ClientProspectAdmin(admin.ModelAdmin):
    list_display  = ['nom', 'telephone_whatsapp', 'email', 'date_creation']
    search_fields = ['nom', 'telephone_whatsapp', 'email']
    ordering      = ['-date_creation']


# ==============================================================================
# DEVIS
# L'artisan suit l'état de chaque devis et peut manuellement changer le statut.
# ==============================================================================

@admin.register(Devis)
class DevisAdmin(admin.ModelAdmin):
    list_display  = ['id', 'client', 'type_meuble', 'materiau', 'statut', 'date_creation', 'lien_whatsapp']
    list_filter   = ['statut', 'materiau']
    search_fields = ['type_meuble', 'client__nom']
    ordering      = ['-date_creation']
    readonly_fields = ['message_whatsapp_genere', 'date_creation', 'date_relance_j3', 'date_relance_j7']
    fieldsets = (
        ("Demande", {
            'fields': ('client', 'type_meuble', 'dimensions_approximatives', 'materiau')
        }),
        ("Message généré", {
            'fields': ('message_whatsapp_genere',)
        }),
        ("Suivi", {
            'fields': ('statut', 'date_creation', 'date_relance_j3', 'date_relance_j7')
        }),
    )

    def lien_whatsapp(self, obj):
        if obj.client and obj.client.telephone_whatsapp and obj.message_whatsapp_genere:
            numero  = obj.client.telephone_whatsapp.replace('+', '').replace(' ', '')
            message = obj.message_whatsapp_genere[:100]  # WhatsApp tronque au-delà
            return format_html(
                '<a href="https://wa.me/{}?text={}" target="_blank">Ouvrir WhatsApp</a>',
                numero, message
            )
        return "—"
    lien_whatsapp.short_description = "Contact"


# ==============================================================================
# TÉMOIGNAGE
# Vue séparée pour que l'artisan valide les témoignages en attente.
# ==============================================================================

@admin.register(Temoignage)
class TemoignageAdmin(admin.ModelAdmin):
    list_display    = ['chantier', 'client', 'note', 'est_valide', 'date_soumission']
    list_filter     = ['est_valide', 'note']
    readonly_fields = ['token_validation', 'date_soumission']
    ordering        = ['-date_soumission']
    actions         = ['valider_temoignages', 'invalider_temoignages']

    @admin.action(description="Valider les témoignages sélectionnés")
    def valider_temoignages(self, request, queryset):
        count = queryset.update(est_valide=True)
        self.message_user(request, f"{count} témoignage(s) validé(s).")

    @admin.action(description="Invalider les témoignages sélectionnés")
    def invalider_temoignages(self, request, queryset):
        count = queryset.update(est_valide=False)
        self.message_user(request, f"{count} témoignage(s) invalidé(s).")