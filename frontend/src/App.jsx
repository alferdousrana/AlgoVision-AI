import { useEffect, useState, Fragment } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

import "reactflow/dist/style.css";
import "./App.css";


const initialNodes = [
  {
    id: "A",
    position: { x: 300, y: 50 },
    data: { label: "A" },
  },
  {
    id: "B",
    position: { x: 120, y: 180 },
    data: { label: "B" },
  },
  {
    id: "C",
    position: { x: 480, y: 180 },
    data: { label: "C" },
  },
  {
    id: "D",
    position: { x: 30, y: 330 },
    data: { label: "D" },
  },
  {
    id: "E",
    position: { x: 210, y: 330 },
    data: { label: "E" },
  },
  {
    id: "F",
    position: { x: 480, y: 330 },
    data: { label: "F" },
  },
];


const initialEdges = [
  {
    id: "AB",
    source: "A",
    target: "B",
    label: "",
    data: { weight: 4 },
  },
  {
    id: "AC",
    source: "A",
    target: "C",
    label: "",
    data: { weight: 2 },
  },
  {
    id: "BD",
    source: "B",
    target: "D",
    label: "",
    data: { weight: 3 },
  },
  {
    id: "BE",
    source: "B",
    target: "E",
    label: "",
    data: { weight: 5 },
  },
  {
    id: "CF",
    source: "C",
    target: "F",
    label: "",
    data: { weight: 6 },
  },
];


function App() {
  const [algorithm, setAlgorithm] = useState("BFS");

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const [shortestPath, setShortestPath] = useState([]);
  const [mstEdges, setMstEdges] = useState([]);
  const [mstWeight, setMstWeight] = useState(0);

  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const [startNode, setStartNode] = useState("A");
  const [targetNode, setTargetNode] = useState("");

  const [showEdgeModal, setShowEdgeModal] = useState(false);
  const [edgeWeight, setEdgeWeight] = useState("");
  const [pendingConnection, setPendingConnection] = useState(null);

  // --------------------------------------------------
  // SORTING STATE
  // --------------------------------------------------

  const [sortingArray, setSortingArray] = useState(
    "5, 3, 8, 1, 4"
  );


  // --------------------------------------------------
  // GRAPH NODE CHANGES
  // --------------------------------------------------

  const onNodesChange = (changes) => {
    setNodes((currentNodes) =>
      applyNodeChanges(changes, currentNodes)
    );
  };


  const onEdgesChange = (changes) => {
    setEdges((currentEdges) =>
      applyEdgeChanges(changes, currentEdges)
    );
  };


  // --------------------------------------------------
  // CONNECT EDGE
  // --------------------------------------------------

  const onConnect = (connection) => {

    // BFS and DFS do not need edge weights
    if (
      algorithm === "BFS" ||
      algorithm === "DFS"
    ) {

      const newEdge = {
        ...connection,
        id: `${connection.source}-${connection.target}-${Date.now()}`,
      };

      setEdges((currentEdges) => [
        ...currentEdges,
        newEdge,
      ]);

      return;
    }

    // Weighted algorithms
    setPendingConnection(connection);
    setEdgeWeight("");
    setShowEdgeModal(true);
  };


  // --------------------------------------------------
  // BUILD NORMAL GRAPH
  // --------------------------------------------------

  const buildGraph = () => {

    const graph = {};

    nodes.forEach((node) => {
      graph[node.id] = [];
    });

    edges.forEach((edge) => {

      if (
        graph[edge.source] &&
        graph[edge.target]
      ) {

        graph[edge.source].push(edge.target);
        graph[edge.target].push(edge.source);
      }

    });

    return graph;
  };


  // --------------------------------------------------
  // BUILD WEIGHTED GRAPH
  // --------------------------------------------------

  const buildWeightedGraph = () => {

    const graph = {};

    nodes.forEach((node) => {
      graph[node.id] = [];
    });

    edges.forEach((edge) => {

      if (
        graph[edge.source] &&
        graph[edge.target]
      ) {

        const weight = Number(
          edge.data?.weight ?? edge.label
        );

        if (
          !Number.isFinite(weight) ||
          weight <= 0
        ) {
          return;
        }

        graph[edge.source].push([
          edge.target,
          weight,
        ]);

        graph[edge.target].push([
          edge.source,
          weight,
        ]);
      }

    });

    console.log(
      "Weighted Graph:",
      graph
    );

    return graph;
  };


  // --------------------------------------------------
  // ADD NODE
  // --------------------------------------------------

  const addNode = () => {

    const nextId = String.fromCharCode(
      65 + nodes.length
    );

    const newNode = {
      id: nextId,
      position: {
        x: 250 + (nodes.length % 3) * 150,
        y:
          100 +
          Math.floor(nodes.length / 3) * 130,
      },
      data: {
        label: nextId,
      },
    };

    setNodes((currentNodes) => [
      ...currentNodes,
      newNode,
    ]);
  };


  // --------------------------------------------------
  // CLEAR GRAPH / SORTING
  // --------------------------------------------------

  const clearGraph = () => {

    setNodes([]);
    setEdges([]);

    setSteps([]);
    setCurrentStep(0);

    setIsPlaying(false);

    setShortestPath([]);
    setMstEdges([]);
    setMstWeight(0);
  };


  // --------------------------------------------------
  // RUN ALGORITHM
  // --------------------------------------------------

  const runAlgorithm = async () => {

    // -----------------------------------------------
    // SORTING VALIDATION
    // -----------------------------------------------

    if (
      algorithm === "Bubble Sort" ||
      algorithm === "Quick Sort" ||
      algorithm === "Merge Sort"
    ) {

      const array = sortingArray
        .split(",")
        .map((value) => Number(value.trim()));

      if (
        array.length === 0 ||
        array.some(
          (value) => !Number.isFinite(value)
        )
      ) {

        alert(
          "Please enter a valid number array.\nExample: 5, 3, 8, 1, 4"
        );

        return;
      }

      setLoading(true);

      try {

        const response = await fetch(
          `http://127.0.0.1:8000/api/algorithms/${algorithm === "Bubble Sort"
            ? "bubble-sort"
            : algorithm === "Quick Sort"
              ? "quick-sort"
              : "merge-sort"
          }/`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              array,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to run Bubble Sort"
          );
        }

        const data = await response.json();

        setSteps(data.steps);
        setCurrentStep(0);
        setIsPlaying(false);

        setShortestPath([]);
        setMstEdges([]);
        setMstWeight(0);

        console.log(
          "Array sent to Bubble Sort:",
          array
        );

        console.log(
          "Bubble Sort execution trace:",
          data.steps
        );

      } catch (error) {

        console.error(
          "Bubble Sort Error:",
          error
        );

        alert(
          "Failed to connect with Bubble Sort backend."
        );

      } finally {

        setLoading(false);
      }

      return;
    }


    // -----------------------------------------------
    // GRAPH VALIDATION
    // -----------------------------------------------

    if (
      !nodes.some(
        (node) => node.id === startNode
      )
    ) {

      alert(
        "Please select a valid start node."
      );

      return;
    }


    // -----------------------------------------------
    // DIJKSTRA TARGET
    // -----------------------------------------------

    if (algorithm === "Dijkstra") {

      if (
        !targetNode ||
        !nodes.some(
          (node) => node.id === targetNode
        )
      ) {

        alert(
          "Please select a valid target node."
        );

        return;
      }

      if (
        targetNode === startNode
      ) {

        alert(
          "Start node and target node cannot be the same."
        );

        return;
      }
    }


    setLoading(true);


    try {

      // -------------------------------------------
      // GRAPH TYPE
      // -------------------------------------------

      const graph =
        algorithm === "Dijkstra" ||
          algorithm === "Prim's"
          ? buildWeightedGraph()
          : buildGraph();


      // -------------------------------------------
      // API ENDPOINT
      // -------------------------------------------

      const endpoint =
        algorithm === "BFS"
          ? "bfs"
          : algorithm === "DFS"
            ? "dfs"
            : algorithm === "Dijkstra"
              ? "dijkstra"
              : "prims";


      const response = await fetch(
        `http://127.0.0.1:8000/api/algorithms/${endpoint}/`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            graph,
            start: startNode,

            ...(algorithm === "Dijkstra" && {
              target: targetNode,
            }),

          }),
        }
      );


      if (!response.ok) {

        throw new Error(
          `Failed to run ${algorithm}`
        );
      }


      const data =
        await response.json();


      setSteps(data.steps);
      setCurrentStep(0);
      setIsPlaying(false);


      console.log(
        `Graph sent to ${algorithm}:`,
        graph
      );

      console.log(
        `${algorithm} execution trace:`,
        data.steps
      );


      // -------------------------------------------
      // DIJKSTRA
      // -------------------------------------------

      if (
        algorithm === "Dijkstra"
      ) {

        const shortestPathStep =
          data.steps.find(
            (step) =>
              step.action ===
              "shortest_path"
          );


        console.log(
          "Dijkstra target sent:",
          targetNode
        );

        console.log(
          "Shortest path step:",
          shortestPathStep
        );


        if (shortestPathStep) {

          setShortestPath(
            shortestPathStep.path || []
          );

        } else {

          setShortestPath([]);
        }


        setMstEdges([]);
        setMstWeight(0);
      }


      // -------------------------------------------
      // PRIM'S
      // -------------------------------------------

      else if (
        algorithm === "Prim's"
      ) {

        const completeStep =
          data.steps.find(
            (step) =>
              step.action ===
              "complete"
          );


        console.log(
          "Prim's complete step:",
          completeStep
        );


        if (completeStep) {

          setMstEdges(
            completeStep.mst_edges ||
            []
          );

          setMstWeight(
            completeStep.total_weight ||
            0
          );

        } else {

          setMstEdges([]);
          setMstWeight(0);
        }


        setShortestPath([]);
      }


      // -------------------------------------------
      // OTHER GRAPH ALGORITHMS
      // -------------------------------------------

      else {

        setShortestPath([]);
        setMstEdges([]);
        setMstWeight(0);
      }


    } catch (error) {

      console.error(
        `${algorithm} Error:`,
        error
      );

    } finally {

      setLoading(false);
    }
  };


  // --------------------------------------------------
  // DIJKSTRA SHORTEST PATH STEP
  // --------------------------------------------------

  const getShortestPathStep = () => {

    if (
      algorithm !== "Dijkstra"
    ) {
      return null;
    }

    return steps.find(
      (step) =>
        step.action ===
        "shortest_path"
    );
  };


  // --------------------------------------------------
  // STEP CONTROLS
  // --------------------------------------------------

  const nextStep = () => {

    if (steps.length === 0) {
      return;
    }

    setCurrentStep((prev) =>
      Math.min(
        prev + 1,
        steps.length - 1
      )
    );
  };


  const previousStep = () => {

    if (steps.length === 0) {
      return;
    }

    setCurrentStep((prev) =>
      Math.max(prev - 1, 0)
    );
  };


  // --------------------------------------------------
  // PLAYBACK
  // --------------------------------------------------

  useEffect(() => {

    if (
      !isPlaying ||
      steps.length === 0
    ) {
      return;
    }

    const timer = setTimeout(() => {

      if (
        currentStep <
        steps.length - 1
      ) {

        setCurrentStep(
          (prev) => prev + 1
        );

      } else {

        setIsPlaying(false);
      }

    }, 1200 / speed);


    return () =>
      clearTimeout(timer);

  }, [
    isPlaying,
    currentStep,
    steps,
    speed,
  ]);


  // --------------------------------------------------
  // CURRENT STEP
  // --------------------------------------------------

  const currentNode =
    steps.length > 0
      ? steps[currentStep]?.current
      : null;


  const currentExecution =
    steps.length > 0
      ? steps[currentStep]
      : null;


  const visitedNodes =
    currentExecution?.visited ||
    [];


  const executionContainer =
    algorithm === "BFS"
      ? currentExecution?.queue ||
      []
      : currentExecution?.stack ||
      [];


  // --------------------------------------------------
  // NODE CLASS
  // --------------------------------------------------

  const getNodeClass = (
    nodeId
  ) => {

    if (
      nodeId === currentNode
    ) {

      return "node-current";
    }


    if (
      executionContainer.includes(
        nodeId
      )
    ) {

      return "node-queue";
    }


    if (
      visitedNodes.includes(
        nodeId
      )
    ) {

      return "node-visited";
    }


    return "node-unvisited";
  };


  // --------------------------------------------------
  // PRIM'S MST EDGES
  // --------------------------------------------------

  const getPrimMSTEdges = () => {

    if (
      algorithm !== "Prim's" ||
      !currentExecution
    ) {

      return [];
    }

    return (
      currentExecution.mst_edges ||
      []
    );
  };


  const shortestPathStep =
    getShortestPathStep();


  // --------------------------------------------------
  // SORTING STEP HELPERS
  // --------------------------------------------------

  const isSortingAlgorithm =
    algorithm === "Bubble Sort" ||
    algorithm === "Quick Sort" ||
    algorithm === "Merge Sort";


  const sortingStep =
    isSortingAlgorithm
      ? currentExecution
      : null;


  const sortingArrayValues =
    sortingStep?.array ||
    sortingArray
      .split(",")
      .map((value) =>
        Number(value.trim())
      )
      .filter(
        (value) =>
          Number.isFinite(value)
      );


  const sortingCompareIndices =
    sortingStep?.compare_indices ||
    [];


  const sortingSwapIndices =
    sortingStep?.swap_indices ||
    [];


  const sortingSortedIndices =
    sortingStep?.sorted_indices ||
    [];

  const sortingPivotIndex =
    algorithm === "Quick Sort"
      ? sortingStep?.pivot_index
      : null;

  const sortingPivot =
    algorithm === "Quick Sort"
      ? sortingStep?.pivot
      : null;

  const sortingLow =
    algorithm === "Quick Sort"
      ? sortingStep?.low
      : null;

  const sortingHigh =
    algorithm === "Quick Sort"
      ? sortingStep?.high
      : null;

  const sortingMergeIndices =
    algorithm === "Merge Sort"
      ? sortingStep?.merge_indices || []
      : [];

  const sortingLeft =
    algorithm === "Merge Sort"
      ? sortingStep?.left
      : null;

  const sortingRight =
    algorithm === "Merge Sort"
      ? sortingStep?.right
      : null;

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="app">

      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="header">

        <div className="logo">

          <span className="logo-icon">
            ⚡
          </span>

          <span>
            AlgoVision
          </span>

          <span className="ai-badge">
            AI
          </span>

        </div>


        <div className="header-right">

          <span className="status-dot"></span>

          <span>
            Algorithm Visualizer
          </span>

        </div>

      </header>


      {/* ==========================================
          MAIN
      ========================================== */}

      <main className="main-content">


        {/* ========================================
            SIDEBAR
        ======================================== */}

        <aside className="sidebar">

          <div className="sidebar-title">
            Algorithms
          </div>


          {/* GRAPH */}

          <div className="category">

            <div className="category-title">
              GRAPH
            </div>


            <button
              className={`algorithm-btn ${algorithm === "BFS"
                ? "active"
                : ""
                }`}
              onClick={() => {

                setAlgorithm("BFS");
                setSteps([]);
                setCurrentStep(0);
                setShortestPath([]);
                setMstEdges([]);
                setMstWeight(0);
                setIsPlaying(false);

              }}
            >

              <span className="algo-icon">
                ↔
              </span>

              Breadth First Search

            </button>


            <button
              className={`algorithm-btn ${algorithm === "DFS"
                ? "active"
                : ""
                }`}
              onClick={() => {

                setAlgorithm("DFS");
                setSteps([]);
                setCurrentStep(0);
                setShortestPath([]);
                setMstEdges([]);
                setMstWeight(0);
                setIsPlaying(false);

              }}
            >

              <span className="algo-icon">
                ↘
              </span>

              Depth First Search

            </button>


            <button
              className={`algorithm-btn ${algorithm === "Dijkstra"
                ? "active"
                : ""
                }`}
              onClick={() => {

                setAlgorithm("Dijkstra");
                setTargetNode("");
                setSteps([]);
                setCurrentStep(0);
                setShortestPath([]);
                setMstEdges([]);
                setMstWeight(0);
                setIsPlaying(false);

              }}
            >

              <span className="algo-icon">
                ◎
              </span>

              Dijkstra

            </button>


            <button
              className={`algorithm-btn ${algorithm === "Prim's"
                ? "active"
                : ""
                }`}
              onClick={() => {

                setAlgorithm("Prim's");
                setTargetNode("");
                setSteps([]);
                setCurrentStep(0);
                setShortestPath([]);
                setMstEdges([]);
                setMstWeight(0);
                setIsPlaying(false);

              }}
            >

              <span className="algo-icon">
                ◇
              </span>

              Prim's

            </button>

          </div>


          {/* SORTING */}

          <div className="category">

            <div className="category-title">
              SORTING
            </div>


            <button
              className={`algorithm-btn ${algorithm === "Bubble Sort"
                ? "active"
                : ""
                }`}
              onClick={() => {

                setAlgorithm(
                  "Bubble Sort"
                );

                setSteps([]);
                setCurrentStep(0);

                setShortestPath([]);
                setMstEdges([]);
                setMstWeight(0);

                setIsPlaying(false);

              }}
            >

              <span className="algo-icon">
                ⇅
              </span>

              Bubble Sort

            </button>


            <button
              className={`algorithm-btn ${algorithm === "Quick Sort"
                ? "active"
                : ""
                }`}
              onClick={() => {

                setAlgorithm("Quick Sort");

                setSteps([]);
                setCurrentStep(0);

                setShortestPath([]);
                setMstEdges([]);
                setMstWeight(0);

                setIsPlaying(false);

              }}
            >
              <span className="algo-icon">
                ⇵
              </span>

              Quick Sort
            </button>


            <button
              className={`algorithm-btn ${algorithm === "Merge Sort" ? "active" : ""
                }`}
              onClick={() => {
                setAlgorithm("Merge Sort");

                setSteps([]);
                setCurrentStep(0);

                setShortestPath([]);
                setMstEdges([]);
                setMstWeight(0);

                setIsPlaying(false);
              }}
            >
              <span className="algo-icon">
                ⇵
              </span>

              Merge Sort
            </button>

          </div>


          <div className="sidebar-bottom">

            <div className="ai-card">

              <div className="ai-card-icon">
                ✦
              </div>

              <div>

                <strong>
                  AI Tutor
                </strong>

                <p>
                  Ask anything about algorithms.
                </p>

              </div>

            </div>

          </div>

        </aside>


        {/* ========================================
            WORKSPACE
        ======================================== */}

        <section className="workspace">


          {/* WORKSPACE HEADER */}

          <div className="workspace-header">

            <div>

              <div className="breadcrumb">

                Algorithms /{" "}

                {isSortingAlgorithm
                  ? "Sorting"
                  : "Graph"}

                {" / "}

                {algorithm}

              </div>


              <h1>
                {algorithm}
              </h1>

            </div>


            <button
              className="run-button"
              onClick={runAlgorithm}
              disabled={loading}
            >

              {loading
                ? "Running..."
                : "▶ Run Algorithm"}

            </button>

          </div>


          {/* ========================================
              VISUALIZATION CARD
          ======================================== */}

          <div className="visualization-card">


            <div className="visualization-header">

              <div>

                <h2>
                  Visualization
                </h2>

                <p>

                  {isSortingAlgorithm
                    ? "Watch the array get sorted step by step."
                    : "Watch the algorithm execute step by step."}

                </p>

              </div>


              <div className="visualization-actions">

                {algorithm !==
                  "Bubble Sort" && (

                    <button
                      className="add-node-btn"
                      onClick={addNode}
                    >
                      + Add Node
                    </button>

                  )}


                <div className="live-indicator">

                  <span></span>

                  Ready

                </div>

              </div>

            </div>


            {/* ======================================
                BUBBLE SORT TOOLBAR
            ====================================== */}

            {isSortingAlgorithm && (

              <div className="graph-editor-toolbar">

                <div className="start-node-control">

                  <label>
                    Array
                  </label>

                  <input
                    type="text"
                    value={sortingArray}
                    onChange={(e) =>
                      setSortingArray(
                        e.target.value
                      )
                    }
                    placeholder="5, 3, 8, 1, 4"
                    className="sorting-array-input"
                  />

                </div>


                <button
                  className="clear-graph-btn"
                  onClick={() => {

                    setSortingArray("");
                    setSteps([]);
                    setCurrentStep(0);
                    setIsPlaying(false);

                  }}
                >
                  Clear
                </button>

              </div>

            )}


            {/* ======================================
                GRAPH TOOLBAR
            ====================================== */}

            {!isSortingAlgorithm && (

              <div className="graph-editor-toolbar">

                <div className="editor-hint">

                  Select node/edge and press Backspace

                </div>


                <button
                  className="clear-graph-btn"
                  onClick={clearGraph}
                >
                  Clear Graph
                </button>


                <div className="start-node-control">

                  <label>
                    Start Node
                  </label>

                  <select
                    value={startNode}
                    onChange={(e) =>
                      setStartNode(
                        e.target.value
                      )
                    }
                  >

                    {nodes.map(
                      (node) => (

                        <option
                          key={node.id}
                          value={node.id}
                        >
                          {node.id}
                        </option>

                      )
                    )}

                  </select>

                </div>


                {algorithm ===
                  "Dijkstra" && (

                    <div className="start-node-control">

                      <label>
                        Target Node
                      </label>


                      <select
                        value={targetNode}
                        onChange={(e) =>
                          setTargetNode(
                            e.target.value
                          )
                        }
                      >

                        <option value="">
                          Select Target
                        </option>


                        {nodes
                          .filter(
                            (node) =>
                              node.id !==
                              startNode
                          )
                          .map(
                            (node) => (

                              <option
                                key={node.id}
                                value={node.id}
                              >
                                {node.id}
                              </option>

                            )
                          )}

                      </select>

                    </div>

                  )}

              </div>

            )}


            {/* ======================================
                BUBBLE SORT VISUALIZATION
            ====================================== */}

            {isSortingAlgorithm ? (

              <div className="graph-area sorting-area">

                <div className="sorting-visualization">

                  {sortingArrayValues.map(
                    (value, index) => {

                      const isComparing =
                        sortingCompareIndices.includes(
                          index
                        );

                      const isSwapping =
                        sortingSwapIndices.includes(
                          index
                        );

                      const isSorted =
                        sortingSortedIndices.includes(
                          index
                        );


                      const isMerging =
                        algorithm === "Merge Sort" &&
                        sortingMergeIndices.includes(index);


                      let className =
                        "sorting-box";


                      if (isSorted) {

                        className +=
                          " sorting-sorted";

                      } else if (isSwapping) {

                        className +=
                          " sorting-swap";

                      } else if (isComparing) {

                        className +=
                          " sorting-compare";

                      } else if (isMerging) {

                        className +=
                          " sorting-merge";
                      }

                      if (
                        algorithm === "Quick Sort" &&
                        sortingPivotIndex === index
                      ) {

                        className +=
                          " sorting-pivot";
                      }


                      return (
                        <div
                          className={
                            className
                          }
                          key={`${index}-${value}`}
                        >

                          <span>
                            {value}
                          </span>

                          <small>
                            {index}
                          </small>

                        </div>
                      );

                    }
                  )}

                </div>


                {sortingStep && (

                  <div className="sorting-status">

                    <div>
                      Comparisons:{" "}
                      <strong>
                        {sortingStep.comparisons ??
                          0}
                      </strong>
                    </div>

                    <div>
                      Swaps:{" "}
                      <strong>
                        {sortingStep.swaps ??
                          0}
                      </strong>
                    </div>
                    {algorithm === "Merge Sort" && (
                      <>
                        <div>
                          Action:{" "}
                          <strong>
                            {sortingStep?.action || "—"}
                          </strong>
                        </div>

                        <div>
                          Range:{" "}
                          <strong>
                            {sortingLeft ?? "—"} – {sortingRight ?? "—"}
                          </strong>
                        </div>
                      </>
                    )}
                    {algorithm === "Quick Sort" && (
                      <>
                        <div>
                          Pivot:{" "}
                          <strong>
                            {sortingPivot ?? "—"}
                          </strong>
                        </div>

                        <div>
                          Range:{" "}
                          <strong>
                            {sortingLow ?? "—"} – {sortingHigh ?? "—"}
                          </strong>
                        </div>
                      </>
                    )}

                  </div>

                )}

              </div>

            ) : (

              /* ====================================
                 REAL REACT FLOW GRAPH
              ==================================== */

              <div className="graph-area">

                <ReactFlow

                  nodes={nodes.map(
                    (node) => ({
                      ...node,

                      className:
                        getNodeClass(
                          node.id
                        ),
                    })
                  )}


                  edges={edges.map(
                    (edge) => {

                      // --------------------------------
                      // DIJKSTRA SHORTEST PATH
                      // --------------------------------

                      const isShortestPath =
                        algorithm ===
                        "Dijkstra" &&
                        shortestPath.length >
                        1 &&
                        shortestPath.some(
                          (
                            node,
                            index
                          ) => {

                            if (
                              index >=
                              shortestPath.length -
                              1
                            ) {

                              return false;
                            }

                            const nextNode =
                              shortestPath[
                              index + 1
                              ];


                            return (

                              (
                                edge.source ===
                                node &&
                                edge.target ===
                                nextNode
                              ) ||

                              (
                                edge.source ===
                                nextNode &&
                                edge.target ===
                                node
                              )

                            );

                          }
                        );


                      // --------------------------------
                      // PRIM'S MST
                      // --------------------------------

                      const primMSTEdges =
                        getPrimMSTEdges();


                      const isMSTEdge =
                        algorithm ===
                        "Prim's" &&
                        primMSTEdges.some(
                          (mstEdge) => {

                            const source =
                              mstEdge[0];

                            const target =
                              mstEdge[1];


                            return (

                              (
                                edge.source ===
                                source &&
                                edge.target ===
                                target
                              ) ||

                              (
                                edge.source ===
                                target &&
                                edge.target ===
                                source
                              )

                            );

                          }
                        );


                      const isHighlighted =
                        isShortestPath ||
                        isMSTEdge;


                      return {

                        ...edge,

                        animated:
                          isHighlighted,


                        style: {

                          ...edge.style,

                          stroke:
                            isHighlighted
                              ? "#22c55e"
                              : "#6366f1",

                          strokeWidth:
                            isHighlighted
                              ? 5
                              : 2,

                          filter:
                            isHighlighted
                              ? "drop-shadow(0 0 7px #22c55e)"
                              : "none",

                        },


                        labelStyle: {

                          ...edge.labelStyle,

                          fill:
                            isHighlighted
                              ? "#22c55e"
                              : undefined,

                          fontWeight:
                            isHighlighted
                              ? 700
                              : undefined,

                        },


                        labelBgStyle:
                          isHighlighted
                            ? {
                              fill:
                                "#0f172a",

                              fillOpacity:
                                0.9,
                            }
                            : edge.labelBgStyle,

                      };

                    }
                  )}


                  onNodesChange={
                    onNodesChange
                  }

                  onEdgesChange={
                    onEdgesChange
                  }

                  onConnect={
                    onConnect
                  }

                  fitView

                  nodesDraggable={
                    true
                  }

                  nodesConnectable={
                    true
                  }

                  zoomOnScroll={
                    true
                  }

                  panOnScroll={
                    true
                  }

                >

                  <Background />

                  <Controls />

                  <MiniMap />

                </ReactFlow>

              </div>

            )}


            {/* ======================================
                GRAPH LEGEND
            ====================================== */}

            {algorithm !==
              "Bubble Sort" && (

                <div className="graph-legend">

                  <div className="legend-item">

                    <span className="legend-dot current"></span>

                    Current

                  </div>


                  <div className="legend-item">

                    <span className="legend-dot visited"></span>

                    Visited

                  </div>


                  <div className="legend-item">

                    <span className="legend-dot queue"></span>

                    {algorithm ===
                      "BFS"
                      ? "Queue"
                      : "Stack"}

                  </div>


                  <div className="legend-item">

                    <span className="legend-dot unvisited"></span>

                    Unvisited

                  </div>

                </div>

              )}


            {/* ======================================
                SORTING LEGEND
            ====================================== */}

            {algorithm ===
              "Bubble Sort" && (

                <div className="graph-legend">

                  <div className="legend-item">

                    <span className="legend-dot sorting-legend-compare"></span>

                    Comparing

                  </div>


                  <div className="legend-item">

                    <span className="legend-dot sorting-legend-swap"></span>

                    Swapping

                  </div>


                  <div className="legend-item">

                    <span className="legend-dot sorting-legend-sorted"></span>

                    Sorted

                  </div>

                  {algorithm === "Merge Sort" && (
                    <div className="legend-item">

                      <span className="legend-dot sorting-legend-merge"></span>

                      Merge

                    </div>
                  )}

                  {algorithm === "Quick Sort" && (
                    <div className="legend-item">

                      <span className="legend-dot sorting-legend-pivot"></span>

                      Pivot

                    </div>
                  )}

                </div>

              )}


            {/* ======================================
                EDGE MODAL
            ====================================== */}

            {showEdgeModal && (

              <div className="edge-modal-overlay">

                <div className="edge-modal">

                  <div className="edge-modal-header">

                    <h3>
                      Add Edge Weight
                    </h3>


                    <button
                      className="edge-modal-close"
                      onClick={() => {

                        setPendingConnection(
                          null
                        );

                        setEdgeWeight("");

                        setShowEdgeModal(
                          false
                        );

                      }}
                    >
                      ×
                    </button>

                  </div>


                  <p className="edge-modal-description">

                    Enter a weight for this edge.

                  </p>


                  <label className="edge-weight-label">

                    Weight

                  </label>


                  <input
                    type="number"
                    min="1"
                    value={edgeWeight}
                    onChange={(e) =>
                      setEdgeWeight(
                        e.target.value
                      )
                    }
                    placeholder="Enter weight"
                    className="edge-weight-input"
                  />


                  <div className="edge-modal-actions">

                    <button
                      className="edge-cancel-btn"
                      onClick={() => {

                        setPendingConnection(
                          null
                        );

                        setEdgeWeight("");

                        setShowEdgeModal(
                          false
                        );

                      }}
                    >
                      Cancel
                    </button>


                    <button
                      className="edge-add-btn"
                      onClick={() => {

                        const weight =
                          Number(
                            edgeWeight
                          );


                        if (
                          !pendingConnection
                        ) {
                          return;
                        }


                        if (
                          !weight ||
                          weight <= 0
                        ) {

                          alert(
                            "Please enter a valid positive weight."
                          );

                          return;
                        }


                        const newEdge = {

                          ...pendingConnection,

                          id:
                            `${pendingConnection.source}-${pendingConnection.target}-${Date.now()}`,

                          label:
                            String(weight),

                          data: {
                            weight,
                          },

                        };


                        setEdges(
                          (
                            currentEdges
                          ) => [
                              ...currentEdges,
                              newEdge,
                            ]
                        );


                        setPendingConnection(
                          null
                        );

                        setEdgeWeight("");

                        setShowEdgeModal(
                          false
                        );

                      }}
                    >

                      Add Edge

                    </button>

                  </div>

                </div>

              </div>

            )}


            {/* ======================================
                CONTROLS
            ====================================== */}

            <div className="controls">

              <button
                className="control-btn"
                onClick={
                  previousStep
                }
              >
                ↶
              </button>


              <button
                className="control-btn play"
                onClick={() =>
                  setIsPlaying(
                    (prev) => !prev
                  )
                }
                disabled={
                  steps.length === 0
                }
              >

                {isPlaying
                  ? "⏸"
                  : "▶"}

              </button>


              <button
                className="control-btn"
                onClick={
                  nextStep
                }
              >
                ↷
              </button>


              <div className="speed-control">

                <span>
                  Speed
                </span>


                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.5"
                  value={speed}
                  onChange={(e) =>
                    setSpeed(
                      Number(
                        e.target.value
                      )
                    )
                  }
                />


                <span>
                  {speed}x
                </span>

              </div>


              <button
                className="reset-btn"
                onClick={() => {

                  setCurrentStep(0);

                  setIsPlaying(false);

                  setShortestPath([]);

                  setMstEdges([]);

                  setMstWeight(0);

                }}
              >

                ↻ Reset

              </button>

            </div>

          </div>


          {/* ========================================
              INFORMATION
          ======================================== */}

          <div className="bottom-grid">


            {/* ======================================
                SORTING STEP CARD
            ====================================== */}

            {algorithm ===
              "Bubble Sort" ? (

              <div className="step-card">

                <div className="step-header">

                  <span>
                    EXECUTION STEP
                  </span>


                  <strong>

                    {steps.length > 0
                      ? `${currentStep + 1} / ${steps.length}`
                      : "0 / 0"}

                  </strong>

                </div>


                <h3>

                  {steps.length > 0
                    ? steps[
                      currentStep
                    ]?.message
                    : "Ready to start Bubble Sort"}

                </h3>


                <div className="queue-display">

                  <span className="queue-label">
                    ARRAY
                  </span>


                  <div className="queue-items">

                    {sortingArrayValues.map(
                      (
                        value,
                        index
                      ) => (

                        <span
                          className="queue-item"
                          key={`${index}-${value}`}
                        >
                          {value}
                        </span>

                      )
                    )}

                  </div>

                </div>

              </div>

            ) : (

              /* ====================================
                 GRAPH STEP CARD
              ==================================== */

              <div className="step-card">

                <div className="step-header">

                  <span>
                    EXECUTION STEP
                  </span>


                  <strong>

                    {steps.length > 0
                      ? `${currentStep + 1} / ${steps.length}`
                      : "0 / 0"}

                  </strong>

                </div>


                <h3>

                  {steps.length > 0
                    ? steps[
                      currentStep
                    ]?.message
                    : `Ready to start ${algorithm}`}

                </h3>


                <div className="queue-display">

                  <span className="queue-label">

                    {algorithm ===
                      "BFS"
                      ? "QUEUE"
                      : "STACK"}

                  </span>


                  <div className="queue-items">

                    {executionContainer.length >
                      0 ? (

                      executionContainer.map(
                        (node) => (

                          <span
                            className="queue-item"
                            key={node}
                          >
                            {node}
                          </span>

                        )
                      )

                    ) : (

                      <span className="queue-empty">
                        Empty
                      </span>

                    )}

                  </div>

                </div>

              </div>

            )}


            {/* ======================================
                COMPLEXITY
            ====================================== */}

            <div className="complexity-card">

              <div className="complexity-title">

                {algorithm} Complexity

              </div>


              {algorithm ===
                "Bubble Sort" ? (

                <>

                  <div className="complexity-row">

                    <span>
                      Time
                    </span>

                    <strong>
                      O(n²)
                    </strong>

                  </div>


                  <div className="complexity-row">

                    <span>
                      Space
                    </span>

                    <strong>
                      O(1)
                    </strong>

                  </div>


                  <div className="complexity-note">

                    <div>

                      <strong>
                        n
                      </strong>

                      <span>
                        Array Size
                      </span>

                    </div>

                  </div>

                </>

              ) : algorithm === "Quick Sort" ? (

                <>

                  <div className="complexity-row">

                    <span>
                      Average Time
                    </span>

                    <strong>
                      O(n log n)
                    </strong>

                  </div>


                  <div className="complexity-row">

                    <span>
                      Worst Time
                    </span>

                    <strong>
                      O(n²)
                    </strong>

                  </div>


                  <div className="complexity-row">

                    <span>
                      Space
                    </span>

                    <strong>
                      O(log n)
                    </strong>

                  </div>


                  <div className="complexity-note">

                    <div>

                      <strong>
                        n
                      </strong>

                      <span>
                        Array Size
                      </span>

                    </div>

                  </div>

                </>

                ) : algorithm === "Merge Sort" ? (

                  <>

                    <div className="complexity-row">

                      <span>
                        Time
                      </span>

                      <strong>
                        O(n log n)
                      </strong>

                    </div>

                    <div className="complexity-row">

                      <span>
                        Space
                      </span>

                      <strong>
                        O(n)
                      </strong>

                    </div>

                    <div className="complexity-note">

                      <div>

                        <strong>
                          n
                        </strong>

                        <span>
                          Array Size
                        </span>

                      </div>

                    </div>

                  </>

                ) : (

                <>

                  <div className="complexity-row">

                    <span>
                      Time
                    </span>

                    <strong>
                      O(V + E)
                    </strong>

                  </div>


                  <div className="complexity-row">

                    <span>
                      Space
                    </span>

                    <strong>
                      O(V)
                    </strong>

                  </div>


                  <div className="complexity-note">

                    <div>

                      <strong>
                        V
                      </strong>

                      <span>
                        Vertices
                      </span>

                    </div>


                    <div>

                      <strong>
                        E
                      </strong>

                      <span>
                        Edges
                      </span>

                    </div>

                  </div>

                </>

              )}

            </div>


            {/* ======================================
                DIJKSTRA RESULT
            ====================================== */}

            {algorithm ===
              "Dijkstra" && (

                <div className="shortest-path-card">

                  <div className="shortest-path-header">

                    <span>
                      Shortest Path
                    </span>


                    {shortestPathStep && (

                      <span className="shortest-distance">

                        Distance:{" "}

                        {
                          shortestPathStep.distance ??
                          "∞"
                        }

                      </span>

                    )}

                  </div>


                  <div className="shortest-path-content">

                    {shortestPathStep?.path
                      ?.length > 0 ? (

                      <div className="path-sequence">

                        {shortestPathStep.path.map(
                          (
                            node,
                            index
                          ) => (

                            <Fragment
                              key={`${node}-${index}`}
                            >

                              <span className="path-node">

                                {node}

                              </span>


                              {index <
                                shortestPathStep
                                  .path
                                  .length -
                                1 && (

                                  <span className="path-arrow">

                                    →

                                  </span>

                                )}

                            </Fragment>

                          )
                        )}

                      </div>

                    ) : (

                      <span className="no-path">

                        Run Dijkstra to find the shortest path.

                      </span>

                    )}

                  </div>

                </div>

              )}


            {/* ======================================
                PRIM'S RESULT
            ====================================== */}

            {algorithm ===
              "Prim's" && (

                <div className="shortest-path-card">

                  <div className="shortest-path-header">

                    <span>
                      Minimum Spanning Tree
                    </span>


                    <span className="shortest-distance">

                      Total Weight:{" "}

                      {mstWeight}

                    </span>

                  </div>


                  <div className="mst-result-list">

                    {mstEdges.length >
                      0 ? (

                      mstEdges.map(
                        (
                          mstEdge,
                          index
                        ) => {

                          const source =
                            mstEdge[0];

                          const target =
                            mstEdge[1];

                          const weight =
                            mstEdge[2];


                          return (

                            <div
                              className="mst-result-row"
                              key={`${source}-${target}-${index}`}
                            >

                              <span className="mst-result-number">
                                {index + 1}
                              </span>


                              <span className="mst-result-node">
                                {source}
                              </span>


                              <span className="mst-result-arrow">
                                →
                              </span>


                              <span className="mst-result-node">
                                {target}
                              </span>


                              <span className="mst-result-weight">
                                {weight}
                              </span>

                            </div>

                          );

                        }
                      )

                    ) : (

                      <span className="no-path">

                        Run Prim's to generate the Minimum Spanning Tree.

                      </span>

                    )}

                  </div>

                </div>

              )}


            {/* ======================================
                BUBBLE SORT RESULT
            ====================================== */}

            {isSortingAlgorithm && (

              <div className="shortest-path-card">

                <div className="shortest-path-header">

                  <span>
                    Sorted Array
                  </span>


                  {sortingStep && (

                    <span className="shortest-distance">

                      Swaps:{" "}

                      {sortingStep.swaps ??
                        0}

                    </span>

                  )}

                </div>


                <div className="shortest-path-content">

                  {sortingStep?.array ? (

                    <div className="path-sequence">

                      {sortingStep.array.map(
                        (
                          value,
                          index
                        ) => (

                          <Fragment
                            key={`${value}-${index}`}
                          >

                            <span className="path-node">

                              {value}

                            </span>


                            {index <
                              sortingStep
                                .array
                                .length -
                              1 && (

                                <span className="path-arrow">

                                  →

                                </span>

                              )}

                          </Fragment>

                        )
                      )}

                    </div>

                  ) : (

                    <span className="no-path">

                      Run {algorithm} to sort the array.

                    </span>

                  )}

                </div>

              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}


export default App;