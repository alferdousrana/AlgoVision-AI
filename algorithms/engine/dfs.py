def dfs(graph, start):
    steps = []
    visited = set()
    stack = [start]

    steps.append({
        "action": "initialize",
        "current": None,
        "stack": stack.copy(),
        "visited": list(visited),
        "message": f"Starting DFS from node {start}",
    })

    while stack:
        current = stack.pop()

        if current in visited:
            continue

        visited.add(current)

        steps.append({
            "action": "visit",
            "current": current,
            "stack": stack.copy(),
            "visited": list(visited),
            "message": f"Visiting node {current}",
        })

        neighbors = graph.get(current, [])

        for neighbor in reversed(neighbors):

            steps.append({
                "action": "check_neighbor",
                "current": current,
                "neighbor": neighbor,
                "stack": stack.copy(),
                "visited": list(visited),
                "message": f"Checking neighbor {neighbor} of {current}",
            })

            if neighbor not in visited and neighbor not in stack:
                stack.append(neighbor)

                steps.append({
                    "action": "push",
                    "current": current,
                    "neighbor": neighbor,
                    "stack": stack.copy(),
                    "visited": list(visited),
                    "message": f"Added {neighbor} to the stack",
                })

    steps.append({
        "action": "complete",
        "current": None,
        "stack": stack.copy(),
        "visited": list(visited),
        "message": "DFS traversal completed",
    })

    return steps