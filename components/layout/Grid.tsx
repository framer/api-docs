import * as React from "react"
import { createContext } from "react"
import styled from "styled-components"
import { desktop, tablet, widescreen } from "./Breakpoints"

const GridContext = createContext(false)

interface GridProps {
    className?: string
}

const GridDiv = styled.div`
    display: grid;
    column-gap: 100px;
    padding-right: 80px;
    grid-template-columns: 1fr 1fr;

    /* Hack to exclude this element from the flow of the document */
    .grid--exclude {
        display: contents;
    }
    * {
        grid-column-start: 1;
    }
    pre {
        grid-row-start: 2;
        grid-row-end: span 10;
        grid-column-start: 2;
        padding-left: 20px;
    }
    .error-graphic {
        grid-row-start: 0;
        grid-row-end: span 10;
        grid-column-start: 2;
        padding-left: 20px;
        margin-top: 0;
    }
    &.framer-custom-mdx pre {
        grid-row-start: auto;
        grid-row-end: auto;
    }
    .header {
        grid-row-start: 1;
        grid-row-end: 3;
        grid-column-start: 2;
    }
    .header.video {
        grid-row-start: auto;
    }
    &.grid-code + .grid-code {
        margin-top: 30px;
    }
    &.grid-example {
        margin: 30px 0;
    }

    div + div {
        margin-top: 30px;
    }
    &.framer-api.framer-api-empty,
    &.grid-section-h2 {
        margin-top: 80px !important;
    }
    &.grid-section-h3,
    &.framer-api {
        margin-top: 60px;
    }
    &.grid-section-h2 + &.grid-section-h3 {
        margin-top: 20px;
    }
    &.grid-section-h1 + & {
        margin-top: 0;
    }

    &.framer-api + .framer-custom-mdx,
    .grid-section-h2 + &.framer-api {
        margin-top: 30px;
    }

    /* CSS Separators */
    &.framer-api:not(.framer-api-empty) + &.framer-api,
    &.framer-api + &.grid-section-h2 {
        position: relative;
        border-top: 1px solid rgba(180, 180, 180, 0.2);
        padding-top: 60px;
    }
    &.framer-api + &.framer-api:after,
    &.framer-api + &.grid-section-h2:after {
        content: "";
        position: absolute;
        top: -1px;
        width: 100px;
        height: 1px;
        background: rgba(180, 180, 180, 0.2);
        left: -100px;
    }
    &.grid-section-h2 + &.framer-api,
    &.framer-api-empty + &.framer-api {
        border: none !important;
        padding-top: none !important;
    }
    &.grid-section-h2 + &.framer-api:after,
    &.framer-api-empty + &.framer-api:after {
        background: none;
    }

    @media (min-width: ${widescreen}) {
        grid-template-columns: 555px 1fr;

        * {
            max-width: 600px;
        }
        pre,
        pre code {
            max-width: 100%;
        }
        .error-graphic {
            max-width: 100%;
            margin-left: 10px;
            width: calc(100%);
        }
    }

    @media (max-width: ${desktop}) {
        display: block;

        pre {
            padding-left: 0;
        }

        .error-graphic {
            background: #151515;
            border-radius: 10px;
            order: 1;
            height: 250px;
            max-width: 400px;
            margin-bottom: 50px;
            padding-left: 0;
        }
        .error-message {
            order: 2;
        }

        &.four-o-four {
            height: 100%;
            max-height: calc(100vh - 100px);
            display: flex;
            flex-direction: column;
            place-content: center;
            place-items: center;
        }
    }

    @media (max-width: ${tablet}) {
        padding-right: 0;
    }
`

export const Center = styled.div`
    display: flex;
    width: 100%;
    height: calc(100vh - 110px);
    place-content: center;
    place-items: center;
    text-align: center;

    h2 {
        position: static !important;
        padding: 0 !important;
        left: 0 !important;
        margin-bottom: 0 !important;
    }

    @media (max-width: ${desktop}) {
        height: auto;
    }
    @media (max-width: ${tablet}) {
        /* background: red; */
    }
`

const InnerGrid: React.FunctionComponent<GridProps & { wrappedInGrid: boolean }> = props => {
    const { children, wrappedInGrid } = props
    let className = `grid-2${props.className ? " " + props.className : ""}`

    if (wrappedInGrid) {
        // We're already wrapped in a grid, so just return the children
        return <>{children}</>
    }
    return (
        <GridContext.Provider value={true}>
            <GridDiv className={className}>{children}</GridDiv>
        </GridContext.Provider>
    )
}

export const Grid: React.FunctionComponent<GridProps> = props => {
    return (
        <GridContext.Consumer>
            {wrappedInGrid => <InnerGrid {...props} wrappedInGrid={wrappedInGrid} />}
        </GridContext.Consumer>
    )
}
