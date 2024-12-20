
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
    success: rootStyles.getPropertyValue('--log-success').trim() || "color: green; font-weight: bold;",
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

/*===============================================================================================*/
/*                                 ======= Affichage responsive toggle =======                   */           
/*===============================================================================================*/
/** 
 * ============ Fonction pour activer/désactiver le menu responsive. ============
 * 
 * - Ajoute ou retire la classe "responsive" de l'élément de navigation.
 * - Ajuste la position de la section hero et de la modale en fonction de l'état responsive.
 * - Log les actions effectuées pour un suivi précis dans la console.
 * 
 * @returns {void}
 */
function editNav() {
    try {
        // Toggle de la classe responsive
        const isResponsive = navElement.classList.toggle(CSS_CLASSES.NAV_RESPONSIVE);

        // Modifier les classes Hero et Modal en fonction de l'état responsive
        if (isResponsive) {
            // Activation du mode responsive
            heroSection.classList.replace(CSS_CLASSES.HERO_DEFAULT, CSS_CLASSES.HERO_RESPONSIVE);
            modalbg.classList.replace(CSS_CLASSES.MODAL_DEFAULT, CSS_CLASSES.MODAL_RESPONSIVE);
        } else {
            // Désactivation du mode responsive
            heroSection.classList.replace(CSS_CLASSES.HERO_RESPONSIVE, CSS_CLASSES.HERO_DEFAULT);
            modalbg.classList.replace(CSS_CLASSES.MODAL_RESPONSIVE, CSS_CLASSES.MODAL_DEFAULT);
        }

        // Log unique pour indiquer le changement
        logEvent('info', `Menu responsive ${isResponsive ? 'activé' : 'désactivé'}.`, {
            responsiveState: isResponsive ? 'opened' : 'closed',
        });
    } catch (error) {
        // Log en cas d'erreur
        logEvent('error', 'Erreur lors de la gestion du menu responsive.', { error: error.message });
        console.error('Erreur dans editNav :', error);
    }
}

/*===============================================================================================*/
/*                                 ======= Formulaire =======                                    */           
/*===============================================================================================*/

/* ============ Fonction pour réinitialiser le formulaire de la modale. ============*/
function resetForm() {
    try {
        // Étape 1 : Sélectionne le formulaire dans la modale
        const form = document.querySelector('form');

        if (form) {
            // Réinitialise tous les champs du formulaire
            form.reset();
            logEvent('success', 'Formulaire réinitialisé avec succès.');

            // Étape 2 : Supprime tous les messages d'erreur affichés
            const errorMessages = form.querySelectorAll(`.${CSS_CLASSES.ERROR_MODAL}`);
            errorMessages.forEach((error) => {
                error.remove();
                logEvent('success', 'Message d\'erreur supprimé.', { errorContent: error.textContent });
            });

            // Étape 3 : Retire la classe d'erreur des champs concernés
            const errorInputs = form.querySelectorAll(`.${CSS_CLASSES.ERROR_INPUT}`);
            errorInputs.forEach((input) => {
                input.classList.remove(CSS_CLASSES.ERROR_INPUT);
                logEvent('success', `Classe d'erreur retirée du champ : ${input.id || input.name}`);
            });

        } else {
            // Si aucun formulaire n'est trouvé
            logEvent('warn', 'Aucun formulaire trouvé à réinitialiser.');
        }
    } catch (error) {
        // Gestion des erreurs imprévues
        logEvent('error', 'Erreur lors de la réinitialisation du formulaire.', { error: error.message });
        console.error('Erreur dans resetForm :', error);
    }
}

/*===============================================================================================*/
/*                                 ======= Modale inscription =======                            */           
/*===============================================================================================*/

/* ============ Fonction pour afficher la modale et empêcher le défilement en arrière-plan. ============*/
function launchModal() {

    if (!modalbg) {
        logEvent('error', 'Élément modalbg introuvable.');
        return;
    }

    if (modalbg.classList.contains(CSS_CLASSES.MODAL_ACTIVE)) {
        logEvent('warn', 'La modale est déjà active.');
        return;
    }

    try {
        resetForm();
        logEvent('success', 'Formulaire réinitialisé avec succès.');
        modalbg.classList.add(CSS_CLASSES.MODAL_ACTIVE);
        document.body.classList.add(CSS_CLASSES.BODY_NO_SCROLL);
        modalOpen = true;
        logEvent('success', 'Modale affichée avec succès.');
    } catch (error) {
        logEvent('error', 'Erreur lors de l\'affichage de la modale.', { error });
        console.error('Erreur dans launchModal:', error);
    }
}

/* ============ Fonction pour fermer la modale ============*/
function closeModal() {
    try {
        // Vérification initiale de l'état de la modale
        if (!modalbg.classList.contains(CSS_CLASSES.MODAL_ACTIVE)) {
            logEvent('warn', 'Tentative de fermeture d\'une modale déjà fermée.');
            return;
        }

        // Étape 1 : Suppression de la classe active
        modalbg.classList.remove(CSS_CLASSES.MODAL_ACTIVE);
        logEvent('success', 'Classe CSS active supprimée : Modale masquée.', { modalState: modalbg.classList.value });

        // Étape 2 : Réactivation du défilement
        document.body.classList.remove(CSS_CLASSES.BODY_NO_SCROLL);
        logEvent('success', 'Défilement de l\'arrière-plan réactivé.', { bodyClasses: document.body.classList.value });

        // Étape 3 : Mise à jour de l'état global
        modalOpen = false;
        logEvent('info', 'État global mis à jour.', { modalOpen });

    } catch (error) {
        // Gestion des erreurs
        logEvent('error', 'Erreur lors de la fermeture de la modale.', { error: error.message });
        console.error('Erreur dans closeModal :', error);
    }
}



/*===============================================================================================*/
/*                                 ======= Validation des champs =======                         */           
/*===============================================================================================*/

/* ============ Fonction de validation des champs ============*/
function validateField(event) {
    const field = event.target; // Champ ciblé par l'événement
    let errorMessage = ''; // Initialisation du message d'erreur


    try {
        // Étape 1 : Vérification des champs vides
        if (field.type === 'checkbox') {
            // Vérifie si la checkbox n'est pas cochée
            if (!field.checked && field.id === 'checkbox1') {
                errorMessage = 'Vous devez accepter les conditions d\'utilisation.';
                logEvent('warn', `Validation échouée pour la checkbox : ${field.id}`, { errorMessage });
            }
        } else if (field.value.trim() === '') {
            switch (field.id) {
                case 'first':
                    errorMessage = 'Le prénom est requis.';
                    break;
                case 'last':
                    errorMessage = 'Le nom est requis.';
                    break;
                case 'email':
                    errorMessage = 'L\'e-mail est requis.';
                    break;
                case 'birthdate':
                    errorMessage = 'La date de naissance est requise.';
                    break;
                case 'quantity':
                    errorMessage = 'Le nombre de participations est requis.';
                    break;
                case 'checkbox1':
                    errorMessage = 'Vous devez accepter les conditions d\'utilisation.';
                    break;
            }
            logEvent('warn', `Champ vide détecté : ${field.id}`, { errorMessage });
        } else {
            // Étape 2 : Validation spécifique
            switch (field.id) {
                case 'first':// Validation pour le champ "first" (prénom) 
                case 'last': // Validation pour le champ "last" (nom)
                    
                    // Vérifie si la valeur contient moins de 2 caractères
                    if (field.value.trim().length < 2) {
                        errorMessage = `${field.id === 'first' ? 'Le prénom' : 'Le nom'} doit contenir au moins 2 caractères.`;
                        // Génère un message d'erreur spécifique pour le prénom ou le nom
                    
                     // Vérifie si la valeur contient des caractères invalides à l'aide d'une regex
                    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ]+(?:[-' ][a-zA-ZÀ-ÖØ-öø-ÿ]+)*$/.test(field.value.trim())) {
                        errorMessage = `${field.id === 'first' ? 'Le prénom' : 'Le nom'} contient des caractères invalides.`;
                        // Génère un message d'erreur si des caractères non autorisés sont présents
                    }
                    break;

                case 'email':
                    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(field.value.trim())) {
                        errorMessage = 'Veuillez entrer une adresse e-mail valide.';
                    }
                    break;

                case 'birthdate':
                    const birthDate = new Date(field.value);
                    const today = new Date();
                    const maxBirthDate = new Date(today.getFullYear() - 150, today.getMonth(), today.getDate()); // Date limite : 150 ans avant aujourd'hui

                    if (birthDate >= today) {
                        errorMessage = 'La date de naissance doit être dans le passé.';
                    } else if (birthDate < maxBirthDate) {
                        errorMessage = 'La date de naissance ne peut pas dépasser 150 ans.';

                    }
                    break;

                case 'quantity':
                    if (isNaN(field.value) || field.value < 0 || field.value > 99) {
                        errorMessage = 'Le nombre de participations doit être entre 0 et 99.';
                    }
                    break;
            }

            if (errorMessage) {
                logEvent('warn', `Erreur de validation dans le champ : ${field.id}`, { errorMessage });
            } else {
                logEvent('success', `Validation réussie pour le champ : ${field.id}`, { value: field.value.trim() });
            }
        }

        // Étape 3 : Affichage ou suppression des erreurs
        if (errorMessage) {
            showError(errorMessage, field);
            field.classList.add('error');
        } else {
            removeError(field);
            field.classList.remove('error');
        }
    } catch (error) {
        logEvent('error', `Erreur inattendue dans la validation : ${field.id}`, { error });
    }

}


/*===============================================================================================*/
/*                                 ======= Modal de confirmation =======                         */           
/*===============================================================================================*/

/* ============ Fonction pour ouvrir la modale de confirmation ============*/
function openConfirmationModal() {
    try {
        // Vérifie si la modale est déjà active
        if (confirmationModal.classList.contains(CSS_CLASSES.MODAL_ACTIVE)) {
            logEvent('warn', 'La modale de confirmation est déjà ouverte.'); // Avertissement si déjà active
            return;
        }

        // Étape 1 : Affiche la modale de confirmation
        confirmationModal.classList.add(CSS_CLASSES.MODAL_ACTIVE);
        logEvent('success', 'Modale de confirmation affichée avec succès.', { modalState: 'active' });

        // Étape 2 : Désactive le défilement de l'arrière-plan
        document.body.classList.add(CSS_CLASSES.BODY_NO_SCROLL);
        logEvent('info', 'Défilement de l\'arrière-plan désactivé.', { scrollState: 'disabled' });

    } catch (error) {
        // Gestion des erreurs avec des logs colorisés
        logEvent('error', 'Erreur lors de l\'ouverture de la modale de confirmation.', { error: error.message });
        console.error('Erreur lors de l\'ouverture de la modale de confirmation :', error);
    }
}


/**
 * ============ Fonction pour fermer la modale de confirmation ============ 
 * 
 * - Supprime la classe CSS utilisée pour afficher la modale de confirmation.
 * - Réactive le défilement de la page principale en supprimant une classe dédiée.
 * - Ajoute un défilement fluide vers le haut en mode paysage, si applicable.
 * - Journalise chaque étape importante et gère les éventuelles erreurs.
 * 
 * @returns {void}
 */
function closeConfirmationModal() {
    try {

        // Vérifie si la modale est active avant de la fermer
        if (!confirmationModal.classList.contains(CSS_CLASSES.MODAL_ACTIVE)) {
            logEvent('warn', 'Tentative de fermeture échouée : la modale est déjà fermée.');
            return; // Sort de la fonction si la modale est inactive
        }

        // Étape 1 : Masquer la modale
        confirmationModal.classList.remove(CSS_CLASSES.MODAL_ACTIVE);
        confirmationModal.setAttribute('aria-hidden', 'true'); // Mise à jour pour l'accessibilité
        logEvent('success', 'Modale de confirmation masquée.');

        // Étape 2 : Réactiver le défilement de l'arrière-plan
        document.body.classList.remove(CSS_CLASSES.BODY_NO_SCROLL);
        logEvent('success', 'Défilement de l\'arrière-plan réactivé.');
        resetForm();

    } catch (error) {
        // Gestion des erreurs
        logEvent('error', 'Erreur lors de la fermeture de la modale de confirmation.', { error: error.message });
        console.error('Erreur lors de la fermeture de la modale de confirmation :', error);
    }
};



/**
/**
/**
 * ============ Fonction pour afficher un message d'erreur et ajouter une bordure rouge ============ 
 * 
 * - Supprime les erreurs précédentes avant d'afficher un nouveau message d'erreur.
 * - Ajoute une bordure rouge autour du champ cible pour indiquer l'erreur.
 * - Crée et affiche un message d'erreur sous le champ concerné.
 * - Utilise uniquement les classes CSS définies pour le style.
 * - Journalise chaque étape et gère les erreurs éventuelles.
 * 
 * @param {string} message - Message d'erreur à afficher.
 * @param {HTMLElement} inputElement - Champ d'entrée cible.
 * @returns {void}
 */
function showError(message, inputElement) {
    try {
        // === Validation des paramètres ===
        if (!message || !inputElement) {
            logEvent('error', 'Paramètres invalides dans showError.', { message, inputElement });
            return;
        }

        // === Log : Début de l'affichage de l'erreur ===
        logEvent('info', `Tentative d'affichage d'une erreur pour le champ : ${inputElement.id || 'non défini'}`, {
            value: inputElement.value,
            message
        });

        // === Vérifie et supprime les erreurs précédentes ===
        if (inputElement.parentElement.querySelector(`.${CSS_CLASSES.ERROR_MODAL}`)) {
            logEvent('warn', `Un tooltip d'erreur existe déjà pour le champ : ${inputElement.id}`);
            return; // Évite d'ajouter un doublon
        }
        removeError(inputElement);
        logEvent('success', `Suppression des erreurs existantes réussie pour le champ : ${inputElement.id}`);

        // === Création et ajout du message d'erreur ===
        const errorTooltip = document.createElement('div');
        errorTooltip.classList.add(CSS_CLASSES.ERROR_MODAL); // Applique le style CSS défini
        errorTooltip.textContent = message;

        inputElement.classList.add(CSS_CLASSES.ERROR_INPUT); // Ajoute une bordure rouge
        inputElement.parentElement.appendChild(errorTooltip); // Ajoute le message dans le DOM

        // === Log : Succès de l'ajout ===
        logEvent('success', `Tooltip d'erreur ajouté pour le champ : ${inputElement.id}`, { message });
    } catch (error) {
        // === Gestion des erreurs ===
        logEvent('error', 'Erreur dans showError.', { error: error.message });
        console.error('Erreur dans showError :', error);
    }
}

/**
 * ============ Fonction pour supprimer un message d'erreur et retirer la bordure rouge ============ 
 * 
 * - Retire la classe CSS d'erreur (`error-input`) appliquée au champ d'entrée ciblé.
 * - Supprime le message d'erreur (tooltip) affiché sous le champ, si présent.
 * - Log chaque étape importante et gère les éventuelles erreurs.
 * 
 * @param {HTMLElement} inputElement - Champ d'entrée cible.
 * @returns {void}
 */
function removeError(inputElement) {
    try {
        // === Validation des paramètres ===
        if (!inputElement || !(inputElement instanceof HTMLElement)) {
            logEvent('error', 'Paramètre invalide dans removeError.', { inputElement });
            return;
        }

        logEvent('info', `Tentative de suppression des erreurs pour le champ : ${inputElement.id || 'non défini'}`);

        // === Retirer la classe d'erreur ===
        if (inputElement.classList.contains(CSS_CLASSES.ERROR_INPUT)) {
            inputElement.classList.remove(CSS_CLASSES.ERROR_INPUT);
            logEvent('success', `Bordure rouge supprimée pour le champ : ${inputElement.id}`);
        } else {
            logEvent('warn', `Aucune bordure d'erreur détectée pour le champ : ${inputElement.id}`);
        }

        // === Supprimer le tooltip d'erreur ===
        const {parentElement} = inputElement;
        if (parentElement) {
            const existingError = parentElement.querySelector(`.${CSS_CLASSES.ERROR_MODAL}`);
            if (existingError) {
                existingError.remove();
                logEvent('success', `Tooltip d'erreur supprimé pour le champ : ${inputElement.id}`);
            } else {
                logEvent('warn', `Aucun tooltip d'erreur trouvé pour le champ : ${inputElement.id}`);
            }
        } else {
            logEvent('warn', `Le parentElement est introuvable pour le champ : ${inputElement.id}`);
        }
    } catch (error) {
        // === Gestion des erreurs ===
        logEvent('error', 'Erreur dans removeError.', { error: error.message, element: inputElement });
        console.error('Erreur dans removeError :', error);
    }
}




/**
/**
 * ============ Point d'entrée principal du script ============
 * 
 * - Configure les éléments interactifs de la page (placeholders, écouteurs d'événements, etc.).
 * - Initialise les modales et gère leurs interactions.
 * - Valide le formulaire en temps réel et lors de sa soumission.
 * - Journalise chaque étape importante pour un suivi précis.
 * 
 * @returns {void}
 */
function main() {
    logEvent('info', 'Début de l\'initialisation principale.'); // Log initial signalant le début du script
    // === Gestion du clic sur le bouton de menu pour le responsive ===
    document.getElementById('menu-toggle').addEventListener('click', editNav);
    // === Configuration des placeholders pour le champ de date ===
    birthdateInput.addEventListener('focus', () => {
        logEvent('info', 'Focus sur le champ de date : affichage du placeholder.'); // Log lors du focus sur le champ
        birthdateInput.placeholder = 'jj/mm/aaaa'; // Ajoute un placeholder lors du focus
    });
    birthdateInput.addEventListener('blur', () => {
        if (!birthdateInput.value) {
            logEvent('info', 'Champ de date vide après perte du focus : suppression du placeholder.'); // Log après perte de focus
            birthdateInput.placeholder = ''; // Supprime le placeholder si le champ est vide
        }
    });

    // === Gestion des clics sur l'arrière-plan de la modale pour la fermer ===
    modalbg.addEventListener('click', (event) => {
        if (event.target === modalbg) { // Vérifie que l'utilisateur a cliqué sur l'arrière-plan et non sur le contenu
            logEvent('info', 'Clic détecté sur l\'arrière-plan : fermeture de la modale.'); // Log du clic sur l'arrière-plan
            closeModal(); // Ferme la modale
        }
    });

    // === Validation en temps réel des champs du formulaire ===
    inputs.forEach((input) => {
        input.addEventListener('input', (event) => {
            logEvent('info', `Modification détectée sur le champ : ${event.target.id}`); // Log des modifications
            validateField(event); // Valide le champ en temps réel
        });
        input.addEventListener('blur', (event) => {
            logEvent('info', `Perte de focus sur le champ : ${event.target.id}`); // Log de la perte de focus
            validateField(event); // Valide le champ lors de la perte de focus
        });
    });

    // === Gestion de la soumission du formulaire ===
    document.querySelector('form').addEventListener('submit', function (event) {
        let isValid = true; // Initialise la validité globale du formulaire
        logEvent('info', 'Tentative de soumission du formulaire.'); // Log du début de la soumission

        // Valide tous les champs obligatoires
        inputs.forEach((input) => {
            validateField({ target: input }); // Valide chaque champ
            if (input.classList.contains('error')) {
                isValid = false; // Si un champ a une erreur, le formulaire est invalide
            }
        });

        // Empêche la soumission si des erreurs sont présentes
        if (!isValid) {
            event.preventDefault(); // Annule l'action par défaut (soumission)
            logEvent('warn', 'Échec de la soumission : des erreurs sont présentes dans le formulaire.'); // Log d'avertissement
            alert('Veuillez corriger les erreurs avant de soumettre le formulaire.'); // Alerte pour l'utilisateur
        } else {
            event.preventDefault(); // Empêche la redirection pour gérer la soumission autrement
            logEvent('info', 'Formulaire valide : ouverture de la modale de confirmation.'); // Log de succès
            openConfirmationModal(); // Ouvre la modale de confirmation
        }
    });

    // === Gestion des clics sur les boutons pour ouvrir la modale ===
    modalbtn.forEach(btn => btn.addEventListener('click', () => {
        logEvent('info', 'Clic sur un bouton d\'ouverture de modale.'); // Log du clic sur le bouton
        launchModal(); // Ouvre la modale
    }));

    // === Gestion des clics sur le bouton pour fermer la modale ===
    closeBtn.addEventListener('click', () => {
        logEvent('info', 'Clic sur le bouton de fermeture de modale.'); // Log du clic sur le bouton de fermeture
        closeModal(); // Ferme la modale
        
    });

    // === Gestion des touches pour fermer la modale avec la touche Esc ===

    closeModalBtn.addEventListener('click', function (){
        closeConfirmationModal()
    });

    document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalOpen) {
        closeModal();
    }
});
    logEvent('info', 'Initialisation principale terminée.'); // Log final confirmant la fin de l'initialisation

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