import * as React from "react"
import { Page } from "../components/Template"
import { FramerAPIDefaultProvider, FramerAPIContext } from "../components/contexts/FramerAPIContext"
import { AnyModel, Kind, FramerAPI } from "../model"
import { Grid } from "../components/layout/Grid"

export default function render() {
    const consumer: (api: FramerAPI) => React.ReactNode = api => api.rootModels().map(walk)
    return (
        /* Context.Provider needs to be at the top level (doesn't work in Template) */
        <FramerAPIDefaultProvider>
            <Page>
                <Grid>
                    <h1>FramerAPI: Index (debug)</h1>
                    <p>Entities missing documentation are tagged with an 🚨 emoji!</p>
                    <FramerAPIContext.Consumer>{api => <ul>{consumer(api)}</ul>}</FramerAPIContext.Consumer>
                </Grid>
            </Page>
        </FramerAPIDefaultProvider>
    )
}

function walk(model: AnyModel) {
    let children: (JSX.Element | null)[] = []
    switch (model.kind) {
        case Kind.Namespace:
            children = model.members.map(walk)
            break
        case Kind.Class:
        case Kind.Interface:
            if (model.constructor) children.push(walk(model.constructor))
            children = children.concat(model.methods.map(walk))
            children = children.concat(model.properties.map(walk))
            break
        case Kind.Enum:
            children = model.fields.map(walk)
            break
        case Kind.Parameter:
            return null
        default:
            break
    }
    const isDocumented = Boolean(model.summaryMarkup)

    return (
        <li key={model.id}>
            <p>
                {model.fullname} <span style={{ color: "grey" }}>({model.kind})</span>
                {isDocumented ? "" : " – 🚨"}
            </p>
            {children.length ? <ul>{children}</ul> : null}
        </li>
    )
}
