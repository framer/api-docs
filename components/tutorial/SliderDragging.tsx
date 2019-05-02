import * as React from "react"
import { Dynamic } from "monobase"
import { AnimationControls, MotionValue } from "framer"
import { useFramer } from "../contexts/FramerContext"

export const SliderDragging = Dynamic(function SliderDragging() {
    const { Frame, useAnimation, useMotionValue, hasFramer } = useFramer()

    // Layout
    const sliderWidth = 130
    const sliderHeight = 6
    const sliderKnobSize = 40

    // Style
    const fillBg = "#fff"
    const knobBg = "#fff"
    const railBg = "rgba(255,255,255,.2)"
    const knobShadow = "0 2px 8px 1px #242424"

    // CSS Override
    const noMarginAdded = { margin: 0 }

    let animationKnob: AnimationControls | undefined
    let animationFill: AnimationControls | undefined
    let position: MotionValue | undefined

    // Animation
    if (hasFramer) {
        position = useMotionValue(0)
        animationKnob = useAnimation()
        animationFill = useAnimation()
        animationKnob.start({
            x: 130,
            transition: {
                yoyo: Infinity,
                duration: 4,
                ease: "easeInOut",
            },
        })
        animationFill.start({
            width: 130,
            transition: {
                yoyo: Infinity,
                duration: 4,
                ease: "easeInOut",
            },
        })
    }

    return hasFramer ? (
        <Frame width="300px" height="300px" background="" style={noMarginAdded}>
            <Frame
                width={sliderWidth}
                height={sliderHeight}
                center
                borderRadius={sliderHeight / 2}
                radius={sliderHeight / 2}
                background={railBg}
                style={noMarginAdded}
            >
                <Frame
                    name="Fill"
                    width={position}
                    height={sliderHeight}
                    borderRadius={sliderHeight / 2}
                    radius={sliderHeight / 2}
                    background={fillBg}
                    center="y"
                    style={noMarginAdded}
                    animate={animationFill}
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
                    dragConstraints={{ left: 0, right: 130 }}
                    dragElastic={0}
                    dragMomentum={false}
                    style={{ ...noMarginAdded, cursor: "pointer" }}
                    animate={animationKnob}
                    onDragStart={() => {
                        animationKnob!.stop()
                        animationFill!.stop()
                    }}
                />
            </Frame>
        </Frame>
    ) : null
})
