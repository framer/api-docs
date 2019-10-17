import * as React from "react"
import { Dynamic } from "monobase"
import { useFramer } from "../contexts/FramerContext"

export const SliderStarter = Dynamic(function SliderStarter() {
    const { Frame, hasFramer } = useFramer()
    // CSS Override
    const noMarginAdded = { margin: 0 }
    return hasFramer ? (
        <Frame width="300px" height="300px" background="" style={noMarginAdded}>
            <Frame center image="https://static.framer.com/api/logo.jpg" radius={4} borderRadius={4} />
        </Frame>
    ) : null
})
