import * as React from "react"
import styled from "styled-components"
import { urlFor, usePath, Development, StyledSheet, useContext } from "monobase"
import { FramerAPIDefaultProvider } from "./contexts/FramerAPIContext"
import { Search } from "./layout/dynamic/Search"
import { Sidebar } from "./layout/Sidebar"
import { Codebar } from "./layout/Codebar"
import { tablet, mobile } from "./layout/Breakpoints"
import { Markdown } from "./layout/Markdown"
import { GoogleTag } from "./GoogleTag"
import { isMotion } from "./utils/env"

const Body = styled.body`
    --library: #09f;
    --motion: #85f;

    --accent: ${() => (isMotion() ? "var(--motion)" : "var(--library)")};
    --accent-selection: ${() => (isMotion() ? "rgba(136, 85, 255, 0.9)" : "rgba(0, 153, 255, 0.9)")};
    --accent-backdrop: ${() => (isMotion() ? "rgba(136, 85, 255, 0.1)" : "rgba(0, 153, 255, 0.1)")};

    --animation-left: ${() => (isMotion() ? "#85f" : "#09f")};
    --animation-middle: ${() => (isMotion() ? "#caf" : "#adf")};
    --animation-right: #fff;

    font-family: Colfax, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,
        Droid Sans, Helvetica Neue, sans-serif;
    font-feature-settings: "liga", "kern";
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overscroll-behavior: none;

    /* Selection */
    *::selection {
        background: var(--accent-selection);
        color: #fff;
    }

    // Applied in bootstrap.ts
    &.is-mouseover-code {
        user-select: none;
    }

    &.is-mouseover-code pre code {
        user-select: text;
    }

    // Highlight missing links
    .link-ref-missing {
        color: #f97 !important;
    }

    /* Draw a box around API components in "debug" mode to help distinguish TSDoc from Markdown */
    &.debug-mode .framer-api {
        position: relative;
    }
    &.debug-mode .framer-api::after {
        position: absolute;
        display: block;
        content: "";
        top: -6px;
        left: -6px;
        right: -6px;
        bottom: -6px;
        border: 1px solid rgba(255, 0, 0, 0.2);
        border-radius: 3px;
        pointer-events: none;
        background: rgba(255, 0, 0, 0.1)
            repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255, 0, 0, 0.1) 10px,
                rgba(255, 0, 0, 0.1) 20px
            );
    }
`

const Main = styled.main`
    max-width: 100%;
    padding-left: 310px;
    padding-top: 108px;
    padding-bottom: 50px;
    margin-left: auto;
    margin-right: auto;

    @media (max-width: ${tablet}) {
        padding: 156px 40px 40px;
        overflow-x: hidden;
    }
    @media (max-width: ${mobile}) {
        padding: 136px 20px 20px;
    }
`

const EditButton = styled.a`
    position: fixed;
    font-size: 13px;
    font-weight: 500;
    top: 10px;
    right: 10px;
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 6px;
    padding: 8px 12px 6px;
    transition: background 0.2s ease;
    z-index: 1000;

    &:hover {
        background: rgba(255, 255, 255, 0.15);
    }

    @media (max-width: ${tablet}) {
        display: none;
    }
`
/** Template ONLY for mdx files. It does custom processing of the children. */
export const Template = (title: string): React.FunctionComponent => ({ children }) => (
    <Page title={title}>
        <Markdown>{children}</Markdown>
        <Codebar className="codebar" />
    </Page>
)

/** Base HTML markup for the page. */
export const Page: React.FunctionComponent<{ title?: string; showEdit?: boolean }> = ({
    title,
    children,
    showEdit,
}) => {
    // Use context gives the file path
    const path = "https://github.com/framer/api-docs/edit/master/" + useContext().path
    let pageTitle = isMotion() ? `Framer Motion API` : `Framer API`
    if (title) {
        pageTitle += ` | ${title}`
    }
    const description = isMotion()
        ? "An open source, production-ready motion library for React on the web"
        : "A JavaScript library for rapid interactive prototyping for web and mobile."
    const socialImage = isMotion()
        ? "https://framer.com/static/images/social/motion.png"
        : "https://static.framer.com/api/social.png"

    // Use path gives the page name
    if (showEdit === undefined) {
        showEdit =
            usePath() !== "/api/" &&
            usePath() !== "" &&
            usePath() !== "/api/tutorial/" &&
            usePath() !== "/" &&
            usePath() !== "/tutorial" &&
            usePath() !== "/api/motion/" &&
            usePath() !== "/motion"
    }

    // All page UI must go in this variable for <StyledSheet> to pick them up.
    const body = (
        <Body>
            <Main className="wrapper">
                <Sidebar />
                <Search />

                {showEdit ? (
                    <EditButton target="_blank" rel="noopener" href={path}>
                        Edit Page
                    </EditButton>
                ) : null}

                {children}
            </Main>
            {/* The Development component adds auto reloading */}
            <Development />
        </Body>
    )

    // NOTE: HTML must be the root level node.
    return (
        <html>
            <FramerAPIDefaultProvider>
                <head>
                    <meta charSet="utf-8" />
                    <title>{pageTitle}</title>
                    <link rel="stylesheet" href={urlFor("/static/styles/fonts.css")} />
                    <link rel="stylesheet" href={urlFor("/static/styles/highlight.css")} />
                    <link rel="stylesheet" href={urlFor("/static/styles/reset.css")} />
                    <link rel="stylesheet" href={urlFor("/static/styles/global.css")} />
                    <link rel="shortcut icon" href="https://static.framer.com/api/favicon.ico" />

                    <meta content="width=device-width, initial-scale=1" name="viewport" />
                    <StyledSheet app={body} />

                    {/* Monobase Dynamic components inject this element */}
                    <style>{`component { display: contents; }`}</style>

                    {/* Disable Prism auto highlighting everything */}
                    <script>{`window.Prism = {manual: true}`}</script>

                    {/* Meta Tags */}
                    <meta name="title" content="Framer API" />
                    <meta name="description" content={description} />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://framer.com/api" />
                    <meta property="og:title" content={pageTitle} />
                    <meta property="og:description" content={description} />
                    <meta property="og:image" content={socialImage} />
                    <meta name="twitter:card" content="photo" />
                    <meta name="twitter:site" content="@framer" />
                    <meta name="twitter:creator" content="@framer" />
                    <meta name="twitter:title" content={pageTitle} />
                    <meta name="twitter:description" content={description} />
                    <meta name="twitter:image:src" content={socialImage} />
                    <meta name="twitter:domain" content="https://framer.com/api" />

                    {/* Tracking */}
                    <GoogleTag analyticsId="UA-37076997-17" />
                </head>
                {body}
            </FramerAPIDefaultProvider>
        </html>
    )
}
