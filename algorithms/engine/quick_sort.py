def quick_sort(array):
    steps = []

    arr = array.copy()

    comparisons = 0
    swaps = 0

    sorted_indices = set()

    def add_step(
        action,
        message,
        low=None,
        high=None,
        pivot_index=None,
        pivot=None,
        compare_indices=None,
        swap_indices=None,
    ):
        steps.append({
            "action": action,
            "array": arr.copy(),

            "low": low,
            "high": high,

            "pivot_index": pivot_index,
            "pivot": pivot,

            "compare_indices": compare_indices or [],
            "swap_indices": swap_indices or [],

            "sorted_indices": list(sorted_indices),

            "comparisons": comparisons,
            "swaps": swaps,

            "message": message,
        })

    # --------------------------------------------------
    # INITIALIZE
    # --------------------------------------------------

    add_step(
        action="initialize",
        message="Starting Quick Sort",
    )

    # --------------------------------------------------
    # PARTITION
    # --------------------------------------------------

    def partition(low, high):

        nonlocal comparisons, swaps

        pivot = arr[high]

        add_step(
            action="partition",
            low=low,
            high=high,
            pivot_index=high,
            pivot=pivot,
            message=f"Partitioning around pivot {pivot}",
        )

        i = low - 1

        for j in range(low, high):

            comparisons += 1

            add_step(
                action="compare",
                low=low,
                high=high,
                pivot_index=high,
                pivot=pivot,
                compare_indices=[j, high],
                message=(
                    f"Comparing {arr[j]} "
                    f"with pivot {pivot}"
                ),
            )

            if arr[j] <= pivot:

                i += 1

                if i != j:

                    old_i = arr[i]
                    old_j = arr[j]

                    arr[i], arr[j] = (
                        arr[j],
                        arr[i],
                    )

                    swaps += 1

                    add_step(
                        action="swap",
                        low=low,
                        high=high,
                        pivot_index=high,
                        pivot=pivot,
                        swap_indices=[i, j],
                        message=(
                            f"Swapped {old_i} "
                            f"and {old_j}"
                        ),
                    )

        # --------------------------------------------------
        # PLACE PIVOT
        # --------------------------------------------------

        pivot_position = i + 1

        if pivot_position != high:

            old_value = arr[pivot_position]

            arr[pivot_position], arr[high] = (
                arr[high],
                arr[pivot_position],
            )

            swaps += 1

            add_step(
                action="swap",
                low=low,
                high=high,
                pivot_index=pivot_position,
                pivot=pivot,
                swap_indices=[
                    pivot_position,
                    high,
                ],
                message=(
                    f"Moving pivot {pivot} "
                    f"to its correct position"
                ),
            )

        sorted_indices.add(pivot_position)

        add_step(
            action="pivot_placed",
            low=low,
            high=high,
            pivot_index=pivot_position,
            pivot=pivot,
            message=(
                f"Pivot {pivot} placed at "
                f"index {pivot_position}"
            ),
        )

        return pivot_position

    # --------------------------------------------------
    # RECURSIVE QUICK SORT
    # --------------------------------------------------

    def sort(low, high):

        if low < high:

            pivot_position = partition(
                low,
                high,
            )

            sort(
                low,
                pivot_position - 1,
            )

            sort(
                pivot_position + 1,
                high,
            )

    # --------------------------------------------------
    # SORT
    # --------------------------------------------------

    if len(arr) > 1:
        sort(
            0,
            len(arr) - 1,
        )

    # --------------------------------------------------
    # COMPLETE
    # --------------------------------------------------

    sorted_indices.clear()

    for index in range(len(arr)):
        sorted_indices.add(index)

    add_step(
        action="complete",
        message="Quick Sort completed",
    )

    return steps