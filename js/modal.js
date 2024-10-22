// Déclaration des éléments du DOM nécessaires en début de fichier
const navElement = document.getElementById("Topnav");
const modalbg = document.querySelector(".bground");
const modalbtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");
const closeBtn = document.querySelector(".close");
const inputs = document.querySelectorAll('input');

// Fonction pour activer/désactiver le menu en version responsive
function editNav() {
  navElement.classList.toggle("responsive");

  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  
  if (navElement.classList.contains("responsive") && isMobile) {
    modalbg.style.top = "20vh";
  } else {
    modalbg.style.top = "6%";
  }
}

// Fonction pour afficher la modal
function launchModal() {
  modalbg.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Fonction pour fermer la modal
function closeModal() {
  modalbg.style.display = 'none';
  document.body.style.overflow = 'auto';
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
    // Ajoutez ici d'autres validations pour les autres champs (last, email, etc.)
  }

  if (errorMessage) {
    showError(errorMessage, field);
  } else {
    removeError(field);
  }
}

// Fonction pour afficher un message d'erreur
function showError(message, inputElement) {
  removeError(inputElement);
  
  const errorTooltip = document.createElement('div');
  errorTooltip.className = 'error-tooltip';
  errorTooltip.textContent = message;
  inputElement.classList.add('error-input');
  inputElement.classList.remove('valid-input');
  inputElement.parentElement.appendChild(errorTooltip);

  const rect = inputElement.getBoundingClientRect();
  errorTooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
  errorTooltip.style.left = `${rect.left + window.scrollX}px`;
}

// Fonction pour supprimer un message d'erreur
function removeError(inputElement) {
  inputElement.classList.remove('error-input');
  inputElement.classList.add('valid-input');
  const existingError = inputElement.parentElement.querySelector('.error-tooltip');
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
