import * as React from "react"
import styled from "styled-components"
import { urlFor, usePath } from "monobase"
import { tablet } from "./Breakpoints"
import { menuTextColor } from "../theme"
import { DynamicSubNavigation } from "./dynamic/SubNavigation"

const ListWrapper = styled.ul`
    padding-left: 20px;

    @media (max-width: 800px) {
        padding-left: 0;
    }
`

const SubTitleElement = styled.li`
    list-style: none;
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 500;
    color: #aaa;
    letter-spacing: 0.5px;

    li + & {
        margin-top: 20px;
        padding-top: 20px;
        width: calc(100% - 20px);
    }

    @media (max-width: ${tablet}) {
        display: none;
    }
`
export const SubTitle: React.FunctionComponent<{ name: string }> = props => (
    <SubTitleElement>{props.name}</SubTitleElement>
)

const ListItem = styled.li`
    display: block;
    font-size: 15px;
    font-weight: 500;
    padding-top: 10px;
    transition: color 0.2s ease;
    list-style: none;

    .theme-motion & {
        background: red !important;
    }

    a {
        color: ${menuTextColor};
    }
    &.active > a {
        color: var(--accent);
    }
    a:hover {
        color: var(--accent);
    }

    @media (max-width: ${tablet}) {
        font-size: 17px;
        border-bottom: 1px solid #eee;
        padding: 15px;

        a {
            display: block;
        }
    }
`

interface MenuItemProps {
    title: string
    href: string

    external?: boolean
    className?: string
}

export const Menu: React.FunctionComponent = ({ children }) => <ListWrapper>{children}</ListWrapper>

export const MenuItem: React.FunctionComponent<MenuItemProps> = props => {
    const { title, external } = props
    let { href, className = "" } = props
    let active = false

    if (external) {
        className += " external"
    } else {
        href = urlFor(href)
        active = href === usePath()
    }

    if (active) {
        className += " active"
    }

    return (
        <ListItem className={className.trim()}>
            <a href={href} target={external ? "_blank" : ""}>
                {title} {external ? "›" : null}
            </a>
            {active && !external ? <DynamicSubNavigation /> : null}
        </ListItem>
    )
}
