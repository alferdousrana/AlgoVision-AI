def merge_sort(array):
    steps = []

    arr = array.copy()

    comparisons = 0
    swaps = 0

    def add_step(
        action,
        compare_indices=None,
        merge_indices=None,
        sorted_indices=None,
        left=None,
        right=None,
        message=""
    ):
        steps.append({
            "action": action,
            "array": arr.copy(),
            "compare_indices": compare_indices or [],
            "merge_indices": merge_indices or [],
            "sorted_indices": sorted_indices or [],
            "left": left,
            "right": right,
            "comparisons": comparisons,
            "swaps": swaps,
            "message": message,
        })

    # Initial state
    add_step(
        action="initialize",
        message="Starting Merge Sort"
    )

    def merge_sort_recursive(left, right):

        if left >= right:
            return

        mid = (left + right) // 2

        # Split
        add_step(
            action="split",
            left=left,
            right=right,
            message=(
                f"Splitting range "
                f"{left}–{right} at index {mid}"
            )
        )

        merge_sort_recursive(left, mid)

        merge_sort_recursive(mid + 1, right)

        merge(left, mid, right)

    def merge(left, mid, right):

        nonlocal comparisons, swaps

        left_part = arr[left:mid + 1]
        right_part = arr[mid + 1:right + 1]

        i = 0
        j = 0
        k = left

        # Compare and merge
        while i < len(left_part) and j < len(right_part):

            left_index = left + i
            right_index = mid + 1 + j

            comparisons += 1

            add_step(
                action="compare",
                compare_indices=[
                    left_index,
                    right_index
                ],
                merge_indices=list(
                    range(left, right + 1)
                ),
                left=left,
                right=right,
                message=(
                    f"Comparing {left_part[i]} "
                    f"and {right_part[j]}"
                )
            )

            if left_part[i] <= right_part[j]:

                arr[k] = left_part[i]

                add_step(
                    action="take_left",
                    compare_indices=[left_index],
                    merge_indices=list(
                        range(left, right + 1)
                    ),
                    left=left,
                    right=right,
                    message=(
                        f"Took {left_part[i]} "
                        f"from left half"
                    )
                )

                i += 1

            else:

                arr[k] = right_part[j]

                swaps += 1

                add_step(
                    action="take_right",
                    compare_indices=[right_index],
                    merge_indices=list(
                        range(left, right + 1)
                    ),
                    left=left,
                    right=right,
                    message=(
                        f"Took {right_part[j]} "
                        f"from right half"
                    )
                )

                j += 1

            k += 1

        # Remaining left values
        while i < len(left_part):

            arr[k] = left_part[i]

            add_step(
                action="take_left",
                merge_indices=list(
                    range(left, right + 1)
                ),
                left=left,
                right=right,
                message=(
                    f"Added remaining value "
                    f"{left_part[i]}"
                )
            )

            i += 1
            k += 1

        # Remaining right values
        while j < len(right_part):

            arr[k] = right_part[j]

            add_step(
                action="take_right",
                merge_indices=list(
                    range(left, right + 1)
                ),
                left=left,
                right=right,
                message=(
                    f"Added remaining value "
                    f"{right_part[j]}"
                )
            )

            j += 1
            k += 1

        # Merge completed
        add_step(
            action="merge",
            merge_indices=list(
                range(left, right + 1)
            ),
            left=left,
            right=right,
            message=(
                f"Merged range "
                f"{left}–{right}"
            )
        )

    if len(arr) > 1:
        merge_sort_recursive(
            0,
            len(arr) - 1
        )

    # Final state
    add_step(
        action="complete",
        sorted_indices=list(
            range(len(arr))
        ),
        message="Merge Sort completed"
    )

    return steps