(function(){
     const section = d3.select("#vis-nav");
  const width = 1300;
  const height = 1500;
 

  const svg = section.append("svg")
  .attr("width", width)
  .attr("height", height);
 

  const mapContainer = svg.append("g")
  .attr("class", "map-container");
 

  const projection = d3.geoMercator()
  .scale(width / 6) // Adjust scale as needed
  .translate([width / 2, height / 2]);
 

  const path = d3.geoPath().projection(projection);
 

  const zoom = d3.zoom()
  .scaleExtent([1, 8])
  .on("zoom", zoomed);
 

  svg.call(zoom);
 

  function zoomed({ transform }) {
  mapContainer.attr("transform", transform);
  }
 

  // Tooltip
  const tooltip = section.append("div")
  .attr("class", "tooltip");
 

  function showTooltip(event, d) {
  tooltip.transition()
  .duration(200)
  .style("opacity", .9);
  tooltip.html(`<strong>${d.properties.name}</strong>`)
  .style("left", (event.pageX) + "px")
  .style("top", (event.pageY - 28) + "px")
  .style("display", "block");
  }
 

  function hideTooltip() {
  tooltip.transition()
  .duration(500)
  .style("opacity", 0)
  .on("end", function() {
  d3.select(this).style("display", "none");
  });
  }
 

  // Zoom Controls
  const zoomControls = section.append("div")
  .attr("id", "zoom-controls");
 

  zoomControls.append("button")
  .text("Zoom In")
  .on("click", function() {
  zoomIn();
  });
 

  zoomControls.append("button")
  .text("Zoom Out")
  .on("click", function() {
  zoomOut();
  });
 

  function zoomIn() {
  svg.transition()
  .duration(750)
  .call(zoom.scaleBy, 1.3); // Increase scale by 30%
  }
 

  function zoomOut() {
  svg.transition()
  .duration(750)
  .call(zoom.scaleBy, 1 / 1.3); // Decrease scale by 30%
  }
 

  // Search Functionality
  const searchContainer = section.append("div")
  .attr("id", "search-container");
 

  const searchInput = searchContainer.append("input")
  .attr("type", "text")
  .attr("id", "search-input")
  .attr("placeholder", "Search for a country...");
 

  const searchResultsList = searchContainer.append("ul")
  .attr("id", "search-results");
 

  let worldData; // Store world data for searching
 

  function searchCountries(searchTerm) {
  const results = worldData.features.filter(feature =>
  feature.properties.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return results;
  }
 

  function displaySearchResults(results) {
  searchResultsList.selectAll("li").remove(); // Clear previous results
 

  searchResultsList.selectAll("li")
  .data(results)
  .enter()
  .append("li")
  .text(d => d.properties.name)
  .on("click", function(event, d) {
  // Fly to the selected country
  flyToCountry(d);
  searchInput.value = ""; // Clear the search input
  displaySearchResults([]); // Clear the search results
  });
  }
 

  function flyToCountry(d) {
  const centroid = path.centroid(d);
  svg.transition()
  .duration(1500)
  .call(
  zoom.transform,
  d3.zoomIdentity
  .translate(width / 2, height / 2)
  .scale(4) // Adjust zoom level as needed
  .translate(-centroid[0], -centroid[1])
  );
  }
 

  searchInput.on("input", function() {
  const searchTerm = this.value;
  const results = searchCountries(searchTerm);
  displaySearchResults(results);
  });
 

  let selectedCountry = null; // Keep track of the currently selected country
 

  // Load Map Data
  d3.json("https://unpkg.com/world-atlas@2/countries-50m.json")
  .then(data => {
  worldData = topojson.feature(data, data.objects.countries);
 

  mapContainer.selectAll("path")
  .data(worldData.features)
  .enter()
  .append("path")
  .attr("class", "country")
  .attr("d", path)
  .on("mouseover", showTooltip)
  .on("mouseout", hideTooltip)
  .on("click", function(event, d) { // Modified click handler
  // Remove previous selection
  if (selectedCountry) {
  selectedCountry.classed("selected", false);
  }
 

  // Select current item
  selectedCountry = d3.select(this);
  selectedCountry.classed("selected", true);
  });
  });
          })();