import * as React from "react"
import styled, { keyframes } from "styled-components"
import { desktop, widescreen, mobile } from "./Breakpoints"
import { Permalink } from "./Permalink"
import { isMotion } from "../utils/env"

const Background = styled.div<{ height?: number; internal?: boolean }>`
    display: flex;
    place-content: center;
    place-items: center;
    height: ${props => props.height || "260px"};
    background: rgba(255, 255, 255, 0.075);
    border-radius: 8px;
    margin-top: ${props => (props.internal ? "-76px !important" : "0px !important")};
    margin-left: 20px;
    width: 100%;
    overflow: hidden;
    -webkit-user-select: none;
    user-select: none;

    @media (min-width: ${widescreen}) {
        max-width: 100%;
        margin-left: 20px;
        width: 100%;
    }

    @media (max-width: ${desktop}) {
        position: relative;
        width: 100%;
        margin-left: 0;
        margin-top: ${props => (props.internal ? "0px !important" : "0px !important")};
        left: 0;
        margin-bottom: 60px;
        background: ${props => (props.height ? "#242424" : "#151515")};
    }
`

const BackgroundLogo = styled(Background)`
    height: 260px;
    margin-top: 10px;
    margin-left: 20px;

    @media (min-width: ${widescreen}) {
        margin-left: 20px;
    }

    @media (max-width: ${mobile}) {
        height: 200px;
    }
`

export const animation = keyframes`
  0% {
     transform: translateY(-15px);
  }
  100% {
    transform: translateY(15px);
  }
`

export const IconWrapper = styled.section`
    transform: translateY(-15px);
    -webkit-animation: ${animation} 1s cubic-bezier(0.445, 0.05, 0.55, 0.95) 0s infinite alternate;
    animation: ${animation} 1s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite alternate;
`

export const IconWrapperTwo = styled.section`
    transform: translateY(-15px);
    -webkit-animation: ${animation} 1s cubic-bezier(0.445, 0.05, 0.55, 0.95) -0.15s infinite alternate;
    animation: ${animation} 1s cubic-bezier(0.445, 0.05, 0.55, 0.95) -0.15s infinite alternate;
`

export const IconWrapperThree = styled.section`
    transform: translateY(-15px);
    -webkit-animation: ${animation} 1s cubic-bezier(0.445, 0.05, 0.55, 0.95) -0.3s infinite alternate;
    animation: ${animation} 1s cubic-bezier(0.445, 0.05, 0.55, 0.95) -0.3s infinite alternate;
`
export const Stack = styled.div`
    width: 252px;
    height: 60px;
    display: flex;
    justify-content: space-between;
    place-items: center;

    @media (max-width: ${mobile}) {
        transform: scale(0.75);
    }
`

const VideoBackground = styled.div<{ height?: number; internal?: boolean }>`
    width: 100%;
    position: relative;
    padding-bottom: 56.25%;
    padding-top: 25px;
    height: 0;
    border-radius: 10px;
    overflow: hidden;
    margin-left: 20px;
    margin-top: 0 !important;

    @media (min-width: ${widescreen}) {
        width: 560px;
        height: 315px;
        padding: 0;
    }

    @media (max-width: ${desktop}) {
        margin-left: 0;
    }

    iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
`

export const EmbeddedVideo: React.FunctionComponent = (props: any) => {
    return <VideoBackground className="header video">{props.children}</VideoBackground>
}

export const EmbeddedDemo: React.FunctionComponent = (props: any) => {
    return (
        <Background
            className="embedded-demo header"
            height={props.height ? props.height : 300}
            internal={props.internal}
        >
            {props.children}
        </Background>
    )
}

export const Header: React.FunctionComponent = () => {
    return (
        <BackgroundLogo className="header">
            <Stack>
                <IconWrapper>
                    <svg xmlns="http://www.w3.org/2000/svg" width="72" height="60">
                        <g>
                            <path d="M 72 60 L 36 60 L 36 0 Z" fill="#09f" opacity="0.5" />
                            <path d="M 36 60 L 0 60 L 36 0 Z" fill="#09f" />
                        </g>
                    </svg>
                </IconWrapper>

                <IconWrapperTwo>
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="60">
                        <g>
                            <path d="M 0 0 L 30 0 L 30 60 L 0 60 Z" fill="#adf" opacity="0.5" />
                            <path
                                d="M 0 0 L 30 0 C 41.046 0 50 8.954 50 20 L 50 20 C 50 31.046 41.046 40 30 40 L 0 40 Z"
                                fill="#adf"
                            />
                        </g>
                    </svg>
                </IconWrapperTwo>

                <IconWrapperThree>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="60">
                        <path d="M 0 0 L 30 0 L 30 60 L 0 60 Z" fill="#fff" />
                    </svg>
                </IconWrapperThree>
            </Stack>
        </BackgroundLogo>
    )
}

const createHeading = (level: string): React.FunctionComponent<{ id?: string; title?: string }> => {
    return ({ id, title, children }) =>
        React.createElement(level, {}, id ? <Permalink id={id} name={title || ""} skipnav={!title} /> : null, children)
}

export const H1 = createHeading("h1")
export const H2 = createHeading("h2")
export const H3 = createHeading("h3")
export const H4 = createHeading("h4")
export const H5 = createHeading("h5")
export const H6 = createHeading("h6")
