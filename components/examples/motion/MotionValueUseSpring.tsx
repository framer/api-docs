import * as React from "react"
import { useState } from "react"
import { Dynamic } from "monobase"
import { motion, useTransform, useMotionValue, useSpring } from "framer-motion"
import styled from "styled-components"
import { distance } from "@popmotion/popcorn"
import { Refresh } from "../../../components/layout/Refresh"

const Ball = styled(motion.div)`
    background: white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin: 0 10px 10px 0 !important;
`

const Container = styled.div`
    display: flex;
    width: 180px;
    height: 180px;
    flex-wrap: wrap;
`

const grid = [[0, 1, 2], [4, 5, 6], [8, 9, 10]]

const SpringBall = ({ active, setActive, row, col, index }) => {
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const isActive = active && active.index === index
    const d = distance({ x: active.col, y: active.row }, { x: col, y: row }) || 0

    const springConfig = {
        stiffness: Math.max(700 - d * 120, 0),
        damping: 10 + d * 5,
    }
    const springX = useSpring((active && active.x) || 0, springConfig)
    const springY = useSpring((active && active.y) || 0, springConfig)

    return (
        <Ball
            drag
            onDragStart={() => setActive({ x, y, row, col, index })}
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            dragElastic={1}
            style={isActive ? { x, y } : { x: springX, y: springY }}
        />
    )
}

function StaticUseSpring() {
    const [active, setActive] = useState(false)

    return (
        <Container>
            {grid.map((row, rowIndex) =>
                row.map((item, colIndex) => (
                    <SpringBall
                        active={active}
                        setActive={setActive}
                        index={item}
                        row={rowIndex}
                        col={colIndex}
                        key={rowIndex + colIndex}
                    />
                ))
            )}
        </Container>
    )
}

export const MotionValueUseSpring = Dynamic(StaticUseSpring)
