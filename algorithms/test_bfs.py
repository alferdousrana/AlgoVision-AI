from engine.bfs import bfs


graph = {
    "A": ["B", "C"],
    "B": ["D", "E"],
    "C": ["F"],
    "D": [],
    "E": [],
    "F": []
}


steps = bfs(graph, "A")


for i, step in enumerate(steps, start=1):
    print(f"\nStep {i}")
    print(step)