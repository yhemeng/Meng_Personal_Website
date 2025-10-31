 (function(){

 const data = {
            "nodes": [
                { "id": "Wake Up" },
                { "id": "Push-ups" },
                { "id": "Running" },
                { "id": "Open 4399" },
                { "id": "Choose Game" },
                { "id": "Play Game" },
                { "id": "Game A" },
                { "id": "Game B" },
                { "id": "Game C" },
                { "id": "Social Interaction" },
                { "id": "Forum Posting" },
                { "id": "Sleep" }
            ],
            "links": [
                { "source": "Wake Up", "target": "Push-ups", "value": 2 },
                { "source": "Wake Up", "target": "Running", "value": 2 },
                { "source": "Running", "target": "Open 4399", "value": 3 },
                { "source": "Push-ups", "target": "Open 4399", "value": 3 },
                { "source": "Open 4399", "target": "Choose Game", "value": 4 },
                { "source": "Choose Game", "target": "Play Game", "value": 5 },
                { "source": "Play Game", "target": "Game A", "value": 1 },
                { "source": "Play Game", "target": "Game B", "value": 1 },
                { "source": "Play Game", "target": "Game C", "value": 1 },
                { "source": "Play Game", "target": "Social Interaction", "value": 2 },
                { "source": "Social Interaction", "target": "Forum Posting", "value": 3 },
                { "source": "Forum Posting", "target": "Play Game", "value": 2 },
                { "source": "Play Game", "target": "Sleep", "value": 5 },
                { "source": "Sleep", "target": "Wake Up", "value": 3 }
            ]
        };

        // Set the dimensions and margins of the diagram
        const width = 700;
        const height = 700;
        const margin = { top: 20, right: 50, bottom: 20, left: 250 }; // Increased margins

        // Extract node IDs
        const nodes = data.nodes.map(d => d.id);
        const numNodes = nodes.length;

        // Create adjacency matrix
        const adjacencyMatrix = Array(numNodes).fill(null).map(() => Array(numNodes).fill(0));

        data.links.forEach(link => {
            const sourceIndex = nodes.indexOf(link.source);
            const targetIndex = nodes.indexOf(link.target);
            adjacencyMatrix[sourceIndex][targetIndex] = link.value;
        });

        // Create SVG container
        const svg = d3.select("#vis-matrix").append("svg")
            .attr("width", width)
            .attr("height", height);

        const matrixGroup = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Define scales
        const xScale = d3.scaleBand()
            .domain(nodes)
            .range([0, width - margin.left - margin.right]);

        const yScale = d3.scaleBand()
            .domain(nodes)
            .range([0, height - margin.top - margin.bottom]);

        // More varied color scale
        const colorScale = d3.scaleSequential()
            .domain([0, d3.max(data.links, d => d.value)])
            .interpolator(d3.interpolateRainbow); // Use a rainbow interpolator

        // Create rows
        const rows = matrixGroup.selectAll(".row")
            .data(adjacencyMatrix)
            .enter().append("g")
            .attr("class", "row")
            .attr("transform", (d, i) => `translate(0,${yScale(nodes[i])})`);

        // Create cells
        const cells = rows.selectAll(".cell")
            .data(d => d)
            .enter().append("rect")
            .attr("class", "matrix-cell")
            .attr("x", (d, i) => xScale(nodes[i]))
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .style("fill", d => colorScale(d))
            .style("stroke", "lightgray")
            .style("stroke-width", 0.5);

        // Row labels
        svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .selectAll(".row-label")
            .data(nodes)
            .enter().append("text")
            .attr("class", "row-label")
            .attr("x", -5)
            .attr("y", d => yScale(d) + yScale.bandwidth() / 2)
            .attr("dy", "0.32em")
            .attr("text-anchor", "end")
            .text(d => d)
            .attr("transform", `translate(-6,${yScale.bandwidth()/2})`); // Adjust position
            // .attr("transform", "rotate(-90)");

        // Column labels
        svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .selectAll(".col-label")
            .data(nodes)
            .enter().append("text")
            .attr("class", "col-label")
            .attr("x", d => xScale(d) + xScale.bandwidth() / 2)
            .attr("y", -5)
            .attr("dy", "0.32em")
            .attr("text-anchor", "start")
            .text(d => d)
            .attr("transform", d => `translate(${xScale(d) + xScale.bandwidth()/2},-6) rotate(-90)`);

        // Tooltips (optional)
        cells.append("title")
            .text((d, i) => {
                const rowIndex = Math.floor(i / numNodes);
                const colIndex = i % numNodes;
                return `Source: ${nodes[rowIndex]}, Target: ${nodes[colIndex]}, Value: ${d}`;
            });

            })();