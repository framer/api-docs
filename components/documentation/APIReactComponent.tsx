import * as React from "react"
import { ClassModel, Kind } from "../../model"
import { FramerAPIContext } from "../contexts/FramerAPIContext"
import { APIMethodElement } from "./APIMethod"
import { APIOverviewElement } from "./APIOverview"
import { MissingModelWarning } from "./MissingModelWarning"
import { ReleaseBadge } from "./ReleaseBadge"
import { DeprecatedNotice } from "./DeprecatedNotice"
import { Grid } from "../layout/Grid"
import { Permalink } from "../layout/Permalink"
import { apiClassName, permalinkId } from "./helpers"
import { APIEntityExample, APIEntity } from "./types"

/**
 * Renders React specific documentation for the TypeScript class provided.
 *
 * Only renders the documentation specific to the class. Methods and properties should be provided as children.
 */
export const APIReactComponentElement: React.FunctionComponent<APIEntityExample<ClassModel>> = props => {
    const children = React.Children.toArray(props.children)
    const methods = children.filter(child => React.isValidElement(child) && child.type === APIMethodElement)

    const members = new Set(methods)
    const rest = children.filter(child => !members.has(child))

    return (
        <>
            <Grid className={"grid-section-h2 " + apiClassName("react-component", props, rest)}>
                <h2>
                    <Permalink id={permalinkId(props)} name={props.name + "()"} modelId={props.id} />
                    {props.name || "Unknown"} Component <ReleaseBadge {...props} />
                </h2>
                <DeprecatedNotice {...props} />
                <APIOverviewElement {...props} />
                {rest}
            </Grid>
            {methods}
        </>
    )
}

/**
 * Displays the documentation for a React component class.
 * @param props.name The name of the React component
 * @param props.overrides Optional object of properties in ClassModel to override
 */
export const APIReactComponent: React.FunctionComponent<APIEntity<ClassModel>> = props => {
    const { name, overrides, ...rest } = props
    const api = React.useContext(FramerAPIContext)

    const model = api.resolve(name, Kind.Class)
    if (!model) return <MissingModelWarning name={name} kind={Kind.Class} />

    const methods = model.methods.map(method => <APIMethodElement key={method.id} {...method} />)
    return (
        <APIReactComponentElement {...model} {...overrides} {...rest}>
            {props.children}
            {methods}
        </APIReactComponentElement>
    )
}
