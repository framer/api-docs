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

    &:not(:first-child) {
        margin-bottom: 20px;

        @media (max-width: ${tablet}) {
            margin-bottom: 0;
        }
    }

    a {
        font-size: 15px;
        font-weight: 500;
        color: ${menuTextColor};
        transition: color 0.2s ease;

        &:hover {
            color: #05f;
        }
    }

    path {
        fill: currentColor;
    }
`

const Icon = styled.div`
    display: inline-block;
    position: relative;
    top: 2px;
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
    position: absolute;
    right: 18px;
    color: #666;
    background: #eee;
    padding: 4px 9px 2px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 12px;

    @media (max-width: ${tablet}) {
        position: relative;
        margin-left: 30px;
    }
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
            <a href={isMotion() ? motionUrl : libraryUrl}>
                <Icon>
                    <svg style={{ marginRight: "10px" }} xmlns="http://www.w3.org/2000/svg" width="10" height="15">
                        <path
                            d={isMotion() ? "M0 0l5 5 5-5v10H0zm5 10l5 5H0z" : "M10 0v5H5L0 0zM0 5h5l5 5H5v5l-5-5z"}
                            fill="#000"
                        />
                    </svg>
                </Icon>
                <span style={{ fontWeight: 600, paddingTop: "3px", letterSpacing: "-0.5px" }}>API</span>
            </a>
            <VersionBadge version={formatVersion(isMotion() ? motionVersion : libraryVersion)} />

            <DynamicMobileToggle />
        </SideBarHeader>
        <SideBarHeader>
            <a href={isMotion() ? libraryUrl : motionUrl}>{`Framer ${isMotion() ? "Library" : "Motion"} ›`}</a>
        </SideBarHeader>

        <Navigation />
    </SideBarWrapper>
)
