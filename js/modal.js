// Fonction pour activer/désactiver le menu en version responsive

function editNav() {
  const navElement = document.getElementById("Topnav");
  const modalbg = document.querySelector(".bground"); // Sélection de la modale

  // Ajoute ou enlève la classe "responsive" sur le menu de navigation
  navElement.classList.toggle("responsive");

  // Vérifie la largeur de l'écran
  const isTablet = window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches; // Condition pour les tablettes
  const isMobile = window.matchMedia("(max-width: 767px)").matches; // Condition pour les mobiles

  // Si la navigation est en mode responsive
  if (navElement.classList.contains("responsive")) {
    // Si c'est un mobile (moins de 768px)
    if (isMobile) {
      modalbg.style.top = "20vh"; // Ajuste la position de la modale pour les mobiles
    }
    // Si c'est une tablette (entre 768px et 1024px), ne bouge pas la modale
    else if (isTablet) {
      modalbg.style.top = "5%"; // Ne bouge pas la modale pour les tablettes
    }
    // Pour les écrans plus larges que 1024px, ajuster si nécessaire
    else {
      modalbg.style.top = "5%"; // Ne bouge pas non plus sur grand écran
    }
  } else {
    // Quand le menu responsive est fermé, remet la position d'origine de la modale
    modalbg.style.top = "5%";
  }
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
  document.body.style.overflow = "hidden"; // Empêche le défilement du body
}

// Fonction pour fermer la modal
function closeModal() {
  modalbg.style.display = "none"; // On masque la modal en remettant son display à "none"
  document.body.style.overflow = "auto"; // Réactive le défilement du body
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
// Fonction utilitaire pour les couleurs de la console
const consoleColors = {
  reset: "\x1b[0m", // Réinitialisation
  fgGreen: "\x1b[32m", // Texte vert (OK)
  fgYellow: "\x1b[33m", // Texte jaune (Avertissement)
  fgRed: "\x1b[31m" // Texte rouge (Erreur)
};

d
// Fonction principale pour valider le formulaire à la soumission
function validate() {
  let isValid = true;

  try {
    console.log(`${consoleColors.fgYellow}Validation du formulaire en cours...${consoleColors.reset}`);
    
    // Supprime les erreurs existantes
    removeErrorIndicators();

    // Valide chaque champ en appelant la fonction validateField
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      validateField({ target: input });
      if (input.classList.contains('error-input')) {
        isValid = false;
      }
    });

    console.log(`${consoleColors.fgGreen}Résultat de la validation du formulaire : ${isValid ? 'Valide' : 'Invalide'}${consoleColors.reset}`);
  } catch (error) {
    console.error(`${consoleColors.fgRed}Erreur lors de la validation du formulaire : ${error}${consoleColors.reset}`);
    isValid = false;
  }

  return isValid;
}

// Supprimer toutes les erreurs au début de la validation
function removeErrorIndicators() {
  try {
    console.log(`${consoleColors.fgYellow}Suppression de toutes les erreurs existantes avant validation.${consoleColors.reset}`);
    
    const errorModals = document.querySelectorAll('.error-modal');
    errorModals.forEach(modal => modal.remove());

    const errorInputs = document.querySelectorAll('.error-input');
    errorInputs.forEach(input => input.classList.remove('error-input'));
  } catch (error) {
    console.error(`${consoleColors.fgRed}Erreur lors de la suppression des erreurs existantes : ${error}${consoleColors.reset}`);
  }
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
