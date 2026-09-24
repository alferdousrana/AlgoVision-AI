def prims(graph, start):
    steps = []

    # All nodes
    nodes = list(graph.keys())

    if not nodes:
        return steps

    # Track nodes already included in MST
    visited = set()

    # MST edges
    mst_edges = []

    # Total MST weight
    total_weight = 0

    # Start from selected node
    visited.add(start)

    steps.append({
        "action": "initialize",
        "current": start,
        "visited": list(visited),
        "mst_edges": [],
        "total_weight": 0,
        "message": f"Starting Prim's algorithm from node {start}",
    })

    # Continue until all nodes are included
    while len(visited) < len(nodes):

        minimum_edge = None
        minimum_weight = float("inf")

        # Check edges from visited nodes
        for current in visited:

            for neighbor, weight in graph[current]:

                # Only consider edges going to an unvisited node
                if neighbor not in visited:

                    steps.append({
                        "action": "check_edge",
                        "current": current,
                        "neighbor": neighbor,
                        "weight": weight,
                        "visited": list(visited),
                        "mst_edges": mst_edges.copy(),
                        "total_weight": total_weight,
                        "message": (
                            f"Checking edge {current} → {neighbor} "
                            f"with weight {weight}"
                        ),
                    })

                    # Find minimum edge
                    if weight < minimum_weight:
                        minimum_weight = weight
                        minimum_edge = (
                            current,
                            neighbor,
                            weight
                        )

        # No connecting edge means graph is disconnected
        if minimum_edge is None:

            steps.append({
                "action": "disconnected",
                "current": None,
                "visited": list(visited),
                "mst_edges": mst_edges.copy(),
                "total_weight": total_weight,
                "message": (
                    "Graph is disconnected. "
                    "Minimum Spanning Tree cannot be completed."
                ),
            })

            break

        # Select minimum edge
        current, neighbor, weight = minimum_edge

        visited.add(neighbor)

        mst_edges.append([
            current,
            neighbor,
            weight
        ])

        total_weight += weight

        steps.append({
            "action": "add_edge",
            "current": current,
            "neighbor": neighbor,
            "weight": weight,
            "visited": list(visited),
            "mst_edges": mst_edges.copy(),
            "total_weight": total_weight,
            "message": (
                f"Added edge {current} → {neighbor} "
                f"with weight {weight}"
            ),
        })

        # Node added to MST
        steps.append({
            "action": "visit",
            "current": neighbor,
            "visited": list(visited),
            "mst_edges": mst_edges.copy(),
            "total_weight": total_weight,
            "message": (
                f"Added node {neighbor} to the MST"
            ),
        })

    # Final result
    completed = len(visited) == len(nodes)

    steps.append({
        "action": "complete",
        "current": None,
        "visited": list(visited),
        "mst_edges": mst_edges.copy(),
        "total_weight": total_weight,
        "message": (
            "Prim's algorithm completed"
            if completed
            else "Prim's algorithm stopped because the graph is disconnected"
        ),
    })

    return steps