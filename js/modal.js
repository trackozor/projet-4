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
    
     /* ====== Niveaux de Logs ====== */
    LOG_LEVELS: {
        default: true,
        info: true,  // Activer/Désactiver les logs d'information
        warn: true,  // Activer/Désactiver les avertissements
        error: true, // Activer/Désactiver les erreurs
        success: true, // Activer/Désactiver les logs de succès
        check: true, // Activer/Désactiver les logs de la checkbox info
        checkfinal:true,
    },

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


    /*====== styles tag log ======*/
    LOG_STYLES: {
        info: "color: blue; font-weight: bold;", // Style pour les messages d'information.
        warn: "color: orange; font-weight: bold;", // Style pour les avertissements.
        error: "color: red; font-weight: bold;", // Style pour les erreurs critiques.
        success: "color: green; font-weight: bold;", // Style pour les messages indiquant une réussite.
        default: "color: black;", // Style par défaut pour les messages qui ne correspondent pas à un type spécifique.
        check: "background-color: pink; color: purple;font-weight: bold;", // Style pour la checkbox d'info
        checkfinal:"background-color: green; color: white;font-weight: bold;", // Style pour la checkbox d'info
    },

    /*====== styles icône log ======*/
    LOG_ICONS: {
        info: 'ℹ️',  // Icône pour les messages d'information.
        warn: '⚠️', // Icône pour les avertissements.
        error: '❌', // Icône pour les erreurs critiques.
        success: '✅', // Icône pour indiquer une réussite.
        default: '🔵', // Icône par défaut si le type de message n'est pas défini.
    },

    /*====== Configuration des médias ======*/
    MEDIA: {
        isMobile: window.matchMedia("(max-width: 1023px)").matches, // Indique si l'utilisateur utilise un appareil avec un écran de taille inférieure ou égale à 1024px.
    },
};

let modalOpen = false; // Variable globale pour suivre l'état de la modale
let isCheckboxValid = false; // Indique si la checkbox est valide

/*================================================================================================================================================*/
/* =============================== */
/*    Sélections des Éléments DOM  */
/* =============================== */

const DOM = {
    // ====== Styles racine ======
    rootStyles: getComputedStyle(document.documentElement), 
    // Récupère les styles CSS globaux définis sur l'élément racine . 

    // ====== Navigation ======
    navElement: document.getElementById("Topnav"), 
    // Élément principal de la barre de navigation.

    // ====== Modale ======
    modalbg: document.querySelector(".bground"), 
    // Conteneur de la modale incluant l'arrière-plan et le contenu principal.

    // ====== Section Hero ======
    heroSection: document.querySelector(".hero-content"), 
    // Section principale .

    // ====== Boutons de la modale ======
    modalbtn: document.querySelectorAll(".modal-btn"), 
    // Tous les boutons qui déclenchent l'ouverture de la modale.

    // ====== Champs de formulaire ======
    formData: document.querySelectorAll(".formData"), 
    // Conteneurs pour chaque champ de formulaire .

    // ====== Bouton pour fermer la modale ======
    closeBtn: document.querySelector(".close"), 
    // Bouton permettant de fermer la modale.

    // ====== Champs d'entrée ======
    inputs: document.querySelectorAll('input'), 
    // Tous les champs d'entrée (input) présents dans le formulaire.

    // ====== Champ de saisie pour la date de naissance ======
    birthdateInput: document.getElementById('birthdate'), 
    // Champ spécifique pour saisir la date de naissance.

    
    // Récupérer les checkbox dans le DOM
    checkboxElement: document.querySelector('#checkbox1'),
    checkboxElement1: document.querySelector('#checkbox2'),
    // ====== Modale de confirmation ======

    confirmationModal: document.getElementById('confirmation-modal'), 
    // Conteneur de la modale de confirmation affichée après une soumission réussie.

    // ====== Bouton pour fermer la modale de confirmation ======
    closeModalBtn: document.getElementById('close-modal-btn'), 
    // Bouton utilisé pour fermer la modale de confirmation.

     // ====== Modale d'erreur ======
    errorModal: {
        container: document.getElementById('error-modal'), 
        // Conteneur principal de la modale d'erreur.
        content: document.querySelector('error-modal .modal-content'), 
        // Contenu interne de la modale d'erreur (messages, actions, etc.).
    },


    // ====== Liens de navigation ======
    navLinks: document.querySelector('.nav-links'), 
    // Conteneur pour les liens de navigation. Utilisé notamment pour gérer l'état responsive du menu.
};


/*================================================================================================================================================*/
/*========================================================================================*/
/*                       =========== Fonctions utilitaires ===================            */
/*========================================================================================*/

/*======================Fonction log console==============================================*/
/**
 * Log les événements dans la console avec horodatage, icônes et styles personnalisés.
 * 
 * Étapes principales :
 * 1. Vérifie si les logs sont activés globalement (`CONFIG.ENABLE_LOGS`).
 * 2. Filtre les logs en fonction des niveaux activés dans `CONFIG.LOG_LEVELS`.
 * 3. Récupère l'horodatage et construit un préfixe pour identifier l'origine du log.
 * 4. Associe une icône et un style au log en fonction de son type.
 * 5. Valide que le message est fourni avant d'afficher quoi que ce soit.
 * 6. Affiche le log dans la console avec un style formaté, ou gère les erreurs si elles surviennent.
 *
 * @param {string} type - Niveau du log : 'info', 'warn', 'error', 'success', etc.
 * @param {string} message - Description de l'événement à loguer.
 * @param {Object} [data={}] - (Optionnel) Données supplémentaires liées au log.
 * 
 * @example
 * logEvent('info', 'Chargement terminé', { module: 'Formulaire', status: 'OK' });
 * logEvent('error', 'Échec de la validation', { field: 'email', reason: 'Format invalide' });
 */

function logEvent(type, message, data = {}) {
    
    /* 1. Vérifie si les logs sont activés via CONFIG.ENABLE_LOGS.*/  
    if (!CONFIG.ENABLE_LOGS) {
        return; // Si les logs sont désactivés, sortir de la fonction immédiatement.
    }

    // Vérifie si le type de log est activé dans LOG_LEVELS
    if (!CONFIG.LOG_LEVELS[type]) {
        return; // Si le type de log est désactivé, ne rien afficher
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
        logEvent('error','addClass: Le paramètre "element" n\'est pas un élément HTML valide.', { element });
        return false; // Échec de l'opération
    }

    // Vérifie si la classe est une chaîne de caractères valide
    if (typeof className !== 'string' || className.trim() === '') {
        logEvent('error','addClass: Le paramètre "className" est invalide.', { className });
        return false; // Échec de l'opération
    }

    // Vérifie si la classe est déjà présente
    if (element.classList.contains(className)) {
        logEvent('info'`addClass: La classe "${className}" est déjà présente sur l'élément.`, { element });
        return false; // Pas besoin d'ajouter la classe
    }

    // Ajoute la classe à l'élément
    try {
        element.classList.add(className);
        logEvent('success',`addClass: La classe "${className}" a été ajoutée avec succès.`, { element });
        return true; // Succès de l'opération
    } catch (error) {
        logEvent('error','addClass: Une erreur est survenue lors de l\'ajout de la classe.', { error });
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
        logEvent('error','removeClass: Le paramètre "element" n\'est pas un élément HTML valide.', { element });
        return false; // Échec de l'opération
    }

    // 2. Vérifie que le nom de la classe est une chaîne non vide
    if (typeof className !== 'string' || className.trim() === '') {
        logEvent('error','removeClass: Le paramètre "className" est invalide.', { className });
        return false; // Échec de l'opération
    }

    // 3. Vérifie si la classe est présente sur l'élément
    if (!element.classList.contains(className)) {
        logEvent('info',`removeClass: La classe "${className}" n'est pas présente sur l'élément.`, { element });
        return false; // Pas besoin de retirer la classe
    }

    // 4. Retire la classe de l'élément
    try {
        element.classList.remove(className);
        logEvent('success',`removeClass: La classe "${className}" a été retirée avec succès.`, { element });
        return true; // Succès de l'opération
    } catch (error) {
        logEvent('error','removeClass: Une erreur est survenue lors de la suppression de la classe.', { error });
        return false; // Échec de l'opération
    }
}


/*================================================================================================================================================*/
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


/*================================================================================================================================================*/
/*===============================================================================================*/
/*                                 ======= Formulaire =======                                    */           
/*===============================================================================================*/

/**
 * Réinitialise le formulaire de la modale.
 * 
 * Étapes principales :
 * 1. Vérifie l'existence du formulaire à réinitialiser.
 * 2. Réinitialise les champs du formulaire.
 * 3. Supprime les messages d'erreur existants.
 * 4. Retire les styles d'erreur des champs concernés.
 * 5. Journalise les actions effectuées, avec un résumé final.
 * 6. Gère les erreurs imprévues.
 * 
 * @returns {void}
 */
function resetForm() {
    try {
        // Étape 1 : Vérifie l'existence de la modale et du formulaire
        if (!DOM.modalbg) {
            logEvent('error', 'Élément modalbg introuvable. Réinitialisation annulée.');
            return;
        }

        const form = DOM.modalbg.querySelector('form');
        if (!form) {
            logEvent('warn', 'Aucun formulaire trouvé à réinitialiser.');
            return;
        }

        // Étape 2 : Réinitialise tous les champs du formulaire
        form.reset();
        logEvent('success', 'Formulaire réinitialisé avec succès.');

        // Étape 3 : Supprime tous les messages d'erreur affichés
        const errorMessages = form.querySelectorAll(`.${CONFIG.CSS_CLASSES.ERROR_MODAL}`);
        errorMessages.forEach((error) => {
            if (error.parentElement) {
                error.remove();
                logEvent('success', 'Message d\'erreur supprimé.', { errorContent: error.textContent });
            }
        });

        // Étape 4 : Retire les styles d'erreur des champs concernés
        const errorInputs = form.querySelectorAll(`.${CONFIG.CSS_CLASSES.ERROR_INPUT}`);
        errorInputs.forEach((input) => {
            input.classList.remove(CONFIG.CSS_CLASSES.ERROR_INPUT);
            logEvent('success', `Classe d'erreur retirée du champ : ${input.id || input.name}`);
        });

        // Étape 5 : Log final
        logEvent('info', `Réinitialisation complète : ${errorMessages.length} messages d'erreur supprimés, ${errorInputs.length} champs nettoyés.`);
    } catch (error) {
        // Étape 6 : Gère les erreurs imprévues
        logEvent('error', 'Erreur lors de la réinitialisation du formulaire.', { error: error.message });
        console.error('Erreur dans resetForm :', error);
    }
}



/*=========================================================================================================================================================================*/
/*===============================================================================================*/
/*                                 ======= Validation des champs =======                         */           
/*===============================================================================================*/

/* ============ Fonction de validation du champ prénom ===================*/
/**
 * Valide le champ "Prénom".
 * 
 * Critères de validation :
 * - Non vide.
 * - Longueur minimale de 2 caractères.
 * - Ne contient que des lettres, des accents, des espaces, des apostrophes ou des tirets.
 * 
 * @param {Event} event - Événement déclenché lors de l'interaction avec le champ.
 * @returns {boolean} - Retourne `true` si la validation est réussie, sinon `false`.
 */
function validateFirstName(event) {
    const field = event.target; // Champ cible
    const value = field.value.trim(); // Supprime les espaces inutiles
    let errorMessage = '';

    // === Validation des critères ===
    if (value === '') {
        errorMessage = 'Le prénom est requis.';
    } else if (value.length < 2) {
        errorMessage = 'Le prénom doit contenir au moins 2 caractères.';
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ]+(?:[-' ][a-zA-ZÀ-ÖØ-öø-ÿ]+)*$/.test(value)) {
        errorMessage = 'Le prénom contient des caractères invalides.';
    }

    // === Gestion des erreurs ===
    if (errorMessage) {
        showError(errorMessage, field); // Affiche un message d'erreur
        logEvent('warn', 'Validation échouée pour le prénom.', { errorMessage, value });
        return false; // Indique une validation échouée
    } else {
        removeError(field); // Supprime tout message d'erreur existant
        logEvent('success', 'Validation réussie pour le prénom.', { value });
        return true; // Indique une validation réussie
    }
}


/* ============ Fonction de validation du champ nom ===================*/
/**
 * Valide le champ "Nom".
 * 
 * Critères de validation similaires à ceux du prénom :
 * - Non vide.
 * - Longueur minimale de 2 caractères.
 * - Ne contient que des lettres, des accents, des espaces, des apostrophes ou des tirets.
 * 
 * @param {Event} event - Événement déclenché lors de l'interaction avec le champ.
 * @returns {boolean} - Retourne `true` si la validation est réussie, sinon `false`.
 */
function validateLastName(event) {
    const field = event.target; // Champ cible
    const value = field.value.trim(); // Supprime les espaces inutiles
    let errorMessage = '';

    // === Validation des critères ===
    if (value === '') {
        errorMessage = 'Le nom est requis.';
    } else if (value.length < 2) {
        errorMessage = 'Le nom doit contenir au moins 2 caractères.';
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ]+(?:[-' ][a-zA-ZÀ-ÖØ-öø-ÿ]+)*$/.test(value)) {
        errorMessage = 'Le nom contient des caractères invalides.';
    }

    // === Gestion des erreurs ===
    if (errorMessage) {
        showError(errorMessage, field); // Affiche un message d'erreur
        logEvent('warn', 'Validation échouée pour le nom.', { errorMessage, value });
        return false; // Indique une validation échouée
    } else {
        removeError(field); // Supprime tout message d'erreur existant
        logEvent('success', 'Validation réussie pour le nom.', { value });
        return true; // Indique une validation réussie
    }
}

/* ============ Fonction de validation du champ email ===================*/
/**
 * Valide le champ "E-mail".
 * 
 * Critères de validation :
 * - Non vide.
 * - Respecte un format d'adresse e-mail valide.
 * 
 * @param {Event} event - Événement déclenché lors de l'interaction avec le champ.
 * @returns {boolean} - Retourne `true` si la validation est réussie, sinon `false`.
 */
function validateEmail(event) {
    const field = event.target;
    const value = field.value.trim();
    let errorMessage = '';

    // === Validation des critères ===
    if (value === '') {
        errorMessage = 'L\'e-mail est requis.';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        errorMessage = 'Veuillez entrer une adresse e-mail valide.';
    }

    // === Gestion des erreurs ===
    if (errorMessage) {
        showError(errorMessage, field); // Affiche un message d'erreur
        logEvent('warn', 'Validation échouée pour l\'e-mail.', { errorMessage, value });
        return false; // Indique une validation échouée
    } else {
        removeError(field); // Supprime tout message d'erreur existant
        logEvent('success', 'Validation réussie pour l\'e-mail.', { value });
        return true; // Indique une validation réussie
    }
}


/*================Fonction de validation de la date de naissance =================*/
/**
 * Valide le champ "Date de naissance".
 * 
 * Critères de validation :
 * - Non vide.
 * - Date inférieure à la date actuelle.
 * - Date ne dépassant pas 100 ans dans le passé.
 * - Date supérieure à 18 ans dans le passé.
 * 
 * @param {Event} event - Événement déclenché lors de l'interaction avec le champ.
 * @returns {boolean} - Retourne `true` si la validation est réussie, sinon `false`.
 */
function validateBirthdate(event) {
    const field = event.target; // Champ cible
    const value = field.value.trim(); // Supprime les espaces inutiles
    let errorMessage = '';

    // === Validation des critères ===
    if (value === '') {
        errorMessage = 'La date de naissance est requise.';
    } else {
        const birthDate = new Date(value);
        const today = new Date();
        const maxBirthDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
        const minBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

        if (isNaN(birthDate.getTime())) {
            errorMessage = 'Veuillez entrer une date valide.';
        } else if (birthDate >= today) {
            errorMessage = 'La date de naissance doit être dans le passé.';
        } else if (birthDate < maxBirthDate) {
            errorMessage = 'La date de naissance ne peut pas dépasser 100 ans.';
        } else if (birthDate > minBirthDate) {
            errorMessage = 'Vous devez avoir au moins 18 ans pour vous inscrire à un tournoi.';
        }
    }

    // === Gestion des erreurs ===
    if (errorMessage) {
        showError(errorMessage, field); // Affiche un message d'erreur
        logEvent('warn', 'Validation échouée pour la date de naissance', { errorMessage, value });
        return false; // Validation échouée
    } else {
        removeError(field); // Supprime tout message d'erreur existant
        logEvent('success', 'Validation réussie pour la date de naissance', { value });
        return true; // Validation réussie
    }
}
/*===================== Fonction validation de quantité du nombre de tournoi effectué ============*/
/**
 * Valide le champ "Quantité" (nombre de participations).
 * 
 * Critères de validation :
 * - Non vide.
 * - Valeur numérique entre 0 et 99.
 * 
 * @param {Event} event - Événement déclenché lors de l'interaction avec le champ.
 * @returns {boolean} - Retourne `true` si la validation est réussie, sinon `false`.
 */
function validateQuantity(event) {
    const field = event.target; // Champ cible
    const value = field.value.trim(); // Nettoie les espaces inutiles
    let errorMessage = '';

    // === Validation des critères ===
    if (value === '') {
        errorMessage = 'Le nombre de participations est requis.';
    } else if (isNaN(value) || value < 0 || value > 99) {
        errorMessage = 'Le nombre de participations doit être entre 0 et 99.';
    }

    // === Gestion des erreurs ===
    if (errorMessage) {
        showError(errorMessage, field); // Affiche un message d'erreur
        logEvent('warn', 'Validation échouée pour la quantité', { errorMessage, value });
        return false; // Validation échouée
    } else {
        removeError(field); // Supprime tout message d'erreur existant
        logEvent('success', 'Validation réussie pour la quantité', { value });
        return true; // Validation réussie
    }
}


/*===================== Fonction validation de la checkbox "J'accepte les conditions générales" ============*/
/**
 * Valide la case à cocher (consentement).
 * 
 * Critères de validation :
 * - La checkbox doit être cochée.
 * 
 * @param {Event} event - Événement déclenché lors de l'interaction avec la checkbox.
 * @returns {boolean} - Retourne `true` si la validation est réussie, sinon `false`.
 */
function validateCheckbox(event) {
    const field = event?.target || document.getElementById('checkbox1'); // Cible le champ
    let errorMessage = '';

    // === Validation des critères ===
    if (!field.checked) {
        errorMessage = 'Vous devez accepter les conditions d\'utilisation.';
        isCheckboxValid = false; // La checkbox est invalide
    } else {
        isCheckboxValid = true; // La checkbox est valide
    }

    // === Gestion des erreurs ===
    if (errorMessage) {
        showError(errorMessage, field); // Affiche un message d'erreur
        logEvent('warn', 'Validation échouée pour la checkbox', { errorMessage });
        return false; // Validation échouée
    } else {
        removeError(field); // Supprime tout message d'erreur existant
        logEvent('success', 'Validation réussie pour la checkbox');
        return isCheckboxValid; // Validation réussie
    }
}



/*================================================================================================================================================*/
/*===============================================================================================*/
/*                                 ======= Messages erreurs =======                              */           
/*===============================================================================================*/

/* ============ Fonction pour afficher un message d'erreur et ajouter une bordure rouge ============*/
function showError(message, inputElement) {
    try {
        // === Validation des paramètres ===
        if (!message || !(inputElement instanceof HTMLElement)) {
            logEvent('error', 'Paramètres invalides dans showError.', { message, inputElement });
            return;
        }

        // === Log : Début de l'affichage de l'erreur ===
        logEvent('info', `Tentative d'affichage d'une erreur pour le champ : ${inputElement.id || 'non défini'}`, {
            value: inputElement.value || 'Valeur vide',
            message
        });

        // === Suppression des erreurs existantes ===
        removeError(inputElement);
        logEvent('success', `Suppression des erreurs existantes réussie pour le champ : ${inputElement.id || 'non défini'}`);

        // === Création et ajout du message d'erreur ===
        const errorTooltip = document.createElement('div');
        addClass(errorTooltip, CONFIG.CSS_CLASSES.ERROR_MODAL); // Ajoute la classe CSS d'erreur
        errorTooltip.textContent = message; // Définit le message d'erreur

        // Ajoute une bordure rouge au champ d'entrée
        addClass(inputElement, CONFIG.CSS_CLASSES.ERROR_INPUT);

        // Ajoute le message d'erreur à l'élément parent
        inputElement.parentElement.appendChild(errorTooltip);

        // === Log : Succès de l'ajout ===
        logEvent('success', `Tooltip d'erreur ajouté pour le champ : ${inputElement.id || 'non défini'}`, { message });
    } catch (error) {
        // === Gestion des erreurs ===
        logEvent('error', 'Erreur dans showError.', { error: error.message });
    }
}

/* ============ Fonction pour supprimer un message d'erreur et retirer la bordure rouge ============ */
function removeError(inputElement) {
    try {
        if (!(inputElement instanceof HTMLElement)) {
            logEvent('error', 'Paramètre invalide dans removeError.', { inputElement });
            return;
        }

        // Supprime le message d'erreur (tooltip) s'il existe
        const errorTooltip = inputElement.parentElement.querySelector(`.${CONFIG.CSS_CLASSES.ERROR_MODAL}`);
        if (errorTooltip) {
            errorTooltip.remove();
            logEvent('success', `Tooltip d'erreur supprimé pour le champ : ${inputElement.id || 'non défini'}`);
        }

        // Supprime la classe de bordure rouge
        removeClass(inputElement, CONFIG.CSS_CLASSES.ERROR_INPUT);

    } catch (error) {
        // Gestion des erreurs
        logEvent('error', 'Erreur dans removeError.', { error: error.message });
    }
}



/*================================================================================================================================================*/
/*===============================================================================================*/
/*                                 ======= Modale inscription =======                            */           
/*===============================================================================================*/

/* ============ Fonction pour afficher la modale et empêcher le défilement en arrière-plan. ============*/
/**
 * Affiche la modale et empêche le défilement en arrière-plan.
 * 
 * Étapes principales :
 * 1. Vérifie si l'élément `modalbg` est valide.
 * 2. Vérifie si la modale est déjà active ou si l'état global indique qu'elle est ouverte.
 * 3. Réinitialise le formulaire de la modale.
 * 4. Ajoute les classes CSS nécessaires pour afficher la modale.
 * 5. Empêche le défilement de la page.
 * 6. Met à jour l'état global de la modale (`modalOpen`).
 * 7. Journalise chaque étape pour le suivi.
 * 
 * @returns {void}
 */
function launchModal() {
    try {
        // Étape 1 : Vérifie si l'élément `modalbg` est défini
        if (!DOM.modalbg) {
            logEvent('error', 'Élément modalbg introuvable. Impossible d\'afficher la modale.');
            return;
        }

        // Étape 2 : Vérifie si la modale est déjà active ou si l'état global indique qu'elle est ouverte
        if (modalOpen || DOM.modalbg.classList.contains(CONFIG.CSS_CLASSES.MODAL_ACTIVE)) {
            logEvent('warn', 'La modale est déjà active ou signalée comme ouverte.');
            return;
        }

        // Étape 3 : Réinitialise le formulaire de la modale
        resetForm();
        logEvent('success', 'Formulaire réinitialisé avec succès.');

        // Étape 4 : Ajoute la classe CSS pour afficher la modale
        addClass(DOM.modalbg, CONFIG.CSS_CLASSES.MODAL_ACTIVE);

        // Étape 5 : Empêche le défilement de l'arrière-plan
        addClass(document.body, CONFIG.CSS_CLASSES.BODY_NO_SCROLL);

        // Étape 6 : Met à jour l'état global
        modalOpen = true;
        logEvent('success', 'Modale affichée avec succès.');

        // Étape 7 : Log final
        logEvent('info', 'Lancement de la modale terminé avec succès.');
    } catch (error) {
        // Étape 8 : Gestion des erreurs
        logEvent('error', 'Erreur lors de l\'affichage de la modale.', { error: error.message });
    }
}


/* ============ Fonction pour fermer la modale ============*/
/**
 * Ferme la modale et réactive le défilement de la page.
 * 
 * Étapes principales :
 * 1. Vérifie si la modale est active ou si l'état global indique qu'elle est déjà fermée.
 * 2. Supprime les classes CSS utilisées pour afficher la modale.
 * 3. Réactive le défilement de la page.
 * 4. Met à jour l'état global de la modale (`modalOpen`).
 * 5. Journalise chaque étape pour le suivi.
 * 
 * @returns {void}
 */
function closeModal() {
    try {
        // Étape 1 : Vérifie si la modale est active
        if (!modalOpen || !DOM.modalbg.classList.contains(CONFIG.CSS_CLASSES.MODAL_ACTIVE)) {
            logEvent('warn', 'Tentative de fermeture d\'une modale déjà fermée ou état incohérent.', {
                modalOpen,
                modalState: DOM.modalbg.classList.value
            });
            return;
        }

        // Étape 2 : Masque la modale
        removeClass(DOM.modalbg, CONFIG.CSS_CLASSES.MODAL_ACTIVE);
        logEvent('success', 'Modale masquée avec succès.', { modalState: DOM.modalbg.classList.value });

        // Étape 3 : Réactive le défilement de la page
        removeClass(document.body, CONFIG.CSS_CLASSES.BODY_NO_SCROLL);
        logEvent('success', 'Défilement de l\'arrière-plan réactivé.', { bodyClasses: document.body.classList.value });

        // Étape 4 : Met à jour l'état global
        modalOpen = false;
        logEvent('info', 'État global mis à jour à "fermé".', { modalOpen });

        // Étape 5 : Log final
        logEvent('info', 'Fermeture de la modale terminée avec succès.');
    } catch (error) {
        // Étape 6 : Gestion des erreurs
        logEvent('error', 'Erreur lors de la fermeture de la modale.', { error: error.message });
    }
}

/*================================================================================================================================================*/
/*===============================================================================================*/
/*                                 ======= Modal de confirmation =======                         */           
/*===============================================================================================*/

/* ============ Fonction pour ouvrir la modale de confirmation ============*/
/**
 * Ouvre la modale de confirmation.
 * 
 * Étapes principales :
 * 1. Vérifie si la modale de confirmation est déjà active pour éviter les duplications.
 * 2. Ajoute les classes nécessaires pour afficher la modale et désactiver le défilement.
 * 3. Enregistre chaque action importante dans les logs pour le suivi.
 * 4. Gère les éventuelles erreurs et les journalise dans la console.
 * 
 * @returns {void}
 */
function openConfirmationModal() {
    try {

        // Étape 2 : Vérifie si la modale est déjà active
        if (DOM.confirmationModal.classList.contains(CONFIG.CSS_CLASSES.MODAL_ACTIVE)) {
            logEvent(
                'warn', 
                'La modale de confirmation est déjà ouverte.', 
                { modalState: 'active' }
            );
            return; // Sortie anticipée si la modale est déjà active
        }

        // Étape 3 : Affiche la modale de confirmation
        addClass(DOM.confirmationModal, CONFIG.CSS_CLASSES.MODAL_ACTIVE); // Ajoute la classe CSS pour rendre la modale visible
        DOM.confirmationModal.setAttribute('aria-hidden', 'false'); // Met à jour l'accessibilité
        logEvent(
            'success', 
            'Modale de confirmation affichée avec succès.', 
            { modalState: 'active' }
        );

        // Étape 4 : Place le focus sur un élément de la modale
        const firstFocusableElement = DOM.confirmationModal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusableElement) {
            firstFocusableElement.focus(); // Place le focus sur le premier élément interactif
            logEvent(
                'info', 
                'Focus placé sur le premier élément interactif de la modale.'
            );
        }
        
    } catch (error) {
        // Étape 5 : Gestion des erreurs
        logEvent(
            'error', 
            'Erreur lors de l\'ouverture de la modale de confirmation.', 
            { error: error.message }
        );
        console.error(
            'Erreur lors de l\'ouverture de la modale de confirmation :', 
            error
        );
    }
}


/* ============ Fonction pour fermer la modale de confirmation ============ */
/**
 * Ferme la modale et réactive le défilement de la page.
 * 
 * Étapes principales :
 * 1. Vérifie si la modale est active ou si l'état global indique qu'elle est déjà fermée.
 * 2. Supprime les classes CSS utilisées pour afficher la modale.
 * 3. Réactive le défilement de la page.
 * 4. Met à jour l'état global de la modale (`modalOpen`).
 * 5. Journalise chaque étape pour le suivi.
 * 
 * @returns {void}
 */
function closeConfirmationModal() {
    try {
        // Étape 1 : Validation - Vérifie si la modale existe et est active
        if (!DOM.confirmationModal) {
            logEvent('error', 'Élément modalbg introuvable. Impossible de fermer la modale.');
            return;
        }

        if (!modalOpen || !DOM.confirmationModal.classList.contains(CONFIG.CSS_CLASSES.MODAL_ACTIVE)) {
            logEvent('warn', 'Tentative de fermeture d\'une modale déjà fermée ou état incohérent.', {
                modalOpen,
                modalState: DOM.confirmationModal.classList.value
            });
            return; // Sortie anticipée si la modale est déjà fermée
        }

        // Étape 2 : Masque la modale
        removeClass(DOM.confirmationModal, CONFIG.CSS_CLASSES.MODAL_ACTIVE);
        DOM.confirmationModal.setAttribute('aria-hidden', 'true'); // Rend la modale invisible pour les technologies d'assistance
        logEvent('success', 'Modale masquée avec succès.', { modalState: DOM.confirmationModal.classList.value });

        // Étape 3 : Réactive le défilement de la page
        removeClass(document.body, CONFIG.CSS_CLASSES.BODY_NO_SCROLL);
        logEvent('success', 'Défilement de l\'arrière-plan réactivé.', { bodyClasses: document.body.classList.value });

        // Étape 4 : Met à jour l'état global
        modalOpen = false;
        logEvent('info', 'État global mis à jour à "fermé".', { modalOpen });
        resetForm();


    } catch (error) {
        // Étape 7 : Gestion des erreurs
        logEvent('error', 'Erreur lors de la fermeture de la modale.', { error: error.message });
        console.error('Erreur dans closeModal :', error);
    }
}

/*===============================================================================================*/
/*                                 ======= Gestion des événements =======                         */           
/*===============================================================================================*/

/* ============ Gestion du Focus sur la Date de Naissance ============ */
/**
 * Ajoute un placeholder dynamique lors du focus sur le champ de date de naissance.
 * 
 * Étapes principales :
 * 1. Ajoute un texte d'exemple ('jj/mm/aaaa') comme placeholder.
 * 2. Logue l'événement pour suivi.
 * 
 * @returns {void}
 */
function handleBirthdateFocus() {
    logEvent('info', 'Focus sur le champ de date.');
    DOM.birthdateInput.placeholder = 'jj/mm/aaaa';
}

/* ============ Gestion du Blur sur la Date de Naissance ============ */
/**
 * Retire le placeholder si le champ est vide lors de la perte de focus.
 * 
 * Étapes principales :
 * 1. Vérifie si la valeur du champ est vide.
 * 2. Retire le placeholder si aucun texte n'est saisi.
 * 
 * @returns {void}
 */
function handleBirthdateBlur() {
    if (!DOM.birthdateInput.value) {
        logEvent('info', 'Perte de focus avec champ vide.');
        DOM.birthdateInput.placeholder = '';
    }
}

/* ============ Gestion du Clic sur l'Arrière-Plan de la Modale ============ */
/**
 * Ferme la modale si un clic est détecté sur son arrière-plan.
 * 
 * Étapes principales :
 * 1. Vérifie que l'élément cliqué est l'arrière-plan de la modale.
 * 2. Ferme la modale en appelant la fonction `closeModal`.
 * 
 * @param {Event} event - Événement de clic capturé.
 * @returns {void}
 */
function handleModalBackgroundClick(event) {
    if (event.target === DOM.modalbg) {
        logEvent('info', 'Clic détecté sur l\'arrière-plan de la modale.');
        closeModal();
    }
}


/* ============ Gestion de la Soumission du Formulaire ============ */
/**
 * Valide le formulaire et ouvre la modale de confirmation si valide.
 * 
 * Étapes principales :
 * 1. Empêche le rechargement de la page à la soumission.
 * 2. Valide les champs du formulaire.
 * 3. Si valide, ouvre la modale de confirmation.
 * 4. Si invalide, affiche les erreurs.
 * 
 * @param {Event} event - Événement de soumission du formulaire.
 * @returns {void}
 */

function handleFormSubmit(event) {
    event.preventDefault();
    logEvent('info', 'Soumission du formulaire détectée.');

    let hasEmptyFields = false;
    // Vérification de la sélection d'un bouton radio pour "location"
    const selectedRadio = document.querySelector('input[name="location"]:checked');

    if (selectedRadio) {
        // Log la localisation sélectionnée
        logEvent('checkfinal', `Localisation sélectionnée lors de la soumission : ${selectedRadio.value}`, {
            id: selectedRadio.id,
            value: selectedRadio.value,
        });
    } else {
        // Log informatif si aucune case n'est sélectionnée
        logEvent('checkfinal', 'Aucune localisation sélectionnée lors de la soumission.');
    }

    // Vérification des champs obligatoires
    const requiredFields = ['first', 'last', 'email', 'birthdate', 'quantity'];
    requiredFields.forEach((fieldId) => {
        const fieldElement = document.getElementById(fieldId);
        if (fieldElement && fieldElement.value.trim() === '') {
            // Affiche une erreur pour les champs vides
            showError('Ce champ est requis.', fieldElement);
            logEvent('warn', `Champ "${fieldId}" vide lors de la soumission.`, {
                fieldId,
            });
            hasEmptyFields = true;
        }
    });

    // Vérification explicite de la checkbox
    const checkboxElement = document.getElementById('checkbox1');
    if (!checkboxElement.checked) {
        logEvent('warn', 'Checkbox non cochée lors de la soumission.');
        showError('Vous devez accepter les conditions d\'utilisation.', checkboxElement);
        hasEmptyFields = true;
    }

    // Si des champs sont vides, ne pas valider le formulaire
    if (hasEmptyFields) {
        logEvent('error', 'Validation interrompue : champs vides détectés.');
        return; // Empêche la soumission
    }
    const checkboxElement1 = document.getElementById('checkbox2');
    if (!checkboxElement.checked) {
        logEvent('checkfinal', 'checkbox prévenu non activé');
    }else {
        logEvent('checkfinal', 'checkbox prévenu active');
    }
    
    

    // Si tous les champs sont remplis, passe à la validation globale
    const formValid = validateForm();

    if (formValid) {
        logEvent('info', 'Formulaire valide.');
        openConfirmationModal();
    } else {
        logEvent('error', 'Échec de la validation du formulaire.');
    }
}


/* ============ Validation Globale du Formulaire ============ */
/**
 * Valide tous les champs du formulaire et retourne le résultat global.
 * 
 * Étapes principales :
 * 1. Parcourt tous les champs à valider.
 * 2. Déclenche un événement de validation pour chaque champ.
 * 3. Valide également la checkbox des conditions générales.
 * 4. Retourne `true` si tous les champs sont valides, sinon `false`.
 * 
 * @returns {boolean} - Résultat de la validation globale.
 */
function validateForm() {
    let isValid = true;

    // === Étape 1 : Validation des champs ===
    const fields = ['first', 'last', 'email', 'birthdate', 'quantity'];
    fields.forEach((fieldId) => {
        const fieldElement = document.getElementById(fieldId);

        if (fieldElement) {
            // Déclenche l'événement de validation pour chaque champ
            const fieldIsValid = fieldElement.dispatchEvent(new Event('blur'));

            if (!fieldIsValid) {
                logEvent('warn', `Validation échouée pour le champ "${fieldId}".`, {
                    fieldId,
                    value: fieldElement.value,
                });
                isValid = false;
            } else {
                logEvent('success', `Validation réussie pour le champ "${fieldId}".`, {
                    fieldId,
                    value: fieldElement.value,
                });
            }
        } else {
            logEvent('error', `Champ "${fieldId}" introuvable dans le DOM.`);
            isValid = false;
        }
    });

    // === Étape 2 : Validation de la checkbox ===
    const checkboxElement = document.getElementById('checkbox1');

    if (checkboxElement) {
        if (!checkboxElement.checked) {
            // Si la checkbox n'est pas cochée, affiche une erreur
            showError('Vous devez accepter les conditions d\'utilisation.', checkboxElement);
            logEvent('warn', 'Checkbox non cochée.', { isChecked: false });
            isValid = false;
        } else {
            // Si la checkbox est cochée, supprime les erreurs
            removeError(checkboxElement);
            logEvent('success', 'Checkbox validée avec succès.', { isChecked: true });
        }
    } else {
        // Si la checkbox est absente du DOM, log une erreur critique
        logEvent('error', 'Checkbox introuvable dans le DOM.');
        isValid = false;
    }
    
    // === Étape 3 : Retourne le résultat global ===
    logEvent('info', 'Résultat final de la validation du formulaire.', { isValid });
    return isValid;
}



/**
 * Gère les interactions clavier, comme la fermeture de la modale avec la touche Echap.
 *
 * @param {KeyboardEvent} event - Événement clavier déclenché.
 */
function handleKeyDown(event) {
    if (event.key === 'Escape') { // Vérifie si la touche Escape est pressée
        if (DOM.errorModal.classList.contains(CONFIG.CSS_CLASSES.MODAL_ACTIVE)) {
            DOM.errorModal.classList.remove(CONFIG.CSS_CLASSES.MODAL_ACTIVE);
            document.body.classList.remove(CONFIG.CSS_CLASSES.BODY_NO_SCROLL);
            logEvent('info', 'Modale d\'erreur fermée via la touche Échap.');
        }
        if (DOM.confirmationModal.classList.contains(CONFIG.CSS_CLASSES.MODAL_ACTIVE)) {
            DOM.confirmationModal.classList.remove(CONFIG.CSS_CLASSES.MODAL_ACTIVE);
            document.body.classList.remove(CONFIG.CSS_CLASSES.BODY_NO_SCROLL);
            logEvent('info', 'Modale de confirmation fermée via la touche Échap.');
        }
    }
}

/*================================================================================================================================================*/
/*===============================================================================================*/
/*                                 ======= Configuration des écouteurs =======                         */           
/*===============================================================================================*/
/* ============ Configuration des Écouteurs d'Événements ============ */
/**
 * Configure les écouteurs d'événements pour les éléments interactifs.
 * 
 * Étapes principales :
 * 1. Configure les interactions du menu responsive.
 * 2. Configure les placeholders dynamiques sur le champ de date.
 * 3. Ajoute les événements de clic pour la fermeture de la modale.
 * 4. Configure la validation des champs du formulaire.
 * 5. Ajoute un écouteur pour la soumission du formulaire.
 * 
 * @returns {void}
 */
function setupEventListeners() {
    logEvent('info', 'Configuration des écouteurs d\'événements.');

    // Menu responsive
    const menuToggleButton = DOM.navElement.querySelector('#menu-toggle');
    if (menuToggleButton) {
        menuToggleButton.addEventListener('click', editNav);
    } else {
        logEvent('warn', 'Bouton de menu toggle introuvable.');
    }

    // Placeholder dynamique pour le champ date de naissance
    if (DOM.birthdateInput) {
        DOM.birthdateInput.addEventListener('focus', handleBirthdateFocus);
        DOM.birthdateInput.addEventListener('blur', handleBirthdateBlur);
    } else {
        logEvent('warn', 'Champ de date de naissance introuvable.');
    }

    // Gestion des clics sur l'arrière-plan de la modale
    if (DOM.modalbg) {
        DOM.modalbg.addEventListener('click', handleModalBackgroundClick);
    } else {
        logEvent('warn', 'Élément modalbg introuvable.');
    }

    // Validation des champs
    setupFieldValidation();

    //validation des boutons radios
    setupRadioListeners();

    // Validation de la checkbox en temps réel
    setupCheckboxListener();

    // Gestion de la soumission du formulaire
    const formElement = document.querySelector('form');
    if (formElement) {
        formElement.addEventListener('submit', handleFormSubmit);
    } else {
        logEvent('warn', 'Formulaire principal introuvable.');
    }

    // Gestion des boutons de la modale
    setupModalButtons();

    // Gestion des interactions clavier
    document.addEventListener('keydown', handleKeyDown);
}

/* ============ Configuration des Boutons de la Modale ============ */
/**
 * Ajoute les événements nécessaires pour gérer les interactions avec les boutons liés à la modale.
 * 
 * Étapes principales :
 * 1. Ajoute un événement `click` pour chaque bouton permettant d'ouvrir la modale.
 * 2. Ajoute un événement `click` pour le bouton permettant de fermer la modale principale.
 * 3. Ajoute un événement `click` pour le bouton permettant de fermer la modale de confirmation.
 * 4. Logue les événements pour suivi en cas de succès ou de problème.
 * 
 * @returns {void}
 */
function setupModalButtons() {
    // Étape 1 : Configuration des boutons pour ouvrir la modale
    if (DOM.modalbtn) {
        DOM.modalbtn.forEach((btn) => btn.addEventListener('click', launchModal));
    } else {
        logEvent('warn', 'Boutons pour ouvrir la modale introuvables.');
    }

    // Étape 2 : Configuration du bouton pour fermer la modale principale
    if (DOM.closeBtn) {
        DOM.closeBtn.addEventListener('click', closeModal);
    } else {
        logEvent('warn', 'Bouton de fermeture de modale introuvable.');
    }

    // Étape 3 : Configuration du bouton pour fermer la modale de confirmation
    if (DOM.closeModalBtn) {
        DOM.closeModalBtn.addEventListener('click', closeConfirmationModal);
    } else {
        logEvent('warn', 'Bouton de fermeture de confirmation introuvable.');
    }
}

/* ============ Configuration des Écouteurs pour la Validation des Champs ============ */
/**
 * Ajoute des événements pour valider les champs du formulaire lors de la perte de focus ou de la modification d'état.
 * 
 * Étapes principales :
 * 1. Configure les validations pour chaque champ en ajoutant un événement `blur` pour vérifier les entrées.
 * 2. Ajoute un événement `change` pour valider la case à cocher des conditions générales.
 * 3. Logue un avertissement si un champ ou une case à cocher est introuvable.
 * 
 * @returns {void}
 */
function setupFieldValidation() {
    // Étape 1 : Configuration des validations pour les champs spécifiques
    const fields = {
        first: validateFirstName,
        last: validateLastName,
        email: validateEmail,
        birthdate: validateBirthdate,
        quantity: validateQuantity,
    };

    Object.keys(fields).forEach((fieldId) => {
        const fieldElement = document.getElementById(fieldId);
        if (fieldElement) {
            fieldElement.addEventListener('blur', fields[fieldId]);
        } else {
            logEvent('warn', `Champ "${fieldId}" introuvable.`);
        }
    });

    // Étape 2 : Configuration de la validation pour la case à cocher
    const checkboxElement = document.getElementById('checkbox1');
    if (checkboxElement) {
        checkboxElement.addEventListener('change', validateCheckbox);

    } else {
        logEvent('warn', 'Case à cocher "checkbox1" introuvable.');
    }

}

function setupCheckboxListener() {
    // Gérer la première checkbox
    const checkboxElement1 = document.getElementById('checkbox1');

    if (checkboxElement1) {

        // Ajouter un écouteur pour surveiller les changements d'état
        checkboxElement1.addEventListener('change', (event) => {
            if (event.target.checked) {
                // La checkbox est cochée
                logEvent('info', 'Première checkbox cochée.', { checkboxId: 'checkbox1', isChecked: true });
                removeError(checkboxElement1); // Supprimer les erreurs éventuelles
            } else {
                // La checkbox n'est pas cochée
                logEvent('warn', 'Première checkbox non cochée.', { checkboxId: 'checkbox1', isChecked: false });
                showError('Vous devez accepter les conditions d\'utilisation.', checkboxElement1); // Afficher une erreur
            }
        });
    } else {
        logEvent('error', 'Première checkbox introuvable dans le DOM.');
    }

    // Gérer la deuxième checkbox
    const checkboxElement2 = document.getElementById('checkbox2');

    if (checkboxElement2) {
        // Ajouter un écouteur pour surveiller les changements d'état
        checkboxElement2.addEventListener('change', (event) => {
            if (event.target.checked) {
                // La deuxième checkbox est cochée
                logEvent('check', 'Deuxième checkbox cochée.', { checkboxId: 'checkbox2', isChecked: true });
            } else {
                // La deuxième checkbox n'est pas cochée
                logEvent('check', 'Deuxième checkbox non cochée.', { checkboxId: 'checkbox2', isChecked: false });
            }
        });
    } else {
        logEvent('error', 'Deuxième checkbox introuvable dans le DOM.');
    }
}

/**
 * Configure les écouteurs d'événements pour les boutons radio du groupe "location".
 * 
 * Étapes principales :
 * 1. Récupère tous les boutons radio du groupe "location".
 * 2. Vérifie si des boutons radio sont trouvés. Si aucun n'est trouvé, logue un avertissement et arrête la fonction.
 * 3. Ajoute un écouteur d'événement "change" à chaque bouton radio pour capturer les sélections.
 * 4. Logue la valeur du bouton sélectionné avec des informations supplémentaires.
 * 5. Indique dans les logs que les écouteurs ont été ajoutés avec succès.
 * 
 * @returns {void}
 */
function setupRadioListeners() {
    // Étape 1 : Récupérer tous les boutons radio du groupe "location"
    const radioButtons = document.querySelectorAll('input[name="location"]');

    // Étape 2 : Vérifie si des boutons radio ont été trouvés
    if (radioButtons.length === 0) {
        // Aucun bouton radio trouvé, log un avertissement et arrête la fonction
        logEvent('warn', 'Aucun bouton radio trouvé pour le groupe "location".');
        return;
    }

    // Étape 3 : Ajouter un écouteur "change" à chaque bouton radio
    radioButtons.forEach((radio) => {
        radio.addEventListener('change', (event) => {
            // Étape 4 : Lorsqu'un bouton est sélectionné, capture sa valeur
            const selectedLocation = event.target.value; // Récupère la valeur du bouton sélectionné

            // Logue la sélection avec des informations supplémentaires
            logEvent('check', `Tournoi sélectionné : ${selectedLocation}`, {
                id: event.target.id, // ID du bouton radio
                value: selectedLocation, // Valeur sélectionnée
            });
        });
    });

    // Étape 5 : Logue le succès de l'ajout des écouteurs
    logEvent('success', 'Écouteurs ajoutés aux boutons radio du groupe "location".');
}



/*================================================================================================================================================*/
/*======================================================================================*/
/*                  ===========Point d'entrée du script =============                      */
/*======================================================================================*/
/**
 * Point d'entrée principal du script.
 * 
 * Étapes principales :
 * 1. Configure les gestionnaires d'événements pour les champs et les boutons.
 * 2. Log l'état initial pour suivi.
 * 
 * @returns {void}
 */
function main() {
    logEvent('info', 'Début de l\'initialisation principale.');

    // Étape 1 : Configure les gestionnaires d'événements
    setupEventListeners();

    // Étape 2 : Log l'état initial
    logEvent('info', 'Initialisation principale terminée.');
}


/*================================================================================================================================================*/
/*======================================================================================*/
/*                  ===========Déroulement du script =============                      */
/*======================================================================================*/

/**

 * 
 * - Attache un écouteur d'événement à l'événement `DOMContentLoaded` pour garantir que le DOM est entièrement chargé.
 * - Une fois le DOM prêt, exécute la fonction `main` pour initialiser le script principal.
 * - Journalise le début de l'exécution pour le suivi.
 * 
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
    logEvent('info', 'DOM entièrement chargé. Début de l\'exécution du script principal.'); // Log confirmant le chargement complet du DOM
    main(); // Appelle la fonction principale pour initialiser toutes les fonctionnalités
    
});