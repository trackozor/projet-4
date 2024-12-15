
# GameON - Marathon Gaming National

**GameON** est une plateforme événementielle permettant aux passionnés de jeux vidéo de réserver leur place pour un marathon national de gaming. Ce projet offre une expérience utilisateur fluide avec un formulaire d'inscription interactif, une interface responsive, et une validation des données en temps réel.

---

## **Table des matières**

1. **[Présentation](#présentation)**
2. **[Fonctionnalités principales](#fonctionnalités-principales)**
3. **[Technologies utilisées](#technologies-utilisées)**
4. **[Structure du projet](#structure-du-projet)**
5. **[Installation](#installation)**
6. **[Utilisation](#utilisation)**
7. **[Points forts](#points-forts)**
8. **[Roadmap](#roadmap)**
9. **[Aperçu visuel](#aperçu-visuel)**
10. **[Contributions](#contributions)**
11. **[Licence](#licence)**

---

## **Présentation**

GameON est une solution moderne conçue pour faciliter la gestion des inscriptions à des événements gaming. Son interface intuitive et dynamique s'adresse aux passionnés de jeux vidéo et met en avant les bonnes pratiques de développement web.

Les objectifs principaux sont :

- Offrir une navigation fluide sur tous les appareils (responsive design).
- Proposer une validation des données utilisateur en temps réel.
- Assurer une expérience utilisateur engageante et accessible.

---

## **Fonctionnalités principales**

- **Formulaire interactif :**
  - Validation des champs en temps réel avec des messages d'erreur personnalisés.
  - Gestion de l'état des champs (erreurs, succès).

- **Design responsive :**
  - Compatible avec les appareils mobiles, tablettes et ordinateurs.
  - Utilisation des media queries CSS pour un affichage adaptatif.

- **Modales dynamiques :**
  - Modale d'inscription ergonomique.
  - Modale de confirmation après soumission.

- **Accessibilité optimisée :**
  - Structure HTML sémantique respectant les normes pour les lecteurs d'écran.
  - Navigation clavier fluide.

- **Logs pour le débogage :**
  - Journaux détaillés dans la console pour suivre les interactions utilisateur et identifier les erreurs.

---

## **Technologies utilisées**

1. **HTML5 :**
   - Structure sémantique et respect des standards W3C.

2. **CSS3 :**
   - Utilisation de Flexbox et Grid pour la mise en page.
   - Media queries pour une expérience responsive.

3. **JavaScript Vanilla :**
   - Manipulation DOM pour gérer les interactions utilisateur.
   - Gestion des événements pour une validation dynamique des formulaires.

4. **Bibliothèques externes :**
   - [Font Awesome](https://fontawesome.com/) : Icônes visuelles modernes.

---

## **Structure du projet**

Voici la structure des fichiers et dossiers du projet :

```sh
projet-4/
│
├── index.html            # Page principale
├── css/
│   ├── modal.css         # Styles pour les modales
│   └── styles.css        # Styles globaux
├── js/
│   ├── modal.js          # Gestion des interactions modales et formulaires
│   └── utils.js          # Fonctions utilitaires (si applicables)
├── images/
│   ├── Logo.png          # Logo principal
│   ├── bg_img.jpg        # Image d'arrière-plan
│   └── favicon.ico       # Favicon
├── README.md             # Documentation du projet
└── .gitignore            # Fichiers et dossiers ignorés par Git
```

---

## **Installation**

### **Prérequis :**

- Navigateur moderne (Chrome, Firefox, Edge).
- Éditeur de texte ou IDE (Visual Studio Code recommandé).
- Serveur local (optionnel).

### **Étapes d'installation :**

1. **Cloner le dépôt Git :**

   ```bash
   git clone https://github.com/trackozor/projet-4.git
   cd projet-4
   ```

2. **Ouvrir le projet :**
   - Ouvrez `index.html` directement dans votre navigateur.
   - (Optionnel) Lancez un serveur local pour tester la responsivité et les scripts.

---

## **Utilisation**

1. **Navigation :**
   - Explorez les sections du site :
     - Détails de l'événement
     - À propos
     - Contact
     - Événements passés

2. **Inscription :**
   - Cliquez sur **"Je m'inscris"** pour ouvrir la modale.
   - Remplissez les champs obligatoires (Prénom, Nom, Email, etc.).
   - Validez pour afficher la confirmation d'inscription.

3. **Validation dynamique :**
   - Les erreurs sont affichées en temps réel si des champs sont mal remplis.

---

## **Points forts**

- **Design adaptatif :**
  Fonctionne parfaitement sur les appareils mobiles et desktop grâce aux media queries.

- **Validation en temps réel :**
  Une expérience utilisateur fluide et sans frustration.

- **Modularité :**
  Code structuré avec des fonctions réutilisables.

- **Débogage amélioré :**
  Les journaux détaillés permettent une identification rapide des problèmes.

---

## **Roadmap**

1. **Améliorations prévues :**
   - Ajouter un backend pour enregistrer les inscriptions (PHP, Node.js ou autre).
   - Intégrer une base de données pour centraliser les informations utilisateurs.
   - Ajouter des animations pour améliorer l'expérience utilisateur.
   - Effectuer des tests approfondis sur l'accessibilité (via Lighthouse ou autres outils).

2. **Fonctionnalités à venir :**
   - Personnalisation des événements selon les utilisateurs.
   - Notifications pour les inscriptions réussies.

---

## **Aperçu visuel**

### **Page principale**

![Page principale](images/preview-main.jpg)

### **Formulaire d'inscription**

![Formulaire](images/preview-form.jpg)

---

## **Contributions**

Les contributions sont les bienvenues ! Voici comment vous pouvez contribuer :

1. **Forkez le dépôt :**
   - Cliquez sur "Fork" en haut à droite de la page du dépôt GitHub.

2. **Créez une branche pour votre modification :**

   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```

3. **Soumettez une Pull Request :**
   - Proposez vos changements en expliquant vos choix et les tests effectués.

---

## **Licence**

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, de le modifier et de le distribuer sous réserve de respecter les conditions de la licence.

---
