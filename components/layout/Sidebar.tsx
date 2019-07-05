import * as React from "react"
import styled from "styled-components"
import { Dynamic } from "monobase"
import { tablet } from "./Breakpoints"
import { Navigation } from "../Navigation"
import { menuTextColor } from "../theme"
import { version as libraryVersion } from "framer/package.json"
import { version as motionVersion } from "framer-motion/package.json"
import { isMotion } from "../utils/env"
import { motion } from "framer"

const libraryUrl = "/api/"
const motionUrl = "/api/motion/"

const SideBarHeader = styled.div`
    display: flex;
    height: 60px;
    place-items: center;
    border-bottom: 1px solid #eee;
    padding: 15px 20px;
    margin-bottom: 20px;

    @media (max-width: ${tablet}) {
        margin-bottom: 0;
    }

    path {
        fill: currentColor;
    }
`

const Home = styled.a`
    font-size: 15px;
    font-weight: 500;
    color: ${menuTextColor};
    transition: color 0.2s ease;

    &:hover {
        color: #05f;
    }

    span {
        font-weight: 600;
        padding-top: 3px;
        letter-spacing: -0.5px;
    }
`

const APISwitch = styled.a`
    position: absolute;
    display: flex;
    place-items: center;
    place-content: center;
    height: 24px;
    right: 60px;
    color: #666;
    background: #eee;
    padding: 4px 9px;
    margin-left: 12px;
    border-radius: 6px;
    font-weight: 600;
    font-size: 12px;
    transition: 0.2s ease;
    transition-property: color, background;

    &:after {
        content: "›";
        font-weight: 500;
        margin-left: 4px;
    }

    &:hover {
        background: #05f;
        color: #fff;
    }

    span {
        padding-top: 2px;
    }

    svg {
        fill: currentColor;
        margin-right: 5px;
    }

    @media (min-width: ${tablet}) {
        right: 20px;
    }
`

const Icon = styled.div`
    display: inline-block;
    position: relative;
    top: 2px;

    svg {
        margin-right: 8px;
    }
`

const Toggle = styled.div`
    position: absolute;
    right: 20px;
    z-index: 1000;

    @media (min-width: ${tablet}) {
        display: none;
    }
`

const SideBarWrapper = styled.aside`
    position: fixed;
    top: 0;
    left: 0;
    width: 250px;
    height: 100%;
    background: #fafafa;
    border-right: 1px solid #eee;
    overflow-y: auto;
    transition: none;
    z-index: 1000;
    padding-bottom: 20px;

    &.has-clicked {
        transition: height 0.2s ease;
    }

    @media (max-width: ${tablet}) {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid #eee;
        z-index: 2000;
        user-select: none;
        height: 60px;
        overflow: hidden;
        -webkit-overflow-scrolling: touch;

        &.is-open {
            height: 100vh;
            overflow: auto;
        }
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

const VersionBadgeBackground = styled.div`
    color: #666;
    background: #eee;
    padding: 4px 9px 2px;
    margin-left: 12px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 12px;
`

const VersionBadge: React.FunctionComponent<{ version: string }> = props => {
    return <VersionBadgeBackground>v&#8202;&#8202;{props.version}</VersionBadgeBackground>
}

// Format the npm version string. 1.0.0-beta.10 -> 1.0.0 Beta 10
function formatVersion(str: string): string {
    function formatPrerelease(str: string): string {
        if (str.length === 0) return str
        const [name, ...rest] = str.split(".")
        return name[0].toUpperCase() + name.slice(1) + " " + rest.join(".")
    }

    const [version, ...prerelease] = str.split("-")
    return version + " " + formatPrerelease(prerelease.join("-"))
}

export const Sidebar: React.FunctionComponent = () => (
    <SideBarWrapper className="side-bar-wrapper">
        <SideBarHeader>
            <Home href={isMotion() ? motionUrl : libraryUrl}>
                <Icon>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${isMotion() ? 13 : 10} 15`} height={15}>
                        <path
                            d={
                                isMotion()
                                    ? "M0 14V1l6.5 6.5L13 1v13l-3.25-3.25L6.5 14l-3.25-3.25z"
                                    : "M10 0v5H5L0 0zM0 5h5l5 5H5v5l-5-5z"
                            }
                        />
                    </svg>
                </Icon>
                <span>API</span>
            </Home>
            <VersionBadge version={formatVersion(isMotion() ? motionVersion : libraryVersion)} />
            <APISwitch href={isMotion() ? libraryUrl : motionUrl}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${isMotion() ? 10 : 13} 15`} height={11}>
                    <path
                        d={
                            isMotion()
                                ? "M10 0v5H5L0 0zM0 5h5l5 5H5v5l-5-5z"
                                : "M0 14V1l6.5 6.5L13 1v13l-3.25-3.25L6.5 14l-3.25-3.25z"
                        }
                    />
                </svg>
                <span>API</span>
            </APISwitch>
            <DynamicMobileToggle />
        </SideBarHeader>
        <Navigation />
    </SideBarWrapper>
)
