import * as React from "react"
import styled from "styled-components"
import { tablet } from "./Breakpoints"
import { Navigation } from "../Navigation"
import { menuTextColor } from "../theme"
import { version as libraryVersion } from "framer/package.json"
import { version as motionVersion } from "framer-motion/package.json"
import { isMotion } from "../utils/env"
import { DynamicMobileToggle } from "./dynamic/MobileToggle"

const libraryUrl = "/api/"
const motionUrl = "/api/motion/"

const Header = styled.div`
    display: flex;
    height: 58px;
    place-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`

const Home = styled.a`
    font-size: 15px;
    font-weight: 500;
    color: ${menuTextColor};
    transition: color 0.2s ease;

    &:hover {
        color: var(--accent);
    }

    span {
        font-weight: 600;
        padding-top: 3px;
        letter-spacing: -0.5px;
    }
`

const APISwitch = styled.div`
    display: flex;
    height: 46px;
`

const APISwitchItem = styled.a.attrs<{ isMotion?: boolean }>(({ isMotion }) => ({
    href: isMotion ? motionUrl : libraryUrl,
}))<{ isMotion?: boolean; isActive?: boolean }>`
    display: flex;
    flex: 1;
    padding-top: 2px;
    place-items: center;
    place-content: center;
    font-size: 15px;
    font-weight: 500;
    color: ${({ isActive }) => (isActive ? "#000" : "#666")};
    background: ${({ isActive }) => (isActive ? "transparent" : "#f6f6f6")};
    transition: background 0.2s ease;

    &:hover {
        background: ${({ isActive }) => (isActive ? "transparent" : "#f4f4f4")};
    }

    &:first-child {
        border-right: 1px solid rgba(0, 0, 0, 0.05);
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

const SideBarHeader = styled.div`
    display: flex;
    flex-flow: column nowrap;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;

    @media (max-width: ${tablet}) {
        margin-bottom: 0;
    }

    path {
        fill: currentColor;
    }
`

const SideBarWrapper = styled.aside`
    position: fixed;
    top: 0;
    left: 0;
    width: 250px;
    height: 100%;
    background: #fafafa;
    border-right: 1px solid rgba(0, 0, 0, 0.05);
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
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        z-index: 2000;
        user-select: none;
        height: 58px;
        overflow: hidden;
        -webkit-overflow-scrolling: touch;

        &.is-open {
            height: 100vh;
            overflow: auto;
        }
    }
`

const VersionBadgeBackground = styled.div`
    color: #666;
    background: #eee;
    padding: 4px 9px 2px;
    margin-left: auto;
    border-radius: 6px;
    font-weight: 500;
    font-size: 12px;

    @media (max-width: ${tablet}) {
        margin-right: 40px;
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

// export const APISwitch: React.FunctionComponent = () => <div>Hello</div>

export const Sidebar: React.FunctionComponent = () => (
    <SideBarWrapper className="side-bar-wrapper">
        <SideBarHeader>
            <Header>
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
                <DynamicMobileToggle />
            </Header>
            <APISwitch>
                <APISwitchItem isActive={!isMotion()}>Library</APISwitchItem>
                <APISwitchItem isMotion isActive={isMotion()}>
                    Motion
                </APISwitchItem>
            </APISwitch>
        </SideBarHeader>
        <Navigation />
    </SideBarWrapper>
)
