from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .engine.bfs import bfs
from .engine.dfs import dfs
from .engine.dijkstra import dijkstra
from .engine.prims import prims
from .engine.bubble_sort import bubble_sort
from .engine.quick_sort import quick_sort
from .engine.merge_sort import merge_sort


@api_view(["POST"])
def bfs_api(request):

    graph = request.data.get("graph")
    start = request.data.get("start")

    if not graph or not start:
        return Response(
            {
                "error": "Both graph and start node are required."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if start not in graph:
        return Response(
            {
                "error": f"Start node '{start}' does not exist in the graph."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    steps = bfs(graph, start)

    return Response(
        {
            "algorithm": "BFS",
            "start": start,
            "steps": steps,
        }
    )
    
@api_view(["POST"])
def dfs_api(request):
    graph = request.data.get("graph", {})
    start = request.data.get("start")

    if not graph:
        return Response(
            {"error": "Graph is required."},
            status=400
        )

    if not start:
        return Response(
            {"error": "Start node is required."},
            status=400
        )

    if start not in graph:
        return Response(
            {"error": "Start node does not exist in graph."},
            status=400
        )

    steps = dfs(graph, start)

    return Response({
        "algorithm": "DFS",
        "start": start,
        "steps": steps,
    })
    
    
@api_view(["POST"])
def dijkstra_api(request):
    graph = request.data.get("graph", {})
    start = request.data.get("start")
    target = request.data.get("target")

    if not graph or not start:
        return Response(
            {"error": "Graph and start node are required."},
            status=400
        )

    if start not in graph:
        return Response(
            {"error": f"Start node '{start}' does not exist in graph."},
            status=400
        )

    if not target:
        return Response(
            {"error": "Target node is required for Dijkstra."},
            status=400
        )

    if target not in graph:
        return Response(
            {"error": f"Target node '{target}' does not exist in graph."},
            status=400
        )

    try:
        steps = dijkstra(graph, start, target)

        return Response({
            "algorithm": "Dijkstra",
            "start": start,
            "target": target,
            "steps": steps,
        })

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=400
        )

@api_view(["POST"])
def prims_api(request):
    graph = request.data.get("graph", {})
    start = request.data.get("start")

    if not graph:
        return Response(
            {"error": "Graph is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not start:
        return Response(
            {"error": "Start node is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if start not in graph:
        return Response(
            {"error": "Start node does not exist in graph."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        steps = prims(graph, start)

        return Response({
            "algorithm": "Prim's",
            "start": start,
            "steps": steps,
        })

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
        
@api_view(["POST"])
def bubble_sort_api(request):

    array = request.data.get("array")

    if not isinstance(array, list):
        return Response(
            {"error": "Array must be provided as a list."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(array) == 0:
        return Response(
            {"error": "Array cannot be empty."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Convert values to numbers
        array = [int(value) for value in array]

        steps = bubble_sort(array)

        return Response({
            "algorithm": "Bubble Sort",
            "array": array,
            "steps": steps,
        })

    except (ValueError, TypeError):
        return Response(
            {"error": "Array must contain only numbers."},
            status=status.HTTP_400_BAD_REQUEST
        )
        
@api_view(["POST"])
def quick_sort_api(request):

    array = request.data.get("array")

    if not isinstance(array, list):
        return Response(
            {"error": "Array must be provided as a list."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(array) == 0:
        return Response(
            {"error": "Array cannot be empty."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Convert values to numbers
        array = [int(value) for value in array]

        steps = quick_sort(array)

        return Response({
            "algorithm": "Quick Sort",
            "array": array,
            "steps": steps,
        })

    except (ValueError, TypeError):
        return Response(
            {"error": "Array must contain only numbers."},
            status=status.HTTP_400_BAD_REQUEST
        )
        
        
@api_view(["POST"])
def merge_sort_api(request):

    array = request.data.get("array")

    if not isinstance(array, list):
        return Response(
            {"error": "Array must be provided as a list."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(array) == 0:
        return Response(
            {"error": "Array cannot be empty."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Convert values to numbers
        array = [int(value) for value in array]

        steps = merge_sort(array)

        return Response({
            "algorithm": "Merge Sort",
            "array": array,
            "steps": steps,
        })

    except (ValueError, TypeError):
        return Response(
            {"error": "Array must contain only numbers."},
            status=status.HTTP_400_BAD_REQUEST
        )