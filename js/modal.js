// Déclaration des éléments du DOM et variables nécessaires en début de fichier
const navElement = document.getElementById("Topnav");
const modalbg = document.querySelector(".bground");
const heroSection = document.querySelector(".hero-section"); // Correction du sélecteur
const modalbtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");
const closeBtn = document.querySelector(".close");
const inputs = document.querySelectorAll('input');
const isMobile = window.matchMedia("(max-width: 767px)").matches;
const isLandscape = window.matchMedia("(orientation: landscape)").matches;
let modalOpen = false; // Variable pour suivre l'état d'ouverture de la modale

// Fonction pour activer/désactiver le menu responsive
function editNav() {
  navElement.classList.toggle("responsive");

  // Gérer le déplacement de la modale et de la section hero en fonction des conditions
  if (navElement.classList.contains("responsive") && isMobile) {
    if (isLandscape) {
      // Mode responsive et mobile en paysage
      heroSection.style.top = "10%"; // Déplacement de la section hero
      modalbg.style.top = "10%"; // Déplacement de la modale
    } else {
      // Mode responsive et mobile en portrait
      heroSection.style.top = "12%"; // Déplacement de la section hero
      modalbg.style.top = "20%"; // Déplacement de la modale
    }
  } else {
    // Si le menu est fermé ou que les conditions ne sont pas remplies
    heroSection.style.top = "20%"; // Position initiale de la section hero
    modalbg.style.top = "7%"; // Position initiale de la modale
  }
}

// Fonction pour afficher la modale
function launchModal() {
  resetForm();
  modalbg.style.display = 'block'; // Affiche la modale
  modalbg.style.top = "7%"; // Position de départ de la modale
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

  // Affiche ou supprime l'erreur
  if (errorMessage) {
    showError(errorMessage, field);
    field.classList.add('error'); // Ajouter la bordure rouge
  } else {
    removeError(field);
    field.classList.remove('error'); // Retirer la bordure rouge
  }
}

// Gestion de la soumission du formulaire
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
    alert('Formulaire soumis avec succès !');
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
