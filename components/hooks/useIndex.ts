import { useCallback, useState, useEffect, Dispatch, SetStateAction } from "react"

const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max)
}

const wrap = (value: number, min: number, max: number) => {
    const range = max - min

    return ((((value - min) % range) + range) % range) + min
}

export type IndexOperator = (nudge?: number) => void

export const useIndex = (
    range: number,
    initial = 0
): [number, IndexOperator, IndexOperator, Dispatch<SetStateAction<number>>] => {
    const [index, setIndex] = useState(initial)

    useEffect(() => {
        setIndex(index => clamp(index, 0, Math.max(range - 1, 0)))
    }, [range])

    const previousIndex = useCallback(
        (nudge = 1) => {
            setIndex(index => wrap(index - nudge, 0, Math.max(range, 0)))
        },
        [range]
    )

    const nextIndex = useCallback(
        (nudge = 1) => {
            setIndex(index => wrap(index + nudge, 0, Math.max(range, 0)))
        },
        [range]
    )

    return [index, previousIndex, nextIndex, setIndex]
}

export const useIndexItem = <T>(
    items: T[],
    initial = 0
): [T, number, IndexOperator, IndexOperator, Dispatch<SetStateAction<number>>] => {
    const [index, ...indexOperators] = useIndex(items.length, initial)

    return [items[index], index, ...indexOperators]
}
