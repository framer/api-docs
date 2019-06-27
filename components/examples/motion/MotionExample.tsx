import * as React from "react"
import { Dynamic } from "monobase"
import { motion } from "framer-motion"

const StaticMotionExample = () => {
    return (
        <motion.div
            drag
            style={{
                width: 100,
                height: 100,
                background: "white",
                borderRadius: 20,
            }}
        />
    )
}

export const MotionExample = Dynamic(StaticMotionExample)
