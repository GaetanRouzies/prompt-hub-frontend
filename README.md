# Prompt Hub — Frontend

Application Angular pour **Prompt Hub** : partage et découverte de prompts (liste, création, édition, votes, catégories).

Projet pensé pour **apprendre Angular moderne** (standalone, signals, zoneless, formulaires, librairie de composants, routing, guards, authentification, etc.) avec un backend API REST proche d’un environnement entreprise.


## Branches de la formation

Ce dépôt contient des branches de base pour chaque partie de la formation Angular. La branche `main` (par défaut lors du clone) correspond à `base-1-and-2` — point de départ des parties 1 et 2. La colonne **Timestamp** indique à quel moment de la vidéo YouTube chaque base correspond.

| Branche | Partie | Timestamp | Description |
|---------|--------|-----------|-------------|
| `main` | 1 & 2 | 0:00 | Point de départ (identique à `base-1-and-2`) |
| `base-1-and-2` | 1 & 2 | 0:00 | Concepts et affichage de données |
| `base-3` | 3 | XX:XX | Librairie et UX/UI |
| `base-4` | 4 | XX:XX | Requêtes au back-end |
| `base-5` | 5 | XX:XX | Formulaire et route |
| `base-6` | 6 | XX:XX | Authentification |
| `base-7` | 7 | XX:XX | Finition |
| `final` | — | — | État final du projet (référence / correction) |

**Utilisation :** lors du git clone, vous êtes sur `main` (= `base-1-and-2`). Pour une autre partie : `git checkout base-N`. La branche `final` contient le projet complet une fois toutes les parties terminées.


## Lancer le projet

```bash
npm install
npm start
```

Ouvre `http://localhost:4200/`. Le backend (NestJS, port 3000) doit tourner pour que l’app fonctionne.

**Backend :** [prompt-hub-backend](https://github.com/GaetanRouzies/prompt-hub-backend)