import * as React from "react"
import * as ReactDOM from "react-dom"
import styled from "styled-components"
import { Dynamic } from "monobase"

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
