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
     /* ====== Configuration des logs ====== */
    ENABLE_LOGS: true, // Permet d'activer ou de désactiver les logs dans la console. Utile pour basculer entre les environnements (développement/production).
    
    /*====== Classes CSS utilisées ======*/
    CSS_CLASSES: {
        ERROR_INPUT: 'error-input', // Classe CSS pour styliser un champ avec une erreur (ex : bordure rouge).
        ERROR_MODAL: 'error-modal', // Classe CSS pour afficher une erreur dans la modale.
        MODAL_ACTIVE: 'active',  // Classe CSS pour indiquer qu'une modale est active et visible.
        BODY_NO_SCROLL: 'no-scroll', // Classe CSS pour empêcher le défilement de la page lorsque la modale est ouverte.
        NAV_RESPONSIVE: 'responsive', // Classe CSS pour activer le mode "responsive" du menu de navigation.
        HERO_DEFAULT: 'hero-default', // Classe CSS pour le style par défaut de la section "hero".
        HERO_RESPONSIVE: 'hero-responsive', // Classe CSS pour ajuster la section "hero" en mode responsive.
        MODAL_DEFAULT: 'modal-default', // Classe CSS pour le style par défaut de la modale.
        MODAL_RESPONSIVE: 'modal-responsive',  // Classe CSS pour adapter la modale au mode responsive.
    },
    LOG_STYLES: {
        info: "color: blue; font-weight: bold;", // Style pour les messages d'information.
        warn: "color: orange; font-weight: bold;", // Style pour les avertissements.
        error: "color: red; font-weight: bold;", // Style pour les erreurs critiques.
        success: "color: green; font-weight: bold;", // Style pour les messages indiquant une réussite.
        default: "color: black;", // Style par défaut pour les messages qui ne correspondent pas à un type spécifique.
    },
    LOG_ICONS: {
        info: 'ℹ️',  // Icône pour les messages d'information.
        warn: '⚠️', // Icône pour les avertissements.
        error: '❌', // Icône pour les erreurs critiques.
        success: '✅', // Icône pour indiquer une réussite.
        default: '🔵', // Icône par défaut si le type de message n'est pas défini.
    },
    MEDIA: {
        isMobile: window.matchMedia("(max-width: 768px)").matches, // Indique si l'utilisateur utilise un appareil avec un écran de taille inférieure ou égale à 768px.
    },
};


/* =============================== */
/*    Sélections des Éléments DOM  */
/* =============================== */

const DOM = {
    // ====== Styles racine ======
    rootStyles: getComputedStyle(document.documentElement), 
    // Récupère les styles CSS globaux définis sur l'élément racine (généralement :root). 
    // Utile pour accéder aux variables CSS dynamiquement.

    // ====== Navigation ======
    navElement: document.getElementById("Topnav"), 
    // Élément principal de la barre de navigation.

    // ====== Modale ======
    modalbg: document.querySelector(".bground"), 
    // Conteneur de la modale incluant l'arrière-plan et le contenu principal.

    // ====== Section Hero ======
    heroSection: document.querySelector(".hero-content"), 
    // Section principale (généralement un en-tête ou une image de présentation).

    // ====== Boutons de la modale ======
    modalbtn: document.querySelectorAll(".modal-btn"), 
    // Tous les boutons qui déclenchent l'ouverture de la modale.

    // ====== Champs de formulaire ======
    formData: document.querySelectorAll(".formData"), 
    // Conteneurs pour chaque champ de formulaire (inclut les labels, inputs, messages d'erreur).

    // ====== Bouton pour fermer la modale ======
    closeBtn: document.querySelector(".close"), 
    // Bouton permettant de fermer la modale.

    // ====== Champs d'entrée ======
    inputs: document.querySelectorAll('input'), 
    // Tous les champs d'entrée (input) présents dans le formulaire.

    // ====== Champ de saisie pour la date de naissance ======
    birthdateInput: document.getElementById('birthdate'), 
    // Champ spécifique pour saisir la date de naissance.

    // ====== Modale de confirmation ======
    confirmationModal: document.getElementById('confirmation-modal'), 
    // Conteneur de la modale de confirmation affichée après une soumission réussie.

    // ====== Bouton pour fermer la modale de confirmation ======
    closeModalBtn: document.getElementById('close-modal-btn'), 
    // Bouton utilisé pour fermer la modale de confirmation.

    // ====== Liens de navigation ======
    navLinks: document.querySelector('.nav-links'), 
    // Conteneur pour les liens de navigation. Utilisé notamment pour gérer l'état responsive du menu.
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



/* ========================= Fonction pour supprimer une classe CSS =================*/
/**
 * Supprime une classe CSS d'un élément HTML.
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

/*===============================================================================================*/
/*                                 ======= Affichage responsive toggle =======                   */           
/*===============================================================================================*/
/** 
 * Fonction pour activer/désactiver le menu responsive.
 * 
 * Étapes :
 * 1. Ajoute ou retire la classe "responsive" à l'élément de navigation (`navElement`).
 * 2. Modifie les classes des sections Hero et Modale pour s'adapter au mode responsive.
 * 3. Enregistre les actions effectuées dans la console pour un suivi précis.
 * 4. Gère les erreurs avec un bloc try-catch.
 * 
 * @returns {void}
 */
function editNav() {
    try {
        // Vérifie si l'élément de navigation existe
        if (!DOM.navElement || !DOM.heroSection || !DOM.modalbg) {
            throw new Error('Certains éléments DOM requis sont introuvables.');
        }

        // Alterne la classe "responsive" sur l'élément de navigation
        const isResponsive = DOM.navElement.classList.toggle(CONFIG.CSS_CLASSES.NAV_RESPONSIVE);

        // Applique les classes appropriées pour la section Hero et la modale
        if (isResponsive) {
            // Activation du mode responsive
            DOM.heroSection.classList.replace(
                CONFIG.CSS_CLASSES.HERO_DEFAULT,
                CONFIG.CSS_CLASSES.HERO_RESPONSIVE
            );
            DOM.modalbg.classList.replace(
                CONFIG.CSS_CLASSES.MODAL_DEFAULT,
                CONFIG.CSS_CLASSES.MODAL_RESPONSIVE
            );
        } else {
            // Désactivation du mode responsive
            DOM.heroSection.classList.replace(
                CONFIG.CSS_CLASSES.HERO_RESPONSIVE,
                CONFIG.CSS_CLASSES.HERO_DEFAULT
            );
            DOM.modalbg.classList.replace(
                CONFIG.CSS_CLASSES.MODAL_RESPONSIVE,
                CONFIG.CSS_CLASSES.MODAL_DEFAULT
            );
        }

        // Log l'état actuel du menu responsive
        logEvent('info', `Menu responsive ${isResponsive ? 'activé' : 'désactivé'}.`, {
            responsiveState: isResponsive ? 'opened' : 'closed',
        });
    } catch (error) {
        // Gestion des erreurs
        logEvent('error', 'Erreur lors de la gestion du menu responsive.', { error: error.message });
        console.error('Erreur dans editNav :', error);
    }
}
