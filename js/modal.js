// Déclaration des éléments du DOM et variables nécessaires en début de fichier
const navElement = document.getElementById("Topnav");
const modalbg = document.querySelector(".bground");
const modalnav = document.querySelector("hero-section");
const modalbtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");
const closeBtn = document.querySelector(".close");
const inputs = document.querySelectorAll('input');
const isMobile = window.matchMedia("(max-width: 767px)").matches;
const isLandscape = window.matchMedia("(orientation: landscape)").matches;
let modalOpen = false; // Variable pour suivre l'état d'ouverture de la modale

// Fonction pour activer/désactiver le menu en version responsive
function editNav() {
  navElement.classList.toggle("responsive");

 // Gérer le déplacement de la modale en fonction des différentes conditions
  if (navElement.classList.contains("responsive") && modalOpen && isMobile) {
    if (isLandscape) {
      // Mode responsive et mobile en paysage
      modalnav.style.top = "15%"; // Position spécifique pour le mode paysage
    } else {
      // Mode responsive et mobile en portrait
      modalnav.style.top = "10%"; // Position spécifique pour le mode portrait
    }
  } else {
    // Si le menu est fermé ou que les conditions ne sont pas remplies, remettre la modale à sa position d'origine
    modalnav.style.top = "6%";
  }

}

// Fonction pour afficher la modale
function launchModal() {
  resetForm();
  modalbg.style.display = 'block';
  modalbg.style.top = "5%"; // Position de départ de la modale
  document.body.style.overflow = 'hidden';
  modalOpen = true; // Mettre à jour l'état d'ouverture de la modale
}

// Fonction pour fermer la modale
function closeModal() {
  modalbg.style.display = 'none';
  document.body.style.overflow = 'auto';
  modalOpen = false; // Mettre à jour l'état de fermeture de la modale
}

// Fonction de validation de champ de formulaire
function validateField(event) {
  const field = event.target;
  let errorMessage = '';

  switch (field.id) {
    case 'first':
      if (field.value.trim() === '') {
        errorMessage = 'Le prénom est requis.';
      } else if (field.value.length < 2) {
        errorMessage = 'Le prénom doit contenir au moins 2 caractères.';
      } else if (!/^[a-zA-Z]+$/.test(field.value)) {
        errorMessage = 'Le prénom ne doit contenir que des lettres.';
      }
      break;

    case 'last':
      if (field.value.trim() === '') {
        errorMessage = 'Le nom est requis.';
      } else if (field.value.length < 2) {
        errorMessage = 'Le nom doit contenir au moins 2 caractères.';
      } else if (!/^[a-zA-Z]+$/.test(field.value)) {
        errorMessage = 'Le nom ne doit contenir que des lettres.';
      }
      break;

    case 'email':
      if (field.value.trim() === '') {
        errorMessage = 'L\'e-mail est requis.';
      } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(field.value)) {
        errorMessage = 'Veuillez entrer une adresse e-mail valide.';
      }
      break;

    case 'birthdate':
      if (field.value.trim() === '') {
        errorMessage = 'La date de naissance est requise.';
      } else {
        const birthDate = new Date(field.value);
        const today = new Date();
        if (birthDate >= today) {
          errorMessage = 'La date de naissance doit être dans le passé.';
        }
      }
      break;

    case 'quantity':
      if (field.value.trim() === '') {
        errorMessage = 'Le nombre de participations est requis.';
      } else if (isNaN(field.value) || field.value < 0 || field.value > 99) {
        errorMessage = 'Le nombre de participations doit être entre 0 et 99.';
      }
      break;

    case 'checkbox1':
      if (!field.checked) {
        errorMessage = 'Vous devez accepter les conditions d\'utilisation.';
      }
      break;
  }

  if (errorMessage) {
    showError(errorMessage, field);
  } else {
    removeError(field);
  }
}

// Fonction pour afficher un message d'erreur et ajouter la bordure rouge
function showError(message, inputElement) {
  removeError(inputElement); // Supprime les erreurs précédentes, le cas échéant

  // Création d'un élément pour afficher le message d'erreur
  const errorTooltip = document.createElement('div');
  errorTooltip.className = 'error-modal'; // Utilise la classe .error-modal définie dans ton CSS
  errorTooltip.textContent = message;

  // Ajoute la classe 'error-input' pour afficher la bordure rouge
  inputElement.classList.add('error-input');
  
  // Ajoute le tooltip d'erreur
  inputElement.parentElement.appendChild(errorTooltip);

  // Positionne le tooltip d'erreur en fonction de la position de l'input
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
