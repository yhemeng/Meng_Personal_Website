(function(){
const gameData = [
  { category: "Action", count: 550 },
  { category: "Adventure", count: 420 },
  { category: "Puzzle", count: 680 },
  { category: "Strategy", count: 350 },
  { category: "Simulation", count: 280 },
  { category: "RPG", count: 480 },
  { category: "Sports", count: 220 },
  { category: "Racing", count: 390 },
  { category: "Casual", count: 720 },
  { category: "Board", count: 150 },
  { category: "Card", count: 250 },
  { category: "Music", count: 180 },
  { category: "Educational", count: 300 },
  { category: "Other", count: 100 }
  ];
 

  const width = 450;
  const height = 200;
  const gridSize = 100; // Size of each grid cell
  const numCols = Math.floor(width / gridSize);
 

  const svg = d3.select("#vis-grid")
  .append("svg")
  .attr("width", width)
  .attr("height", height);
 

  const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");
 

  // Sort data by count in descending order (for visual appeal)
  gameData.sort((a, b) => b.count - a.count);
 

  // Calculate grid positions
  const gridData = [];
  let row = 0;
  let col = 0;
  gameData.forEach((d, i) => {
  gridData.push({
  category: d.category,
  count: d.count,
  x: col * gridSize,
  y: row * gridSize,
  width: gridSize,
  height: gridSize
  });
 

  col++;
  if (col >= numCols) {
  col = 0;
  row++;
  }
  });
 

  // Color scale (you can customize this)
  const colorScale = d3.scaleSequential(d3.interpolateViridis)
  .domain([0, d3.max(gameData, d => d.count)]);
 

  // Shape scale (maps count to different shapes)
  const shapeScale = d3.scaleQuantize()
  .domain([d3.min(gameData, d => d.count), d3.max(gameData, d => d.count)])
  .range(["circle", "square", "triangle", "diamond", "cross"]);
 

  // Create symbols for different shapes
  const symbol = d3.symbol()
  .size(gridSize * gridSize / 4); // Adjust symbol size as needed
 

  // Create grid cells
  const cells = svg.selectAll(".grid-cell")
  .data(gridData)
  .enter().append("rect")
  .attr("class", "grid-cell")
  .attr("x", d => d.x)
  .attr("y", d => d.y)
  .attr("width", d => d.width)
  .attr("height", d => d.height)
  .attr("fill", d => colorScale(d.count))
  .on("mouseover", function(event, d) {
  tooltip.transition()
  .duration(200)
  .style("opacity", .9)
  .style("display", "block");
  tooltip.html(`<strong>${d.category}</strong><br/>Games: ${d.count}`)
  .style("left", (event.pageX + 10) + "px")
  .style("top", (event.pageY - 28) + "px");
  d3.select(this) // Highlight the cell on hover
  .style("stroke", "yellow")
  .style("stroke-width", 3);
  })
  .on("mouseout", function(event, d) {
  tooltip.transition()
  .duration(500)
  .style("opacity", 0)
  .on("end", function() {
  d3.select(this).style("display", "none");
  });
  d3.select(this) // Remove highlight on mouseout
  .style("stroke", "#fff")
  .style("stroke-width", 1);
  });
 

  // Add labels to the cells (optional)
  svg.selectAll(".category-label")
  .data(gridData)
  .enter().append("text")
  .attr("class", "category-label")
  .attr("x", d => d.x + d.width / 2)
  .attr("y", d => d.y + d.height / 2)
  .text(d => d.category)
  .attr("fill", "white"); // Adjust text color as needed
 

  // Add symbols to the cells (alternative visualization)
  svg.selectAll(".grid-symbol")
  .data(gridData)
  .enter().append("path")
  .attr("class", "grid-symbol")
  .attr("d", d => {
  const shapeType = shapeScale(d.count);
  switch (shapeType) {
  case "circle":
  symbol.type(d3.symbolCircle);
  break;
  case "square":
  symbol.type(d3.symbolSquare);
  break;
  case "triangle":
  symbol.type(d3.symbolTriangle);
  break;
  case "diamond":
  symbol.type(d3.symbolDiamond);
  break;
  case "cross":
  symbol.type(d3.symbolCross);
  break;
  default:
  symbol.type(d3.symbolCircle);
  }
  return symbol();
  })
  .attr("transform", d => `translate(${d.x + d.width / 2}, ${d.y + d.height / 2})`)
  .attr("fill", "white") // Adjust symbol color
  .attr("opacity", 0.7) // Make symbols slightly transparent
  .on("mouseover", function(event, d) {  // Add hover effects to symbols
  tooltip.transition()
  .duration(200)
  .style("opacity", .9)
  .style("display", "block");
  tooltip.html(`<strong>${d.category}</strong><br/>Games: ${d.count}`)
  .style("left", (event.pageX + 10) + "px")
  .style("top", (event.pageY - 28) + "px");
  })
  .on("mouseout", function(event, d) {
  tooltip.transition()
  .duration(500)
  .style("opacity", 0)
  .on("end", function() {
  d3.select(this).style("display", "none");
  });
  });



})();