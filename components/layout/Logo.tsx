import * as React from "react"
import { forwardRef, useMemo, SVGProps } from "react"
import { isMotion } from "../utils/env"

interface Props extends SVGProps<SVGSVGElement> {
    library?: "library" | "motion"
}

export const Logo = forwardRef<SVGSVGElement, Props>(
    ({ library = isMotion() ? "motion" : "library", height = 15, ...props }, ref) => {
        const isLibrary = useMemo(() => library === "library", [library])

        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${isLibrary ? 10 : 13} ${15}`}
                height={height}
                ref={ref}
                {...props}
            >
                <path
                    d={
                        isLibrary
                            ? "M10 0v5H5L0 0zM0 5h5l5 5H5v5l-5-5z"
                            : "M0 14V1l6.5 6.5L13 1v13l-3.25-3.25L6.5 14l-3.25-3.25z"
                    }
                />
            </svg>
        )
    }
)
