/**
 * Floyd-Warshall Algorithm Visualizer
 * Interactive graph visualization for shortest path algorithm
 *
 * Features:
 * - Interactive vertex and edge creation
 * - Drag and drop vertex positioning
 * - Step-by-step algorithm visualization
 * - Modern UI with responsive design
 */

// ===== CANVAS SETUP =====
const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');

// ===== DATA STRUCTURES =====
let vertices = []; // Array of vertex objects: [{x: number, y: number}, ...]
let edges = []; // Array of edge tuples: [[fromIndex, toIndex, weight], ...]
let selectedVertices = []; // Array of vertex indices currently selected for edge creation

// ===== APPLICATION STATE =====
let currentMode = 'vertex'; // Current interaction mode: "vertex" or "edge"
let visualizationStopped = false; // Flag to control visualization playback

// ===== MOUSE INTERACTION STATE =====
let isDragging = false; // Whether user is currently dragging a vertex
let wasDragged = false; // Whether a drag operation occurred (prevents click after drag)
let dragIndex = null; // Index of vertex being dragged
let offsetX = 0; // Mouse offset from vertex center (X coordinate)
let offsetY = 0; // Mouse offset from vertex center (Y coordinate)

// ===== MOUSE EVENT HANDLERS =====

/**
 * Handle mouse down events for vertex dragging
 * Only works in vertex mode and with left mouse button
 */
canvas.addEventListener('mousedown', (e) => {
  try {
    // Only handle left mouse button in vertex mode
    if (e.button !== 0 || currentMode !== 'vertex') {
      return;
    }

    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if mouse is over a vertex
    const vertexIndex = getClickedVertex(x, y);
    wasDragged = false;

    if (vertexIndex !== null) {
      // Start dragging the vertex
      isDragging = true;
      dragIndex = vertexIndex;
      // Store offset to maintain relative position during drag
      offsetX = x - vertices[vertexIndex].x;
      offsetY = y - vertices[vertexIndex].y;
    }
  } catch (error) {
    console.error('Error handling mouse down:', error);
  }
});

/**
 * Handle mouse move events for vertex dragging
 * Updates vertex position while maintaining canvas boundaries
 */
canvas.addEventListener('mousemove', (e) => {
  try {
    // Only process if currently dragging a vertex
    if (!isDragging || dragIndex === null) return;

    // Get current mouse position
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate new vertex position with boundary constraints
    // Keep vertices at least 20px from canvas edges
    const newX = Math.max(20, Math.min(canvas.width - 20, x - offsetX));
    const newY = Math.max(20, Math.min(canvas.height - 20, y - offsetY));

    // Update vertex position
    vertices[dragIndex].x = newX;
    vertices[dragIndex].y = newY;
    wasDragged = true;

    // Redraw graph with new position
    drawGraph();
  } catch (error) {
    console.error('Error handling mouse move:', error);
  }
});

/**
 * Handle mouse up events to end vertex dragging
 */
canvas.addEventListener('mouseup', (e) => {
  if (isDragging) {
    isDragging = false;
    dragIndex = null;
  }
});

/**
 * Handle right-click context menu for vertex deletion
 * Prevents default context menu and deletes clicked vertex
 */
canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault(); // Prevent browser context menu

  // Get mouse position
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Check if right-clicked on a vertex
  const vertexIndex = getClickedVertex(x, y);
  if (vertexIndex !== null) {
    deleteVertex(vertexIndex);
    drawGraph();
  }
});

// ===== UTILITY FUNCTIONS =====

/**
 * Sleep function for animation delays
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after specified time
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Draw a directed arrow between two points
 * @param {number} startX - Starting X coordinate
 * @param {number} startY - Starting Y coordinate
 * @param {number} endX - Ending X coordinate
 * @param {number} endY - Ending Y coordinate
 * @param {string} color - Arrow color (default: '#475569')
 */
const drawArrow = (startX, startY, endX, endY, color = '#475569') => {
  // Draw arrow line
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Draw arrowhead
  const arrowHeadLength = 12;
  const angle = Math.atan2(endY - startY, endX - startX);

  ctx.beginPath();
  ctx.moveTo(endX, endY);
  // Left side of arrowhead
  ctx.lineTo(
    endX - arrowHeadLength * Math.cos(angle - Math.PI / 7),
    endY - arrowHeadLength * Math.sin(angle - Math.PI / 7)
  );
  // Right side of arrowhead
  ctx.lineTo(
    endX - arrowHeadLength * Math.cos(angle + Math.PI / 7),
    endY - arrowHeadLength * Math.sin(angle + Math.PI / 7)
  );
  ctx.lineTo(endX, endY);
  ctx.fillStyle = color;
  ctx.fill();
};

// ===== DRAWING FUNCTIONS =====

/**
 * Main drawing function - renders the complete graph
 * Draws in order: background grid, edges, vertices
 */
const drawGraph = () => {
  // Clear the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background grid for visual reference
  drawGridBackground();

  // Draw edges first (so they appear behind vertices)
  drawEdges();

  // Draw vertices on top
  drawVertices();
};

/**
 * Draw a subtle grid background for visual reference
 * Uses light gray lines every 20 pixels
 */
const drawGridBackground = () => {
  const gridSize = 20;
  ctx.strokeStyle = '#f1f5f9'; // Very light gray
  ctx.lineWidth = 0.5;

  // Draw vertical grid lines
  for (let x = gridSize; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Draw horizontal grid lines
  for (let y = gridSize; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
};

/**
 * Draw all edges in the graph
 * Each edge is drawn as an arrow with a weight label
 */
const drawEdges = () => {
  for (const [fromIndex, toIndex, weight] of edges) {
    const fromVertex = vertices[fromIndex];
    const toVertex = vertices[toIndex];

    // Skip invalid edges (vertices may have been deleted)
    if (!fromVertex || !toVertex) continue;

    // Calculate edge direction and length
    const dx = toVertex.x - fromVertex.x;
    const dy = toVertex.y - fromVertex.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const offset = 22; // Distance from vertex center to edge start/end

    // Calculate arrow start and end points (offset from vertex centers)
    const startX = fromVertex.x + (dx * offset) / distance;
    const startY = fromVertex.y + (dy * offset) / distance;
    const endX = toVertex.x - (dx * offset) / distance;
    const endY = toVertex.y - (dy * offset) / distance;

    // Draw the arrow
    drawArrow(startX, startY, endX, endY, '#475569');

    // Draw weight label with background
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;

    // Set font for weight label
    ctx.font =
      "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Calculate label background size
    const textWidth = ctx.measureText(weight).width;
    const padding = 6;

    // Draw white background for weight label
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();

    // Use roundRect if available, fallback to rect
    if (ctx.roundRect) {
      ctx.roundRect(
        midX - textWidth / 2 - padding,
        midY - 8,
        textWidth + padding * 2,
        16,
        4
      );
    } else {
      ctx.rect(
        midX - textWidth / 2 - padding,
        midY - 8,
        textWidth + padding * 2,
        16
      );
    }
    ctx.fill();
    ctx.stroke();

    // Draw weight text in red
    ctx.fillStyle = '#dc2626';
    ctx.fillText(weight, midX, midY);
  }
};

/**
 * Draw all vertices in the graph
 * Each vertex is drawn as a numbered circle with shadow and highlight effects
 */
const drawVertices = () => {
  for (let i = 0; i < vertices.length; i++) {
    const vertex = vertices[i];
    const isSelected = selectedVertices.includes(i);

    // Draw drop shadow for depth effect
    ctx.beginPath();
    ctx.arc(vertex.x + 1, vertex.y + 1, 22, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fill();

    // Draw main vertex circle
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 22, 0, 2 * Math.PI);
    // Use different colors for selected vs normal state
    ctx.fillStyle = isSelected ? '#dbeafe' : '#3b82f6'; // Light blue if selected, blue if normal
    ctx.fill();

    // Draw vertex border
    ctx.strokeStyle = isSelected ? '#3b82f6' : '#1e40af'; // Blue border
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw vertex number/label
    ctx.fillStyle = isSelected ? '#1e40af' : '#ffffff'; // Dark blue text if selected, white if normal
    ctx.font =
      "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(i, vertex.x, vertex.y);
  }
};

// ===== VERTEX MANAGEMENT FUNCTIONS =====

/**
 * Find which vertex (if any) was clicked at the given coordinates
 * @param {number} x - X coordinate of click
 * @param {number} y - Y coordinate of click
 * @returns {number|null} Index of clicked vertex, or null if none
 */
const getClickedVertex = (x, y) => {
  // Check vertices in reverse order (top-most first)
  for (let i = vertices.length - 1; i >= 0; i--) {
    const vertex = vertices[i];
    const dx = vertex.x - x;
    const dy = vertex.y - y;
    // Check if click is within vertex radius (20px radius = 400px squared)
    if (dx * dx + dy * dy <= 400) {
      return i;
    }
  }
  return null;
};

/**
 * Delete a vertex and update all related edges
 * @param {number} vertexIndex - Index of vertex to delete
 */
const deleteVertex = (vertexIndex) => {
  // Remove the vertex from the array
  vertices.splice(vertexIndex, 1);

  // Remove all edges connected to this vertex
  edges = edges.filter(
    ([from, to]) => from !== vertexIndex && to !== vertexIndex
  );

  // Update edge indices (shift down indices greater than deleted vertex)
  edges = edges.map(([from, to, weight]) => [
    from > vertexIndex ? from - 1 : from,
    to > vertexIndex ? to - 1 : to,
    weight,
  ]);
};

// ===== UI CONTROL FUNCTIONS =====

/**
 * Set the active interaction mode and update button states
 * @param {string} mode - Either "vertex" or "edge"
 */
const setActiveMode = (mode) => {
  currentMode = mode;

  // Remove active class from all mode buttons
  document.getElementById('btn-vertex').classList.remove('active');
  document.getElementById('btn-edge').classList.remove('active');

  // Add active class to selected mode button
  if (mode === 'vertex') {
    document.getElementById('btn-vertex').classList.add('active');
  } else if (mode === 'edge') {
    document.getElementById('btn-edge').classList.add('active');
  }
};

/**
 * Reset the entire graph to empty state
 * Clears all vertices, edges, and matrix displays
 */
const resetGraph = () => {
  vertices = [];
  edges = [];
  selectedVertices = [];

  // Clear matrix displays
  document.getElementById('matrix').innerHTML = '';
  document.getElementById('fw-matrix-display').innerHTML = '';

  // Redraw empty canvas
  drawGraph();
};

// ===== EVENT LISTENERS FOR UI BUTTONS =====

// Set vertex mode when vertex button is clicked
document.getElementById('btn-vertex').addEventListener('click', () => {
  setActiveMode('vertex');
});

// Set edge mode when edge button is clicked
document.getElementById('btn-edge').addEventListener('click', () => {
  setActiveMode('edge');
});

// Reset graph when reset button is clicked
document.getElementById('btn-reset').addEventListener('click', resetGraph);

// ===== INPUT VALIDATION FUNCTIONS =====

/**
 * Validate edge weight input from user
 * @param {string|null} input - User input string
 * @returns {number|null} Valid weight number or null if invalid
 */
const validateEdgeWeight = (input) => {
  // Handle null or empty input
  if (input === null || input.trim() === '') return null;

  // Parse as integer
  const weight = parseInt(input);
  if (isNaN(weight)) return null;

  // Check range limits for performance and display
  if (weight < -1000 || weight > 1000) return null;

  return weight;
};

/**
 * Add a new vertex at the specified coordinates
 * @param {number} x - X coordinate for new vertex
 * @param {number} y - Y coordinate for new vertex
 * @returns {boolean} True if vertex was added successfully
 */
const addVertex = (x, y) => {
  // Check vertex limit for performance
  if (vertices.length >= 20) {
    alert('Maximum 20 vertices allowed for performance reasons.');
    return false;
  }

  // Check boundary constraints (keep vertices away from edges)
  const margin = 30;
  if (
    x < margin ||
    x > canvas.width - margin ||
    y < margin ||
    y > canvas.height - margin
  ) {
    return false;
  }

  // Add vertex to array
  vertices.push({ x, y });
  return true;
};

/**
 * Handle canvas click events for vertex/edge creation
 * Behavior depends on current mode (vertex or edge)
 */
canvas.addEventListener('click', (e) => {
  try {
    // Get click position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentMode === 'vertex') {
      // VERTEX MODE: Add new vertex at click position
      if (wasDragged) return; // Don't add vertex if we just finished dragging

      addVertex(x, y);
      selectedVertices = []; // Clear any selected vertices
    } else if (currentMode === 'edge') {
      // EDGE MODE: Select vertices to create edges between them
      const clickedVertex = getClickedVertex(x, y);

      if (clickedVertex !== null) {
        selectedVertices.push(clickedVertex);

        // When two vertices are selected, create edge
        if (selectedVertices.length === 2) {
          if (selectedVertices[0] !== selectedVertices[1]) {
            // Check if edge already exists
            const edgeExists = edges.some(
              ([from, to]) =>
                from === selectedVertices[0] && to === selectedVertices[1]
            );

            if (edgeExists) {
              alert('Edge already exists between these vertices.');
            } else {
              // Prompt for edge weight
              const weightInput = prompt(
                'Enter edge weight (-1000 to 1000):',
                '1'
              );
              const weight = validateEdgeWeight(weightInput);

              if (weight !== null) {
                // Create new edge
                edges.push([selectedVertices[0], selectedVertices[1], weight]);
              } else if (weightInput !== null) {
                // User entered invalid weight
                alert(
                  'Invalid weight. Please enter a number between -1000 and 1000.'
                );
              }
              // If weightInput is null, user cancelled - do nothing
            }
          } else {
            // User tried to create self-loop
            alert('Cannot create edge from vertex to itself.');
          }

          // Reset selection for next edge
          selectedVertices = [];
        }
      }
    }

    // Redraw graph to show changes
    drawGraph();
  } catch (error) {
    console.error('Error handling canvas click:', error);
  }
});

// ===== FLOYD-WARSHALL ALGORITHM EXECUTION =====

/**
 * Handle Floyd-Warshall button click
 * Runs either visualization or direct algorithm based on checkbox state
 */
document.getElementById('btn-fw').addEventListener('click', () => {
  if (document.getElementById('visualization-checkbox').checked) {
    // Run step-by-step visualization
    visualizeFloydWarshall();
  } else {
    // Run algorithm directly and show final result
    runFloydWarshall();
  }
});

/**
 * Display distance matrix in the main results area
 * @param {number[][]} matrix - 2D array representing distance matrix
 */
const displayMatrix = (matrix) => {
  const n = matrix.length;
  let html = "<table class='matrix-table'>";

  // Create header row with column indices
  html += '<tr><th></th>';
  for (let j = 0; j < n; j++) html += `<th>${j}</th>`;
  html += '</tr>';

  // Create data rows
  for (let i = 0; i < n; i++) {
    html += `<tr><th>${i}</th>`; // Row header with vertex index
    for (let j = 0; j < n; j++) {
      // Display infinity symbol for unreachable vertices
      const val = matrix[i][j] === Infinity ? '&infin;' : matrix[i][j];
      html += `<td>${val}</td>`;
    }
    html += '</tr>';
  }
  html += '</table>';

  // Insert into DOM
  document.getElementById('matrix').innerHTML = html;
};

/**
 * Run Floyd-Warshall algorithm directly and display final result
 * Computes shortest paths between all pairs of vertices
 */
const runFloydWarshall = () => {
  try {
    const vertexCount = vertices.length;

    // Validate input
    if (vertexCount === 0) {
      document.getElementById('matrix').innerHTML =
        "<p class='error-message'>Graph is empty. Please add vertices first.</p>";
      return;
    }

    if (vertexCount > 20) {
      document.getElementById('matrix').innerHTML =
        "<p class='error-message'>Graph too large (max 20 vertices for performance).</p>";
      return;
    }

    // Initialize distance matrix
    const distances = Array.from({ length: vertexCount }, () =>
      Array(vertexCount).fill(Infinity)
    );

    // Set diagonal to 0 (distance from vertex to itself)
    for (let i = 0; i < vertexCount; i++) {
      distances[i][i] = 0;
    }

    // Set direct edge weights
    for (const [from, to, weight] of edges) {
      // Validate edge indices
      if (from >= vertexCount || to >= vertexCount || from < 0 || to < 0) {
        console.warn(`Invalid edge: ${from} -> ${to}`);
        continue;
      }
      distances[from][to] = weight;
    }

    // Floyd-Warshall algorithm: try all intermediate vertices
    for (let k = 0; k < vertexCount; k++) {
      // Intermediate vertex
      for (let i = 0; i < vertexCount; i++) {
        // Source vertex
        for (let j = 0; j < vertexCount; j++) {
          // Destination vertex
          // Skip if any vertex is the intermediate vertex or same source/dest
          if (i === k || j === k || i === j) continue;

          // Check if path through k is shorter
          if (distances[i][k] !== Infinity && distances[k][j] !== Infinity) {
            const newDistance = distances[i][k] + distances[k][j];
            if (newDistance < distances[i][j]) {
              distances[i][j] = newDistance;
            }
          }
        }
      }
    }

    // Display final result matrix
    displayMatrix(distances);
  } catch (error) {
    console.error('Error running Floyd-Warshall algorithm:', error);
    document.getElementById('matrix').innerHTML =
      "<p class='error-message'>An error occurred while running the algorithm.</p>";
  }
};

/**
 * Run Floyd-Warshall algorithm with step-by-step visualization
 * Shows each comparison and update in the modal overlay
 */
const visualizeFloydWarshall = async () => {
  try {
    visualizationStopped = false;
    const n = vertices.length;

    // Validate input for visualization
    if (n === 0) {
      document.getElementById('fw-status').textContent =
        'Graph is empty. Please add vertices first.';
      document.getElementById('fw-overlay').style.display = 'flex';
      return;
    }

    // Limit visualization size for performance and readability
    if (n > 10) {
      document.getElementById('fw-status').textContent =
        'Graph too large for visualization (max 10 vertices).';
      document.getElementById('fw-overlay').style.display = 'flex';
      return;
    }

    // Initialize distance matrix (same as direct algorithm)
    const distances = Array.from({ length: n }, () => Array(n).fill(Infinity));
    for (let i = 0; i < n; i++) distances[i][i] = 0;

    // Set direct edge weights
    for (const [from, to, weight] of edges) {
      if (from >= n || to >= n || from < 0 || to < 0) {
        console.warn(`Invalid edge: ${from} -> ${to}`);
        continue;
      }
      distances[from][to] = weight;
    }

    // Show modal and initial matrix
    document.getElementById('fw-overlay').style.display = 'flex';
    document.getElementById('fw-status').textContent = 'Initializing matrix...';
    displayMatrixOverlay(distances);
    await sleep(1000);

    // Main Floyd-Warshall algorithm with visualization
    for (let k = 0; k < n; k++) {
      // For each intermediate vertex
      if (visualizationStopped) return;

      // Show current intermediate vertex
      document.getElementById('fw-status').textContent =
        `Intermediate vertex k = ${k}`;
      displayMatrixOverlay(distances, { k });
      await sleep(1500);

      for (let i = 0; i < n; i++) {
        // For each source vertex
        if (visualizationStopped) return;

        for (let j = 0; j < n; j++) {
          // For each destination vertex
          if (visualizationStopped) return;
          if (i === k || j === k) continue; // Skip if source/dest is intermediate

          const previous = distances[i][j];
          let updated = false;

          // Check if path through k is better
          if (distances[i][k] !== Infinity && distances[k][j] !== Infinity) {
            const throughK = distances[i][k] + distances[k][j];
            if (throughK < previous) {
              distances[i][j] = throughK;
              updated = true;
            }
          }

          // Show current comparison with highlighting
          displayMatrixOverlay(distances, { k, i, j, updated });

          // Create readable status text
          const throughKText =
            distances[i][k] !== Infinity && distances[k][j] !== Infinity
              ? `${distances[i][k]} + ${distances[k][j]}`
              : '∞';
          document.getElementById('fw-status').textContent =
            `Comparing: d[${i}][${j}] = min(${previous === Infinity ? '∞' : previous}, ${throughKText})`;

          await sleep(1000);
        }
      }
    }

    // Visualization complete
    document.getElementById('fw-status').textContent = 'Done!';
  } catch (error) {
    console.error('Error during visualization:', error);
    document.getElementById('fw-status').textContent =
      'An error occurred during visualization.';
  }
};

/**
 * Display matrix in visualization overlay with highlighting
 * @param {number[][]} matrix - Distance matrix to display
 * @param {Object} highlight - Highlighting options for visualization
 * @param {number} highlight.k - Current intermediate vertex (highlighted in gray)
 * @param {number} highlight.i - Current source vertex being compared
 * @param {number} highlight.j - Current destination vertex being compared
 * @param {boolean} highlight.updated - Whether the cell was updated (green) or not (red)
 */
const displayMatrixOverlay = (matrix, highlight = {}) => {
  const n = matrix.length;
  let html = "<table class='matrix-table overlay-matrix'>";

  // Create header row
  html += '<tr><th></th>';
  for (let j = 0; j < n; j++) html += `<th>${j}</th>`;
  html += '</tr>';

  // Create data rows with highlighting
  for (let i = 0; i < n; i++) {
    html += `<tr><th>${i}</th>`;
    for (let j = 0; j < n; j++) {
      const val = matrix[i][j] === Infinity ? '&infin;' : matrix[i][j];
      let className = '';

      // Highlight intermediate vertex row/column
      if (highlight.k === i || highlight.k === j)
        className += 'highlight-intermediate ';

      // Highlight current comparison cell
      if (highlight.i === i && highlight.j === j)
        className += highlight.updated
          ? 'highlight-updated ' // Green for updated values
          : 'highlight-comparing '; // Red for compared but not updated

      html += `<td class="${className}">${val}</td>`;
    }
    html += '</tr>';
  }
  html += '</table>';

  // Insert into visualization modal
  document.getElementById('fw-matrix-display').innerHTML = html;
};

// ===== MODAL CONTROLS =====

/**
 * Close visualization modal and stop algorithm
 */
document.getElementById('fw-close-button').addEventListener('click', () => {
  visualizationStopped = true;
  document.getElementById('fw-matrix-display').innerHTML = '';
  document.getElementById('fw-overlay').style.display = 'none';
});

// ===== INITIALIZATION =====

// Set initial mode and draw empty canvas
setActiveMode('vertex');
drawGraph();
