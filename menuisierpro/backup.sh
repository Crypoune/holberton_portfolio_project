#!/bin/bash
# --- backup.sh ---
#
# Ce script fait un dump de la base PostgreSQL et garde les 7 dernières
# sauvegardes (une rotation simple pour ne pas remplir le disque à l'infini).
#
# COMMENT LE PLANIFIER :
# Sur ton serveur (ou dans un conteneur dédié), ajoute une tâche cron qui
# exécute ce script une fois par jour :
#   crontab -e
#   0 3 * * * /app/backup.sh >> /var/log/menuisierpro-backup.log 2>&1
# (ici : tous les jours à 3h du matin, heure creuse)

set -euo pipefail

BACKUP_DIR="/app/backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
FILENAME="${BACKUP_DIR}/menuisierpro_${DATE}.sql.gz"

mkdir -p "$BACKUP_DIR"

# pg_dump exporte toute la structure + les données ; le gzip compresse à la
# volée pour ne pas stocker un fichier .sql brut énorme.
pg_dump \
  --host="${DB_HOST}" \
  --username="${DB_USER}" \
  --dbname="${DB_NAME}" \
  --no-owner \
  | gzip > "$FILENAME"

echo "Sauvegarde créée : $FILENAME"

# Rotation : on ne garde que les 7 dernières sauvegardes. Sans ça, le
# dossier grossit indéfiniment et finit par remplir le disque du serveur.
find "$BACKUP_DIR" -name "menuisierpro_*.sql.gz" -mtime +7 -delete

# IMPORTANT — un backup qui reste sur le même serveur que la base ne protège
# pas contre une panne disque ou un serveur détruit. Pour un vrai client,
# ajoute une étape qui envoie ce fichier ailleurs, par exemple vers un bucket
# S3/Backblaze avec `aws s3 cp` ou `rclone copy`. Sans ça, ce script protège
# contre les erreurs humaines (mauvaise requête SQL) mais pas contre un
# crash serveur complet.
