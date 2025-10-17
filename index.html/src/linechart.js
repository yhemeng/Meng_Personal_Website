const data2 = [
            { year2: 2018, salary2: 60000, count2: 1 },
            { year2: 2019, salary2: 65000, count2: 2 },
            { year2: 2020, salary2: 70000, count2: 3 },
            { year2: 2021, salary2: 75000, count2: 2 },
            { year2: 2022, salary2: 80000, count2: 4 },
            { year2: 2023, salary2: 85000, count2: 5 },
            { year2: 2024, salary2: 90000, count2: 3 }
        ];

        // Dimensions and margins
        const margin2 = { top2: 30, right2: 30, bottom2: 40, left2: 150 },
            width2 = 800 - margin2.left2 - margin2.right2,
            height2 = 600 - margin2.top2 - margin2.bottom2;

        // Append the SVG object to the section
        const svg2 = d3.select("#vis-line-chart")
            .append("svg")
            .attr("width", width2 + margin2.left2 + margin2.right2)
            .attr("height", height2 + margin2.top2 + margin2.bottom2)
            .append("g")
            .attr("transform", `translate(${margin2.left2},${margin2.top2})`);

        // Define scales
        const x2 = d3.scaleLinear()
            .domain(d3.extent(data2, d => d.year2)) // Use extent to get min and max
            .range([0, width2]);

        const y2 = d3.scaleLinear()
            .domain([d3.min(data2, d => d.salary2), d3.max(data2, d => d.salary2)])
            .range([height2, 0]);

        const lineThickness2 = d3.scaleLinear()
            .domain([0, d3.max(data2, d => d.count2)])
            .range([1, 5]); // Adjust the range for line thickness

        // Define the line
        const line2 = d3.line()
            .x(d => x2(d.year2))
            .y(d => y2(d.salary2));

        // Add X axis
        svg2.append("g")
            .attr("transform", `translate(0,${height2})`)
            .call(d3.axisBottom(x2).ticks(5).tickFormat(d3.format("d")));

        // Add Y axis
        svg2.append("g")
            .call(d3.axisLeft(y2));

        // Add the line
        svg2.append("path")
            .datum(data2)
            .attr("class", "line2")
            .attr("d", line2)
            .style("stroke-width", d => lineThickness2(d[0].count2)); // Initial line thickness based on the first data point's count

        // Add dots and tooltips (optional, but often helpful)
        svg2.selectAll(".dot2")
            .data(data2)
            .enter().append("circle")
            .attr("class", "dot2")
            .attr("cx", d => x2(d.year2))
            .attr("cy", d => y2(d.salary2))
            .attr("r", 5) // Adjust dot size as needed
            .style("fill", "steelblue")
            .on("mouseover", function(event, d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr("r", 7); // Enlarge dot on hover

                tooltip2.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip2.html("Year: " + d.year2 + "<br/>Salary: " + d.salary2 + "<br/>Count: " + d.count2)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");

                // Change line thickness on hover
                d3.select(".line2")
                    .transition()
                    .duration(200)
                    .style("stroke-width", lineThickness2(d.count2));
            })
            .on("mouseout", function(event, d) {
                d3.select(this).transition()
                    .duration(500)
                    .attr("r", 5); // Restore original dot size

                tooltip2.transition()
                    .duration(500)
                    .style("opacity", 0);

                // Restore original line thickness on mouseout
                d3.select(".line2")
                    .transition()
                    .duration(500)
                    .style("stroke-width", lineThickness2(data2[0].count2));
            });
