import * as React from "react"
import styled from "styled-components"
import { Dynamic } from "monobase"
import { tablet } from "../Breakpoints"

const Toggle = styled.div`
    position: absolute;
    right: 20px;
    z-index: 1000;

    @media (min-width: ${tablet}) {
        display: none;
    }
`

const MobileToggle: React.FunctionComponent = () => {
    // Use class to handle the click event. Ideally we'd pass a callback
    // from the Sidebar component but we can't make that dynamic right now
    // because the menu items need to access the Monobase context and that's
    // not available clientside.
    const onClick = React.useCallback((evt: React.MouseEvent<HTMLElement>) => {
        evt.preventDefault()
        const sidebar = document.querySelector(".side-bar-wrapper")
        if (sidebar) {
            sidebar.classList.add("has-clicked")
            sidebar.classList.toggle("is-open")
        }
    }, [])
    return (
        <Toggle onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <path d="M2 4h16v2H2zM2 9h16v2H2zM2 14h16v2H2z" fill="hsl(0, 0%, 0%)" />
            </svg>
        </Toggle>
    )
}

export const DynamicMobileToggle = Dynamic(MobileToggle)
