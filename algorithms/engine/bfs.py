from collections import deque


def bfs(graph, start):

    visited = set()
    queue = deque([start])
    steps = []

    # Initial state
    steps.append({
        "action": "initialize",
        "current": None,
        "queue": list(queue),
        "visited": list(visited),
        "message": f"Starting BFS from node {start}"
    })

    while queue:
        node = queue.popleft()

        # Skip already visited nodes
        if node in visited:
            continue

        visited.add(node)

        # Node is being processed
        steps.append({
            "action": "visit",
            "current": node,
            "queue": list(queue),
            "visited": list(visited),
            "message": f"Visiting node {node}"
        })

        for neighbor in graph.get(node, []):
            # Show comparison
            steps.append({
                "action": "check_neighbor",
                "current": node,
                "neighbor": neighbor,
                "queue": list(queue),
                "visited": list(visited),
                "message": f"Checking neighbor {neighbor} of {node}"
            })

            if neighbor not in visited and neighbor not in queue:
                queue.append(neighbor)

                steps.append({
                    "action": "enqueue",
                    "current": node,
                    "neighbor": neighbor,
                    "queue": list(queue),
                    "visited": list(visited),
                    "message": f"Added {neighbor} to the queue"
                })

    # Finished
    steps.append({
        "action": "complete",
        "current": None,
        "queue": list(queue),
        "visited": list(visited),
        "message": "BFS traversal completed"
    })

    return steps