import * as React from "react"
import * as ReactDOM from "react-dom"
import styled from "styled-components"
import { usePath, Dynamic } from "monobase"

const Info = styled.div`
    position: fixed;
    top: 10px;
    right: 100px;
    text-align: center;
    pointer-events: none;
    transition: all 0.2s ease;
    transform: scale(0.9);
    user-select: none;
    opacity: 0;

    .text {
        display: inline-block;
        font-size: 13px;
        font-weight: 500;
        background: rgba(0, 153, 255, 0.2);
        color: #09f;
        border-radius: 6px;
        padding: 8px 12px 6px;
        -webkit-text-select: none;
    }

    &.show {
        opacity: 1;
        transform: scale(1);
    }
    &.hide {
        opacity: 0;
        transform: scale(0.9);
    }
`

const Toast: React.FunctionComponent<{ onHide: () => void }> = React.memo(props => {
    const [isVisible, setVisibility] = React.useState(false)

    React.useEffect(() => {
        setVisibility(true)
        const timer = setTimeout(() => {
            setVisibility(false)
            setTimeout(props.onHide, 200)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <Info className={isVisible ? "show" : "hide"}>
            <span className="text">{props.children}</span>
        </Info>
    )
})

const CopyToClipboardElement: React.FunctionComponent<{ href: string } & React.AnchorHTMLAttributes<any>> = ({
    children,
    ...props
}) => {
    const [showInfo, setShowInfo] = React.useState(false)

    const handleInfoHide = React.useCallback(() => setShowInfo(false), [])
    const handleCopyClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        history.replaceState(null, "", event.currentTarget.hash)

        // Cache current selection
        const selection = window.getSelection()
        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null

        // Copy text to the clipboard.
        const textarea = document.createElement("textarea")
        textarea.style.position = "fixed"
        textarea.style.width = "0"
        textarea.style.height = "0"
        textarea.style.opacity = "0"

        textarea.readOnly = true
        textarea.textContent = event.currentTarget.href
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        textarea.remove()

        // Restore previous selection
        if (range) {
            selection.removeAllRanges()
            selection.addRange(range)
        }

        setShowInfo(true)
    }, [])

    return (
        <a {...props} onClick={handleCopyClick}>
            {children}
            {showInfo ? ReactDOM.createPortal(<Toast onHide={handleInfoHide}>Copied Link</Toast>, document.body) : null}
        </a>
    )
}

export const CopyToClipboard = Dynamic(CopyToClipboardElement)

/**
 * Registers an in-page id reference to allow us to render the SubNavigation
 * Pass the `skipnav` to ignore the link.
 */

const PermalinkSpan = styled.span`
    position: absolute;
    left: 0;
    opacity: 0;
    pointer-events: none;

    h2 & {
        font-size: 19px;
        font-weight: 500;
        top: 5px;
    }
    h2:hover &,
    h3:hover & {
        opacity: 1;
        pointer-events: all;
    }
    .copy {
        position: absolute;
        left: 0;
        color: #999;
    }
    .copy:hover {
        color: #05f;
    }
    .copy:active {
        color: #000;
    }
`

export const Permalink: React.FunctionComponent<{ id: string; name: string; skipnav?: boolean }> = ({
    id,
    name,
    skipnav = false,
}) => {
    if (!id && !name) return null

    // Attach data attributes to element for building subnav
    const data = skipnav ? {} : { "data-permalink-id": id, "data-permalink-name": name }
    return (
        <>
            <PermalinkSpan {...data}>
                <CopyToClipboard title="Copy Link" className="copy" href={`#${id}`}>
                    #
                </CopyToClipboard>
                <PermalinkAnchor id={id} />
            </PermalinkSpan>
        </>
    )
}

/**
 * Puts a linkable anchor on the page, see <RefAnchor />
 */
export const PermalinkAnchor: React.FunctionComponent<{ id: string }> = ({ id }) => {
    // Offset the permalink from its position in the DOM to give some breathing room.
    const style: React.CSSProperties = { position: "absolute", top: -60, display: "block" }
    return <span id={id} data-permalink-id={id} data-permalink-path={`${usePath()}#${id}`} aria-hidden style={style} />
}
