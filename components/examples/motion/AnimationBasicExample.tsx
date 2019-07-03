import * as React from "react"
import { useState } from "react"
import { Dynamic } from "monobase"
import { motion } from "framer-motion"
import styled from "styled-components"
import { Refresh } from "../../../components/layout/Refresh"

const Box = styled(motion.div)`
    width: 100px;
    height: 100px;
    background: white;
    border-radius: 20px;
    margin-top: 0;
`

function StaticBasicExample() {
    const [count, setCount] = useState(0)
    return (
        <>
            <Refresh onClick={() => setCount(count + 1)} />
            <Box key={count} animate={{ scale: 2 }} transition={{ duration: 0.5 }} />
        </>
    )
}

export const AnimationBasicExample = Dynamic(StaticBasicExample)
