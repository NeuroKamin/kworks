#!/usr/bin/env bash
set -euo pipefail

#
# Скрипт вызывается из post-merge и post-checkout.
# Он ищет файлы, изменившиеся между предыдущим HEAD и текущим HEAD.
#

# 1. Для post‑merge Git сохраняет предыдущий HEAD в HEAD@{1}.
#    Для post‑checkout переменная предыдущего HEAD та же, поэтому используем один механизм.
PREV_HEAD="HEAD@{1}"

# Если репозиторий клонирован впервые, PREV_HEAD может отсутствовать.
if ! git rev-parse --verify -q "$PREV_HEAD" >/dev/null; then
  exit 0
fi

# Список изменённых файлов
changed_files=$(git diff --name-only "$PREV_HEAD" HEAD)

# --- 1. Изменились ли package.json в корне, apps/* или packages/*?
if echo "$changed_files" | grep -Eq '^(package\.json|(apps|packages)/[^/]+/package\.json)$'; then
  echo "📦 Обнаружены изменения package.json → запускаю pnpm install"
  pnpm install
fi

# --- 2. Изменились ли модели Drizzle?
# Достаточно проверить папку models (или schema‑файлы, если они у вас в одном файле).
if echo "$changed_files" | grep -Eq '^packages/database/models/'; then
  echo "🔗 Обнаружены изменения моделей Drizzle → обновляю миграции"
  # Фильтруем workspace‑пакет, чтобы команда запускалась только в packages/database
  pnpm --filter "./packages/database" run update-db
fi
