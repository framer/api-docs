import * as React from "react"
import styled from "styled-components"
import { tablet } from "./Breakpoints"
import { Navigation } from "../Navigation"
import { menuTextColor } from "../theme"
import { version as libraryVersion } from "framer/package.json"
import { version as motionVersion } from "framer-motion/package.json"
import { isMotion } from "../utils/env"
import { DynamicMobileToggle } from "./dynamic/MobileToggle"
import { Logo } from "./Logo"

const libraryUrl = "/api/"
const motionUrl = "/api/motion/"

const HeaderWrapper = styled.div`
    position: relative;
    height: 58px;

    &:before {
        content: "";
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 100;
        box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.05);
        transition: opacity 0.2s ease;

        .is-search & {
            opacity: 0.4;
        }
    }
`

const Header = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    place-items: center;
    padding: 15px 20px;
    transition: opacity 0.2s ease;

    .is-search & {
        opacity: 0.2;
    }
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

const APISwitchWrapper = styled.div`
    position: relative;
    height: 46px;

    &:before {
        content: "";
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 100;
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
        transition: opacity 0.2s ease;

        .is-search & {
            opacity: 0.4;
        }
    }
`

const APISwitch = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    transition: opacity 0.2s ease;

    .is-search & {
        opacity: 0.2;
    }
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
        z-index: 3000;
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

export const Sidebar: React.FunctionComponent = () => (
    <SideBarWrapper className="side-bar-wrapper">
        <SideBarHeader>
            <HeaderWrapper>
                <Header>
                    <Home href={isMotion() ? motionUrl : libraryUrl}>
                        <Icon>
                            <Logo />
                        </Icon>
                        <span>API</span>
                    </Home>
                    <VersionBadge version={formatVersion(isMotion() ? motionVersion : libraryVersion)} />
                    <DynamicMobileToggle />
                </Header>
            </HeaderWrapper>
            <APISwitchWrapper>
                <APISwitch>
                    <APISwitchItem isActive={!isMotion()}>Library</APISwitchItem>
                    <APISwitchItem isMotion isActive={isMotion()}>
                        Motion
                    </APISwitchItem>
                </APISwitch>
            </APISwitchWrapper>
        </SideBarHeader>
        <Navigation />
    </SideBarWrapper>
)
