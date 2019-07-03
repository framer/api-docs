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

const DraggableArea = styled.div`
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
`

function StaticDrag() {
    return (
        <DraggableArea>
            <Box
                drag
                dragConstraints={{
                    top: -50,
                    left: -50,
                    right: 50,
                    bottom: 50,
                }}
            />
        </DraggableArea>
    )
}

export const GestureDrag = Dynamic(StaticDrag)
