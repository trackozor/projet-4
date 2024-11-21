
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


// Éléments du DOM
const navElement = document.getElementById("Topnav"); // Élément de navigation pour gérer le menu responsive
const modalbg = document.querySelector(".bground"); // Élément contenant l'arrière-plan et le contenu de la modale
const heroSection = document.querySelector(".hero-section"); // Section "hero" de la page, ajustée en fonction des interactions
const modalbtn = document.querySelectorAll(".modal-btn"); // Boutons pour ouvrir la modale
const formData = document.querySelectorAll(".formData"); // Ensemble des conteneurs de données du formulaire
const closeBtn = document.querySelector(".close"); // Bouton pour fermer la modale
const inputs = document.querySelectorAll('input'); // Tous les champs de saisie du formulaire
const birthdateInput = document.getElementById('birthdate'); // Champ spécifique pour la date de naissance
const confirmationModal = document.getElementById('confirmation-modal'); // Élément de la modale de confirmation
const closeModalBtn = document.getElementById('close-modal-btn'); // Bouton pour fermer la modale de confirmation

// Variables pour les médias
const isMobile = window.matchMedia("(max-width: 767px)").matches;
const isLandscape = window.matchMedia("(orientation: landscape)").matches;

// État d'ouverture de la modale
let modalOpen = false; // Variable pour suivre l'état d'ouverture de la modale


/*========================================= */
/* =========== Fonctions ===================*/
/*========================================= */

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


// Fonction pour afficher la modale
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

// Fonction pour fermer la modale
function closeModal() {
  modalbg.style.display = 'none';
  document.body.style.overflow = 'auto';
  modalOpen = false; // Mettre à jour l'état de fermeture de la modale
}

// Gestion des clics sur l'arrière-plan pour fermer la modale
modalbg.addEventListener('click', (event) => {
  // Vérifie si l'utilisateur a cliqué directement sur l'arrière-plan (et non sur le contenu)
  if (event.target === modalbg) {
    closeModal();
  }
});


// Écouteurs d'événements pour chaque champ d'entrée
inputs.forEach((input) => {
  input.addEventListener('input', validateField); // Valide en temps réel
  input.addEventListener('blur', validateField); // Valide lorsque le champ perd le focus
});

// Fonction de validation des champs
function validateField(event) {
  const field = event.target;
  let errorMessage = '';

  // Validation en fonction de l'ID du champ
  switch (field.id) {

    /* ===Vérification pour le champ "prénom"===*/
    case 'first': 
        if (field.value.trim() === '') { 
            // Vérifie si le champ est vide après suppression des espaces inutiles
            errorMessage = 'Le prénom est requis.';
        } else if (field.value.trim().length < 2) { 
            // Vérifie si le prénom contient au moins 2 caractères
            errorMessage = 'Le prénom doit contenir au moins 2 caractères.';
        } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\- ]+$/.test(field.value.trim())) { 
            // Vérifie si le prénom contient uniquement des lettres, espaces ou traits d’union
            errorMessage = 'Le prénom ne doit contenir que des lettres, des espaces ou des traits d’union.';
        }
        break; // Sort du cas 'first'


    /*==== Vérification pour le champ "nom"=====*/
    case 'last': 
    if (field.value.trim() === '') { 
        // Vérifie si le champ est vide après suppression des espaces inutiles
        errorMessage = 'Le nom est requis.';
    } else if (field.value.length < 2) { 
        // Vérifie si le nom contient au moins 2 caractères
        errorMessage = 'Le nom doit contenir au moins 2 caractères.';
    } else if (!/^[a-zA-Z]+$/.test(field.value)) { 
        // Vérifie si le nom contient uniquement des lettres (sans espaces ni caractères spéciaux)
        errorMessage = 'Le nom ne doit contenir que des lettres.';
    }
    break; // Sort du cas 'last'

    /*===== Vérification pour le champ "e-mail"====*/
    case 'email': 
    if (field.value.trim() === '') { 
        // Vérifie si le champ est vide après suppression des espaces inutiles
        errorMessage = 'L\'e-mail est requis.';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(field.value.trim())) { 
        // Vérifie si l'adresse e-mail respecte un format valide
        errorMessage = 'Veuillez entrer une adresse e-mail valide.';
    }
    break; // Sort du cas 'email'

    /*===== Vérification pour le champ "date de naissance"====*/
    case 'birthdate': 
    if (field.value.trim() === '') { 
        // Vérifie si le champ est vide après suppression des espaces inutiles
        errorMessage = 'La date de naissance est requise.';
    } else {
        const birthDate = new Date(field.value); // Convertit la valeur saisie en objet Date
        const today = new Date(); // Obtient la date actuelle
        if (birthDate >= today) { 
            // Vérifie si la date de naissance est dans le futur ou aujourd'hui
            errorMessage = 'La date de naissance doit être dans le passé.';
        }
    }
    break; // Sort du cas 'birthdate'


    case 'quantity': // Vérification pour le champ "nombre de participations"
    if (field.value.trim() === '') { 
        // Vérifie si le champ est vide après suppression des espaces inutiles
        errorMessage = 'Le nombre de participations est requis.';
    } else if (isNaN(field.value) || field.value < 0 || field.value > 99) { 
        // Vérifie si la valeur saisie n'est pas un nombre ou si elle n'est pas comprise entre 0 et 99
        errorMessage = 'Le nombre de participations doit être entre 0 et 99.';
    }
    break; // Sort du cas 'quantity'

    case 'checkbox1': // Vérification pour la case à cocher "conditions d'utilisation"
    if (!field.checked) { 
        // Vérifie si la case n'est pas cochée
        errorMessage = 'Vous devez accepter les conditions d\'utilisation.';
    }
    break; // Sort du cas 'checkbox1'
  }

  // Affiche ou supprime l'erreur
  if (errorMessage) {
    showError(errorMessage, field);
    field.classList.add('error'); // Ajouter la bordure rouge
  } else {
    removeError(field);
    field.classList.remove('error'); // Retirer la bordure rouge
  }
}

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
// Fonction pour réinitialiser tous les champs et messages d'erreur
function resetForm() {
  inputs.forEach(input => {
    input.value = ''; // Vide le champ
    input.classList.remove('error-input'); // Retire la bordure rouge en cas d'erreur
  });

  // Supprime tous les messages d'erreur affichés
  document.querySelectorAll('.error-modal').forEach(errorTooltip => {
    errorTooltip.remove();
  });
}
