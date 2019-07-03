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

function StaticKeyframesExample() {
    const [count, setCount] = useState(0)
    return (
        <>
            <Refresh onClick={() => setCount(count + 1)} />
            <Box
                key={count}
                animate={{
                    scale: [1, 2, 2, 1, 1],
                    rotate: [0, 0, 270, 270, 0],
                    borderRadius: ["20%", "20%", "50%", "50%", "20%"],
                }}
                transition={{
                    duration: 2,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.5, 0.8, 1],
                    loop: Infinity,
                    repeatDelay: 1,
                }}
            />
        </>
    )
}

export const AnimationKeyframesExample = Dynamic(StaticKeyframesExample)
