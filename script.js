// Charger le fichier JSON
fetch('./FilmData.json')
    .then(response => response.json())
    .then(filmdata => {
        let filmPrime = filmdata.filter(film => film.Primé === 1);

        // Collecte des années pour les utiliser dans l'axe des abscisses

        const annees = filmPrime.map(film => film.AnnéeNomination);


        const couleurParPays = {};

        // Création d'un tableau de couleurs
        const couleurs = [
            "#477050", "#0F2CC6", "#FFFFFF", "#080C77", "#FF0716",
            "#7A87FF", "#FDDA25", "#CD2E3A", "#520609", "#00F0FF",
            "#021332", "#EAA4A4", "#009B3A", "#FF5555", "#806F6F", "#3BFF0A"
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
        d3.select("#graph")
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
        const xAxis = svg.append("g")
            .call(d3.axisBottom(xScale))
            .style("stroke-width", 2);

        // Stylisation des années sur l'axe x
        xAxis.selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .data(annees)
            .append("text")
            .attr("x", d => xScale(d) + xScale.bandwidth() / 2)
            .attr("y", 10)

            .text(d => d);

        // Ajout d'un titre à l'axe x
        svg.append("text")
            .text("Année")
            .attr("fill", "white")
            .attr("x", 905)
            .attr("y", 20);


        // Ajout des barres
        let barres = svg
            .selectAll("rect")
            .data(filmPrime);


        barres.enter()
            .append("rect")
            .attr("class", "barre")
            .attr("x", film => xScale(film.AnnéeNomination))
            .attr("y", film => yScale(film.NoteIMDB))
            .attr("width", xScale.bandwidth())
            .attr("height", film => -yScale(film.NoteIMDB))
            .attr("fill", film => couleurParPays[film.Pays])
            .style("cursor", "pointer");

        // Créez un tableau d'objets contenant le nom du pays et la couleur qui lui est attribuée
        const legendData = Object.entries(couleurParPays);

        /// Créez un élément pour la légende
        const legend = d3.select("#legende");

        // Ajout la légende
        const legendItems = legend
            .selectAll(".legend-item")
            .data(legendData)
            .enter()
            .append("div")
            .style("cursor", "pointer")
            .attr("class", "legend-item")
            .style("white-space", "normal");

        legendItems
            .append("div")
            .attr("class", "legend-label")
            .text(d => d[0])
            .style("font-weight", "600")
            .style("font-size", "1.2rem")
            .style("padding-right", "2px");

        legendItems
            .append("div")
            .attr("class", "legend-circle")
            .style("background-color", d => d[1]);

        // Ajout de l'effet de hover pour les barres et la légende
        d3.selectAll(".barre, .legend-item")
            .on("mouseenter", function (e, d) {
                let pays;

                if (this.classList.contains("barre")) {
                    pays = d.Pays;

                    // Réduit l'opacité de toutes les barres, sauf celle survolée (this)
                    d3.selectAll(".barre")
                        .filter(function () {
                            return this !== e.target;
                        })
                        .attr("opacity", 0.1);

                } else {
                    pays = d3.select(this).select(".legend-label").text();

                    // Changez l'opacité de toutes les barres, sauf celles coorespondant au pays selectionné dans la légende
                    d3.selectAll(".barre")
                        .filter(film => film.Pays !== pays)
                        .attr("opacity", 0.1);
                }

                // Changez également l'opacité des éléments de légende en fonction du pays
                d3.selectAll(".legend-item")
                    .filter(item => item[0] !== pays)
                    .style("opacity", 0.2);
            })
            .on("mouseleave", function () {
                // Rétablissez la couleur d'origine pour toutes les barres
                d3.selectAll(".barre")
                    .attr("opacity", 1);

                // Rétablissez l'opacité d'origine pour tous les éléments de légende
                d3.selectAll(".legend-item")
                    .style("opacity", 1);
            });
    })

    .catch(error => console.error('Erreur lors du chargement du fichier JSON :', error));