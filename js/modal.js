
/* ==========================================================
 * Nom du fichier : modal.js
 * Description    : Script JavaScript pour la gestion de la modale,
 *                  validation des formulaires et comportement responsive.
 * Auteur         : Trackozor
 * Date           : 21/411/2024
 * ==========================================================*/


/*=========================================  */
/*======= Déclaration des variables ======= */           
/*========================================= */


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



/*========================================= */
/*=========== Fonctions ===================*/
/*========================================= */

/** 
 * Fonction utilitaire pour loguer des événements avec des styles dans la console.
 * @param {string} type - Type de log : 'info', 'warn', 'error', ou 'default'.
 * @param {string} message - Message à afficher dans la console.
 * @param {Object} [data={}] - Données supplémentaires (optionnelles) à afficher dans la console.
 * @example
 * logEvent('info', 'Opération réussie.');
 * logEvent('warn', 'Attention, comportement inattendu détecté.', { code: 123 });
 * logEvent('error', 'Erreur critique.', { details: 'Connection failed' });
 * logEvent('unknown', 'Type de log non spécifié.'); // Utilisera le style par défaut
 */
function logEvent(type, message, data = {}) {
    // Récupère le style correspondant au type de log ou applique le style par défaut
    const style = logStyles[type] || logStyles.default;

    // Utilise un switch pour différencier les types de logs et leur affichage
    switch (type) {
        case 'info': // Log informatif
            console.log(`%c[INFO] ${message}`, style, data);
            break;
        case 'warn': // Log d'avertissement
            console.warn(`%c[WARN] ${message}`, style, data);
            break;
        case 'error': // Log d'erreur critique
            console.error(`%c[ERROR] ${message}`, style, data);
            break;
        default: // Log générique ou inconnu
            console.log(`%c[LOG] ${message}`, style, data);
    }
}



// Fonction pour activer/désactiver le menu responsive
function editNav() {
  navElement.classList.toggle("responsive");

  // Gérer le déplacement de la modale et de la section hero en fonction des conditions
  if (navElement.classList.contains("responsive") && isMobile) {
    if (isLandscape) {
      // Mode responsive et mobile en paysage
      heroSection.style.top = "10%"; // Déplacement de la section hero
      modalbg.style.top = "20%"; // Déplacement de la modale
    } else {
      // Mode responsive et mobile en portrait
      heroSection.style.top = "12%"; // Déplacement de la section hero
      modalbg.style.top = "20%"; // Déplacement de la modale
    }
  } else {
    // Si le menu est fermé ou que les conditions ne sont pas remplies
    heroSection.style.top = "6.5vh"; // Position initiale de la section hero
    modalbg.style.top = "6.5vh"; // Position initiale de la modale
  }
}

/*===== Fonction pour afficher la modale ======*/
function launchModal() {
  resetForm();
  modalbg.style.display = 'block'; // Affiche la modale
  modalbg.style.top = "6%"; // Position de départ de la modale
  document.body.style.overflow = 'hidden'; // Empêche le défilement en arrière-plan
  modalOpen = true; // Mettre à jour l'état d'ouverture de la modale

  // Synchronisation de la section hero si le menu est responsive
  if (navElement.classList.contains("responsive")) {
    heroSection.style.top = isMobile ? "12%" : "7%";
  }
}

/*===== Fonction pour fermer la modale =====*/
function closeModal() {
  modalbg.style.display = 'none';
  document.body.style.overflow = 'auto';
  modalOpen = false; // Mettre à jour l'état de fermeture de la modale
}

/*==== Fonction de validation des champs ====*/
function validateField(event) {
    const field = event.target;
    let errorMessage = '';

    // Log de début de validation
    logEvent('info', `Validation du champ : ${field.id}`, { value: field.value.trim() });


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
    }

    // Affiche ou supprime l'erreur
    if (errorMessage) {
        showError(errorMessage, field);
        field.classList.add('error'); // Ajouter la bordure rouge
        logEvent('warn', `Erreur détectée dans le champ : ${field.id}`, { errorMessage });
    } else {
        removeError(field);
        field.classList.remove('error'); // Retirer la bordure rouge
        logEvent('info', `Validation réussie pour le champ : ${field.id}`);
    }
}


// Fonction pour ouvrir la modale de confirmation
function openConfirmationModal() {
  confirmationModal.style.display = 'flex'; // Affiche la modale en mode flex
  document.body.style.overflow = 'hidden'; // Empêche le défilement de la page
}

// Fonction pour fermer la modale
closeModalBtn.addEventListener('click', function () {
  confirmationModal.style.display = 'none'; // Cache la modale
  document.body.style.overflow = 'auto'; // Réactive le défilement de la page
  if (isLandscape) {
    // Force le défilement vers le haut en mode paysage
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});


// Fonction pour afficher un message d'erreur et ajouter la bordure rouge
function showError(message, inputElement) {
  removeError(inputElement); // Supprime les erreurs précédentes, le cas échéant

  // Création d'un élément pour afficher le message d'erreur
  const errorTooltip = document.createElement('div');
  errorTooltip.className = 'error-modal'; // Utilise la classe .error-modal définie dans le CSS
  errorTooltip.textContent = message;
  errorTooltip.style.display = 'block'; // Rend le message d'erreur visible

  // Ajoute la classe 'error-input' pour afficher la bordure rouge
  inputElement.classList.add('error-input');
  
  // Positionne et ajoute le tooltip d'erreur sous l'input
  inputElement.parentElement.appendChild(errorTooltip);

  // Position du message d'erreur sous le champ de saisie
  const rect = inputElement.getBoundingClientRect();
  errorTooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
  errorTooltip.style.left = `${rect.left + window.scrollX}px`;
}

// Fonction pour supprimer un message d'erreur et la bordure rouge
function removeError(inputElement) {
  // Retire la bordure rouge
  inputElement.classList.remove('error-input');
  
  // Supprime le tooltip d'erreur, s'il existe
  const existingError = inputElement.parentElement.querySelector('.error-modal');
  if (existingError) {
    existingError.remove();
  }
}

// Placeholder par défaut pour le champ date
birthdateInput.placeholder = ''; // Supprime le placeholder par défaut

// Ajoute un événement focus pour rendre le placeholder visible
birthdateInput.addEventListener('focus', () => {
  birthdateInput.placeholder = 'jj/mm/aaaa'; // Remet le placeholder lors du focus
});

// Ajoute un événement blur pour masquer le placeholder si l'input est vide
birthdateInput.addEventListener('blur', () => {
  if (!birthdateInput.value) {
    birthdateInput.placeholder = ''; // Supprime le placeholder si aucun texte n'est saisi
  }
});




/*===== Gestion des clics sur l'arrière-plan pour fermer la modale =====*/
modalbg.addEventListener('click', (event) => {
  // Vérifie si l'utilisateur a cliqué directement sur l'arrière-plan (et non sur le contenu)
  if (event.target === modalbg) {
    closeModal();
  }
});


/*==== Écouteurs d'événements pour chaque champ d'entrée =====*/
inputs.forEach((input) => {
  input.addEventListener('input', validateField); // Valide en temps réel
  input.addEventListener('blur', validateField); // Valide lorsque le champ perd le focus
});


document.querySelector('form').addEventListener('submit', function (event) {
  let isValid = true;

  // Valide tous les champs obligatoires
  inputs.forEach((input) => {
    validateField({ target: input });
    if (input.classList.contains('error')) {
      isValid = false; // Si une erreur est présente, le formulaire n'est pas valide
    }
  });

  if (!isValid) {
    event.preventDefault(); // Empêche la soumission du formulaire
    alert('Veuillez corriger les erreurs avant de soumettre le formulaire.');
  } else {
    event.preventDefault(); // Empêche la redirection par défaut (si elle est gérée différemment)
    openConfirmationModal(); // Ouvre la modale de confirmation
  }
});





// Initialisation des événements au chargement de la page
document.addEventListener('DOMContentLoaded', function () {
  try {
    console.log('Initialisation réussie');
    
    inputs.forEach(input => {
      input.addEventListener('input', validateField);
      input.addEventListener('blur', validateField);
    });

    modalbtn.forEach(btn => btn.addEventListener('click', launchModal));
    closeBtn.addEventListener('click', closeModal);

    // Gestion de la soumission du formulaire
    document.querySelector('form').addEventListener('submit', function(event) {
      if (!validate()) {
        event.preventDefault();
      } else {
        alert("Votre inscription a été prise en compte !");
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'initialisation : ', error);
  }
  });
