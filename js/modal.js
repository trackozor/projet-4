
/* ==========================================================
 * Nom du fichier : modal.js
 * Description    : Script JavaScript pour la gestion de la modale,
 *                  validation des formulaires et comportement responsive.
 * Auteur         : Trackozor
 * Date           : 21/411/2024
 * ==========================================================*/




/*                                 =========================================                     */
/*                                 ======= Déclaration des variables =======                     */           
/*                                 =========================================                    */



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


// ======= Variables pour les médias =======
const isMobile = window.matchMedia("(max-width: 767px)").matches; // Indique si l'utilisateur utilise un appareil avec un petit écran (mobile)
const isLandscape = window.matchMedia("(orientation: landscape)").matches; // Indique si l'écran est en mode paysage (orientation horizontale)

// ======= État global =======
let modalOpen = false; // Variable pour suivre l'état d'ouverture de la modale. "true" signifie que la modale est ouverte





/*========================================================================================*/
/*                                 =========== Fonctions ===================              */
/*========================================================================================*/




/** 
 * =====Fonction utilitaire pour loguer des événements avec des styles dans la console.=====
 * 
 * 
 * @param {string} type - Type de log : 'info', 'warn', 'error', ou 'default'.
 * @param {string} message - Message à afficher dans la console.
 * @param {Object} [data={}] - Données supplémentaires (optionnelles) à afficher dans la console.
 * @example
 * logEvent('info', 'Opération réussie.');
 * logEvent('warn', 'Attention, comportement inattendu détecté.', { code: 123 });
 * logEvent('error', 'Erreur critique.', { details: 'Connection failed' });
 * logEvent('unknown', 'Type de log non spécifié.'); // Utilisera le style par défaut
 */


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
 * ============ Fonction pour activer/désactiver le menu responsive.====
 * 
 * 
 * @returns {void}
 */
function editNav() {
    // Bascule la classe "responsive" sur l'élément de navigation
    navElement.classList.toggle("responsive");
    logEvent('info', `Menu responsive ${navElement.classList.contains("responsive") ? "activé" : "désactivé"}`);

    // Gérer le déplacement de la modale et de la section hero en fonction des conditions
    if (navElement.classList.contains("responsive") && isMobile) {
        logEvent('info', 'Mode responsive détecté sur un appareil mobile.');

        if (isLandscape) {
            // Mode responsive et mobile en paysage
            heroSection.style.top = "10%";
            modalbg.style.top = "20%";
            logEvent('info', 'Mode paysage détecté. Hero et modale repositionnés.', {
                heroTop: "10%",
                modalTop: "20%",
            });
        } else {
            // Mode responsive et mobile en portrait
            heroSection.style.top = "12%";
            modalbg.style.top = "20%";
            logEvent('info', 'Mode portrait détecté. Hero et modale repositionnés.', {
                heroTop: "12%",
                modalTop: "20%",
            });
        }
    } else {
        // Si le menu est fermé ou que les conditions ne sont pas remplies
        heroSection.style.top = "6.5vh";
        modalbg.style.top = "6.5vh";
        logEvent('info', 'Menu responsive désactivé. Hero et modale remis à leur position initiale.', {
            heroTop: "6.5vh",
            modalTop: "6.5vh",
        });
    }
}


function resetForm() {
    try {
        // Sélectionne le formulaire dans la modale
        const form = document.querySelector('form');
        if (form) {
            form.reset(); // Réinitialise tous les champs
            console.log('Formulaire réinitialisé.');
            
            // Supprime les éventuels messages d'erreur
            const errorMessages = form.querySelectorAll('.error-modal');
            errorMessages.forEach((error) => error.remove());

            // Supprime les classes d'erreur des champs
            const errorInputs = form.querySelectorAll('.error-input');
            errorInputs.forEach((input) => input.classList.remove('error-input'));
        } else {
            console.warn('Aucun formulaire trouvé à réinitialiser.');
        }
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du formulaire :', error);
    }
}


/*=========== Fonction pour afficher la modale et empêcher le défilement en arrière-plan. ===========*/

/** 
 * @returns {void}
 */
function launchModal() {
    logEvent('info', 'Début de la fonction launchModal.');

    // Vérifie que modalbg est bien défini
    if (!modalbg) {
        logEvent('error', 'modalbg est introuvable.');
        return;
    }

    // Empêche d’afficher plusieurs fois la modale si elle est déjà ouverte
    if (modalbg.classList.contains('active')) {
        logEvent('warn', 'La modale est déjà affichée.');
        return;
    }

    // Réinitialise le formulaire
    try {
        resetForm();
        logEvent('info', 'Formulaire réinitialisé.');
    } catch (error) {
        logEvent('error', 'Erreur lors de la réinitialisation du formulaire.', error);
    }

    // Affiche la modale
    try {
        modalbg.classList.add('active');
        document.body.style.overflow = 'hidden';
        modalOpen = true;
        logEvent('info', 'Modale affichée.');
    } catch (error) {
        logEvent('error', 'Erreur lors de l\'affichage de la modale.', error);
    }

    // Gestion du responsive
    if (navElement?.classList.contains("responsive")) {
        if (heroSection) {
            const heroTop = isMobile ? "12%" : "7%";
            heroSection.style.top = heroTop;
            logEvent('info', 'Hero section synchronisée.', { heroTop });
        } else {
            logEvent('warn', 'heroSection introuvable, aucune synchronisation effectuée.');
        }
    }
}



/*===== Fonction pour fermer la modale =====*/

/**
 * Fonction pour fermer la modale et rétablir l'état de la page.
 * @returns {void}
 */
function closeModal() {
    try {
        logEvent('info', 'Tentative de fermeture de la modale.');

        // Supprime la classe active pour masquer la modale
        modalbg.classList.remove('active');
        logEvent('info', 'Modale masquée.');

        // Réactive le défilement de la page
        document.body.style.overflow = 'auto';
        logEvent('info', 'Défilement de l\'arrière-plan réactivé.');

        // Mettre à jour l'état global
        modalOpen = false;
        logEvent('info', 'État de la modale mis à jour : Fermée.', { modalOpen });
    } catch (error) {
        // Gestion des erreurs potentielles
        logEvent('error', 'Erreur lors de la fermeture de la modale.', { error });
        console.error('Erreur lors de la fermeture de la modale :', error);
    }
}



/*==== Fonction de validation des champs ====*/
/**
 * Valide un champ de formulaire et affiche un message d'erreur si nécessaire.
 * @param {Event} event - L'événement déclenché lors de la validation.
 * @returns {void}
 */
function validateField(event) {
    const field = event.target;
    let errorMessage = '';

    // Log de début de validation
    logEvent('info', `Début de validation du champ : ${field.id}`, { value: field.value.trim() });

    // Vérifie si le champ est vide avant toute autre validation
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

        logEvent('warn', `Champ vide détecté : ${field.id}`, { errorMessage });
    } else {
        // Effectue des validations supplémentaires si le champ n'est pas vide
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
                const birthDate = new Date(field.value); // Convertit la valeur saisie en objet Date
                const today = new Date(); // Obtient la date actuelle
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

        if (errorMessage) {
            logEvent('warn', `Erreur de validation dans le champ : ${field.id}`, { errorMessage, value: field.value.trim() });
        }
    }

    // Affiche ou supprime l'erreur
    if (errorMessage) {
        showError(errorMessage, field);
        field.classList.add('error'); // Ajouter la bordure rouge
    } else {
        removeError(field);
        field.classList.remove('error'); // Retirer la bordure rouge
        logEvent('info', `Validation réussie pour le champ : ${field.id}`, { value: field.value.trim() });
    }

    // Log de fin de validation
    logEvent('info', `Fin de validation du champ : ${field.id}`);
}



/*=========== Fonction pour ouvrir la modale de confirmation ==========*/
/**
 * Fonction pour ouvrir la modale de confirmation et empêcher le défilement de la page.
 * @returns {void}
 */
function openConfirmationModal() {
    try {
        logEvent('info', 'Tentative d\'ouverture de la modale de confirmation.');

        // Affiche la modale de confirmation
        confirmationModal.style.display = 'flex';
        logEvent('info', 'Modale de confirmation affichée.', { display: 'flex' });

        // Empêche le défilement en arrière-plan
        document.body.style.overflow = 'hidden';
        logEvent('info', 'Défilement de l\'arrière-plan désactivé.');
    } catch (error) {
        // Log de gestion des erreurs
        logEvent('error', 'Erreur lors de l\'ouverture de la modale de confirmation.', { error });
        console.error('Erreur lors de l\'ouverture de la modale de confirmation :', error);
    }
}


/*========== Fonction pour fermer la modale ===========*/

/**
 * Gestion de la fermeture de la modale de confirmation.
 * @returns {void}
 */
closeModalBtn.addEventListener('click', function () {
    try {
        logEvent('info', 'Tentative de fermeture de la modale de confirmation.');

        // Masque la modale de confirmation
        confirmationModal.style.display = 'none';
        logEvent('info', 'Modale de confirmation masquée.');

        // Réactive le défilement de la page
        document.body.style.overflow = 'auto';
        logEvent('info', 'Défilement de l\'arrière-plan réactivé.');

        // Scrolling spécifique en mode paysage
        if (isLandscape) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            logEvent('info', 'Défilement forcé vers le haut (mode paysage).');
        }
    } catch (error) {
        // Log de gestion des erreurs
        logEvent('error', 'Erreur lors de la fermeture de la modale de confirmation.', { error });
        console.error('Erreur lors de la fermeture de la modale de confirmation :', error);
    }
    });



/*================ Fonction pour afficher un message d'erreur et ajouter la bordure rouge =======*/

/**
 * Affiche un message d'erreur sous un champ d'entrée et ajoute une bordure rouge.
 * @param {string} message - Message d'erreur à afficher.
 * @param {HTMLElement} inputElement - Champ d'entrée cible.
 * @returns {void}
 */
function showError(message, inputElement) {
    try {
        // Supprime les erreurs précédentes, le cas échéant
        removeError(inputElement);
        logEvent('info', `Suppression des anciennes erreurs pour le champ : ${inputElement.id}`);

        // Création d'un élément pour afficher le message d'erreur
        const errorTooltip = document.createElement('div');
        errorTooltip.className = 'error-modal'; // Utilise la classe .error-modal définie dans le CSS
        errorTooltip.textContent = message;
        errorTooltip.style.display = 'block'; // Rend le message d'erreur visible
        logEvent('info', `Création d'un tooltip d'erreur pour le champ : ${inputElement.id}`, { message });

        // Ajoute la classe 'error-input' pour afficher la bordure rouge
        inputElement.classList.add('error-input');

        // Positionne et ajoute le tooltip d'erreur sous l'input
        inputElement.parentElement.appendChild(errorTooltip);
        logEvent('info', `Tooltip d'erreur ajouté au DOM pour le champ : ${inputElement.id}`);

        // Position du message d'erreur sous le champ de saisie
        const rect = inputElement.getBoundingClientRect();
        errorTooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
        errorTooltip.style.left = `${rect.left + window.scrollX}px`;
        logEvent('info', `Tooltip positionné pour le champ : ${inputElement.id}`, {
            top: errorTooltip.style.top,
            left: errorTooltip.style.left,
        });
    } catch (error) {
        logEvent('error', `Erreur lors de l'affichage du message d'erreur pour le champ : ${inputElement.id}`, { error });
        console.error('Erreur dans showError :', error);
    }
    }



/*======== Fonction pour supprimer un message d'erreur et la bordure rouge ==========*/


/**
 * Supprime un message d'erreur et retire la bordure rouge d'un champ d'entrée.
 * @param {HTMLElement} inputElement - Champ d'entrée cible.
 * @returns {void}
 */
function removeError(inputElement) {
    try {
        // Retire la bordure rouge
        inputElement.classList.remove('error-input');
        logEvent('info', `Suppression de la bordure rouge pour le champ : ${inputElement.id}`);

        // Supprime le tooltip d'erreur, s'il existe
        const existingError = inputElement.parentElement.querySelector('.error-modal');
        if (existingError) {
            existingError.remove();
            logEvent('info', `Suppression du tooltip d'erreur pour le champ : ${inputElement.id}`);
        }
    } catch (error) {
        logEvent('error', `Erreur lors de la suppression du message d'erreur pour le champ : ${inputElement.id}`, { error });
        console.error('Erreur dans removeError :', error);
    }
}


/**
 * Point d'entrée principal du script.
 * Configure les placeholders, les écouteurs d'événements, et initialise les modales.
 */
function main() {
    logEvent('info', 'Début de l\'initialisation principale.');

    // Initialisations (placeholders, écouteurs, etc.)
    birthdateInput.placeholder = ''; // Supprime le placeholder par défaut

    birthdateInput.addEventListener('focus', () => {
        logEvent('info', 'Focus sur le champ de date : affichage du placeholder.');
        birthdateInput.placeholder = 'jj/mm/aaaa'; // Remet le placeholder lors du focus
    });

    birthdateInput.addEventListener('blur', () => {
        if (!birthdateInput.value) {
            logEvent('info', 'Champ de date vide après perte du focus : suppression du placeholder.');
            birthdateInput.placeholder = ''; // Supprime le placeholder si aucun texte n'est saisi
        }
    });

    modalbg.addEventListener('click', (event) => {
        if (event.target === modalbg) {
            logEvent('info', 'Clic détecté sur l\'arrière-plan : fermeture de la modale.');
            closeModal();
        }
    });

    inputs.forEach((input) => {
        input.addEventListener('input', (event) => {
            logEvent('info', `Modification détectée sur le champ : ${event.target.id}`);
            validateField(event); // Valide en temps réel
        });
        input.addEventListener('blur', (event) => {
            logEvent('info', `Perte de focus sur le champ : ${event.target.id}`);
            validateField(event); // Valide lors de la perte de focus
        });
    });

    document.querySelector('form').addEventListener('submit', function (event) {
        let isValid = true;
        logEvent('info', 'Tentative de soumission du formulaire.');

        // Valide tous les champs obligatoires
        inputs.forEach((input) => {
            validateField({ target: input });
            if (input.classList.contains('error')) {
                isValid = false; // Si une erreur est présente, le formulaire n'est pas valide
            }
        });

        if (!isValid) {
            event.preventDefault(); // Empêche la soumission du formulaire
            logEvent('warn', 'Échec de la soumission : des erreurs sont présentes dans le formulaire.');
            alert('Veuillez corriger les erreurs avant de soumettre le formulaire.');
        } else {
            event.preventDefault(); // Empêche la redirection par défaut (si elle est gérée différemment)
            logEvent('info', 'Formulaire valide : ouverture de la modale de confirmation.');
            openConfirmationModal(); // Ouvre la modale de confirmation
        }
    });

    modalbtn.forEach(btn => btn.addEventListener('click', () => {
        logEvent('info', 'Clic sur un bouton d\'ouverture de modale.');
        launchModal();
    }));

    closeBtn.addEventListener('click', () => {
        logEvent('info', 'Clic sur le bouton de fermeture de modale.');
        closeModal();
    });

    logEvent('info', 'Initialisation principale terminée.');
}

/*                            =========================================                */
/*                            ===========Déroulement du script ========                */
/*                            =========================================               */


document.addEventListener('DOMContentLoaded', () => {
    logEvent('info', 'DOM entièrement chargé. Début de l\'exécution du script principal.');
    main();
});
