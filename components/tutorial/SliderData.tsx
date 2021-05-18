import * as React from "react"
import { Dynamic } from "monobase"
import { useFramer } from "../contexts/FramerContext"

const interpolate = (value: any, from: any[], to: any[]) => {
    return to[0] + ((value - from[0]) / (from[1] - from[0])) * (to[1] - to[0])
}

export const SliderData = Dynamic(function SliderData() {
    const { Frame, hasFramer } = useFramer()

    // Layout
    const maskSize = 120
    const imageSize = maskSize * 4
    const sliderGap = 20
    const sliderWidth = 130
    const sliderHeight = 6
    const sliderKnobSize = 40
    const appSize = maskSize + sliderGap + sliderKnobSize
    const offsetCenter = 0

    // Style
    const fillBg = "#fff"
    const knobBg = "#fff"
    const railBg = "rgba(255,255,255,.2)"
    const knobShadow = "0 2px 8px 1px #242424"
    const maskBg = "#000"

    // CSS Override
    const noMarginAdded = { margin: 0 }

    // App Component Variables
    const [scale, setScale] = React.useState(0.5)
    const constraint = (imageSize * scale - maskSize) / 2

    // Slider Component Variables
    const [position, setPosition] = React.useState(0.5 * sliderWidth)
    const min = 0.25
    const max = 0.75

    return hasFramer ? (
        <Frame width="300px" height="330px" background="" style={noMarginAdded} overflow="hidden">
            <Frame
                scale={scale}
                center
                size={imageSize}
                // background={maskBg}
                image="https://misc.framerstatic.com/api/bg.jpg"
                style={{ ...noMarginAdded, backgroundColor: maskBg }}
            />

            <Frame
                width={sliderWidth}
                height={sliderHeight}
                center
                borderRadius={sliderHeight / 2}
                radius={sliderHeight / 2}
                background={railBg}
                y={offsetCenter}
                style={noMarginAdded}
            >
                <Frame
                    width={position}
                    height={sliderHeight}
                    borderRadius={sliderHeight / 2}
                    radius={sliderHeight / 2}
                    background={fillBg}
                    center="y"
                    style={noMarginAdded}
                />
                <Frame
                    size={sliderKnobSize}
                    x={position}
                    borderRadius="50%"
                    radius="50%"
                    center="y"
                    left={-sliderKnobSize / 2}
                    background={knobBg}
                    shadow={knobShadow}
                    drag="x"
                    dragConstraints={{ left: 0, right: sliderWidth }}
                    dragElastic={0}
                    dragMomentum={false}
                    onDrag={function(event, { point }) {
                        setPosition(point.x)
                        setScale(interpolate(point.x, [0, sliderWidth], [min, max]))
                    }}
                    style={{ ...noMarginAdded, cursor: "pointer" }}
                />
            </Frame>
        </Frame>
    ) : null
})
