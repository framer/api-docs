import * as React from "react"

import { Page } from "../components/Template"
import { Codebar } from "../components/layout/Codebar"
import { MarkdownStyles, InlineButton, Grid, Center } from "components"

export default function render() {
    return (
        <Page showEdit={false}>
            <Grid className="four-o-four">
                <Center className="error-message">
                    <MarkdownStyles>
                        <h2>Oops! Page not found.</h2>
                        <InlineButton href="/api" style={{ marginTop: 15 }}>
                            Back Home
                        </InlineButton>
                    </MarkdownStyles>
                </Center>
                <Center className="error-graphic">
                    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="60">
                        <path d="M45.111 0v45H0z" fill="#09f" />
                        <path d="M200 0v45h-45.111z" fill="rgba(255, 255, 255, 1.00)" />
                        <path
                            d="M105.259 0v60C88.65 60 75.185 46.569 75.185 30c0-16.569 13.465-30 30.074-30z"
                            fill="#adf"
                        />
                        <path
                            d="M105.259 0v60c16.61 0 30.074-13.431 30.074-30 0-16.569-13.464-30-30.074-30z"
                            fill="#adf"
                            opacity=".5"
                        />
                        <path d="M22.556 45h22.555v15H22.556z" fill="rgba(0, 153, 255, 1.00)" opacity=".5" />
                        <path d="M177.444 45H200v15h-22.556z" fill="rgba(255, 255, 255, 1.00)" opacity=".5" />
                    </svg>
                </Center>
            </Grid>
            <Codebar />
        </Page>
    )
}
