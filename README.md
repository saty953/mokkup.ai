# Project Overview

This project is a React-based application with interactive graph visualization. It allows users to create and manipulate a graph with nodes, edges, and customization options. The solution includes features like node color modification, font size adjustment, and undo/redo functionality using Redux for state management.

### Core Features:
- **Graph Visualization**:
  - Initializes a graph with 10 draggable nodes interconnected with edges.
  - Smooth animations are included for graph interactions.
  
- **Node Customization**:
  - Users can select any node and modify its color using a color picker.
  - Font size for the node label can be adjusted between 12px and 24px.
  - Node customization changes are immediately reflected.
  
- **Undo/Redo Functionality**:
  - Revert the last action using the undo button.
  - Restore reverted actions using the redo button.
  - Tracks color changes, font size modifications, and node position changes.
  - Maintains a history stack for all modifications.

## Technologies Used:
- **React.js**: JavaScript library for building user interfaces.
- **Redux**: For state management.
- **React Flow**: Library for building interactive graphs and visualizations.
- **TypeScript**: Type-safe version of JavaScript.

## Component Structure:
- **App**: Root component of the application.
- **GraphContainer**: Contains the ReactFlow component for rendering the graph.
- **NodeCustomizationPanel**: Panel for customizing node properties (color and font size).
- **UndoRedoControls**: Contains buttons to undo/redo actions.
- **ColorPicker**: Component for selecting node color.
- **FontSizeControl**: Component for adjusting node font size.

## Data Structure:

```typescript
interface Node {
  id: string;
  position: { x: number; y: number };
  data: {
    label: string;
    color: string;
    fontSize: number;
  };
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

interface HistoryState {
  past: Action[];
  present: State;
  future: Action[];
}
