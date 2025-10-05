#!/bin/bash

# Скрипт развертывания виртуальной химической лаборатории на Cloudflare Pages
# Chemistry Lab Deployment Script

set -e

echo "🧪 Развертывание виртуальной химической лаборатории на Cloudflare Pages"
echo "=================================================================="

# Проверка наличия wrangler
if ! command -v npx &> /dev/null; then
    echo "❌ Node.js не установлен"
    exit 1
fi

# Сборка проекта
echo "📦 Сборка проекта..."
npm run build

# Проверка аутентификации Cloudflare
echo "🔐 Проверка аутентификации Cloudflare..."
if ! npx wrangler whoami &> /dev/null; then
    echo "❌ Не удалось аутентифицироваться в Cloudflare"
    echo "Пожалуйста, выполните: npx wrangler login"
    exit 1
fi

# Создание проекта (если не существует)
echo "🚀 Создание проекта Cloudflare Pages..."
npx wrangler pages project create chemistry-lab-9th-grade \
    --production-branch main \
    --compatibility-date 2024-01-01 || true

# Развертывание
echo "📤 Развертывание на Cloudflare Pages..."
npx wrangler pages deploy dist --project-name chemistry-lab-9th-grade

echo "✅ Развертывание завершено!"
echo "🌐 Ваша лаборатория будет доступна по адресу:"
echo "   https://chemistry-lab-9th-grade.pages.dev"