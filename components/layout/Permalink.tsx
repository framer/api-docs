import * as React from "react"
import styled from "styled-components"
import { usePath } from "monobase"
import { CopyToClipboard } from "./dynamic/CopyToClipboard"

/**
 * Registers an in-page id reference to allow us to render the SubNavigation
 * Pass the `skipnav` to ignore the link.
 */

const PermalinkSpan = styled.span`
    position: absolute;
    left: 0;
    opacity: 0;
    pointer-events: none;

    h2 & {
        font-size: 19px;
        font-weight: 500;
        top: 5px;
    }
    h2:hover &,
    h3:hover & {
        opacity: 1;
        pointer-events: all;
    }
    .copy {
        position: absolute;
        left: 0;
        color: #999;
    }
    .copy:hover {
        color: #05f;
    }
    .copy:active {
        color: #000;
    }
`

export const Permalink: React.FunctionComponent<{ id: string; name: string; skipnav?: boolean }> = ({
    id,
    name,
    skipnav = false,
}) => {
    if (!id && !name) return null

    // Attach data attributes to element for building subnav
    const data = skipnav ? {} : { "data-permalink-id": id, "data-permalink-name": name }
    return (
        <>
            <PermalinkSpan {...data}>
                <CopyToClipboard title="Copy Link" className="copy" href={`#${id}`}>
                    #
                </CopyToClipboard>
                <PermalinkAnchor id={id} />
            </PermalinkSpan>
        </>
    )
}

/**
 * Puts a linkable anchor on the page, see <RefAnchor />
 */
export const PermalinkAnchor: React.FunctionComponent<{ id: string }> = ({ id }) => {
    // Offset the permalink from its position in the DOM to give some breathing room.
    const style: React.CSSProperties = { position: "absolute", top: -60, display: "block" }
    return <span id={id} data-permalink-id={id} data-permalink-path={`${usePath()}#${id}`} aria-hidden style={style} />
}
