import styled from "styled-components"
import { desktop } from "./Breakpoints"

export const EmbeddedExample = styled.div<{ height?: number; background?: string }>`
    display: flex;
    place-content: center;
    place-items: center;
    height: ${props => props.height || "320px"};
    background: ${props => props.background || "#151515"};
    border-radius: 8px;
    margin: 40px 0;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    user-select: none;

    @media (min-width: ${desktop}) {
        &:first-child {
            margin-top: 0;
        }

        &:last-child {
            margin-bottom: 0;
        }
    }
`
