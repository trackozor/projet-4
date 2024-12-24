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
        isMobile: window.matchMedia("(max-width: 1024px)").matches, // Indique si l'utilisateur utilise un appareil avec un écran de taille inférieure ou égale à 1024px.
    },
};

let modalOpen = false; // Variable globale pour suivre l'état de la modale

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
 */
function validateFirstName(event) {
    const field = event.target; // Champ cible
    const value = field.value.trim(); // Supprime les espaces inutiles
    let errorMessage = '';

    // Validation des critères
    if (value === '') {
        errorMessage = 'Le prénom est requis.';
    } else if (value.length < 2) {
        errorMessage = 'Le prénom doit contenir au moins 2 caractères.';
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ]+(?:[-' ][a-zA-ZÀ-ÖØ-öø-ÿ]+)*$/.test(value)) {
        errorMessage = 'Le prénom contient des caractères invalides.';
    }

    // Gestion des erreurs
    if (errorMessage) {
        showError(errorMessage, field); // Affiche un message d'erreur
        logEvent('warn', 'Validation échouée pour le prénom', { errorMessage });
    } else {
        removeError(field); // Supprime tout message d'erreur existant
        logEvent('success', 'Validation réussie pour le prénom', { value });
    }
}

/* ============ Fonction de validation du champ nom ===================*/
/**
 * Valide le champ "Nom".
 * 
 * Critères de validation similaires à ceux du prénom :
 * - Non vide.
 * - Longueur minimale de 2 caractères.
 * - Ne contient que des caractères valides.
 * 
 * @param {Event} event - Événement déclenché lors de l'interaction avec le champ.
 */
function validateLastName(event) {
    const field = event.target;
    const value = field.value.trim();
    let errorMessage = '';

    // Validation des critères
    if (value === '') {
        errorMessage = 'Le nom est requis.';
    } else if (value.length < 2) {
        errorMessage = 'Le nom doit contenir au moins 2 caractères.';
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ]+(?:[-' ][a-zA-ZÀ-ÖØ-öø-ÿ]+)*$/.test(value)) {
        errorMessage = 'Le nom contient des caractères invalides.';
    }

    // Gestion des erreurs
    if (errorMessage) {
        showError(errorMessage, field);
        logEvent('warn', 'Validation échouée pour le nom', { errorMessage });
    } else {
        removeError(field);
        logEvent('success', 'Validation réussie pour le nom', { value });
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
 */
function validateEmail(event) {
    const field = event.target;
    const value = field.value.trim();
    let errorMessage = '';

    // Validation des critères
    if (value === '') {
        errorMessage = 'L\'e-mail est requis.';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        errorMessage = 'Veuillez entrer une adresse e-mail valide.';
    }

    // Gestion des erreurs
    if (errorMessage) {
        showError(errorMessage, field);
        logEvent('warn', 'Validation échouée pour l\'e-mail', { errorMessage });
    } else {
        removeError(field);
        logEvent('success', 'Validation réussie pour l\'e-mail', { value });
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
 * - Date inférieure à 18 ans
 * 
 * @param {Event} event - Événement déclenché lors de l'interaction avec le champ.
 */
function validateBirthdate(event) {
    const field = event.target;
    const value = field.value.trim();
    let errorMessage = '';

    // Validation des critères
    if (value === '') {
        errorMessage = 'La date de naissance est requise.';
    } else {
        const birthDate = new Date(value);
        const today = new Date();
        const maxBirthDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
        const majBirthdate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());


        if (birthDate >= today) {
            errorMessage = 'La date de naissance doit être dans le passé.';
        } else if (birthDate < maxBirthDate) {
            errorMessage = 'La date de naissance ne peut pas dépasser 100 ans.';
        } else if (birthDate > majBirthdate) {
            errorMessage = 'Vous devez avoir au moins 18 ans pour vous inscrire à un tournoi.';
        }
    }

    // Gestion des erreurs
    if (errorMessage) {
        showError(errorMessage, field);
        logEvent('warn', 'Validation échouée pour la date de naissance', { errorMessage });
    } else {
        removeError(field);
        logEvent('success', 'Validation réussie pour la date de naissance', { value });
    }
}

/*=====================Fonction validation de quantité du nombre de tournoi effectué ============*/
/**
 * Valide le champ "Quantité" (nombre de participations).
 * 
 * Critères de validation :
 * - Non vide.
 * - Valeur numérique entre 0 et 99.
 * 
 * @param {Event} event - Événement déclenché lors de l'interaction avec le champ.
 */
function validateQuantity(event) {
    const field = event.target;
    const value = field.value.trim();
    let errorMessage = '';

    // Validation des critères
    if (value === '') {
        errorMessage = 'Le nombre de participations est requis.';
    } else if (isNaN(value) || value < 0 || value > 99) {
        errorMessage = 'Le nombre de participations doit être entre 0 et 99.';
    }

    // Gestion des erreurs
    if (errorMessage) {
        showError(errorMessage, field);
        logEvent('warn', 'Validation échouée pour la quantité', { errorMessage });
    } else {
        removeError(field);
        logEvent('success', 'Validation réussie pour la quantité', { value });
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
 */
function validateCheckbox(event) {
    const field = event.target;
    let errorMessage = '';

    // Validation des critères
    if (!field.checked) {
        errorMessage = 'Vous devez accepter les conditions d\'utilisation.';
    }

    // Gestion des erreurs
    if (errorMessage) {
        showError(errorMessage, field);
        logEvent('warn', 'Validation échouée pour la checkbox', { errorMessage });
    } else {
        removeError(field);
        logEvent('success', 'Validation réussie pour la checkbox', {});
    }
}

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
        console.error('Erreur dans showError :', error);
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
        console.error('Erreur dans removeError :', error);
    }
}


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
        console.error('Erreur dans launchModal :', error);
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
        console.error('Erreur dans closeModal :', error);
    }
}

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

        // Étape 4 : Désactive le défilement de l'arrière-plan
        addClass(document.body, CONFIG.CSS_CLASSES.BODY_NO_SCROLL); // Empêche le défilement de la page principale
        logEvent(
            'info', 
            'Défilement de l\'arrière-plan désactivé.', 
            { scrollState: 'disabled' }
        );

        // Étape 5 : Place le focus sur un élément de la modale
        const firstFocusableElement = DOM.confirmationModal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusableElement) {
            firstFocusableElement.focus(); // Place le focus sur le premier élément interactif
            logEvent(
                'info', 
                'Focus placé sur le premier élément interactif de la modale.'
            );
        }

    } catch (error) {
        // Étape 6 : Gestion des erreurs
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

/* ============ Point d'entrée principal du script ============*/


/**
 * Point d'entrée principal du script.
 * 
 * Étapes principales :
 * 1. Configure les gestionnaires d'événements pour les éléments interactifs (navigation, modale, formulaire).
 * 2. Gère les placeholders dynamiques pour le champ de date.
 * 3. Initialise la validation des champs du formulaire.
 * 4. Log l'état initial pour un suivi précis.
 * 
 * @returns {void}
 */
function main() {
    logEvent('info', 'Début de l\'initialisation principale.');

    // === Étape 1 : Gestion du menu responsive ===
    const menuToggleButton = DOM.navElement.querySelector('#menu-toggle');
    if (menuToggleButton) {
        menuToggleButton.addEventListener('click', editNav);
    } else {
        logEvent('warn', 'Bouton de menu toggle introuvable.');
    }

    // === Étape 2 : Configuration des placeholders pour le champ de date ===
    if (DOM.birthdateInput) {
        DOM.birthdateInput.addEventListener('focus', () => {
            logEvent('info', 'Focus sur le champ de date : affichage du placeholder.');
            DOM.birthdateInput.placeholder = 'jj/mm/aaaa'; // Ajoute un placeholder lors du focus
        });

        DOM.birthdateInput.addEventListener('blur', () => {
            if (!DOM.birthdateInput.value) {
                logEvent('info', 'Champ de date vide après perte du focus : suppression du placeholder.');
                DOM.birthdateInput.placeholder = ''; // Supprime le placeholder si le champ est vide
            }
        });
    } else {
        logEvent('warn', 'Champ de date de naissance introuvable.');
    }

    // === Étape 3 : Gestion des clics sur l'arrière-plan de la modale ===
    if (DOM.modalbg) {
        DOM.modalbg.addEventListener('click', (event) => {
            if (event.target === DOM.modalbg) {
                logEvent('info', 'Clic détecté sur l\'arrière-plan : fermeture de la modale.');
                closeModal();
            }
        });
    } else {
        logEvent('warn', 'Élément modalbg introuvable.');
    }

    // === Étape 4 : Initialisation de la validation des champs ===
    const fields = {
        first: validateFirstName,
        last: validateLastName,
        email: validateEmail,
        birthdate: validateBirthdate,
        quantity: validateQuantity,
    };

    // Ajout des écouteurs pour les champs
    Object.keys(fields).forEach((fieldId) => {
        const fieldElement = document.getElementById(fieldId);
        if (fieldElement) {
            const eventType = 'blur';
            fieldElement.addEventListener(eventType, fields[fieldId]);
        } else {
            logEvent('warn', `Champ "${fieldId}" introuvable.`);
        }
    });

    // Ajout d'un écouteur spécifique pour la case à cocher
    const checkboxElement = document.getElementById('checkbox1');
    if (checkboxElement) {
        checkboxElement.addEventListener('change', validateCheckbox);
    } else {
        logEvent('warn', 'Case à cocher "checkbox1" introuvable.');
    }

    // === Étape 5 : Gestion de la soumission du formulaire ===
    const formElement = document.querySelector('form');
    if (formElement) {
        formElement.addEventListener('submit', (event) => {
            logEvent('info', 'Tentative de soumission du formulaire.');

            let isValid = true;

            // Valide chaque champ
            Object.keys(fields).forEach((fieldId) => {
                const fieldElement = document.getElementById(fieldId);
                if (fieldElement) {
                    const fieldIsValid = fields[fieldId]({ target: fieldElement });
                    if (!fieldIsValid) {
                        isValid = false;
                    }
                }
            });

            // Valide la case à cocher
            if (checkboxElement) {
                const checkboxIsValid = validateCheckbox({ target: checkboxElement });
                if (!checkboxIsValid) {
                    isValid = false;
                }
            }

            // Vérifie si des erreurs persistent dans le DOM
            const errorInputs = formElement.querySelectorAll(`.${CONFIG.CSS_CLASSES.ERROR_INPUT}`);
            if (errorInputs.length > 0) {
                isValid = false;
            
            } else {
                event.preventDefault();
                logEvent('info', 'Formulaire valide : ouverture de la modale de confirmation.');
                openConfirmationModal(); // Ouvre la modale de confirmation
            }
        });
    } else {
        logEvent('warn', 'Formulaire principal introuvable.');
    }

    // === Étape 6 : Gestion des boutons de la modale ===
    if (DOM.modalbtn) {
        DOM.modalbtn.forEach((btn) => btn.addEventListener('click', () => {
            logEvent('info', 'Clic sur un bouton d\'ouverture de modale.');
            launchModal();
        }));
    } else {
        logEvent('warn', 'Boutons pour ouvrir la modale introuvables.');
    }

    if (DOM.closeBtn) {
        DOM.closeBtn.addEventListener('click', () => {
            logEvent('info', 'Clic sur le bouton de fermeture de modale.');
            closeModal();
        });
    } else {
        logEvent('warn', 'Bouton de fermeture de modale introuvable.');
    }

    // === Étape 7 : Gestion des interactions clavier (touche Esc) ===
    if (DOM.closeModalBtn) {
        DOM.closeModalBtn.addEventListener('click', closeConfirmationModal);
    } else {
        logEvent('warn', 'Bouton de fermeture de confirmation introuvable.');
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOpen) {
            closeModal();
        }
    });

    logEvent('info', 'Initialisation principale terminée.');
}

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