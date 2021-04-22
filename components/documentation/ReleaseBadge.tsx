import * as React from "react"
import { ReleaseTag } from "../../model"
import styled from "styled-components"

const AlphaBadge = styled.span`
    background: rgba(255, 187, 0, 0.1);
    color: #fa0 !important;
    font-size: 13px;
    font-weight: 600 !important;
    letter-spacing: 0;
    text-transform: uppercase;
    padding: 4px 6px 3px;
    border-radius: 5px;
    position: relative;
    top: -4px;
    margin-left: 5px;

    h3 & {
        border-radius: 4px;
        font-size: 11px;
        top: -1px;
    }
`

const BetaBadge = styled.span`
    background: var(--accent-backdrop);
    color: var(--accent) !important;
    font-size: 13px;
    font-weight: 600 !important;
    letter-spacing: 0;
    text-transform: uppercase;
    padding: 4px 6px 3px;
    border-radius: 5px;
    position: relative;
    top: -4px;
    margin-left: 5px;

    h3 & {
        border-radius: 4px;
        font-size: 11px;
        top: -1px;
    }
`

/**
 * Renders a badge for the current release tag if needed
 */
export const ReleaseBadge: React.FunctionComponent<{ releaseTag: ReleaseTag }> = props => {
    switch (props.releaseTag) {
        case ReleaseTag.Alpha:
            return <AlphaBadge>Alpha</AlphaBadge>
        case ReleaseTag.Beta:
            return <BetaBadge>Beta</BetaBadge>
        default:
            return null
    }
}
