 (function(){
  const places = [
  { name: "New York City", latitude: 40.7128, longitude: -74.0060, category: "City", description: "Visited Times Square" },
  { name: "Los Angeles", latitude: 34.0522, longitude: -118.2437, category: "City", description: "Walked the Hollywood Walk of Fame" },
  { name: "London", latitude: 51.5074, longitude: 0.1278, category: "City", description: "Saw the Tower of London" },
  { name: "Paris", latitude: 48.8566, longitude: 2.3522, category: "City", description: "Climbed the Eiffel Tower" },
  { name: "Tokyo", latitude: 35.6895, longitude: 139.6917, category: "City", description: "Visited the Tsukiji Fish Market" },
  { name: "Grand Canyon", latitude: 36.0544, longitude: -112.1401, category: "Nature", description: "Hiked along the South Rim" },
  { name: "Yosemite", latitude: 37.8651, longitude: -119.5383, category: "Nature", description: "Saw the giant sequoias" },
  { name: "Kyoto", latitude: 35.0116, longitude: 135.7681, category: "Culture", description: "Visited the Fushimi Inari Shrine" },
  { name: "Rome", latitude: 41.9028, longitude: 12.4964, category: "Culture", description: "Explored the Colosseum" },
  { name: "Sydney", latitude: -33.8688, longitude: 151.2093, category: "City", description: "Visited the Sydney Opera House" },
  { name: "Great Barrier Reef", latitude: -19.0000, longitude: 148.0000, category: "Nature", description: "Went snorkeling" },
  { name: "Machu Picchu", latitude: -13.1631, longitude: -72.5450, category: "Culture", description: "Explored the ancient ruins" },
  { name: "Cairo", latitude: 30.0444, longitude: 31.2357, category: "City", description: "Visited the pyramids of Giza" },
  { name: "Cape Town", latitude: -33.9249, longitude: 18.4241, category: "City", description: "Climbed Table Mountain" },
  { name: "Mount Everest Base Camp", latitude: 28.0000, longitude: 86.8670, category: "Nature", description: "Trek to Everest Base Camp" },
  { name: "Banff National Park", latitude: 51.4968, longitude: -115.9281, category: "Nature", description: "Hiked around Lake Louise" },
  { name: "Rio de Janeiro", latitude: -22.9068, longitude: -43.1729, category: "City", description: "Relaxed on Copacabana Beach" },
  { name: "Havana", latitude: 23.1136, longitude: -82.3666, category: "Culture", description: "Explored Old Havana" },
  { name: "Amsterdam", latitude: 52.3676, longitude: 4.9041, category: "City", description: "Took a canal tour" },
  { name: "Santorini", latitude: 36.3932, longitude: 25.4615, category: "Nature", description: "Watched the sunset in Oia" }
  ];
 

  const width = 900;
  const height = 600;
 

  const svg = d3.select("#vis-dot")
  .append("svg")
  .attr("width", width)
  .attr("height", height);
 

  const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");
 

  const projection = d3.geoMercator()
  .center([0, 20])
  .scale(150)
  .translate([width / 2, height / 2]);
 

  const colorScale = d3.scaleOrdinal()
  .domain(["City", "Nature", "Culture"])
  .range(["#1f77b4", "#2ca02c", "#d62728"]);
 

  // Zoom functionality
  let zoom = d3.zoom()
  .scaleExtent([1, 8]) // Limit zoom scale
  .on("zoom", zoomed);
 

  svg.call(zoom); // Apply zoom to the SVG
 

  function zoomed({transform}) {
  svg.selectAll(".country, .dot")
  .attr("transform", transform);
  }
 

  // Zoom buttons
  const zoomButtons = d3.select("#vis-dot")
  .append("div")
  .attr("class", "zoom-buttons");
 

  zoomButtons.append("button")
  .attr("class", "zoom-button")
  .text("Zoom In")
  .on("click", function() {
  zoom.scaleBy(svg.transition().duration(750), 1.2); // Slightly zoom in
  });
 

  zoomButtons.append("button")
  .attr("class", "zoom-button")
  .text("Zoom Out")
  .on("click", function() {
  zoom.scaleBy(svg.transition().duration(750), 0.8); // Slightly zoom out
  });
 

  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
  .then(data => {
  const countries = topojson.feature(data, data.objects.countries).features;
 

  svg.selectAll(".country")
  .data(countries)
  .enter().append("path")
  .attr("class", "country")
  .attr("d", d3.geoPath().projection(projection))
  .attr("fill", "#ddd")
  .attr("stroke", "white")
  .attr("stroke-width", 0.5);
 

  svg.selectAll(".dot")
  .data(places)
  .enter().append("circle")
  .attr("class", "dot")
  .attr("cx", d => projection([d.longitude, d.latitude])[0])
  .attr("cy", d => projection([d.longitude, d.latitude])[1])
  .attr("r", 4)
  .attr("fill", d => colorScale(d.category))
  .on("mouseover", function(event, d) {
  tooltip.transition()
  .duration(200)
  .style("opacity", .9)
  .style("display", "block");
  tooltip.html(`<strong>${d.name}</strong><br/>Category: ${d.category}<br/>${d.description}`)
  .style("left", (event.pageX + 10) + "px")
  .style("top", (event.pageY - 28) + "px");
  })
  .on("mouseout", function(d) {
  tooltip.transition()
  .duration(500)
  .style("opacity", 0)
  .on("end", function() {
  d3.select(this).style("display", "none");
  });
  });
 

  // Legend
  const legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", "translate(50,30)");
 

  const legendData = colorScale.domain();
 

  const legendItems = legend.selectAll(".legend-item")
  .data(legendData)
  .enter().append("g")
  .attr("class", "legend-item")
  .attr("transform", (d, i) => `translate(0, ${i * 20})`);
 

  legendItems.append("div")
  .attr("class", "legend-color")
  .style("background-color", colorScale);
 

  legendItems.append("text")
  .attr("x", 20)
  .attr("y", 19)
  .attr("dy", ".55em")
  .text(d => d);
  });

        })();