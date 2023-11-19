var scrollDownSpan = document.getElementById('scroll-down');

// span permettant au clic sur celui-ci de scroller la page de l'utilisateur vers la div ayant l'id svg-container
scrollDownSpan.addEventListener('click', function () {
    var mainSection = document.getElementById('svg-container');

    mainSection.scrollIntoView({ behavior: 'smooth' });
});

// Chargement du fichier JSON
fetch('./FilmData.json')
    .then(response => response.json())
    .then(filmdata => {
        let filmPrime = filmdata.filter(film => film.Primé === 1);

        // Collecte des années pour les utiliser dans l'axe des abscisses
        const annees = filmPrime.map(film => film.AnnéeNomination);

        const couleurParPays = {};

        // Création d'un tableau de couleurs
        const couleurs = [
            "#B5E8E2", "#CEA4E4", "#C2D0F5", "#7A87FF", "#AB5869",
            "#7AADD1", "#FFBDC3", "#E46381",
            "#B75FE5", "#F0CD96", "#ABE3AB", "#E2847D"
        ];

        // Parcours les films pour associer chaque pays à une couleur
        filmPrime.forEach(film => {
            if (!couleurParPays[film.Pays]) {
                couleurParPays[film.Pays] = couleurs[Object.keys(couleurParPays).length];
            }
        });

        // Selection du svg
        let svg = d3.select("svg");

        // Graduation de l'échelle des y
        const yScale = d3
            .scaleLinear()
            .domain([0, 10])
            .range([0, -470]);

        // Graduation de l'échelle des x
        const xScale = d3
            .scaleBand()
            .domain(annees)
            .range([0, 900])
            .padding(0.1);


        // Ajout de la graduation sur l'axe y sur le graph
        svg.append("g")
            .call(d3.axisLeft(yScale).ticks(50))
            .style("stroke-width", 2)
            .call(g => g.selectAll(".tick text")
                .text((d, i) => i % 5 === 0 ? d : ""));

        // Ajout d'un titre à l'axe y
        svg.append("text")
            .text("Note IMDB")
            .attr("fill", "white")
            .attr("x", -45)
            .attr("y", -480);

        // Ajout de la graduation sur l'axe X sur le graph
        svg.append("g")
            .call(d3.axisBottom(xScale))
            .style("stroke-width", 2)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .data(annees)
            .append("text")
            .attr("x", d => xScale(d) + xScale.bandwidth() / 2)
            .attr("y", 10)
            .text(d => d);

        // Affichage des 4 premiers caractères de chaque année pour pouvoir afficher 2 fois l'année 2009
        d3.selectAll(".tick text").text(function(){
            return d3.select(this).text().substring(0,4)
        });


        // Ajout d'un titre à l'axe x
        svg.append("text")
            .text("Année")
            .attr("fill", "white")
            .attr("x", 905)
            .attr("y", 20);

        // Création des barres
        let barres = svg
            .selectAll("rect")
            .data(filmPrime);

        // Ajout des carrés des différentes barres
        let carres = svg
            .selectAll(".carre")
            .data(filmPrime);

        // Variable pour compter le nombre de barres de mon graphique
        let barresAnimeesCount = 0;

        // Ajout des barres avec un délai entre chaque ajout
        barres.enter()
            .append("rect")
            .attr("class", "barre")
            .attr("title", film => `Année ${film.AnnéeNomination} film primé ${film.Titre} Pays d'origine ${film.Pays}`)
            .attr("tabindex", (film, index) => index + 1)
            .attr("x", film => xScale(film.AnnéeNomination))
            .attr("width", xScale.bandwidth())
            .attr("fill", film => couleurParPays[film.Pays])
            .style("cursor", "pointer")
            .attr("id", (film, index) => index + 1)
            .attr("height", 0) // Commence avec une hauteur de 0
            .attr("y", yScale(0))
            .each(function (film, index) {
                // Ajout de la transition avec délai
                d3.select(this)
                    .transition()
                    .delay(index * 100) // Délai entre chaque rectangle 
                    .duration(950) // Durée de la transition
                    .attr("height", film => -yScale(film.NoteIMDB))
                    .attr("y", film => yScale(film.NoteIMDB))
                    .on("end", function () {

                        barresAnimeesCount++;

                        // On vérifie si toutes les barres ont terminées leur animation
                        if ((barresAnimeesCount / 3) == filmPrime.length) {
                            // Si toutes les barres ont terminées leur animation, on appelle la fonction permettant de jouer l'effet de Hover
                            activerEffetHover();
                        }
                    });
            });

        // Ajout des carrés avec un délai entre chaque ajout
        carres.enter()
            .append("rect")
            .attr("fill", "none")
            .attr("class", "carre")
            .attr("stroke", film => couleurParPays[film.Pays])
            .attr("stroke-width", 2)
            .attr("x", film => xScale(film.AnnéeNomination))
            .attr("y", yScale(0))
            .attr("id", (film, index) => index + 1)
            .attr("height", 0)
            .attr("tabindex", -1)
            .attr("width", 25)
            .style("cursor", "pointer")
            .each(function (film, index) {
                // Ajout de la transition avec délai
                d3.select(this)
                    .transition()
                    .delay(index * 100) // Délai entre chaque rectangle 
                    .duration(950) // Durée de la transition
                    .attr("height", 25)
                    .attr("y", film => yScale(film.NoteIMDB))
                    .on("end", function () {

                        barresAnimeesCount++;

                        // Vérification si toutes les barres ont terminées leur animation
                        if ((barresAnimeesCount / 3) == filmPrime.length) {
                            // Si toutes les barres ont terminées leur animation, on appelle la fonction permettant de jouer l'effet de Hover
                            activerEffetHover();
                        }
                    });

            });

        // Ajout des images avec un délai entre chaque ajout
        carres.enter()
            .append("image")
            .attr("class", "image")
            .attr("href", film => film.URLimage)
            .attr("x", film => xScale(film.AnnéeNomination))
            .attr("y", yScale(0))
            .attr("stroke", film => couleurParPays[film.Pays])
            .attr("stroke-width", 2)
            .attr("tabindex", -1)
            .style("opacity", 0)
            .attr("id", (film, index) => index + 1)
            .attr("height", "25")
            .attr("width", "25")
            .attr("cursor", "pointer")
            .each(function (film, index) {
                // Ajout de la transition avec délai
                d3.select(this)
                    .transition()
                    .delay(index * 100) // Délai entre chaque rectangle 
                    .duration(950) // Durée de la transition
                    .attr("height", 25)
                    .style("opacity", 1)
                    .attr("y", film => yScale(film.NoteIMDB))
                    .on("end", function () {

                        barresAnimeesCount++;
                        // On vérifie si toutes les barres ont terminées leur animation
                        if ((barresAnimeesCount / 3) == filmPrime.length) {
                            // Si toutes les barres ont terminées leur animation, on appelle la fonction permettant de jouer l'effet de Hover
                            activerEffetHover();
                        }
                    });
            });

        // Ajout d'un encadré affichant les détails du film au survol d'une barre
        const encadre = d3
            .select(".main")
            .append("div")
            .attr("class", "hoverMovie")

        // Création d'un tableau d'objets contenant le nom du pays et la couleur qui lui est attribuée
        const legendData = Object.entries(couleurParPays);

        // Ajout de la légende
        d3.select("#legende")
            .selectAll(".legend-item")
            .data(legendData)
            .enter()
            .append("div")
            .attr("class", "legend-item")
            .attr("id", legendData => legendData[0])
            .style("cursor", "pointer")
            .style("white-space", "normal")
            .style("opacity", 1)
            .call(legendItem => {
                legendItem.append("p")
                    .attr("class", "legend-label")
                    .text(d => d[0])
                    .style("font-weight", "600")
                    .style("font-size", "1.5rem")
                    .style("padding-right", "2px");

                legendItem.append("div")
                    .attr("class", "legend-circle")
                    .style("background-color", d => d[1]);
            });

        // Fonction pour activer l'effet de hover
        function activerEffetHover() {
            // Ajout de l'effet de hover pour les barres et la légende
            d3.selectAll(".barre, .legend-item, .carre, .image")
                .on("mouseenter", function (e, d) {
                    let pays;
                    let anneeNomination;
                    pays = d.Pays;

                    // On vérifie si l'utilisateur passe sa souris sur une barre, sur l'image, sur la barre, ou sur le carré qui entoure l'image
                    if (this.classList.contains("barre") || this.classList.contains("carre") || this.classList.contains("image")) {

                        anneeNomination = d.AnnéeNomination;
                        encadre.transition()
                            .style("display", "block")
                            .style("visibility", "visible")
                        encadre.html(`<p><span id ="annee-nomination">Film primé en ${d.AnnéeNomination}</span><br><img src="${d.URLimage}"><br>${d.Titre}<br>Pays : ${d.Pays}<br>Note IMDB : ${d.NoteIMDB}/10</p>`)
                            .style("left", (e.pageX + 10) + "px")
                            .style("top", (e.pageY - 50) + "px");

                        // Affichage des 18 premiers caractères du span #annee-nomination pour pouvoir afficher 2 fois l'année 2009
                        d3.selectAll("#annee-nomination").text(function(){
                            return d3.select(this).text().substring(0,18)
                        });

                        // Réduction de l'opacité de toutes les barres, sauf celle survolée
                        d3.selectAll(".barre, .carre, .image")
                            .filter(film => film.AnnéeNomination !== anneeNomination)
                            .transition()
                            .duration(200)
                            .style("opacity", 0.2);


                    } else {
                        pays = d3.select(this).select(".legend-label").text();

                        // Changement de l'opacité de toutes les barres, sauf celles correspondant au pays sélectionné dans la légende
                        d3.selectAll(".barre, .carre, .image")
                            .filter(film => film.Pays !== pays)
                            .transition()
                            .duration(200)
                            .style("opacity", 0.2);
                    }

                    // Changement également de l'opacité des éléments de légende en fonction du pays
                    d3.selectAll(".legend-item")
                        .filter(item => item[0] !== pays)
                        .transition()
                        .duration(200)
                        .style("opacity", 0.2);
                })

                .on("mouseleave", function () {
                    encadre.transition()
                        .style("visibility", "hidden")
                        .style("display", "none");
                    // Retour à l'opacité d'origine de toutes les barres/images et carrés
                    d3.selectAll(".barre,  .carre, .image, .legend-item")
                        .transition()
                        .duration(200)
                        .style("opacity", 1);
                });
        }

        // Fonction permettant d'afficher les informations sur le film primé et les films nominés de l'année selectionné
        function voirPlusDinformations(tabIndex) {

            d3.selectAll("#prime, #pays, #nominés, #primespays").remove();

            let d = filmPrime[tabIndex - 1];

            // Changer la visibilité de la div pour la rendre visible
            let detailMovieDiv = document.getElementById("detailMovie");
            detailMovieDiv.style.visibility = "visible";


            detailMovieDiv.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            let anneeSelectionnee = filmdata.filter(film =>
                film.AnnéeNomination == d.AnnéeNomination
            );


            d3.select(".date")
                .selectAll(".annee-cristal")
                .data(anneeSelectionnee)
                .enter()
                .filter(d => d.Primé == 1)
                .append("h2")
                .attr("id", "prime")
                .attr("class","titre-cristal")
                .attr("tabIndex", tabIndex)
                .html(d => `Cristal du long métrage année ${d.AnnéeNomination}`);
            
            // Affichage des 34 premiers caractères du titre de chaque cristal pour pouvoir afficher 2 fois l'année 2009
            d3.selectAll(".titre-cristal").text(function(){
                return d3.select(this).text().substring(0,34)
            });


            d3.select(".bande-annonce")
                .selectAll(".annonce-film")
                .data(anneeSelectionnee)
                .enter()
                .filter(d => d.Primé == 1)
                .append("div")
                .attr("id", "prime")
                .html(d => `<iframe src="${d.BandeAnnonce}" tabIndex=${tabIndex} width="640" height="360" allowfullscreen="true" sandbox="allow-scripts allow-same-origin allow-popups allow-presentation" title="Bande annonce du film ${d.Titre}"></iframe>`);

            d3.select(".film-container")
                .selectAll(".film-prime")
                .data(anneeSelectionnee)
                .enter()
                .filter(d => d.Primé == 1)
                .append("div")
                .attr("id", "prime")
                .style("display", "flex")
                .style("flex-direction", "row")
                .html(d => `<div><h3>Film primé</h3><br><p><span>Titre : ${d.Titre}</span><br>Réalisateur(s) : ${d.Réalisateurs}<br>Technique(s) de production : ${d.Techniques}<br>Note IMDB : ${d.NoteIMDB}/10<br><a href="https://www.imdb.com/title/${d.IdIMDB}/" target="_blank" tabindex="${tabIndex}">Page IMDB du film ${d.Titre}</a></p></div><div><p>${d.Pays}</p><img src="./images/flags/${d.Pays}.webp" witdh="80px" alt="" srcset=""></p></div>`);

            d3.select(".titre-nomines")
                .append("h2")
                .attr("id", "nominés")
                .html(`Films nominés`);

            d3.select(".detailNomines")
                .selectAll(".filmNomines")
                .data(anneeSelectionnee)
                .enter()
                .filter(d => d.Primé == 0)
                .append("div")
                .attr("id", "nominés")
                .html(d => `<p><span>Titre : ${d.Titre}</span><br>Pays : ${d.Pays}<br>Note IMDB : ${d.NoteIMDB}/10<br><a href="https://www.imdb.com/title/${d.IdIMDB}/" target="_blank"">Page IMDB du film ${d.Titre}</a></p>`);
        }

        // Ajout d'event focus pour que les éléments détaillés puissent être accessibles via la navigation au clavier
        svg.selectAll(".barre, .image, .carre").on("focus", function () {
            // On récupère l'index de la barre focuser
            let tabIndex = this.id;
            voirPlusDinformations(tabIndex);
        })


        // Fonction permettant d'afficher les informations sur le film primé et les films nominés de l'année selectionné
        function voirPlusFilmPays(paysChoisi) {
            d3.selectAll("#prime, #nominés, #pays, #primespays").remove();

            // Change la visibilité de la div pour la rendre visible
            let detailPaysDiv = document.getElementById("detailPays");
            detailPaysDiv.style.visibility = "visible";


            detailPaysDiv.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            // Sélectionne les films par pays 
            let paysSelectionne = filmPrime.filter(film =>
                film.Pays == paysChoisi
            );
            console.log(paysSelectionne);

            // Suppression de l'affichage de ces différents elements 

            d3.select(".nomPays")
                .append("h2")
                .attr("id", "pays")
                .attr("class","payschoisi")
                .html(`Liste de tous les Films primés provenant de ${paysChoisi}`);


            d3.select(".films-pays")
                .selectAll(".annonce-film")
                .data(paysSelectionne)
                .enter()
                .append("div")
                .attr("id", "pays")
                .html(d => `<h2 id="annee-cristal">Cristal du long métrage année ${d.AnnéeNomination}</h2><div class="pays-container"><div class="iframe"><iframe src="${d.BandeAnnonce}"  width="640" height="360" allowfullscreen="true" sandbox="allow-scripts allow-same-origin allow-popups allow-presentation" title="Bande annonce du film ${d.Titre}"></iframe></div><div class="infos-container"><br><p><span>Titre : ${d.Titre}</span><br>Réalisateur(s) : ${d.Réalisateurs}<br>Technique(s) de production : ${d.Techniques}<br>Note IMDB : ${d.NoteIMDB}/10<br><a href="https://www.imdb.com/title/${d.IdIMDB}/" target="_blank">Page IMDB du film ${d.Titre}</a></p></div></div>`);

            // Affichage des 34 premiers caractères du titre h2 #annee-cristal pour pouvoir afficher 2 fois l'année 2009
            d3.selectAll("#annee-cristal").text(function(){
                return d3.select(this).text().substring(0,34)
            });


            // d3.select(".bande-annonce1")
            //     .selectAll(".films-pays")
            //     .data(paysSelectionne)
            //     .enter()
            //     .append("div")
            //     .attr("id", "primespays")
            //     .style("display", "flex")
            //     .style("flex-direction", "row")
            //     .html(d => `<div><br><p><span>Titre : ${d.Titre}</span><br>Réalisateur(s) : ${d.Réalisateurs}<br>Technique(s) de production : ${d.Techniques}<br>Note IMDB : ${d.NoteIMDB}/10<br><a href="https://www.imdb.com/title/${d.IdIMDB}/" target="_blank">Page IMDB du film ${d.Titre}</a></p></div>`);

        }

      
        // Ajout d'event focus pour que les éléments détaillés puissent être accessibles via la navigation au clavier
        d3.selectAll(".legend-item").on("click", function () {
            let paysChoisi = this.id;
            voirPlusFilmPays(paysChoisi);
        })

    })