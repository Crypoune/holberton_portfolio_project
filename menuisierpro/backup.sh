#!/bin/bash
# --- backup.sh ---
#
# Ce script fait un dump de la base de données (PostgreSQL ou SQLite selon la config)
# et garde les 7 dernières sauvegardes (rotation simple).
#
# COMMENT LE PLANIFIER :
# Sur serveur (ou dans un conteneur dédié), ajouter une tâche cron :
#   crontab -e
#   0 3 * * * /app/backup.sh >> /var/log/menuisierpro-backup.log 2>&1
# (tous les jours à 3h du matin)

set -euo pipefail

BACKUP_DIR="/app/backups"
# Si on est en local hors Docker, on peut sauvegarder dans un sous-dossier local
if [ ! -d "/app" ]; then
  BACKUP_DIR="./backups"
fi

DATE=$(date +%Y-%m-%d_%H-%M-%S)
mkdir -p "$BACKUP_DIR"

if [ "${USE_SQLITE:-False}" = "True" ]; then
  echo "Mode SQLite détecté. Sauvegarde du fichier db.sqlite3..."
  
  # Trouver le chemin de db.sqlite3
  if [ -f "../db.sqlite3" ]; then
    SQLITE_PATH="../db.sqlite3"
  elif [ -f "db.sqlite3" ]; then
    SQLITE_PATH="db.sqlite3"
  elif [ -f "./menuisierpro/db.sqlite3" ]; then
    SQLITE_PATH="./menuisierpro/db.sqlite3"
  else
    echo "Erreur : Fichier db.sqlite3 introuvable !"
    exit 1
  fi
  
  FILENAME="${BACKUP_DIR}/menuisierpro_sqlite_${DATE}.sqlite3.gz"
  gzip -c "$SQLITE_PATH" > "$FILENAME"
  echo "Sauvegarde SQLite créée : $FILENAME"
  
  # Rotation SQLite
  find "$BACKUP_DIR" -name "menuisierpro_sqlite_*.sqlite3.gz" -mtime +7 -delete
else
  echo "Mode PostgreSQL détecté. Démarrage de pg_dump..."
  FILENAME="${BACKUP_DIR}/menuisierpro_${DATE}.sql.gz"
  
  pg_dump \
    --host="${DB_HOST}" \
    --username="${DB_USER}" \
    --dbname="${DB_NAME}" \
    --no-owner \
    | gzip > "$FILENAME"
  
  echo "Sauvegarde PostgreSQL créée : $FILENAME"
  
  # Rotation PostgreSQL
  find "$BACKUP_DIR" -name "menuisierpro_*.sql.gz" -mtime +7 -delete
fi

# IMPORTANT — un backup qui reste sur le même serveur que la base ne protège
# pas contre une panne disque ou un serveur détruit. Pour un vrai client,
# ajoute une étape qui envoie ce fichier ailleurs, par exemple vers un bucket
# S3/Backblaze avec `aws s3 cp` ou `rclone copy`.
