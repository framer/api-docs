/// <reference path="../../types/mdx.d.ts">
import * as React from "react"
import styled from "styled-components"
import { desktop, mobile } from "./Breakpoints"
import { Grid } from "./Grid"
import { H1, H2, H3, H4, H5, H6 } from "./Header"
import { baseTextColor, baseHeadingColor } from "../theme"

// As of the mdx alpha, we don't actually get the MDXTag anymore instead
// we get a MDXCreateElement wrapper which is sad.
type MDXElement = React.ReactElement<{ mdxType: string; children: React.ReactNode }>

export const Callout = styled.div`
    font-size: 13px;
    border-radius: 6px;
    background: #f8f8f8;
    padding: 15px 20px;
    font-weight: 400;
    margin-bottom: 60px;
    color: ${baseTextColor};

    p:last-of-type {
        margin-bottom: 0;
    }

    a {
        font-weight: 500;
    }
`

export const Todo = styled.div`
    color: #fa0;
    font-size: 13px;
    border-radius: 8px;
    background: rgba(255, 219, 102, 0.25);
    padding: 12px 14px 11px;
    margin-bottom: 60px;
    font-weight: 500;

    p:last-of-type {
        margin-bottom: 0;
    }
`

let counter = 0
function uniqueId() {
    return String(++counter)
}

// Formats and re-structures the MDX contents in order to wrap them in Grid elements
// so that authors don't have to understand our finicky markup. Basically there are
// a few goals.
// 1) We want any code blocks to be wrapped in a <Grid> element with their preceding
//    paragraph (or heading/div etc) so they can be displayed inline.
// 2) We want to start a new <Grid> element for each heading to create a "section"
//    that we can apply vertical margin to.
// 3) We want to add a <Permalink> component to all headings so that people get
//    copy/paste support for deep linking.
// 4) The API components currently define their own grid, in order to allow very
//    precice positioning of the code examples below the heading.
//
// To achieve this we reverse the list of children and walk backwards through them
// to build up an array of grids. Doing the processing backwards makes it easier
// to group by heading as well as peek at the preceeding elements for code blocks.
export const Markdown: React.FunctionComponent = ({ children }) => {
    // Collect all top level grids.
    const grids: React.ReactNode[] = []
    // Collect items for the current grid.
    let collected: React.ReactNode[] = []

    // Call this to create a new group with current collection.
    function close(className?: string) {
        if (collected.length) {
            grids.push(
                <Grid key={uniqueId()} className={`framer-custom-mdx${className ? " grid-" + className : ""}`}>
                    {collected.reverse()}
                </Grid>
            )
        }
        collected = []
    }

    // Add the node to the current grid.
    function add(node: React.ReactNode) {
        collected.push(<React.Fragment key={uniqueId()}>{node}</React.Fragment>)
    }

    const contents = React.Children.toArray(children)

    // Reverse the list... as it's easier to walk backwards.
    contents.reverse()
    let child: React.ReactNode | undefined
    while ((child = contents.shift())) {
        if (isCodeBlock(child) || isEmbeddedDemo(child)) {
            // Add all children up until this point into a grid.
            close()
            // Add a new grid to the array and start a new block.
            add(child)

            // Peek at the item preceding the code block to see if we should include it.
            // otherwise we'll have a standalone grid.
            const next = contents[0]
            if (shouldPairWithCodeExample(next)) {
                add(contents.shift())
            }
            close("code")
        } else if (isSeparator(child)) {
            // Avoids wrapping grid divs around HR tags for custom separators.
            close()
            grids.push(child)
        } else if (isHeading(child)) {
            // Make the heading a permalink.
            add(upgradeHeading(child))
            close("section-" + getMDXTag(child))
        } else if (isAPIElement(child)) {
            // Add all children up until this point into a grid.
            close()
            // API blocks have their own inner grid at the moment...
            grids.push(child)
        } else {
            add(child)
        }
    }
    close()
    return <MarkdownStyles>{grids.reverse()}</MarkdownStyles>
}

function isAPIElement(node: React.ReactNode): node is React.ReactElement<any> {
    return React.isValidElement(node) && typeof node.type === "function" && node.type.name.startsWith("API")
}

function isEmbeddedDemo(node: React.ReactNode): node is React.ReactElement<any> {
    return React.isValidElement(node) && typeof node.type === "function" && node.type.name === "EmbeddedDemo"
}

function isMDXElement(node: React.ReactNode): node is MDXElement {
    // NOTE: MDX used to provide the underlying tags via mdx/tags but the latest alpha now uses a wrapper so
    // we detect the type by using the displayName property.
    return React.isValidElement(node) && (node.type as any).displayName === "MDXCreateElement"
}

function isMDXTag(node: React.ReactNode, name: string): boolean {
    if (!isMDXElement(node)) return false
    return getMDXTag(node) === name
}

function getMDXTag(node: MDXElement): string {
    return node.props.mdxType
}

function isDOMElement(node: React.ReactNode, tag?: string): node is React.ReactHTMLElement<any> {
    return React.isValidElement(node) && (!tag || node.type === tag)
}

function isCodeBlock(node: React.ReactNode): node is MDXElement {
    return isDOMElement(node, "pre") || isMDXTag(node, "pre")
}

function isSeparator(node: React.ReactNode): node is MDXElement {
    return isDOMElement(node, "hr") || isMDXTag(node, "hr")
}

function shouldPairWithCodeExample(node: React.ReactNode): node is MDXElement {
    // All tags that should be grouped with a code block. This is usually a <p> tag
    // but an author can wrap a chunk of content in a div to get better layout.
    const supported = new Set(["p", "div"])
    return (
        isHeading(node) ||
        (isMDXElement(node) && supported.has(getMDXTag(node))) ||
        (isDOMElement(node) && supported.has(node.type))
    )
}

function isHeading(node: React.ReactNode): node is MDXElement {
    const tag = (isMDXElement(node) && getMDXTag(node)) || (isDOMElement(node) && node.type)
    return Boolean(tag && /^h[1-6]$/.test(tag))
}

const HeadingMap: { [tag: string]: typeof H1 } = {
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    h5: H5,
    h6: H6,
}

function upgradeHeading(node: MDXElement) {
    const tag = getMDXTag(node)
    const header = HeadingMap[tag]
    if (!header) return node
    const title = tag === "h2" ? toString(node) : undefined
    return React.createElement(header, { id: toId(node), title }, node.props.children)
}

// Create a plain text id based on the string contents of a node... not very easy in React :)
function toId(node: MDXElement) {
    return toString(node)
        .toLowerCase()
        .replace(/\s+/g, "-")
}

function toString(node: MDXElement): string {
    return React.Children.map(node.props.children, child => (typeof child === "string" ? child : "")).join("")
}

export const MarkdownStyles = styled.div`
    p {
        font-weight: 400;
        font-size: 16px;
        line-height: 1.5;
        color: ${baseTextColor};
    }
    img {
        -webkit-user-drag: none;
        max-width: 100%;
        display: block;
        border-radius: 6px;
    }
    ol,
    ul,
    li {
        list-style: none;
    }
    a {
        color: inherit;
    }
    a,
    ol a {
        color: #05f;
        transition: opacity 0.2s ease;
    }
    ol li,
    ul li {
        margin: 0 0 5px 16px;
        list-style-type: none;
        color: ${baseTextColor};
    }
    ol li:before,
    ul li:before {
        float: left;
        margin-left: -16px;
        color: #999;
        content: "-";
    }
    strong {
        font-weight: 600;
    }
    p strong,
    li strong {
        font-weight: 500;
        overflow: hidden;
    }
    p em,
    li em {
        font-style: italic;
    }
    h1 {
        font-size: 40px;
        font-weight: 600;
        letter-spacing: -1.5px;
        color: ${baseHeadingColor};
    }
    h2 {
        font-size: 24px;
        letter-spacing: -0.5px;
        font-weight: 600;
        position: relative;
        padding-left: 25px;
        left: -25px;
        color: ${baseHeadingColor};
    }
    h3 {
        font-size: 17px;
        font-weight: 500;
        position: relative;
        padding-left: 20px;
        left: -20px;
        color: ${baseHeadingColor};
    }
    h3 span {
        font-weight: 400;
        color: #777;
    }
    h4 {
        font-size: 15px;
        font-weight: 500;
        color: ${baseTextColor};
    }
    h5 {
        font-size: 13px;
        font-weight: 500;
        color: ${baseTextColor};
    }

    .lead {
        display: block;
        font-weight: 400;
        font-size: 26px;
        line-height: 1.4;
        margin-bottom: 40px;
        color: ${baseTextColor};
    }

    .lead.has-header {
        margin-bottom: 100px;
    }

    .DocRefTag {
        color: #333;
    }

    /* Separators */
    hr {
        border: none;
        width: calc(100% + 100px);
        height: 1px;
        background: rgba(180, 180, 180, 0.2);
        position: relative;
        left: -100px;
        z-index: 0;
        margin-top: 60px;
    }

    /* Spacing */
    h1,
    h2,
    p,
    ol,
    ul {
        margin-bottom: 20px;
    }
    h3,
    h4 {
        margin-bottom: 15px;
    }
    h5,
    h6 {
        margin-bottom: 10px;
    }
    div + h5 {
        margin-top: 10px;
    }
    pre + h3 {
        margin-top: 30px;
    }
    .followed-by-list {
        margin-bottom: 30px;
    }

    @media (max-width: ${desktop}) {
        .lead.has-header {
            margin-bottom: 0;
        }
        pre code {
            max-width: 100%;
            padding: 30px;
            font-size: 12px;
            border-radius: 8px;
        }
        pre + ul,
        pre + p,
        pre + div,
        pre + .cta {
            margin-top: 30px;
        }
        div + table,
        div + h5 {
            margin-top: 30px;
        }
        pre code {
            background: #151515;
        }
        pre:after {
            background: transparent;
        }
        hr {
            width: calc(100% + 200px);
        }
    }
    @media (max-width: ${mobile}) {
        pre code {
            padding: 20px;
            -webkit-overflow-scrolling: touch;
        }
        .lead {
            font-size: 22px;
        }
    }
`
