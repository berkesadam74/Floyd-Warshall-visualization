# Floyd-Warshall Algorithm Visualizer

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://berkesadam74.github.io/floyd-warshall-visualization)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> An interactive web application for visualizing the Floyd-Warshall algorithm, demonstrating how to find shortest paths between all pairs of vertices in a weighted directed graph.

## [Live Demo](https://berkesadam74.github.io/Floyd-Warshall-visualization/)

![Demo](./demo.gif)

## Features

- **Interactive Graph Building**: Click to add vertices, connect them with weighted edges
- **Intuitive Controls**: Drag vertices to reposition, right-click to delete
- **Algorithm Visualization**: Step-by-step execution with highlighted matrix updates
- **Distance Matrix**: Real-time display of shortest path distances
- **Responsive Design**: Works on desktop and mobile devices
- **No Dependencies**: Pure vanilla JavaScript, HTML, and CSS

## How to Use

### Building Your Graph

1. **Add Vertices**: Click "Add Vertex" then click anywhere on the canvas
2. **Add Edges**: Click "Add Edge", then click two vertices and enter the weight
3. **Move Vertices**: In vertex mode, drag any vertex to reposition it
4. **Delete Vertices**: Right-click on any vertex to remove it and its edges

### Running the Algorithm

1. **Quick Run**: Uncheck "Step-by-step visualization" for instant results
2. **Detailed View**: Keep the checkbox checked to see each algorithm step
3. **Reset**: Clear the entire graph to start over

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Graphics**: HTML5 Canvas API
- **Development**: ESLint, Prettier
- **Deployment**: GitHub Pages

## Project Structure

```
floyd-warshall-visualization/
├── index.html              # Main HTML file
├── src/
│   ├── script.js           # Core application logic
│   └── style.css           # Styling and responsive design
├── package.json            # Project configuration
├── .eslintrc.json         # Code linting rules
├── .prettierrc            # Code formatting rules
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- A modern web browser
- Node.js (optional, for development tools)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/berkesadam74/Floyd-Warshall-visualization.git
   cd Floyd-Warshall-visualization
   ```

2. **Install development dependencies** (optional)

   ```bash
   npm install
   ```

3. **Run locally**

   ```bash
   # Option 1: Simple server
   npm run start

   # Option 2: Live reload server
   npm run dev

   # Option 3: Open index.html directly in browser
   open index.html
   ```

## About the Floyd-Warshall Algorithm

The Floyd-Warshall algorithm is a dynamic programming algorithm for finding shortest paths between all pairs of vertices in a weighted graph. It works by:

1. **Initialization**: Set up a distance matrix with direct edge weights
2. **Iteration**: For each vertex k, check if path i→k→j is shorter than direct path i→j
3. **Update**: Replace distances with shorter paths when found

**Time Complexity**: O(V³) where V is the number of vertices  
**Space Complexity**: O(V²) for the distance matrix

## Learning Objectives

This project demonstrates:

- **Algorithm Implementation**: Clean, readable Floyd-Warshall implementation
- **Data Visualization**: Interactive canvas-based graph rendering
- **User Interface Design**: Intuitive controls and responsive layout
- **Code Organization**: Modern JavaScript practices and project structure
- **Documentation**: Comprehensive README and code comments

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

```bash
# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm run test
```

## Future Enhancements

- [ ] Path highlighting when clicking matrix cells
- [ ] Export/import graph functionality
- [ ] Additional algorithms (Dijkstra, Bellman-Ford)
- [ ] Graph templates and examples
- [ ] Performance metrics display
- [ ] Undo/redo functionality

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Adam Berkeš**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/adam-berkes-246583274)

## Acknowledgments

- Inspired by classic algorithm visualization tools
- Built as a learning project to demonstrate graph algorithms
- Thanks to the computer science education community for algorithm resources

---

**Star this repository if you found it helpful!**
