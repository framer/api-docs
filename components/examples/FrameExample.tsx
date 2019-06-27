import * as React from "react"
import { Dynamic } from "monobase"
import { useFramer } from "../contexts/FramerContext"

const StaticFrameExample = () => {
    const { Frame, hasFramer } = useFramer()

    return hasFramer ? <Frame size={150} background={"#fff"} radius={30} /> : null
}

export const FrameExample = Dynamic(StaticFrameExample)
