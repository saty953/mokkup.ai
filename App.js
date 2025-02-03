import React, { useState, useReducer, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

const defaultNodes = Array.from({ length: 10 }, (_, i) => ({
  id: `node-${i + 1}`,
  position: { x: Math.random() * 400, y: Math.random() * 400 },
  data: { label: `Node ${i + 1}`, color: "#ffffff", fontSize: 16 },
  selected: false,
}));

const defaultEdges = defaultNodes.slice(1).map((_, i) => ({
  id: `edge-${i + 1}`,
  source: `node-${i + 1}`,
  target: `node-${i + 2}`,
}));

const historyReducer = (state, action) => {
  switch (action.type) {
    case "APPLY_CHANGE":
      return {
        past: [...state.past, state.present],
        present: action.newState,
        future: [],
      };
    case "UNDO":
      if (state.past.length === 0) return state;
      return {
        past: state.past.slice(0, -1),
        present: state.past[state.past.length - 1],
        future: [state.present, ...state.future],
      };
    case "REDO":
      if (state.future.length === 0) return state;
      return {
        past: [...state.past, state.present],
        present: state.future[0],
        future: state.future.slice(1),
      };
    default:
      return state;
  }
};

const App = () => {
  const [history, dispatchHistory] = useReducer(historyReducer, {
    past: [],
    present: { nodes: defaultNodes, edges: defaultEdges },
    future: [],
  });

  const [currentNode, setCurrentNode] = useState(null);
  const [nodeColor, setNodeColor] = useState("#3498db");
  const [nodeFontSize, setNodeFontSize] = useState(16);

  const onNodesChange = useCallback(
    (changes) => {
      dispatchHistory({
        type: "APPLY_CHANGE",
        newState: {
          ...history.present,
          nodes: applyNodeChanges(changes, history.present.nodes),
        },
      });
    },
    [history.present]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      dispatchHistory({
        type: "APPLY_CHANGE",
        newState: {
          ...history.present,
          edges: applyEdgeChanges(changes, history.present.edges),
        },
      });
    },
    [history.present]
  );

  const onNodeClick = (event, node) => {
    setCurrentNode(node.id);
    setNodeColor(node.data.color);
    setNodeFontSize(node.data.fontSize);

    const updatedNodes = history.present.nodes.map((n) => ({
      ...n,
      selected: n.id === node.id,
    }));

    dispatchHistory({
      type: "APPLY_CHANGE",
      newState: { ...history.present, nodes: updatedNodes },
    });
  };

  const applyChanges = () => {
    if (!currentNode) return;
    const updatedNodes = history.present.nodes.map((node) =>
      node.id === currentNode
        ? {
            ...node,
            data: { ...node.data, color: nodeColor, fontSize: nodeFontSize },
          }
        : node
    );
    dispatchHistory({
      type: "APPLY_CHANGE",
      newState: { ...history.present, nodes: updatedNodes },
    });
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 3, borderRight: "1px solid #ddd" }}>
        <ReactFlow
          nodes={history.present.nodes.map((node) => ({
            ...node,
            style: {
              backgroundColor: node.data.color,
              fontSize: node.data.fontSize,
              padding: 10,
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: node.selected ? "3px solid red" : "1px solid black",
              borderRadius: 0,
            },
          }))}
          edges={history.present.edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <div style={{ flex: 1, padding: 20, background: "lightblue" }}>
        <h3>Customize Node</h3>
        <input
          type="text"
          placeholder="Enter Node ID (e.g., node-1)"
          value={currentNode || ""}
          onChange={(e) => setCurrentNode(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 5 }}
        />
        <label>Pick Color:</label>
        <input
          type="color"
          value={nodeColor}
          onChange={(e) => setNodeColor(e.target.value)}
        />
        <label>Font Size:</label>
        <input
          type="range"
          min="12"
          max="24"
          value={nodeFontSize}
          onChange={(e) => setNodeFontSize(Number(e.target.value))}
        />
        <button onClick={applyChanges} style={{ marginTop: 10, padding: 5 }}>
          Apply
        </button>

        <h3>History</h3>
        <button
          onClick={() => dispatchHistory({ type: "UNDO" })}
          disabled={history.past.length === 0}
        >
          Undo
        </button>
        <button
          onClick={() => dispatchHistory({ type: "REDO" })}
          disabled={history.future.length === 0}
        >
          Redo
        </button>
      </div>
    </div>
  );
};

export default App;
