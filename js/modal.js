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
    LOG_ICONS: {
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
        success: '✅',
        default: '🔵',
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
 * @param {Object} [data={}] - Données supplémentaires à afficher .
 */
function logEvent(type, message, data = {}) {
    
    /* 1. Vérifie si les logs sont activés via CONFIG.ENABLE_LOGS.*/  
    if (!CONFIG.ENABLE_LOGS) {
        return; // Si les logs sont désactivés, sortir de la fonction immédiatement.
    }

    /* 2. Récupère l'horodatage et construit un préfixe pour identifier la source du log.*/
    const timestamp = new Date().toLocaleTimeString(); // Récupère l'heure actuelle au format HH:MM:SS.
    const prefix = `[GameOn][${timestamp}]`; // Préfixe standard pour identifier les logs et horodatage.

    /*3. Sélectionne une icône, un style en fonction du type de log  et construit le message complet avec le type, l'icône, et le contenu.*/
    const icon = CONFIG.LOG_ICONS[type] || CONFIG.LOG_ICONS.default;// Icône par défaut si le type est inconnu    
    const style = CONFIG.LOG_STYLES[type] || CONFIG.LOG_STYLES.default ;// Récupère le style approprié depuis `logStyles` en fonction du type (info, warn, error).
    const fullMessage = `${icon} ${prefix} ${type.toUpperCase()}: ${message}`; // Message complet à afficher.

    /*4. Vérifie si le message est vide pour éviter les logs inutiles.*/
    if (!message) {
        console.warn('%c[AVERTISSEMENT] Aucun message fourni dans logEvent', style);
        return;
    }

    /* 5. Affiche le log dans la console en utilisant le type dynamique (info, warn, error, etc.).*/
    try {
    console[type] 
        ? console[type](`%c${fullMessage}`, style, data) 
        : console.log(`%c${fullMessage}`, style, data);
    } catch (error) {
        console.error('Erreur dans logEvent :', error);
    }

}

/* ========================= Fonction pour ajouter une classe CSS =================*/
/**
 * Ajoute une classe CSS à un élément HTML.
 * 
 * @param {HTMLElement} element - Élément HTML cible.
 * @param {string} className - Nom de la classe CSS à ajouter.
 * @returns {boolean} - `true` si la classe a été ajoutée, `false` si elle était déjà présente ou en cas d'erreur.
 */
function addClass(element, className) {
    // Vérifie si l'élément est valide
    if (!(element instanceof HTMLElement)) {
        console.error('addClass: Le paramètre "element" n\'est pas un élément HTML valide.', { element });
        return false; // Échec de l'opération
    }

    // Vérifie si la classe est une chaîne de caractères valide
    if (typeof className !== 'string' || className.trim() === '') {
        console.error('addClass: Le paramètre "className" est invalide.', { className });
        return false; // Échec de l'opération
    }

    // Vérifie si la classe est déjà présente
    if (element.classList.contains(className)) {
        console.info(`addClass: La classe "${className}" est déjà présente sur l'élément.`, { element });
        return false; // Pas besoin d'ajouter la classe
    }

    // Ajoute la classe à l'élément
    try {
        element.classList.add(className);
        console.info(`addClass: La classe "${className}" a été ajoutée avec succès.`, { element });
        return true; // Succès de l'opération
    } catch (error) {
        console.error('addClass: Une erreur est survenue lors de l\'ajout de la classe.', { error });
        return false; // Échec de l'opération
    }
}


/**
 * Supprime une classe CSS d'un élément HTML.
 * 
 * Étapes :
 * 1. Valide que `element` est un élément HTML.
 * 2. Valide que `className` est une chaîne de caractères non vide.
 * 3. Vérifie si la classe est présente sur l'élément.
 * 4. Supprime la classe si elle est présente.
 * 5. Retourne un booléen indiquant si l'opération a réussi.
 * 
 * @param {HTMLElement} element - Élément HTML cible.
 * @param {string} className - Nom de la classe CSS à supprimer.
 * @returns {boolean} - `true` si la classe a été supprimée, `false` si elle n'était pas présente ou en cas d'erreur.
 */
function removeClass(element, className) {
    // 1. Vérifie que l'élément est un élément HTML valide
    if (!(element instanceof HTMLElement)) {
        console.error('removeClass: Le paramètre "element" n\'est pas un élément HTML valide.', { element });
        return false; // Échec de l'opération
    }

    // 2. Vérifie que le nom de la classe est une chaîne non vide
    if (typeof className !== 'string' || className.trim() === '') {
        console.error('removeClass: Le paramètre "className" est invalide.', { className });
        return false; // Échec de l'opération
    }

    // 3. Vérifie si la classe est présente sur l'élément
    if (!element.classList.contains(className)) {
        console.info(`removeClass: La classe "${className}" n'est pas présente sur l'élément.`, { element });
        return false; // Pas besoin de retirer la classe
    }

    // 4. Retire la classe de l'élément
    try {
        element.classList.remove(className);
        console.info(`removeClass: La classe "${className}" a été retirée avec succès.`, { element });
        return true; // Succès de l'opération
    } catch (error) {
        console.error('removeClass: Une erreur est survenue lors de la suppression de la classe.', { error });
        return false; // Échec de l'opération
    }
}
