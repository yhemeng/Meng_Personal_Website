
(function(){
const originalData = {
                "name": "Work Experience",
                "children": [
                    {
                        "name": "Early Career",
                        "children": [
                            {
                                "name": "4399",
                                "attributes": {
                                    "Role": "Game Designer",
                                    "Duration": "5 Years",
                                    "Followers": "100,000+"
                                },
                                "children": [
                                    { "name": "Project A" },
                                    { "name": "Project B" },
                                    { "name": "Project C" }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "Mid Career",
                        "children": [
                            {
                                "name": "Bilibili",
                                "attributes": {
                                    "Role": "Influencer",
                                    "Certification": "Super Cool",
                                    "Content Focus": "Gaming"
                                },
                                "children": [
                                    { "name": "Community Engagement" },
                                    { "name": "Collaborations" }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "Later Career",
                        "children": [
                            {
                                "name": "Freelance/Consulting",
                                "children": [
                                    { "name": "Web Development Projects" },
                                    { "name": "UI/UX Design" },
                                    { "name": "D3.js Visualizations" },
                                    { "name": "Client A" },
                                    { "name": "Client B" }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "Skills Developed",
                        "children": [
                            { "name": "Game Design" },
                            { "name": "Community Management" },
                            { "name": "Content Creation" },
                            { "name": "Web Development" },
                            { "name": "Data Visualization" },
                            { "name": "UI/UX Design" }
                        ]
                    }
                ]
            };

            // Set the dimensions and margins of the diagram
            const margin = { top: 20, right: 90, bottom: 30, left: 90 },
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            const svg = d3.select("#vis-treemap").append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate("
                    + margin.left + "," + margin.top + ")");

            let i = 0;
            const duration = 750;
            let animationInterval; // Variable to hold the animation interval

            // declares a tree layout and assigns the size
            const treemap = d3.tree().size([height, width]);

            // Define a color scale
            const color = d3.scaleOrdinal()
                .domain(["Early Career", "Mid Career", "Later Career", "Skills Developed"])
                .range(["#0bb881ff", "#fc8d62", "#8da0cb", "#e78ac3"]);

            let root = d3.hierarchy(originalData, function(d) { return d.children; });
            root.x0 = height / 2;
            root.y0 = 0;

            // Collapse after the second level
            root.children.forEach(collapse);

            update(root);

            function collapse(d) {
                if (d.children) {
                    d._children = d.children
                    d._children.forEach(collapse)
                    d.children = null
                }
            }

            function update(source) {
                // Assigns the x and y position for the nodes
                const treeData = treemap(root);

                // Compute the new tree layout.
                const nodes = treeData.descendants(),
                    links = treeData.descendants().slice(1);

                // Normalize for fixed-depth.  Introduce some randomness here.
                nodes.forEach(function(d) {
                    d.y = d.depth * (100 + Math.random() * 50); // Random Y position
                    d.x += (Math.random() - 0.5) * 50;  // Random X offset
                });

                // ****************** Nodes section ***************************

                // Update the nodes...
                const node = svg.selectAll('g.node')
                    .data(nodes, function(d) { return d.id || (d.id = ++i); });

                // Enter any new modes at the parent's previous position.
                const nodeEnter = node.enter().append('g')
                    .attr('class', 'node')
                    .attr("transform", function(d) {
                        return "translate(" + source.y0 + "," + source.x0 + ")";
                    })
                    .on('click', click);

                // Add Circle for the nodes
                nodeEnter.append('circle')
                    .attr('class', 'node')
                    .attr('r', function() { return 5 + Math.random() * 10; }) // Random radius
                    .style("fill", function(d) {
                        if (d.children || d._children) {
                            return color(d.data.name);
                        } else {
                            return "#fff";
                        }
                    })
                    .style("stroke", function(d) {
                        return color(d.data.name);
                    });

                // Add labels for the nodes
                nodeEnter.append('text')
                    .attr("dy", ".35em")
                    .attr("x", function(d) {
                        return d.children || d._children ? -13 : 13;
                    })
                    .attr("text-anchor", function(d) {
                        return d.children || d._children ? "end" : "start";
                    })
                    .text(function(d) { return d.data.name; })
                    .style("font", "sans-serif")
                    .style("font-size", "12px");

                // UPDATE
                const nodeUpdate = nodeEnter.merge(node);

                // Transition to the proper position for the node
                nodeUpdate.transition()
                    .duration(duration)
                    .attr("transform", function(d) {
                        return "translate(" + d.y + "," + d.x + ")";
                    });

                // Update the node attributes and style
                nodeUpdate.select('circle.node')
                    .attr('cursor', 'pointer')
                    .style("fill", function(d) { // Random fill color
                        return d.children || d._children ? color(d.data.name) : getRandomColor();
                    });

                nodeUpdate.select('text')
                    .style("fill", function(d) { // Random text color
                        return getRandomColor();
                    });

                // Remove any exiting nodes
                const nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr("transform", function(d) {
                        return "translate(" + source.y + "," + source.x + ")";
                    })
                    .remove();

                // On exit reduce the node circles size to 0
                nodeExit.select('circle')
                    .attr('r', 1e-6);

                // On exit reduce the opacity of text labels
                nodeExit.select('text')
                    .style('fill-opacity', 1e-6);

                // ****************** links section ***************************

                // Update the links...
                const link = svg.selectAll('path.link')
                    .data(links, function(d) { return d.id; });

                // Enter any new links at the parent's previous position.
                const linkEnter = link.enter().insert('path', "g")
                    .attr("class", "link")
                    .style("stroke", "#ccc")
                    .attr('d', function(d) {
                        const o = { x: source.x0, y: source.y0 }
                        return diagonal(o, o)
                    });

                // UPDATE
                const linkUpdate = linkEnter.merge(link);

                // Transition back to the parent element position
                linkUpdate.transition()
                    .duration(duration)
                    .attr('d', function(d) { return diagonal(d, d.parent) })
                    .style("stroke", function() { // Random link color
                        return getRandomColor();
                    });

                // Remove any exiting links
                const linkExit = link.exit().transition()
                    .duration(duration)
                    .attr('d', function(d) {
                        const o = { x: source.x, y: source.y }
                        return diagonal(o, o)
                    })
                    .remove();

                // Store the old positions for transition.
                nodes.forEach(function(d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });

                // Creates a curved (diagonal) path from parent to the child nodes
                function diagonal(s, d) {
                    path = `M ${s.y} ${s.x}
                            C ${(s.y + d.y) / 2 + (Math.random() - 0.5) * 50} ${s.x + (Math.random() - 0.5) * 50},
                              ${(s.y + d.y) / 2 + (Math.random() - 0.5) * 50} ${d.x + (Math.random() - 0.5) * 50},
                              ${d.y} ${d.x}`
                    return path;
                }

                function click(event, d) {
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {
                        d.children = d._children;
                        d._children = null;
                    }
                    update(d);
                }
            }

            function getRandomColor() {
                const letters = '0123456789ABCDEF';
                let color = '#';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }

            function rearrangeAndAnimate() {
                update(root); // Just update the existing tree
            }

            function startAnimation() {
                if (!animationInterval) {
                    animationInterval = d3.interval(rearrangeAndAnimate, 1000);
                }
            }

            function stopAnimation() {
                if (animationInterval) {
                    animationInterval.stop();
                    animationInterval = null;
                }
            }

            // Chat box functionality
            const chatBoxHeader = document.getElementById("chat-box-header");
            const chatBoxBody = document.getElementById("chat-box-body");
            const animateButton = document.getElementById("animate-button");
            const fixedButton = document.getElementById("fixed-button");

            chatBoxHeader.addEventListener("click", () => {
                chatBoxBody.style.display = chatBoxBody.style.display === "none" ? "block" : "none";
            });

            animateButton.addEventListener("click", () => {
                startAnimation();
            });

            fixedButton.addEventListener("click", () => {
                stopAnimation();
            });

            // Initially, start the animation
            startAnimation();

        })();

   
