import * as React from "react"
import { Dynamic } from "monobase"
import { useFramer } from "../contexts/FramerContext"
import { Slider } from "./"

const interpolate = (value: any, from: any[], to: any[]) => {
    return to[0] + ((value - from[0]) / (from[1] - from[0])) * (to[1] - to[0])
}

// Layout
const maskSize = 120
const imageSize = maskSize * 4
const sliderGap = 20
const sliderKnobSize = 40
const appSize = maskSize + sliderGap + sliderKnobSize
const offsetMask = -(appSize / 2 + sliderGap / 2)
const offsetCenter = (appSize - sliderKnobSize) / 2

// Style
const maskBg = "#000"

// CSS Override
const noMarginAdded = { margin: 0 }

// Slider Component Variables
const min = 0.25
const max = 0.75

export const SliderComplete = Dynamic(function SliderComplete() {
    const { Frame, hasFramer } = useFramer()
    const [scale, setScale] = React.useState(0.5)
    const constraint = (imageSize * scale - maskSize) / 2
    return hasFramer ? (
        <Frame width="300px" height="300px" background="" style={noMarginAdded}>
            <Frame
                center
                size={maskSize}
                overflow="hidden"
                radius="50%"
                borderRadius="50%"
                y={offsetMask + offsetCenter}
                style={noMarginAdded}
                background={maskBg}
            >
                <Frame
                    scale={scale}
                    center
                    size={imageSize}
                    // background={maskBg}
                    image="https://misc.framerstatic.com/api/bg.jpg"
                    drag
                    dragElastic={0}
                    dragMomentum={false}
                    dragConstraints={{
                        top: -constraint,
                        right: constraint,
                        bottom: constraint,
                        left: -constraint,
                    }}
                    style={{ ...noMarginAdded, cursor: "move", backgroundColor: maskBg }}
                />
            </Frame>
            <Slider value={scale} min={0.25} max={0.75} onChange={setScale} offsetCenter={offsetCenter} />
        </Frame>
    ) : null
})
