import * as React from "react"
import { Kind, PropertyModel } from "../../model"
import { FramerAPIContext } from "../contexts/FramerAPIContext"
import { APIOverviewElement } from "./APIOverview"
import { MissingModelWarning } from "./MissingModelWarning"
import { ReleaseBadge } from "./ReleaseBadge"
import { DeprecatedNotice } from "./DeprecatedNotice"
import { Grid } from "components/layout/Grid"
import { Permalink } from "../layout/Permalink"
import { apiClassName, permalinkId } from "./helpers"
import { APIEntity, APIEntityExample } from "./types"

export const APIVariableElement: React.FunctionComponent<APIEntityExample<PropertyModel>> = props => {
    return (
        <Grid className={apiClassName("variable", props, React.Children.toArray(props.children))}>
            <h3>
                <Permalink id={permalinkId(props)} name={props.name} modelId={props.id} skipnav />
                <code className="language-typescript">{props.signature || "Unknown Name"}</code>{" "}
                <ReleaseBadge {...props} />
            </h3>
            <DeprecatedNotice {...props} />
            <APIOverviewElement {...props} />
            {props.children}
        </Grid>
    )
}

export const APIVariable: React.FunctionComponent<APIEntity<PropertyModel>> = props => {
    const api = React.useContext(FramerAPIContext)
    const model = api.resolve(props.name, Kind.Variable)
    if (!model) return <MissingModelWarning name={props.name} kind={Kind.Variable} />
    return (
        <APIVariableElement {...model} {...props.overrides}>
            {props.children}
        </APIVariableElement>
    )
}
