// Charger le fichier JSON
fetch('./FilmData.json')
    .then(response => response.json())
    .then(filmdata => {
        // Collecte des années pour les utiliser dans l'axe des abscisses
        let filmPrime = filmdata.filter(p =>
            p.Primé == 1)
        console.log(filmPrime);

        // Collecte des années pour les utiliser dans l'axe des abscisses
        const annees = filmPrime.map(film => film.AnnéeNomination)
        console.log(annees);

        // Collecte des notes IMDB pour les utiliser dans l'axe des ordonnées 
        const NoteIMDB = filmPrime.map(film => 
        film.NoteIMDB)
        console.log(NoteIMDB);

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

        // Ajout de l'axe y
        d3.select("#graph")
        svg.append("g")
            .call(d3.axisLeft(yScale).ticks(10))
            .style("stroke-width", 2);

        // Ajout d'un titre à l'axe y
        svg.append("text")
            .text("IMDB rating")
            .attr("fill", "white")
            .attr("x", -45)
            .attr("y", -480);

        // Ajout de l'axe X
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
            .data(filmPrime)

        barres.enter()
            .append("rect")
            .attr("x", film => xScale(film.AnnéeNomination))
            .attr("y", film => yScale(film.NoteIMDB))
            .attr("width", xScale.bandwidth())
            .attr("height", film => -yScale(film.NoteIMDB))
            .attr("fill","lightpink")
        

    })
    .catch(error => console.error('Erreur lors du chargement du fichier JSON :', error));
