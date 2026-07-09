from rest_framework import permissions


class IsArtisanStaff(permissions.BasePermission):
    """
    Autorise uniquement les comptes staff/admin (l'artisan).
    Un utilisateur "standard" authentifié mais non-staff est refusé (403),
    même s'il possède un token valide.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class IsArtisanStaffOrReadOnly(permissions.BasePermission):
    """
    Lecture publique (GET/HEAD/OPTIONS), écriture réservée au staff.
    Remplace IsAuthenticatedOrReadOnly qui laissait passer N'IMPORTE QUEL
    compte authentifié (pas seulement l'artisan) sur les actions d'écriture.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)