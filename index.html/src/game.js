

(function(){
const width = 600;
  const height = 400;
  let score = 0;
  let gameActive = true;
  let startTime = null;
 

  const svg = d3.select("#vis-game")
  .append("svg")
  .attr("width", width)
  .attr("height", height);
 

  function updateScore() {
  d3.select("#score").text("Score: " + score);
  }
 

  function showMessage(text) {
  d3.select("#message").text(text);
  setTimeout(() => d3.select("#message").text(""), 2000); // Clear message after 2 seconds
  }
 

  function getRandomPosition() {
  const radius = 20;
  const x = radius + (Math.random() * (width - 2 * radius));
  const y = radius + (Math.random() * (height - 2 * radius));
  return { x, y };
  }
 

  function createCircle() {
  if (!gameActive) return;
 

  const position = getRandomPosition();
  const radius = 20;
  const circle = svg.append("circle")
  .attr("cx", position.x)
  .attr("cy", position.y)
  .attr("r", radius)
  .attr("fill", "steelblue")
  .style("cursor", "pointer")
  .on("click", function() {
  if (!startTime) {
  startTime = Date.now();
  }
  const endTime = Date.now();
  const reactionTime = endTime - startTime;
  startTime = endTime; // Update startTime
 

  // Calculate score based on reaction time (faster = more points)
  let points = Math.max(10, 50 - Math.floor(reactionTime / 20)); //Min 10 points
  score += points;
  updateScore();
 

  showMessage(`+${points} points!`);
 

  circle.remove();
  createCircle(); // Create a new circle
  });
 

  // Remove the circle after a certain time if not clicked
  setTimeout(() => {
  circle.remove();
  if (gameActive) {
  showMessage("Too slow!");
  createCircle(); // Create a new circle
  }
  }, 2000);
  }
 

  // Start the game
  createCircle();
 

  // Optional: Add a game over condition
  setTimeout(() => {
  gameActive = false;
  svg.selectAll("*").remove(); // Clear the SVG
  d3.select("#vis-game")
  .append("text")
  .attr("x", width / 2)
  .attr("y", height / 2)
  .style("text-anchor", "middle")
  .style("font-size", "30px")
  .text("Game Over! Final Score: " + score);
  }, 30000); // Game over after 30 seconds

  })();