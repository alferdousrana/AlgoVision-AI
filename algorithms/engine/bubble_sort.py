def bubble_sort(array):
    steps = []

    arr = array.copy()
    n = len(arr)

    comparisons = 0
    swaps = 0

    # Initial state
    steps.append({
        "action": "initialize",
        "array": arr.copy(),
        "compare_indices": [],
        "swap_indices": [],
        "sorted_indices": [],
        "comparisons": comparisons,
        "swaps": swaps,
        "message": "Starting Bubble Sort",
    })

    # Bubble Sort
    for i in range(n):

        swapped = False

        for j in range(0, n - i - 1):

            comparisons += 1

            # Compare two adjacent elements
            steps.append({
                "action": "compare",
                "array": arr.copy(),
                "compare_indices": [j, j + 1],
                "swap_indices": [],
                "sorted_indices": list(range(n - i, n)),
                "comparisons": comparisons,
                "swaps": swaps,
                "message": (
                    f"Comparing {arr[j]} and {arr[j + 1]}"
                ),
            })

            # Swap if needed
            if arr[j] > arr[j + 1]:

                arr[j], arr[j + 1] = arr[j + 1], arr[j]

                swaps += 1
                swapped = True

                steps.append({
                    "action": "swap",
                    "array": arr.copy(),
                    "compare_indices": [],
                    "swap_indices": [j, j + 1],
                    "sorted_indices": list(range(n - i, n)),
                    "comparisons": comparisons,
                    "swaps": swaps,
                    "message": (
                        f"Swapped {arr[j]} and {arr[j + 1]}"
                    ),
                })

        # Current largest element is now in final position
        sorted_index = n - i - 1

        steps.append({
            "action": "sorted",
            "array": arr.copy(),
            "compare_indices": [],
            "swap_indices": [],
            "sorted_indices": list(
                range(sorted_index, n)
            ),
            "comparisons": comparisons,
            "swaps": swaps,
            "message": (
                f"Element {arr[sorted_index]} "
                f"is in its final position"
            ),
        })

        # Already sorted
        if not swapped:
            break

    # Final state
    steps.append({
        "action": "complete",
        "array": arr.copy(),
        "compare_indices": [],
        "swap_indices": [],
        "sorted_indices": list(range(n)),
        "comparisons": comparisons,
        "swaps": swaps,
        "message": "Bubble Sort completed",
    })

    return steps