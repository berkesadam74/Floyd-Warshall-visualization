# Floyd-Warshall Visualizer

**Interactive web application for visualizing the Floyd-Warshall algorithm on directed weighted graphs.**

---

## Demo

![Demo](./demo.gif)

---

## Features

- **Add vertices** by clicking on the canvas
- **Add directed edges** with custom weights
- **Switch modes** (add vertex / add edge) with buttons
- **Drag & drop vertices** to rearrange the graph
- **Right-click a vertex** to delete it (and all its edges)
- **Reset** the entire graph with one click
- **Run Floyd-Warshall algorithm** to compute all-pairs shortest paths
- **Step-by-step visualization** of the algorithm in a modal window
- **Distance matrix** display

---

## How to Use

1. **Add Vertices:**  
   Click "Pridať vrchol" and then click on the canvas to add vertices.

2. **Add Edges:**  
   Click "Pridať hranu", then click two vertices in order. Enter the edge weight when prompted.

3. **Move Vertices:**  
   In "Pridať vrchol" mode, drag any vertex to reposition it.

4. **Delete Vertices:**  
   Right-click on a vertex to delete it (and all its edges).

5. **Reset Graph:**  
   Click "Reset" to clear the graph.

6. **Run Floyd-Warshall:**  
   Click "Spustiť Floyd-Warshall" to compute shortest paths.
   - If "Vizualizovať krok za krokom" is checked, you’ll see a step-by-step modal.
   - Otherwise, the result appears instantly below the canvas.

---

## Technologies

- **HTML, CSS, JavaScript**
- No frameworks or external libraries required

---

## Project Structure

```
/files
  ├── index.html
  ├── style.css
  ├── script.js
  └── demo.gif
```

---

## Development

- All code is in plain JavaScript for easy learning and modification.
- Variable and function names are in Slovak for educational clarity.

---

## Credits

- Created by Adam Berkeš
- Inspired by classic graph algorithm visualizations

---

## License

This project is for educational purposes.

---

## TODO / Ideas for the Future

- Highlight shortest path in the graph when clicking a matrix cell
- Add step-by-step controls (Next/Prev) in the modal
- Export/import graphs
- More algorithms (Dijkstra, Bellman-Ford, etc.)

---

**Enjoy learning and visualizing Floyd-Warshall!**

---

