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
