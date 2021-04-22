import { useCallback, useState, useEffect, useRef, Dispatch, SetStateAction } from "react"

const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max)
}

const wrap = (value: number, min: number, max: number) => {
    const range = max - min

    return ((((value - min) % range) + range) % range) + min
}

export type IndexOperator = (nudge?: number) => void

export const useIndexItem = <T>(
    items: T[],
    initial = 0
): [T, IndexOperator, IndexOperator, Dispatch<SetStateAction<number>>] => {
    const [index, setIndex] = useState(initial)
    const itemsRef = useRef(items)

    useEffect(() => {
        itemsRef.current = items

        setIndex(index => clamp(index, 0, Math.max(items.length - 1, 0)))
    }, [items])

    const previousItem = useCallback((nudge: number = 1) => {
        setIndex(index => wrap(index - nudge, 0, Math.max(itemsRef.current.length, 0)))
    }, [])

    const nextItem = useCallback((nudge: number = 1) => {
        setIndex(index => wrap(index + nudge, 0, Math.max(itemsRef.current.length, 0)))
    }, [])

    return [items[index], previousItem, nextItem, setIndex]
}
