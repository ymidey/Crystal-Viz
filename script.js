// Charger le fichier JSON
fetch('./data.json')
    .then(response => response.json())
    .then(filmdata => {
        // Collecte des années pour les utiliser dans l'axe des abscisses
        const annees = filmdata.map(movie => movie.Année);
        const anneesReverse = annees.reverse();
        console.log(anneesReverse);

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
            .domain(anneesReverse)
            .range([0, 900])
            .padding(0.1);

        // Ajout de l'axe y
        d3.select("#graph")
        svg.append("g")
            .call(d3.axisLeft(yScale).ticks(10))
            .style("stroke-width", 2);

        // Ajout de l'axe X
        const xAxis = svg.append("g")
            .call(d3.axisBottom(xScale))
            .style("stroke-width", 2);

        // Stylisation des années sur l'axe x
        xAxis.selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .data(anneesReverse)
            .append("text")
            .attr("x", d => xScale(d) + xScale.bandwidth() / 2)
            .attr("y", 10) // Ajustez la position verticale selon vos besoins
            .text(d => d);

        // Ajout d'un titre à l'axe y
        svg.append("text")
            .text("IMDB rating")
            .attr("fill", "white")
            .attr("x", -45)
            .attr("y", -480);
    })
    .catch(error => console.error('Erreur lors du chargement du fichier JSON :', error));
