# EDF Tempo Scheduler

## Description

**EDF Tempo Scheduler** est un projet automatisé permettant de récupérer quotidiennement des informations liées à l'option EDF Tempo (jours restants, tarifs, etc.) et de les publier sur un webhook Discord. Il inclut également des fonctionnalités avancées de scraping pour extraire dynamiquement des données d'une page web.

Ce projet est conçu pour être facilement déployé en tant que conteneur Docker et automatisé à l'aide de GitHub Actions.

---

## Fonctionnalités

- **Récupération automatique des données EDF Tempo** via une API et scraping.
- **Planification quotidienne** des tâches avec `node-schedule`.
- **Notification Discord** via webhook avec des messages dynamiques et colorés.
- **Conteneurisation Docker** pour un déploiement rapide et isolé.
- **Workflow GitHub Actions** pour automatiser la construction et la publication d'images Docker.

---

## Prérequis

- **Node.js** : Version 18 ou supérieure.
- **Docker** : Pour exécuter le projet en conteneur.
- **GitHub Actions** : Pour l'automatisation des builds (optionnel).

---

## Installation

### 1. Cloner le dépôt
```
git clone https://github.com/fazetitans/edf-tempo-discord.git
cd edf-tempo-discord
```

### 2. Installer les dépendances
```
npm install
```

### 3. Configuration
Ajoutez un fichier `.env` à la racine pour gérer les variables sensibles :
```
DISCORD_WEBHOOK=https://discord.com/api/webhooks/... 
```

---

## Utilisation

### Exécuter localement
Pour exécuter le script manuellement :
```
node main.js
```

---

## Docker

### Construction de l'image Docker
```
docker build -t edf-tempo-discord .
```

### Exécution du conteneur
```
docker run -d \
  --name edf-tempo \
  -e DISCORD_WEBHOOK="https://discord.com/api/webhooks/..." \
  edf-tempo-discord
```

---

## Automatisation avec GitHub Actions

Ce projet inclut un workflow GitHub Actions pour automatiser la construction et la publication d'images Docker.

### 1. Configuration des Secrets GitHub
Ajoutez les variables suivantes dans **Settings > Secrets and variables > Actions** :
- `DOCKER_USERNAME` : Votre nom d'utilisateur Docker Hub.
- `DOCKER_PASSWORD` : Le token généré sur Docker Hub.

### 2. Workflow de publication
Chaque fois qu'un nouveau **tag** est poussé au format `vMAJOR.MINOR.PATCH`, GitHub Actions :
- Construit une nouvelle image Docker.
- Publie l'image sur Docker Hub avec les tags `latest` et `vMAJOR.MINOR.PATCH`.

---

## Contribuer

1. Forkez ce dépôt.
2. Créez une branche pour vos modifications.
3. Envoyez un pull request avec une description détaillée.

---

## Licence

Ce projet est sous licence **MIT**. Consultez le fichier [LICENSE](LICENSE) pour plus d'informations.

---

## Auteurs

- **Axel DA SILVA (FaZeTitans)** - Développeur principal
- Contact : [contact@fazetitans.fr](mailto:contact@fazetitans.fr)

---

## Aperçu des Notifications Discord

Les notifications envoyées au webhook Discord incluent (chaque jour à 12h00 PM) :
- **Date** et **type de jour** (Bleu, Blanc, Rouge).
- **Tarifs** pour les heures pleines et creuses.
- **Jours restants** pour chaque couleur.

---

## Exemple d'Image Docker

Pour télécharger l'image Docker publiée :
```
docker pull fazetitans/edf-tempo-scheduler:latest
```

---
