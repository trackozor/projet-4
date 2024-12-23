/* ========================================================
 * Nom du fichier : modal.js
 * Description    : Script JavaScript pour la gestion de la modale,
 *                  validation des formulaires et comportement responsive.
 * Auteur         : Trackozor
 * Date           : 23/12/2024
 * Version        : 1.0.0
 * ======================================================== */


/* =============================== */
/*       Configuration Globale     */
/* =============================== */

const CONFIG = {
    ENABLE_LOGS: true, // Activation/désactivation des logs
    CSS_CLASSES: {
        ERROR_INPUT: 'error-input',
        ERROR_MODAL: 'error-modal',
        MODAL_ACTIVE: 'active',
        BODY_NO_SCROLL: 'no-scroll',
        NAV_RESPONSIVE: 'responsive',
        HERO_DEFAULT: 'hero-default',
        HERO_RESPONSIVE: 'hero-responsive',
        MODAL_DEFAULT: 'modal-default',
        MODAL_RESPONSIVE: 'modal-responsive',
    },
    LOG_STYLES: {
        info: "color: blue; font-weight: bold;",
        warn: "color: orange; font-weight: bold;",
        error: "color: red; font-weight: bold;",
        success: "color: green; font-weight: bold;",
        default: "color: black;",
    },
    MEDIA: {
        isMobile: window.matchMedia("(max-width: 768px)").matches, // Indique si l'utilisateur est sur mobile
    },
};


/* =============================== */
/*    Sélections des Éléments DOM  */
/* =============================== */

const DOM = {
    rootStyles: getComputedStyle(document.documentElement),
    navElement: document.getElementById("Topnav"),
    modalbg: document.querySelector(".bground"),
    heroSection: document.querySelector(".hero-content"),
    modalbtn: document.querySelectorAll(".modal-btn"),
    formData: document.querySelectorAll(".formData"),
    closeBtn: document.querySelector(".close"),
    inputs: document.querySelectorAll('input'),
    birthdateInput: document.getElementById('birthdate'),
    confirmationModal: document.getElementById('confirmation-modal'),
    closeModalBtn: document.getElementById('close-modal-btn'),
    navLinks: document.querySelector('.nav-links'),
};

/*========================================================================================*/
/*                       =========== Fonctions utilitaires ===================            */
/*========================================================================================*/

/*======================Fonction log console==============================================*/
/**
 * Log les événements dans la console avec horodatage, préfixes et styles.
 * 
 * @param {string} type - Type de log : 'info', 'warn', 'error'.
 * @param {string} message - Message descriptif de l'événement.
 * @param {Object} [data={}] - Données supplémentaires à afficher (facultatif).
 */
function logEvent(type, message, data = {}) {
    if (!ENABLE_LOGS) {
        return; // Si les logs sont désactivés, sortir de la fonction immédiatement.
    }

    const timestamp = new Date().toLocaleTimeString(); // Récupère l'heure actuelle au format HH:MM:SS.
    const prefix = `[GameOn][${timestamp}]`; // Préfixe standard pour identifier les logs et horodatage.
    
    const icons = {
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
        success: '✅',
        default: '🔵',
    };

    const icon = icons[type] || icons.default; // Icône par défaut si le type est inconnu

    // Récupère le style approprié depuis `logStyles` en fonction du type (info, warn, error).
    const style = logStyles[type] || logStyles.default || 'color: black;';
    const fullMessage = `${icon} ${prefix} ${type.toUpperCase()}: ${message}`; // Message complet à afficher.

    // Vérification : Si le message est vide, afficher un avertissement.
    if (!message) {
        console.warn('%c[AVERTISSEMENT] Aucun message fourni dans logEvent', style);
        return;
    }

    // Affiche le message dans la console en utilisant le style associé.
    // `console[type]` permet d'utiliser `console.log`, `console.warn` ou `console.error` dynamiquement.
    console[type] 
        ? console[type](`%c${fullMessage}`, style, data) 
        : console.log(`%c${fullMessage}`, style, data); // Fallback vers `console.log` si le type est inconnu.
}

/* ========================= Fonction pour ajouter une classe CSS =================*/
/**
 * Ajoute une classe CSS à un élément.
 * @param {HTMLElement} element - Élément cible.
 * @param {string} className - Classe à ajouter.
 */
function addClass(element, className) {
    if (element && !element.classList.contains(className)) {
        element.classList.add(className);
    }
}

/* ========================= Fonction pour retirer une classe CSS =================*/
/**
 * Supprime une classe CSS d'un élément.
 * @param {HTMLElement} element - Élément cible.
 * @param {string} className - Classe à supprimer.
 */
function removeClass(element, className) {
    if (element && element.classList.contains(className)) {
        element.classList.remove(className);
    }
}