import { useEffect, RefObject } from "react"

// SOURCE: https://usehooks.com/useOnClickOutside/
export const useClickOutside = (ref: RefObject<any>, handler: (event?: Event) => void) => {
    useEffect(() => {
        const listener = (event: Event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return
            }

            handler(event)
        }

        document.addEventListener("mousedown", listener)
        document.addEventListener("touchstart", listener)

        return () => {
            document.removeEventListener("mousedown", listener)
            document.removeEventListener("touchstart", listener)
        }
    }, [ref, handler])
}
