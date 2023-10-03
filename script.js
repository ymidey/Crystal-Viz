// Charger le fichier JSON
fetch('./data.json')
    .then(response => response.json())
    .then(data => {
        // Sélectionner la div où nous afficherons les données
        const filmsDiv = document.getElementById('films');

        // Boucle à travers les objets du tableau JSON
        data.forEach(film => {
            // Créer des éléments HTML pour afficher les informations du film
            const filmElement = document.createElement('div');
            filmElement.innerHTML = `
        <h2>${film["Nom du film"]}</h2>
        <p>Année : ${film.Année}</p>
        <p>Studio : ${film.Studio}</p>
        <p>Réalisateur(s) : ${Array.isArray(film["Réalisateur(s)"]) ? film["Réalisateur(s)"].join(", ") : film["Réalisateur(s)"]}</p>
        <p>Durée : ${film.Durée}</p>
        <p>Technique : ${Array.isArray(film["Technique"]) ? film["Technique"].join(", ") : film["Technique"]}</p>
        <p>Pays : ${Array.isArray(film["Pays"]) ? film["Pays"].join(", ") : film["Pays"]}</p>
        <p>Public visé : ${Array.isArray(film["Public visé"]) ? film["Public visé"].join(", ") : film["Public visé"]}</p>
      `;

            // Ajouter l'élément du film à la div des films
            filmsDiv.appendChild(filmElement);
        });
    })
    .catch(error => console.error('Erreur lors du chargement du fichier JSON :', error));