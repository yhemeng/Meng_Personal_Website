// Sample data (replace with your actual data)
        const data = [
            { year: 2018, type: "Writing", count: 5 },
            { year: 2018, type: "Music", count: 2 },
            { year: 2019, type: "Writing", count: 8 },
            { year: 2019, type: "Visual Art", count: 3 },
            { year: 2019, type: "Music", count: 1 },
            { year: 2020, type: "Writing", count: 12 },
            { year: 2020, type: "Visual Art", count: 5 },
            { year: 2020, type: "Code", count: 2 },
            { year: 2021, type: "Writing", count: 7 },
            { year: 2021, type: "Code", count: 6 },
            { year: 2022, type: "Writing", count: 3 },
            { year: 2022, type: "Visual Art", count: 2 },
            { year: 2022, type: "Code", count: 9 },
            { year: 2023, type: "Writing", count: 10 },
            { year: 2023, type: "Visual Art", count: 7 },
            { year: 2023, type: "Code", count: 4 },
            { year: 2023, type: "Music", count: 3 },
            { year: 2024, type: "Writing", count: 6 },
            { year: 2024, type: "Code", count: 8 }
        ];

        // Dimensions and margins
        const margin = { top: 120, right: 30, bottom: 40, left: 150 },
            width = 800 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        // Append the SVG object to the section
        const svg = d3.select("#vis-scatterplot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Define scales
        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.year)) // Use extent to get min and max
            .range([0, width]);

        const y = d3.scaleBand()
            .domain([...new Set(data.map(d => d.type))]) // Get unique types
            .range([0, height])
            .padding(1); // Add padding for better visualization

        const z = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([4, 30]); // Adjust the range for dot size

        // Add X axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d"))); // Format ticks as integers
            // Add X axis label
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", width)
                .attr("y", height + margin.top + 20)
                .text("Year");

        // Add Y axis
        svg.append("g")
            .call(d3.axisLeft(y));

            // Add Y axis label
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", 0)
                .attr("y", -10)
                .text("Type of Work")
                .attr("text-anchor", "start");

        // Tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.year))
            .attr("cy", d => y(d.type) + y.bandwidth() / 2) // Center the circles in the band
            .attr("r", d => z(d.count))
            .style("fill", "#4dcaffff")
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("Year: " + d.year + "<br/>" + "Type: " + d.type + "<br/>" + "Count: " + d.count)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(event, d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
