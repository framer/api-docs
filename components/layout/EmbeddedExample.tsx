import * as React from "react"
import styled from "styled-components"
import { desktop } from "./Breakpoints"

const EmbeddedExampleBackground = styled.div<{ height?: number; background?: string }>`
    display: flex;
    place-content: center;
    place-items: center;
    height: ${props => props.height || "320px"};
    background: ${props => props.background || "#151515"};
    border-radius: 8px;
    margin: 20px 0;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    user-select: none;
    position: relative;

    @media (min-width: ${desktop}) {
        margin: 0;
    }
`

interface EmbeddedExampleProps {
    children: any
    height?: number
    background?: string
}

export const EmbeddedExample = ({ children, height, background }: EmbeddedExampleProps) => (
    <EmbeddedExampleBackground height={height} background={background}>
        {children}
    </EmbeddedExampleBackground>
)
