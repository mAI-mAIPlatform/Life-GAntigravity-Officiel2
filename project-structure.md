# Architecture du Projet Life

Cette architecture est conçue pour être modulaire, scalable et capable de supporter plus de 2000 fichiers pour une expérience de jeu AAA sur le web.

## Structure des Dossiers

### `src/` (Scripts JavaScript/Logic)
- **`src/core/`**: Moteur (Engine.js, Renderer, Loop).
- **`src/entities/`**:
  - `NPCs/`: (Humanoids, Animals) Logic d'IA.
  - `Vehicles/`: (Land, Air, Water) Physique et contrôles.
  - `Props/`: (Urban, Nature) Objets interactifs.
  - `Architecture/`: (Buildings, Interiors) Données structurelles.
- **`src/managers/`**: (Input, Audio, Asset, World, Traffic, Mission, Economy, Weather, Network).
- **`src/utils/`**: (Constants, Math, Helpers, Shaders, Validation).
- **`src/physics/`**: (Materials, Constraints, Colliders, Vehicles).
- **`src/ui/`**:
  - `components/`: Éléments réutilisables (Common, Game, Editor).
  - `apps/`: Applications mOS (mStore, Inventory, Settings, Map).
  - `styles/`: CSS/Tailwind.

### `src/scenes/` (Gestion des Environnements)
- `NeoCity/Districts/`: Segments du monde ouvert.
- `Interiors/Shops/`: Zones intérieures chargées à la demande.
- `Cinematics/`: Séquences scriptées.

### `assets/` (Ressources Multimédia)
- `models/`: Détaillé par catégorie (Characters, Vehicles, Props, Buildings).
- `textures/`: Séparé par type d'usage.
- `audio/`: (Music, SFX: Engines, Voices, Ambient, UI).

### `lib/` (External Libraries)
Modules tiers non NPM.

---

## Déploiement Vercel
Le projet est configuré via `vercel.json` pour un déploiement optimal avec Vite, incluant la gestion du cache pour les assets.

---

## Principes de Développement
1. **Modularité**: Chaque fichier doit avoir une responsabilité unique.
2. **Performance**: Utilisation intensive de l'instanciation 3D et optimisation du moteur physique.
3. **Réutilisabilité**: Création de composants UI et entités configurables.
