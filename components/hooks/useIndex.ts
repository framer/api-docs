import { useCallback, useState, useEffect, Dispatch, SetStateAction } from "react"

const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max)
}

const wrap = (value: number, min: number, max: number) => {
    const range = max - min

    return ((((value - min) % range) + range) % range) + min
}

type IndexOperator = (nudge?: number) => void

type IndexState<T = number> = [T, IndexOperator, IndexOperator, Dispatch<SetStateAction<number>>]

export const useIndex = (range: number, initial = 0): IndexState => {
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

export const useIndexItem = <T>(items: T[]): IndexState<T> => {
    const [index, ...indexOperators] = useIndex(items.length)

    return [items[index], ...indexOperators]
}
