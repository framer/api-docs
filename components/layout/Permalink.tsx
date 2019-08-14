import * as React from "react"
import styled from "styled-components"
import { usePath } from "monobase"
import { CopyToClipboard } from "./dynamic/CopyToClipboard"

export type WithSkipNav = { skipnav?: boolean }

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
        color: var(--accent);
    }
    .copy:active {
        color: #000;
    }
`

export const Permalink: React.FunctionComponent<{ id: string; name: string; modelId?: string; skipnav?: boolean }> = ({
    id,
    name,
    modelId,
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
                <PermalinkAnchor id={id} modelId={modelId} />
            </PermalinkSpan>
        </>
    )
}

/**
 * Puts a linkable anchor on the page, see <RefAnchor />. The `modelId` should
 * be the API model identifier, used to link up the <Ref> component.
 */
export const PermalinkAnchor: React.FunctionComponent<{ id: string; modelId?: string }> = ({ id, modelId }) => {
    // Offset the permalink from its position in the DOM to give some breathing room.
    const style: React.CSSProperties = { position: "absolute", top: -60, display: "block" }
    return (
        <span
            id={id}
            data-permalink-id={id}
            data-permalink-path={`${usePath()}#${id}`}
            data-permalink-ref={modelId}
            aria-hidden
            style={style}
        />
    )
}
