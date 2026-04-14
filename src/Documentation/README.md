# TEKTAL Mobile
 
**Navigation vidéo GPS collaborative**
 
TEKTAL est une application mobile de navigation basée sur des vidéos filmées par les utilisateurs, combinées avec un tracking GPS en temps réel. L'app permet de créer, partager et suivre des chemins vidéo avec des instructions étape par étape.
 
![Version](https://img.shields.io/badge/version-1.0.0-yellow)
![React Native](https://img.shields.io/badge/React_Native-0.74-blue)
![Expo](https://img.shields.io/badge/Expo-51-black)
![License](https://img.shields.io/badge/license-MIT-green)
 
---
 
##  Application
 
| Accueil (TikTok) | Création de chemin | Lecteur vidéo | Carte GPS |
|-----------------|-------------------|---------------|-----------|
| ![home 1](docs/screenshots/home.png) | ![Screen 2](docs/screenshots/create.png) | ![Screen 3](docs/screenshots/player.png) | ![Screen 4](docs/screenshots/map.png) |
 
---
 
##  Fonctionnalités principales
 
###  Enregistrement vidéo avec GPS
- Capture vidéo en temps réel avec la caméra
- Tracking GPS automatique toutes les 2 secondes
- Enregistrement des coordonnées (latitude, longitude, timestamp)
- Sauvegarde dans la galerie (album "TEKTAL")
- Support caméra 
 
###  Création de chemins
- Ajout de 2 à 6 étapes chronométrées
- Instructions textuelles pour chaque étape
- Géolocalisation de départ et d'arrivée
- Upload automatique vers Cloudinary
- Validation avant publication
 
###  Vue TikTok (par défaut)
- Défilement vertical des vidéos
- Lecture automatique au scroll
- Actions latérales : Like, Carte, Voir, Partager, Télécharger
- Mode plein écran
- Indicateur de durée et créateur
 
###  Vue classique
- Liste avec miniatures
- Filtres et recherche
- Tri par date, popularité, durée
- Pull-to-refresh
 
### 🗺️ Carte interactive
- Affichage du parcours GPS sur carte (react-native-maps)
- Marqueurs de départ et d'arrivée
- Polyline du trajet complet
- Zoom et navigation sur la carte
 
###  Système d'authentification
- Inscription avec email/mot de passe
- Connexion JWT (tokens access + refresh)
- Profil utilisateur modifiable
- Gestion des favoris
 
### Partage
- Génération de liens de partage uniques
- Partage via WhatsApp, SMS, réseaux sociaux
- Prévisualisation web sans installation
 
###  Téléchargement
- Sauvegarde des vidéos dans la galerie
- Organisation par album "Tektal"
- Support iOS et Android
 
---
 
##  Architecture
 
### Stack technique
 
```
Frontend Mobile
├── React Native 0.74
├── Expo SDK 51
├── React Navigation 6
├── Expo Camera
├── Expo Location
├── Expo Video
└── React Native Maps
 
Backend API
├── Django 5.0
├── Django REST Framework
├── JWT Authentication
└── PostgreSQL
 
Stockage
├── Cloudinary (vidéos)
└── PostgreSQL (métadonnées)

 
### Structure du projet
 
```
tektal-mobile/
├── assets/                    # Images, icônes, fonts
├── components/               # Composants réutilisables
│   ├── PathCard.jsx
│   ├── VideoPlayer.jsx
│   └── MapView.jsx
├── context/                  # Context API
│   ├── AuthContext.jsx
│   └── PathContext.jsx
├── navigation/              # Configuration navigation
│   ├── AppNavigator.js
│   └── AuthStack.js
├── screens/                 # Écrans de l'app
│   ├── Auth/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── ForgotPassword.js
│   ├── TableauDeBord/
│   │   ├── Accueil.jsx            # Page d'accueil (TikTok + Classic)
│   │   ├── VideoRecorderScreen.js  # Enregistrement vidéo + GPS
│   │   ├── StepCreation.js         # Ajout des étapes
│   │   └── PathConfirmation.js     # Validation et upload
│   ├── VideoPlayer.js        # Lecteur vidéo avec étapes
│   ├── Map.js               # Carte GPS du parcours
│   └── Profile.js           # Profil utilisateur
├── services/                # Appels API
│   ├── http.js              # Client Axios avec intercepteurs
│   ├── authService.js       # Login, register, tokens
│   ├── pathService.js       # CRUD chemins
│   └── adminPathService.js  # Gestion admin
├── utils/                   # Utilitaires
│   └── constants.js
├── app.json                 # Configuration Expo
├── eas.json                 # Configuration EAS Build
└── package.json
```
 
---
 
##  Installation
 
### Prérequis
 
- **Node.js** >= 18.x
- **npm** ou **yarn**
- **Expo CLI** : `npm install -g expo-cli`
- **EAS CLI** : `npm install -g eas-cli`
- **Compte Expo** (pour les builds)
- **Cloudinary** (pour le stockage vidéo)
 
### Étape 1 : Cloner le projet
 
```bash
git clone https://github.com/votre-org/tektal-mobile.git
cd tektal-mobile
```
 
### Étape 2 : Installer les dépendances
 
```bash
npm install
```
 
### Étape 3 : Configuration
 
Crée un fichier `.env` à la racine :
 
```env
API_BASE_URL=https://tektal-backend.onrender.com
CLOUDINARY_CLOUD_NAME=dxkadqzzz
CLOUDINARY_API_KEY=731133196691316
CLOUDINARY_UPLOAD_PRESET=tektal_videos
```
 
### Étape 4 : Lancer en développement
 
```bash
# Démarrer Metro Bundler
npx expo start
 
# Scanner le QR code avec Expo Go
# OU appuyer sur 'a' pour Android / 'i' pour iOS
```
 
---
 
##  Build et déploiement
 
### Build APK Android (Preview)
 
```bash
# Login Expo
eas login
 
# Configurer le build (première fois)
eas build:configure
 
# Lancer le build APK
eas build -p android --profile preview
```
 
Le fichier `.apk` sera disponible sur https://expo.dev après quelques minutes.
 
### Build AAB Android (Production)
 
```bash
eas build -p android --profile production
```
 
### Build iOS
 
```bash
eas build -p ios --profile preview
```
 
⚠️ **Note iOS** : Nécessite un compte Apple Developer.
 
### Configuration EAS (`eas.json`)
 
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```
 
---
 
##  Configuration
 
### Backend API
 
L'app communique avec le backend Django via `services/http.js` :
 
```javascript
const API_BASE_URL = 'https://tektal-backend.onrender.com';
 
const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
 
// Intercepteur pour ajouter le token JWT
http.interceptors.request.use((config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
 
### Endpoints utilisés
 
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/auth/register/` | Inscription |
| `POST` | `/api/auth/login/` | Connexion (retourne JWT) |
| `POST` | `/api/token/refresh/` | Refresh token |
| `GET` | `/api/paths/` | Liste des chemins |
| `POST` | `/api/paths/` | Créer un chemin |
| `GET` | `/api/paths/{id}/` | Détails d'un chemin |
| `POST` | `/api/paths/{id}/favorite/` | Toggle favori |
| `GET` | `/api/share/{token}/` | Chemin partagé (public) |
 
---
 
##  Workflow utilisateur
 
### 1️ Création d'un chemin
 
```
Accueil → Bouton "+" → Ajouter
  ↓
Formulaire (Départ, Destination, Type)
  ↓
VideoRecorderScreen
  ├── Enregistrement vidéo
  ├── Capture GPS (toutes les 2s)
  └── Prévisualisation
  ↓
StepCreation
  ├── Ajout de 2-6 étapes
  ├── Timing pour chaque étape
  └── Instructions textuelles
  ↓
PathConfirmation
  ├── Upload vidéo → Cloudinary
  ├── Envoi métadonnées → Backend
  └── Status: "pending" (en attente de validation)
```
 
### 2️ Visionnage d'un chemin
 
```
Accueil (Vue TikTok ou Classique)
  ↓
Clic sur une vidéo
  ↓
VideoPlayerScreen
  ├── Lecture vidéo
  ├── Étapes chronométrées affichées
  ├── Progression automatique
  └── Actions: Like, Carte, Partager
```
 
### 3️ Partage d'un chemin
 
```
VideoPlayer → Bouton Partager
  ↓
Génération lien: https://tektal-web-appli.vercel.app/share/{token}
  ↓
Partage via:
  ├── WhatsApp
  ├── SMS
  ├── Réseaux sociaux
  └── Copier le lien
```
 
---
 
##  Composants clés
 
### `VideoRecorderScreen.js`
 
Gère l'enregistrement vidéo avec GPS :
 
```javascript
// Démarrage du tracking GPS
const startRecording = async () => {
  locationSubscription.current = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 2000, // Toutes les 2 secondes
      distanceInterval: 5, // Minimum 5 mètres
    },
    (location) => {
      const newCoord = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: Date.now(),
      };
      setCoordinates((prev) => [...prev, newCoord]);
    }
  );
 
  const video = await cameraRef.current.recordAsync();
  setVideoUri(video.uri);
};
```
 
### `Accueil.jsx`
 
Affiche les chemins en vue TikTok (par défaut) :
 
```javascript
<FlatList
  data={paths}
  pagingEnabled
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item, index }) => (
    <VideoItem
      path={item}
      isActive={index === currentIndex}
      onToggleFavorite={handleToggleFavorite}
    />
  )}
/>
```
 
### `PathContext.jsx`
 
Gestion globale des chemins :
 
```javascript
export const PathProvider = ({ children }) => {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const refreshPaths = async () => {
    const result = await getPublicPaths();
    if (result.ok) {
      setPaths(result.data);
    }
  };
 
  return (
    <PathContext.Provider value={{ paths, loading, refreshPaths }}>
      {children}
    </PathContext.Provider>
  );
};
```
 
---
 
## Authentification
 
### Flux JWT
 
1. **Inscription** : `POST /api/auth/register/`
   - Retourne `access_token` + `refresh_token`
   - Tokens stockés dans `AsyncStorage`
 
2. **Connexion** : `POST /api/auth/login/`
   - Retourne les mêmes tokens
   - Auto-login si tokens valides
 
3. **Refresh automatique** :
   - Intercepteur HTTP détecte `401 Unauthorized`
   - Appelle `POST /api/token/refresh/`
   - Renouvelle `access_token`
   - Relance la requête initiale
 
```javascript
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      const { data } = await axios.post('/api/token/refresh/', {
        refresh: refreshToken,
      });
      await AsyncStorage.setItem('access_token', data.access);
      // Relancer la requête
      return http.request(error.config);
    }
    return Promise.reject(error);
  }
);
```
 
---
 
##  Intégration GPS
 
### Permissions requises
 
**iOS** (`app.json`) :
 
```json
{
  "ios": {
    "infoPlist": {
      "NSLocationWhenInUseUsageDescription": "TEKTAL a besoin de votre position pour enregistrer le parcours GPS des chemins.",
      "NSCameraUsageDescription": "TEKTAL a besoin d'accéder à la caméra pour filmer vos trajets.",
      "NSMicrophoneUsageDescription": "TEKTAL a besoin du microphone pour enregistrer le son de vos vidéos."
    }
  }
}
```
 
**Android** (`app.json`) :
 
```json
{
  "android": {
    "permissions": [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "CAMERA",
      "RECORD_AUDIO",
      "READ_MEDIA_VIDEO",
      "WRITE_EXTERNAL_STORAGE"
    ]
  }
}
```
 
### Demande de permissions au runtime
 
```javascript
const [locationPermission, requestLocationPermission] = 
  Location.useForegroundPermissions();
 
useEffect(() => {
  if (!locationPermission?.granted) {
    requestLocationPermission();
  }
}, []);
```
 
---
 
##  Gestion des données
 
### AsyncStorage (local)
 
Données stockées localement :
 
- `access_token` : JWT token d'accès
- `refresh_token` : JWT token de rafraîchissement
- `user_id` : ID de l'utilisateur
- `user_email` : Email de l'utilisateur
- `favorites` : IDs des chemins favoris (cache)
 
### Cloudinary (vidéos)
 
Upload de vidéo :
 
```javascript
const uploadToCloudinary = async (videoUri) => {
  const formData = new FormData();
  formData.append('file', {
    uri: videoUri,
    type: 'video/mp4',
    name: 'video.mp4',
  });
  formData.append('upload_preset', 'tektal_videos');
 
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );
 
  const data = await response.json();
  return data.secure_url; // URL de la vidéo uploadée
};
```
 
---
 
##  Débogage
 
### Logs courants
 
```bash
# Voir les logs Metro Bundler
npx expo start
 
# Logs Android
adb logcat | grep ReactNativeJS
 
# Logs iOS
xcrun simctl spawn booted log stream --predicate 'processImagePath endswith "Expo"'
```
 
### Erreurs fréquentes
 
| Erreur | Solution |
|--------|----------|
| `Cannot find module '@react-native/dev-middleware'` | `npm install @react-native/dev-middleware` |
| `Location permission denied` | Vérifier les permissions dans `app.json` |
| `Network request failed` | Vérifier `API_BASE_URL` dans `.env` |
| `Video upload failed` | Vérifier Cloudinary credentials |
| `Build failed: Unknown error` | Vérifier logs EAS Build sur expo.dev |
 
---
 
##  Tests
 
### Lancer les tests
 
```bash
# Tests unitaires
npm test
 
# Tests e2e
npm run test:e2e
```
 
### Structure des tests
 
```
__tests__/
├── components/
│   ├── PathCard.test.js
│   └── VideoPlayer.test.js
├── services/
│   ├── authService.test.js
│   └── pathService.test.js
└── screens/
    └── Accueil.test.js
```
 
---
 
##  Déploiement en production
 
### Checklist avant release
 
- [ ] Tester toutes les fonctionnalités (création, lecture, partage)
- [ ] Vérifier les permissions (GPS, caméra, galerie)
- [ ] Tester sur iOS et Android
- [ ] Mettre à jour `version` et `versionCode` dans `app.json`
- [ ] Générer les icônes et splash screen
- [ ] Build production : `eas build -p android --profile production`
- [ ] Soumettre sur Google Play Store / App Store
 
### Version incrémentation
 
```json
// app.json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    },
    "ios": {
      "buildNumber": "1"
    }
  }
}
```
 
---
 
##  Contribution
 
Les contributions sont les bienvenues ! Voici comment contribuer :
 
1. **Fork** le projet
2. **Crée une branche** : `git checkout -b feature/nouvelle-fonctionnalite`
3. **Commit** tes changements : `git commit -m 'Ajout nouvelle fonctionnalité'`
4. **Push** vers la branche : `git push origin feature/nouvelle-fonctionnalite`
5. **Ouvre une Pull Request**
 
### Conventions de code
 
- **ESLint** : `npm run lint`
- **Prettier** : `npm run format`
- Nommage des composants : `PascalCase`
- Nommage des fichiers : `camelCase.js` ou `PascalCase.jsx`
- Commits : [Conventional Commits](https://www.conventionalcommits.org/)
 
---
 
## Roadmap
 
### Version 1.1 (Q2 2025)
 
- [ ] Mode hors-ligne (téléchargement des vidéos)
- [ ] Notifications push (nouveaux chemins, favoris)
- [ ] Filtres avancés (durée, distance, difficulté)
- [ ] Système de badges et gamification
 
### Version 1.2 (Q3 2025)
 
- [ ] Commentaires sur les chemins
- [ ] Traduction multilingue (Français, Anglais, Wolof)
- [ ] Mode sombre
- [ ] Statistiques utilisateur (km parcourus, chemins créés)
 
### Version 2.0 (Q4 2025)
 
- [ ] Réalité augmentée (AR) pour le guidage
- [ ] Appels vidéo intégrés (guide en direct)
- [ ] Marketplace (chemins premium payants)
 
---
 

 
##  Contact
 
**Équipe TEKTAL**
 
- **Email** : antalissa10@gmail.com
- **Site web** : https://tektal-web-appli.vercel.app
- **GitHub** : [github.com/tektal](collefall118@gmail.com)
 
---
 
## deploiement
 
- **Expo** pour le framework mobile
- **Cloudinary** pour le stockage vidéo
- **React Navigation** pour la navigation
- **Render** pour l'hébergement backend
- **Vercel** pour l'hébergement web
 
---
 
**Fait par l'équipe TEKTAL/Bakeli/janvier 2026**
 