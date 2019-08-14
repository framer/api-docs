import * as React from "react"
import { Dynamic } from "monobase"
import { motion, useTransform, useMotionValue } from "framer-motion"
import styled from "styled-components"

const Container = styled(motion.div)`
    width: 100%;
    height: 100%;
`

const Box = styled(motion.div)`
    background: white;
    border-radius: 30px;
    width: 150px;
    height: 150px;
    position: absolute;
    top: calc(50% - 150px / 2);
    left: calc(50% - 150px / 2);
    display: flex;
    justify-content: center;
    align-items: center;
`

const ProgressIcon = styled.svg`
    width: 80%;
    height: 80%;
`

function StaticMotionValueSVG() {
    const x = useMotionValue(0)
    const xInput = [-100, 0, 100]
    const color = useTransform(x, xInput, ["#f08", "#70f", "#2dd"])
    const tickPath = useTransform(x, [10, 100], [0, 1])
    const crossPathA = useTransform(x, [-10, -55], [0, 1])
    const crossPathB = useTransform(x, [-50, -100], [0, 1])

    return (
        <Container style={{ background: color }}>
            <Box style={{ x }} drag="x" dragConstraints={{ left: 0, right: 0 }}>
                <ProgressIcon viewBox="0 0 50 50">
                    <motion.path
                        fill="none"
                        strokeWidth="4"
                        stroke={color}
                        d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
                        style={{ translateX: 5, translateY: 5 }}
                    />
                    <motion.path
                        fill="none"
                        strokeWidth="4"
                        stroke={color}
                        d="M14,26 L 22,33 L 35,16"
                        strokeDasharray="0 1"
                        style={{ pathLength: tickPath }}
                    />
                    <motion.path
                        fill="none"
                        strokeWidth="4"
                        stroke={color}
                        d="M17,17 L33,33"
                        strokeDasharray="0 1"
                        style={{ pathLength: crossPathA }}
                    />
                    <motion.path
                        fill="none"
                        strokeWidth="4"
                        stroke={color}
                        d="M33,17 L17,33"
                        strokeDasharray="0 1"
                        style={{ pathLength: crossPathB }}
                    />
                </ProgressIcon>
            </Box>
        </Container>
    )
}

export const MotionValueSVG = Dynamic(StaticMotionValueSVG)
