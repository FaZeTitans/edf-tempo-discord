# Utiliser une image officielle de Node.js
FROM node:23-slim

# Installer les dépendances système nécessaires pour Puppeteer
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    wget \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copier le package.json et package-lock.json (s'ils existent)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Configuration pour Puppeteer (évite la redownloading de Chromium)
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Exposer les logs en stdout
CMD ["node", "main.js"]

# Télécharger les fichiers nécessaires pour Puppeteer
RUN npm install puppeteer@latest

# Exemple pour documenter la variable d'environnement
ENV DISCORD_WEBHOOK="<Webhook Discord>"
