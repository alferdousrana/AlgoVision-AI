from django.urls import path
from .views import bfs_api, dfs_api, dijkstra_api, prims_api, bubble_sort_api, quick_sort_api,merge_sort_api


urlpatterns = [
    path("bfs/", bfs_api, name="bfs-api"),
    path("dfs/", dfs_api, name="dfs-api"),
    path("dijkstra/", dijkstra_api, name="dijkstra_api"),
    path("prims/", prims_api, name="prims-api"),
    path("bubble-sort/", bubble_sort_api, name="bubble-sort-api"),
    path("quick-sort/", quick_sort_api, name="quick_sort_api"),
    path("merge-sort/", merge_sort_api, name="merge_sort_api"),
]