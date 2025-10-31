(function(){
    const data = {
            "nodes": [
                { "id": "Wake Up", "group": 1, "shape": "circle" },
                { "id": "Push-ups", "group": 2, "value": 1000, "shape": "rect" },
                { "id": "Running", "group": 2, "value": "10km", "shape": "triangle" },
                { "id": "Open 4399", "group": 3, "shape": "circle" },
                { "id": "Choose Game", "group": 3, "shape": "diamond" },
                { "id": "Play Game", "group": 3, "value": "18 hours", "shape": "star" },
                { "id": "Game A", "group": 4, "shape": "circle" },
                { "id": "Game B", "group": 4, "shape": "circle" },
                { "id": "Game C", "group": 4, "shape": "circle" },
                { "id": "Social Interaction", "group": 5, "shape": "rect" },
                { "id": "Forum Posting", "group": 5, "shape": "diamond" },
                { "id": "Sleep", "group": 1, "shape": "circle" }
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
        const width = 800;
        const height = 600;

        // Create SVG container
        const svg = d3.select("#vis-node").append("svg")
            .attr("width", width)
            .attr("height", height);

        // Color scale
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // Shape definitions
        const shapes = {
            "circle": d3.symbol().type(d3.symbolCircle).size(100),
            "rect": d3.symbol().type(d3.symbolSquare).size(150),
            "triangle": d3.symbol().type(d3.symbolTriangle).size(200),
            "diamond": d3.symbol().type(d3.symbolDiamond).size(150),
            "star": d3.symbol().type(d3.symbolStar).size(200)
        };

        // Create a force simulation
        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.links).id(d => d.id).distance(80)) // Adjust distance as needed
            .force("charge", d3.forceManyBody().strength(-150)) // Adjust strength as needed
            .force("center", d3.forceCenter(width / 2, height / 2))
            .on("tick", ticked);

        // Create links
        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter().append("line")
            .attr("class", "link")
            .attr("stroke-width", d => Math.sqrt(d.value));

        // Create nodes
        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("path") // Use path for custom shapes
            .data(data.nodes)
            .enter().append("path")
            .attr("class", "node")
            .attr("d", d => shapes[d.shape]()) // Use the shape based on the data
            .attr("fill", d => color(d.group))
            .attr("stroke", "white")
            .attr("stroke-width", 1.5)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // Create labels
        const labels = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(data.nodes)
            .enter().append("text")
            .attr("class", "label")
            .text(d => d.id)
            .attr("x", 12)
            .attr("y", 4);

        // Add tooltips (optional)
        node.append("title")
            .text(d => d.id + (d.value ? ": " + d.value : ""));

        function ticked() {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("transform", d => `translate(${d.x},${d.y})`); // Transform the path

            labels
                .attr("x", d => d.x + 12)
                .attr("y", d => d.y + 4);
        }

        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        })();