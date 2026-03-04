# Prompt Hub — Frontend

[Vidéo de la formation](https://youtu.be/3llJm3LO1e4)

Application Angular pour **Prompt Hub** : partage et découverte de prompts (liste, création, édition, votes, catégories).

Projet pensé pour **apprendre Angular moderne** (standalone, signals, zoneless, formulaires, librairie de composants, routing, guards, authentification, etc.) avec un backend API REST proche d’un environnement entreprise.


## Branches de la formation

Ce dépôt contient des branches de base pour chaque partie de la formation Angular. La branche `main` (par défaut lors du clone) correspond à `base-1-and-2` — point de départ des parties 1 et 2. La colonne **Timestamp** indique à quel moment de la vidéo YouTube chaque base correspond.

| Branche | Partie | Timestamp | Description |
|---------|--------|-----------|-------------|
| `main` | 1 & 2 | [1:43](https://youtu.be/3llJm3LO1e4?t=103) & [42:32](https://youtu.be/3llJm3LO1e4?t=2552) | Point de départ (identique à `base-1-and-2`) |
| `base-1-and-2` | 1 & 2 | [1:43](https://youtu.be/3llJm3LO1e4?t=103) & [42:32](https://youtu.be/3llJm3LO1e4?t=2552) | Concepts et affichage de données |
| `base-3` | 3 | [01:05:20](https://youtu.be/3llJm3LO1e4?t=3920) | Librairie et UX/UI |
| `base-4` | 4 | [01:45:40](https://youtu.be/3llJm3LO1e4?t=6340) | Requêtes au back-end |
| `base-5` | 5 | [02:03:49](https://youtu.be/3llJm3LO1e4?t=7429) | Formulaire et route |
| `base-6` | 6 | [02:47:08](https://youtu.be/3llJm3LO1e4?t=10028) | Authentification |
| `base-7` | 7 | [03:26:52](https://youtu.be/3llJm3LO1e4?t=12412) | Finition |
| `final` | — | — | État final du projet (référence / correction) |

**Utilisation :** lors du git clone, vous êtes sur `main` (= `base-1-and-2`). Pour une autre partie : `git checkout base-N`. La branche `final` contient le projet complet une fois toutes les parties terminées.


## Lancer le projet

```bash
npm install
npm start
```

Ouvre `http://localhost:4200/`. Le backend (NestJS, port 3000) doit tourner pour que l’app fonctionne.

**Backend :** [prompt-hub-backend](https://github.com/GaetanRouzies/prompt-hub-backend)