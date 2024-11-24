
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
const navElement = document.getElementById("Topnav"); // Élément principal de la navigation (utilisé pour le menu responsive)
const modalbg = document.querySelector(".bground"); // Conteneur de la modale, incluant l'arrière-plan et le contenu
const heroSection = document.querySelector(".hero-section"); // Section principale "hero", souvent utilisée pour des ajustements de style
const modalbtn = document.querySelectorAll(".modal-btn"); // Boutons permettant d'ouvrir la modale
const formData = document.querySelectorAll(".formData"); // Conteneurs individuels des champs du formulaire
const closeBtn = document.querySelector(".close"); // Bouton pour fermer la modale
const inputs = document.querySelectorAll('input'); // Tous les champs de saisie du formulaire (prénom, e-mail, etc.)
const birthdateInput = document.getElementById('birthdate'); // Champ spécifique pour saisir la date de naissance
const confirmationModal = document.getElementById('confirmation-modal'); // Élément de la modale de confirmation (affiché après soumission)
const closeModalBtn = document.getElementById('close-modal-btn'); // Bouton permettant de fermer la modale de confirmation


// ======= Styles pour les logs =======
const logStyles = {
    info: getComputedStyle(document.documentElement).getPropertyValue('--log-info').trim(), // Style pour les logs d'information
    warn: getComputedStyle(document.documentElement).getPropertyValue('--log-warn').trim(), // Style pour les avertissements
    error: getComputedStyle(document.documentElement).getPropertyValue('--log-error').trim(), // Style pour les erreurs critiques
    default: getComputedStyle(document.documentElement).getPropertyValue('--log-default').trim(), // Style par défaut pour les logs
};



// ======= Noms des classes CSS =======
const CSS_CLASSES = {
    ERROR_INPUT: 'error-input',
    ERROR_MODAL: 'error-modal',
    MODAL_ACTIVE: 'active',
    BODY_NO_SCROLL: 'no-scroll',
};

// ======= Variables pour les médias =======
const isMobile = window.matchMedia("(max-width: 1024px)").matches; // Indique si l'utilisateur utilise un appareil avec un petit écran (mobile)


// ======= État global =======
let modalOpen = false; // Variable pour suivre l'état d'ouverture de la modale. "true" signifie que la modale est ouverte


/*========================================================================================*/
/*                       =========== Fonctions ===================                        */
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
    // Horodatage dynamique
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[GameOn][${timestamp}]`; // Préfixe commun pour tous les logs

    // Détermine le style en fonction du type de log
    const style = logStyles[type] || logStyles.default || 'color: black;';
    
    // Vérifie si le message est fourni
    if (!message) {
        console.warn('%c[AVERTISSEMENT] Message manquant dans logEvent', style);
        return;
    }

    // Génère le message complet
    const fullMessage = `${prefix} ${type.toUpperCase()}: ${message}`;

    // Affiche les logs en fonction du type
    switch (type.toLowerCase()) {
        case 'info':
            console.log(`%c${fullMessage}`, style, data);
            break;
        case 'warn':
            console.warn(`%c${fullMessage}`, style, data);
            break;
        case 'error':
            console.error(`%c${fullMessage}`, style, data);
            break;
        default:
            console.log(`%c${prefix} [INCONNU]: ${message}`, style, data);
    }
}



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
    // Bascule la classe "responsive" sur l'élément de navigation
    navElement.classList.toggle("responsive");
    logEvent(
        'info', 
        `Menu responsive ${navElement.classList.contains("responsive") ? "activé" : "désactivé"}`
    );

    // Gère la position de la section hero et de la modale pour le mode responsive
    if (navElement.classList.contains("responsive") && isMobile) {
        // Si le mode responsive est activé sur un appareil mobile
        heroSection.style.top = "10%"; // Positionne la section hero plus bas
        modalbg.style.top = "25%"; // Décale la modale vers le bas
        logEvent('info', 'Mode responsive détecté sur un appareil mobile. Hero et modale repositionnés.', {
            heroTop: "12%",
            modalbg: "25%",
        });
    } else {
        // Si le menu n'est pas en mode responsive ou sur un écran non mobile
        heroSection.style.top = "6.5vh"; // Réinitialise la position de la section hero
        modalbg.style.top = "6.5vh"; // Réinitialise la position de la modale
        logEvent('info', 'Menu responsive désactivé. Hero et modale remis à leur position initiale.', {
            heroTop: "6.5vh",
            modalbg: "6.5vh",
        });
    }
}




/**
 * ============ Fonction pour réinitialiser le formulaire de la modale. ============
 * 
 * - Efface tous les champs du formulaire en les réinitialisant à leurs valeurs par défaut.
 * - Supprime les messages d'erreur affichés sous les champs.
 * - Retire les classes d'erreur (bordures rouges) des champs invalides.
 * - Gère les exceptions si le formulaire n'est pas trouvé ou si une erreur survient.
 * 
 * @returns {void}
 */
function resetForm() {
    try {
        // Sélectionne le formulaire dans la modale
        const form = document.querySelector('form');
        if (form) {
            form.reset(); // Réinitialise tous les champs du formulaire
            console.log('Formulaire réinitialisé.'); // Log : confirmation que le formulaire a été réinitialisé

            // Supprime tous les messages d'erreur affichés
            const errorMessages = form.querySelectorAll(`.${CSS_CLASSES.ERROR_MODAL}`);
            errorMessages.forEach((error) => error.remove());

            // Retire la classe d'erreur des champs concernés (bordure rouge)
            const errorInputs = form.querySelectorAll(`.${CSS_CLASSES.ERROR_INPUT}`);
            errorInputs.forEach((input) => input.classList.remove(CSS_CLASSES.ERROR_INPUT));
        } else {
            // Si aucun formulaire n'est trouvé
            console.warn('Aucun formulaire trouvé à réinitialiser.');
        }
    } catch (error) {
        // Gestion des erreurs imprévues
        console.error('Erreur lors de la réinitialisation du formulaire :', error);
    }
}


/**
 * ============ Fonction pour afficher la modale et empêcher le défilement en arrière-plan. ============
 * 
 * - Vérifie si la modale est déjà affichée pour éviter les duplications.
 * - Réinitialise le formulaire avant d'afficher la modale.
 * - Affiche la modale et désactive le défilement de la page principale.
 * - Journalise chaque étape pour faciliter le suivi.
 * 
 * @returns {void}
 */
function launchModal() {
    logEvent('info', 'Début de la fonction launchModal.'); // Log initial pour indiquer le début de la fonction

    // Vérifie que modalbg est bien défini
    if (!modalbg) {
        logEvent('error', 'modalbg est introuvable.'); // Log d'erreur si l'élément de la modale n'existe pas
        return; // Interrompt l'exécution si modalbg est introuvable
    }

    // Empêche d’afficher plusieurs fois la modale si elle est déjà active
    if (modalbg.classList.contains(CSS_CLASSES.MODAL_ACTIVE)) {
        logEvent('warn', 'La modale est déjà affichée.'); // Log d'avertissement si la modale est déjà active
        return; // Interrompt l'exécution si la modale est déjà affichée
    }

    // Réinitialise le formulaire avant d'afficher la modale
    try {
        resetForm(); // Appelle la fonction pour réinitialiser les champs du formulaire
        logEvent('info', 'Formulaire réinitialisé.'); // Log confirmant que le formulaire a été réinitialisé
    } catch (error) {
        logEvent('error', 'Erreur lors de la réinitialisation du formulaire.', error); // Log d'erreur en cas de problème avec la réinitialisation
    }

    // Affiche la modale et désactive le défilement de la page principale
    try {
        modalbg.classList.add(CSS_CLASSES.MODAL_ACTIVE); // Ajoute la classe CSS pour activer la modale
        document.body.classList.add(CSS_CLASSES.BODY_NO_SCROLL); // Ajoute une classe CSS pour désactiver le défilement de l'arrière-plan
        modalOpen = true; // Met à jour l'état global indiquant que la modale est ouverte
        logEvent('info', 'Modale affichée.'); // Log confirmant que la modale est affichée
    } catch (error) {
        logEvent('error', 'Erreur lors de l\'affichage de la modale.', error); // Log d'erreur en cas de problème d'affichage
    }
}



/**
 * ============ Fonction pour fermer la modale ============ 
 * 
 * - Supprime la classe CSS utilisée pour afficher la modale.
 * - Réactive le défilement de la page principale en supprimant la classe dédiée.
 * - Met à jour l'état global `modalOpen` pour refléter la fermeture de la modale.
 * - Journalise chaque étape importante et gère les erreurs éventuelles.
 * 
 * @returns {void}
 */
function closeModal() {
    try {
        logEvent('info', 'Tentative de fermeture de la modale.'); // Log initial pour signaler l'opération

        // Supprime la classe CSS active pour masquer la modale
        modalbg.classList.remove(CSS_CLASSES.MODAL_ACTIVE);
        logEvent('info', 'Modale masquée.'); // Log confirmant la fermeture visuelle

        // Supprime la classe CSS qui désactive le défilement de la page
        document.body.classList.remove(CSS_CLASSES.BODY_NO_SCROLL);
        logEvent('info', 'Défilement de l\'arrière-plan réactivé.'); // Log confirmant la réactivation du défilement

        // Mettre à jour l'état global indiquant que la modale est fermée
        modalOpen = false;
        logEvent('info', 'État de la modale mis à jour : Fermée.', { modalOpen }); // Log confirmant la mise à jour de l'état
    } catch (error) {
        // Gestion des erreurs potentielles
        logEvent('error', 'Erreur lors de la fermeture de la modale.', { error }); // Log en cas d'erreur
        console.error('Erreur lors de la fermeture de la modale :', error); // Affiche l'erreur dans la console pour débogage
    }
}




/**
 * ============ Fonction de validation des champs ============
 * 
 * - Vérifie si un champ de formulaire contient des erreurs.
 * - Affiche un message d'erreur spécifique si la validation échoue.
 * - Retire les erreurs et les styles d'erreur si la validation est réussie.
 * - Log les étapes pour un suivi détaillé des actions.
 * 
 * @param {Event} event - L'événement déclenché lors de la validation.
 * @returns {void}
 */
function validateField(event) {
    const field = event.target; // Champ ciblé par l'événement
    let errorMessage = ''; // Initialisation du message d'erreur

    logEvent('info', `Début de validation du champ : ${field.id}`, { value: field.value.trim() }); // Log initial

    // Vérifie si le champ est vide
    if (field.value.trim() === '') {
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
                if (!field.checked) {
                    errorMessage = 'Vous devez accepter les conditions d\'utilisation.';
                }
                break;
        }

        logEvent('warn', `Champ vide détecté : ${field.id}`, { errorMessage }); // Log en cas de champ vide
    } else {
        // Si le champ n'est pas vide, effectue une validation spécifique selon le champ
        switch (field.id) {
            case 'first':
                if (field.value.trim().length < 2) {
                    errorMessage = 'Le prénom doit contenir au moins 2 caractères.';
                } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ]+(?:[-' ][a-zA-ZÀ-ÖØ-öø-ÿ]+)*$/.test(field.value.trim())) {
                    errorMessage = 'Le prénom ne doit contenir que des lettres, des espaces ou des traits d’union.';
                }
                break;

            case 'last':
                if (field.value.trim().length < 2) {
                    errorMessage = 'Le nom doit contenir au moins 2 caractères.';
                } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ]+(?:[-' ][a-zA-ZÀ-ÖØ-öø-ÿ]+)*$/.test(field.value.trim())) {
                    errorMessage = 'Le nom ne doit contenir que des lettres, des espaces, des apostrophes ou des traits d’union.';
                }
                break;

            case 'email':
                if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(field.value.trim())) {
                    errorMessage = 'Veuillez entrer une adresse e-mail valide.';
                }
                break;

            case 'birthdate':
                const birthDate = new Date(field.value); // Convertit la date saisie en objet Date
                const today = new Date(); // Date actuelle
                if (birthDate >= today) {
                    errorMessage = 'La date de naissance doit être dans le passé.';
                }
                break;

            case 'quantity':
                if (isNaN(field.value) || field.value < 0 || field.value > 99) {
                    errorMessage = 'Le nombre de participations doit être entre 0 et 99.';
                }
                break;
        }

        // Log une erreur de validation si une condition échoue
        if (errorMessage) {
            logEvent('warn', `Erreur de validation dans le champ : ${field.id}`, { errorMessage, value: field.value.trim() });
        }
    }

    // Affiche ou supprime le message d'erreur selon la validation
    if (errorMessage) {
        showError(errorMessage, field); // Affiche le message d'erreur
        field.classList.add('error'); // Ajoute la classe d'erreur pour la bordure rouge
    } else {
        removeError(field); // Supprime le message d'erreur
        field.classList.remove('error'); // Retire la classe d'erreur
        logEvent('info', `Validation réussie pour le champ : ${field.id}`, { value: field.value.trim() }); // Log succès
    }

    logEvent('info', `Fin de validation du champ : ${field.id}`); // Log final de la validation
}



/**
 * ============ Fonction pour ouvrir la modale de confirmation ============ 
 * 
 * - Ajoute la classe CSS pour afficher la modale de confirmation.
 * - Désactive le défilement en arrière-plan en appliquant une classe dédiée.
 * - Journalise les étapes importantes et gère les éventuelles erreurs.
 * 
 * @returns {void}
 */
function openConfirmationModal() {
    try {
        logEvent('info', 'Tentative d\'ouverture de la modale de confirmation.'); // Log initial indiquant le début de la fonction

        // Affiche la modale de confirmation en ajoutant une classe CSS dédiée
        confirmationModal.classList.add(CSS_CLASSES.MODAL_ACTIVE);
        logEvent('info', 'Modale de confirmation affichée.'); // Log confirmant l'affichage de la modale

        // Désactive le défilement de l'arrière-plan en ajoutant une classe CSS
        document.body.classList.add(CSS_CLASSES.BODY_NO_SCROLL);
        logEvent('info', 'Défilement de l\'arrière-plan désactivé.'); // Log confirmant la désactivation du défilement
    } catch (error) {
        // Gestion des erreurs
        logEvent('error', 'Erreur lors de l\'ouverture de la modale de confirmation.', { error }); // Log en cas d'erreur
        console.error('Erreur lors de l\'ouverture de la modale de confirmation :', error); // Affiche l'erreur dans la console pour le débogage
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
closeModalBtn.addEventListener('click', function () {
    try {
        logEvent('info', 'Tentative de fermeture de la modale de confirmation.'); // Log initial pour signaler le début de la fermeture

        // Supprime la classe CSS active pour masquer la modale
        confirmationModal.classList.remove(CSS_CLASSES.MODAL_ACTIVE);
        logEvent('info', 'Modale de confirmation masquée.'); // Log confirmant la fermeture visuelle

        // Supprime la classe CSS qui désactive le défilement de la page
        document.body.classList.remove(CSS_CLASSES.BODY_NO_SCROLL);
        logEvent('info', 'Défilement de l\'arrière-plan réactivé.'); // Log confirmant la réactivation du défilement

        // Gestion spécifique pour le mode paysage
        if (isLandscape) { 
            window.scrollTo(0,0); // Fait défiler vers le haut de la page de manière fluide
            logEvent('info', 'Défilement forcé vers le haut (mode paysage).'); // Log pour indiquer le scrolling en mode paysage
        }
    } catch (error) {
        // Gestion des erreurs
        logEvent('error', 'Erreur lors de la fermeture de la modale de confirmation.', { error }); // Log en cas d'erreur
        console.error('Erreur lors de la fermeture de la modale de confirmation :', error); // Affiche l'erreur dans la console pour débogage
    }
});




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
        // Supprime les erreurs précédentes pour éviter les doublons
        removeError(inputElement);
        logEvent('info', `Suppression des anciennes erreurs pour le champ : ${inputElement.id}`); // Log de suppression des erreurs existantes

        // Création d'un nouvel élément pour afficher le message d'erreur
        const errorTooltip = document.createElement('div');
        errorTooltip.classList.add(CSS_CLASSES.ERROR_MODAL); // Applique la classe CSS pour le style du message d'erreur
        errorTooltip.textContent = message; // Ajoute le message d'erreur fourni
        logEvent('info', `Création d'un tooltip d'erreur pour le champ : ${inputElement.id}`, { message }); // Log de création du tooltip

        // Ajoute une bordure rouge au champ concerné
        inputElement.classList.add(CSS_CLASSES.ERROR_INPUT);

        // Ajoute le message d'erreur comme enfant de l'élément parent du champ
        inputElement.parentElement.appendChild(errorTooltip);
        logEvent('info', `Tooltip d'erreur ajouté au DOM pour le champ : ${inputElement.id}`); // Log d'ajout du tooltip dans le DOM
    } catch (error) {
        // Gestion des erreurs
        logEvent('error', `Erreur lors de l'affichage du message d'erreur pour le champ : ${inputElement.id}`, { error }); // Log en cas d'erreur
        console.error('Erreur dans showError :', error); // Affiche l'erreur dans la console pour le débogage
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
        // Retire la classe CSS qui applique une bordure rouge au champ
        inputElement.classList.remove(CSS_CLASSES.ERROR_INPUT); 
        logEvent('info', `Suppression de la bordure rouge pour le champ : ${inputElement.id}`); // Log pour confirmer la suppression de la bordure

        // Recherche d'un tooltip d'erreur existant dans l'élément parent du champ
        const existingError = inputElement.parentElement.querySelector(`.${CSS_CLASSES.ERROR_MODAL}`); 
        if (existingError) {
            existingError.remove(); // Supprime le tooltip d'erreur du DOM
            logEvent('info', `Suppression du tooltip d'erreur pour le champ : ${inputElement.id}`); // Log pour confirmer la suppression du message d'erreur
        }
    } catch (error) {
        // Gestion des erreurs
        logEvent('error', `Erreur lors de la suppression du message d'erreur pour le champ : ${inputElement.id}`, { error }); // Log en cas d'erreur
        console.error('Erreur dans removeError :', error); // Affiche l'erreur dans la console pour le débogage
    }
}



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

    // === Configuration des placeholders pour le champ de date ===
    birthdateInput.placeholder = ''; // Supprime le placeholder par défaut
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