import * as React from "react"
import { useState, useEffect } from "react"
import { Dynamic } from "monobase"
import { motion, useSpring, useMotionValue } from "framer-motion"
import styled from "styled-components"
import { clamp, mix } from "popmotion"

/**
 * This example is to show the useViewportScroll hook, but for now this only works with
 * window scroll. For now we emulate this with an onScroll callback.
 */

const randomInt = (min: number, max: number) => Math.round(mix(min, max, Math.random()))
const generateParagraphLength = () => randomInt(10, 40)
const generateWordLength = () => randomInt(20, 100)

const Container = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`

const ParagraphContainer = styled.div`
    margin-bottom: 40px;
`

const Header = styled.div`
    width: 100%;
    margin-bottom: 25px;
`

const ScrollArea = styled.div`
    width: 100%;
    height: 100%;
    overflow-y: auto;
`

const ContentContainer = styled.div`
    margin-top: 50px;
    margin-bottom: 30px;
    padding: 20px 20px 20px 100px;
`

const WordContainer = styled.div`
    height: 14px;
    background: white;
    border-radius: 10px;
    display: inline-block;
    margin-bottom: 14px;
    margin-right: 10px;
    margin-top: 0 !important;
    background: white;
    border-radius: 10px;
    display: inline-block;
`

const ProgressIcon = styled.svg`
    position: absolute;
    top: 50px;
    left: 15px;
    width: 80px;
    height: 80px;
`

// Randomly generate some paragraphs of word lengths
const paragraphs = [...Array(10)].map(() => {
    return [...Array(generateParagraphLength())].map(generateWordLength)
})

const Word = ({ width, height }: { width: number; height?: number }) => <WordContainer style={{ width, height }} />

const Paragraph = ({ words }: { words: number[] }) => (
    <ParagraphContainer>
        {words.map((width, key) => (
            <Word key={key} width={width} />
        ))}
    </ParagraphContainer>
)

export const ContentPlaceholder = () => (
    <ContentContainer>
        <Header>
            <Word height={32} width={75} />
            <Word height={32} width={130} />
            <Word height={32} width={98} />
        </Header>
        {paragraphs.map((words, i) => (
            <Paragraph key={i} words={words} />
        ))}
    </ContentContainer>
)

function StaticViewportScroll() {
    const [isComplete, setIsComplete] = useState(false)
    const scrollYProgress = useMotionValue(0)
    const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 })

    useEffect(() => pathLength.onChange(v => setIsComplete(v >= 0.98)), [scrollYProgress])

    return (
        <Container>
            <ScrollArea
                onScroll={e => {
                    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement
                    scrollYProgress.set(clamp(0, 1, scrollTop / (scrollHeight - clientHeight)))
                }}
            >
                <ContentPlaceholder />
            </ScrollArea>
            <ProgressIcon viewBox="0 0 60 60">
                <motion.path
                    fill="none"
                    strokeWidth="5"
                    stroke="white"
                    strokeDasharray="0 1"
                    d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
                    style={{
                        pathLength,
                        rotate: 90,
                        translateX: 5,
                        translateY: 5,
                        scaleX: -1, // Reverse direction of line animation
                    }}
                />
                <motion.path
                    fill="none"
                    strokeWidth="5"
                    stroke="white"
                    d="M14,26 L 22,33 L 35,16"
                    initial={false}
                    strokeDasharray="0 1"
                    animate={{ pathLength: isComplete ? 1 : 0 }}
                />
            </ProgressIcon>
        </Container>
    )
}

export const ViewportScroll = Dynamic(StaticViewportScroll)
