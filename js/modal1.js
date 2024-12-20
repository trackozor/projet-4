
/* ==========================================================
 * Nom du fichier : modal.js
 * Description    : Script JavaScript pour la gestion de la modale,
 *                  validation des formulaires et comportement responsive.
 * Auteur         : Trackozor
 * Date           : 21/411/2024
 * ==========================================================*/




/*===============================================================================================*/
/*                                 ======= Déclaration des variables =======                     */           
/*===============================================================================================*/



// ======= Éléments du DOM =======
const rootStyles = getComputedStyle(document.documentElement);
const navElement = document.getElementById("Topnav"); // Élément principal de la navigation (utilisé pour le menu responsive)
const modalbg = document.querySelector(".bground"); // Conteneur de la modale, incluant l'arrière-plan et le contenu
const heroSection = document.querySelector(".hero-content"); // Section principale "hero", souvent utilisée pour des ajustements de style
const modalbtn = document.querySelectorAll(".modal-btn"); // Boutons permettant d'ouvrir la modale
const formData = document.querySelectorAll(".formData"); // Conteneurs individuels des champs du formulaire
const closeBtn = document.querySelector(".close"); // Bouton pour fermer la modale
const inputs = document.querySelectorAll('input'); // Tous les champs de saisie du formulaire (prénom, e-mail, etc.)
const birthdateInput = document.getElementById('birthdate'); // Champ spécifique pour saisir la date de naissance
const confirmationModal = document.getElementById('confirmation-modal'); // Élément de la modale de confirmation (affiché après soumission)
const closeModalBtn = document.getElementById('close-modal-btn'); // Bouton permettant de fermer la modale de confirmation
const navLinks = document.querySelector('.nav-links');

// ========= Activation des logs =========
const ENABLE_LOGS = true; // Option pour désactiver les logs globalement


// ======= Styles pour les logs =======
const logStyles = {
    info: rootStyles.getPropertyValue('--log-info').trim() || "color: blue; font-weight: bold;",
    warn: rootStyles.getPropertyValue('--log-warn').trim() || "color: orange; font-weight: bold;",
    error: rootStyles.getPropertyValue('--log-error').trim() || "color: red; font-weight: bold;",
    success: rootStyles.getPropertyValue('--log-success').trim() || "color: teal; font-weight: bold;",
    testStart: rootStyles.getPropertyValue('--log-test-start').trim() || "color: #FF69B4; font-weight: bold;",
    testEnd: rootStyles.getPropertyValue('--log-test-end').trim() || "color: purple; font-weight: bold;",
    default: rootStyles.getPropertyValue('--log-default').trim() || "color: black;",
};


// ======= Noms des classes CSS =======
const CSS_CLASSES = {
    ERROR_INPUT: 'error-input',
    ERROR_MODAL: 'error-modal',
    MODAL_ACTIVE: 'active',
    BODY_NO_SCROLL: 'no-scroll',
    NAV_RESPONSIVE: 'responsive',
    HERO_DEFAULT: 'hero-default',
    HERO_RESPONSIVE: 'hero-responsive',
    MODAL_DEFAULT: 'modal-default',
    MODAL_RESPONSIVE: 'modal-responsive',
};

// ======= Variables pour les médias =======
const isMobile = window.matchMedia("(max-width: 767px)").matches; // Indique si l'utilisateur utilise un appareil avec un petit écran (mobile)


// ======= État global =======
let modalOpen = false; // Variable pour suivre l'état d'ouverture de la modale. "true" signifie que la modale est ouverte


