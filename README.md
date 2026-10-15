# Portfolio de Kevin Ferraretto

## 📋 Description

Portfolio personnel présentant mes compétences, projets et parcours en tant que développeur fullstack basé à Toulouse. Le site est construit avec HTML, CSS et JavaScript, avec un petit backend PHP pour le formulaire de contact, pour offrir une expérience utilisateur fluide et responsive.

## 🚀 Fonctionnalités

- **Design responsive** adapté à tous les appareils
- **Navigation intuitive** entre les différentes sections
- **Portfolio interactif** avec filtrage des projets par catégorie
- **Formulaire de contact** sécurisé (captcha anti-robot auto-hébergé, limitation du nombre d'envois)
- **Affichage détaillé des projets** en modal, avec liens vers les démos, le code source ou les téléchargements
- **Mode hors ligne** grâce à un service worker (cache des ressources)
- **SEO et accessibilité** : balises Open Graph/Twitter, données structurées JSON-LD, lien d'évitement, attributs ARIA

## 🔗 Sections principales

- **À propos** - Présentation personnelle et services proposés
- **Portfolio** - Galerie de projets filtrable par catégorie
- **Parcours** - Historique académique et expériences professionnelles
- **Contact** - Formulaire pour me contacter directement

## 💻 Technologies utilisées

- **HTML5** - Structure du site
- **CSS3** - Mise en page et animations
- **JavaScript** - Interactions et fonctionnalités dynamiques
- **PHP** - Envoi du formulaire de contact (`send-email.php`) et génération du captcha (`captcha.php`)
- **Service Worker** - Mise en cache et accès hors ligne (`assets/js/sw.js`)
- **Icônes SVG** - Icônes intégrées directement dans le HTML

## 🛠️ Installation et utilisation locale

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/MrSuricate2/portfolio.git
   ```

2. Naviguez vers le dossier du projet :
   ```bash
   cd portfolio
   ```

3. Ouvrez le fichier `index.html` dans votre navigateur.

> Le formulaire de contact et le captcha nécessitent un serveur PHP. Pour les tester en local :
> ```bash
> php -S localhost:8000
> ```

## 🔍 Structure du projet

```
portfolio/
│
├── index.html                       # Page principale du site
├── mentions-legales.html            # Mentions légales
├── politique-confidentialite.html   # Politique de confidentialité
├── send-email.php                   # Envoi du formulaire de contact
├── captcha.php                      # Génération du captcha
├── sitemap.xml / robots.txt         # Référencement
├── site.webmanifest                 # Manifeste de l'application web
├── assets/                          # Ressources du site
│   ├── css/
│   │   └── style.css                # Styles principaux
│   ├── js/
│   │   ├── script.js                # Fonctionnalités interactives
│   │   ├── sw.js                    # Service worker
│   │   └── sw-register.js           # Enregistrement du service worker
│   ├── font/                        # Police Poppins
│   └── images/
│       ├── portfolio/               # Images des projets
│       ├── icon/                    # Icônes et logos de technologies
│       ├── favicon/                 # Favicons
│       └── og-image.png             # Image de partage (Open Graph)
└── README.md                        # Ce fichier
```

## 🌐 Version en ligne

Le portfolio est accessible en ligne à l'adresse : [https://kevin-ferraretto.fr](https://kevin-ferraretto.fr)

## 📱 Compatibilité

Le site est optimisé pour les navigateurs modernes :
- Chrome
- Firefox
- Safari
- Edge

## 📝 Projets présentés

Le portfolio présente différents types de projets :
- Projets professionnels (Street Favor Association, SignalR, Examify, April Nails, Cristal Clean, Toudoudindes)
- Projets scolaires (Insta-mème, Jeu du pendu, Jeu du démineur, BattleGame, Pokedex, My Campus, Feelback, TechMarket, Tétris)
- Projets personnels (Pronote, Générateur de mots de passe, Pokedex Android, Jeu du mémory)

## 🔄 Mise à jour du contenu

Pour mettre à jour le contenu du portfolio :
1. Modifiez le fichier `index.html` pour ajouter de nouveaux projets ou mettre à jour les informations
2. Ajoutez les nouvelles images dans le dossier `assets/images/portfolio/` (en précisant `width` et `height`)
3. Incrémentez `CACHE_VERSION` dans `assets/js/sw.js` pour que les visiteurs récupèrent la nouvelle version
4. Mettez à jour le `lastmod` dans `sitemap.xml`
5. Faites un commit et push vers votre dépôt GitHub

### 🚀 Déploiement automatique

Le site est configuré avec un webhook qui déclenche automatiquement un déploiement à chaque push sur le dépôt GitHub. Cette configuration CI/CD (Intégration Continue/Déploiement Continu) permet de :
- Mettre à jour instantanément le site en production
- Réduire les erreurs manuelles de déploiement
- Maintenir facilement le site à jour

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).

## 📞 Contact

- Email: [kevin.ferraretto@ecoles-epsi.net](mailto:kevin.ferraretto@ecoles-epsi.net)
- LinkedIn: [linkedin.com/in/kevin-ferraretto](https://www.linkedin.com/in/kevin-ferraretto/)
- GitHub: [github.com/MrSuricate2](https://github.com/MrSuricate2)

---

Développé avec ❤️ par Kevin Ferraretto
