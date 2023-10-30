// Charger le fichier JSON
fetch('./data.json')
    .then(response => response.json())
    .then(filmdata => {
        // Sélectionner la div où nous afficherons les données
        const filmsDiv = document.getElementById('films');

        // Collecte des années pour les utiliser dans l'axe des ab6 
        const annees = [...new Set(filmdata.map(movie => movie.Année))];
        console.log(annees);

        // Collecte des pays pour les utiliser dans l'axe des ab6 
        const pays = [...new Set(filmdata.map(movie => movie.Pays))];
        console.log(pays);



        //     // Boucle à travers les objets du tableau JSON
        //     filmdata.forEach(film => {
        //         // Créer des éléments HTML pour afficher les informations du film
        //         const filmElement = document.createElement('div');
        //         filmElement.innerHTML = `
        //     <h2>${film["Nom du film"]}</h2>
        //     <p>Année : ${film.Année}</p>
        //     <p>Studio : ${film.Studio}</p>
        //     <p>Réalisateur(s) : ${Array.isArray(film["Réalisateur(s)"]) ? film["Réalisateur(s)"].join(", ") : film["Réalisateur(s)"]}</p>
        //     <p>Durée : ${film.Durée}</p>
        //     <p>Technique : ${Array.isArray(film["Technique"]) ? film["Technique"].join(", ") : film["Technique"]}</p>
        //     <p>Pays : ${Array.isArray(film["Pays"]) ? film["Pays"].join(", ") : film["Pays"]}</p>
        //     <p>Public visé : ${Array.isArray(film["Public visé"]) ? film["Public visé"].join(", ") : film["Public visé"]}</p>
        //   `;

        //         // Ajouter l'élément du film à la div des films
        //         filmsDiv.appendChild(filmElement);
        //     });
    })
    .catch(error => console.error('Erreur lors du chargement du fichier JSON :', error));

// Couleur du svg
let svg = d3.select("svg")

svg.style("background-color","grey")

// Graduation de l'échelle des y 
const yScale = d3
  .scaleLinear()
  .domain([0, 10]) 
  .range([0, -470]);  

d3.select("#graph")
    .append("g")
    .call(d3.axisLeft(yScale).ticks(10))
    .style("stroke-width", 6)
    .append("text")
    .text("IMDB rating")
    .attr("fill", "white")
    .style("text-anchor", "start")
    .attr("x", -45)
    .attr("y", -480)
    









