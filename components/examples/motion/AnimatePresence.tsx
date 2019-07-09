import * as React from "react"
import { useState } from "react"
import { Dynamic } from "monobase"
import { motion, AnimatePresence } from "framer-motion"
import styled from "styled-components"

const Container = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`

const Slide = styled(motion.div)`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    margin: 0 !important;
    padding: 0 !important;
`

const variants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
}

function StaticAnimatePresence() {
    const [page, setPage] = useState(0)
    const imageIndex = Math.abs(page) % images.length

    setTimeout(() => setPage(page + 1), 1500)

    return (
        <Container>
            <AnimatePresence initial={false}>
                <Slide
                    key={page}
                    style={{ backgroundImage: `url(${images[imageIndex]})` }}
                    variants={variants}
                    transition={{ duration: 0.5, ease: "backOut" }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                />
            </AnimatePresence>
        </Container>
    )
}

export const AnimatePresenceExample = Dynamic(StaticAnimatePresence)

const images = [
    "https://d33wubrfki0l68.cloudfront.net/dd23708ebc4053551bb33e18b7174e73b6e1710b/dea24/static/images/wallpapers/shared-colors@2x.png",
    "https://d33wubrfki0l68.cloudfront.net/49de349d12db851952c5556f3c637ca772745316/cfc56/static/images/wallpapers/bridge-02@2x.png",
    "https://d33wubrfki0l68.cloudfront.net/594de66469079c21fc54c14db0591305a1198dd6/3f4b1/static/images/wallpapers/bridge-01@2x.png",
]
