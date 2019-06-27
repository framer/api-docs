import * as React from "react"
import { Page } from "./Template"
import { MarkdownStyles } from "./layout/Markdown"

export const Changelog: React.FC = ({ children }) => {
    return (
        <Page title="Changelog">
            <MarkdownStyles>{children}</MarkdownStyles>
        </Page>
    )
}
