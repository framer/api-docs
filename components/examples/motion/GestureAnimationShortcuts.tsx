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

function StaticGestureAnimations() {
    return <Box whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} />
}

export const GestureAnimationShortcuts = Dynamic(StaticGestureAnimations)
