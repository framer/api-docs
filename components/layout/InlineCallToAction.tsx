import * as React from "react"
import styled from "styled-components"
import { desktop, tablet } from "./Breakpoints"

interface CTAProps {
    link: string
    name: string
}

const InlineLink = styled.a`
    display: inline-block;
    font-weight: 500;
    color: var(--accent);

    &:hover {
        opacity: 0.7;
    }

    + .cta {
        margin-top: 5px;
    }

    @media (max-width: ${desktop}) {
        margin-bottom: 20px;
    }
`

export const InlineButton = styled.a`
    display: inline-block;
    font-weight: 500;
    color: var(--accent);
    background: var(--accent-backdrop);
    padding: 7px 12px 5px;
    border-radius: 5px;
    font-size: 15px;

    &:hover {
        opacity: 0.7;
    }

    @media (max-width: ${desktop}) {
        margin-bottom: 20px;
    }
    @media (min-width: ${tablet}) {
        margin-bottom: 20px;
    }
`

export const CTA: React.FunctionComponent<CTAProps> = props => {
    return (
        <InlineLink className="cta" href={props.link} target="_blank">
            {props.name + " ›"}
        </InlineLink>
    )
}

export const Button: React.FunctionComponent<CTAProps> = props => {
    return (
        <InlineButton href={props.link} target="_blank">
            {props.name}
        </InlineButton>
    )
}
