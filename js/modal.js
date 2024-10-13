// Fonction pour activer/désactiver le menu en version responsive
function editNav() {
  const navElement = document.getElementById("Topnav");
  navElement.classList.toggle("responsive"); // Ajoute ou enlève la classe "responsive" sur mobile
}



// Sélection des éléments du DOM nécessaires
const modalbg = document.querySelector(".bground"); // La modal (formulaire)
const modalbtn = document.querySelectorAll(".modal-btn"); // Boutons qui ouvrent la modal
const formData = document.querySelectorAll(".formData"); // Tous les champs du formulaire
const closeBtn = document.querySelector(".close"); // Bouton pour fermer la modal

// Ajoute un événement "click" à chaque bouton pour ouvrir la modal
modalbtn.forEach((btn) => btn.addEventListener("click", launchModal));

// Fonction pour afficher la modal
function launchModal() {
  modalbg.style.display = "block"; // On modifie le style pour rendre la modal visible
}

// Fonction pour fermer la modal
function closeModal() {
  modalbg.style.display = "none"; // On masque la modal en remettant son display à "none"
}

// Ajoute un événement "click" au bouton "close" pour fermer la modal
closeBtn.addEventListener("click", closeModal);

// Ferme la modal si l'utilisateur clique en dehors de celle-ci
window.addEventListener("click", (e) => {
  // Vérifie si l'élément cliqué est l'arrière-plan de la modal
  if (e.target === modalbg) {
    closeModal(); // Appelle la fonction pour fermer la modal
  }
});


//-----------------------------------------------------------------------------------------
// Fonction pour valider le formulaire
function validate() {
  // Initialise une variable de validation
  let isValid = true;

  // Validation du champ "Prénom"
  const firstName = document.getElementById('first');
  if (firstName.value.length < 2) {
    // Affiche un message si le prénom fait moins de 2 caractères
    alert("Le prénom doit contenir au moins 2 caractères.");
    isValid = false; // Le formulaire n'est pas valide
  }

  // Validation du champ "Nom"
  const lastName = document.getElementById('last');
  if (lastName.value.length < 2) {
    // Affiche un message si le nom fait moins de 2 caractères
    alert("Le nom doit contenir au moins 2 caractères.");
    isValid = false; // Le formulaire n'est pas valide
  }

  // Validation du champ "Email"
  const email = document.getElementById('email');
  // Utilisation d'une expression régulière pour vérifier la validité de l'email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    // Affiche un message si l'email n'est pas valide
    alert("Veuillez entrer une adresse email valide.");
    isValid = false; // Le formulaire n'est pas valide
  }

  // Validation du champ "Date de naissance"
  const birthdate = document.getElementById('birthdate');
  if (!birthdate.value) {
    // Affiche un message si la date de naissance n'est pas remplie
    alert("Veuillez entrer votre date de naissance.");
    isValid = false; // Le formulaire n'est pas valide
  }

  // Validation de la sélection d'une ville (tournoi)
  const locationChecked = document.querySelector('input[name="location"]:checked');
  if (!locationChecked) {
    // Affiche un message si aucune ville n'est sélectionnée
    alert("Veuillez sélectionner une ville pour participer au tournoi.");
    isValid = false; // Le formulaire n'est pas valide
  }

  // Vérification que les conditions d'utilisation sont acceptées
  const conditionsAccepted = document.getElementById('checkbox1').checked;
  if (!conditionsAccepted) {
    // Affiche un message si les conditions d'utilisation ne sont pas acceptées
    alert("Vous devez accepter les conditions d'utilisation.");
    isValid = false; // Le formulaire n'est pas valide
  }

  // Retourne "true" si tout est valide, "false" sinon
  return isValid;
}


//--------------------------------------------------------------------------------------------------
// Gérer la soumission du formulaire
document.querySelector('form').addEventListener('submit', function(event) {
  // Si la validation échoue, empêche l'envoi du formulaire
  if (!validate()) {
    event.preventDefault(); // Annule l'action par défaut (envoi du formulaire)
  } else {
    // Si la validation réussit, affiche un message de succès
    alert("Votre inscription a été prise en compte !");
  }
});
