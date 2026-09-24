import heapq


def safe_distances(distances):
    return {
        node: None if distance == float("inf") else distance
        for node, distance in distances.items()
    }


def dijkstra(graph, start, target=None):
    steps = []

    # Initial distances
    distances = {
        node: float("inf")
        for node in graph
    }

    distances[start] = 0

    # Store previous node for shortest path reconstruction
    previous = {
        node: None
        for node in graph
    }

    visited = set()

    # Priority queue
    # Format: (distance, target_priority, node)
    #
    # target_priority:
    # 0 = target node
    # 1 = normal node
    #
    # This makes the target node come first
    # when multiple nodes have the same distance.
    priority_queue = [(0, 0 if start == target else 1, start)]

    # Initial state
    steps.append({
        "action": "initialize",
        "current": None,
        "distances": safe_distances(distances),
        "visited": list(visited),
        "priority_queue": priority_queue.copy(),
        "message": f"Starting Dijkstra from node {start}",
    })

    # Main Dijkstra loop
    while priority_queue:

        current_distance, _, current = heapq.heappop(
            priority_queue
        )

        # Skip already visited nodes
        if current in visited:
            continue

        visited.add(current)

        # Visit step
        steps.append({
            "action": "visit",
            "current": current,
            "distances": safe_distances(distances),
            "visited": list(visited),
            "priority_queue": priority_queue.copy(),
            "message": f"Visiting node {current}",
        })

        # If target is reached, stop immediately
        if target and current == target:
            break

        # Check all neighbors
        for neighbor, weight in graph[current]:

            steps.append({
                "action": "check_neighbor",
                "current": current,
                "neighbor": neighbor,
                "weight": weight,
                "distances": safe_distances(distances),
                "visited": list(visited),
                "priority_queue": priority_queue.copy(),
                "message": (
                    f"Checking edge {current} → {neighbor} "
                    f"with weight {weight}"
                ),
            })

            # Calculate new distance
            new_distance = current_distance + weight

            # Relaxation
            if new_distance < distances[neighbor]:

                distances[neighbor] = new_distance
                previous[neighbor] = current

                # Target gets priority when distances are equal
                target_priority = (
                    0 if neighbor == target else 1
                )

                heapq.heappush(
                    priority_queue,
                    (
                        new_distance,
                        target_priority,
                        neighbor
                    )
                )

                steps.append({
                    "action": "update_distance",
                    "current": current,
                    "neighbor": neighbor,
                    "weight": weight,
                    "distance": new_distance,
                    "distances": safe_distances(distances),
                    "visited": list(visited),
                    "priority_queue": priority_queue.copy(),
                    "message": (
                        f"Updated distance of {neighbor} "
                        f"to {new_distance}"
                    ),
                })

    # Reconstruct shortest path
    shortest_path = []

    if target:

        if distances[target] != float("inf"):

            current = target

            while current is not None:
                shortest_path.append(current)
                current = previous[current]

            shortest_path.reverse()

        steps.append({
            "action": "shortest_path",
            "target": target,
            "distance": (
                None
                if distances[target] == float("inf")
                else distances[target]
            ),
            "path": shortest_path,
            "message": (
                f"Shortest path to {target} found"
                if shortest_path
                else f"No path found to {target}"
            ),
        })

    # Final state
    steps.append({
        "action": "complete",
        "current": None,
        "distances": safe_distances(distances),
        "previous": previous,
        "visited": list(visited),
        "priority_queue": [],
        "target": target,
        "shortest_path": shortest_path,
        "message": "Dijkstra completed",
    })

    return steps