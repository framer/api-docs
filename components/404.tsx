import * as React from "react"
import styled from "styled-components"
import { Page } from "../components/Template"
import { Codebar } from "../components/layout/Codebar"
import { MarkdownStyles, InlineButton, Grid, Center, AnimationCharacter } from "components"
import { mobile } from "components/layout/Breakpoints"

const Stack = styled.div`
    width: 212px;
    height: 60px;
    display: flex;
    justify-content: space-between;
    place-items: center;

    @media (max-width: ${mobile}) {
        transform: scale(0.75);
    }

    /* 4-0-4 Optical alignment */
    & > :nth-child(2) {
        margin-left: 4px;
    }
`

export const Template404: React.FunctionComponent<{ isMotion?: boolean }> = ({ isMotion = false }) => (
    <Page showEdit={false}>
        <Grid className="four-o-four">
            <Center className="error-message">
                <MarkdownStyles>
                    <h2>Oops! Page not found.</h2>
                    <InlineButton href={isMotion ? "/api/motion/" : "/api/"} style={{ marginTop: 15 }}>
                        Back Home
                    </InlineButton>
                </MarkdownStyles>
            </Center>
            <Center className="error-graphic">
                <Stack>
                    <AnimationCharacter xmlns="http://www.w3.org/2000/svg" width="45" height="60">
                        <path d="M45 0v45H0z" fill="var(--animation-left)" />
                        <path d="M22.556 45h22.555v15H22.556z" fill="var(--animation-left)" opacity=".5" />
                    </AnimationCharacter>
                    <AnimationCharacter xmlns="http://www.w3.org/2000/svg" width="60" height="60">
                        <path
                            d="M30.074 0v60C13.465 60 0 46.569 0 30 0 13.431 13.465 0 30.074 0z"
                            fill="var(--animation-middle)"
                        />
                        <path
                            d="M30.074 0v60c16.61 0 30.074-13.431 30.074-30 0-16.569-13.464-30-30.074-30z"
                            fill="var(--animation-middle)"
                            opacity=".5"
                        />
                    </AnimationCharacter>
                    <AnimationCharacter xmlns="http://www.w3.org/2000/svg" width="45" height="60">
                        <path d="M45 0v45H0z" fill="var(--animation-right)" />
                        <path d="M22.556 45h22.555v15H22.556z" fill="var(--animation-right)" opacity=".5" />
                    </AnimationCharacter>
                </Stack>
            </Center>
        </Grid>
        <Codebar />
    </Page>
)
