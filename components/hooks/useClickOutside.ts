import { useEffect, useRef, RefObject } from "react"

export const useClickOutside = (ref: RefObject<Element>, callback: (event?: PointerEvent) => void = () => {}) => {
    const latestCallback = useRef(callback)

    useEffect(() => {
        latestCallback.current = callback
    }, [callback])

    useEffect(() => {
        const handleEvent = (event: PointerEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return
            }

            latestCallback.current(event)
        }

        document.addEventListener("pointerdown", handleEvent)

        return () => {
            document.removeEventListener("pointerdown", handleEvent)
        }
    }, [ref])
}
